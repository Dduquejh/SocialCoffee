import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react';
import './App.css'
import Home from './pages/Home';
import Store from './pages/Store';
import ProductDetail from './pages/ProductDetail';
import Forum from './pages/Forum';
import Profile from './pages/Profile';
import ShoppingCart from './pages/ShoppingCart';
import NotFound from './pages/NotFound';
import AuthCallback from './pages/AuthCallback';

function App() {

  useEffect(() => {
    const token = localStorage.getItem("id_token");

    if (!token) {
      const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
      const domain = import.meta.env.VITE_COGNITO_DOMAIN;
      const redirectUri = import.meta.env.VITE_COGNITO_REDIRECT_URI;

      console.log("Client ID:", import.meta.env.VITE_COGNITO_CLIENT_ID);
console.log("Domain:", import.meta.env.VITE_COGNITO_DOMAIN);
console.log("Redirect URI:", import.meta.env.VITE_COGNITO_REDIRECT_URI);


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
          <Route path="/home" element={<Home />} />
          <Route path="/store" element={<Store />} />
          <Route path="/store/product/:id" element={<ProductDetail />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/shopping-cart" element={<ShoppingCart />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
