// src/components/AppleTVPlusTrending.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Spin } from 'antd';
import Slider from 'react-slick';
import { StarFilled } from '@ant-design/icons';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { SiPrimevideo, SiAppletv } from "react-icons/si";


const AppleTVPlusTrending = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [genres, setGenres] = useState({});

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genresResponse = await axios.get('https://api.themoviedb.org/3/genre/movie/list', {
          params: {
            api_key: '4f0c8e1226cda34b94196a1dfa4f229d',
            language: 'en-US',
          },
        });

        const genresData = genresResponse.data.genres.reduce((acc, genre) => {
          acc[genre.id] = genre.name;
          return acc;
        }, {});

        setGenres(genresData);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    const fetchMovies = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/discover/movie`, {
          params: {
            api_key: '4f0c8e1226cda34b94196a1dfa4f229d',
            language: 'en-US',
            sort_by: 'popularity.desc',
            with_watch_providers: 350,
            watch_region: 'US',
          },
        });

        setMovies(response.data.results.slice(0, 5)); // Limit to 10 movies
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setError('An error occurred while fetching movies.');
        setLoading(false);
      }
    };

    fetchGenres();
    fetchMovies();
  }, []);

  if (loading) return <div className='h-screen flex justify-center items-center'><Spin size="large" /></div>;
  if (error) return <div>Error: {error}</div>;

 

  return (
    <div className="relative  flex-col justify-end ">
        <h1 className='mx-24 text-white flex text-3xl font-bold items-center mb-4'> Top 5 <SiAppletv  className='ml-5 text-6xl'/> </h1>
        {movies.map((movie , index) => (
          <div key={movie.id} className="mb-2  mx-20 ">
            <div className="w-full h-[5vw] flex bg-gray-950 rounded-lg cursor-pointer hover:bg-blue-800">
             
            <h1 className='absolute border-2 border-blue-800 font-bold   text-white left z-10 rounded-full w-8 h-8 flex items-center justify-center left-[4rem] mt-4 bg-inherit'>{index + 1 }</h1>

           <div>
             <img
                className="h-full   object-contain rounded"
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
              /></div>
              <div className='h-full ml-3'>
               <div className='flex mt-2 gap-4 items-center text-gray-500'>
                
              <p className="text-xs "><StarFilled style={{ color: 'gold', }} /> {movie.vote_average.toFixed(1)} </p>
              <p className="text-xs ">{new Date(movie.release_date).getFullYear()}</p>
              </div>
              <h4 className="text-base text-white font-semibold mt-2 ">{movie.title}</h4>
              </div>
              
              
              </div>
            
          </div>
        ))}
    </div>
  );
};

export default AppleTVPlusTrending;
