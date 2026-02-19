import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import Banner from '../components/Banner';
import ContentRow from '../components/ContentRow';
import { getShowsByFilters } from '../api/showService';

const HomePage = () => {
    const [sections, setSections] = useState({
        trending: { title: 'Trending Now', data: [], loading: true },
        topRated: { title: 'Top Rated Movies', data: [], loading: true },
        originals: { title: 'Cinevo Originals', data: [], loading: true },
        action: { title: 'Action & Adventure', data: [], loading: true },
        comedy: { title: 'Comedies', data: [], loading: true },
        documentary: { title: 'Documentaries', data: [], loading: true },
    });

    const [featuredShow, setFeaturedShow] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch different categories in parallel
                const [trending, topRated, originals, action, comedy, documentary] = await Promise.all([
                    getShowsByFilters({ order_by: 'popularity', type: 'movie' }),
                    getShowsByFilters({ min_rating: 80, order_by: 'rating' }),
                    getShowsByFilters({ order_by: 'popularity' }),
                    getShowsByFilters({ genres: 'action', order_by: 'popularity' }),
                    getShowsByFilters({ genres: 'comedy', order_by: 'popularity' }),
                    getShowsByFilters({ genres: 'documentary', order_by: 'popularity' }),
                ]);

                setSections({
                    trending: { title: 'Trending Now', data: trending.shows || [], loading: false },
                    topRated: { title: 'Top Rated Movies', data: topRated.shows || [], loading: false },
                    originals: { title: 'Cinevo Originals', data: originals.shows || [], loading: false },
                    action: { title: 'Action & Adventure', data: action.shows || [], loading: false },
                    comedy: { title: 'Comedies', data: comedy.shows || [], loading: false },
                    documentary: { title: 'Documentaries', data: documentary.shows || [], loading: false },
                });

                if (trending.shows?.length > 0) {
                    setFeaturedShow(trending.shows[Math.floor(Math.random() * trending.shows.length)]);
                }
            } catch (error) {
                console.error('Error fetching home data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="bg-cinevo-black pb-20">
            <Navbar />
            <Banner show={featuredShow} />

            <div className="-mt-32 relative z-20 space-y-4 md:space-y-8">
                {Object.entries(sections).map(([key, section]) => (
                    <ContentRow
                        key={key}
                        title={section.title}
                        shows={section.data}
                        loading={section.loading}
                    />
                ))}
            </div>
        </div>
    );
};

export default HomePage;
