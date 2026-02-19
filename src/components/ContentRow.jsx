import { useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import MovieCard from './MovieCard';

const ContentRow = ({ title, shows = [], loading = false }) => {
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

    if (loading) {
        return (
            <div className="py-4 space-y-4">
                <div className="h-6 w-48 bg-gray-800 animate-pulse rounded ml-4 md:ml-12" />
                <div className="flex gap-4 overflow-hidden px-4 md:px-12">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="flex-none w-[160px] md:w-[240px] aspect-[2/3] bg-gray-800 animate-pulse rounded-md" />
                    ))}
                </div>
            </div>
        );
    }

    if (shows.length === 0) return null;

    return (
        <div className="py-4 md:py-8 group relative">
            <h2 className="text-lg md:text-2xl font-semibold px-4 md:px-12 mb-4 hover:text-gray-300 cursor-pointer transition-colors">
                {title}
            </h2>

            <div className="relative flex items-center">
                {showLeftArrow && (
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-0 z-20 h-full w-12 flex items-center justify-center bg-black/40 hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100"
                    >
                        <FaChevronLeft className="text-2xl" />
                    </button>
                )}

                <div
                    ref={rowRef}
                    onScroll={handleScroll}
                    className="flex gap-2 md:gap-4 overflow-x-auto scroll-smooth hide-scrollbar px-4 md:px-12 pb-4"
                >
                    {shows.map((show) => (
                        <MovieCard key={show.id} show={show} />
                    ))}
                </div>

                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 z-20 h-full w-12 flex items-center justify-center bg-black/40 hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100"
                >
                    <FaChevronRight className="text-2xl" />
                </button>
            </div>
        </div>
    );
};

export default ContentRow;
