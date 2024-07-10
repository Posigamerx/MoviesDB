// src/components/TrendingMovies.js
import  { useEffect, useState } from 'react';
import axios from 'axios';
import { Spin } from 'antd';
import { StarFilled } from '@ant-design/icons';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; 

const TrendingMovies = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGenres = async () => {
    const genresResponse = await axios.get(
      'https://api.themoviedb.org/3/genre/movie/list',
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

  const fetchTrendingMovies = async () => {
    setLoading(true);
    setError(null);

    if (Object.keys(genres).length === 0) {
      await fetchGenres();
    }

    try {
      const response = await axios.get('https://api.themoviedb.org/3/trending/movie/week', {
        params: { api_key: '4f0c8e1226cda34b94196a1dfa4f229d', language: 'en-US', page: 1 },
      });

      setMovies(response.data.results.slice(0, 15));
      setLoading(false);
    } catch (err) {
      console.error('Error fetching trending movies:', err);
      setError('An error occurred while fetching trending movies.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingMovies();
  }, []);

  if (loading) return <div className='h-screen flex justify-center items-center'><Spin size="large" /></div>;
  if (error) return <div>Error: {error}</div>;


  return (
    <div className={ ` flex justify-center xl:justify-normal md:pr-0 pr-4 row flex-wrap gap-5 xl:w-[70vw] xs:w-full w-[100vw]`}>
      
      
        {movies.map((movie) => (
          <div key={movie.id} className={`lg:w-40 xs:w-36 w-24 ${ movie.vote_average === 0 ? 'hidden' : ''}`}>
            {movie.poster_path && (
              <div className=" shadow-inner">
               <img 
                  className="w-full object-fill rounded-xl shadow-inner "
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title} 

                />
                <div className='flex justify-between text-gray-400 xs:text-xs text-[9px]  items-center my-2'>
                <p> {new Date(movie.release_date).getFullYear()}</p>
                <p className='text-slate-400 border px-1 rounded-2xl py-0'>{movie.media_type}</p>
                <p className="xs:text-sm text-[9px]"><StarFilled style={{ color: 'gold' }}/> {movie.vote_average.toFixed(1)} </p>
                
                </div>
                 <h3 className=" z-50 text-slate-50 xs:text-sm text-[12px] font-normal mb-2">{movie.title} </h3>
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

export default TrendingMovies;
