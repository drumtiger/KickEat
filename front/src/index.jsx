import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';

import Body from './view/Body';
import Footer from './view/Footer';
import Header from './view/Header';
import Menu from './view/Menu';
import PrivacyPolicy from './view/page/PrivacyPolicy';
import TermsOfUse from './view/page/TermsOfUse';

import './css/public.css';
import './js/public.js';
import { GlobalStateProvider } from './GlobalStateContext';

const container = ReactDOM.createRoot(document.getElementById('container'));

const App = () => {
  const location = useLocation();

  const hideFooterPaths = ['/about'];

  const shouldHideFooter = hideFooterPaths.includes(location.pathname);

  return (
    <GlobalStateProvider>
      <Header />
      <Menu />
      <Routes>
        <Route path="/*" element={<Body />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />
      </Routes>
      {!shouldHideFooter && <Footer />}
    </GlobalStateProvider>
  );
};

container.render(
  <HashRouter>
    <App />
  </HashRouter>
);