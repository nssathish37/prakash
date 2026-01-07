import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import demoProducts from "../../DB/product.json";

const USE_DEMO_DATA = true;

const Personalized = () => {
  const [data, setData] = useState([]);
  const category = localStorage.getItem("category");

  const fetchData = async () => {
    if (USE_DEMO_DATA) {
      let products = demoProducts.products || [];

      if (category) {
        const filtered = products.filter(
          (p) => p.category?.toLowerCase() === category.toLowerCase()
        );
        products = filtered.length ? filtered : products;
      }

      setTimeout(() => setData(products), 300);
    }
  };

  useEffect(() => {
    fetchData();
  }, [category]);

  if (!data.length) return null;

  return (
    <>
      {/* 🔹 INTERNAL CSS */}
      <style>
        {`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }

          .no-scrollbar {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
        `}
      </style>

      <div className="container mx-auto my-10 px-4">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight">
            Recommendations for You
          </h2>
          
        </div>

        {/* HORIZONTAL SCROLL (NO SCROLLBAR) */}
        <div
          className="
            flex gap-3 sm:gap-6
            overflow-x-auto overflow-y-hidden
            scroll-smooth snap-x
            no-scrollbar
            pb-4
          "
        >
          {data.map((product) => (
            <ProductCard key={product._id} {...product} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Personalized;
