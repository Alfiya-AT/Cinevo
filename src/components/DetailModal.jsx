import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaPlus, FaThumbsUp, FaTimes, FaCheck } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { closeDetailModal } from '../store/slices/uiSlice';
import { toggleMyList } from '../store/slices/listSlice';
import { getShowDetails, getShowsByFilters } from '../api/showService';
import MovieCard from './MovieCard';

const DetailModal = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isDetailModalOpen, selectedShowId } = useSelector((state) => state.ui);
    const { myList } = useSelector((state) => state.list);
    const [show, setShow] = useState(null);
    const [similarShows, setSimilarShows] = useState([]);
    const [loading, setLoading] = useState(false);

    const isAdded = show ? myList.some(item => item.id === show.id) : false;

    useEffect(() => {
        if (isDetailModalOpen && selectedShowId) {
            const fetchData = async () => {
                setLoading(true);
                try {
                    const details = await getShowDetails(selectedShowId);
                    setShow(details);

                    if (details.genres?.length > 0) {
                        const similar = await getShowsByFilters({
                            genres: details.genres[0].id,
                            order_by: 'popularity'
                        });
                        setSimilarShows(similar.shows?.slice(0, 6) || []);
                    }
                } catch (error) {
                    console.error('Error fetching show details:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isDetailModalOpen, selectedShowId]);

    const handleClose = () => {
        dispatch(closeDetailModal());
        setShow(null);
        setSimilarShows([]);
    };

    return (
        <AnimatePresence>
            {isDetailModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/70 overflow-y-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-5xl bg-cinevo-black rounded-lg shadow-2xl overflow-hidden"
                    >
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 z-50 p-2 bg-cinevo-black/50 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <FaTimes className="text-xl" />
                        </button>

                        {loading ? (
                            <div className="h-[60vh] flex items-center justify-center">
                                <div className="w-12 h-12 border-4 border-cinevo-red border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : show ? (
                            <>
                                {/* Modal Header/Hero */}
                                <div className="relative aspect-video w-full">
                                    <img
                                        src={show.imageSet?.horizontalBackdrop?.w1080 || 'https://via.placeholder.com/1080x600'}
                                        className="w-full h-full object-cover"
                                        alt={show.title}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-cinevo-black via-transparent to-transparent" />

                                    <div className="absolute bottom-10 left-10 space-y-4">
                                        <h2 className="text-3xl md:text-5xl font-bold">{show.title}</h2>
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => navigate(`/watch/${show.id}`)}
                                                className="flex items-center gap-2 bg-white text-black px-8 py-2 rounded hover:bg-white/80 transition-colors font-bold"
                                            >
                                                <FaPlay /> Play
                                            </button>
                                            <button
                                                onClick={() => dispatch(toggleMyList(show))}
                                                className={`p-2 border-2 rounded-full transition-colors ${isAdded ? 'border-white bg-white text-black' : 'border-gray-400 hover:border-white text-white'
                                                    }`}
                                            >
                                                {isAdded ? <FaCheck /> : <FaPlus />}
                                            </button>
                                            <button className="p-2 border-2 border-gray-400 rounded-full hover:border-white text-white">
                                                <FaThumbsUp />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Modal Content */}
                                <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="md:col-span-2 space-y-6">
                                        <div className="flex items-center gap-4 text-sm font-medium">
                                            <span className="text-green-500 font-bold">96% Match</span>
                                            <span>{show.releaseYear}</span>
                                            <span className="border border-gray-400 px-2 py-0.5 text-xs">TV-MA</span>
                                            <span>{show.runtime}m</span>
                                            <span className="border border-gray-400 px-1 text-[10px]">HD</span>
                                        </div>

                                        <p className="text-lg leading-relaxed">{show.overview}</p>

                                        {show.cast?.length > 0 && (
                                            <div className="text-sm">
                                                <span className="text-gray-400">Cast: </span>
                                                {show.cast.join(', ')}
                                            </div>
                                        )}

                                        <div className="text-sm">
                                            <span className="text-gray-400">Genres: </span>
                                            {show.genres?.map(g => g.name).join(', ')}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-2xl font-bold">More Like This</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            {similarShows.map((s) => (
                                                <div key={s.id} className="cursor-pointer group">
                                                    <img
                                                        src={s.imageSet?.verticalPoster?.w360 || 'https://via.placeholder.com/360x540'}
                                                        className="rounded shadow-md group-hover:scale-105 transition-transform"
                                                        alt={s.title}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="p-20 text-center">Failed to load show details.</div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default DetailModal;
