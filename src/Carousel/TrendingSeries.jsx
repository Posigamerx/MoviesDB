// src/components/TrendingSeries.js
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Spin } from 'antd';
import { StarFilled } from '@ant-design/icons';

const TrendingSeries = () => {
  const [series, setSeries] = useState([]);
  const [genres, setGenres] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGenres = async () => {
    const genresResponse = await axios.get(
      'https://api.themoviedb.org/3/genre/tv/list',
      {
        params: {
          api_key: '4f0c8e1226cda34b94196a1dfa4f229d',
          language: 'en-US',
        },
      }
    );

    const genresData = genresResponse.data.genres.reduce((acc, genre) => {
      acc[genre.id] = genre.name;
      return acc;
    }, {});

    setGenres(genresData);
  };

  const fetchTrendingSeries = async () => {
    setLoading(true);
    setError(null);

    if (Object.keys(genres).length === 0) {
      await fetchGenres();
    }

    try {
      const response = await axios.get('https://api.themoviedb.org/3/trending/tv/week', {
        params: { api_key: '4f0c8e1226cda34b94196a1dfa4f229d' },
      });

      setSeries(response.data.results.slice(0, 15));
      setLoading(false);
    } catch (err) {
      console.error('Error fetching trending series:', err);
      setError('An error occurred while fetching trending series.');
      setLoading(false);
    }
  };

console.log(series)
  useEffect(() => {
    fetchTrendingSeries();
  }, []);

  if (loading) return <div className='h-screen flex justify-center items-center'><Spin size="large" /></div>;
  if (error) return <div>Error: {error}</div>;



  return (
    <div className={ `flex  justify-center xl:justify-normal md:pr-0 pr-4 row flex-wrap gap-5 xl:w-[70vw] xs:w-full w-[100vw]`}>
         
        {series.map((serie) => (
          <div key={serie.id} className={`lg:w-40 xs:w-36 w-24 ${ serie.vote_average === 0 ? 'hidden' : ''}`}>
            {serie.poster_path && (
              <div className=" shadow-inner">
              <img
                  src={`https://image.tmdb.org/t/p/w500${serie.poster_path}`}
                  alt={serie.name}
                  className="w-full object-fill rounded-xl shadow-inner"
                /> 
               <div className='flex justify-between text-gray-400 xs:text-xs text-[9px]  items-center my-2'>
               <p> {new Date(serie.first_air_date).getFullYear()}</p>
                <p className='text-slate-400 border px-1 rounded-2xl py-0'>tv-series</p>
                <p className="xs:text-sm text-[9px]"><StarFilled style={{ color: 'gold' }} /> {serie.vote_average.toFixed(1)} </p>
                </div>
                 <h3 className="z-50 text-slate-50 xs:text-sm text-[12px] font-normal mb-2">{serie.name}</h3>
              </div>
            )}
          </div>
        ))}
     
    </div>
  );
};

export default TrendingSeries;
