import { motion } from 'framer-motion';
import { FaPlay, FaPlus, FaThumbsUp, FaChevronDown, FaCheck } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { openDetailModal } from '../store/slices/uiSlice';
import { toggleMyList } from '../store/slices/listSlice';
import { useNavigate } from 'react-router-dom';

const MovieCard = ({ show }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { myList } = useSelector((state) => state.list);
    const posterUrl = show.imageSet?.verticalPoster?.w360 || 'https://via.placeholder.com/360x540?text=No+Poster';

    const isAdded = myList.some(item => item.id === show.id);

    return (
        <motion.div
            whileHover={{
                scale: 1.1,
                transition: { duration: 0.3 }
            }}
            className="relative flex-none w-[160px] md:w-[240px] aspect-[2/3] group cursor-pointer"
        >
            <img
                src={posterUrl}
                alt={show.title}
                loading="lazy"
                onClick={() => dispatch(openDetailModal(show.id))}
                className="w-full h-full object-cover rounded-md shadow-md group-hover:shadow-xl transition-all"
            />

            {/* Hover Info Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md flex flex-col justify-end p-4 pointer-events-none group-hover:pointer-events-auto">
                <h3 className="text-sm md:text-md font-bold truncate mb-2">{show.title}</h3>
                <div className="flex items-center gap-2 mb-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/watch/${show.id}`); }}
                        className="bg-white text-black p-1.5 rounded-full hover:bg-gray-200"
                    >
                        <FaPlay className="text-[10px]" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); dispatch(toggleMyList(show)); }}
                        className={`border-2 p-1 rounded-full transition-colors ${isAdded ? 'bg-white border-white text-black' : 'border-gray-400 hover:border-white text-white'
                            }`}
                    >
                        {isAdded ? <FaCheck className="text-[10px]" /> : <FaPlus className="text-[10px]" />}
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); dispatch(openDetailModal(show.id)); }}
                        className="border-2 border-gray-400 p-1 rounded-full hover:border-white ml-auto text-white"
                    >
                        <FaChevronDown className="text-[10px]" />
                    </button>
                </div>
                <div className="flex items-center gap-2 text-[10px] md:text-xs">
                    <span className="text-green-500 font-semibold">{Math.floor(Math.random() * 20 + 80)}% Match</span>
                    <span className="border border-gray-500 px-1">{show.rating ? `${show.rating}/10` : 'N/A'}</span>
                    <span>{show.releaseYear}</span>
                </div>
            </div>
        </motion.div>
    );
};

export default MovieCard;
