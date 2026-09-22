import React, { useState, useEffect } from "react";
import { Megaphone, ExternalLink } from "lucide-react";
import { Image } from "@/components/ui/image";

export default function PromotionBanner({ promotions }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!promotions.length) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % promotions.length), 5000);
    return () => clearInterval(t);
  }, [promotions.length]);

  if (!promotions.length) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white p-6 md:p-8">
        <span className="absolute top-3 right-3 text-[10px] uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">Ad</span>
        <Megaphone className="h-6 w-6 opacity-80" />
        <h3 className="mt-2 text-xl font-bold">Promote your brand on CampusMarket</h3>
        <p className="text-white/85 text-sm mt-1 max-w-md">
          Reach thousands of university students directly. Add a promotion to feature your brand in this space.
        </p>
      </div>
    );
  }

  const promo = promotions[idx % promotions.length];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white">
      {promo.image_url && (
        <div className="absolute inset-0 opacity-20">
          <Image src={promo.image_url} alt="" className="h-full w-full object-cover" fittingType="fill" />
        </div>
      )}
      <div className="relative p-6 md:p-8">
        <span className="absolute top-3 right-3 text-[10px] uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">Sponsored</span>
        <h3 className="text-xl md:text-2xl font-bold">{promo.title}</h3>
        {promo.description && <p className="text-white/85 text-sm mt-1 max-w-lg">{promo.description}</p>}
        <div className="mt-3 flex items-center gap-2 text-sm">
          <span className="bg-white/20 px-2 py-1 rounded">by {promo.sponsor}</span>
          {promo.link_url && (
            <a href={promo.link_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline">
              Learn more <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
      {promotions.length > 1 && (
        <div className="relative flex gap-1 px-6 pb-3">
          {promotions.map((_, i) => (
            <span key={i} className={`h-1.5 rounded-full transition-all ${i === idx ? "w-6 bg-white" : "w-1.5 bg-white/40"}`} />
          ))}
        </div>
      )}
    </div>
  );
}