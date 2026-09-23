import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showTagline?: boolean;
  monochrome?: boolean;
}

export const ShopGenieLogo: React.FC<LogoProps> = ({
  className = '',
  size = 36,
  showTagline = false,
  monochrome = false
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Original Vector Bag + Lamp Flame/Spark Logo */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200 hover:scale-105"
      >
        <defs>
          <linearGradient id="genieBagGrad" x1="8" y1="18" x2="56" y2="60" gradientUnits="userSpaceOnUse">
            <stop stopColor={monochrome ? 'currentColor' : '#0F766E'} />
            <stop offset="1" stopColor={monochrome ? 'currentColor' : '#064E3B'} />
          </linearGradient>
          <linearGradient id="genieSparkGrad" x1="32" y1="4" x2="32" y2="28" gradientUnits="userSpaceOnUse">
            <stop stopColor={monochrome ? 'currentColor' : '#FBBF24'} />
            <stop offset="1" stopColor={monochrome ? 'currentColor' : '#F59E0B'} />
          </linearGradient>
          <radialGradient id="genieGlow" cx="50%" cy="50%" r="50%">
            <stop stopColor="#F59E0B" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Glow ambient */}
        {!monochrome && <circle cx="32" cy="18" r="16" fill="url(#genieGlow)" />}

        {/* Shopping Bag Body with modern rounded bevel */}
        <rect
          x="12"
          y="22"
          width="40"
          height="36"
          rx="10"
          fill="url(#genieBagGrad)"
        />

        {/* Bag subtle fold line */}
        <path
          d="M12 28C18 31 46 31 52 28"
          stroke={monochrome ? 'rgba(255,255,255,0.4)' : '#5EEAD4'}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeOpacity="0.6"
        />

        {/* The Lamp Spark / Handle Loop */}
        <path
          d="M24 22V16C24 11.5817 27.5817 8 32 8C36.4183 8 40 11.5817 40 16V22"
          stroke="url(#genieSparkGrad)"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* The Spark / Flame Lamp Motif at the peak */}
        <path
          d="M32 4C30.5 8 28.5 10 28.5 12C28.5 13.933 30.067 15.5 32 15.5C33.933 15.5 35.5 13.933 35.5 12C35.5 10 33.5 8 32 4Z"
          fill="url(#genieSparkGrad)"
        />

        {/* Sparkle micro accent */}
        <circle cx="44" cy="12" r="2" fill={monochrome ? 'currentColor' : '#FBBF24'} />
        <circle cx="20" cy="14" r="1.5" fill={monochrome ? 'currentColor' : '#FBBF24'} />

        {/* Pocket / Genie Smile Curve on Bag */}
        <path
          d="M24 40C28 44 36 44 40 40"
          stroke="#5EEAD4"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>

      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1.5 leading-none">
          <span className="font-heading font-extrabold tracking-tight text-xl text-[#0F766E] dark:text-[#5EEAD4]">
            Shop<span className="text-[#F59E0B] dark:text-[#FBBF24]">Genie</span>
          </span>
        </div>
        {showTagline && (
          <span className="text-[11px] font-medium text-[#5B6B67] dark:text-[#9DB0AB] tracking-tight mt-0.5">
            Your neighbourhood, granted.
          </span>
        )}
      </div>
    </div>
  );
};
