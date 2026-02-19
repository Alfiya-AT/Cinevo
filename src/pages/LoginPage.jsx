import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await dispatch(login({ email, password }));

        if (login.fulfilled.match(result)) {
            toast.success('Signed in successfully!');
            navigate('/profiles');
        } else {
            toast.error(result.payload || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="relative min-h-screen bg-black flex items-center justify-center px-4 overflow-hidden">
            {/* Background with overlay */}
            <div
                className="absolute inset-0 opacity-50 hidden md:block"
                style={{
                    backgroundImage: `url('https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bca1-07e3f8eb14af/8a01108d-8067-4bb5-a3d2-d1264c1f369f/US-en-20220502-popsignuptwelve-perspective_alpha_website_medium.jpg')`,
                    backgroundSize: 'cover'
                }}
            />
            <div className="absolute inset-0 bg-black/60" />

            {/* Logo */}
            <Link to="/" className="absolute top-8 left-8 z-20">
                <h1 className="text-cinevo-red text-4xl font-extrabold uppercase">Cinevo</h1>
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-md bg-black/75 p-12 md:p-16 rounded-md shadow-2xl"
            >
                <h2 className="text-3xl font-bold mb-8">Sign In</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email or phone number"
                        className="w-full h-12 px-5 bg-gray-700/80 rounded border-none focus:bg-gray-600 outline-none transition-all"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full h-12 px-5 bg-gray-700/80 rounded border-none focus:bg-gray-600 outline-none transition-all"
                        required
                    />
                    <button type="submit" className="w-full btn-cinevo h-12 text-lg font-bold">
                        Sign In
                    </button>

                    <div className="flex items-center justify-between text-xs text-gray-400">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 bg-gray-700 rounded border-none" />
                            Remember me
                        </label>
                        <Link to="#" className="hover:underline">Need help?</Link>
                    </div>
                </form>

                <div className="mt-16 text-gray-500 space-y-4">
                    <p>
                        New to Cinevo? <Link to="/signup" className="text-white hover:underline">Sign up now.</Link>
                    </p>
                    <p className="text-xs">
                        This page is protected by Google reCAPTCHA to ensure you're not a bot. <button className="text-blue-500 hover:underline">Learn more.</button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
