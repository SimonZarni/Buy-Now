export const getFavouriteCount = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return 0;

    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const userFavorites = favorites.filter(fav => fav.userId === user.id);
    return userFavorites.length;
};
