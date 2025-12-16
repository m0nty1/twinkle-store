import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-gradient-to-b from-yellow-50 to-white">
      <h1 className="text-5xl font-bold text-gray-900 mb-6">
        Shine with <span className="text-yellow-600">Twinkle</span>
      </h1>
      <p className="text-gray-600 text-lg max-w-2xl mb-8">
        Discover our exclusive range of handcrafted accessories and signature unisex perfumes designed to make you stand out.
      </p>
      <div className="flex gap-4">
        <Link to="/shop" className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition">
          Shop Now
        </Link>
      </div>
    </div>
  );
}