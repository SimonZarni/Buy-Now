import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";

const Brands = () => {
    const [brands, setBrands] = useState([]);

    useEffect(() => {
        // axios.get('http://localhost:3001/brands')
        axios.get('https://buy-now-jocc.onrender.com/brands')
            .then(response => {
                setBrands(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the brands!", error);
            });
    }, []);

    return (
        <div className="container mx-auto p-5 px-10">
            <div className="breadcrumbs text-sm">
                <ul>
                    <li><Link to={'/'}>Home</Link></li>
                    <li>Brands</li>
                </ul>
            </div>
            <h2 className="text-2xl font-bold my-4 uppercase">Our Brands</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {brands.map((brand) => (
                    <Link to={`/brands/${brand.id}`} key={brand.id}>

                        <div key={brand.id} className="brand-card w-full h-72 p-4 border rounded-lg hover:shadow-lg transition-shadow duration-300">
                            <img src={brand.logo_url} alt={brand.name} className="w-full h-32 object-contain mb-4" />
                            <h2 className="text-xl font-semibold mb-2">{brand.name}</h2>
                            <p className="text-gray-600">{brand.description}</p>
                        </div>
                    </Link>
                ))}
            </div>

        </div>
    );
}

export default Brands;
