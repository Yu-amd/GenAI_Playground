import React from 'react';
import { Link } from 'react-router-dom';

interface PlaygroundLogoProps {
  className?: string;
  showText?: boolean;
}

const PlaygroundLogo: React.FC<PlaygroundLogoProps> = ({ className = '', showText = true }) => {
  return (
    <Link to="/" className={`flex items-center gap-3 group text-white hover:text-gray-300 transition-colors duration-300 ${className}`}>
      {/* Logo Icon */}
      <div className="relative">
        <svg
          width="36"
          height="36"
          viewBox="0 0 40 40"
        >
          <rect
            x="3"
            y="3"
            width="34"
            height="34"
            rx="7"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            d="M13 14l7 6-7 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M21 26h6"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col leading-tight">
          <span className="font-semibold text-lg">
            GenAI
          </span>
          <span className="font-semibold text-lg">
            Playground
          </span>
        </div>
      )}
    </Link>
  );
};

export default PlaygroundLogo; 