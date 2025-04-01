import React from 'react';
import {IFRAME_BASE_URL} from "../data/menuData.ts";

export const IframePageNested1Level: React.FC = () => {
  console.log('IframePageNested1Level');
  return (
    <div className="px-4 py-6 sm:px-0">
      <iframe
        src={`${IFRAME_BASE_URL}/#/iframes-2`}
        className="w-full h-[100vh] border-0 bg-white"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        data-test="iframe-educenter"
      />
    </div>
  );
};