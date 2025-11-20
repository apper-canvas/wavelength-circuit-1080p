import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Slider = forwardRef(({ 
  className,
  value = 0,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  ...props 
}, ref) => {
  const percentage = ((value - min) / (max - min)) * 100;

  const handleChange = (e) => {
    const newValue = parseFloat(e.target.value);
    onChange?.(newValue);
  };

  return (
    <div className={cn("relative w-full", className)}>
      <input
        ref={ref}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
        style={{
          background: `linear-gradient(to right, #7C3AED 0%, #EC4899 ${percentage}%, #4B5563 ${percentage}%, #4B5563 100%)`
        }}
        {...props}
      />
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: linear-gradient(135deg, #7C3AED, #EC4899);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(124, 58, 237, 0.3);
          transition: transform 0.2s;
        }
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.5);
        }
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: linear-gradient(135deg, #7C3AED, #EC4899);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(124, 58, 237, 0.3);
        }
      `}</style>
    </div>
  );
});

Slider.displayName = "Slider";

export default Slider;