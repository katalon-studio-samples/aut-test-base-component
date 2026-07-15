import { test as base, expect } from "@playwright/test";
import { ROUTE_SPECS } from "../contracts/routeSpecs";
import { IframeHelperComponent } from "../framework/components/IframeHelperComponent";
import { ModalComponent } from "../framework/components/ModalComponent";
import { NotificationComponent } from "../framework/components/NotificationComponent";
import { ShadowDomHelperComponent } from "../framework/components/ShadowDomHelperComponent";
import { SideNavComponent } from "../framework/components/SideNavComponent";
import { ThemeToggleComponent } from "../framework/components/ThemeToggleComponent";
import { InputE2eFlows } from "../framework/pages/inputE2eFlows";
import { RegressionGapFlows } from "../framework/pages/regressionGapFlows";
import {
  createRoutePages,
  type RoutePages,
} from "../framework/pages/routePages";
import {
  createSeedFeaturePages,
  type SeedFeaturePages,
} from "../framework/pages/seedFeaturePages";

interface ComponentsFixture {
  sideNav: SideNavComponent;
  themeToggle: ThemeToggleComponent;
  modal: ModalComponent;
  notifications: NotificationComponent;
  iframeHelper: IframeHelperComponent;
  shadowDomHelper: ShadowDomHelperComponent;
}

export interface AppFixtures {
  routePages: RoutePages;
  seedPages: SeedFeaturePages;
  gapFlows: RegressionGapFlows;
  inputFlows: InputE2eFlows;
  components: ComponentsFixture;
  routeSpecs: typeof ROUTE_SPECS;
}

export const test = base.extend<AppFixtures>({
  routePages: async ({ page }, use) => {
    await use(createRoutePages(page));
  },

  seedPages: async ({ page }, use) => {
    await use(createSeedFeaturePages(page));
  },

  gapFlows: async ({ page }, use) => {
    await use(new RegressionGapFlows(page));
  },

  inputFlows: async ({ page }, use) => {
    await use(new InputE2eFlows(page));
  },

  components: async ({ page }, use) => {
    await use({
      sideNav: new SideNavComponent(page),
      themeToggle: new ThemeToggleComponent(page),
      modal: new ModalComponent(page),
      notifications: new NotificationComponent(page),
      iframeHelper: new IframeHelperComponent(page),
      shadowDomHelper: new ShadowDomHelperComponent(page),
    });
  },

  routeSpecs: async ({}, use) => {
    await use(ROUTE_SPECS);
  },
});

test.beforeEach(async ({ page }) => {
  await page.addInitScript((storageValues: Record<string, string>) => {
    Object.entries(storageValues).forEach(([key, value]) => {
      window.localStorage.setItem(key, value);
    });
  }, {
    "katalon-client-code": "KA-9224-023",
    env: "qa",
  });
});

export { expect };
