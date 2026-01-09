import React from 'react';

interface ValknutIconProps {
  className?: string;
  size?: number;
  variant?: 'oxblood' | 'ivory' | 'sage';
}

const ValknutIcon: React.FC<ValknutIconProps> = ({
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
      aria-label="Valknut Symbol"
    >
      {/* Three interlocked triangles forming Valknut */}
      <path
        d="M 100 40 L 140 120 L 60 120 Z"
        stroke={color}
        strokeWidth="4"
        fill="none"
        strokeLinejoin="miter"
      />
      <path
        d="M 70 80 L 130 80 L 100 140 Z"
        stroke={color}
        strokeWidth="4"
        fill="none"
        strokeLinejoin="miter"
      />
      <path
        d="M 85 60 L 115 60 L 100 100 Z"
        stroke={color}
        strokeWidth="4"
        fill={color}
        fillOpacity="0.3"
        strokeLinejoin="miter"
      />

      {/* Outer decorative circle */}
      <circle
        cx="100"
        cy="100"
        r="90"
        stroke={color}
        strokeWidth="2"
        fill="none"
        opacity="0.5"
      />
    </svg>
  );
};

export default ValknutIcon;
