import { motion } from 'framer-motion';
import { FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import TrendingNow from '../components/TrendingNow';
import FeatureCards from '../components/FeatureCards';
import LandingFooter from '../components/LandingFooter';
import { getShowsByFilters } from '../api/showService';

const LandingPage = () => {
    const navigate = useNavigate();
    const [trendingShows, setTrendingShows] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const data = await getShowsByFilters({ order_by: 'popularity', type: 'movie' });
                setTrendingShows(data.shows?.slice(0, 10) || []);
            } catch (error) {
                console.error('Error fetching trending for landing:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTrending();
    }, []);

    return (
        <div className="relative min-h-screen bg-black overflow-x-hidden">
            <Navbar isLanding />

            {/* Hero Section */}
            <div className="relative h-[85vh] md:h-[95vh] w-full flex flex-col items-center justify-center text-center px-4 overflow-hidden border-b-8 border-gray-800">
                {/* Hero Background with Grid/Perspective */}
                <div className="absolute inset-0 z-0">
                    <div
                        className="w-full h-full scale-110 object-cover opacity-60 transition-opacity duration-1000"
                        style={{
                            backgroundImage: `url(${trendingShows.length > 0 ? (trendingShows[Math.floor(Math.random() * trendingShows.length)]?.imageSet?.horizontalBackdrop?.w1440 || trendingShows[Math.floor(Math.random() * trendingShows.length)]?.imageSet?.horizontalBackdrop?.w1080) : 'https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bca1-07e3f8eb14af/8a01108d-8067-4bb5-a3d2-d1264c1f369f/US-en-20220502-popsignuptwelve-perspective_alpha_website_medium.jpg'})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                    {/* Dark Overlays for Cinevo Look */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/70" />
                    <div className="absolute inset-0 bg-black/30" />
                    <div className="absolute inset-0 radial-vignette opacity-70" />
                </div>

                {/* Hero Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 max-w-4xl pt-20"
                >
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight">
                        Unlimited movies, shows, and more
                    </h1>
                    <p className="text-lg md:text-2xl font-semibold mb-6">
                        Starts at ₹149. Cancel at any time.
                    </p>
                    <div className="space-y-4">
                        <p className="text-md md:text-xl">
                            Ready to watch? Enter your email to create or restart your membership.
                        </p>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-2 max-w-2xl mx-auto px-4">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="w-full md:flex-1 h-14 md:h-16 px-4 bg-black/40 backdrop-blur-sm border border-gray-500 rounded focus:border-white focus:ring-1 focus:ring-white outline-none transition-all text-white"
                            />
                            <button
                                onClick={() => navigate('/signup')}
                                className="w-full md:w-auto bg-cinevo-red hover:bg-[#c11119] text-white font-bold h-14 md:h-16 flex items-center justify-center gap-2 text-xl md:text-2xl px-8 rounded transition-all active:scale-95"
                            >
                                Get Started <FaChevronRight className="text-sm" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Trending Now Section */}
            <section className="relative z-10 -mt-16 md:-mt-24">
                <TrendingNow shows={trendingShows} loading={loading} />
            </section>

            {/* More reasons to join Section */}
            <section className="relative z-10 px-4 md:px-12 py-12">
                <h2 className="text-xl md:text-2xl font-bold mb-6">More reasons to join</h2>
                <FeatureCards />
            </section>

            {/* Footer Call to Action (Repeat) */}
            <section className="relative z-10 flex flex-col items-center justify-center py-16 px-4 text-center">
                <p className="text-md md:text-lg mb-4">
                    Ready to watch? Enter your email to create or restart your membership.
                </p>
                <div className="flex flex-col md:flex-row items-center justify-center gap-2 w-full max-w-2xl mx-auto">
                    <input
                        type="email"
                        placeholder="Email address"
                        className="w-full md:flex-1 h-14 md:h-16 px-4 bg-black/40 border border-gray-500 rounded focus:border-white focus:ring-1 focus:ring-white outline-none transition-all text-white"
                    />
                    <button
                        onClick={() => navigate('/signup')}
                        className="w-full md:w-auto bg-cinevo-red hover:bg-[#c11119] text-white font-bold h-14 md:h-16 flex items-center justify-center gap-2 text-xl md:text-2xl px-8 rounded transition-all active:scale-95 whitespace-nowrap"
                    >
                        Get Started <FaChevronRight className="text-sm" />
                    </button>
                </div>
            </section>

            {/* Detailed Footer */}
            <LandingFooter />
        </div>
    );
};

export default LandingPage;
