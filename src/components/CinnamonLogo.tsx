import React from 'react';

interface CinnamonLogoProps {
  className?: string;
  size?: number;
}

export const CinnamonLogo: React.FC<CinnamonLogoProps> = ({ className = 'w-6 h-6', size = 24 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background Pill Glow */}
      <circle cx="24" cy="24" r="21" fill="#fff7ed" stroke="#fdba74" strokeWidth="1.2" />

      {/* Cinnamon Stick 1 (Diagonal Left to Right) */}
      <path d="M 13 36 L 31 15 L 35 18 L 17 39 Z" fill="#9a3412" stroke="#7c2d12" strokeWidth="0.8" />
      <path d="M 15 35 L 32 16 L 33 17 L 16 36 Z" fill="#ea580c" />
      {/* Scroll 1 */}
      <ellipse cx="33" cy="16.5" rx="2.5" ry="3" fill="#f97316" stroke="#7c2d12" strokeWidth="0.8" />
      <path d="M 32 15.5 C 33.5 15, 34 16.5, 33 17.5" stroke="#431407" strokeWidth="0.8" fill="none" />

      {/* Cinnamon Stick 2 (Crossing) */}
      <path d="M 19 38 L 26 12 L 30 13 L 23 39 Z" fill="#b45309" stroke="#78350f" strokeWidth="0.8" />
      <path d="M 20.5 37 L 27 13 L 28 13.5 L 21.5 37.5 Z" fill="#f59e0b" />
      {/* Scroll 2 */}
      <ellipse cx="28" cy="12.5" rx="2.2" ry="2.6" fill="#fbbf24" stroke="#78350f" strokeWidth="0.8" />
      <path d="M 27.2 11.8 C 28.5 11.5, 29 12.8, 28 13.5" stroke="#451a03" strokeWidth="0.8" fill="none" />

      {/* Raffia Ribbon */}
      <path d="M 18 25 L 28 27.5 L 27.5 29 L 17.5 26.5 Z" fill="#fed7aa" stroke="#c2410c" strokeWidth="0.6" />
      <circle cx="23" cy="27" r="1.6" fill="#ffedd5" stroke="#c2410c" strokeWidth="0.6" />

      {/* Green Aromatic Leaf */}
      <path d="M 14 27 C 10 24, 9 20, 13 19 C 17 19, 17 23, 15 26 Z" fill="#16a34a" stroke="#15803d" strokeWidth="0.6" />
      <path d="M 11 20.5 L 15 25" stroke="#86efac" strokeWidth="0.5" fill="none" />
    </svg>
  );
};
