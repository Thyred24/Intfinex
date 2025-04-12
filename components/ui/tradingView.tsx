import React, { useEffect, useRef, memo } from 'react';

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

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (container.current) {
        new window.TradingView.widget({
          container_id: "tradingview_widget", 
          height: "500px",
          width: "100%",
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
      if (container.current) {
        container.current.appendChild(script);
      }
    },
    []
  );

  return (
    <div id="tradingview_widget" ref={container} style={{ height: "100%", width: "100%" }} />
  );
}

export default memo(TradingViewWidget);