import React, { useState, useEffect } from 'react';
import { SelectBudgetOptions } from '../constants/options';

const GEOAPIFY_API_KEY = '988f516afbca45c19d071bf1c5230c36';

function CreateTrip() {
  const [placeQuery, setPlaceQuery] = useState('');
  const [placeSuggestions, setPlaceSuggestions] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedBudget, setSelectedBudget] = useState(null);

  const handleBudgetSelect = (index) => {
    setSelectedBudget(prev => (prev === index ? null : index));
  };

  // Fetch autocomplete suggestions from Geoapify
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

    const delayDebounce = setTimeout(() => {
      fetchSuggestions();
    }, 300); // debounce

    return () => clearTimeout(delayDebounce);
  }, [placeQuery]);

  return (
    <div className='sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10'>
      <h2 className='font-bold text-3xl'>Tell us your travel preferences</h2>
      <p className='mt-3 text-black-500 text-xl'>
        Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.
      </p>

      <div className='mt-20 flex flex-col gap-10'>
        {/* Destination Input */}
        <div>
          <h2 className='text-xl my-3 font-medium'>What is the destination of your choice?</h2>
          <input
            type="text"
            placeholder="Start typing your destination..."
            value={placeQuery}
            onChange={(e) => {
              setPlaceQuery(e.target.value);
              setSelectedPlace(null);
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

        {/* Trip Days Input */}
        <div>
          <h2 className='text-xl my-3 font-medium'>How many days are you planning your trip?</h2>
          <input
            type="number"
            placeholder="Ex. 3"
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
        </div>
      </div>

      {/* Budget Selection */}
      <div className='mt-10'>
        <h2 className='text-xl my-3 font-medium'>What is your Budget?</h2>
        <div className='flex gap-6 mt-5 overflow-x-auto'>
          {SelectBudgetOptions.map((item, index) => (
            <div
              key={index}
              onClick={() => handleBudgetSelect(index)}
              className={`min-w-[250px] px-6 py-8 rounded-xl flex-shrink-0 text-center cursor-pointer transition-all duration-200
                ${selectedBudget === index
                  ? 'border-2 border-sky-500 bg-sky-100 shadow-lg'
                  : 'border border-gray-300 hover:shadow-md hover:scale-[1.03]'}`}
            >
              <div className='text-3xl mb-4'>{item.icon}</div>
              <div className='text-base text-gray-600 mb-2'>{item.desc}</div>
              <div className='text-lg font-semibold'>{item.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CreateTrip;
