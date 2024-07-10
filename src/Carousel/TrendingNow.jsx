// src/components/PopularNow.js
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Spin } from 'antd';
import Slider from 'react-slick';
import { StarFilled, ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';



const PopularNow = () => {
  const [trendingMedia, setTrendingMedia] = useState([]);
  const [genres, setGenres] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    useEffect(() => {
    const fetchGenres = async () => {
      try {
        const movieGenresResponse = await axios.get('https://api.themoviedb.org/3/genre/movie/list', {
          params: {
            api_key: '4f0c8e1226cda34b94196a1dfa4f229d',
            language: 'en-US',
          },
        });

        const tvGenresResponse = await axios.get('https://api.themoviedb.org/3/genre/tv/list', {
          params: {
            api_key: '4f0c8e1226cda34b94196a1dfa4f229d',
            language: 'en-US',
          },
        });

        const allGenres = [...movieGenresResponse.data.genres, ...tvGenresResponse.data.genres].reduce(
          (acc, genre) => {
            acc[genre.id] = genre.name;
            return acc;
          },
          {}
        );

        setGenres(allGenres);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    const fetchTrendingMedia = async () => {
      try {
        const trendingResponse = await axios.get('https://api.themoviedb.org/3/trending/all/week', {
          params: {
            language: 'en-US',
          },
          headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZjBjOGUxMjI2Y2RhMzRiOTQxOTZhMWRmYTRmMjI5ZCIsIm5iZiI6MTcxOTk2Nzc2My44NzA1OTQsInN1YiI6IjY2NDRjYjUzNjI3MjQ2MjgwMTJlYzQ2NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ueRp7HM2nsnEGWUA3TnadngrMkEC1jJN8mq3BjIYJ3c',
            accept: 'application/json',
          },
        });

        const trendingMediaData = trendingResponse.data.results
          .slice(0, 10) // Limit to the first 10 items
          .map(media => ({
            ...media,
            media_type: media.media_type || (media.title ? 'movie' : 'tv'), // Some items in trending API may not have media_type
          }));

        setTrendingMedia(trendingMediaData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching trending media:', error);
        setError('An error occurred while fetching trending media.');
        setLoading(false);
      }
    };

    fetchGenres();
    fetchTrendingMedia();
  }, []);

  if (loading) return <div className='h-screen flex justify-center items-center'><Spin size="large" /></div>;
  if (error) return <div>Error: {error}</div>;


  const settings = {
    infinite: true,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    prevArrow: <ArrowLeftOutlined /> ,
    nextArrow:<ArrowRightOutlined />,
    speed: 2000,
    autoplaySpeed: 5000,
    cssEase: "linear",
    
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  
  };
  console.log(trendingMedia)

  return (
    <div className="px-10 pt-20 bg-gray-900 h-[100vh] lg:h-full">
      <Slider {...settings}>
        {trendingMedia.map((media) => (
          <div key={media.id} className="lg:p-2 p-1">
             <img
                className="w-full h-full object-cover  rounded-lg"
                src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
                alt={media.title || media.name}
              /><div className='text-white lg:w-[32rem] xs:w-[30rem] w-[14rem]  ml-5 backdrop-blur-md z-50 absolute top-[50%] xs:top-1/3 text-xl font-bold mb-2'>
              <h4 className=" xs:text-2xl  text-base">{media.title || media.name}</h4>
              <p className="xs:text-sm text-xs my-1">{media.genre_ids.map(id => genres[id]).join('. ')}</p>
             <div className='flex row items-center gap-4 lg:my-2 my-2' >
              <p className="md:text-xl xs:text-base text-xs text-white  flex items-center gap-2 "> <StarFilled className='md:text-xl xs:text-base text-sm' style={{ color: 'gold', }} /> {media.vote_average.toFixed(1)}</p>
              <p className=" flex xs:text-base text-xs items-center">{new Date(media.release_date || media.first_air_date).getFullYear()}</p>
              <p className='text-xs xs:text-base lg:text-xl'>{media.original_language}</p>
              <p className="xs:text-xl text-xs">{media.media_type === 'movie' ? 'Movie' : 'TV Series'}</p>
              
              </div> 
              <div>
                <p className='font-normal w-full text-xs h-full xs:text-sm'>{media.overview}</p>
                
              </div>
            </div>
            <div className="w-full absolute rotate-180 inset-0 bg-gradient-to-b dark:from-gray-900 dark:to-transparent opacity-50 h-full md:opacity-70 lg:opacity-50"></div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default PopularNow;
