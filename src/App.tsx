import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Home from './pages/Home';
import Store from './pages/Store';
import ProductDetail from './pages/ProductDetail';
import Forum from './pages/Forum';
import Profile from './pages/Profile';
import ShoppingCart from './pages/ShoppingCart';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/store" element={<Store />} />
        <Route path="/store/product/:id" element={<ProductDetail />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/shopping-cart" element={<ShoppingCart />} />
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </Router>
  )
}

export default App
