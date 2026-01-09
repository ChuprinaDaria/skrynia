'use client';

import React from 'react';
import Image from 'next/image';

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
  const mainLogoPath = '/images/logo/logo-white-pink-1.png';
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
          src={mainLogoPath}
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
        src={mainLogoPath}
        alt="Alatyr Symbol"
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

export default AlatyrIcon;
