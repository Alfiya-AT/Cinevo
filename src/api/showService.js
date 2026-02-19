import api from './axios';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Helper to normalize TMDB data to match the app's existing structure
const normalizeShow = (item) => {
    if (!item) return null;
    return {
        id: item.id,
        title: item.title || item.name || item.original_title || item.original_name,
        overview: item.overview,
        releaseYear: (item.release_date || item.first_air_date || '').split('-')[0],
        rating: item.vote_average,
        runtime: item.runtime || null,
        type: item.media_type || (item.first_air_date ? 'series' : 'movie'),
        genres: item.genres || item.genre_ids?.map(id => ({ id, name: Object.keys(GENRE_MAP).find(k => GENRE_MAP[k] === id) })) || [],
        cast: item.credits?.cast?.slice(0, 5).map(c => c.name) || [],
        imageSet: {
            verticalPoster: {
                w360: item.poster_path ? `${IMAGE_BASE_URL}/w500${item.poster_path}` : null,
            },
            horizontalBackdrop: {
                w720: item.backdrop_path ? `${IMAGE_BASE_URL}/w780${item.backdrop_path}` : null,
                w1080: item.backdrop_path ? `${IMAGE_BASE_URL}/original${item.backdrop_path}` : null,
                w1440: item.backdrop_path ? `${IMAGE_BASE_URL}/original${item.backdrop_path}` : null,
            }
        }
    };
};

const GENRE_MAP = {
    'action': 28,
    'comedy': 35,
    'documentary': 99,
    'horror': 27,
    'romance': 10749,
    'thriller': 53,
    'drama': 18,
    'animation': 16,
    'mystery': 9648,
    'sci-fi': 878,
    'family': 10751,
    'fantasy': 14,
    'history': 36,
    'music': 10402,
    'war': 10752,
    'western': 37
};

export const getShowsByFilters = async (params = {}) => {
    try {
        let endpoint = '/discover/movie';

        // Determine media type for endpoint and sorting
        const mediaType = params.type === 'series' || params.type === 'tv' ? 'tv' : (params.type === 'movie' ? 'movie' : 'all');

        if (mediaType === 'tv') {
            endpoint = '/discover/tv';
        } else if (mediaType === 'all' && params.order_by === 'popularity' && !params.genres) {
            // Only use trending for the "All" view with popularity sort (New & Popular)
            endpoint = '/trending/all/week';
        }

        const queryParams = {
            language: 'en-US',
            page: Math.floor(Math.random() * 2) + 1, // Shuffle: pick from first 2 pages
            sort_by: 'popularity.desc',
            ...params
        };

        // Remove our custom 'type' param so it doesn't interfere with TMDB query
        delete queryParams.type;

        // Custom sorting and filtering logic
        if (endpoint.includes('trending')) {
            // Trending endpoint doesn't support sort_by or with_genres in the same way
            delete queryParams.sort_by;
        } else if (params.order_by === 'rating') {
            queryParams.sort_by = 'vote_average.desc';
            queryParams['vote_count.gte'] = 500;
        } else if (params.order_by === 'release_date') {
            queryParams.sort_by = mediaType === 'tv' ? 'first_air_date.desc' : 'release_date.desc';
        }


        // Handle genre strings from old API
        if (params.genres && typeof params.genres === 'string') {
            const genreId = GENRE_MAP[params.genres.toLowerCase()];
            if (genreId) {
                queryParams.with_genres = genreId;
            }
        } else if (params.genres && typeof params.genres === 'number') {
            queryParams.with_genres = params.genres;
        }

        const response = await api.get(endpoint, { params: queryParams });
        return {
            shows: (response.data.results || []).map(normalizeShow)
        };
    } catch (error) {
        console.error('TMDB Fetch Error:', error);
        return { shows: [] };
    }
};

export const getShowDetails = async (id, type) => {
    try {
        // If type isn't provided, we try movie first then tv as fallback
        const showType = type || 'movie';
        const response = await api.get(`/${showType}/${id}`, {
            params: { append_to_response: 'credits' }
        });
        return normalizeShow(response.data);
    } catch (error) {
        if (!type) {
            // Retry as tv if movie failed and no type was provided
            try {
                const response = await api.get(`/tv/${id}`, {
                    params: { append_to_response: 'credits' }
                });
                return normalizeShow(response.data);
            } catch (err) {
                console.error('TMDB Detail Error (Both types):', err);
            }
        }
        console.error('TMDB Detail Error:', error);
        return null;
    }
};

export const searchShowsByKeyword = async (keyword) => {
    try {
        const response = await api.get('/search/multi', {
            params: { query: keyword, language: 'en-US' }
        });
        return {
            shows: (response.data.results || []).map(normalizeShow)
        };
    } catch (error) {
        console.error('TMDB Search Error:', error);
        return { shows: [] };
    }
};
