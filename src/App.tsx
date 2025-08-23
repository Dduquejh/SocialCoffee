import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import './App.css'
import Home from './pages/Home';
import Store from './pages/Store';
import ProductDetail from './pages/ProductDetail';
import Blog from './pages/Blog';
import Profile from './pages/Profile';
import ShoppingCart from './pages/ShoppingCart';
import NotFound from './pages/NotFound';
import AuthCallback from './pages/AuthCallback';

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

    console.log("Client ID:", clientId);
    console.log("Domain:", domain);
    console.log("Redirect URI:", redirectUri);

    const loginUrl = `${domain}/login?response_type=token&client_id=${clientId}&redirect_uri=${redirectUri}`;
    window.location.href = loginUrl;
  }
}, []);


  return (
    <div className="bg-gray-50 min-h-screen">
      <Router>
        <Routes>
          <Route path="/auth-callback" element={<AuthCallback />} />
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/store" element={<Store />} />
          <Route path="/store/product/:id" element={<ProductDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/shopping-cart" element={<ShoppingCart />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
