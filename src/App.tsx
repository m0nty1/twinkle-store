import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
// E7na han-comment el ba2y mo2aqatan 3shan nerfa3 bsor3a mn gher errors
// import Shop from './pages/Shop'; 
// import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          {/* Hannefta7 dol ba3dein lamma nen2el ba2et el files */}
          <Route path="shop" element={<div className="p-10 text-center">Shop Page Coming Soon...</div>} />
          <Route path="admin" element={<div className="p-10 text-center">Admin Panel Coming Soon...</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;