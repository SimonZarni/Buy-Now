import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import FavoriteContext from '../FavoriteContext';


const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [user, setUser] = useState(null);
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    const userId = loggedInUser ? loggedInUser.id : null;
    const { deleteFavorite, deleteAllFavorites } = useContext(FavoriteContext);


    useEffect(() => {
        setUser(loggedInUser);

        if (loggedInUser) {
            const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
            const userFavorites = storedFavorites.filter(fav => fav.userId === loggedInUser.id);
            setFavorites(userFavorites);
        }
    }, []);

    if (!user) {
        return (
            <div className='flex justify-center items-center h-full mt-20'>
                <div>
                    <img src="images/no_favourite.png" className='w-2/3 mx-auto' alt="No favorite products" />
                    <p className="text-center">Please log in to view your favorite products.</p>
                </div>
            </div>
        )
    }

    const handleFavoriteClick = (product) => {
        if (userId) {
            const isNowFavorite = toggleFavorite(product, userId);
        } else {
            alert('You must be logged in to add or remove items from favorites.');
        }
    };

    const handleDeleteFavorite = (productId) => {
        if (userId) {
            deleteFavorite(productId, userId);
            setFavorites(favorites.filter(fav => fav.id !== productId));
        }
    };

    const handleDeleteAllFavorites = () => {
        if (userId) {
            deleteAllFavorites(userId);
            setFavorites([]);
        }
    };

    // return (
    //     <div className="container mx-auto p-8">
    //         <h1 className="text-2xl font-bold mb-6 uppercase mx-2">Favorite Products</h1>
    //         {favorites.length > 0 ? (
    //             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
    //                 {favorites.map(product => {
    //                     const discountedPrice = product.discount
    //                         ? product.price - (product.price * product.discount / 100)
    //                         : product.price;

    //                     return (
    //                         <Link to={`/products/${product.id}`} key={product.id}>
    //                             <Card
    //                                 img={product.image_url}
    //                                 name={product.name}
    //                                 description={product.description}
    //                                 price={product.price}
    //                                 colors={product.colors}
    //                                 sizes={product.sizes}
    //                                 discount={product.discount}
    //                                 discountedPrice={discountedPrice}
    //                             />
    //                         </Link>
    //                     );
    //                 })}
    //             </div>
    //         ) : (
    //             <div className='flex justify-center items-center h-full'>
    //                 <div>
    //                     <img src="images/no_favourite.png" className='w-2/3 mx-auto' alt="No favorite products" />
    //                     <p className="text-center">No favorite products found.</p>
    //                 </div>
    //             </div>
    //         )}
    //     </div>
    // );

    return (
        <div className="container mx-auto p-8">
            <div className="breadcrumbs text-sm mb-2 mx-3">
                <ul>
                    <li><Link to={'/'}>Home</Link></li>
                    <li>Favorites</li>
                </ul>
            </div>
            <h1 className="text-2xl font-bold mb-6 uppercase mx-2">Favorite Products</h1>
            {favorites.length > 0 ? (
                <>
                    <div className="flex justify-end mb-4">
                        <button className="btn" onClick={() => {
                            if (window.confirm('Are you sure to clear all items in your favorites?')) {
                                handleDeleteAllFavorites()
                            }
                        }}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            Clear All Favorites
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
                        {favorites.map(product => {
                            const discountedPrice = product.discount
                                ? product.price - (product.price * product.discount / 100)
                                : product.price;

                            return (
                                <div key={product.id} className="relative">
                                    <Link to={`/products/${product.id}`}>
                                        <Card
                                            img={product.image_url}
                                            name={product.name}
                                            description={product.description}
                                            price={product.price}
                                            colors={product.colors}
                                            sizes={product.sizes}
                                            discount={product.discount}
                                            discountedPrice={discountedPrice}
                                        />
                                    </Link>


                                    <button onClick={() => handleDeleteFavorite(product.id)} className="absolute top-2 right-2 btn btn-circle">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>

                                </div>
                            );
                        })}
                    </div>
                </>
            ) : (
                <div className='flex justify-center items-center h-full'>
                    <div>
                        <img src="images/no_favourite.png" className='w-2/3 mx-auto' alt="No favorite products" />
                        <p className="text-center">No favorite products found.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Favorites;
