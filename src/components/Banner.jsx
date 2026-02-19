import { motion } from 'framer-motion';
import { FaPlay, FaInfoCircle, FaPlus, FaCheck } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toggleMyList } from '../store/slices/listSlice';
import { useNavigate } from 'react-router-dom';

const Banner = ({ show }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { myList } = useSelector((state) => state.list);

    if (!show) return <div className="h-[80vh] md:h-[95vh] bg-cinevo-black" />;

    const isAdded = myList.some(item => item.id === show.id);
    const backdropUrl = show.imageSet?.horizontalBackdrop?.w1080 ||
        show.imageSet?.horizontalBackdrop?.w1440 ||
        'https://via.placeholder.com/1920x1080?text=Cinevo';

    return (
        <header className="relative h-[80vh] md:h-[95vh] text-white overflow-hidden">
            {/* Background Image with Slow Zoom */}
            <div className="absolute inset-0 z-0">
                <motion.img
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 10, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
                    src={backdropUrl}
                    className="w-full h-full object-cover"
                    alt={show.title}
                />

                {/* Cinevo-style Overlays */}
                {/* 1. Bottom Shadow (Fade to black) */}
                <div className="absolute inset-0 bg-gradient-to-t from-cinevo-black via-cinevo-black/20 to-transparent" />

                {/* 2. Left Side Shadow (For text readability) */}
                <div className="absolute inset-0 bg-gradient-to-r from-cinevo-black via-cinevo-black/40 to-transparent" />

                {/* 3. Global Vignette */}
                <div className="absolute inset-0 bg-black/20 radial-vignette" />
            </div>

            {/* Banner Content */}
            <div className="relative z-10 flex flex-col justify-center h-full px-4 md:px-12 pt-20 max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    {/* Top Branding */}
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-4 h-6 bg-cinevo-red rounded-sm" />
                        <span className="uppercase tracking-[0.3em] text-xs font-bold text-gray-300">
                            {show.type === 'series' ? 'Series' : 'Film'}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 drop-shadow-2xl leading-[1.1]">
                        {show.title}
                    </h1>

                    <div className="flex items-center gap-4 mb-4 text-sm md:text-lg font-bold">
                        <span className="text-green-500">98% Match</span>
                        <span className="text-gray-300">{show.releaseYear}</span>
                        <span className="border border-gray-500 px-2 py-0.5 text-[10px] md:text-xs">TV-MA</span>
                        <span className="text-gray-300">{show.runtime ? `${show.runtime}m` : '2h 15m'}</span>
                    </div>

                    <p className="text-sm md:text-lg mb-8 line-clamp-3 md:line-clamp-none drop-shadow-lg text-gray-200 max-w-xl font-medium leading-relaxed">
                        {show.overview || "In this gripping original series, secrets are revealed and alliances are tested as everyone fights for their survival in an ever-changing world."}
                    </p>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(`/watch/${show.id}`)}
                            className="flex items-center gap-3 bg-white text-black px-6 md:px-10 py-2.5 md:py-3.5 rounded hover:bg-white/80 transition-all font-bold text-lg shadow-lg active:scale-95"
                        >
                            <FaPlay /> Play
                        </button>
                        <button
                            onClick={() => dispatch(toggleMyList(show))}
                            className={`flex items-center gap-3 px-6 md:px-10 py-2.5 md:py-3.5 rounded transition-all font-bold text-lg shadow-lg active:scale-95 ${isAdded ? 'bg-gray-500/60 text-white' : 'bg-gray-500/40 backdrop-blur-md text-white hover:bg-gray-500/60'
                                }`}
                        >
                            {isAdded ? <><FaCheck /> My List</> : <><FaPlus /> My List</>}
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Bottom fading-out decorative edge */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-cinevo-black to-transparent z-[5]" />
        </header>
    );
};

export default Banner;
