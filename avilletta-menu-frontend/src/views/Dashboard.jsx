/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import axios from "../config/axiosConfig";
import { ProductTable } from "../components/ProductTable";
import { CategoryTable } from "../components/CategoryTable";

export default function Dashboard() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [pagination, setPagination] = useState(null);
    const [page, setPage] = useState(1);
    const [showCategories, setShowCategories] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [noResults, setNoResults] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);


    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, [page, selectedCategory]);
    
    const fetchProducts = async () => {
        try {
            const response = await axios.get(`products/?page=${page}&category=${selectedCategory}`);
            const { data } = response;
            setProducts(data.products.data);
            setPagination(data.products);
            setNoResults(false);
        } catch (error) {
            setNoResults(true);
        }
    };    

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`/categories`);
            const { data } = response;
            setCategories(data.categories);
        } catch (error) {
            console.error('Errore durante il recupero delle categorie:', error);
        }
    };

    const handleShowProducts = () => {
        fetchProducts();
        setShowCategories(true);
        setPage(1);
    };

    const handleShowCategories = () => {
        fetchCategories();
        setShowCategories(false);
    };

    const handleNextPage = () => {
        setPage(page + 1);
    };

    const handlePrevPage = () => {
        setPage(page - 1);
    };

    return (
        <div>
            {showCategories ? (
                <ProductTable
                    products={products}
                    setProducts={setProducts}
                    pagination={pagination}
                    page={page}
                    setPage={setPage}
                    handleNextPage={handleNextPage}
                    handlePrevPage={handlePrevPage}
                    handleShowCategories={handleShowCategories}
                    noResults={noResults}
                    setNoResults={setNoResults}
                    fetchProducts={() => fetchProducts(selectedCategory)}
                    setSelectedCategory={setSelectedCategory}
                    selectedCategory={selectedCategory}
                    selectedProductId={selectedProductId}
                    setSelectedProductId={setSelectedProductId}
                    categories={categories}
                />
            ) : (
                <CategoryTable 
                    categories={categories} 
                    setCategories={setCategories}
                    handleShowProducts={handleShowProducts}   
                    fetchCategories={fetchCategories}
                    selectedCategoryId={selectedCategoryId}
                    setSelectedCategoryId={setSelectedCategoryId}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                />
            )}
        </div>
    );
}
