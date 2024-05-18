import { useNavigate, useParams } from "react-router-dom";
import axios from "../config/axiosConfig";
import { useState, useEffect } from "react";
import defaultImage from '../assets/default.jpg';

export default function Details() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState([]);

    useEffect(() => {
        axios.get(`products/${id}`)
            .then(function (response) {
                const product = response.data.product;
                setProduct(product);
            })
            .catch(function (error) {
                console.error('Errore durante il recupero del prodotto:', error);
            });
    }, [id]);

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <>
            <header className="bg-dark-custom m-3 md:m-20 rounded-xl">
                <div className="container flex flex-col px-6 py-4 mx-auto space-y-6 md:h-128 md:py-16 md:flex-row md:items-center md:space-x-6">
                    <div className="flex flex-col items-center w-full md:flex-row md:w-1/2">
                        <div className="max-w-lg md:mx-12 md:order-2">
                            <h1 className="tracking-wide text-light-custom font-titolo text-5xl xl:text-8xl">{product.name}</h1>
                            <p className="mt-4 text-light-custom xl:text-3xl">{product.description}</p>
                            <div className="mt-6">
                                <a href="#" className="block px-3 py-2 font-semibold text-center bg-light-cust text-dark-custom rounded-md md:inline xl:text-3xl">{product.price && product.price.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}</a>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-center w-full h-96 md:w-1/2">
                        <img className="object-cover w-full h-full max-w-2xl rounded-md text-light-custom" src={product.image ? `http://api.menu.avillettapizzeria.it/storage/${product.image}` : defaultImage} alt={product.name} />
                    </div>
                </div>
            </header>
            <div className="flex mb-5">
                <button onClick={handleGoBack} className="uppercase bg-dark-custom text-light-custom p-4 rounded-xl mx-3 md:mx-20 w-full hover:opacity-90">Indietro</button>
            </div>
        </>
    );
}
