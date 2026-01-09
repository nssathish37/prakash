import { useContext } from "react";
import { ContextProvider } from "../Context/Context"; // Adjust path
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, addToCart } = useContext(ContextProvider);

  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto mt-20 text-center text-white"><br />
        <h2 className="text-3xl font-bold mb-4">Your Wishlist is Empty</h2>
        <Link to="/" className="text-emerald-400 underline">Explore Products</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto my-10 px-4">
      <h2 className="text-2xl font-bold text-white mb-6">My Wishlist</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {wishlistItems.map((item) => (
          <div key={item.id} className="relative bg-[#121212] border border-white/10 p-4 rounded-xl group">
            
            {/* Remove Button */}
            <button 
                onClick={() => removeFromWishlist(item.id)}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500 transition"
            >
                <IoClose size={20} />
            </button>

            <Link to={`/product/${item.id}`}>
                <div className="h-40 flex items-center justify-center mb-4">
                    <img src={item.image} alt={item.name} className="max-h-full object-contain" />
                </div>
                <h3 className="text-white text-sm font-medium line-clamp-1">{item.name}</h3>
                <p className="text-emerald-400 font-bold mt-1">₹{Number(item.price).toLocaleString("en-IN")}</p>
            </Link>

            <button 
                onClick={() => {
                    addToCart(item);
                    removeFromWishlist(item.id);
                }}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-emerald-500 hover:text-black text-white py-2 rounded-md text-sm transition-all"
            >
                <FaShoppingCart /> Move to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;