import PropTypes from 'prop-types';
import ReviewContext from "./ReviewContext";
import { useState, useEffect, useCallback, useMemo } from "react";
import axios from 'axios';
import API_ENDPOINTS from '../config/api';

const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [reviewsResponse, ordersResponse] = await Promise.all([
          axios.get(API_ENDPOINTS.REVIEWS),
          axios.get(API_ENDPOINTS.ORDERS),
        ]);
        setReviews(Array.isArray(reviewsResponse.data) ? reviewsResponse.data : []);
        setOrders(Array.isArray(ordersResponse.data) ? ordersResponse.data : []);
      } catch (err) {
        console.error('Error fetching reviews/orders:', err);
        setError('Failed to load reviews and orders');
        // Set empty arrays on error to prevent crashes
        setReviews([]);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /**
   * Add a new review
   * @param {Object} newReview - Review object to add
   * @returns {Promise<boolean>} - Success status
   */
  const addReview = useCallback(async (newReview) => {
    if (!newReview || !newReview.productId || !newReview.rating) {
      console.warn('Invalid review data provided');
      return false;
    }

    try {
      const response = await axios.post(API_ENDPOINTS.REVIEWS, newReview);
      if (response.data) {
        setReviews((prevReviews) => [...prevReviews, response.data]);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error adding review:', err);
      return false;
    }
  }, []);

  /**
   * Get reviews for a specific product
   * @param {string} productId - Product ID
   * @returns {Array} - Array of reviews
   */
  const getProductReviews = useCallback((productId) => {
    if (!productId) {
      return [];
    }
    return reviews.filter((review) => String(review.productId) === String(productId));
  }, [reviews]);

  /**
   * Calculate rating statistics for a product
   * @param {string} productId - Product ID
   * @returns {Object} - Rating stats object
   */
  const calculateRatingStats = useCallback((productId) => {
    const productReviews = getProductReviews(productId);
    
    if (productReviews.length === 0) {
      return { 
        averageRating: 0, 
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        totalReviews: 0,
      };
    }

    let totalRating = 0;
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    productReviews.forEach((review) => {
      const rating = parseInt(review.rating, 10);
      if (rating >= 1 && rating <= 5) {
        totalRating += rating;
        ratingDistribution[rating] += 1;
      }
    });

    const averageRating = totalRating / productReviews.length;

    return { 
      averageRating: parseFloat(averageRating.toFixed(1)), 
      ratingDistribution,
      totalReviews: productReviews.length,
    };
  }, [getProductReviews]);

  /**
   * Get total order count for a product
   * @param {string} productId - Product ID
   * @returns {number} - Total order count
   */
  const getOrderCount = useCallback((productId) => {
    if (!productId) {
      return 0;
    }

    return orders.reduce((count, order) => {
      if (!order.cartItems || !Array.isArray(order.cartItems)) {
        return count;
      }
      const productQuantity = order.cartItems
        .filter(item => String(item.productId) === String(productId))
        .reduce((sum, item) => sum + (parseInt(item.quantity, 10) || 0), 0);
      return count + productQuantity;
    }, 0);
  }, [orders]);

  const contextValue = useMemo(() => ({
    addReview,
    getProductReviews,
    calculateRatingStats,
    getOrderCount,
    loading,
    error,
  }), [addReview, getProductReviews, calculateRatingStats, getOrderCount, loading, error]);

  return (
    <ReviewContext.Provider value={contextValue}>
      {children}
    </ReviewContext.Provider>
  );
};

ReviewProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ReviewProvider;

