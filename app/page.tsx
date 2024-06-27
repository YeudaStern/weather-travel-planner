'use client'

import { useState } from 'react';
import dynamic from 'next/dynamic';
import TripForm from '../components/TripForm';
import axios from 'axios';
import { createApi } from 'unsplash-js';

import "../components/style.css"

const Map = dynamic(() => import('../components/Map'), { ssr: false });

const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || '',
});

interface TripData {
  location: string;
  startDate: string;
  endDate: string;
}

interface WeatherData {
  list: Array<{
    dt: number;
    main: { temp: number };
    weather: Array<{ description: string }>;
  }>;
  city: {
    coord: { lat: number; lon: number };
  };
}

export default function Home() {
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [image, setImage] = useState<string | null>(null);

  const handleSubmit = async ({ location, startDate, endDate }: TripData) => {
    // Fetch weather data
    const weatherRes = await axios.get<WeatherData>(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY}&units=metric`);
    setWeatherData(weatherRes.data);

    // Fetch image
    const imageRes = await unsplash.search.getPhotos({
      query: location,
      page: 1,
      perPage: 1,
    });
    if (imageRes.response) {
      setImage(imageRes.response.results[0].urls.regular);
    }

    setTripData({ location, startDate, endDate });
  };

  return (
    <div className='min-h-screen bg-slate-800'>

      <main className='items-center text-center p-20 max-sm:p-3 max-sm:pt-20'>
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
          Weather Travel Planner
        </h1>        <TripForm onSubmit={handleSubmit} />

        {tripData && weatherData && (
          <div>
            <h2 className='text-3xl font-bold py-3'>Trip to {tripData.location}</h2>
            <p className='bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text'>From {tripData.startDate} to {tripData.endDate}</p>

            {image && <img src={image} alt={tripData.location} style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }} />}

            <div className="mb-4">
              <h3 className="text-xl font-semibold py-3 text-white">Weather Forecast</h3>
              <div className="relative">
                <div className="flex overflow-x-auto space-x-2 py-2 px-1 cool-scroll rounded-lg">
                  {weatherData.list.slice(0, 5).map((day, index) => (
                    <div key={index} className="flex-shrink-0 border-2 border-white p-2 rounded-lg bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg">
                      <p className="whitespace-nowrap text-white rounded-lg">
                        {new Date(day.dt * 1000).toLocaleDateString()}: {day.main.temp.toFixed(1)}°C, {day.weather[0].description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className='rounded-lg overflow-hidden'>

              <Map location={tripData.location} lat={weatherData.city.coord.lat} lon={weatherData.city.coord.lon} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}