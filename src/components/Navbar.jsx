import { useContext } from "react";
import NavContext from "../NavContext";
import CartContext from "../CartContext";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { FaAngleDown } from "react-icons/fa6";
import axios from "axios";
import CartPreview from "../pages/CartPreview";
import { useOnClickOutside } from "usehooks-ts";
import { getFavouriteCount } from "./GetFavouriteCount";
import { FaRegClock } from 'react-icons/fa';


const Navbar = () => {
    const { isOpen, hoveredCategory, EnterButton, LeaveButton, EnterDropdown, LeaveDropdown, CategoryHover, handleSubcategoryClick } = useContext(NavContext)
    const [categories, setCategories] = useState()

    const { getCartQuantity, isCartOpen } = useContext(CartContext);
    const favouriteCount = getFavouriteCount()
    const [user, setUser] = useState(null)

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useOnClickOutside(dropdownRef, () => setIsDropdownOpen(false));

    // const [theme, setTheme] = useState(localStorage.getItem("theme") ? localStorage.getItem("theme") : "dark")
    // useEffect(() => {
    //     localStorage.setItem("theme", theme)
    //     const localTheme = localStorage.getItem("theme")
    //     document.querySelector('html').setAttribute('data-theme', localTheme)
    // }, [theme])

    function handleTheme(e) {
        if (e.target.checked) {
            setTheme("light")
        }
        else {
            setTheme("dark")
        }
    }

    const handleHomeClick = () => {
        window.location.reload();
    };

    const navigate = useNavigate()

    useEffect(() => {
        // axios.get('http://localhost:3001/categories')
        axios.get('https://buy-now-jocc.onrender.com/categories')
            .then(response => {
                setCategories(response.data)
            })
    })

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []); const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        setIsDropdownOpen(false);

        navigate('/');
        window.location.reload();
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <>
            <p className="flex h-10 items-center justify-center bg-black px-4 text-sm font-medium text-white sm:px-6 lg:px-16 w-full">
                Get free delivery on orders over $100
            </p>
            <nav className="w-full sticky top-0 z-50 bg-white shadow-lg">
                <div className="border-b border-gray-200 mx-10 relative">
                    <div className="flex h-16 items-center">
                        <button
                            type="button"
                            className="relative rounded-md bg-white p-2 text-gray-400 lg:hidden"
                        >
                            <span className="absolute -inset-0.5"></span>
                            <span className="sr-only">Open menu</span>
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                />
                            </svg>
                        </button>

                        <div className="me-4 flex">
                            <a href="/" onClick={handleHomeClick}>
                                <Link className="uppercase text-xl font-bold" to="/">
                                    Buy Now
                                </Link>
                            </a>
                        </div>
                        <div>
                            <div
                                className="-mb-px flex space-x-8 px-4 items-center"
                                aria-orientation="horizontal"
                                role="tablist"
                            >
                                <button
                                    className="flex whitespace-nowrap border-b-2 border-transparent text-sm mt-1 font-medium text-gray-900"
                                    id="menu-button"
                                    aria-expanded={isOpen}
                                    aria-haspopup="true"
                                    onMouseEnter={EnterButton}
                                // onMouseLeave={LeaveButton}
                                >
                                    Categories <FaAngleDown className="mt-1"></FaAngleDown>
                                </button>
                                <Link to={'/products'} className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800">Products</Link>

                                <Link to={'/brands'} className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800">Brands</Link>

                                <Link to={'/aboutUs'} className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800">About Us</Link>

                            </div>

                            {isOpen && (
                                <div
                                    id="dropdown-menu"
                                    className={`absolute left-0 top-12 z-10 mt-2 w-full bg-white border-s-8 border-black rounded-xl p-10 ${isOpen ? '' : 'hidden'}`}
                                    onMouseEnter={EnterDropdown}
                                    onMouseLeave={LeaveDropdown}
                                >
                                    <div className="flex">
                                        <div className="w-1/4 grid grid-cols-1 gap-8" style={{ maxHeight: '400px', overflowY: 'scroll' }}>
                                            {categories.map((category) => (
                                                <div
                                                    key={category.id}
                                                    className={`flex flex-col items-start shadow-lg rounded-xl p-5 w-full ${hoveredCategory?.id === category.id ? 'border border-black' : 'hover:border border-black'}`}
                                                    onMouseEnter={() => CategoryHover(category)}
                                                // onMouseLeave={CategoryLeave}
                                                >
                                                    <div className="flex items-center w-full">
                                                        <div className="w-1/2">
                                                            <img src={category.image_url} className="w-16 h-16 rounded-full" alt={category.name} />
                                                        </div>
                                                        <div className="w-1/2">
                                                            <p className="mt-2">{category.name}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {hoveredCategory && (
                                            <div className="w-3/4 p-5">
                                                <div className="grid grid-cols-4 gap-4">
                                                    {hoveredCategory.subcategories.map((subcategory) => (
                                                        <div
                                                            key={subcategory.id}
                                                            className="flex justify-center items-center p-2 rounded-md bg-gray-50 cursor-pointer"
                                                            onClick={() => handleSubcategoryClick(subcategory.id)}
                                                        >
                                                            <div>
                                                                <img src={subcategory.image_url} className="w-24 h-24 rounded-full object-cover rounded-t-xl transition-transform transform hover:scale-105" alt={subcategory.name} />
                                                                <p>{subcategory.name}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                        </div>


                        <div className="flex lg:ml-auto">
                            <input type="text" name="" className='border-b border-gray-400 rounded-lg px-5 focus:ring focus:ring-violet-300' placeholder='Search' id="" />
                            <a href="#" className="p-2 text-gray-400 hover:text-gray-500">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                            </a>
                        </div>
                        <div className="ml-auto flex items-center">
                            <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                                <div className="relative">
                                    {user ? (
                                        <button
                                            onClick={toggleDropdown}
                                            className="text-sm font-medium text-gray-700 hover:text-gray-800"
                                        >
                                            Welcome, {user.username}
                                        </button>
                                    ) : (
                                        <Link
                                            to="/login"
                                            className="text-sm font-medium text-gray-700 hover:text-gray-800"
                                        >
                                            Sign in
                                        </Link>
                                    )}
                                    {isDropdownOpen && (
                                        <div
                                            ref={dropdownRef}
                                            className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md"
                                        >
                                            <ul>
                                                <li>
                                                    <button
                                                        onClick={handleLogout}
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                                    >
                                                        Logout
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <label className="swap swap-rotate ms-4 my-2">
                                <input type="checkbox" onChange={handleTheme} />

                                <svg
                                    className="swap-on h-8 w-8 fill-current text-gray-500"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24">
                                    <path
                                        d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                                </svg>

                                <svg
                                    className="swap-off h-7 w-7 fill-current text-gray-500"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                                </svg>
                            </label>

                            <div className="flex items-center space-x-6">
                                <div className="relative ml-4 flow-root lg:ml-6">
                                    <Link to="/favourite" className="group relative -m-2 flex items-center p-2">
                                        <svg
                                            className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500 transform group-hover:scale-110 transition-transform duration-200"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                                            />
                                        </svg>
                                        <span className="absolute top-3 right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold leading-none text-white bg-black rounded-full transform translate-x-1/2 -translate-y-1/2 group-hover:scale-105 transition-transform duration-200">
                                            {favouriteCount}
                                        </span>
                                    </Link>
                                    <span
                                        className="h-6 w-px bg-gray-200"
                                        aria-hidden="true"
                                    ></span>
                                </div>
                                <div
                                    className="relative ml-4 flow-root lg:ml-6"
                                >
                                    <Link to="/cart" className="group relative -m-2 flex items-center p-2">
                                        <svg
                                            className="h-7 w-7 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                                            />
                                        </svg>
                                        <span className="absolute top-3 right-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold leading-none text-white bg-black rounded-full transform translate-x-1/2 -translate-y-1/2 group-hover:scale-105 transition-transform duration-200">
                                            {getCartQuantity()}
                                        </span>
                                    </Link>
                                    {isCartOpen && (
                                        <div>
                                            <CartPreview />
                                        </div>
                                    )}
                                </div>
                                <Link to={'/orders'} className="group relative -m-2 items-center text-2xl  flex-shrink-0 text-gray-400 hover:text-gray-500"><FaRegClock /></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav >


        </>
    )
}
export default Navbar