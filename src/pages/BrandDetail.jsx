import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaSearch, FaPlus } from "react-icons/fa";
import Card from "../components/Card";
import { Link } from "react-router-dom";
import CartContext from "../CartContext";

const BrandDetail = () => {
  const { id } = useParams();
  const [brand, setBrand] = useState(null);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const { calculateDiscountedPrice } = useContext(CartContext)


  useEffect(() => {
    // axios.get(`http://localhost:3001/brands/${id}`)
    axios.get('https://buy-now-jocc.onrender.com/brands/${id}')
      .then(response => {
        setBrand(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the brand details!", error);
      });
  }, [id]);

  useEffect(() => {
    // axios.get(`http://localhost:3001/products`)
    axios.get('https://buy-now-jocc.onrender.com/products')
      .then(response => {
        const filteredProducts = response.data.filter(product => product.brand === brand?.name);
        setProducts(filteredProducts);
      })
      .catch(error => {
        console.error("There was an error fetching the products!", error);
      });
  }, [brand]);
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!brand) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-5 px-10">
      <div className="breadcrumbs text-sm">
        <ul>
          <li><Link to={'/'}>Home</Link></li>
          <li><Link to={'/brands'}>Brands</Link></li>
          <li>Brand Details</li>
        </ul>
      </div>
      <div className="flex justify-between">
        <div className="flex space-x-4 items-center">
          <img src={brand.logo_url} alt={brand.name} className="w-32 h-32 object-contain mb-4 border border-collapse rounded-lg" />
          <div className="space-y-4">
            <h2 className="text-2xl font-bold uppercase">{brand.name}</h2>
            <div>
              <span className="font-semibold">Rating: </span>{brand.rating}
              <span className="font-semibold ml-4">Items: </span>{brand.items}
              <span className="font-semibold ml-4">Followers: </span>{brand.followers}
            </div>
            <p className="text-sm text-gray-500">{brand.description}</p>
          </div>
        </div>
        <div className="items-center flex">
          <button className="btn btn-neutral bg-black flex items-center">
            <p className="font-bold uppercase">Follow</p>
            <FaPlus></FaPlus>
          </button>
        </div>
      </div>


      <div className="brand-info flex justify-between items-center my-8">

        <div>
          <span className="font-semibold">Sold recently: </span>{brand.soldRecently}
          <span className="font-semibold ml-4">Repurchase: </span>{brand.repurchase}
        </div>
      </div>

      <div className="filter-bar flex justify-between items-center mb-8">
        <div className="search-bar relative">
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            className="border rounded px-4 py-2"
            placeholder="Search Store"
          />
          <FaSearch className="absolute top-3 right-3 text-gray-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredProducts.map((product) => (
          // <div key={product.id} className="product-card p-4 border rounded-lg hover:shadow-lg transition-shadow duration-300">
          //   <img src={product.image_url} alt={product.name} className="w-full h-32 object-contain mb-4" />
          //   <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
          //   <p className="text-gray-600 mb-2">{product.description}</p>
          //   <p className="font-bold mb-2">${product.price}</p>
          //   {product.colors && (
          //     <div className="mb-2">
          //       {product.colors.map(color => (
          //         <span key={color.code} className="inline-block w-4 h-4 mr-1" style={{ backgroundColor: color.code }}></span>
          //       ))}
          //     </div>
          //   )}
          //   {product.sizes && (
          //     <div className="mb-2">
          //       <span>Sizes: {product.sizes.join(", ")}</span>
          //     </div>
          //   )}
          //   {product.discount && (
          //     <div className="mb-2">
          //       <span className="text-red-500">Discount: {product.discount}%</span>
          //     </div>
          //   )}
          // </div>
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
                discountedPrice={calculateDiscountedPrice}
              />
            </Link>
          </>
        ))}
      </div>
    </div>
  );
};

export default BrandDetail;
