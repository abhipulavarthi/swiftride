import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Clock, MapPin } from 'lucide-react';

const Profile = () => {
    const { user, logout } = useAuth();

    const history = [
        { id: 1, date: '2023-10-25', from: 'Central Mall', to: 'Airport', fare: 450, status: 'Completed' },
        { id: 2, date: '2023-10-22', from: 'Home', to: 'Office', fare: 120, status: 'Completed' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
                    <div className="px-6 py-8 border-b border-gray-200 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="bg-gray-200 p-4 rounded-full">
                                <User size={40} className="text-gray-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                                <p className="text-gray-500">{user?.email}</p>
                                <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full uppercase">
                                    {user?.role}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
                        >
                            <LogOut size={20} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-4">Ride History</h2>
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <ul className="divide-y divide-gray-200">
                        {history.map((ride) => (
                            <li key={ride.id} className="p-6 hover:bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-yellow-100 p-2 rounded-full">
                                            <Clock size={20} className="text-yellow-700" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{ride.date}</p>
                                            <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                                                <span>{ride.from}</span>
                                                <span>→</span>
                                                <span>{ride.to}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-900">₹{ride.fare}</p>
                                        <span className="text-xs text-green-600 font-medium">{ride.status}</span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Profile;
