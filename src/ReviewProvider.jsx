import ReviewContext from "./ReviewContext";
import { useState, useEffect } from "react";
import axios from 'axios';

const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('http://localhost:3001/reviews');
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:3001/orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchReviews();
    fetchOrders();
  }, []);

  const addReview = async (newReview) => {
    try {
      const response = await axios.post('http://localhost:3001/reviews', newReview);
      setReviews([...reviews, response.data]);
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  const getProductReviews = (productId) => {
    return reviews.filter((review) => review.productId === productId);
  };

  const calculateRatingStats = (productId) => {
    const productReviews = getProductReviews(productId);
    if (productReviews.length === 0)
      return { averageRating: 0, ratingDistribution: {} };

    let totalRating = 0;
    let ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    productReviews.forEach((review) => {
      totalRating += review.rating;
      ratingDistribution[review.rating] += 1;
    });

    const averageRating = totalRating / productReviews.length;

    return { averageRating: parseFloat(averageRating.toFixed(1)), ratingDistribution };
  };

  const getOrderCount = (productId) => {
    return orders.reduce((count, order) => {
      const productQuantity = order.cartItems
        .filter(item => item.productId === productId)
        .reduce((sum, item) => sum + item.quantity, 0);
      return count + productQuantity;
    }, 0);
  };
  

  return (
    <ReviewContext.Provider value={{ addReview, getProductReviews, calculateRatingStats, getOrderCount }}>
      {children}
    </ReviewContext.Provider>
  );
};

export default ReviewProvider;

