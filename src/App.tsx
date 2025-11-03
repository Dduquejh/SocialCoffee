import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import './App.css';
import { isTokenValid } from './lib/auth';

// Páginas
import Home from './pages/Home';
import Store from './pages/Store';
import ProductDetail from './pages/ProductDetail';
import Blog from './pages/Blog';
import ShoppingCart from './pages/ShoppingCart';
import NotFound from './pages/NotFound';
import AuthCallback from './pages/AuthCallback';
import Admin from './pages/Admin';

// Utilidades
import { initAnalytics, trackPageView } from './lib/analytics';
import RequireAdmin from './components/RequiereAdmin';

// Chat de n8n
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';

function App() {
  useEffect(() => {
    const isLocalhost = window.location.hostname === 'localhost';
    let token = localStorage.getItem('id_token');

    // 🔐 1. Manejo de token
    if (isLocalhost) {
      console.log('Modo desarrollo: autenticación deshabilitada');
      if (!token) {
        token = 'fake-local-token';
        localStorage.setItem('id_token', token);
      }
    } else {
      if (!token || !isTokenValid(token)) {
        localStorage.removeItem('id_token');
        const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
        const domain = import.meta.env.VITE_COGNITO_DOMAIN;
        const redirectUri = import.meta.env.VITE_COGNITO_REDIRECT_URI;
        window.location.href = `${domain}/login?response_type=token&client_id=${clientId}&redirect_uri=${redirectUri}`;
        return;
      }
    }

    // 📊 2. Analytics
    initAnalytics();
    trackPageView(window.location.pathname);

    // ⚡ 3. Interceptar el fetch global
    const originalFetch = window.fetch;
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const jwt = localStorage.getItem('id_token');
      const newInit: RequestInit = {
        ...init,
        headers: {
          ...(init?.headers || {}),
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
      };
      return originalFetch(input, newInit);
    };

    console.log('🌐 Token JWT para fetch:', token);
    // 💬 4. Inicializar el chat
    createChat({
      webhookUrl: import.meta.env.VITE_N8N_CHAT_WEBHOOK_URL || '',
      webhookConfig: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // ✅ Aquí agregas el JWT
        },
      },
      metadata: {
        token: token || '',
      },
      mode: 'window',
      defaultLanguage: 'es' as any,
      initialMessages: [
        '¡Hola! 👋',
        'Soy Sofía, tu barista virtual de SocialCoffee ☕. Para continuar manda un mensaje.',
      ],
      i18n: {
        es: {
          title: 'Bienvenido a SocialCoffee ☕',
          subtitle: 'Conversemos sobre café y comparte tus comentarios.',
          footer: '',
          getStarted: 'Nueva conversación',
          inputPlaceholder: 'Escribe tu mensaje aquí...',
          closeButtonTooltip: '',
        },
      },
    });

    // 🧹 5. Restaurar fetch al desmontar el componente
    return () => {
      window.fetch = originalFetch;
    };
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
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <Admin />
              </RequireAdmin>
            }
          />
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
};
