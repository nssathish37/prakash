import axios from "axios";
import { useEffect, useState } from "react";
import { SERVER_URL } from "../App";
import ProductCard from "./ProductCard";

const AllProducts = () => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/products`);
      setData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container mx-auto my-10 px-4">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-bold uppercase tracking-wide">
          Our Best Products
        </h1>
      
      </div>

      {/* Horizontal Scrollable Row */}
      <div
        className="
          flex 
          overflow-x-auto 
          gap-4 
          pb-6 
          snap-x 
          snap-mandatory 
          scrollbar-hide
        "
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {data.map((product, index) => (
          <div key={product._id || index} className="snap-start shrink-0">
            <ProductCard {...product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProducts;