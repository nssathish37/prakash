import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ContextProvider } from "../Context/Context";

const SingleItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State management
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [loading, setLoading] = useState(true);

  // Get token from context
  const { token, addToCart: contextAddToCart } = useContext(ContextProvider);

  // 🔹 FETCH PRODUCT FROM MYSQL BACKEND
  const fetchSingleProduct = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:8000/api/products/${id}/`);
      
      const productData = res.data;
      setProduct(productData);

      // Set initial active image
      const firstImage = Array.isArray(productData.product_image)
        ? productData.product_image[0]
        : productData.image;
      
      setActiveImage(firstImage);

      if (productData.category) {
        localStorage.setItem("category", productData.category);
      }

    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSingleProduct();
    window.scrollTo(0, 0);
  }, [id]);

  // 🔹 ADD TO CART (Uses Context Logic)
  const handleAddToCart = () => {
    if (product) {
      contextAddToCart(product);
    }
  };

  // 🔹 BUY NOW (Fix applied here)
  const handleBuyNow = () => {
    if (!product) return;

    navigate("/payment", {
      state: {
        items: [{ ...product, qty: 1 }], // ✅ Send as an array of 1 item
        total: product.price,            // ✅ Send the total price
        source: "buy_now"                // Optional flag
      }
    });
  };

  if (loading || !product) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-zinc-400">
        <div className="animate-pulse">Loading Product...</div>
      </div>
    );
  }

  // 🔹 DESTRUCTURE FOR UI
  const {
    name,
    price,
    description,
    product_image = [],
    banner_image = [],
    rating = 0,
    reviews = 0,
    brand = "",
    product_color = "",
    in_stock = true,
  } = product;

  const images = Array.isArray(product_image) ? product_image : [product_image];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 pb-20 pt-8">
      <div className="container mx-auto px-4">
        
        {/* BACK NAVIGATION */}
        <Link to={-1} className="text-zinc-500 hover:text-emerald-400 text-sm inline-flex items-center gap-2 mb-6">
          ← Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* LEFT - IMAGE GALLERY */}
          <div>
            <div className="h-[450px] bg-zinc-800 rounded-2xl flex items-center justify-center p-6 border border-zinc-700/50">
              <img
                src={activeImage}
                alt={name}
                className="w-full h-full object-contain"
                onError={(e) => { e.target.src = "https://via.placeholder.com/400"; }}
              />
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`h-20 w-20 flex-shrink-0 p-2 rounded-xl border transition-all ${
                      activeImage === img ? "border-emerald-500 bg-zinc-800" : "border-zinc-700 bg-zinc-900"
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT - PRODUCT DETAILS */}
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-bold">{name}</h1>
              <div className="flex items-center gap-3 mt-2">
                {rating > 0 && (
                  <span className="bg-emerald-500 text-black px-2 py-1 rounded text-sm font-bold">
                    {rating} ★
                  </span>
                )}
                <span className="text-zinc-400 text-sm">({reviews} Reviews)</span>
                {brand && <span className="text-zinc-500 uppercase text-xs tracking-widest">{brand}</span>}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-end gap-3">
                <h2 className="text-4xl font-bold text-white">
                  ₹{Number(price).toLocaleString("en-IN")}
                </h2>
                <span className="text-lg text-zinc-500 line-through">
                  ₹{Math.round(price * 1.2).toLocaleString("en-IN")}
                </span>
              </div>
              <p className="text-xs text-zinc-500">
                Inclusive of all taxes · Limited time offer
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-4">
              
              {/* ✅ FIXED BUY NOW BUTTON */}
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black py-3 rounded-xl font-bold transition-colors"
              >
                Buy Now
              </button>

              <button
                onClick={handleAddToCart}
                disabled={!in_stock}
                className={`flex-1 py-3 rounded-xl border font-semibold transition-all ${
                  in_stock 
                    ? "bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-white" 
                    : "bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed"
                }`}
              >
                {in_stock ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>

            {/* FEATURES & DESCRIPTION */}
            <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-xl">
              <h3 className="font-semibold mb-2 text-emerald-400">Key Features</h3>
              <p className="text-sm text-zinc-400 whitespace-pre-line leading-relaxed">
                {description || "No description available for this product."}
              </p>
              {product_color && (
                <div className="mt-4 pt-4 border-t border-zinc-800">
                   <p className="text-sm text-zinc-300">
                    <span className="text-zinc-500">Color:</span> {product_color}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* PROMOTIONAL BANNERS */}
        {banner_image.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-center mb-8">
              Product <span className="text-emerald-400">Overview</span>
            </h2>
            <div className="flex flex-col gap-6">
              {banner_image.map((img, i) => (
                <img key={i} src={img} className="rounded-2xl w-full shadow-2xl" alt="overview" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleItem;