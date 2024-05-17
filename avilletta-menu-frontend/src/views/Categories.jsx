import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from "../config/axiosConfig";
import defaultImage from '../assets/default.jpg';

export default function Categories() {

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        axios.get('categories')
            .then(function (response) {
                setCategories(response.data.categories);
            })
            .catch(function (error) {
                console.error('Errore durante il recupero delle categorie:', error);
            });
        }, []);

    return (
        <>
            <div className="mx-auto">
                <div className="flex flex-wrap justify-around">
                {categories.map((category, index) => (
                    <div key={index} className="w-full md:w-1/3 mb-6">
                        <Link to={`/products/${category.name}`}>
                            <div className="m-3 font-semibold text-center rounded-3xl shadow-md flex flex-col justify-between h-52">
                                <img src={category.image ? `http://localhost:8000/${category.image}` : defaultImage} alt={category.name} className="w-full h-40 object-cover rounded-t-3xl" />
                                <button className="bg-dark-custom text-light-custom text-3xl px-8 py-2 font-sottotitolo uppercase tracking-widest mt-auto w-full">{category.name}</button>
                            </div>
                        </Link>
                    </div>
                ))}
                </div>
            </div>
        </>
    )
}