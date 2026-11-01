import React from 'react';

interface CinnamonLogoProps {
  className?: string;
  size?: number;
  variant?: 'app' | 'vector';
}

export const CinnamonLogo: React.FC<CinnamonLogoProps> = ({
  className = 'w-5 h-5',
  size = 20,
  variant = 'app',
}) => {
  if (variant === 'app') {
    return (
      <img
        src="/icon.png"
        alt="Cinnamon"
        width={size}
        height={size}
        className={`${className} rounded-[4.5px] shadow-xs object-cover shrink-0 select-none border border-black/5`}
      />
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="barkA" x1="6" y1="28" x2="26" y2="6" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#78350f" />
          <stop offset="40%" stopColor="#b44b10" />
          <stop offset="70%" stopColor="#c2410c" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        <linearGradient id="barkB" x1="10" y1="28" x2="22" y2="4" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7c2d12" />
          <stop offset="50%" stopColor="#9a3412" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="scrollInner" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        <linearGradient id="twine" x1="11" y1="18" x2="19" y2="15" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>

      {/* Quill 2 (Behind) */}
      <path
        d="M 13.5 28.5 L 20 7.5 C 20.3 6.5 22.2 6.5 22.8 7.5 L 16.5 29 C 15.8 29.5 14 29.2 13.5 28.5 Z"
        fill="url(#barkB)"
      />
      <ellipse
        cx="21.2"
        cy="7.2"
        rx="1.8"
        ry="1.3"
        transform="rotate(20 21.2 7.2)"
        fill="url(#scrollInner)"
        stroke="#78350f"
        strokeWidth="0.5"
      />
      <path
        d="M 20.4 7.2 C 20.6 6.6 21.8 6.5 22 7.1 C 22.1 7.6 21.4 7.8 21.1 7.5 C 20.9 7.3 21.2 7 21.4 7.1"
        stroke="#451a03"
        strokeWidth="0.4"
        fill="none"
        strokeLinecap="round"
      />

      {/* Quill 1 (Foreground) */}
      <path
        d="M 7.5 24.5 L 23.5 8.5 C 24.4 7.6 26.2 8.4 25.8 9.8 L 10.2 26.5 C 9.2 27.2 7.5 26 7.5 24.5 Z"
        fill="url(#barkA)"
      />
      <path d="M 8.8 24.8 L 24.2 9.2" stroke="#fed7aa" strokeWidth="0.6" strokeLinecap="round" opacity="0.65" />
      <path d="M 10.5 23.5 L 21 13" stroke="#7c2d12" strokeWidth="0.4" opacity="0.5" />

      {/* Scroll 1 Top */}
      <ellipse
        cx="24.6"
        cy="9.1"
        rx="2.2"
        ry="1.5"
        transform="rotate(45 24.6 9.1)"
        fill="url(#scrollInner)"
        stroke="#7c2d12"
        strokeWidth="0.6"
      />
      <path
        d="M 23.4 9.4 C 23.6 8.3 25.4 8.2 25.6 9.2 C 25.7 10 24.5 10.4 24.1 9.8 C 23.8 9.3 24.4 8.8 24.8 9"
        stroke="#451a03"
        strokeWidth="0.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Twine Wrap */}
      <path
        d="M 13.8 19.8 C 14.5 18 17.5 16.5 18.8 15.5"
        stroke="url(#twine)"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 14.2 20.8 C 15 19 18 17.5 19.2 16.5"
        stroke="#b45309"
        strokeWidth="0.5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="16" cy="18" r="1" fill="#fef3c7" stroke="#b45309" strokeWidth="0.5" />
      <path
        d="M 16 18.8 C 15.8 20.5 15.2 21.5 14.8 22"
        stroke="#d97706"
        strokeWidth="0.7"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
};