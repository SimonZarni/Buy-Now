import React, { useEffect, useState, useContext, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Button from "../components/Button";
import CartContext from "../CartContext";
import Review from "../components/Review";
import { FaHeart } from "react-icons/fa";
import FavoriteContext from "../FavoriteContext";
import ReviewContext from "../ReviewContext";
import { Link } from "react-router-dom";
import API_ENDPOINTS from "../config/api";
import { getCurrentUser } from "../utils/storage";
import { isUserLoggedIn } from "../utils/validation";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart, calculateDiscountedPrice } = useContext(CartContext);
  const { toggleFavorite, isFavorite: checkIsFavorite } = useContext(FavoriteContext);
  const { getProductReviews, calculateRatingStats } = useContext(ReviewContext);
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError("Invalid product ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(API_ENDPOINTS.PRODUCT_BY_ID(id));
        
        if (!response.data) {
          throw new Error("Product not found");
        }

        setProduct(response.data);

        const productReviews = getProductReviews(id);
        setReviews(productReviews);

        const user = getCurrentUser();
        if (user) {
          setIsFavorite(checkIsFavorite(response.data.id, user.id));
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.response?.status === 404 
          ? "Product not found" 
          : "Failed to load product. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, getProductReviews, checkIsFavorite]);

  // Auto-dismiss alert messages
  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage(null);
        setAlertType(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  /**
   * Show alert message
   * @param {string} message - Alert message
   * @param {string} type - Alert type ('success' or 'error')
   */
  const showAlert = useCallback((message, type = "error") => {
    setAlertMessage(message);
    setAlertType(type);
  }, []);

  /**
   * Handle add to cart
   */
  const handleAddToCart = useCallback(() => {
    if (!product) {
      showAlert("Product information is not available.", "error");
      return;
    }

    if (!isUserLoggedIn()) {
      showAlert("You must be logged in to add items to the cart.", "error");
      return;
    }

    // Validate required selections
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      showAlert("Please select a color.", "error");
      return;
    }
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      showAlert("Please select a size.", "error");
      return;
    }

    try {
      const productToAdd = { ...product, selectedColor, selectedSize };
      addToCart(productToAdd);
      
      const colorText = selectedColor ? ` with color ${selectedColor.name}` : "";
      const sizeText = selectedSize ? ` and size ${selectedSize}` : "";
      showAlert(`Added ${product.name} to cart${colorText}${sizeText}.`, "success");
    } catch (err) {
      console.error("Error adding to cart:", err);
      showAlert("Failed to add product to cart. Please try again.", "error");
    }
  }, [product, selectedColor, selectedSize, addToCart, showAlert]);

  /**
   * Handle toggle favorite
   */
  const handleToggleFavorite = useCallback(() => {
    if (!product) {
      showAlert("Product information is not available.", "error");
      return;
    }

    if (!isUserLoggedIn()) {
      showAlert("You must be logged in to add or remove items from favorites.", "error");
      return;
    }

    try {
      const user = getCurrentUser();
      const updatedFavoriteStatus = toggleFavorite(product, user.id);
      setIsFavorite(updatedFavoriteStatus);
      
      const action = updatedFavoriteStatus ? "Added" : "Removed";
      const preposition = updatedFavoriteStatus ? "to" : "from";
      showAlert(`${action} ${product.name} ${preposition} favorites.`, updatedFavoriteStatus ? "success" : "error");
    } catch (err) {
      console.error("Error toggling favorite:", err);
      showAlert("Failed to update favorites. Please try again.", "error");
    }
  }, [product, toggleFavorite, showAlert]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto p-4">
        <div className="alert alert-error">
          <span>{error || "Product not found"}</span>
        </div>
        <Link to="/products" className="btn btn-primary mt-4">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {alertMessage && (
        <div
          role="alert"
          className={`alert ${alertType === "success" ? "bg-green-200" : "bg-red-400 text-white"
            }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={
                alertType === "success"
                  ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  : "M6 18L18 6M6 6l12 12"
              }
            />
          </svg>
          <span>{alertMessage}</span>
        </div>
      )}
      <div className="breadcrumbs text-sm mx-5">
        <ul>
          <li><Link to={'/'}>Home</Link></li>
          <li><Link to={'/products'}>Products</Link></li>
          <li>Product Details</li>
        </ul>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col lg:flex-row w-full">
        <div className="max-h-screen w-full lg:w-1/2 flex items-center justify-center mb-6 lg:mb-0">
          <img
            className="h-full w-full object-cover object-center"
            src={product.image_url}
            alt={product.name}
          />
        </div>
        <div className="lg:ml-6 flex w-full lg:w-1/2">
          <div className="flex flex-col p-3">
            <div className="flex justify-between">
              <h2 className="text-2xl font-semibold mb-2">{product.name}</h2>
              <div className="tooltip tooltip-top" data-tip="Add To Favorite">
                <button
                  onClick={handleToggleFavorite}
                  className="flex items-center space-x-2 text-gray-400"
                >
                  <FaHeart className={`h-7 w-7 flex-shrink-0 transform transition-transform duration-200 ${isFavorite ? 'text-black' : 'text-gray-400'} group-hover:text-gray-500`}></FaHeart>
                </button>
              </div>
            </div>
            {product.discount ? (
              <div className="flex space-x-4">
                <p className="text-xl font-bold mb-4">{calculateDiscountedPrice(product)}</p>
                <div>
                  <p className="text-sm bg-black text-white uppercase flex items-center px-2 rounded-lg py-1">Save to {product.discount}% Off</p>
                </div>
                <p className="text-lg text-gray-400 mb-4 line-through">${product.price.toFixed(2)}</p>
              </div>
            ) :
              <p className="text-xl font-bold mb-4">${product.price.toFixed(2)}</p>
            }

            {product.colors && product.colors.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Colors:</h3>
                <div className="flex space-x-2">
                  {product.colors.map((color) => (
                    <div
                      key={color.code}
                      className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors duration-200 ${selectedColor === color
                        ? "border-black"
                        : "border-white hover:border-gray-800"
                        }`}
                    >
                      <button
                        style={{ backgroundColor: color.code }}
                        className="w-6 h-6 rounded-full border border-gray-500"
                        onClick={() => setSelectedColor(color)}
                      ></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Sizes:</h3>
                <div className="flex space-x-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={`text-gray-700 border border-black px-4 py-2 rounded transition-colors duration-200 ${selectedSize === size
                        ? "bg-black text-white"
                        : "hover:bg-black hover:text-white"
                        }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="my-8 space-y-6">
              <Button
                value="Add To Cart"
                width={"w-2/3"}
                paddingX={"px-6"}
                paddingY={"py-3"}
                onClick={handleAddToCart}
              />
              <h2 className="text-2xl font-semibold uppercase">Description</h2>
              <p className="text-gray-700 mb-4">{product.description}</p>
            </div>


          </div>
        </div>
      </div>
      <Review
        product={product}
        reviews={reviews}
        setReviews={setReviews}
      />
    </div>
  );
};

export default ProductDetail;
