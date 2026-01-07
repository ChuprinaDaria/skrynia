import React from 'react';

interface TriquetraIconProps {
  className?: string;
  size?: number;
  variant?: 'oxblood' | 'ivory' | 'sage';
}

const TriquetraIcon: React.FC<TriquetraIconProps> = ({
  className = '',
  size = 150,
  variant = 'oxblood'
}) => {
  const colors = {
    oxblood: '#660000',
    ivory: '#FFFFF0',
    sage: '#7A8B8B',
  };

  const color = colors[variant];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Triquetra Symbol"
    >
      {/* Celtic Trinity Knot */}
      <path
        d="M 100 30 C 70 30 50 50 50 80 C 50 95 60 110 75 115 C 60 120 50 135 50 150 C 50 170 70 190 100 190 C 130 190 150 170 150 150 C 150 135 140 120 125 115 C 140 110 150 95 150 80 C 150 50 130 30 100 30 Z"
        stroke={color}
        strokeWidth="4"
        fill="none"
      />

      {/* Interlocking pattern */}
      <circle cx="100" cy="70" r="25" stroke={color} strokeWidth="3" fill="none" />
      <circle cx="75" cy="120" r="25" stroke={color} strokeWidth="3" fill="none" />
      <circle cx="125" cy="120" r="25" stroke={color} strokeWidth="3" fill="none" />

      {/* Center triangle */}
      <path
        d="M 100 95 L 85 115 L 115 115 Z"
        fill={color}
        opacity="0.6"
      />

      {/* Outer circle */}
      <circle
        cx="100"
        cy="100"
        r="85"
        stroke={color}
        strokeWidth="2"
        fill="none"
        opacity="0.4"
      />
    </svg>
  );
};

export default TriquetraIcon;
