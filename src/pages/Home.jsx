import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import NavContext from "../NavContext";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import { FiZap } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import ReviewContext from "../ReviewContext";
import API_ENDPOINTS from "../config/api";
import { calculateDiscountedPrice } from "../utils/price";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { scrollContainerRef } = useContext(NavContext);
  const { getOrderCount } = useContext(ReviewContext);
  const navigate = useNavigate();

  // Memoize sorted products to avoid re-sorting on every render
  const sortedProducts = useMemo(() => {
    return [...products].sort(
      (a, b) => getOrderCount(b.id) - getOrderCount(a.id)
    );
  }, [products, getOrderCount]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesResponse, productsResponse] = await Promise.all([
          axios.get(API_ENDPOINTS.CATEGORIES),
          axios.get(API_ENDPOINTS.PRODUCTS),
        ]);
        setCategories(categoriesResponse.data);
        setProducts(productsResponse.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCategoryClick = (subcategory) => {
    navigate("/products", {
      state: {
        selectedSubcategory: subcategory.id,
        selectedSubcategoryName: subcategory.name,
      },
    });
  };

  // Flash deal countdown timer
  const targetDate = useMemo(() => new Date("2024-12-31T23:59:59"), []);

  const calculateTimeLeft = useMemo(() => {
    return () => {
      const now = new Date();
      const difference = targetDate - now;

      if (difference > 0) {
        return {
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return { hours: 0, minutes: 0, seconds: 0 };
    };
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  // Carousel items data
  const carouselItems = [
    {
      id: "item1",
      image: "images/bg1.jpg",
      title: "Beauty Collection",
      description: "Discover the latest trends in beauty and skincare.",
    },
    {
      id: "item2",
      image: "images/bg2.jpg",
      title: "Baby Collection",
      description: "Find everything you need for your baby's care.",
    },
    {
      id: "item3",
      image: "images/bg3.jpg",
      title: "Kid Collection",
      description: "Discover the latest trends in Kid Fashion.",
    },
    {
      id: "item4",
      image: "images/bg4.jpg",
      title: "Sport Collection",
      description: "Get the latest updates on mobile phones and gadgets.",
    },
  ];

  // Memoize filtered products with discounts
  const discountedProducts = useMemo(() => {
    return products.filter((product) => product.discount !== undefined);
  }, [products]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error mx-4 mt-4">
        <span>{error}</span>
      </div>
    );
  }

  return (
    <>
      {/* Hero Carousel */}
      <div>
        <div className="carousel w-full" ref={scrollContainerRef}>
          {carouselItems.map((item) => (
            <div key={item.id} id={item.id} className="carousel-item w-full relative">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-[600px] object-cover transition ease-in-out duration-1000 hover:blur-sm"
              />
              <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-60 opacity-0 transition ease-in-out duration-1000 hover:opacity-100 text-white text-center">
                <div className="space-y-5">
                  <h2 className="m-0 text-3xl font-bold">{item.title}</h2>
                  <p className="mt-1 text-base">{item.description}</p>
                  <div>
                    <Link to={"/products"}>
                      <Button
                        value="Shop Now"
                        paddingX={"px-6"}
                        paddingY={"py-3"}
                        width={"w-1/2"}
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex w-full justify-center gap-2 py-2">
          {carouselItems.map((item, index) => (
            <a key={item.id} href={`#${item.id}`} className="btn btn-xs">
              {index + 1}
            </a>
          ))}
        </div>
      </div>

      <div className="space-x-12 space-y-5 bg-gray-50 mx-3 my-5 rounded-xl">
        <h2 className="text-xl font-bold mx-10 uppercase">Categories</h2>
        <div
          className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-5"
          style={{ overflowX: "hidden" }}
        >
          {categories.map((category) => (
            <div key={category.id} className="carousel rounded-box w-64">
              {category.subcategories.map((subcategory) => (
                <div
                  key={subcategory.id}
                  className="carousel-item w-full flex text-center"
                >
                  <div
                    className="flex flex-col"
                    onClick={() => handleCategoryClick(subcategory)}
                  >
                    <img
                      src={subcategory.image_url}
                      className="w-28 h-28 object-cover rounded-lg"
                      alt={subcategory.name}
                    />
                    <p>{subcategory.name}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="space-x-2 space-y-5 bg-gray-100 my-10 mx-5 rounded-xl p-5">
        <div className="grid grid-flow-col gap-3 text-center auto-cols-max items-center">
          <div className="">
            <h3 className="text-xl font-bold uppercase">Flash Deals</h3>
          </div>
          <div className="flex p-2 bg-neutral rounded-box text-neutral-content">
            <span className="countdown font-mono text-2xl">
              <span style={{ "--value": timeLeft.hours }}></span>
            </span>
            h
          </div>
          <div className="flex p-2 bg-neutral rounded-box text-neutral-content">
            <span className="countdown font-mono text-2xl">
              <span style={{ "--value": timeLeft.minutes }}></span>
            </span>
            m
          </div>
          <div className="flex p-2 bg-neutral rounded-box text-neutral-content">
            <span className="countdown font-mono text-2xl">
              <span style={{ "--value": timeLeft.seconds }}></span>
            </span>
            s
          </div>
          <FiZap className="text-2xl text-black font-bold" />
        </div>

        <div className="grid grid-cols-4 gap-10">
          {discountedProducts.map((product) => {
            const discountedPrice = calculateDiscountedPrice(
              product.price,
              product.discount
            );

            return (
              <Link to={`/products/${product.id}`} key={product.id}>
                <Card
                  img={product.image_url}
                  name={product.name}
                  description={product.description}
                  price={product.price}
                  discount={product.discount}
                  discountedPrice={discountedPrice}
                />
              </Link>
            );
          })}
        </div>
      </div>

      <div className="space-x-5 space-y-5 bg-gray-50 mx-5 my-5 rounded-xl overflow-hidden p-5 border-t-8 border-black">
        <h2 className="text-xl font-bold mx-10 uppercase">Top Products</h2>
        <div
          ref={scrollContainerRef}
          className="flex gap-10 overflow-x-auto p-4 no-scrollbar"
        >
          {sortedProducts.map((product, index) => (
            <div
              key={product.id}
              className="w-44 h-44 shadow-md rounded-xl flex-shrink-0"
            >
              <div className="relative h-full w-full">
                <img
                  src={product.image_url}
                  className="object-cover h-full w-full rounded-lg"
                  alt={product.name}
                />
                <div className="absolute top-0 left-0 p-2 text-white font-bold flex items-center">
                  <FaStar className="text-gray-700 mr-1 text-4xl" />
                  <span className="absolute top-1/6 left-5 text-lg">
                    {index + 1}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4 rounded-xl">
                  <p className="text-white truncate">{product.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-x-5 space-y-5 bg-gray-50 mx-5 my-5 p-5">
        <h2 className="text-xl font-bold mx-10 uppercase">Just For You</h2>
        <div className="grid grid-cols-4 gap-10">
          {products.map((product) => {
            const discountedPrice = calculateDiscountedPrice(
              product.price,
              product.discount
            );

            return (
              <Link to={`/products/${product.id}`} key={product.id}>
                <Card
                  img={product.image_url}
                  name={product.name}
                  description={product.description}
                  price={product.price}
                  discount={product.discount}
                  discountedPrice={discountedPrice}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};
export default Home;
