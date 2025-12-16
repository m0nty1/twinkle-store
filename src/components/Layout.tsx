import { Outlet, Link } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-yellow-600 tracking-wide">
            Twinkle ✨
          </Link>
          <div className="space-x-6 text-sm font-medium">
            <Link to="/" className="hover:text-yellow-600 transition">HOME</Link>
            <Link to="/shop" className="hover:text-yellow-600 transition">SHOP</Link>
          </div>
        </div>
      </nav>
      
      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-gray-900 text-white py-8 mt-10">
        <div className="container mx-auto px-4 text-center">
          <p className="opacity-75">Twinkle © 2024 - Luxury Perfumes & Accessories</p>
        </div>
      </footer>
    </div>
  );
}