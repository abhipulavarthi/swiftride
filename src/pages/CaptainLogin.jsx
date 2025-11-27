import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Car, Bike, Zap } from 'lucide-react';

const CaptainLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [vehicle, setVehicle] = useState({ color: '', plate: '', capacity: 2, vehicleType: 'bike' });
    const [isSignup, setIsSignup] = useState(false);
    const { login, signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSignup) {
            const res = await signup({ name, email, password, vehicle }, 'captain');
            if (res.success) navigate('/captain-dashboard');
            else alert(res.message);
        } else {
            const res = await login(email, password, 'captain');
            if (res.success) navigate('/captain-dashboard');
            else alert(res.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                <div>
                    <div className="mx-auto h-12 w-12 bg-primary rounded-full flex items-center justify-center">
                        <Shield className="h-8 w-8 text-gray-900" />
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {isSignup ? 'Become a Captain' : 'Captain Login'}
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        {isSignup && (
                            <>
                                <div>
                                    <input
                                        type="text"
                                        required
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                        placeholder="Full Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-2 my-2">
                                    <select
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                        value={vehicle.vehicleType}
                                        onChange={(e) => setVehicle({ ...vehicle, vehicleType: e.target.value })}
                                    >
                                        <option value="bike">Bike</option>
                                        <option value="auto">Auto</option>
                                        <option value="cab">Cab</option>
                                    </select>
                                    <input
                                        type="text"
                                        required
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                        placeholder="Vehicle Plate"
                                        value={vehicle.plate}
                                        onChange={(e) => setVehicle({ ...vehicle, plate: e.target.value })}
                                    />
                                </div>
                            </>
                        )}
                        <div>
                            <input
                                type="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                required
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 ${!isSignup ? 'rounded-b-md' : ''} focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm`}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-gray-900 bg-primary hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                            {isSignup ? 'Sign Up' : 'Sign In'}
                        </button>
                    </div>
                </form>
                <div className="text-center">
                    <button onClick={() => setIsSignup(!isSignup)} className="text-sm text-blue-600 hover:underline">
                        {isSignup ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CaptainLogin;
