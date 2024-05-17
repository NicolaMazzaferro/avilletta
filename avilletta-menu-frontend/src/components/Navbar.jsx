import { useState, useEffect, useRef } from 'react';
import axios from "../config/axiosConfig";
import logo from '../assets/logo.png';
import { ArrowLeftStartOnRectangleIcon, Bars3Icon } from '@heroicons/react/16/solid';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

export default function Navbar() {
    const [openMenu, setOpenMenu] = useState(false);
    const location = useLocation();
    const menuRef = useRef(null);
    const { isLoggedIn, logout } = useAuth();
    const navigate = useNavigate();

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

    const handleMenu = () => {
        setOpenMenu(!openMenu);
    };

    useEffect(() => {
        setOpenMenu(false);
    }, [location]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenu(false);
            }
        }

        window.addEventListener("click", handleClickOutside);
        return () => {
            window.removeEventListener("click", handleClickOutside);
        };
    }, [menuRef]);

    const handleIconClick = (event) => {
        event.stopPropagation();
        handleMenu();
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            <div className="flex bg-dark-custom p-5 sm:px-20">
                <Link to={'/'}>
                    <img className='w-16' src={logo} alt="logo" />
                </Link>
                <h1 className='text-light-custom uppercase tracking-wider m-auto text-4xl sm:text-6xl font-titolo'>Menu</h1>
                
                {isLoggedIn &&
                    <>
                        <Link to={'/dashboard'} className='bg-light-cust text-dark-custom font-sottotitolo text-xs sm:text-xl rounded-xl me-5 sm:pb-10 px-2 py-2 sm:p-4 h-8 sm:h-10 my-auto hover:opacity-90'>Dashboard</Link>
                        
            
                        <button onClick={handleLogout} className=''><ArrowLeftStartOnRectangleIcon className='text-light-custom w-8 sm:w-10' /></button>
                        
                    </>
                }
                <Bars3Icon onClick={handleIconClick} className="size-10 text-light-custom my-auto cursor-pointer hover:opacity-90 ms-4" />
            </div>
            {openMenu && (
                <div ref={menuRef} className='mx-3 my-1 px-5 py-2 rounded-lg h-min bg-dark-custom'>
                    <ul className='font-sottotitolo'>
                        {categories.map((category, index) => (
                            <li key={index} className='w-full my-2 hover-custom rounded-md p-2'>
                                <Link to={`products/${category.name.toLowerCase()}`} className='block text-xl tracking-wider font-bold text-light-custom no-underline hover-text-custom'>{category.name}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    )
}
