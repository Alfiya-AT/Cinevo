import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPlay, FaPause, FaArrowLeft, FaUndo, FaRedo, FaVolumeUp, FaVolumeMute, FaExpand } from 'react-icons/fa';

const VideoPlayerPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isPlaying, setIsPlaying] = useState(true);
    const [showControls, setShowControls] = useState(true);
    const [progress, setProgress] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const controlsTimeoutRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = () => {
            setShowControls(true);
            if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
            controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        };
    }, []);

    const togglePlay = () => setIsPlaying(!isPlaying);
    const toggleMute = () => setIsMuted(!isMuted);

    return (
        <div className="relative h-screen w-screen bg-black overflow-hidden group cursor-none hover:cursor-auto">
            {/* Video Placeholder (using iframe or video tag) */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full bg-cinevo-dark flex flex-col items-center justify-center text-center p-20">
                    <h2 className="text-4xl font-bold mb-4">Playing Content {id}</h2>
                    <p className="text-xl text-gray-400">Custom video player experience in progress...</p>
                    {/* Mock video progress */}
                    {isPlaying && (
                        <div className="mt-8 w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-cinevo-red transition-all duration-1000"
                                style={{ width: `${(progress % 100)}%` }}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Back Button */}
            {showControls && (
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-10 left-10 z-50 text-white flex items-center gap-2 text-2xl font-bold hover:scale-110 transition-transform"
                >
                    <FaArrowLeft />
                </button>
            )}

            {/* Custom Controls */}
            <div className={`absolute bottom-0 w-full p-8 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-500 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                <div className="flex flex-col gap-6">
                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-gray-600 rounded-full cursor-pointer relative group">
                        <div className="absolute h-full bg-cinevo-red rounded-full w-1/3" />
                        <div className="absolute h-4 w-4 bg-cinevo-red rounded-full -top-1.5 left-1/3 opacity-0 group-hover:opacity-100 shadow-xl" />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-8 text-2xl">
                            <button onClick={togglePlay} className="hover:scale-110 transition-transform">
                                {isPlaying ? <FaPause /> : <FaPlay />}
                            </button>
                            <button className="hover:scale-110 transition-transform"><FaUndo /></button>
                            <button className="hover:scale-110 transition-transform"><FaRedo /></button>
                            <button onClick={toggleMute} className="hover:scale-110 transition-transform">
                                {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                            </button>
                        </div>

                        <div className="flex items-center gap-6">
                            <span className="text-lg font-medium">01:42 / 02:30</span>
                            <button className="text-2xl hover:scale-110 transition-transform"><FaExpand /></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayerPage;
