import React, { useState } from 'react';
import {
    Menu, X, MapPin, Navigation, Car, Bike, Zap,
    Clock, Shield, CreditCard, UserCheck, Heart,
    Star, Smartphone, Facebook, Twitter, Instagram, Linkedin, ArrowLeft, Phone
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to fit map bounds
const FitBounds = ({ pickup, drop }) => {
    const map = useMap();
    React.useEffect(() => {
        if (pickup && drop) {
            const bounds = L.latLngBounds([pickup, drop]);
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [pickup, drop, map]);
    return null;
};

// --- Components ---

const AuthModal = ({ isOpen, onClose, initialMode }) => {
    const [mode, setMode] = useState(initialMode); // 'login' or 'signup'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const { login, signup } = useAuth();

    React.useEffect(() => {
        setMode(initialMode);
        setEmail('');
        setPassword('');
        setName('');
    }, [isOpen, initialMode]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        let res;
        if (mode === 'login') {
            res = await login(email, password);
        } else {
            res = await signup({ name, email, password });
        }

        if (res.success) {
            onClose();
        } else {
            alert(res.message);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all scale-100 opacity-100">
                <div className="px-6 py-8 sm:p-10">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {mode === 'signup' && (
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <UserCheck className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        id="name"
                                        required
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary sm:text-sm"
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <div className="h-5 w-5 text-gray-400 flex items-center justify-center">@</div>
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    required
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary sm:text-sm"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Shield className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    id="password"
                                    required
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary sm:text-sm"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-gray-900 bg-primary hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                        >
                            {mode === 'login' ? 'Log In' : 'Sign Up'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                            <button
                                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                                className="font-medium text-primary hover:text-yellow-600 transition-colors"
                            >
                                {mode === 'login' ? 'Sign up' : 'Log in'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const BookingView = ({ pickupCoords, dropCoords, onBack }) => {
    const [route, setRoute] = useState(null);
    const [distance, setDistance] = useState(null);
    const [duration, setDuration] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedVehicle, setSelectedVehicle] = useState('bike');
    const [rideStatus, setRideStatus] = useState('selecting'); // 'selecting' | 'confirmed'
    const { user } = useAuth();
    const [rideDetails, setRideDetails] = useState(null);

    React.useEffect(() => {
        const fetchRoute = async () => {
            if (!pickupCoords || !dropCoords) return;

            try {
                const response = await fetch(
                    `https://router.project-osrm.org/route/v1/driving/${pickupCoords.lon},${pickupCoords.lat};${dropCoords.lon},${dropCoords.lat}?overview=full&geometries=geojson`
                );
                const data = await response.json();

                if (data.routes && data.routes.length > 0) {
                    setRoute(data.routes[0]);
                    setDistance(data.routes[0].distance); // meters
                    setDuration(data.routes[0].duration); // seconds
                }
            } catch (error) {
                console.error("Error fetching route:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRoute();
    }, [pickupCoords, dropCoords]);

    const calculateCost = (dist, type) => {
        const distKm = dist / 1000;
        let base = 0;
        let rate = 0;

        if (type === 'bike') { base = 20; rate = 10; }
        else if (type === 'auto') { base = 30; rate = 15; }
        else { base = 50; rate = 20; } // cab

        return Math.round(base + (rate * distKm));
    };

    const confirmRide = async () => {
        if (!user) {
            alert("Please login to book a ride");
            return;
        }
        try {
            const cost = calculateCost(distance, selectedVehicle);
            const res = await axios.post('http://localhost:8080/api/rides/create', {
                pickup: { lat: pickupCoords.lat, lon: pickupCoords.lon, address: 'Pickup Location' }, // Should pass address
                destination: { lat: dropCoords.lat, lon: dropCoords.lon, address: 'Drop Location' },
                vehicleType: selectedVehicle,
                fare: cost,
                distance,
                duration
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setRideDetails(res.data);
            setRideStatus('confirmed');
        } catch (error) {
            console.error("Error booking ride", error);
            alert("Failed to book ride");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
            {/* Map Section */}
            <div className="h-[50vh] lg:h-screen lg:w-2/3 relative z-0">
                <button
                    onClick={onBack}
                    className="absolute top-4 left-4 z-[1000] bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                >
                    <ArrowLeft className="h-6 w-6 text-gray-900" />
                </button>
                <MapContainer
                    center={[pickupCoords.lat, pickupCoords.lon]}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={[pickupCoords.lat, pickupCoords.lon]}>
                        <Popup>Pickup Location</Popup>
                    </Marker>
                    <Marker position={[dropCoords.lat, dropCoords.lon]}>
                        <Popup>Drop Location</Popup>
                    </Marker>
                    {route && (
                        <Polyline
                            positions={route.geometry.coordinates.map(coord => [coord[1], coord[0]])}
                            color="#FFD700"
                            weight={5}
                        />
                    )}
                    <FitBounds pickup={[pickupCoords.lat, pickupCoords.lon]} drop={[dropCoords.lat, dropCoords.lon]} />
                </MapContainer>
            </div>

            {/* Details Section */}
            <div className="flex-1 bg-white p-6 lg:p-10 overflow-y-auto shadow-xl lg:shadow-none z-10">
                {rideStatus === 'selecting' ? (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Select Your Ride</h2>
                            <button
                                onClick={onBack}
                                className="text-xl font-bold text-gray-900 hover:text-primary transition-colors"
                            >
                                Swift<span className="text-primary">Ride</span>
                            </button>
                        </div>

                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-500">Distance</span>
                                <span className="font-semibold text-gray-900">{(distance / 1000).toFixed(1)} km</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500">Est. Time</span>
                                <span className="font-semibold text-gray-900">{Math.round(duration / 60)} mins</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {['bike', 'auto', 'cab'].map((type) => (
                                <div
                                    key={type}
                                    onClick={() => setSelectedVehicle(type)}
                                    className={`border rounded-xl p-4 cursor-pointer transition-all ${selectedVehicle === type
                                        ? 'border-primary bg-yellow-50 ring-2 ring-primary ring-opacity-50'
                                        : 'border-gray-200 hover:border-primary hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center space-x-4">
                                            <div className="bg-gray-100 p-3 rounded-full">
                                                {type === 'bike' && <Bike className="h-6 w-6 text-gray-700" />}
                                                {type === 'auto' && <Zap className="h-6 w-6 text-gray-700" />}
                                                {type === 'cab' && <Car className="h-6 w-6 text-gray-700" />}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 capitalize">{type}</h3>
                                                <p className="text-sm text-gray-500">Fast & Affordable</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-xl font-bold text-gray-900">₹{calculateCost(distance, type)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={confirmRide}
                            className="w-full mt-8 bg-primary text-gray-900 py-4 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-colors shadow-lg"
                        >
                            Confirm Ride
                        </button>
                    </>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex justify-end mb-2">
                            <button
                                onClick={onBack}
                                className="text-xl font-bold text-gray-900 hover:text-primary transition-colors"
                            >
                                Swift<span className="text-primary">Ride</span>
                            </button>
                        </div>
                        <div className="text-center mb-8">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                                <Shield className="h-8 w-8 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Ride Booked!</h2>
                            <p className="text-gray-500">Your captain is on the way.</p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-4">
                                    <div className="h-16 w-16 bg-gray-200 rounded-full overflow-hidden">
                                        <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop" alt="Driver" className="h-full w-full object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900">Searching...</h3>
                                        <div className="flex items-center text-yellow-500">
                                            <Star className="h-4 w-4 fill-current" />
                                            <span className="ml-1 text-sm font-medium text-gray-700">4.8</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">OTP</p>
                                    <p className="text-2xl font-bold text-primary tracking-widest">{rideDetails?.otp}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button className="w-full flex items-center justify-center space-x-2 bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors">
                                <Phone className="h-5 w-5" />
                                <span>Call Captain</span>
                            </button>
                            <button
                                onClick={() => setRideStatus('selecting')}
                                className="w-full py-4 rounded-xl font-bold text-lg text-red-600 hover:bg-red-50 transition-colors border border-transparent hover:border-red-100"
                            >
                                Cancel Ride
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const Navbar = React.memo(({ onLoginClick, onSignupClick }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const navLinks = [];

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <span className="text-2xl font-bold text-gray-900">
                            Swift<span className="text-primary">Ride</span>
                        </span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-gray-600 hover:text-primary transition-colors font-medium"
                            >
                                {link.name}
                            </a>
                        ))}
                        <div className="flex items-center space-x-4">
                            {user ? (
                                <>
                                    <span className="font-medium text-gray-900">{user.name}</span>
                                    <button onClick={logout} className="text-red-600 hover:text-red-700 font-medium">Logout</button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={onLoginClick}
                                        className="text-gray-900 hover:text-primary font-medium"
                                    >
                                        Login
                                    </button>
                                    <button
                                        onClick={onSignupClick}
                                        className="bg-primary text-gray-900 px-4 py-2 rounded-md font-bold hover:bg-yellow-400 transition-colors shadow-sm"
                                    >
                                        Sign Up
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-600 hover:text-gray-900 focus:outline-none"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-100">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </a>
                        ))}
                        <div className="mt-4 px-3 space-y-2">
                            {user ? (
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        logout();
                                    }}
                                    className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-gray-50"
                                >
                                    Logout
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={() => {
                                            setIsOpen(false);
                                            onLoginClick();
                                        }}
                                        className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                                    >
                                        Login
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsOpen(false);
                                            onSignupClick();
                                        }}
                                        className="block w-full text-center bg-primary text-gray-900 px-4 py-2 rounded-md font-bold hover:bg-yellow-400"
                                    >
                                        Sign Up
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
});

const Hero = React.memo(({ onSearch }) => {
    const [pickup, setPickup] = useState('');
    const [drop, setDrop] = useState('');
    const [vehicleType, setVehicleType] = useState('bike');
    const [pickupSuggestions, setPickupSuggestions] = useState([]);
    const [dropSuggestions, setDropSuggestions] = useState([]);
    const [activeField, setActiveField] = useState(null); // 'pickup' or 'drop'
    const [pickupCoords, setPickupCoords] = useState(null);
    const [dropCoords, setDropCoords] = useState(null);
    const navigate = useNavigate();

    // Debounce function to limit API calls
    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func(...args);
            }, delay);
        };
    };

    const fetchSuggestions = async (query, type) => {
        if (!query || query.length < 3) {
            if (type === 'pickup') setPickupSuggestions([]);
            if (type === 'drop') setDropSuggestions([]);
            return;
        }

        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`);
            const data = await response.json();
            if (type === 'pickup') setPickupSuggestions(data);
            if (type === 'drop') setDropSuggestions(data);
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        }
    };

    // Create memoized debounced fetch
    const debouncedFetch = React.useCallback(debounce(fetchSuggestions, 300), []);

    const handleInputChange = (e, type) => {
        const value = e.target.value;
        if (type === 'pickup') {
            setPickup(value);
            debouncedFetch(value, 'pickup');
            setActiveField('pickup');
        } else {
            setDrop(value);
            debouncedFetch(value, 'drop');
            setActiveField('drop');
        }
    };

    const handleSelectSuggestion = (suggestion, type) => {
        if (type === 'pickup') {
            setPickup(suggestion.display_name);
            setPickupCoords({ lat: suggestion.lat, lon: suggestion.lon });
            setPickupSuggestions([]);
        } else {
            setDrop(suggestion.display_name);
            setDropCoords({ lat: suggestion.lat, lon: suggestion.lon });
            setDropSuggestions([]);
        }
        setActiveField(null);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (pickupCoords && dropCoords) {
            onSearch({ pickup: pickupCoords, drop: dropCoords });
        } else {
            alert("Please select valid locations from the suggestions.");
        }
    };

    // Close suggestions on click outside
    React.useEffect(() => {
        const handleClickOutside = () => setActiveField(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <div className="relative bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                    <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                        <div className="sm:text-center lg:text-left">
                            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                                <span className="block xl:inline">Fast, Affordable Rides</span>{' '}
                                <span className="block text-primary xl:inline">at Your Doorstep</span>
                            </h1>
                            <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                Book bike taxis, autos, and cabs in seconds. Beat the traffic and reach your destination safely with SwiftRide.
                            </p>
                            <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                <div className="rounded-md shadow">
                                    <a
                                        href="#"
                                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-primary hover:bg-yellow-400 md:py-4 md:text-lg md:px-10"
                                    >
                                        Book a Ride
                                    </a>
                                </div>
                                <div className="mt-3 sm:mt-0 sm:ml-3">
                                    {!useAuth().user && (
                                        <button
                                            onClick={() => navigate('/captain-login')}
                                            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-gray-900 hover:bg-gray-800 md:py-4 md:text-lg md:px-10"
                                        >
                                            Become a Captain
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Booking Form */}
                            <div className="mt-10 bg-white p-6 rounded-xl shadow-lg border border-gray-100 max-w-md mx-auto lg:mx-0 relative z-20">
                                <form onSubmit={handleSearch} className="space-y-4">
                                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <MapPin className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                                            placeholder="Enter Pickup Location"
                                            value={pickup}
                                            onChange={(e) => handleInputChange(e, 'pickup')}
                                            onFocus={() => setActiveField('pickup')}
                                            required
                                        />
                                        {activeField === 'pickup' && pickupSuggestions.length > 0 && (
                                            <ul className="absolute z-30 w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-lg max-h-60 overflow-y-auto">
                                                {pickupSuggestions.map((suggestion) => (
                                                    <li
                                                        key={suggestion.place_id}
                                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700 truncate"
                                                        onClick={() => handleSelectSuggestion(suggestion, 'pickup')}
                                                    >
                                                        {suggestion.display_name}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Navigation className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                                            placeholder="Enter Drop Location"
                                            value={drop}
                                            onChange={(e) => handleInputChange(e, 'drop')}
                                            onFocus={() => setActiveField('drop')}
                                            required
                                        />
                                        {activeField === 'drop' && dropSuggestions.length > 0 && (
                                            <ul className="absolute z-30 w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-lg max-h-60 overflow-y-auto">
                                                {dropSuggestions.map((suggestion) => (
                                                    <li
                                                        key={suggestion.place_id}
                                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700 truncate"
                                                        onClick={() => handleSelectSuggestion(suggestion, 'drop')}
                                                    >
                                                        {suggestion.display_name}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-3 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setVehicleType('bike')}
                                            className={`flex flex-col items-center justify-center p-2 rounded-lg border ${vehicleType === 'bike' ? 'border-primary bg-yellow-50' : 'border-gray-200 hover:bg-gray-50'}`}
                                        >
                                            <Bike className={`h-6 w-6 ${vehicleType === 'bike' ? 'text-gray-900' : 'text-gray-500'}`} />
                                            <span className="text-xs mt-1 font-medium">Bike</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setVehicleType('auto')}
                                            className={`flex flex-col items-center justify-center p-2 rounded-lg border ${vehicleType === 'auto' ? 'border-primary bg-yellow-50' : 'border-gray-200 hover:bg-gray-50'}`}
                                        >
                                            <Zap className={`h-6 w-6 ${vehicleType === 'auto' ? 'text-gray-900' : 'text-gray-500'}`} />
                                            <span className="text-xs mt-1 font-medium">Auto</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setVehicleType('cab')}
                                            className={`flex flex-col items-center justify-center p-2 rounded-lg border ${vehicleType === 'cab' ? 'border-primary bg-yellow-50' : 'border-gray-200 hover:bg-gray-50'}`}
                                        >
                                            <Car className={`h-6 w-6 ${vehicleType === 'cab' ? 'text-gray-900' : 'text-gray-500'}`} />
                                            <span className="text-xs mt-1 font-medium">Cab</span>
                                        </button>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-gray-900 bg-primary hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                    >
                                        Search Rides
                                    </button>
                                </form>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* Right Side Illustration */}
            <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-white flex items-center justify-center">
                <div className="relative w-full h-64 sm:h-72 md:h-96 lg:h-full flex items-center justify-center">
                    {/* Abstract Phone Mockup */}
                    <div className="relative w-64 h-[500px] bg-gray-900 rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden hidden lg:block transform rotate-[-5deg] hover:rotate-0 transition-transform duration-500">
                        {/* Screen */}
                        <div className="absolute inset-0 bg-white">
                            {/* Map Background */}
                            <div className="absolute inset-0 bg-blue-50 opacity-50">
                                <div className="absolute top-10 left-10 w-full h-1 bg-gray-200 transform rotate-45"></div>
                                <div className="absolute top-20 right-10 w-full h-1 bg-gray-200 transform -rotate-12"></div>
                                <div className="absolute bottom-1/3 left-0 w-full h-2 bg-yellow-100"></div>
                            </div>

                            {/* UI Elements */}
                            <div className="absolute top-0 w-full h-16 bg-gradient-to-b from-black/50 to-transparent z-10"></div>

                            {/* Route Line */}
                            <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
                                <path d="M 120 150 Q 180 250 140 350" stroke="#FFD700" strokeWidth="4" fill="none" strokeDasharray="8 4" />
                                <circle cx="120" cy="150" r="6" fill="#333" />
                                <circle cx="140" cy="350" r="6" fill="#FFD700" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

const Features = React.memo(() => {
    const features = [
        {
            name: 'Quick Booking',
            description: 'Book a ride in seconds with our easy-to-use app.',
            icon: Clock,
        },
        {
            name: 'Real-time Tracking',
            description: 'Track your ride in real-time from booking to destination.',
            icon: MapPin,
        },
        {
            name: 'Verified Captains',
            description: 'All our drivers are professionally trained and background verified.',
            icon: UserCheck,
        },
        {
            name: 'Affordable Fares',
            description: 'Get the best rates for bike taxis, autos, and cabs.',
            icon: CreditCard,
        },
        {
            name: 'Safety First',
            description: '24/7 safety support and SOS features for your peace of mind.',
            icon: Shield,
        },
        {
            name: 'Top Rated Service',
            description: 'Loved by millions of commuters for reliability and comfort.',
            icon: Heart,
        },
    ];

    return (
        <div className="py-12 bg-white" id="features">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:text-center">
                    <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Features</h2>
                    <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                        Why Ride with SwiftRide?
                    </p>
                    <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                        We provide the fastest, safest, and most affordable way to commute in your city.
                    </p>
                </div>

                <div className="mt-10">
                    <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-x-8 md:gap-y-10">
                        {features.map((feature) => (
                            <div key={feature.name} className="relative group p-6 bg-gray-50 rounded-xl hover:bg-yellow-50 transition-colors duration-300">
                                <dt>
                                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-gray-900 group-hover:scale-110 transition-transform duration-300">
                                        <feature.icon className="h-6 w-6" aria-hidden="true" />
                                    </div>
                                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                                </dt>
                                <dd className="mt-2 ml-16 text-base text-gray-500">
                                    {feature.description}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    );
});

const Footer = React.memo(() => {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <span className="text-2xl font-bold text-white">
                            Swift<span className="text-primary">Ride</span>
                        </span>
                        <p className="mt-4 text-gray-400 max-w-sm">
                            Making urban commuting faster, safer, and more affordable for everyone. Join the revolution today.
                        </p>
                        <div className="flex space-x-6 mt-6">
                            <a href="#" className="text-gray-400 hover:text-primary">
                                <span className="sr-only">Facebook</span>
                                <Facebook className="h-6 w-6" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary">
                                <span className="sr-only">Twitter</span>
                                <Twitter className="h-6 w-6" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary">
                                <span className="sr-only">Instagram</span>
                                <Instagram className="h-6 w-6" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary">
                                <span className="sr-only">LinkedIn</span>
                                <Linkedin className="h-6 w-6" />
                            </a>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Company</h3>
                        <ul className="mt-4 space-y-4">
                            <li><a href="#" className="text-base text-gray-300 hover:text-white">About</a></li>
                            <li><a href="#" className="text-base text-gray-300 hover:text-white">Careers</a></li>
                            <li><a href="#" className="text-base text-gray-300 hover:text-white">Blog</a></li>
                            <li><a href="#" className="text-base text-gray-300 hover:text-white">Press</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Support</h3>
                        <ul className="mt-4 space-y-4">
                            <li><a href="#" className="text-base text-gray-300 hover:text-white">Help Center</a></li>
                            <li><a href="#" className="text-base text-gray-300 hover:text-white">Safety</a></li>
                            <li><a href="#" className="text-base text-gray-300 hover:text-white">Terms of Service</a></li>
                            <li><a href="#" className="text-base text-gray-300 hover:text-white">Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-base text-gray-400">&copy; 2024 SwiftRide. All rights reserved.</p>
                    <div className="mt-4 md:mt-0 flex space-x-4">
                        <a href="#" className="flex items-center justify-center px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-800">
                            <Smartphone className="mr-2 h-5 w-5" />
                            Download App
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
});

const Home = () => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const [bookingData, setBookingData] = useState(null);

    const handleSearch = (data) => {
        setBookingData(data);
    };

    const handleBack = () => {
        setBookingData(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar
                onLoginClick={() => {
                    setAuthMode('login');
                    setIsAuthModalOpen(true);
                }}
                onSignupClick={() => {
                    setAuthMode('signup');
                    setIsAuthModalOpen(true);
                }}
            />

            {bookingData ? (
                <BookingView
                    pickupCoords={bookingData.pickup}
                    dropCoords={bookingData.drop}
                    onBack={handleBack}
                />
            ) : (
                <>
                    <Hero onSearch={handleSearch} />
                    <Features />
                    <Footer />
                </>
            )}

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                initialMode={authMode}
            />
        </div>
    );
};

export default Home;
