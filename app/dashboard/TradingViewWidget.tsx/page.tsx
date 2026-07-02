"use client";

import { useEffect, useRef } from 'react';

interface TradingViewWidgetProps {
  symbol: string;
}

export default function TradingViewWidget({ symbol }: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    // Flush previous configurations to clean the workspace memory slot
    container.current.innerHTML = '';

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "autosize": true,
      "symbol": symbol,
      "interval": "D",
      "timezone": "Etc/UTC",
      "theme": "dark",
      "style": "1",
      "locale": "en",
      "allow_symbol_change": false,
      "calendar": false,
      "support_host": "https://www.tradingview.com",
      "backgroundColor": "rgba(3, 7, 18, 1)", // Blends with your background slate canvas
      "gridColor": "rgba(15, 23, 42, 0.4)",
      "hide_top_toolbar": false,
      "hide_side_toolbar": false,
      "save_image": false
    });

    container.current.appendChild(script);
  }, [symbol]);

  return (
    <div 
      className="tradingview-widget-container w-full h-full min-h-[520px] md:min-h-[580px] xl:min-h-[660px]" 
      ref={container} 
    />
  );
}