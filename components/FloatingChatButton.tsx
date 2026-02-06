'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  .chatBtn {
    width: 55px;
    height: 55px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: 3px solid #000;
    background-color: #FF004D;
    cursor: pointer;
    padding-top: 3px;
    box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.8);
    position: relative;
    transition-duration: 0.3s;
  }

  .tooltip {
    position: absolute;
    top: -40px;
    opacity: 0;
    background-color: #FF004D;
    color: white;
    padding: 5px 10px;
    border-radius: 0;
    border: 2px solid #000;
    display: flex;
    align-items: center;
    justify-content: center;
    transition-duration: .3s;
    pointer-events: none;
    letter-spacing: 0.5px;
    font-family: monospace;
    font-weight: bold;
    font-size: 12px;
    text-transform: uppercase;
  }

  .chatBtn:hover .tooltip {
    opacity: 1;
    transition-duration: .3s;
  }

  .chatBtn:hover {
    transition-duration: 0.3s;
    transform: translateY(-2px);
    box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.8);
  }

  .chatBtn:active {
    transform: translateY(2px);
    box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.8);
  }
`;

export default function FloatingChatButton() {
  const pathname = usePathname();

  // Hide on chat page itself
  if (pathname === '/chat') return null;

  return (
    <div className="fixed right-4 bottom-24 z-50">
      <StyledWrapper>
        <Link href="/chat" aria-label="Chat with AI nutritionist">
          <button className="chatBtn" type="button">
            <svg height="1.6em" fill="white" xmlSpace="preserve" viewBox="0 0 1000 1000" y="0px" x="0px" version="1.1">
              <path d="M881.1,720.5H434.7L173.3,941V720.5h-54.4C58.8,720.5,10,671.1,10,610.2v-441C10,108.4,58.8,59,118.9,59h762.2C941.2,59,990,108.4,990,169.3v441C990,671.1,941.2,720.5,881.1,720.5L881.1,720.5z M935.6,169.3c0-30.4-24.4-55.2-54.5-55.2H118.9c-30.1,0-54.5,24.7-54.5,55.2v441c0,30.4,24.4,55.1,54.5,55.1h54.4h54.4v110.3l163.3-110.2H500h381.1c30.1,0,54.5-24.7,54.5-55.1V169.3L935.6,169.3z M717.8,444.8c-30.1,0-54.4-24.7-54.4-55.1c0-30.4,24.3-55.2,54.4-55.2c30.1,0,54.5,24.7,54.5,55.2C772.2,420.2,747.8,444.8,717.8,444.8L717.8,444.8z M500,444.8c-30.1,0-54.4-24.7-54.4-55.1c0-30.4,24.3-55.2,54.4-55.2c30.1,0,54.4,24.7,54.4,55.2C554.4,420.2,530.1,444.8,500,444.8L500,444.8z M282.2,444.8c-30.1,0-54.5-24.7-54.5-55.1c0-30.4,24.4-55.2,54.5-55.2c30.1,0,54.4,24.7,54.4,55.2C336.7,420.2,312.3,444.8,282.2,444.8L282.2,444.8z" />
            </svg>
            <span className="tooltip">AI CHAT</span>
          </button>
        </Link>
      </StyledWrapper>
    </div>
  );
}
