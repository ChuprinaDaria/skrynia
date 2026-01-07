import React from 'react';

interface AlatyrIconProps {
  className?: string;
  size?: number;
  variant?: 'oxblood' | 'ivory' | 'sage';
}

const AlatyrIcon: React.FC<AlatyrIconProps> = ({
  className = '',
  size = 100,
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
      aria-label="Alatyr Symbol"
    >
      {/* Outer Circle */}
      <circle
        cx="100"
        cy="100"
        r="95"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />

      {/* Inner Star Pattern - 8-pointed star (Alatyr) */}
      <path
        d="M 100 20 L 115 75 L 170 60 L 125 85 L 150 135 L 100 110 L 50 135 L 75 85 L 30 60 L 85 75 Z"
        fill={color}
        opacity="0.9"
      />

      {/* Center Circle */}
      <circle
        cx="100"
        cy="100"
        r="25"
        fill={color}
        opacity="0.8"
      />

      {/* Inner Cross */}
      <path
        d="M 100 80 L 100 120 M 80 100 L 120 100"
        stroke={variant === 'ivory' ? '#0B0C10' : '#FFFFF0'}
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Decorative outer points */}
      <circle cx="100" cy="10" r="4" fill={color} />
      <circle cx="100" cy="190" r="4" fill={color} />
      <circle cx="10" cy="100" r="4" fill={color} />
      <circle cx="190" cy="100" r="4" fill={color} />
      <circle cx="35" cy="35" r="4" fill={color} />
      <circle cx="165" cy="35" r="4" fill={color} />
      <circle cx="35" cy="165" r="4" fill={color} />
      <circle cx="165" cy="165" r="4" fill={color} />
    </svg>
  );
};

export default AlatyrIcon;
