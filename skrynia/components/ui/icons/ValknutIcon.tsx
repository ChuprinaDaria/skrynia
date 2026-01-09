'use client';

import React from 'react';
import Image from 'next/image';

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
  const glowSize = Math.round(size * 1.2);
  
  return (
    <div
      className={`relative inline-block ${className}`}
      style={{
        width: size,
        height: size,
      }}
    >
      {/* Біла підсвітка ззаду */}
      <div
        className="absolute inset-0"
        style={{
          width: glowSize,
          height: glowSize,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          filter: 'blur(20px)',
          opacity: 0.6,
          zIndex: 0,
        }}
      >
        <Image
          src="/images/logo/logo-white-pink.png"
          alt=""
          width={glowSize}
          height={glowSize}
          className="object-contain"
          style={{
            filter: 'brightness(0) invert(1)',
          }}
          aria-hidden="true"
        />
      </div>
      
      {/* Основний логотип */}
      <Image
        src="/images/logo/logo-white-pink.png"
        alt="Valknut Symbol"
        width={size}
        height={size}
        className="object-contain animate-color-shift relative"
        style={{
          filter: 'drop-shadow(0 0 10px rgba(102, 0, 0, 0.6))',
          zIndex: 1,
        }}
        priority
      />
    </div>
  );
};

export default ValknutIcon;
