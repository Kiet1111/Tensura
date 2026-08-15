import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App'; // Bỏ đuôi .tsx cho gọn
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Không tìm thấy element có id "root" trong index.html');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
