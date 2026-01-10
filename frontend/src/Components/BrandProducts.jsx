import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { ContextProvider } from "../Context/Context";

const BrandProducts = () => {
  const [activeImageIndex, setActiveImageIndex] = useState({});
  const { brandName } = useParams();
  const decodedBrand = decodeURIComponent(brandName);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Context
  const { addToCart, addToWishlist } = useContext(ContextProvider);

  // Filter States
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rating, setRating] = useState("");
  const [availability, setAvailability] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  useEffect(() => {
    const fetchBrandProducts = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/products/?brand=${decodedBrand}`
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching brand products:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBrandProducts();
  }, [decodedBrand]);

  // Filter Logic
  const filteredData = data
    .filter((p) => !minPrice || p.price >= Number(minPrice))
    .filter((p) => !maxPrice || p.price <= Number(maxPrice))
    .filter((p) => !rating || (p.rating || 0) >= Number(rating))
    .filter((p) =>
      !availability
        ? true
        : availability === "in"
        ? p.in_stock === true
        : p.in_stock === false
    )
    .sort((a, b) => {
      if (sortOrder === "low-high") return a.price - b.price;
      if (sortOrder === "high-low") return b.price - a.price;
      return 0;
    });

  // ---------------------------------------------------------
  // ✅ FIX STARTS HERE: ROBUST IMAGE HELPERS
  // ---------------------------------------------------------

  // 1. Ensure URL is absolute (http://localhost:8000/...)
  const toFullImageUrl = (img) => {
    if (!img) return "https://via.placeholder.com/150";
    if (img.startsWith("http")) return img;
    
    // Ensure we handle leading slashes correctly
    const cleanPath = img.startsWith("/") ? img : `/${img}`;
    return `http://localhost:8000${cleanPath}`;
  };

  // 2. Find the first available image (Image 1, 2, or 3)
  const getFirstValidImage = (product) => {
    return [product.image_1, product.image_2, product.image_3].find(Boolean);
  };

  // ---------------------------------------------------------
  // ✅ HANDLERS USING THE HELPERS
  // ---------------------------------------------------------

  const handleAddToWishlist = (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    const wishlistItem = {
      ...product,
      // Use helper to get the best image and make it a full URL
      image: toFullImageUrl(getFirstValidImage(product)), 
    };

    addToWishlist(wishlistItem);
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    const cartItem = {
      ...product,
      // ✅ FIX: Explicitly set 'image' so Cart component can read it
      image: toFullImageUrl(getFirstValidImage(product)), 
    };

    addToCart(cartItem);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 pb-10">
      <div className="container mx-auto px-2 md:px-4">
        <h1 className="text-xl md:text-3xl font-bold text-center py-8 tracking-tight uppercase">
          {decodedBrand} <span className="text-emerald-400">Products</span>
        </h1>

        {/* --- PRODUCTS GRID --- */}
        {loading ? (
          <p className="text-center text-zinc-400">Loading...</p>
        ) : filteredData.length === 0 ? (
          <p className="text-center text-zinc-400">
            No products found for {decodedBrand}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0.5 md:gap-6 bg-zinc-800 md:bg-transparent">
            {filteredData.map((product) => {
              
              // Extract images for slider display
              const productImages = [
                product.image_1,
                product.image_2,
                product.image_3,
              ].filter(Boolean);

              return (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  state={{ product }}
                  className="group bg-zinc-900 md:rounded-2xl overflow-hidden hover:bg-zinc-800/50 transition-all duration-300 md:border md:border-zinc-800 md:hover:border-zinc-600 relative"
                >
                  <div className="flex flex-row md:flex-col h-full">
                    
                    {/* IMAGE SECTION */}
                    <div className="relative w-1/3 md:w-full bg-zinc-800/80 backdrop-blur-sm p-3 md:p-6 flex items-center justify-center">
                      
                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => handleAddToWishlist(e, product)}
                        className="absolute top-2 right-2 p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-red-500 transition-all z-10"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                          />
                        </svg>
                      </button>

                      {/* Main Image (Slider) */}
                      <img
                        src={toFullImageUrl(
                          productImages[activeImageIndex[product.id] || 0]
                        )}
                        alt={product.name}
                        className="h-28 md:h-48 w-full object-contain transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/150";
                        }}
                      />

                      {/* Slider Dots */}
                      {productImages.length > 1 && (
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                          {productImages.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setActiveImageIndex((prev) => ({
                                  ...prev,
                                  [product.id]: idx,
                                }));
                              }}
                              className={`w-2 h-2 rounded-full ${
                                (activeImageIndex[product.id] || 0) === idx
                                  ? "bg-emerald-400"
                                  : "bg-zinc-500"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* DETAILS SECTION */}
                    <div className="w-2/3 md:w-full p-4 flex flex-col justify-between border-l border-zinc-800 md:border-l-0">
                      <div>
                        <h2 className="text-sm md:text-base font-medium line-clamp-2 leading-snug text-zinc-200">
                          {product.name}
                        </h2>
                        {product.rating > 0 && (
                          <div className="flex items-center mt-1.5 gap-2">
                            <span className="bg-green-700 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">
                              {product.rating} ★
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 flex flex-col gap-3">
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg md:text-xl font-bold text-white">
                            ₹{Number(product.price).toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div className="hidden md:flex gap-2">
                          
                          {/* Add to Cart Button */}
                          <button
                            onClick={(e) => handleAddToCart(e, product)}
                            className="flex-1 text-[11px] py-2 rounded-lg bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition"
                          >
                            Add to Cart
                          </button>
                          
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandProducts;