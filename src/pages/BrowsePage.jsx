import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaFilter, FaSortAmountDown } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import MovieCard from '../components/MovieCard';
import { getShowsByFilters } from '../api/showService';

const GENRES = [
    { id: 'action', name: 'Action' },
    { id: 'comedy', name: 'Comedy' },
    { id: 'drama', name: 'Drama' },
    { id: 'horror', name: 'Horror' },
    { id: 'romance', name: 'Romance' },
    { id: 'thriller', name: 'Thriller' },
    { id: 'documentary', name: 'Documentary' },
    { id: 'animation', name: 'Animation' },
];

const BrowsePage = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Initialize filters from URL params
    const initialFilters = {
        genres: searchParams.get('genres') || '',
        type: searchParams.get('type') || 'all',
        order_by: searchParams.get('order_by') || 'popularity',
        service: 'cinevo'
    };

    const [filters, setFilters] = useState(initialFilters);
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(false);

    // Sync state with search params changes (e.g., from Navbar clicks)
    useEffect(() => {
        setFilters({
            genres: searchParams.get('genres') || '',
            type: searchParams.get('type') || 'all',
            order_by: searchParams.get('order_by') || 'popularity',
            service: 'cinevo'
        });
    }, [searchParams]);

    // Apply filter changes to URL
    const updateFilters = (newFilters) => {
        const nextFilters = { ...filters, ...newFilters };
        const params = {};
        if (nextFilters.genres) params.genres = nextFilters.genres;
        if (nextFilters.type !== 'all') params.type = nextFilters.type;
        if (nextFilters.order_by !== 'popularity') params.order_by = nextFilters.order_by;
        setSearchParams(params);
    };

    useEffect(() => {
        const fetchFilteredShows = async () => {
            setLoading(true);
            try {
                const params = { ...filters };
                if (params.type === 'all') delete params.type;
                if (!params.genres) delete params.genres;

                const data = await getShowsByFilters(params);
                setShows(data.shows || []);
            } catch (error) {
                console.error('Filter error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFilteredShows();
    }, [filters]);

    return (
        <div className="min-h-screen bg-cinevo-black text-white">
            <Navbar />

            <div className="pt-24 px-4 md:px-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold">Browse</h1>

                    <div className="flex flex-wrap items-center justify-center gap-4">
                        {/* Genre Filter */}
                        <select
                            value={filters.genres}
                            onChange={(e) => updateFilters({ genres: e.target.value })}
                            className="bg-gray-800 border border-gray-600 rounded px-4 py-2 outline-none focus:border-white transition-all"
                        >
                            <option value="">All Genres</option>
                            {GENRES.map(g => (
                                <option key={g.id} value={g.id}>{g.name}</option>
                            ))}
                        </select>

                        {/* Type Filter */}
                        <div className="flex border border-gray-600 rounded overflow-hidden">
                            {['all', 'movie', 'series'].map(t => (
                                <button
                                    key={t}
                                    onClick={() => updateFilters({ type: t })}
                                    className={`px-4 py-2 capitalize transition-colors ${filters.type === t ? 'bg-white text-black font-bold' : 'bg-gray-800 hover:bg-gray-700'
                                        }`}
                                >
                                    {t === 'series' ? 'TV Shows' : t}
                                </button>
                            ))}
                        </div>

                        {/* Sort */}
                        <select
                            value={filters.order_by}
                            onChange={(e) => updateFilters({ order_by: e.target.value })}
                            className="bg-gray-800 border border-gray-600 rounded px-4 py-2 outline-none focus:border-white transition-all"
                        >
                            <option value="popularity">Sort by popularity</option>
                            <option value="rating">Sort by rating</option>
                            <option value="release_date">Sort by year</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                            <div key={i} className="aspect-[2/3] bg-gray-800 animate-pulse rounded-md" />
                        ))}
                    </div>
                ) : shows.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 pb-20">
                        {shows.map((show) => (
                            <MovieCard key={show.id} show={show} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-400">
                        <p className="text-2xl font-bold">No shows match your filters.</p>
                        <button
                            onClick={() => setSearchParams({})}
                            className="mt-4 text-cinevo-red hover:underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrowsePage;
