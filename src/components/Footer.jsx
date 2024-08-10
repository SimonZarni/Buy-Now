import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaCcVisa, FaCcMastercard, FaCcPaypal } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="w-full bg-gray-50 py-10 p-10 mt-20">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold uppercase text-center pb-10 relative">
                    <span className="px-4 bg-gray-100 relative z-10">Buy Now</span>
                    <div className="absolute inset-0 flex items-center justify-center top-3">
                        <div className="border-t border-gray-300 w-full"></div>
                    </div>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="mb-6 md:mb-0">
                        <h3 className="text-xl font-bold text-gray-700 mb-4">Company</h3>
                        <ul>
                            <li><Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link></li>
                            <li><Link to="/products" className="text-gray-600 hover:text-gray-900">Products</Link></li>
                            <li><Link to="/stores" className="text-gray-600 hover:text-gray-900">Stores</Link></li>
                            <li><Link to="/about" className="text-gray-600 hover:text-gray-900">About Us</Link></li>
                        </ul>
                    </div>
                    <div className="mb-6 md:mb-0">
                        <h3 className="text-xl font-bold text-gray-700 mb-4">Support</h3>
                        <ul>
                            <li><a href="#" className="text-gray-600 hover:text-gray-900">Help Center</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-gray-900">Contact Us</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-gray-900">Shipping</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-gray-900">Returns</a></li>
                        </ul>
                    </div>
                    <div className="mb-6 md:mb-0">
                        <h3 className="text-xl font-bold text-gray-700 mb-4">Legal</h3>
                        <ul>
                            <li><a href="#" className="text-gray-600 hover:text-gray-900">Privacy Policy</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-gray-900">Terms of Service</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-gray-900">Cookie Policy</a></li>
                        </ul>
                    </div>
                    <div className="mb-6 md:mb-0">
                        <h3 className="text-xl font-bold text-gray-700 mb-4">Stay Updated</h3>
                        <p className="text-gray-600 mb-4">Sign up to receive the latest news and updates.</p>
                        <form>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:ring focus:ring-violet-300"
                            />
                            <button
                                type="submit"
                                className="w-full p-2 bg-black text-white rounded-md hover:bg-gray-800"
                            >
                                Sign Up
                            </button>
                        </form>
                        <div className="mt-4 flex space-x-4">
                            <a href="#" className="text-gray-600 hover:text-gray-900"><FaFacebookF /></a>
                            <a href="#" className="text-gray-600 hover:text-gray-900"><FaTwitter /></a>
                            <a href="#" className="text-gray-600 hover:text-gray-900"><FaInstagram /></a>
                            <a href="#" className="text-gray-600 hover:text-gray-900"><FaLinkedinIn /></a>
                        </div>
                    </div>
                </div>
                <div className="mt-10 text-center">
                    <h3 className="text-xl font-bold text-gray-700 mb-4">Payment Methods</h3>
                    <div className="flex justify-center space-x-4 text-2xl text-gray-600">
                        <FaCcVisa />
                        <FaCcMastercard />
                        <FaCcPaypal />
                    </div>
                </div>
                <div className="mt-10 text-center text-sm text-gray-500">
                    &copy; 2024 Buy Now. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
