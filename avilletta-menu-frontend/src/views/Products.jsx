import { Link, useParams } from "react-router-dom";
import axios from "../config/axiosConfig";
import { useState, useEffect } from "react";
import defaultImage from '../assets/default.jpg';

export default function Products() {
    const { category } = useParams();

    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get(`categories/${category}/products`)
            .then(function (response) {
                const products = response.data.products;
                setProducts(products);
            })
            .catch(function (error) {
                console.error('Errore durante il recupero dei prodotti:', error);
            });
        }, [category]);

    return (
        <>
            
            {category === 'Panini' && (
                <div className="text-center m-3 p-3 bg-dark-custom text-light-custom rounded-xl font-bold tracking-widest">
                    Tutti i panini comprendono un contorno di patatine
                </div>
            )}

            <div className='grid grid-cols-1 sm:grid-cols-1 xl:grid-cols-3 gap-4 my-6'>
                {products.map((product, index) => (
                    <div key={index} className="px-2 mx-auto w-full">
                        <div className="flex w-full bg-white shadow-lg rounded-lg overflow-hidden min-h-48">
                        <div
                            className="min-w-[40%] bg-cover"
                            style={{
                                backgroundImage: `url(${product.image ? `http://api.menu.avillettapizzeria.it/storage/${product.image}` : defaultImage})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                minHeight: '100px'
                            }}
                        >
                        </div>
                            <div className="p-4 min-w-[60%]">
                                <h1 className="text-gray-900 font-sottotitolo text-2xl">{product.name}</h1>
                                <p className="mt-2 text-gray-600 text-sm font-descrizione">{product.description}</p>
                                <div className="flex item-center justify-between mt-3">
                                    <h1 className="text-gray-700 font-bold text-xl">{product.price.toLocaleString('it-IT', {style: 'currency', currency: 'EUR'})}</h1>
                                    <Link
                                        to={{
                                            pathname: `/product/${product.id}`,
                                            state: {
                                                product: product
                                            }
                                        }}
                                    >
                                        <button className="px-3 py-2 bg-dark-custom text-light-custom text-xs font-bold uppercase rounded">Dettagli</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}
