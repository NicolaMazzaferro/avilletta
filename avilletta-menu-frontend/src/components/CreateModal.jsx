/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "../config/axiosConfig";
import Spinner from './Spinner'
import defaultImage from '../assets/default.jpg'

export default function CreateModal({ isOpen, onClose, fetchProducts }) {

    const [categories, setCategories] = useState([]);
    const [messages, setMessages] = useState('');
    const [messagesError, setMessagesError] = useState('');
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        category_id: "",
        description: "",
        image: null
    });

    useEffect(() => {
        axios.get('categories')
            .then(function (response) {
                setCategories(response.data.categories);
            })
            .catch(function (error) {
                console.error('Errore durante il recupero delle categorie:', error);
            });
    }, []);

    const handleImageChange = (e) => {
        setFormData({
          ...formData,
          image: e.target.files[0],
        });
        const url = URL.createObjectURL(e.target.files[0]);
        setImageUrl(url);
      };

    const handleInputChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);

           axios.post('/products', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            })
            .then(function (response) {
                setMessages(response.data.message);
                setFormData({
                    name: "",
                    price: "",
                    category_id: "",
                    description: "",
                    image: null
                });
                setImageUrl('');
                fetchProducts();
                setTimeout(() => {
                    setMessages('');
                }, 9000);
            })
            .catch(function (error) {
                console.log(error.response.data.error.image);
                setMessagesError(error.response.data.error.image);
                setTimeout(() => {
                    setMessagesError('');
                }, 9000);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <>
            <div className={`fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-900 bg-opacity-50  ${isOpen ? 'block' : 'hidden'}`}>
                <div className="relative p-4 w-full max-w-md max-h-full">

                    {messages && (
                        <div className="flex justify-center relative bottom-5">
                            <div className="alert alert-success z-50 bg-lime-200 border-lime-400 border-2 p-4 text-dark-custom font-sottotitolo shadow-xl uppercase rounded-xl" role="alert">{messages}</div>
                        </div>
                        )}

                    {messagesError && (
                        <div className="flex justify-center relative bottom-5">
                            <div className="alert alert-success z-50 bg-red-200 border-red-400 border-2 p-4 text-dark-custom font-sottotitolo shadow-xl uppercase rounded-xl" role="alert">
                                {messagesError.map((message, index) => ( 
                                    <div key={index}>{message} <br /><br /></div>
                                ))}
                            </div>
                        </div>
                        )}

                    {loading && 
                        <div className="absolute inset-0 bg-white  flex justify-center items-center z-50">
                            
                            <div className=""><Spinner /></div>
                        </div>
                    }
            
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Crea un nuovo Prodotto
                            </h3>
                            <button onClick={onClose} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
            
                        <form onSubmit={handleSubmit} className="p-4 md:p-5">
                            <div className="grid gap-4 mb-4 grid-cols-2">
                                <div className="col-span-2">
                                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nome</label>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        id="name" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                                        placeholder="Nome Prodotto" 
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Prezzo</label>
                                    <input 
                                        type="number" 
                                        name="price" 
                                        id="price" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                                        placeholder="€10.00" 
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Categoria</label>
                                    <select 
                                        id="category" 
                                        name="category_id" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        value={formData.category_id}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="" disabled>Seleziona una categoria</option>
                                        {categories.map((category, index) => (
                                            <option key={index} value={category.id}>{category.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Descrizione</label>
                                    <textarea 
                                        id="description" 
                                        name="description" 
                                        rows="4" 
                                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        placeholder="Inserisci una descrizione"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                    ></textarea>                    
                                </div>

                                <div className="col-span-2">
                                    
                                    <div className="flex items-center justify-center w-full">
                                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-72 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Carica Immagine</span></p>
                                        <img src={imageUrl || defaultImage} alt="Anteprima immagine" className="object-cover w-full h-52" />
                                        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-3">PNG, JPG, GIF (MAX. 2048mb)</p>
                                            <input id="dropzone-file" onChange={handleImageChange} type="file" className="hidden" />
                                        </label>
                                    </div> 

                                </div> 

                            </div>
                            <button 
                                type="submit" 
                                className="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm p-4 w-full"
                            >
                                Salva
                            </button>
                        </form>
                    </div>
                </div>
            </div> 
        </>
    )
}