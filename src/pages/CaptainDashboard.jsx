import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import axios from 'axios';
import { LogOut, MapPin, Check, X } from 'lucide-react';

const CaptainDashboard = () => {
    const { user, logout } = useAuth();
    const socket = useSocket();
    const [rides, setRides] = useState([]);
    const [activeRide, setActiveRide] = useState(null);

    useEffect(() => {
        const fetchRides = async () => {
            try {
                const res = await axios.get('http://localhost:8080/api/rides/pending', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setRides(res.data);
            } catch (error) {
                console.error("Error fetching rides", error);
            }
        };
        fetchRides();

        if (socket) {
            socket.on('new-ride', (ride) => {
                setRides((prev) => [...prev, ride]);
            });
        }

        return () => {
            if (socket) socket.off('new-ride');
        };
    }, [socket]);

    const acceptRide = async (rideId) => {
        try {
            const res = await axios.post(`http://localhost:8080/api/rides/accept/${rideId}`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setActiveRide(res.data);
            setRides((prev) => prev.filter(r => r._id !== rideId));
        } catch (error) {
            console.error("Error accepting ride", error);
            alert("Failed to accept ride");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center space-x-4">
                        <Link to="/" className="text-2xl font-bold text-gray-900 hover:opacity-80 transition-opacity">
                            Swift<span className="text-yellow-400">Ride</span>
                        </Link>
                        <span className="text-gray-300">|</span>
                        <h1 className="text-xl font-bold text-gray-700">Captain Dashboard</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="font-medium text-gray-700">{user?.name}</span>
                        <button onClick={logout} className="flex items-center space-x-2 text-red-600 hover:text-red-700">
                            <LogOut size={20} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>

                {activeRide ? (
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-l-4 border-green-500">
                        <h2 className="text-xl font-bold mb-4">Current Ride</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-gray-500">Pickup</p>
                                <p className="font-medium">{activeRide.pickup.address || 'Location A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Drop</p>
                                <p className="font-medium">{activeRide.destination.address || 'Location B'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Passenger</p>
                                <p className="font-medium">{activeRide.user?.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Fare</p>
                                <p className="font-bold text-xl">₹{activeRide.fare}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setActiveRide(null)}
                            className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700"
                        >
                            Complete Ride
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">New Requests</h2>
                        </div>
                        {rides.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                No new ride requests. Waiting...
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-200">
                                {rides.map((ride) => (
                                    <li key={ride.id || ride._id} className="p-6 hover:bg-gray-50 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full uppercase">
                                                        {ride.status}
                                                    </span>
                                                    <span className="text-sm text-gray-500">{new Date(ride.createdAt).toLocaleTimeString()}</span>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="font-medium text-gray-900">From: {ride.pickup?.address || 'Pickup Location'}</p>
                                                    <p className="font-medium text-gray-900">To: {ride.destination?.address || 'Drop Location'}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-gray-900">₹{ride.fare}</p>
                                                <p className="text-sm text-gray-500">{ride.distance ? (ride.distance / 1000).toFixed(1) : 0} km</p>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex space-x-3">
                                            <button
                                                onClick={() => acceptRide(ride.id || ride._id)}
                                                className="flex-1 bg-black text-white py-2 rounded-lg font-bold hover:bg-gray-800 flex items-center justify-center space-x-2"
                                            >
                                                <Check size={18} />
                                                <span>Accept</span>
                                            </button>
                                            <button className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg font-bold hover:bg-gray-50 flex items-center justify-center space-x-2">
                                                <X size={18} />
                                                <span>Ignore</span>
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CaptainDashboard;
