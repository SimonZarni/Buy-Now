import PropTypes from 'prop-types';
import FavoriteContext from "./FavoriteContext";
import { useState, useEffect, useCallback, useMemo } from "react";
import { getStorageItem, setStorageItem, STORAGE_KEYS } from "../utils/storage";

const FavoriteProvider = ({ children }) => {
    const [favorites, setFavorites] = useState(() => {
        const storedFavorites = getStorageItem(STORAGE_KEYS.FAVORITES);
        return Array.isArray(storedFavorites) ? storedFavorites : [];
    });
  
    // Persist favorites to localStorage
    useEffect(() => {
        setStorageItem(STORAGE_KEYS.FAVORITES, favorites);
    }, [favorites]);
  
    /**
     * Get favorites for a specific user
     * @param {string} userId - User ID
     * @returns {Array} - User's favorites
     */
    const getUserFavorites = useCallback((userId) => {
        return favorites.filter((fav) => fav.userId === userId);
    }, [favorites]);

    /**
     * Toggle favorite status for a product
     * @param {Object} product - Product to toggle
     * @param {string} userId - User ID
     * @returns {boolean} - New favorite status (true if added, false if removed)
     */
    const toggleFavorite = useCallback((product, userId) => {
        if (!userId || !product?.id) {
            console.warn("Invalid userId or product provided to toggleFavorite");
            return false;
        }

        const userFavorites = getUserFavorites(userId);
        const isProductInFavorites = userFavorites.some((fav) => fav.id === product.id);
  
        let updatedUserFavorites;
        if (isProductInFavorites) {
            updatedUserFavorites = userFavorites.filter((fav) => fav.id !== product.id);
        } else {
            const productWithUserId = { ...product, userId };
            updatedUserFavorites = [...userFavorites, productWithUserId];
        }
  
        const updatedFavorites = [
            ...favorites.filter((fav) => fav.userId !== userId),
            ...updatedUserFavorites,
        ];
  
        setFavorites(updatedFavorites);
        return !isProductInFavorites;
    }, [favorites, getUserFavorites]);

    /**
     * Delete a specific favorite
     * @param {string} productId - Product ID to remove
     * @param {string} userId - User ID
     */
    const deleteFavorite = useCallback((productId, userId) => {
        if (!userId || !productId) {
            console.warn("Invalid userId or productId provided to deleteFavorite");
            return;
        }

        const updatedFavorites = favorites.filter(
            fav => fav.userId !== userId || fav.id !== productId
        );
        setFavorites(updatedFavorites);
    }, [favorites]);

    /**
     * Delete all favorites for a user
     * @param {string} userId - User ID
     */
    const deleteAllFavorites = useCallback((userId) => {
        if (!userId) {
            console.warn("Invalid userId provided to deleteAllFavorites");
            return;
        }

        const updatedFavorites = favorites.filter(fav => fav.userId !== userId);
        setFavorites(updatedFavorites);
    }, [favorites]);
  
    /**
     * Check if a product is in user's favorites
     * @param {string} productId - Product ID
     * @param {string} userId - User ID
     * @returns {boolean} - Is favorite
     */
    const isFavorite = useCallback((productId, userId) => {
        if (!userId || !productId) {
            return false;
        }
        const userFavorites = getUserFavorites(userId);
        return userFavorites.some((fav) => fav.id === productId);
    }, [getUserFavorites]);
  
    const contextValue = useMemo(() => ({
        toggleFavorite,
        isFavorite,
        deleteAllFavorites,
        deleteFavorite,
    }), [toggleFavorite, isFavorite, deleteAllFavorites, deleteFavorite]);

    return (
        <FavoriteContext.Provider value={contextValue}>
            {children}
        </FavoriteContext.Provider>
    );
};

FavoriteProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default FavoriteProvider;