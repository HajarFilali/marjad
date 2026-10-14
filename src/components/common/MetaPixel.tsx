"use client";

import React, { useEffect, useState } from "react";
import Script from "next/script";

interface MetaPixelConfig {
  pixelId: string;
  enabled: boolean;
}

export const MetaPixel: React.FC = () => {
  const [config, setConfig] = useState<MetaPixelConfig | null>(null);

  const loadSettings = () => {
    try {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("marjad_meta_pixel_settings");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && typeof parsed === "object") {
            setConfig({
              pixelId: (parsed.pixelId || "").trim(),
              enabled: parsed.enabled !== undefined ? Boolean(parsed.enabled) : true,
            });
          }
        }
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    loadSettings();

    const handleUpdate = () => loadSettings();
    window.addEventListener("marjad_pixel_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("marjad_pixel_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  // If disabled or pixelId is empty/invalid, DO NOT load Meta Pixel
  if (!config || !config.enabled || !config.pixelId || !/^\d+$/.test(config.pixelId)) {
    return null;
  }

  const { pixelId } = config;

  return (
    <Script
      id="meta-pixel-base-script"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${pixelId}');
          fbq('track', 'PageView');
        `,
      }}
    />
  );
};
