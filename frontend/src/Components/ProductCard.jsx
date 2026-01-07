import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const ProductCard = ({
  _id,
  product_title,
  price,
  originalPrice,
  product_image,
  rating,
}) => {
  const [isWished, setIsWished] = useState(false);

  const toggleWishlist = (e) => {
    e.preventDefault();
    setIsWished(!isWished);
  };

  return (
    // Responsive width: w-40 for mobile, sm:w-64 for desktop
    <div className="relative group shrink-0 snap-start">
      {/* Wishlist Heart - Scaled down for mobile */}
      <button
        onClick={toggleWishlist}
        className="absolute top-2 right-2 sm:top-4 sm:right-6 z-10 transition-transform active:scale-125"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill={isWished ? "#ef4444" : "none"}
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke={isWished ? "#ef4444" : "white"}
          className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-md"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
          />
        </svg>
      </button>

      <Link to={`/product/${_id}`}>
        {/* Responsive padding and height */}
        <div className="w-[165px] sm:w-64 bg-[#121212] border border-white/5 rounded-xl sm:rounded-2xl p-2 sm:p-4 hover:bg-white/10 transition-all flex flex-col justify-between min-h-[280px] sm:min-h-[400px]">
          
          {/* Image Section - Smaller on mobile */}
          <div className="bg-transparent rounded-lg overflow-hidden h-32 sm:h-52 flex items-center justify-center mb-2 sm:mb-4">
            {product_image?.length > 0 && (
              <img
                src={product_image[0]}
                className="max-h-full object-contain transition-transform group-hover:scale-105"
                alt={product_title}
              />
            )}
          </div>

          {/* Details Section */}
          <div className="flex flex-col gap-1 sm:gap-2">
            {/* Smaller text on mobile */}
            <h1 className="text-[12px] sm:text-[15px] leading-tight font-medium line-clamp-2 min-h-[32px] sm:min-h-[40px] text-white/90">
              {product_title}
            </h1>

            {/* Price - Stacked or smaller on mobile */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-2">
              <span className="text-sm sm:text-xl font-bold text-white">
                ₹{price.toLocaleString("en-IN")}
              </span>
              {originalPrice && (
                <span className="text-[10px] sm:text-sm text-gray-500 line-through">
                  ₹{originalPrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>

            {/* Stars - Scaled down */}
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-3 h-3 sm:w-4 sm:h-4 ${
                    i < Math.floor(rating) ? "text-green-500 fill-green-500" : "text-gray-600 fill-gray-600"
                  }`}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;