
'use client';

import React, { useEffect, useState } from 'react';


interface Reservation {
    id: number;
    guestName: string;
    checkInDate: string;
    checkOutDate: string;
}

interface Place {
    id: number;
    name: string;
    location: string;
    availableFrom: string;
    availableTo: string;
}

const mockReservations: Reservation[] = [
    {
        id: 1,
        guestName: 'John Doe',
        checkInDate: '2023-03-01',
        checkOutDate: '2023-03-05',
    },
    {
        id: 2,
        guestName: 'Jane Smith',
        checkInDate: '2023-03-10',
        checkOutDate: '2023-03-15',
    },
    {
        id: 3,
        guestName: 'Alice Johnson',
        checkInDate: '2023-03-20',
        checkOutDate: '2023-03-25',
    },
];

const mockPlaces: Place[] = [
    {
        id: 1,
        name: 'Cozy Apartment',
        location: 'New York',
        availableFrom: '2023-03-01',
        availableTo: '2023-03-10',
    },
    {
        id: 2,
        name: 'Beach House',
        location: 'California',
        availableFrom: '2023-03-15',
        availableTo: '2023-03-25',
    },
    {
        id: 3,
        name: 'Mountain Cabin',
        location: 'Colorado',
        availableFrom: '2023-03-20',
        availableTo: '2023-03-30',
    },
];

const RecentReservations: React.FC = () => {
    const [mode, setMode] = useState<'guest' | 'landlord'>('guest');
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [places, setPlaces] = useState<Place[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (mode === 'landlord') {
                    const response = await fetch('/api/reservations/recent');
                    if (!response.ok) {
                        throw new Error('Failed to fetch reservations');
                    }
                    const data: Reservation[] = await response.json();
                    setReservations(data);
                } else {
                    const response = await fetch('/api/places/recent');
                    if (!response.ok) {
                        throw new Error('Failed to fetch places');
                    }
                    const data: Place[] = await response.json();
                    setPlaces(data);
                }
            } catch (error) {
                console.error(error);
                // Use mock data if API fails
                if (mode === 'landlord') {
                    setReservations(mockReservations);
                } else {
                    setPlaces(mockPlaces);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [mode]);

    if (loading) {
        return <div className="text-center text-gray-500">Loading...</div>;
    }

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">
                    {mode === 'landlord' ? 'Recent Guests' : 'Recent Places'}
                </h1>
                <button
                    onClick={() => setMode(mode === 'guest' ? 'landlord' : 'guest')}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
                >
                    Switch to {mode === 'guest' ? 'Landlord' : 'Guest'} Mode
                </button>
            </div>
            {mode === 'landlord' ? (
                reservations.length === 0 ? (
                    <p className="text-gray-500">No recent guests found.</p>
                ) : (
                    <ul className="space-y-4">
                        {reservations.map((reservation) => (
                            <li
                                key={reservation.id}
                                className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                            >
                                <p className="font-semibold">Guest: {reservation.guestName}</p>
                                <p>
                                    Check-in:{' '}
                                    {new Date(reservation.checkInDate).toLocaleDateString()}
                                </p>
                                <p>
                                    Check-out:{' '}
                                    {new Date(reservation.checkOutDate).toLocaleDateString()}
                                </p>
                            </li>
                        ))}
                    </ul>
                )
            ) : places.length === 0 ? (
                <p className="text-gray-500">No recent places found.</p>
            ) : (
                <ul className="space-y-4">
                    {places.map((place) => (
                        <li
                            key={place.id}
                            className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                        >
                            <p className="font-semibold">Place: {place.name}</p>
                            <p>Location: {place.location}</p>
                            <p>
                                Available from:{' '}
                                {new Date(place.availableFrom).toLocaleDateString()}
                            </p>
                            <p>
                                Available to:{' '}
                                {new Date(place.availableTo).toLocaleDateString()}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const Page: React.FC = () => {
    return <RecentReservations />;
};

export default Page;