import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaBell, FaUser, FaCaretDown } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ isLanding = false }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isBrowseOpen, setIsBrowseOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-colors duration-300 px-4 md:px-12 py-4 flex items-center justify-between ${isScrolled ? 'bg-cinevo-black shadow-lg' : 'bg-transparent'
                }`}
        >
            <div className="flex items-center gap-8">
                <Link to={isLanding ? '/' : '/home'}>
                    <motion.h1
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-cinevo-red text-3xl md:text-4xl font-extrabold tracking-tighter uppercase"
                    >
                        Cinevo
                    </motion.h1>
                </Link>

                {!isLanding && (
                    <div className="hidden lg:flex items-center gap-4 text-sm font-medium">
                        <Link to="/home" className="hover:text-gray-300 transition-colors">Home</Link>
                        <Link to="/browse?type=series" className="hover:text-gray-300 transition-colors">TV Shows</Link>
                        <Link to="/browse?type=movie" className="hover:text-gray-300 transition-colors">Movies</Link>
                        <Link to="/browse?order_by=popularity" className="hover:text-gray-300 transition-colors">New & Popular</Link>
                        <Link to="/my-list" className="hover:text-gray-300 transition-colors">My List</Link>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-4 md:gap-6">
                {isLanding ? (
                    <>
                        <div className="hidden sm:block">
                            <div className="flex items-center gap-2 border border-white/40 px-2 py-1 rounded bg-black/20 text-white">
                                <span className="text-xs">English</span>
                                <FaCaretDown className="text-xs" />
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-cinevo-red hover:bg-[#c11119] text-white px-4 py-1.5 rounded font-medium text-sm transition-colors"
                        >
                            Sign In
                        </button>
                    </>
                ) : (
                    <>
                        <div className="relative group">
                            <FaSearch className="text-xl cursor-pointer hover:text-gray-400 transition-colors" onClick={() => navigate('/search')} />
                        </div>
                        <FaBell className="text-xl cursor-pointer hover:text-gray-400 transition-colors" />
                        <div className="flex items-center gap-2 cursor-pointer group relative py-2">
                            <div className="w-8 h-8 rounded overflow-hidden flex items-center justify-center bg-orange-500 text-lg">
                                🦊
                            </div>
                            <FaCaretDown className="transition-transform group-hover:rotate-180" />

                            <div className="absolute top-full right-0 mt-2 w-48 bg-black/90 border border-gray-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 rounded shadow-xl py-2">
                                <Link to="/profiles" className="block px-4 py-2 hover:bg-gray-800 text-sm">Manage Profiles</Link>
                                <Link to="/settings" className="block px-4 py-2 hover:bg-gray-800 text-sm border-b border-gray-700">Account</Link>
                                <Link to="/" className="block px-4 py-2 hover:bg-gray-800 text-sm">Sign out of Cinevo</Link>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
