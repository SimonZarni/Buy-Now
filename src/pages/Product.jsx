import React, { useContext, useEffect, useState } from 'react';
import Card from '../components/Card';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import ReviewContext from '../ReviewContext';
import FavoriteContext from '../FavoriteContext';

const Product = () => {
    const [sortOption, setSortOption] = useState('');

    const { toggleFavorite, isFavorite } = useContext(FavoriteContext);
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user ? user.id : null;

    const { calculateRatingStats, getOrderCount } = useContext(ReviewContext)
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [filter, setFilter] = useState({
        query: '',
        colors: [],
        sizes: [],
        brands: [],
        subcategories: [],
        minPrice: '0',
        maxPrice: '5000'
    });

    useEffect(() => {
        axios.get('http://localhost:3001/products')
            .then(response => setProducts(response.data))
            .catch(error => console.error("Error fetching data: ", error));

        axios.get('http://localhost:3001/categories')
            .then(response => {
                setCategories(response.data);
                const allSubcategories = response.data.flatMap(category => category.subcategories);
                setSubcategories(allSubcategories);
            })
            .catch(error => console.error("Error fetching categories: ", error));


        axios.get('http://localhost:3001/brands')
            .then(response => setBrands(response.data))
            .catch(error => console.error("Error fetching data: ", error));
    }, []);

    useEffect(() => {
        if (location.state?.selectedSubcategory) {
            setFilter(prevState => ({
                ...prevState,
                subcategories: [String(location.state.selectedSubcategory)]
            }));
            console.log(`Navigated with Subcategory: ${location.state.selectedSubcategoryName} (ID: ${location.state.selectedSubcategory})`);
        }
    }, [location.state]);


    const handleFavoriteClick = (product) => {
        if (userId) {
            const isNowFavorite = toggleFavorite(product, userId);
        } else {
            alert('You must be logged in to add or remove items from favorites.');
        }
    };


    const handleFilterChange = (e) => {
        const { name, value, checked } = e.target;
        if (name === 'colors' || name === 'sizes' || name === 'brands' || name === 'subcategories') {
            setFilter(prevState => {
                const newValues = checked
                    ? [...prevState[name], value]
                    : prevState[name].filter(item => item !== value);
                return { ...prevState, [name]: newValues };
            });
        } else {
            setFilter(prevState => ({ ...prevState, [name]: value }));
        }
    };

    const handleMinPriceChange = (e) => {
        const value = e.target.value === '' ? '' : parseInt(e.target.value);
        if (value === '' || (value >= 0 && value <= parseInt(filter.maxPrice))) {
            setFilter(prevState => ({ ...prevState, minPrice: value }));
        }
    };

    const handleMaxPriceChange = (e) => {
        const value = e.target.value === '' ? '' : parseInt(e.target.value);
        if (value === '' || (value >= parseInt(filter.minPrice) && value <= 5000)) {
            setFilter(prevState => ({ ...prevState, maxPrice: value }));
        }
    };

    const clearFilters = () => {
        setFilter({
            query: '',
            colors: [],
            sizes: [],
            brands: [],
            subcategories: [],
            minPrice: '0',
            maxPrice: '5000'
        });
        setSortOption('');
    };


    const filteredProducts = products.filter(product => {
        const category = categories.find(cat => String(cat.id) === String(product.category_id));
        const subcat = subcategories.find(sub => sub.id === product.subcategory_id);
        const brandObj = brands.find(br => br.name === product.brand);

        return (
            (!filter.query ||
                product.name.toLowerCase().includes(filter.query.toLowerCase()) ||
                (category && category.name.toLowerCase().includes(filter.query.toLowerCase())) ||
                (subcat && subcat.name.toLowerCase().includes(filter.query.toLowerCase())) ||
                (brandObj && brandObj.name.toLowerCase().includes(filter.query.toLowerCase()))
            ) &&
            (filter.colors.length === 0 || product.colors?.some(c => filter.colors.includes(c.code))) &&
            (filter.sizes.length === 0 || product.sizes?.some(size => filter.sizes.includes(size))) &&
            (filter.brands.length === 0 || filter.brands.includes(product.brand)) &&
            (filter.subcategories.length === 0 || filter.subcategories.includes(String(product.subcategory_id))) &&
            (product.price >= filter.minPrice) &&
            (product.price <= filter.maxPrice)
        );
    });


    const getUniqueColors = (products) => {
        let uniqueColors = [];
        let colorSet = new Set();

        products.forEach(product => {
            if (product.colors) {
                product.colors.forEach(color => {
                    if (!colorSet.has(color.code)) {
                        colorSet.add(color.code);
                        uniqueColors.push(color);
                    }
                });
            }
        });

        return uniqueColors;
    };

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        const { averageRating: aRating } = calculateRatingStats(a.id);
        const { averageRating: bRating } = calculateRatingStats(b.id);
        const aOrderCount = getOrderCount(a.id);
        const bOrderCount = getOrderCount(b.id);
        switch (sortOption) {
            case 'price-asc':
                return a.price - b.price;
            case 'price-desc':
                return b.price - a.price;
            case 'rating-asc':
                return aRating - bRating;
            case 'rating-desc':
                return bRating - aRating;
            case 'order-asc':
                return aOrderCount - bOrderCount;
            case 'order-desc':
                return bOrderCount - aOrderCount;
            default:
                return 0;
        }
    });

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    return (
        <>
            <div className="breadcrumbs text-sm px-10 mt-4">
                <ul>
                    <li><Link to={'/'}>Home</Link></li>
                    <li>Products</li>
                </ul>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4  rounded-xl p-6">
                <div className="col-span-2">
                    <div className='px-5'>
                        <div className="flex justify-between mb-3 items-center">
                            <h2 className="font-bold text-lg mb-2 uppercase">Filters</h2>
                            <div className="tooltip tooltip-left" data-tip="Clear Filter">
                                <button className="btn btn-circle text-sm" onClick={clearFilters}>
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
                        </div>
                        <input type="text" placeholder="Search products..." name='query' value={filter.query} onChange={handleFilterChange} className="input input-bordered w-full" />
                    </div>
                    <div className="mb-5">
                        <h3 className="font-semibold uppercase mb-2 collapse-title">Sorts</h3>
                        <div className="mx-5">
                            <label className="form-control w-full">
                                <select className="select select-bordered" onChange={handleSortChange} value={sortOption}>
                                    <option disabled value="">Sort By</option>
                                    <option value="price-asc">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                    <option value="rating-desc">Rating: High to Low</option>
                                    <option value="rating-asc">Rating: Low to High</option>
                                    <option value="order-desc">Order Count: High to Low</option>
                                    <option value="order-asc">Order Count: Low to High</option>
                                </select>
                            </label>
                        </div>
                    </div>

                    <div className="mb-4 collapse collapse-plus">
                        <input type="radio" name="my-accordion-3" defaultChecked />
                        <h3 className="font-semibold uppercase mb-2 collapse-title">Price Range</h3>
                        <div className="flex space-x-2 collapse-content">
                            <input
                                type="number"
                                name="minPrice"
                                min="0"
                                max="5000"
                                value={filter.minPrice}
                                onChange={handleMinPriceChange}
                                className="input input-bordered w-full"
                            />
                            <input
                                type="number"
                                name="maxPrice"
                                min="0"
                                max="5000"
                                value={filter.maxPrice}
                                onChange={handleMaxPriceChange}
                                className="input input-bordered w-full"
                            />
                        </div>
                    </div>

                    <div className="mb-4 collapse collapse-plus">
                        <input type="radio" name="my-accordion-3" />
                        <h3 className="collapse-title uppercase font-semibold mb-2">Color</h3>
                        <div className="collapse-content flex flex-col">
                            {getUniqueColors(products).map(color => (
                                <label key={color.code} className="flex items-center mr-4 mb-2">
                                    <input
                                        type="checkbox"
                                        name="colors"
                                        value={color.code}
                                        onChange={handleFilterChange}
                                        checked={filter.colors.includes(color.code)}
                                        className="mr-2"
                                    />
                                    <span className="rounded-full border border-gray-500 p-3" style={{ backgroundColor: color.code }}></span>
                                    <span className="ml-2">{color.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="mb-4 collapse collapse-plus">
                        <input type="radio" name="my-accordion-3" />
                        <h3 className="collapse-title uppercase font-semibold mb-2">Size</h3>
                        <div className="collapse-content flex flex-wrap">
                            {['S', 'M', 'L', 'XL'].map(size => (
                                <label key={size} className="inline-flex items-center mr-4 mb-2">
                                    <input
                                        type="checkbox"
                                        name="sizes"
                                        value={size}
                                        onChange={handleFilterChange}
                                        checked={filter.sizes.includes(size)}
                                        className="mr-2"
                                    />
                                    {size}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="mb-4 collapse collapse-plus">
                        <input type="radio" name="my-accordion-3" />
                        <h3 className="collapse-title uppercase font-semibold mb-2">Subcategory</h3>
                        <div className="collapse-content flex flex-col">
                            {subcategories.map(subcategory => (
                                <label key={subcategory.id} className="inline-flex items-center mr-4 mb-2">
                                    <input
                                        type="checkbox"
                                        name="subcategories"
                                        value={subcategory.id}
                                        onChange={handleFilterChange}
                                        checked={filter.subcategories.includes(String(subcategory.id))}
                                        className="mr-2"
                                    />
                                    {subcategory.name}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="mb-4 collapse collapse-plus">
                        <input type="radio" name="my-accordion-3" />
                        <h3 className="collapse-title uppercase font-semibold mb-2">Brand</h3>
                        <div className="collapse-content flex flex-col">
                            {brands.map(brand => (
                                <label key={brand.id} className="inline-flex items-center mr-4 mb-2">
                                    <input
                                        type="checkbox"
                                        name="brands"
                                        value={brand.name}
                                        onChange={handleFilterChange}
                                        checked={filter.brands.includes(brand.name)}
                                        className="mr-2"
                                    />
                                    {brand.name}
                                </label>
                            ))}
                        </div>
                    </div>

                </div>
                <div className="col-span-4">
                    {filteredProducts.length === 0 ? (
                        <div className="flex justify-center items-center h-full">
                            <p className="text-lg font-semibold">No products found</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-7">
                            {sortedProducts.map(product => {
                                const discountedPrice = product.discount
                                    ? product.price - (product.price * product.discount / 100)
                                    : product.price;
                                const { averageRating } = calculateRatingStats(product.id);
                                const orderCount = getOrderCount(product.id)
                                return (
                                    <>
                                        <Link to={`/products/${product.id}`} key={product.id}>
                                            <Card
                                                img={product.image_url}
                                                name={product.name}
                                                description={product.description}
                                                price={product.price}
                                                colors={product.colors}
                                                sizes={product.sizes}
                                                discount={product.discount}
                                                discountedPrice={discountedPrice}
                                                averageRating={averageRating}
                                                orderCount={orderCount}
                                                onFavoriteClick={handleFavoriteClick}
                                                isFavorite={userId ? isFavorite(product.id, userId) : false}
                                                product={product}
                                            />
                                        </Link>
                                    </>
                                );
                            })}
                        </div>
                    )}
                </div>

            </div>
        </>
    );
};

export default Product;
