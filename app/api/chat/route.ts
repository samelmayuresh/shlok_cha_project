import { OpenAI } from 'openai';
import { z } from 'zod';

// Input validation schema
const ChatRequestSchema = z.object({
    messages: z.array(z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().min(1).max(4000),
    })).min(1).max(50),
    enableSearch: z.boolean().optional(),
});

// Rate limiting headers
const RATE_LIMIT_HEADERS = {
    'X-RateLimit-Limit': '20',
    'X-RateLimit-Remaining': '19',
    'X-RateLimit-Reset': String(Date.now() + 60000),
};

const client = new OpenAI({
    baseURL: process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1',
    apiKey: process.env.NVIDIA_API_KEY || '',
});

// Web search using DuckDuckGo (free, no API key)
async function searchWeb(query: string): Promise<string> {
    try {
        const searchQuery = encodeURIComponent(query);
        const ddgUrl = `https://api.duckduckgo.com/?q=${searchQuery}&format=json&no_html=1&skip_disambig=1`;

        const response = await fetch(ddgUrl, {
            headers: { 'User-Agent': 'DietPlanApp/1.0' },
        });

        if (!response.ok) return '';

        const data = await response.json();
        const snippets: string[] = [];

        if (data.AbstractText) snippets.push(data.AbstractText);
        if (data.Answer) snippets.push(data.Answer);
        if (data.RelatedTopics) {
            for (const topic of data.RelatedTopics.slice(0, 3)) {
                if (topic.Text) snippets.push(topic.Text);
            }
        }

        return snippets.join('\n').slice(0, 1500);
    } catch {
        return '';
    }
}

// Extract nutrition topics from messages
function extractSearchQuery(messages: Array<{ role: string; content: string }>): string | null {
    const lastUserMsg = messages.filter(m => m.role === 'user').pop()?.content || '';
    const lowerMsg = lastUserMsg.toLowerCase();

    // Check for topics that benefit from search
    const searchTopics = [
        'diet', 'nutrition', 'calories', 'protein', 'vitamins',
        'weight loss', 'weight gain', 'muscle', 'diabetes', 'pcos',
        'thyroid', 'fever', 'skin', 'acne', 'glowing', 'hair',
        'food', 'recipe', 'meal', 'breakfast', 'lunch', 'dinner'
    ];

    const hasSearchTopic = searchTopics.some(topic => lowerMsg.includes(topic));

    if (hasSearchTopic && lastUserMsg.length > 10) {
        return `${lastUserMsg} nutrition benefits foods`;
    }

    return null;
}

export async function POST(req: Request) {
    try {
        // Parse and validate input
        const body = await req.json();
        const validationResult = ChatRequestSchema.safeParse(body);

        if (!validationResult.success) {
            return new Response(
                JSON.stringify({
                    error: 'Invalid request format',
                    details: validationResult.error.flatten(),
                }),
                {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        ...RATE_LIMIT_HEADERS,
                    },
                }
            );
        }

        const { messages, enableSearch = true } = validationResult.data;

        // Perform web search if enabled
        let searchContext = '';
        if (enableSearch) {
            const searchQuery = extractSearchQuery(messages);
            if (searchQuery) {
                const searchResult = await searchWeb(searchQuery);
                if (searchResult) {
                    searchContext = `\n\nRELEVANT WEB INFORMATION (use this to enhance your response):\n${searchResult}`;
                }
            }
        }

        const systemMessage = {
            role: 'system' as const,
            content: `You are a professional nutritionist. Create PERSONALIZED diet plans.

RULES:
1. When user asks for a diet plan, FIRST ask 4-6 personalization questions
2. Format your questions as a numbered list
3. Questions should be relevant to the request type:
   - Weight plans: age, gender, weight, activity level, diet preference, allergies
   - Medical plans: age, symptoms, medications, diet preference
   - Skin plans: age, skin type, water intake, diet preference
4. After user provides answers, create a detailed personalized plan
5. Keep responses concise for mobile users
6. If web information is provided, use it to enhance nutritional accuracy${searchContext}`,
        };

        // Use Llama 3.1 70B Instruct - powerful and fast
        const response = await client.chat.completions.create({
            model: 'meta/llama-3.1-70b-instruct',
            messages: [systemMessage, ...messages],
            temperature: 0.7,
            top_p: 0.9,
            max_tokens: 1500,
            stream: true,
        });

        // Create a readable stream
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of response) {
                        if (!chunk.choices?.length) continue;

                        const delta = chunk.choices[0]?.delta;
                        const content = delta?.content;

                        if (content) {
                            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                        }
                    }
                    controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                    controller.close();
                } catch (error) {
                    console.error('Stream error:', error);
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: '⚠️ Error generating response. Please try again.' })}\n\n`));
                    controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                    controller.close();
                }
            },
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Connection': 'keep-alive',
                'X-Content-Type-Options': 'nosniff',
                ...RATE_LIMIT_HEADERS,
            },
        });
    } catch (error: unknown) {
        console.error('Chat API Error:', error);

        const errorMessage = error instanceof Error ? error.message : 'Failed to generate response';
        const statusCode = error instanceof z.ZodError ? 400 : 500;

        return new Response(
            JSON.stringify({
                error: errorMessage,
                code: statusCode === 400 ? 'VALIDATION_ERROR' : 'INTERNAL_ERROR',
                timestamp: new Date().toISOString(),
            }),
            {
                status: statusCode,
                headers: {
                    'Content-Type': 'application/json',
                    ...RATE_LIMIT_HEADERS,
                },
            }
        );
    }
}

// Health check endpoint
export async function GET() {
    return new Response(
        JSON.stringify({
            status: 'healthy',
            service: 'chat-api',
            model: 'meta/llama-3.1-70b-instruct',
            features: ['web-search-enabled'],
            timestamp: new Date().toISOString(),
        }),
        {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        }
    );
}
