import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Button from "../components/Button";
import CartContext from "../CartContext";
import Review from "../components/Review";
import { FaHeart } from "react-icons/fa";
import FavoriteContext from "../FavoriteContext";
import ReviewContext from "../ReviewContext";
import { Link } from "react-router-dom";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart, calculateDiscountedPrice } = useContext(CartContext);
  const { toggleFavorite, isFavorite: checkIsFavorite } = useContext(FavoriteContext);
  const { getProductReviews, addReview, calculateRatingStats } = useContext(ReviewContext);
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(1);

  useEffect(() => {
    // axios.get(`http://localhost:3001/products/${id}`)
    axios.get('https://buy-now-jocc.onrender.com/products/${id}')
      .then((response) => {
        setProduct(response.data);
        setLoading(false);

        const productReviews = getProductReviews(id);
        setReviews(productReviews);

        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
          setIsFavorite(checkIsFavorite(response.data.id, user.id));
        }
      })
      .catch((error) => {
        setError("Error fetching data: " + error.message);
        setLoading(false);
      });
  }, [id, getProductReviews, checkIsFavorite]);

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage(null);
        setAlertType(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  const handleAddToCart = () => {
    console.log("Selected Color:", selectedColor);
    console.log("Selected Size:", selectedSize);

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setAlertMessage("You must be logged in to add items to the cart.");
      setAlertType("error");
      return;
    }

    if (product.colors && !selectedColor) {
      setAlertMessage("Please select a color.");
      setAlertType("error");
      return;
    }
    if (product.sizes && !selectedSize) {
      setAlertMessage("Please select a size.");
      setAlertType("error");
      return;
    }
    const productToAdd = { ...product, selectedColor, selectedSize };
    try {
      addToCart(productToAdd);
      setAlertMessage(
        `Added ${product.name} to cart${selectedColor ? ` with color ${selectedColor.name}` : ""
        }${selectedSize ? ` and size ${selectedSize}` : ""}.`
      );
      setAlertType("success");
    } catch (err) {
      setAlertMessage("Failed to add product to cart.");
      setAlertType("error");
    }
  };

  const handleToggleFavorite = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setAlertMessage(
        "You must be logged in to add or remove items from favorites."
      );
      setAlertType("error");
      return;
    }

    const updatedFavoriteStatus = toggleFavorite(product, user.id);
    setIsFavorite(updatedFavoriteStatus);
    setAlertMessage(
      `${updatedFavoriteStatus ? "Added" : "Removed"} ${product.name} ${updatedFavoriteStatus ? "to" : "from"} favorites.`
    );
    setAlertType(updatedFavoriteStatus ? "success" : "error");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

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
