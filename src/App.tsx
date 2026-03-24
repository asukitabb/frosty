import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from '@/context/CartContext';
import { StockProvider } from '@/context/StockContext';
import { Navbar } from '@/components/Navbar';
import { POS } from '@/pages/POS';
import { Almacen } from '@/pages/Almacen';

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <StockProvider>
          <div style={{ minHeight: '100vh' }}>
            <Navbar />
            <Routes>
              <Route path="/" element={<POS />} />
              <Route path="/almacen" element={<Almacen />} />
            </Routes>
          </div>
        </StockProvider>
      </CartProvider>
    </BrowserRouter>
  );
}
