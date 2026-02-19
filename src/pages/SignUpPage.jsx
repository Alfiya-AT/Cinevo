import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { signup } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

const SignUpPage = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [selectedPlan, setSelectedPlan] = useState('Standard');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector((state) => state.auth);

    const PLANS = [
        { name: 'Basic', resolution: '720p', price: '$9.99', screens: 1 },
        { name: 'Standard', resolution: '1080p', price: '$15.49', screens: 2 },
        { name: 'Premium', resolution: '4K+HDR', price: '$19.99', screens: 4 },
    ];

    const handleSignup = async () => {
        const result = await dispatch(signup({
            full_name: fullName,
            email,
            password,
            plan: selectedPlan.toLowerCase()
        }));

        if (signup.fulfilled.match(result)) {
            toast.success('Welcome to Cinevo!');
            navigate('/profiles');
        } else {
            toast.error(result.payload || 'Signup failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-white text-black">
            <nav className="flex items-center justify-between px-8 py-6 border-b border-gray-200">
                <Link to="/">
                    <h1 className="text-cinevo-red text-4xl font-extrabold uppercase">Cinevo</h1>
                </Link>
                <Link to="/login" className="text-lg font-bold hover:underline">Sign In</Link>
            </nav>

            <div className="max-w-xl mx-auto px-4 py-20 text-center">
                <AnimatePresence mode="wait">
                    {step === 1 ? (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 border-2 border-cinevo-red rounded-full flex items-center justify-center">
                                    <span className="text-cinevo-red font-bold">1/3</span>
                                </div>
                                <h2 className="text-3xl font-bold">Finish setting up your account</h2>
                            </div>
                            <p className="text-lg">Cinevo is personalized for you. Create a password to watch on any device at any time.</p>
                            <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-4 text-left">
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full h-14 border border-gray-400 px-4 rounded focus:border-black outline-none"
                                    required
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-14 border border-gray-400 px-4 rounded focus:border-black outline-none"
                                    required
                                />
                                <input
                                    type="password"
                                    placeholder="Add a password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full h-14 border border-gray-400 px-4 rounded focus:border-black outline-none"
                                    required
                                />
                                <button type="submit" className="w-full btn-cinevo h-16 text-xl font-bold">
                                    Next
                                </button>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 border-2 border-cinevo-red rounded-full flex items-center justify-center">
                                    <FaCheck className="text-cinevo-red text-3xl" />
                                </div>
                                <h2 className="text-3xl font-bold">Choose your plan.</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {PLANS.map((plan) => (
                                    <div
                                        key={plan.name}
                                        onClick={() => setSelectedPlan(plan.name)}
                                        className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${selectedPlan === plan.name
                                                ? 'border-cinevo-red bg-cinevo-red/5'
                                                : 'border-gray-200 hover:border-gray-400'
                                            }`}
                                    >
                                        <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                                        <p className="text-2xl font-bold text-cinevo-red mb-4">{plan.price}</p>
                                        <ul className="text-sm space-y-2 text-gray-600">
                                            <li>Resolution: {plan.resolution}</li>
                                            <li>Screens: {plan.screens}</li>
                                        </ul>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={handleSignup}
                                disabled={loading}
                                className="w-full btn-cinevo h-16 text-xl font-bold mt-8 flex items-center justify-center"
                            >
                                {loading ? 'Creating Account...' : 'Start Membership'}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SignUpPage;
