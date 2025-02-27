import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
                <Route path="/context-menu" element={<ContextMenuPage />} />
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