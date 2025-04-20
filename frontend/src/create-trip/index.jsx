import React, { useState, useEffect } from 'react';
import { SelectBudgetOptions } from '../constants/options';

const GEOAPIFY_API_KEY = '988f516afbca45c19d071bf1c5230c36';

function CreateTrip() {
  const [placeQuery, setPlaceQuery] = useState('');
  const [placeSuggestions, setPlaceSuggestions] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [tripDays, setTripDays] = useState('');
  const [numMembers, setNumMembers] = useState('');
  const [numRooms, setNumRooms] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [tripDate, setTripDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [tripData, setTripData] = useState(null);

  const handleBudgetSelect = (index) => {
    setSelectedBudget((prev) => (prev === index ? null : index));
  };

  const handleSubmit = async () => {
    if (!selectedPlace || !tripDays || selectedBudget === null || !numMembers || !numRooms || !tripDate) {
      alert('Please fill all required fields.');
      return;
    }

    setLoading(true);
    setTripData(null);

    try {
      const res = await fetch('http://localhost:5000/api/trip-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: selectedPlace.properties.city || selectedPlace.properties.name,
          checkinDate: tripDate,
          nights: parseInt(tripDays),
          members: parseInt(numMembers),
          rooms: parseInt(numRooms),
          budgetMin: budgetMin || 0,
          budgetMax: budgetMax || 999999,
        }),
      });

      
      const data = await res.json();
      console.log(data.hotels);
      
      setTripData(data);
    } catch (error) {
      console.error('Error fetching trip plan:', error);
      alert('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!placeQuery) {
        setPlaceSuggestions([]);
        return;
      }

      try {
        const res = await fetch(
          `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
            placeQuery
          )}&limit=5&apiKey=${GEOAPIFY_API_KEY}`
        );
        const data = await res.json();
        setPlaceSuggestions(data.features);
      } catch (err) {
        console.error('Error fetching autocomplete results:', err);
      }
    };

    const delayDebounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(delayDebounce);
  }, [placeQuery]);

  const handleReset = () => {
    setTripData(null);
    setTripDays('');
    setSelectedBudget(null);
    setSelectedPlace(null);
    setPlaceQuery('');
    setPlaceSuggestions([]);
    setNumMembers('');
    setNumRooms('');
    setBudgetMin('');
    setBudgetMax('');
    setTripDate('');
  };

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10">
      <h2 className="font-bold text-3xl">Tell us your travel preferences</h2>
      <p className="mt-3 text-black-500 text-xl">
        Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.
      </p>

      <div className="mt-20 flex flex-col gap-10">
        {/* Destination */}
        <div>
          <h2 className="text-xl my-3 font-medium">What is the destination of your choice?</h2>
          <input
            type="text"
            placeholder="Start typing your destination..."
            value={placeQuery}
            onChange={(e) => {
              setPlaceQuery(e.target.value);
              setSelectedPlace(null);
              setTripData(null);
            }}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
          {placeSuggestions.length > 0 && (
            <div className="mt-2 border border-gray-300 rounded shadow-md bg-white max-h-60 overflow-y-auto">
              {placeSuggestions.map((place, index) => (
                <div
                  key={index}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSelectedPlace(place);
                    setPlaceQuery(place.properties.formatted);
                    setPlaceSuggestions([]);
                  }}
                >
                  {place.properties.formatted}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Travel Date */}
        <div>
          <h2 className="text-xl my-3 font-medium">Select your travel start date</h2>
          <input
            type="date"
            value={tripDate}
            onChange={(e) => setTripDate(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
        </div>

        {/* Trip Days */}
        <div>
          <h2 className="text-xl my-3 font-medium">How many days are you planning your trip?</h2>
          <input
            type="number"
            value={tripDays}
            onChange={(e) => setTripDays(e.target.value)}
            placeholder="Ex. 3"
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
        </div>

        {/* Number of Members */}
        <div>
          <h2 className="text-xl my-3 font-medium">How many members are going?</h2>
          <input
            type="number"
            value={numMembers}
            onChange={(e) => setNumMembers(e.target.value)}
            placeholder="Ex. 4"
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
        </div>

        {/* Number of Rooms */}
        <div>
          <h2 className="text-xl my-3 font-medium">How many rooms do you need?</h2>
          <input
            type="number"
            value={numRooms}
            onChange={(e) => setNumRooms(e.target.value)}
            placeholder="Ex. 2"
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
        </div>

        {/* Budget Range */}
        <div>
          <h2 className="text-xl my-3 font-medium">What’s your total budget range (optional)?</h2>
          <div className="flex gap-4">
            <input
              type="number"
              value={budgetMin}
              onChange={(e) => setBudgetMin(e.target.value)}
              placeholder="Min (₹)"
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />
            <input
              type="number"
              value={budgetMax}
              onChange={(e) => setBudgetMax(e.target.value)}
              placeholder="Max (₹)"
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />
          </div>
        </div>
      </div>

      {/* Budget Selection */}
      <div className="mt-10">
        <h2 className="text-xl my-3 font-medium">What is your Budget?</h2>
        <div className="flex gap-6 mt-5 overflow-x-auto">
          {SelectBudgetOptions.map((item, index) => (
            <div
              key={index}
              onClick={() => handleBudgetSelect(index)}
              className={`min-w-[250px] px-6 py-8 rounded-xl flex-shrink-0 text-center cursor-pointer transition-all duration-200 ${
                selectedBudget === index
                  ? 'border-2 border-sky-500 bg-sky-100 shadow-lg'
                  : 'border border-gray-300 hover:shadow-md hover:scale-[1.03]'
              }`}
            >
              <div className="text-3xl mb-4">{item.icon}</div>
              <div className="text-base text-gray-600 mb-2">{item.desc}</div>
              <div className="text-lg font-semibold">{item.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-10">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
        >
          {loading ? 'Generating Itinerary...' : 'Generate Itinerary'}
        </button>
      </div>

      {/* Reset Button */}
      {tripData && (
        <div className="mt-5">
          <button
            onClick={handleReset}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
          >
            Plan Another Trip
          </button>
        </div>
      )}

      {/* Response Display */}
      {tripData && (
        <div className="mt-14">
          {/* Hotels */}
          <h3 className="text-2xl font-semibold mb-4">Hotels:</h3>
          {tripData.hotels?.length > 0 ? (
            <div className="grid gap-4">
              {tripData.hotels.map((hotel, index) => {
                console.log(hotel);  // Check each hotel in the loop
                return (
                  <div key={index} className="border rounded p-4 shadow-sm">
                    <h4 className="text-xl font-bold">{hotel.name}</h4>
                    {/* Address if available */}
                    {hotel.address && (
                      <p className="text-700">
                        <span className="font-medium">Address:</span> {hotel.address}
                      </p>
                    )}

                    {/* Rating if available */}
                    {hotel.rating && (
                      <p className="text-yellow-700">
                        <span className="font-medium">Rating:</span> {hotel.rating}
                      </p>
                    )}

                    {/* Price if available */}
                    {hotel.price && hotel.price !== "N/A" ? (
                      <p className="text-green-700 text-lg font-semibold">
                        {hotel.price} {hotel.currency}
                      </p>
                    ) : (
                      <p className="text-light-500 italic">Price not available</p>
                    )}

                    {/* Distance if available */}
                    {hotel.distance && hotel.distanceUnit && (
                      <p className="text-sm text-600">
                        <span className="font-medium">Distance:</span> {hotel.distance} {hotel.distanceUnit}
                      </p>
                    )}
                  </div>
                );
              })}

            </div>
          ) : (
            <p className="text-gray-500">No hotels found for the selected location and preferences.</p>
          )}

          {/* Attractions */}
          <h3 className="text-2xl font-semibold mt-10 mb-4">Places to Visit:</h3>
          {tripData.attractions?.length > 0 ? (
            <ul className="list-disc pl-5 space-y-2">
              {tripData.attractions.map((place, index) => {
                const kind = place.kind
                  ?.split(",")
                  .slice(0, 2) // Show only first 2 kinds
                  .map((k) =>
                    k
                      .replace(/_/g, " ")       // Replace underscores with spaces
                      .replace(/\b\w/g, (l) => l.toUpperCase()) // Capitalize each word
                  )
                  .join(", ");

                return (
                  <li key={index}>
                    <span className="font-medium">{place.name || "Unnamed Place"}</span>
                    {kind && <span className="text-light-600"> — {kind}</span>}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-500">No attractions found for this trip.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default CreateTrip;
