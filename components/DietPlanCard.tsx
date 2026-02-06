'use client';

interface DietPlanProps {
    content: string;
    compact?: boolean;
}

// Parse diet plan text into structured sections
function parseDietPlan(content: string) {
    const sections: { title: string; items: string[]; icon: string }[] = [];
    const lines = content.split('\n').filter(l => l.trim());

    let currentSection = { title: '', items: [] as string[], icon: '📋' };

    const sectionIcons: Record<string, string> = {
        'breakfast': '🌅',
        'morning': '🌅',
        'lunch': '🍽️',
        'afternoon': '☀️',
        'dinner': '🌙',
        'evening': '🌙',
        'snack': '🍎',
        'hydration': '💧',
        'water': '💧',
        'avoid': '🚫',
        'tips': '💡',
        'note': '📝',
        'exercise': '🏃',
        'workout': '💪',
        'supplements': '💊',
    };

    for (const line of lines) {
        const lowerLine = line.toLowerCase();

        // Check if this is a section header
        const isHeader = (
            line.includes('**') ||
            line.startsWith('#') ||
            line.endsWith(':') ||
            /^(breakfast|lunch|dinner|snack|morning|afternoon|evening|hydration|tips|avoid|exercise)/i.test(lowerLine)
        );

        if (isHeader) {
            if (currentSection.title && currentSection.items.length > 0) {
                sections.push({ ...currentSection });
            }

            const cleanTitle = line.replace(/[#*:]/g, '').trim();
            let icon = '📋';

            for (const [key, emoji] of Object.entries(sectionIcons)) {
                if (lowerLine.includes(key)) {
                    icon = emoji;
                    break;
                }
            }

            currentSection = { title: cleanTitle, items: [], icon };
        } else if (line.trim().startsWith('-') || line.trim().startsWith('•') || line.trim().match(/^\d+\./)) {
            const cleanItem = line.replace(/^[-•\d.]+\s*/, '').trim();
            if (cleanItem) currentSection.items.push(cleanItem);
        } else if (line.trim() && currentSection.title) {
            currentSection.items.push(line.trim());
        }
    }

    if (currentSection.title && currentSection.items.length > 0) {
        sections.push({ ...currentSection });
    }

    return sections;
}

export default function DietPlanCard({ content, compact = false }: DietPlanProps) {
    const sections = parseDietPlan(content);

    if (sections.length === 0) {
        // If can't parse, show as formatted text
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-retro-primary p-4">
                <p className="whitespace-pre-wrap text-sm">{content}</p>
            </div>
        );
    }

    return (
        <div className={`space-y-3 ${compact ? '' : 'p-2'}`}>
            {sections.map((section, idx) => (
                <div
                    key={idx}
                    className="bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm"
                >
                    {/* Section Header */}
                    <div className="bg-gradient-to-r from-retro-primary to-retro-secondary px-4 py-2 flex items-center gap-2">
                        <span className="text-xl">{section.icon}</span>
                        <h3 className="text-white font-bold text-sm uppercase tracking-wide">
                            {section.title}
                        </h3>
                    </div>

                    {/* Section Items */}
                    <div className="p-3 space-y-2">
                        {section.items.map((item, itemIdx) => (
                            <div
                                key={itemIdx}
                                className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                            >
                                <span className="text-retro-accent mt-0.5">▸</span>
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

// Simpler inline version for chat messages - styled for dark chat background
export function DietPlanInline({ content }: { content: string }) {
    const sections = parseDietPlan(content);

    if (sections.length === 0) {
        return <p className="whitespace-pre-wrap text-sm">{content}</p>;
    }

    return (
        <div className="space-y-3 mt-2">
            {sections.map((section, idx) => (
                <div key={idx} className="bg-gray-900 rounded-lg p-3 border-2 border-green-400">
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-green-400/50">
                        <span className="text-xl">{section.icon}</span>
                        <span className="text-green-300 font-bold text-sm uppercase tracking-wide">{section.title}</span>
                    </div>
                    <div className="space-y-1.5">
                        {section.items.slice(0, 6).map((item, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm">
                                <span className="text-green-400 mt-0.5">▸</span>
                                <span className="text-white">{item}</span>
                            </div>
                        ))}
                        {section.items.length > 6 && (
                            <div className="text-green-500/70 pl-5 text-xs italic">+{section.items.length - 6} more items</div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
