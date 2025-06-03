import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';
import { SideNav } from './components/SideNav';
import { Home } from './pages/Home';
import { AboutPage } from './pages/AboutPage';
import { FormsPage } from './pages/FormsPage';
import { TablesPage } from './pages/TablesPage';
import { DragDropPage } from './pages/DragDropPage';
import { DynamicElementsPage } from './pages/DynamicElementsPage';
import { FileUploadPage } from './pages/FileUploadPage';
import { FileDownloadPage } from './pages/FileDownloadPage';
import { IframePage } from './pages/IframePage';
import { ContextMenuPage } from './pages/ContextMenuPage';
import { HoverPage } from './pages/HoverPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ABTestingPage } from './pages/ABTestingPage';
import { AuthPage } from './pages/AuthPage';
import { BrokenImagesPage } from './pages/BrokenImagesPage';
import { CheckboxesPage } from './pages/CheckboxesPage';
import { ExitIntentPage } from './pages/ExitIntentPage';
import { SliderPage } from './pages/SliderPage';
import { AlertsPage } from './pages/AlertsPage';
import { KeyPressPage } from './pages/KeyPressPage';
import { ShadowDOMPage } from './pages/ShadowDOMPage';
import { Menu, X } from 'lucide-react';
import MultiTieredMenuPage from "./pages/MultiTieredMenuPage";
import { IframePageNested1Level } from "./pages/IframePageNested1Level.tsx";
import { IframePageNested2Level } from "./pages/IframePageNested2Level.tsx";
import { OpenPopupPage } from "./pages/OpenPopupPage.tsx";
import { PopupFormPage } from "./pages/PopupFormPage.tsx";
import { KeyValueFormPage } from './pages/KeyValueFormPage.tsx';
import { IframeCellphoneDemoPage } from './pages/IframeCellphoneDemoPage';
import { IframeVinothQADemoPage } from './pages/IframeVinothQADemoPage';
import { IframeDocsKatalonPage } from './pages/IframeDocsKatalonPage';
import { IframeSameDomainPage } from './pages/IframeSameDomainPage.tsx';
import { RichTextEditorExamplePage } from './pages/RichTextEditorExamplePage';
import { ComboBoxExamplePage } from './pages/ComboBoxExamplePage.tsx';

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
              sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            onClick={toggleSidebar}
          />

          {/* Sidebar */}
          <SideNav isOpen={sidebarOpen} onClose={toggleSidebar} />

          {/* Main content */}
          <div className="flex-1 md:ml-64 pt-16 md:pt-0">
            <ThemeToggle />
            <main className="p-4 md:p-6">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/forms" element={<FormsPage />} />
                <Route path="/tables" element={<TablesPage />} />
                <Route path="/drag-drop" element={<DragDropPage />} />
                <Route path="/dynamic-elements" element={<DynamicElementsPage />} />
                <Route path="/file-upload" element={<FileUploadPage />} />
                <Route path="/file-download" element={<FileDownloadPage />} />
                <Route path="/iframes" element={<IframePage />} />
                <Route path="/iframes-1" element={<IframePageNested1Level />} />
                <Route path="/iframes-2" element={<IframePageNested2Level />} />
                <Route path="/context-menu" element={<ContextMenuPage />} />
                <Route path="//multi-tiered-menu" element={<MultiTieredMenuPage />} />
                <Route path="/hover" element={<HoverPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/ab-testing" element={<ABTestingPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/broken-images" element={<BrokenImagesPage />} />
                <Route path="/checkboxes" element={<CheckboxesPage />} />
                <Route path="/exit-intent" element={<ExitIntentPage />} />
                <Route path="/slider" element={<SliderPage />} />
                <Route path="/alerts" element={<AlertsPage />} />
                <Route path="/key-press" element={<KeyPressPage />} />
                <Route path="/shadow-dom" element={<ShadowDOMPage />} />
                <Route path="/open-popup" element={<OpenPopupPage />} />
                <Route path="/popup-form" element={<PopupFormPage />} />
                <Route path="/key-value-form" element={<KeyValueFormPage />} />
                <Route path="/iframes/cellphone-demo" element={<IframeCellphoneDemoPage />} />
                <Route path="/iframes/vinoth-demo" element={<IframeVinothQADemoPage />} />
                <Route path="/iframes/docs-katalon" element={<IframeDocsKatalonPage />} />
                <Route path="/iframes/same-domain" element={<IframeSameDomainPage />} />
                <Route path="/rich-text-editor" element={<RichTextEditorExamplePage />} />
                <Route path="/combobox" element={<ComboBoxExamplePage />} />
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
