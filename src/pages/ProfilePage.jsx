import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlus } from 'react-icons/fa';

const ProfilePage = () => {
    const navigate = useNavigate();

    const PROFILES = [
        { name: 'Alfiya', emoji: '🦊', color: 'bg-orange-500' }, // Naruto
        { name: 'Guest', emoji: '⚔️', color: 'bg-green-600' }, // Tanjiro
        { name: 'Kids', emoji: '👒', color: 'bg-red-500' }, // Luffy
    ];

    return (
        <div className="min-h-screen bg-cinevo-black flex items-center justify-center text-white">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
            >
                <h1 className="text-4xl md:text-6xl font-medium mb-12">Who's watching?</h1>

                <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
                    {PROFILES.map((profile, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ y: -10 }}
                            onClick={() => navigate('/home')}
                            className="group cursor-pointer text-center space-y-4"
                        >
                            <div className={`${profile.color} w-32 h-32 md:w-40 md:h-40 rounded flex items-center justify-center border-4 border-transparent group-hover:border-white transition-all shadow-xl text-6xl md:text-7xl`}>
                                {profile.emoji}
                            </div>
                            <p className="text-gray-400 group-hover:text-white text-xl md:text-2xl transition-colors">{profile.name}</p>
                        </motion.div>
                    ))}

                    <div className="text-center space-y-4 group cursor-pointer">
                        <div className="w-32 h-32 md:w-40 md:h-40 flex items-center justify-center bg-transparent border-4 border-transparent hover:bg-gray-700 transition-all rounded">
                            <FaPlus className="text-gray-500 text-6xl group-hover:text-white" />
                        </div>
                        <p className="text-gray-400 group-hover:text-white text-xl md:text-2xl">Add Profile</p>
                    </div>
                </div>

                <button className="mt-20 px-8 py-2 border border-gray-500 text-gray-500 hover:text-white hover:border-white text-lg transition-all tracking-widest uppercase">
                    Manage Profiles
                </button>
            </motion.div>
        </div>
    );
};

export default ProfilePage;
