/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import axios from "../config/axiosConfig";
import Spinner from "./Spinner";
import defaultImage from '../assets/default.jpg'
import { TrashIcon } from "@heroicons/react/16/solid";

/* eslint-disable react/prop-types */
export default function EditModal({ product, productId, onCloseModal, fetchProducts }) {

    const [categories, setCategories] = useState([]);
    const [messages, setMessages] = useState('');
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [category_id, setCategory_id] = useState('')
    const [description, setDescription] = useState(product.description !== null ? product.description : '');
    const [image, setImage] = useState(null)
    const [previewImage, setPreviewImage] = useState(null);
    const [messagesError, setMessagesError] = useState('');

    const changeHandler = (e) => {
        const selectedImage = e.target.files[0];
        setImage(selectedImage);
        setPreviewImage(URL.createObjectURL(selectedImage));
    }

    useEffect(() => {
        axios.get('categories')
            .then(function (response) {
                setCategories(response.data.categories);
            })
            .catch(function (error) {
                console.error('Errore durante il recupero delle categorie:', error);
            });

        axios.get(`products/${productId}`)
            .then(({ data }) => {
                const { name, description, price, category_id } = data.product
                setName(name)
                setPrice(price)
                setCategory_id(category_id)
                setDescription(description)
            }).catch(({ response: {data} }) => {
                console.log(data.message)
            })
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('_method', 'PUT')
        formData.append('name', name)
        formData.append('price', price)
        formData.append('category_id', category_id)
        if (description !== null) {
            formData.append('description', description)
        }        
        if (image !== null) {
            formData.append('image', image)
        }

        await axios.post(`/products/${productId}`, formData)
            .then(({ data }) => {
                setMessages(data.message);
            })
            .catch(({ response }) => {
                if (response.status == 422) {
                    console.log(response.data.error.image)
                    setMessagesError(response.data.error.image);
                    setTimeout(() => {
                        setMessagesError('');
                    }, 9000);
                } else {
                    console.log(response)
                    setMessagesError(response.data.message);
                    setTimeout(() => {
                        setMessagesError('');
                    }, 9000);
                }
            }).finally(() => {
                setLoading(false);
                fetchProducts();
            });
        }

        const handleDeleteImage = async () => {
            try {
                await axios.delete(`products/${productId}/delete-image`)
                    .then(({ data }) => {
                        console.log(data);
                        setMessages(data.message);
                        setImage(null);
                        setPreviewImage(null);
                        fetchProducts();
                    })
                    .catch(function (error) {
                        console.log(error.response.data.error);
                        setMessagesError(error.response.data);
                        setTimeout(() => {
                            setMessagesError('');
                        }, 9000);
                    })
            } catch (error) {
                console.error("Errore durante l'eliminazione dell immagine:", error);
                setMessagesError('Nessuna immagine trovata.');
            }
        }

    return (
        <>

            <div className={`fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-900 bg-opacity-50 ${productId ? '' : 'hidden'}`} >
                <div className="relative p-4 w-full max-w-md max-h-full">
                    {messages && (
                        <div className="flex justify-center relative bottom-5">
                            <div className="alert alert-success z-50 bg-lime-200 border-lime-400 border-2 p-4 text-dark-custom font-sottotitolo shadow-xl uppercase rounded-xl" role="alert">{messages}</div>
                        </div>
                        )}

            {messagesError && (
                <div className="flex justify-center relative bottom-5">
                    <div className="alert alert-success z-50 bg-red-200 border-red-400 border-2 p-4 text-dark-custom font-sottotitolo shadow-xl uppercase rounded-xl" role="alert">
                        {Array.isArray(messagesError) ? (
                            messagesError.map((message, index) => ( 
                                <div key={index}>{message} <br /><br /></div>
                            ))
                        ) : (
                            <div>{messagesError.error} <br /><br /></div>
                        )}
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
                                Modifica {product.name}
                            </h3>
                            <button onClick={onCloseModal} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
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
                                        value={name}
                                        onChange={(e) => { setName(e.target.value) }}
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
                                        value={price}
                                        onChange={(e) => { setPrice(e.target.value) }}
                                        required
                                    />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Categoria</label>
                                    <select 
                                        id="category" 
                                        name="category_id" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        value={category_id}
                                        onChange={(e) => { setCategory_id(e.target.value) }}
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
                                        value={description}
                                        onChange={(e) => { setDescription(e.target.value) }}
                                    ></textarea>                    
                                </div>
                                <div className="col-span-2">
                                    
                                 <div className="col-span-2">
                                    
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Upload file</label>
                                <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="file_input_help" id="file_input" type="file" onChange={changeHandler}/>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">PNG, JPG, GIF (MAX. 2048mb).</p>
                                {previewImage ? (
                                        <img src={previewImage} alt="Anteprima immagine" className="object-cover w-full h-52" />
                                    ) : (
                                        <img src={product.image ? `https://api.menu.avillettapizzeria.it/storage/${product.image}` : defaultImage} alt="Anteprima immagine" className="object-cover w-full h-52" />
                                    )}
                                </div> 

                                </div> 
                            </div>
                            <div onClick={handleDeleteImage} className="flex w-full bg-red-700 rounded-md text-white font-bold p-4 mb-4 justify-center cursor-pointer">RIMUOVI IMMAGINE <TrashIcon width={20} className="ms-2" /></div>
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