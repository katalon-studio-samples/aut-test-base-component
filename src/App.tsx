import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ThemeToggle } from "./components/ThemeToggle";
import { SideNav } from "./components/SideNav";
import { Home } from "./pages/Home";
import { AboutPage } from "./pages/AboutPage";
import { NativeElementsPage } from "./pages/NativeElementsPage";
import { FormsPage } from "./pages/FormsPage";
import { TablesPage } from "./pages/TablesPage";
import { DragDropPage } from "./pages/DragDropPage";
import { DynamicElementsPage } from "./pages/DynamicElementsPage";
import { FileUploadPage } from "./pages/FileUploadPage";
import { ESFileUploadPage } from "./pages/ESFileUploadPage";
import { FileDownloadPage } from "./pages/FileDownloadPage";
import { IframePage } from "./pages/IframePage";
import { ContextMenuPage } from "./pages/ContextMenuPage";
import { HoverPage } from "./pages/HoverPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { ABTestingPage } from "./pages/ABTestingPage";
import { AuthPage } from "./pages/AuthPage";
import { BrokenImagesPage } from "./pages/BrokenImagesPage";
import { CheckboxesPage } from "./pages/CheckboxesPage";
import { ExitIntentPage } from "./pages/ExitIntentPage";
import { SliderPage } from "./pages/SliderPage";
import { AlertsPage } from "./pages/AlertsPage";
import { KeyPressPage } from "./pages/KeyPressPage";
import { ShadowDOMPage } from "./pages/ShadowDOMPage";
import { Menu, X } from "lucide-react";
import MultiTieredMenuPage from "./pages/MultiTieredMenuPage";
import { IframePageNested1Level } from "./pages/IframePageNested1Level.tsx";
import { IframePageNested2Level } from "./pages/IframePageNested2Level.tsx";
import { OpenPopupPage } from "./pages/OpenPopupPage.tsx";
import { PopupFormPage } from "./pages/PopupFormPage.tsx";
import { KeyValueFormPage } from "./pages/KeyValueFormPage.tsx";
import { IframeCellphoneDemoPage } from "./pages/IframeCellphoneDemoPage";
import { IframeVinothQADemoPage } from "./pages/IframeVinothQADemoPage";
import { IframeDocsKatalonPage } from "./pages/IframeDocsKatalonPage";
import { IframeSameDomainPage } from "./pages/IframeSameDomainPage.tsx";
import { RichTextEditorExamplePage } from "./pages/RichTextEditorExamplePage";
import { ComboBoxExamplePage } from "./pages/ComboBoxExamplePage.tsx";
import { CheckBoxPage as InputCheckBoxPage } from "./pages/Input/CheckBoxPage.tsx";
import { TextPage as InputTextPage } from "./pages/Input/TextPage.tsx";
import { RadioSearchSubmitPage } from "./pages/Input/RadioSearchSubmitPage.tsx";
import { FormInputsPage } from "./pages/Input/FormInputsPage.tsx";
import { CardListPage } from "./pages/PII/CardListPage.tsx";
import { SauceLoginPage } from "./pages/SauceLoginPage";
import { NumericInputPage } from "./pages/NumericInputPage";
import { SettingsPage } from "./pages/SettingsPage";
import { UnicodeComboBoxPage } from "./pages/UnicodeComboBoxPage";
import { XPathBreakingPage } from "./pages/XPathBreakingPage";
import AGGridPage from "./pages/AGGridPage";
import { TinyMCEShadowDOMPage } from "./pages/TinyMCEShadowDOMPage";
import { DynamicIDLocatorPage } from "./pages/DynamicIDLocatorPage";
import { ScenarioTogglePage } from "./pages/ScenarioTogglePage";
import { FormBuilderPageHTML5 } from "./pages/FormBuilderPageHTML5";
import DropdownListPage from "./pages/DropdownListPage";

// Helper function to create routes with multiple extensions
const createRoutes = (path: string, element: React.ReactElement) => {
  const extensions = ["", ".html", ".php", ".asp", ".aspx", ".jsp"];
  return extensions.map((ext) => (
    <Route key={`${path}${ext}`} path={`${path}${ext}`} element={element} />
  ));
};

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors flex flex-col md:flex-row">
          {/* Mobile menu button */}
          <button
            onClick={toggleSidebar}
            className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white dark:bg-gray-800 shadow-md"
            aria-label="Toggle menu"
            data-test="mobile-menu-button"
          >
            {sidebarOpen ? (
              <X className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            )}
          </button>

          {/* Sidebar for mobile with overlay */}
          <div
            className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 md:hidden ${
              sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={toggleSidebar}
          />

          {/* Sidebar */}
          <SideNav isOpen={sidebarOpen} onClose={toggleSidebar} />

          {/* Main content */}
          <div className="flex-1 pt-16 md:pt-0">
            <ThemeToggle />
            <main className="p-4 md:p-6">
              <Routes>
                {createRoutes("/", <Home />)}
                {createRoutes("/native-element", <NativeElementsPage />)}
                {createRoutes("/about", <AboutPage />)}
                {createRoutes("/forms", <FormsPage />)}
                {createRoutes("/msu-simulation-form", <DropdownListPage />)}
                {createRoutes("/tables", <TablesPage />)}
                {createRoutes("/drag-drop", <DragDropPage />)}
                {createRoutes("/dynamic-elements", <DynamicElementsPage />)}
                {createRoutes("/file-upload", <FileUploadPage />)}
                {createRoutes("/file-upload/es", <ESFileUploadPage />)}
                {createRoutes("/file-download", <FileDownloadPage />)}
                {createRoutes("/iframes", <IframePage />)}
                {createRoutes("/iframes-1", <IframePageNested1Level />)}
                {createRoutes("/iframes-2", <IframePageNested2Level />)}
                {createRoutes("/context-menu", <ContextMenuPage />)}
                {createRoutes("/multi-tiered-menu", <MultiTieredMenuPage />)}
                {createRoutes("/hover", <HoverPage />)}
                {createRoutes("/notifications", <NotificationsPage />)}
                {createRoutes("/ab-testing", <ABTestingPage />)}
                {createRoutes("/auth", <AuthPage />)}
                {createRoutes("/sauce-login", <SauceLoginPage />)}
                {createRoutes("/broken-images", <BrokenImagesPage />)}
                {createRoutes("/checkboxes", <CheckboxesPage />)}
                {createRoutes("/exit-intent", <ExitIntentPage />)}
                {createRoutes("/slider", <SliderPage />)}
                {createRoutes("/alerts", <AlertsPage />)}
                {createRoutes("/key-press", <KeyPressPage />)}
                {createRoutes("/shadow-dom", <ShadowDOMPage />)}
                {createRoutes("/open-popup", <OpenPopupPage />)}
                {createRoutes("/popup-form", <PopupFormPage />)}
                {createRoutes("/key-value-form", <KeyValueFormPage />)}
                {createRoutes(
                  "/iframes/cellphone-demo",
                  <IframeCellphoneDemoPage />,
                )}
                {createRoutes(
                  "/iframes/vinoth-demo",
                  <IframeVinothQADemoPage />,
                )}
                {createRoutes(
                  "/iframes/docs-katalon",
                  <IframeDocsKatalonPage />,
                )}
                {createRoutes("/iframes/same-domain", <IframeSameDomainPage />)}
                {createRoutes(
                  "/rich-text-editor",
                  <RichTextEditorExamplePage />,
                )}
                {createRoutes("/input/checkbox", <InputCheckBoxPage />)}
                {createRoutes("/input/text", <InputTextPage />)}
                {createRoutes(
                  "/input/radio-search-submit",
                  <RadioSearchSubmitPage />,
                )}
                {createRoutes("/input/form-inputs", <FormInputsPage />)}
                {createRoutes("/combobox", <ComboBoxExamplePage />)}
                {createRoutes("/unicode-combobox", <UnicodeComboBoxPage />)}
                {createRoutes("/xpath-breaking", <XPathBreakingPage />)}
                {createRoutes("/list-card", <CardListPage />)}
                {createRoutes("/unique-test-data", <NumericInputPage />)}
                {createRoutes("/settings", <SettingsPage />)}
                {createRoutes("/ag-grid", <AGGridPage />)}
                {createRoutes("/tinymce-shadow-dom", <TinyMCEShadowDOMPage />)}
                {createRoutes("/dynamic-id-locator", <DynamicIDLocatorPage />)}
                {createRoutes("/scenario-toggle", <ScenarioTogglePage />)}
                {createRoutes("/form-builder-html5", <FormBuilderPageHTML5 />)}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
