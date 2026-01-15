import React, { useId } from 'react';
import { Gift, HelpCircle, ShieldCheck, Truck } from 'lucide-react';

type ProductValuePropsProps = {
  giftWrapText: string;
  warrantyText: string;
  trackingText: string;
  handmadeTooltipLabel: string;
  handmadeTooltipText: string;
};

export default function ProductValueProps({
  giftWrapText,
  warrantyText,
  trackingText,
  handmadeTooltipLabel,
  handmadeTooltipText,
}: ProductValuePropsProps) {
  const tooltipId = useId();

  return (
    <ul className="space-y-2 text-xs md:text-sm font-inter text-sage" aria-label="Переваги покупки">
      <li className="rounded-sm border border-dashed border-[#666] px-3 py-2">
        <div className="flex items-start gap-2.5">
          <Gift className="mt-0.5 h-4 w-4 flex-none text-sage" aria-hidden="true" />
          <span className="leading-snug">{giftWrapText}</span>
        </div>
      </li>

      <li className="flex items-start gap-2.5">
        <ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-sage" aria-hidden="true" />
        <div className="min-w-0">
          <span className="leading-snug">{warrantyText}</span>
          <span className="relative ml-1 inline-block align-baseline">
            <button
              type="button"
              className="peer inline-flex items-center text-sage transition-colors hover:text-[#D4AF37] focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood focus-visible:ring-offset-2 focus-visible:ring-offset-deep-black"
              aria-label={handmadeTooltipLabel}
              aria-describedby={tooltipId}
            >
              <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <span
              id={tooltipId}
              role="tooltip"
              className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-72 -translate-x-1/2 rounded-sm border border-sage/30 bg-footer-black px-3 py-2 text-xs text-ivory opacity-0 shadow-lg transition-opacity duration-150 peer-hover:opacity-100 peer-focus-visible:opacity-100"
            >
              {handmadeTooltipText}
            </span>
          </span>
        </div>
      </li>

      <li className="flex items-start gap-2.5">
        <Truck className="mt-0.5 h-4 w-4 flex-none text-sage" aria-hidden="true" />
        <span className="leading-snug">{trackingText}</span>
      </li>
    </ul>
  );
}


