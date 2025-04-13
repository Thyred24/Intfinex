'use client' // Required for Next.js 13+ with App Router

import React, { useEffect, useRef, memo, useState } from 'react';

interface TradingViewConfig {
  container_id: string;
  width: string;
  height: string;
  symbol: string;
  interval: string;
  timezone: string;
  theme: string;
  style: string;
  locale: string;
  toolbar_bg: string;
  enable_publishing: boolean;
  hide_side_toolbar: boolean;
  allow_symbol_change: boolean;
  save_image: boolean;
  studies: string[];
  show_popup_button: boolean;
  popup_width: string;
  popup_height: string;
}

declare global {
  interface Window {
    TradingView: {
      widget: new (config: TradingViewConfig) => void;
    };
  }
}

function TradingViewWidget() {
  const container = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({
    width: '100%',
    height: '500px'
  });

  useEffect(() => {
    const updateDimensions = () => {
      if (typeof window !== 'undefined') {
        const isMobile = window.innerWidth < 768;
        setDimensions({
          width: '100%',
          height: isMobile ? '300px' : '500px'
        });
      }
    };

    // Set initial dimensions
    updateDimensions();

    // Add event listener for window resize
    window.addEventListener('resize', updateDimensions);

    // Cleanup
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    
    // Store the current container reference
    const currentContainer = container.current;
    
    script.onload = () => {
      if (currentContainer && window.TradingView) {
        new window.TradingView.widget({
          container_id: "tradingview_widget",
          height: dimensions.height,
          width: dimensions.width,
          symbol: "CAPITALCOM:DXY",
          interval: "D",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          hide_side_toolbar: true,
          allow_symbol_change: true,
          save_image: false,
          studies: [
            "MASimple@tv-basicstudies",
            "RSI@tv-basicstudies"
          ],
          show_popup_button: true,
          popup_width: "1000",
          popup_height: "650"
        });
      }
    };

    if (currentContainer) {
      currentContainer.appendChild(script);
    }

    return () => {
      if (currentContainer && currentContainer.contains(script)) {
        currentContainer.removeChild(script);
      }
    };
  }, [dimensions]);

  return (
    <div 
      id="tradingview_widget" 
      ref={container} 
      style={{ 
        height: dimensions.height, 
        width: dimensions.width,
        minHeight: '300px' // Ensures minimum height on mobile
      }} 
    />
  );
}

export default memo(TradingViewWidget);