import { FaStar, FaHeart } from "react-icons/fa";
const Card = (props) => {

    const handleFavoriteClick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        props.onFavoriteClick(props.product);
    };


    const price = parseFloat(props.price) || 0;
    const discountedPrice = parseFloat(props.discountedPrice) || price;

    return (
        <div className="shadow-md rounded-xl overflow-hidden relative z-0">
            <div className="relative group">
                <img
                    src={props.img}
                    className="w-full h-64 object-cover rounded-t-xl transition-transform transform group-hover:scale-105"
                    alt={props.name}
                />
                {props.discount && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-sm font-bold px-2 py-1 rounded">
                        {props.discount}% OFF
                    </div>
                )}
                {props.onFavoriteClick && (

                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                            onClick={handleFavoriteClick}
                            className="flex items-center space-x-2 text-gray-400"
                        >
                            <FaHeart className={`h-7 w-7 flex-shrink-0 transform transition-transform duration-200 ${props.isFavorite ? 'text-red-600' : 'text-gray-300'}`}></FaHeart>
                        </button>
                    </div>
                )}
            </div>
            <div className="p-4 bg-white">
                <p className="text-lg font-semibold text-gray-800 truncate">{props.name}</p>
                <p className="text-sm text-gray-500 truncate mb-2">{props.description}</p>
                <div className="flex justify-between">
                    <div>
                        {props.sizes && props.sizes.length > 0 && (
                            <div className="my-2">
                                <div className="flex space-x-2">
                                    {props.sizes.map((size) => (
                                        <span key={size} className="inline-block px-2 py-1 border border-gray-500 rounded">
                                            {size}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {props.colors && props.colors.length > 0 ? (
                            props.colors.map((color) => (
                                <span
                                    key={color.code}
                                    className="inline-block w-6 h-6 rounded-full border border-gray-500 mr-2"
                                    style={{ backgroundColor: color.code }}
                                    title={color.name}
                                ></span>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500"></p>
                        )}

                        {props.discount ? (
                            <div className="flex space-x-3">
                                <p className="text-xl font-bold text-red-600">${discountedPrice.toFixed(2)}</p>
                                <p className="text-lg font-semibold text-gray-400 line-through">${price.toFixed(2)}</p>
                            </div>
                        ) : (
                            <p className="text-xl font-bold text-gray-900">${price.toFixed(2)}</p>
                        )}
                    </div>
                    {(props.averageRating > 0 || props.orderCount > 0) && (
                        <div className="flex items-center mb-2">
                            {props.averageRating > 0 && (
                                <div className="flex">
                                    <p className="text-sm font-semibold text-gray-800 mx-2">
                                        {props.averageRating}
                                    </p>
                                    <span className="text-black text-xl"><FaStar /></span>
                                </div>
                            )}
                            {props.orderCount > 0 && (
                                <p className="text-sm text-gray-500 ml-2">({props.orderCount}+ Sold)</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Card;

