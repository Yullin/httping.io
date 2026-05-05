"use client";

import { useEffect, useRef } from "react";

interface AdBannerProps {
  slot: "leaderboard" | "rectangle" | "footer";
  className?: string;
}

const adConfig = {
  leaderboard: {
    width: 728,
    height: 90,
    label: "Sponsored",
    responsive: true,
    envSlotKey: "NEXT_PUBLIC_AD_SLOT_LEADERBOARD",
  },
  rectangle: {
    width: 300,
    height: 250,
    label: "Sponsored",
    responsive: false,
    envSlotKey: "NEXT_PUBLIC_AD_SLOT_RECTANGLE",
  },
  footer: {
    width: 728,
    height: 60,
    label: "Sponsored",
    responsive: true,
    envSlotKey: "NEXT_PUBLIC_AD_SLOT_FOOTER",
  },
};

export default function AdBanner({ slot, className = "" }: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const config = adConfig[slot];

  // Get slot ID from environment variable
  const slotId = process.env[config.envSlotKey];
  const pubId = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID;

  useEffect(() => {
    // Skip if not configured
    if (!pubId || pubId === "YOUR_PUBLISHER_ID") {
      return;
    }

    try {
      // @ts-expect-error - adsbygoogle is loaded via script
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense push failed:", err);
    }
  }, [pubId]);

  // If not configured, show placeholder in development
  if (!pubId || pubId === "YOUR_PUBLISHER_ID" || !slotId) {
    if (process.env.NODE_ENV === "development") {
      return (
        <div
          data-slot={slot}
          className={`ad-container ${className}`}
          style={{
            width: "100%",
            maxWidth: config.responsive ? "100%" : `${config.width}px`,
            minHeight: `${config.height}px`,
            maxHeight: `${config.height}px`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px dashed rgba(255,255,255,0.2)",
            borderRadius: "12px",
            backgroundColor: "rgba(255,255,255,0.02)",
            color: "rgba(255,255,255,0.3)",
            fontSize: "12px",
          }}
        >
          <span>Ad Placeholder: {slot} ({config.width}×{config.height})</span>
        </div>
      );
    }
    return null; // Don't render anything if not configured
  }

  return (
    <div
      ref={adRef}
      data-slot={slot}
      className={`ad-container ${className}`}
      style={{
        width: "100%",
        maxWidth: config.responsive ? "100%" : `${config.width}px`,
        minHeight: `${config.height}px`,
        maxHeight: `${config.height}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: "12px",
        backgroundColor: "rgba(255,255,255,0.02)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Ad label - required for transparency */}
      <span
        style={{
          position: "absolute",
          top: "4px",
          right: "8px",
          fontSize: "10px",
          color: "rgba(255,255,255,0.4)",
          letterSpacing: "0.5px",
          textTransform: "uppercase",
          zIndex: 1,
        }}
      >
        {config.label}
      </span>

      {/* Google AdSense slot */}
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          width: config.responsive ? "100%" : `${config.width}px`,
          height: `${config.height}px`,
        }}
        data-ad-client={pubId}
        data-ad-slot={slotId}
        data-ad-format={config.responsive ? "auto" : undefined}
        data-full-width-responsive={config.responsive ? "true" : undefined}
      />
    </div>
  );
}
