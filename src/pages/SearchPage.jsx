import { useState, useEffect, useCallback } from 'react';
import { FaSearch } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import MovieCard from '../components/MovieCard';
import { searchShowsByKeyword } from '../api/showService';
import _ from 'lodash';

const SearchPage = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState(() => {
        return JSON.parse(localStorage.getItem('searchHistory') || '[]');
    });

    const fetchResults = async (searchQuery) => {
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }

        setLoading(true);
        try {
            const data = await searchShowsByKeyword(searchQuery);
            setResults(data.shows || []);

            // Save to history
            const updatedHistory = [searchQuery, ...history.filter(h => h !== searchQuery)].slice(0, 5);
            setHistory(updatedHistory);
            localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Debounced search
    const debouncedSearch = useCallback(
        _.debounce((q) => fetchResults(q), 500),
        [history]
    );

    useEffect(() => {
        if (query) {
            debouncedSearch(query);
        } else {
            setResults([]);
        }
    }, [query, debouncedSearch]);

    return (
        <div className="min-h-screen bg-cinevo-black text-white">
            <Navbar />

            <div className="pt-24 px-4 md:px-12">
                <div className="relative max-w-2xl mx-auto mb-12">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        autoFocus
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for movies, TV shows, genres..."
                        className="w-full h-14 pl-12 pr-4 bg-gray-800/80 border border-transparent focus:border-white rounded outline-none text-lg transition-all"
                    />
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="aspect-[2/3] bg-gray-800 animate-pulse rounded-md" />
                        ))}
                    </div>
                ) : results.length > 0 ? (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold">Results for "{query}"</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {results.map((show) => (
                                <MovieCard key={show.id} show={show} />
                            ))}
                        </div>
                    </div>
                ) : query ? (
                    <div className="text-center py-20 text-gray-400">
                        <p className="text-2xl">No results found for "{query}"</p>
                        <p className="mt-2 text-lg">Try different keywords or browse genres.</p>
                    </div>
                ) : history.length > 0 ? (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-400">Recent Searches</h2>
                        <div className="flex flex-wrap gap-3">
                            {history.map((h, i) => (
                                <button
                                    key={i}
                                    onClick={() => setQuery(h)}
                                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-sm transition-colors"
                                >
                                    {h}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-500">
                        <p className="text-xl">Search for your favorite content</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPage;
