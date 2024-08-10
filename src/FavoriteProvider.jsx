import FavoriteContext from "./FavoriteContext";
import { useState,useEffect } from "react";

const FavoriteProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);
  
    useEffect(() => {
      const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
      setFavorites(storedFavorites);
    }, []);
  
    const toggleFavorite = (product, userId) => {
      let userFavorites = favorites.filter((fav) => fav.userId === userId);
      const isProductInFavorites = userFavorites.some((fav) => fav.id === product.id);
  
      if (isProductInFavorites) {
        userFavorites = userFavorites.filter((fav) => fav.id !== product.id);
      } else {
        const productWithUserId = { ...product, userId };
        userFavorites.push(productWithUserId);
      }
  
      const updatedFavorites = favorites
        .filter((fav) => fav.userId !== userId)
        .concat(userFavorites);
  
      setFavorites(updatedFavorites);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      return !isProductInFavorites;
    };

    const deleteFavorite = (productId, userId) => {
      const updatedFavorites = favorites
          .filter(fav => fav.userId !== userId || fav.id !== productId);
      setFavorites(updatedFavorites);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const deleteAllFavorites = (userId) => {
      const updatedFavorites = favorites.filter(fav => fav.userId !== userId);
      setFavorites(updatedFavorites);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };
  
    const isFavorite = (productId, userId) => {
      const userFavorites = favorites.filter((fav) => fav.userId === userId);
      return userFavorites.some((fav) => fav.id === productId);
    };
  
    return (
      <FavoriteContext.Provider value={{ toggleFavorite, isFavorite,deleteAllFavorites,deleteFavorite }}>
        {children}
      </FavoriteContext.Provider>
    );
  };
export default FavoriteProvider