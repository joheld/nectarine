import React from 'react';

interface NectarineLogoProps {
  className?: string;
  size?: number;
  variant?: 'app' | 'vector';
}

export const NectarineLogo: React.FC<NectarineLogoProps> = ({
  className = 'w-6 h-6',
  size = 24,
  variant = 'app',
}) => {
  if (variant === 'app') {
    return (
      <img
        src="/icon.png"
        alt="Nectarine"
        width={size}
        height={size}
        className={`${className} rounded-[5px] shadow-xs object-cover shrink-0 select-none border border-black/5`}
      />
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <radialGradient id="nectarineSkin" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="25%" stopColor="#fb923c" />
          <stop offset="65%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="#be123c" />
        </radialGradient>
        <linearGradient id="nectarineGloss" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="nectarineLeaf" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#15803d" />
          <stop offset="50%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#86efac" />
        </linearGradient>
        <filter id="nectarineShadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="1.2" stdDeviation="1.2" floodColor="#881337" floodOpacity="0.22" />
        </filter>
      </defs>

      <g filter="url(#nectarineShadow)">
        <path
          d="M 18 8.5 C 15.5 8.5 10 9.5 7.5 14 C 4.5 19.5 5 26.5 10 30 C 13.5 32.5 16.5 31.8 18 31.2 C 19.5 31.8 22.5 32.5 26 30 C 31 26.5 31.5 19.5 28.5 14 C 26 9.5 20.5 8.5 18 8.5 Z"
          fill="url(#nectarineSkin)"
        />
        <path
          d="M 18 9 C 17.2 13 16.8 19 17.5 25 C 17.8 28 18 30.5 18 31"
          stroke="#9f1239"
          strokeWidth="0.75"
          strokeLinecap="round"
          opacity="0.4"
          fill="none"
        />
        <path
          d="M 11 13 C 14 10.5 17 11 17 11 C 17 11 13 14 11 19 C 10 16 10.5 14 11 13 Z"
          fill="url(#nectarineGloss)"
        />
        <path
          d="M 18 9 C 18 7.5 18.5 5.5 20 4.5"
          stroke="#78350f"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 19 7 C 22 5 27 5.5 29 8 C 29 11 25 12 21 9.5 Z"
          fill="url(#nectarineLeaf)"
        />
        <path
          d="M 20 7.5 C 23 7 26 8 28 8.5"
          stroke="#15803d"
          strokeWidth="0.5"
          strokeLinecap="round"
          opacity="0.7"
          fill="none"
        />
      </g>
    </svg>
  );
};