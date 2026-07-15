import type { Page } from "@playwright/test";
import { BaseRoutePage } from "../base/BaseRoutePage";

export class HomePage extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/", "Home");
  }
}

export class NativeElementPage extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/native-element", "Native HTML Elements");
  }
}

export class AboutPage extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/about", "About");
  }
}

export class FormsPage extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/forms", "Forms");
  }
}

export class MsuSimulationFormPage extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/msu-simulation-form", "MSU Simulation Form");
  }
}

export class TablesPage extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/tables", "Tables");
  }
}

export class DragDropPage extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/drag-drop", "Drag and Drop");
  }
}

export class DynamicElementsPage extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/dynamic-elements", "Dynamic Elements");
  }
}

export class FileUploadPage extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/file-upload", "File Upload");
  }
}

export class FileUploadEsPage extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/file-upload/es", "File Upload (ES DOM)");
  }
}

export class FileDownloadPage extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/file-download", "File Download");
  }
}

export class IframesPage extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/iframes", "Iframes");
  }
}

export class Iframes1Page extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/iframes-1", "Iframes Nested Level 1");
  }
}

export class Iframes2Page extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/iframes-2", "Iframes Nested Level 2");
  }
}

export class ContextMenuPage extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/context-menu", "Context Menu");
  }
}

export class MultiTieredMenuPage extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/multi-tiered-menu", "Multi Tiered Menu");
  }
}

export class HoverPage extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/hover", "Hover");
  }
}

export class NotificationsPage extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/notifications", "Notifications");
  }
}

export class ToastDelayScenarioPage extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/toast-delay-scenario", "Toast Delay Scenario");
  }
}

export class AbTestingPage extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/ab-testing", "A/B Testing");
  }
}

export class AuthPage extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/auth", "Authentication");
  }
}

export class SauceLoginPage extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/sauce-login", "Sauce Login");
  }
}

export class BrokenImagesPage extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/broken-images", "Broken Images");
  }
}

export class CheckboxesPage extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/checkboxes", "Checkboxes");
  }
}

export class ExitIntentPage extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/exit-intent", "Exit Intent");
  }
}

export class SliderPage extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/slider", "Slider");
  }
}

export class AlertsPage extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/alerts", "Alerts");
  }
}

export class KeyPressPage extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/key-press", "Key Press");
  }
}

export class ShadowDomPage extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/shadow-dom", "Shadow DOM");
  }
}

export class ShadowBookBorrowPage extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/shadow-book-borrow", "Shadow Book Borrow");
  }
}

export class OpenPopupPage extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/open-popup", "Open Popup");
  }
}

export class OpenNewTabPage extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/open-new-tab", "Open New Tab");
  }
}

export class PopupFormPage extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/popup-form", "Popup Form");
  }
}

export class KeyValueFormPage extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/key-value-form", "Key Value Form");
  }
}

export class IframesCellphoneDemoPage extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/iframes/cellphone-demo", "Iframes Cellphone Demo");
  }
}

export class IframesVinothDemoPage extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/iframes/vinoth-demo", "Iframes Vinoth Demo");
  }
}

export class IframesDocsKatalonPage extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/iframes/docs-katalon", "Iframes Docs Katalon");
  }
}

export class IframesSameDomainPage extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/iframes/same-domain", "Iframes Same Domain");
  }
}

export class RichTextEditorPage extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/rich-text-editor", "Rich Text Editor");
  }
}

export class InputCheckboxPage extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/input/checkbox", "Input Checkbox");
  }
}

export class InputTextPage extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/input/text", "Input Text");
  }
}

export class InputRadioSearchSubmitPage extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/input/radio-search-submit", "Input Radio Search Submit");
  }
}

export class InputFormInputsPage extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/input/form-inputs", "Form Input Types");
  }
}

export class ComboboxPage extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/combobox", "Combo Box");
  }
}

export class UnicodeComboboxPage extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/unicode-combobox", "Unicode Combo Box");
  }
}

export class XpathBreakingPage extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/xpath-breaking", "XPath Breaking");
  }
}

export class ListCardPage extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/list-card", "List Card");
  }
}

export class PiiControlsPage extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/pii-controls", "PII Controls");
  }
}

export class UniqueTestDataPage extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/unique-test-data", "Numeric Input");
  }
}

export class SettingsPage extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/settings", "TrueTest Settings");
  }
}

export class AgGridPage extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/ag-grid", "AG Grid");
  }
}

export class TinymceShadowDomPage extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/tinymce-shadow-dom", "TinyMCE Shadow DOM");
  }
}

export class DynamicIdLocatorPage extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/dynamic-id-locator", "Dynamic ID Locator");
  }
}

export class ScenarioTogglePage extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/scenario-toggle", "Scenario Toggle");
  }
}

export class FormBuilderHtml5Page extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/form-builder-html5", "Form Builder HTML5");
  }
}

export class ChallengingFormPage extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/challenging-form", "Challenging Form");
  }
}

export class CtrlClickTablePage extends BaseRoutePage {
  constructor(page: Page) {
    super(page, "/ctrl-click-table", "Ctrl Click Table");
  }
}

export interface RoutePages {
  home: HomePage;
  nativeElement: NativeElementPage;
  about: AboutPage;
  forms: FormsPage;
  msuSimulationForm: MsuSimulationFormPage;
  tables: TablesPage;
  dragDrop: DragDropPage;
  dynamicElements: DynamicElementsPage;
  fileUpload: FileUploadPage;
  fileUploadEs: FileUploadEsPage;
  fileDownload: FileDownloadPage;
  iframes: IframesPage;
  iframes1: Iframes1Page;
  iframes2: Iframes2Page;
  contextMenu: ContextMenuPage;
  multiTieredMenu: MultiTieredMenuPage;
  hover: HoverPage;
  notifications: NotificationsPage;
  toastDelayScenario: ToastDelayScenarioPage;
  abTesting: AbTestingPage;
  auth: AuthPage;
  sauceLogin: SauceLoginPage;
  brokenImages: BrokenImagesPage;
  checkboxes: CheckboxesPage;
  exitIntent: ExitIntentPage;
  slider: SliderPage;
  alerts: AlertsPage;
  keyPress: KeyPressPage;
  shadowDom: ShadowDomPage;
  shadowBookBorrow: ShadowBookBorrowPage;
  openPopup: OpenPopupPage;
  openNewTab: OpenNewTabPage;
  popupForm: PopupFormPage;
  keyValueForm: KeyValueFormPage;
  iframesCellphoneDemo: IframesCellphoneDemoPage;
  iframesVinothDemo: IframesVinothDemoPage;
  iframesDocsKatalon: IframesDocsKatalonPage;
  iframesSameDomain: IframesSameDomainPage;
  richTextEditor: RichTextEditorPage;
  inputCheckbox: InputCheckboxPage;
  inputText: InputTextPage;
  inputRadioSearchSubmit: InputRadioSearchSubmitPage;
  inputFormInputs: InputFormInputsPage;
  combobox: ComboboxPage;
  unicodeCombobox: UnicodeComboboxPage;
  xpathBreaking: XpathBreakingPage;
  listCard: ListCardPage;
  piiControls: PiiControlsPage;
  uniqueTestData: UniqueTestDataPage;
  settings: SettingsPage;
  agGrid: AgGridPage;
  tinymceShadowDom: TinymceShadowDomPage;
  dynamicIdLocator: DynamicIdLocatorPage;
  scenarioToggle: ScenarioTogglePage;
  formBuilderHtml5: FormBuilderHtml5Page;
  challengingForm: ChallengingFormPage;
  ctrlClickTable: CtrlClickTablePage;
}

export const createRoutePages = (page: Page): RoutePages => ({
  home: new HomePage(page),
  nativeElement: new NativeElementPage(page),
  about: new AboutPage(page),
  forms: new FormsPage(page),
  msuSimulationForm: new MsuSimulationFormPage(page),
  tables: new TablesPage(page),
  dragDrop: new DragDropPage(page),
  dynamicElements: new DynamicElementsPage(page),
  fileUpload: new FileUploadPage(page),
  fileUploadEs: new FileUploadEsPage(page),
  fileDownload: new FileDownloadPage(page),
  iframes: new IframesPage(page),
  iframes1: new Iframes1Page(page),
  iframes2: new Iframes2Page(page),
  contextMenu: new ContextMenuPage(page),
  multiTieredMenu: new MultiTieredMenuPage(page),
  hover: new HoverPage(page),
  notifications: new NotificationsPage(page),
  toastDelayScenario: new ToastDelayScenarioPage(page),
  abTesting: new AbTestingPage(page),
  auth: new AuthPage(page),
  sauceLogin: new SauceLoginPage(page),
  brokenImages: new BrokenImagesPage(page),
  checkboxes: new CheckboxesPage(page),
  exitIntent: new ExitIntentPage(page),
  slider: new SliderPage(page),
  alerts: new AlertsPage(page),
  keyPress: new KeyPressPage(page),
  shadowDom: new ShadowDomPage(page),
  shadowBookBorrow: new ShadowBookBorrowPage(page),
  openPopup: new OpenPopupPage(page),
  openNewTab: new OpenNewTabPage(page),
  popupForm: new PopupFormPage(page),
  keyValueForm: new KeyValueFormPage(page),
  iframesCellphoneDemo: new IframesCellphoneDemoPage(page),
  iframesVinothDemo: new IframesVinothDemoPage(page),
  iframesDocsKatalon: new IframesDocsKatalonPage(page),
  iframesSameDomain: new IframesSameDomainPage(page),
  richTextEditor: new RichTextEditorPage(page),
  inputCheckbox: new InputCheckboxPage(page),
  inputText: new InputTextPage(page),
  inputRadioSearchSubmit: new InputRadioSearchSubmitPage(page),
  inputFormInputs: new InputFormInputsPage(page),
  combobox: new ComboboxPage(page),
  unicodeCombobox: new UnicodeComboboxPage(page),
  xpathBreaking: new XpathBreakingPage(page),
  listCard: new ListCardPage(page),
  piiControls: new PiiControlsPage(page),
  uniqueTestData: new UniqueTestDataPage(page),
  settings: new SettingsPage(page),
  agGrid: new AgGridPage(page),
  tinymceShadowDom: new TinymceShadowDomPage(page),
  dynamicIdLocator: new DynamicIdLocatorPage(page),
  scenarioToggle: new ScenarioTogglePage(page),
  formBuilderHtml5: new FormBuilderHtml5Page(page),
  challengingForm: new ChallengingFormPage(page),
  ctrlClickTable: new CtrlClickTablePage(page),
});
