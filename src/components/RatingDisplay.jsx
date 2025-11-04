import React from 'react';
import { Star } from 'lucide-react';

const RatingDisplay = ({ rate = 0, count = 0, size = 'md', showCount = true }) => {
  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4';
      case 'lg':
        return 'w-6 h-6';
      default:
        return 'w-5 h-5';
    }
  };

  const getTextSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'text-xs';
      case 'lg':
        return 'text-lg';
      default:
        return 'text-sm';
    }
  };

  const roundedRate = Math.round(rate * 2) / 2; // Round to nearest 0.5
  const filledStars = Math.floor(roundedRate);
  const hasHalfStar = roundedRate % 1 !== 0;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => {
          const isFilled = i < filledStars;
          const isHalf = i === filledStars && hasHalfStar;

          return (
            <div key={i} className="relative">
              <Star className={`${getSizeClass()} text-slate-300`} />
              {(isFilled || isHalf) && (
                <div
                  className={`absolute top-0 left-0 overflow-hidden ${getSizeClass()}`}
                  style={{
                    width: isFilled ? '100%' : '50%',
                  }}
                >
                  <Star className={`${getSizeClass()} fill-amber-400 text-amber-400`} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-1">
        <span className={`font-semibold text-slate-900 ${getTextSizeClass()}`}>
          {rate.toFixed(1)}
        </span>
        {showCount && (
          <span className={`text-slate-600 ${getTextSizeClass()}`}>
            ({count})
          </span>
        )}
      </div>
    </div>
  );
};

export default RatingDisplay;
