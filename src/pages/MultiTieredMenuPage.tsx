import React from 'react';
import MultiTieredMenu from '../components/MultiTieredMenu';
import { menuData } from '../data/menuData';
import MultiTieredMenuMUI from "../components/MultiTieredMenuMUI";
import MultiTieredMenuAntd from "../components/MultiTieredMenuAntd";

const MultiTieredMenuPage: React.FC = () => {
  return (
    <div className="px-4 py-6 sm:px-0">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Simple Multi Tiered Menu</h1>
      <MultiTieredMenu items={menuData}/>
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white mt-10">Simple Multi Tiered Menu Use MUI</h1>
      <MultiTieredMenuMUI items={menuData}/>
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white mt-10">Simple Multi Tiered Menu Use Antd</h1>
      <MultiTieredMenuAntd items={menuData}/>
    </div>
  );
};

export default MultiTieredMenuPage;
