import { useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import MovieCard from './MovieCard';

const TrendingNow = ({ shows = [], loading = false }) => {
    const rowRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);

    const scroll = (direction) => {
        if (rowRef.current) {
            const { scrollLeft, clientWidth } = rowRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
            setShowLeftArrow(scrollTo > 0);
        }
    };

    const handleScroll = () => {
        if (rowRef.current) {
            setShowLeftArrow(rowRef.current.scrollLeft > 0);
        }
    };

    return (
        <div className="py-4 md:py-8 group relative px-4 md:px-12">
            <h2 className="text-xl md:text-2xl font-bold mb-4">Trending Now</h2>

            <div className="relative flex items-center">
                {showLeftArrow && (
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-0 z-30 h-full w-12 flex items-center justify-center bg-black/40 hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100"
                    >
                        <FaChevronLeft className="text-2xl" />
                    </button>
                )}

                <div
                    ref={rowRef}
                    onScroll={handleScroll}
                    className="flex gap-16 md:gap-24 overflow-x-auto scroll-smooth hide-scrollbar pb-8 pt-4 px-8"
                >
                    {loading ? (
                        [1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="flex-none w-[140px] md:w-[200px] aspect-[2/3] bg-gray-800 animate-pulse rounded-md" />
                        ))
                    ) : (
                        shows.map((show, index) => (
                            <div key={show.id} className="relative flex-none">
                                {/* Rank Number */}
                                <div className="absolute -left-12 bottom-[-10%] z-0 select-none">
                                    <span className="text-[160px] md:text-[240px] font-black leading-none text-black drop-shadow-[0_2px_2px_rgba(255,255,255,0.4)]"
                                        style={{
                                            WebkitTextStroke: '2px #555',
                                            display: 'block',
                                        }}>
                                        {index + 1}
                                    </span>
                                </div>
                                <div className="relative z-10 w-[140px] md:w-[220px] transition-transform duration-300 hover:scale-105">
                                    <MovieCard show={show} />
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 z-30 h-full w-12 flex items-center justify-center bg-black/40 hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100"
                >
                    <FaChevronRight className="text-2xl" />
                </button>
            </div>
        </div>
    );
};

export default TrendingNow;
