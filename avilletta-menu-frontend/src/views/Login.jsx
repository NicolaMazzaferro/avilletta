import { useState } from 'react';
import axios from '../config/axiosConfig';
import { useAuth } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('login', {
                email: email,
                password: password,
            });
            const accessToken = response.data.token;
            login();
            localStorage.setItem('accessToken', accessToken);
            navigate('/dashboard');
        } catch (error) {
            setError('Credenziali non valide. Riprova.');
            console.error(error);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen" style={{ marginTop: '-120px' }}>
            <form onSubmit={handleLogin} className="max-w-sm mx-auto sm:min-w-96 bg-dark-custom p-9 rounded-xl">
                <div className="mb-5">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-light-custom">Email</label>
                    <input type="email" id="email" className="bg-gray-50 border border-gray-300 text-dark-custom text-sm rounded-lg focus:ring-amber-950 focus:border-blue-500 block w-full p-2.5" placeholder="nome@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="mb-5">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-light-custom">Password</label>
                    <input type="password" id="password" className="bg-gray-50 border border-gray-300 text-dark-custom text-sm rounded-lg focus:ring-amber-950 focus:border-blue-500 block w-full p-2.5" placeholder="*******" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                {error && <p className="text-red-500">{error}</p>}
                <button type="submit" className="text-dark-custom bg-light-cust hover:opacity-90 focus:ring-4 focus:outline-none focus:ring-amber-950 font-medium rounded-lg text-sm w-full sm:w-full px-5 py-2.5 text-center">Accedi</button>
            </form>
        </div>
    );
};

export default Login;
