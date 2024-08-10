import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaStar, FaSearch } from "react-icons/fa";
import Button from "./Button";

const Review = ({ product }) => {
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(1);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("date"); // default sort by date

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/reviews?productId=${product.id}`);
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [product.id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setAlertMessage("You must be logged in to submit a review.");
      setAlertType("error");
      return;
    }

    const newReview = {
      productId: product.id,
      userId: user.id,
      username: user.username,
      reviewText: reviewText,
      rating: rating,
      date: new Date().toISOString(),
    };

    try {
      const response = await axios.post("http://localhost:3001/reviews", newReview);
      setReviews([...reviews, response.data]);
      setReviewText("");
      setRating(1);
      setAlertMessage("Review submitted successfully!");
      setAlertType("success");
    } catch (error) {
      console.error("Error submitting review:", error);
      setAlertMessage("Error submitting review.");
      setAlertType("error");
    }
  };

  const calculateRatingStats = () => {
    if (reviews.length === 0)
      return { averageRating: 0, ratingDistribution: {} };

    let totalRating = 0;
    let ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    reviews.forEach((review) => {
      totalRating += review.rating;
      ratingDistribution[review.rating] += 1;
    });

    const averageRating = totalRating / reviews.length;

    return { averageRating: averageRating.toFixed(1), ratingDistribution };
  };

  const { averageRating, ratingDistribution } = calculateRatingStats();

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleSortChange = (e) => setSortOption(e.target.value);

  const filteredReviews = reviews
    .filter(review => review.reviewText.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortOption === "rating") {
        return b.rating - a.rating;
      } else if (sortOption === "date") {
        return new Date(b.date) - new Date(a.date);
      }
      return 0;
    });

  return (
    <div className="p-3 max-w-5xl mx-auto">

      <div className="mt-6 p-5 border rounded-lg bg-white shadow-sm">
        <h2 className="text-xl font-bold my-4 uppercase">Review Summary</h2>
        <div className="mt-4 flex items-center">
          <div className="flex items-center text-black">
            {[...Array(5)].map((_, index) => (
              <FaStar key={index} className={index < averageRating ? "text-black" : "text-gray-300"} />
            ))}
          </div>
          <p className="ml-2 text-lg font-semibold">{averageRating} / 5</p>
        </div>
        <p className="text-gray-700 mt-2">Total Reviews: {reviews.length}</p>

        <div className="mt-4">
          {Object.entries(ratingDistribution).map(([rating, count]) => (
            <div key={rating} className="flex items-center mt-2">
              <div className="flex">
                <span className="mr-2 text-sm">{rating}</span>
                <FaStar className="text-black mr-5" style={{ marginTop: '3px' }} />
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-4">
                <div
                  className="bg-black h-full rounded-full"
                  style={{ width: `${(count / reviews.length) * 100}%` }}
                ></div>
              </div>
              {count > 0 && (
                <span className="ml-2 text-sm">{((count / reviews.length) * 100).toFixed(1)}%</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-bold my-4 uppercase">Write Review</h2>
        <form onSubmit={handleSubmitReview} className="space-y-4 mt-2">
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows="4"
            className="w-full border border-gray-300 p-3 rounded-lg"
            placeholder="Write your review here"
          />
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((rate) => (
              <FaStar
                key={rate}
                onClick={() => setRating(rate)}
                className={`cursor-pointer ${rating >= rate ? "text-black" : "text-gray-300"}`}
                size={24}
              />
            ))}
          </div>
          <Button
            value="Submit Review"
            type="submit"
            width={"w-full"}
            paddingX={"px-6"}
            paddingY={"py-3"}
          />
        </form>
      </div>
      {alertMessage && (
        <div
          role="alert"
          className={`p-4 rounded-lg mb-4 ${alertType === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={alertType === "success" ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" : "M6 18L18 6M6 6l12 12"}
                />
              </svg>
            </div>
            <div className="ml-3 text-sm">
              <p>{alertMessage}</p>
            </div>
          </div>
        </div>
      )}
      <div className="flex my-5">
        <h2 className="text-xl font-bold my-4 uppercase">Review</h2>
        <div className="my-4 flex w-full items-end justify-end space-x-3">
          <div className="relative">
            <FaSearch className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="relative">
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="p-2 border border-gray-300 rounded-lg"
            >
              <option value="date">Sort by Date</option>
              <option value="rating">Sort by Rating</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {filteredReviews.length > 0 ? (
          (showAllReviews ? filteredReviews : filteredReviews.slice(0, 3)).map((review) => (
            <div key={review.date} className="p-4 border rounded-lg shadow-sm bg-white">
              <div className="flex space-x-4">
                <h3 className="text-lg font-semibold">{review.username}</h3>
                <p className="text-gray-500 text-sm mt-1">{new Date(review.date).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center space-x-1 text-black mt-2">
                {[...Array(5)].map((_, index) => (
                  <FaStar key={index} className={index < review.rating ? "text-black" : "text-gray-300"} />
                ))}
              </div>
              <p className="text-gray-700 mt-2">{review.reviewText}</p>
            </div>
          ))
        ) : (
          <p>No reviews found.</p>
        )}
      </div>

      {reviews.length > 3 && (
        <button
          onClick={() => setShowAllReviews(!showAllReviews)}
          className="mt-4 text-black font-semibold"
        >
          {showAllReviews ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
};

export default Review;
