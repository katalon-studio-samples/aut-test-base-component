import React from 'react';
import { IFRAME_BASE_URL } from "../data/menuData.ts";

export const IframePageNested1Level: React.FC = () => {
  return (
    <div style={{padding: '20px'}}>
      <iframe
        src={`${IFRAME_BASE_URL}/iframes-2`}
        className="w-full h-[100vh] border-0 bg-white"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        data-test="iframe-nested"
      />
    </div>
  );
};