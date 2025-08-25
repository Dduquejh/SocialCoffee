import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import './App.css'
import Home from './pages/Home';
import Store from './pages/Store';
import ProductDetail from './pages/ProductDetail';
import Blog from './pages/Blog';
import ShoppingCart from './pages/ShoppingCart';
import NotFound from './pages/NotFound';
import AuthCallback from './pages/AuthCallback';
import { initAnalytics, trackPageView } from './lib/analytics';

function App() {
  useEffect(() => {
    const isLocalhost = window.location.hostname === "localhost";

    if (isLocalhost) {
      console.log("Modo desarrollo: autenticación deshabilitada");
      return;
    }

    const token = localStorage.getItem("id_token");

    if (!token) {
      const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
      const domain = import.meta.env.VITE_COGNITO_DOMAIN;
      const redirectUri = import.meta.env.VITE_COGNITO_REDIRECT_URI;

      const loginUrl = `${domain}/login?response_type=token&client_id=${clientId}&redirect_uri=${redirectUri}`;
      window.location.href = loginUrl;
    }

    initAnalytics();
    trackPageView(window.location.pathname);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Router>
        <AnalyticsTracker />
        <Routes>
          <Route path="/auth-callback" element={<AuthCallback />} />
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/store" element={<Store />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/shopping-cart" element={<ShoppingCart />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;


const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);

  return null;
}