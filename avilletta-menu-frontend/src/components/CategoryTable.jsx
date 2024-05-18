import { EyeIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/16/solid";
import CreateModalCategory from "./CreateModalCategory";
import { useState } from "react";
import defaultImage from '../assets/default.jpg'
import axios from "../config/axiosConfig";
import EditModalCategory from "./EditModalCategory";
import DeleteModal from "./DeleteModal";

/* eslint-disable react/prop-types */
export const CategoryTable = ({ categories, setCategories, handleShowProducts, fetchCategories, setSelectedCategoryId, selectedCategoryId }) => {
    
    const [messages, setMessages] = useState('');
    const [searchTerm, setSearchTerm] = useState("");
    const [showCreateModalCategory, setShowCreateModalCategory] = useState(false);
    const [noResults, setNoResults] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(null);

    const handleOpenModalCreateCategory = () => {
        setShowCreateModalCategory(true);
    };

    const handleCloseModalCreateCategory = () => {
        setShowCreateModalCategory(false);
    };

    function handleOpenModal(selectedCategoryId) {
        setSelectedCategoryId(selectedCategoryId);
    }

    function handleCloseModal() {
        setSelectedCategoryId(null);
    }

    const handleDelete = (selectedCategoryId) => {
        setShowDeleteModal(selectedCategoryId);
    };

    const handleSearchInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearch = async () => {
        try {
            if (searchTerm) {
                const response = await axios.get(`/categories/?search=${searchTerm}`);
                setCategories(response.data.categories);
                setNoResults(response.data.categories.length === 0);
                console.log(response);
            } else {
                fetchCategories();
                setNoResults(false);
            }
        } catch (error) {
            console.error("Errore durante la ricerca delle categorie:", error);
            setNoResults(true);
        }
    };
    

    return (
        <section className="dark:bg-gray-900 p-3 sm:p-5">
                <div className="mx-auto max-w-screen-7xl px-4 lg:px-12">

                {messages && (
                        <div className="flex justify-center relative top-1">
                            <span className="alert alert-success z-50 bg-lime-200 border-lime-400 border-2 p-4 text-dark-custom font-sottotitolo shadow-xl uppercase rounded-xl" role="alert">{messages}</span>
                        </div>
                        )}
  
                    <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden min-h-96">
                        <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                            <div className="w-full md:w-1/2">
                            <form className="flex items-center" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                                <label htmlFor="simple-search" className="sr-only">Search</label>
                                <div className="relative w-full">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <input 
                                        type="text" 
                                        id="simple-search" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                                        placeholder="Cerca" 
                                        value={searchTerm}
                                        onChange={handleSearchInputChange}
                                        required="" 
                                    />
                                </div>
                                <button className="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm ms-3 px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800" type='submit'>Cerca</button>
                            </form>
                            </div> 
                            <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
 
                                <button onClick={handleOpenModalCreateCategory} className="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800" type="button">
                                <svg className="h-3.5 w-3.5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                        <path clipRule="evenodd" fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                                    </svg>
                                    Aggiungi Categoria
                                </button>
                                
                                <CreateModalCategory isOpen={showCreateModalCategory} onClose={handleCloseModalCreateCategory} fetchCategories={fetchCategories} />

                                <button className="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800" type="button" onClick={handleShowProducts}>
                                    <EyeIcon className='me-2' width={16} /> Mostra Prodotti
                                </button>
                            </div>
                            

                        
                        </div>
                        <div className="overflow-x-auto">
                        {noResults ? (
                                <p className="text-center text-gray-500 dark:text-gray-400 py-4">Nessuna Categoria trovata.</p>
                            ) : (
                            <table className="w-full text-xs sm:text-md text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-4 py-3">Nome</th>
                                        <th scope="col" className="px-4 py-3">Immagine</th>
                                        <th scope="col" className="px-4 py-3 text-center">Modifica</th>
                                        <th scope="col" className="px-4 py-3 text-center">Elimina</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {categories.map((category, index) => (
                                    <tr key={index} className="border-b dark:border-gray-700">
                                        <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">{category.name}</th>
                                        <td className="px-4 py-3">
                                            <img className="rounded-full w-14 h-14" src={category.image ? `http://api.menu.avillettapizzeria.it/storage/${category.image}` : defaultImage} alt="Product Image" style={{ maxWidth: '100px' }} />
                                        </td>


                                        <td className="px-4 py-3 flex justify-center">
                                            <button 
                                                onClick={() => handleOpenModal(category.id)} 
                                                className="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800" 
                                                type="button"
                                            >
                                                <PencilSquareIcon width={18} className="me-2" /> Modifica
                                            </button>


                                            {selectedCategoryId === category.id && (
                                                <EditModalCategory category={category} selectedCategoryId={category.id} onCloseModal={handleCloseModal} fetchCategories={fetchCategories}/>
                                            )}
                                        </td>

                                        <td className="px-4 py-3">
                                            <TrashIcon
                                                onClick={() => handleDelete(category.id)} 
                                                className="text-red-600 mx-auto cursor-pointer" 
                                                width={18} />
                                        </td>

                                        {showDeleteModal === category.id && (
                                            <DeleteModal 
                                                fetchData={fetchCategories} 
                                                data={'categories'} 
                                                message={'Categoria eliminata.'} 
                                                bodyMessage={`Sicuro di voler eliminare ${category.name}`} 
                                                setMessages={setMessages} 
                                                id={category.id} 
                                                onCloseModal={() => setShowDeleteModal(null)} />
                                        )}

                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            )}
                        </div>
                        {/* {pagination && (
                            
                            <Pagination pagination={pagination} handleNextPage={handleNextPage} handlePrevPage={handlePrevPage} />
                        
                        )} */}
                    </div>
                </div>
            </section>
    );
};