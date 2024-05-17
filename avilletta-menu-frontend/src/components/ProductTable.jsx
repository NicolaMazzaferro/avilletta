import { EyeIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/16/solid';
import Pagination from '../components/Pagination';
import defaultImage from '../assets/default.jpg';
import CreateModal from './CreateModal';
import EditModal from './EditModal';
import { useState } from 'react';
import axios from '../config/axiosConfig';
import DropdownFilter from './DropdownFilter';
import DeleteModal from './DeleteModal';
/* eslint-disable react/prop-types */
// eslint-disable-next-line react/prop-types

export const ProductTable = ({ products, setProducts, pagination, page, setPage, handleNextPage, handlePrevPage, handleShowCategories, setNoResults, noResults, fetchProducts, setSelectedProductId, selectedProductId, categories, setSelectedCategory }) => {

    const [messages, setMessages] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(null);


    const handleOpenModalCreate = () => {
        setShowCreateModal(true);
    };

    const handleCloseModalCreate = () => {
        setShowCreateModal(false);
    };

    function handleOpenModal(productId) {
        setSelectedProductId(productId);
    }

    function handleCloseModal() {
        setSelectedProductId(null);
    }

    const handleSearchInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearch = async () => {
        try {
            if (searchTerm) {
                const response = await axios.get(`/products/?search=${searchTerm}`);
                setProducts(response.data.products.data);
                setNoResults(response.data.products.length === 0);
            } else {
                fetchProducts();
                setNoResults(false);
            }
        } catch (error) {
            console.error("Errore durante la ricerca del prodotto:", error);
            setNoResults(true);
        }
    };

    const handleDelete = (productId) => {
        setShowDeleteModal(productId);
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


                            <div className="w-full md:w-auto gap-3 flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end flex-shrink-0">
 
                                <button onClick={handleOpenModalCreate} className="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800" type="button">
                                <svg className="h-3.5 w-3.5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                        <path clipRule="evenodd" fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                                    </svg>
                                    Aggiungi Prodotto
                                </button>
                                
                                <CreateModal isOpen={showCreateModal} onClose={handleCloseModalCreate} fetchProducts={fetchProducts} />

                                <button className="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800" type="button" onClick={handleShowCategories}>
                                    <EyeIcon className='me-2' width={16} /> Mostra Categorie
                                </button>

                                <DropdownFilter page={page} setProducts={setProducts} categories={categories} setSelectedCategory={setSelectedCategory} fetchProducts={fetchProducts} setPage={setPage} />
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                        {noResults ? (
                                <p className="text-center text-gray-500 dark:text-gray-400 py-4">Nessun prodotto trovato.</p>
                            ) : (
                            <table className="w-full text-xs sm:text-md text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-4 py-3">Nome</th>
                                        <th scope="col" className="px-4 py-3">Categoria</th>
                                        <th scope="col" className="px-4 py-3">Immagine</th>
                                        <th scope="col" className="px-4 py-3">Descrizione</th>
                                        <th scope="col" className="px-4 py-3">Prezzo</th>
                                        <th scope="col" className="px-4 py-3 text-center">Modifica</th>
                                        <th scope="col" className="px-4 py-3 text-center">Elimina</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {products.map((product, index) => (
                                    <tr key={index} className="border-b dark:border-gray-700">
                                        <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">{product.name}</th>
                                        <td className="px-4 py-3">{product.category.name}</td>
                                        <td className="px-4 py-3">
                                            <img className="rounded-full w-14 h-14" src={product.image ? `http://localhost:8000/${product.image}` : defaultImage} alt="Product Image" style={{ maxWidth: '100px' }} />
                                        </td>
                                        <td className="px-4 py-3">{product.description}</td>
                                        <td className="px-4 py-3">{product.price.toLocaleString('it-IT', {style: 'currency', currency: 'EUR'})}</td>


                                        <td className="px-4 py-3 flex justify-center">
                                            <button 
                                                onClick={() => handleOpenModal(product.id)} 
                                                className="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800" 
                                                type="button"
                                            >
                                                <PencilSquareIcon width={18} className="me-2" /> Modifica
                                            </button>


                                            {selectedProductId === product.id && (
                                                <EditModal product={product} productId={product.id} onCloseModal={handleCloseModal} fetchProducts={fetchProducts}/>
                                            )}
                                        </td>

                                        <td className="px-4 py-3">
          
                                            <TrashIcon
                                                onClick={() => handleDelete(product.id)} 
                                                className="text-red-600 mx-auto cursor-pointer" 
                                                width={18} />
                                        </td>

                                        {showDeleteModal === product.id && (
                                            <DeleteModal 
                                                fetchData={fetchProducts} 
                                                data={'products'} 
                                                message={'Prodotto eliminato.'}
                                                bodyMessage={`Sicuro di voler eliminare ${product.name}`} 
                                                setMessages={setMessages} 
                                                id={product.id} 
                                                onCloseModal={() => setShowDeleteModal(null)} />
                                        )}


                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            )}
                        </div>
                        {pagination && (
                            
                            <Pagination pagination={pagination} setPage={setPage} handleNextPage={handleNextPage} handlePrevPage={handlePrevPage} />
                        
                        )}
                    </div>
                </div>
            </section>
        
    );
};