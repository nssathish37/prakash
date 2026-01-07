import { useEffect, useState } from "react";
import "react-multi-carousel/lib/styles.css";
import axios from "axios";
import Carousel from "react-multi-carousel";
import { Link } from "react-router-dom";
import { SERVER_URL } from "../App";
import Loading from "./Loading";
import categoriesData from "../../DB/categories.json";

//  SWITCH MODE
const USE_DEMO_DATA = true; 

const CategorySlider = () => {
  const [data, setData] = useState([]);
  const [latestLaunches, setLatestLaunches] = useState([]); // New state for banners
  const [isLoading, setIsLoading] = useState(false);

  const getData = async () => {
    setIsLoading(true);

    if (USE_DEMO_DATA) {
      setTimeout(() => {
        setData(categoriesData.categories);
        // Simulating banner data - Replace with your real JSON/API source
        setLatestLaunches([
          { id: 1, image: "https://via.placeholder.com/1200x400?text=Summer+Collection+Launch", link: "/new-arrival" },
          { id: 2, image: "https://via.placeholder.com/1200x400?text=Winter+Essentials+Launch", link: "/winter-store" }
        ]);
        setIsLoading(false);
      }, 800);
      return;
    }

    try {
      // const res = await axios.get(`${SERVER_URL}/category`);
      // setData(res.data.categories);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const responsive = {
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 10, slidesToSlide: 10 },
    tablet: { breakpoint: { max: 1024, min: 464 }, items: 9, slidesToSlide: 9 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1, slidesToSlide: 1 }
  };

  const getMobileRows = () => {
    const firstRow = data.slice(0, 5);
    const secondRow = data.slice(5, 10);
    return [firstRow, secondRow];
  };

  return (
    <div className="container py-4">
      {/* 1. CATEGORIES SECTION */}
      <center><h2 className="text-2xl font-bold mb-4">CATEGORIES</h2></center>
      
      {isLoading && (
        <div className="flex items-center justify-center h-48">
          <Loading text="Loading..." />
        </div>
      )}

      {/* Desktop & Tablet Carousel */}
      {!isLoading && (
        <div className="hidden sm:block mb-10">
          <Carousel responsive={responsive} infinite arrows={true} renderButtonGroupOutside={true}>
            {data.map((e, index) => (
              <div key={index} className="px-2 text-center">
                <Link to={`/${e.category}`}>
                  <img src={e.category_image} alt={e.category} className="w-full object-contain rounded-lg" />
                  <p className="mt-2 text-sm font-medium">{e.category}</p>
                </Link>
              </div>
            ))}
          </Carousel>
        </div>
      )}

      {/* Mobile 2 Rows Grid */}
      {!isLoading && (
        <div className="sm:hidden mt-4 mb-10">
          {getMobileRows().map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-5 gap-4 mb-4">
              {row.map((e, index) => (
                <Link key={index} to={`/${e.category}`} className="text-center">
                  <img src={e.category_image} alt={e.category} className="w-20 h-20 object-contain rounded-full bg-gray-100 p-2" />
                  <p className="mt-1 text-[10px] font-medium truncate">{e.category}</p>
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}

      <hr className="my-8 border-gray-200" />

      {/* LATEST LAUNCH SECTION (Single Banner) */}
        {!isLoading && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold uppercase tracking-wider">
                Latest Launch
              </h2>
            </div>

            <div className="overflow-hidden rounded-xl shadow-md transition-transform duration-300 hover:scale-[1.01]">
              <Link to="/latest-launch">
                <img
                  src="../src/assets/images/latest_lunch.png"
                  alt="Latest Launch Banner"
              className="w-full h-[280px] md:h-[280px] object-cover rounded-xl"
                />
              </Link>
            </div>
          </div>
        )}

    </div>
  );
};

export default CategorySlider;