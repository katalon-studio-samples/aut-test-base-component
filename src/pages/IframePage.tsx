import React from 'react';
import { IframeExample } from '../components/IframeExample';
import {IframeComplex} from "../components/IframeComplex";

export const IframePage: React.FC = () => {
  return (
    <div className="px-4 py-6 sm:px-0">
      <h1 className="text-2xl font-bold mb-6">Iframe Examples</h1>
      <p className="mb-6">
        Practice working with iframes, including nested elements and cross-frame
        communication.
      </p>
      <IframeExample/>
      <h1 className="text-2xl font-bold mb-6 mt-10">Iframe Complex</h1>
      <IframeComplex/>
      <h1 className="text-2xl font-bold mb-6 mt-10">Iframe New app sample domain</h1>
      <div className="border rounded-lg p-4" data-test="iframe-wrapper-educenter">
        <h3 className="text-lg font-medium mb-2">Educator Center</h3>
        <iframe
          src="https://educenter.aut.katalon.com/"
          className="w-full h-[100vh] border-0 bg-white"
          sandbox="allow-scripts allow-forms"
          data-test="iframe-educenter"
        />
      </div>
    </div>
  );
};