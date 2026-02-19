import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import MovieCard from '../components/MovieCard';

const MyListPage = () => {
    const { myList } = useSelector((state) => state.list);

    return (
        <div className="min-h-screen bg-cinevo-black text-white">
            <Navbar />

            <div className="pt-24 px-4 md:px-12">
                <h1 className="text-3xl md:text-4xl font-bold mb-12">My List</h1>

                {myList.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 pb-20">
                        {myList.map((show) => (
                            <MovieCard key={show.id} show={show} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-40 text-gray-400">
                        <p className="text-2xl font-bold">You haven't added anything to your list yet.</p>
                        <p className="mt-2">Shows and movies you add to your list will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyListPage;
