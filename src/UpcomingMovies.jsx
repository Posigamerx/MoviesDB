// src/UpcomingMovies.js
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Pagination, Spin, Modal } from 'antd';

const UpcomingMovies = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [details, setDetails] = useState({});
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const totalPages = 50; // Set total number of pages to 50

  useEffect(() => {
    const fetchUpcomingMovies = async (page) => {
      setLoading(true);
      try {
        const response = await axios.get(
          'https://api.themoviedb.org/3/movie/upcoming',
          {
            params: {
              api_key: '4f0c8e1226cda34b94196a1dfa4f229d', // Replace with your TMDb API key
              page: page,
            },
          }
        );

        const genresResponse = await axios.get(
          'https://api.themoviedb.org/3/genre/movie/list',
          {
            params: {
              api_key: '4f0c8e1226cda34b94196a1dfa4f229d', // Replace with your TMDb API key
              language: 'en-US',
            },
          }
        );

        const genresData = genresResponse.data.genres.reduce((acc, genre) => {
          acc[genre.id] = genre.name;
          return acc;
        }, {});

        // Filter out movies that have already been released
        const upcomingMovies = response.data.results.filter(
          (movie) => new Date(movie.release_date) > new Date()
        );

        setMovies(upcomingMovies);
        setGenres(genresData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUpcomingMovies(page);
  }, [page]);

  const fetchDetails = async (movieId) => {
    if (details[movieId]) return; // Avoid refetching if details are already available

    setLoadingDetails(true);
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
        params: {
          api_key: '4f0c8e1226cda34b94196a1dfa4f229d', // Replace with your TMDb API key
          append_to_response: 'credits',
        },
      });
      setDetails((prevDetails) => ({
        ...prevDetails,
        [movieId]: response.data,
      }));
      setLoadingDetails(false);
    } catch (error) {
      console.error('Error fetching movie details:', error);
      setLoadingDetails(false);
    }
  };

  const showModal = (movie) => {
    setSelectedMovie(movie);
    fetchDetails(movie.id);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedMovie(null);
  };

  const handlePageChange = (page) => {
    setPage(page);
  };
  console.log(selectedMovie)
  console.log(movies);

  if (loading) return <div className='h-screen flex justify-center items-center'><Spin size="large" /></div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={` bg-gray-900 bg-no-repeat bg-fixed bg-center h-full min-h-screen `}>
      <h1 className='pt-20 mb-2 ml-5 text-2xl sm:pt-28 sm:mb-5 sm:ml-10 sm:text-4xl font-bold text-white'>Upcoming Movies   </h1>
      <ul className='flex flex-wrap gap-2 xs:gap-5 justify-center'>
        {movies.map((movie) => (
          <li key={movie.id} onClick={() => showModal(movie)} className="cursor-pointer md:w-[17vw] xs:w-[20vw]   w-[28vw]  text-white   rounded transform transition duration-300 ease-in-out hover:scale-105" >
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
            />
            <div className='flex flex-row justify-between text-[9px]  px-2 sm:font-medium sm:text-sm my-1 xs:my-2 '>
            <p>
            {new Date(movie.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' })}
            </p>
            <p>{movie.original_language}</p>
            </div>
             <h3 className='px-2 text-xs h-15 sm:font-semibold sm:text-base'>{movie.title} </h3>

           
          </li>
        ))}
      </ul>

      <Modal
        title={selectedMovie?.title}
        visible={modalVisible}
        onCancel={closeModal}
        footer={null}
        className=''
      >
        {loadingDetails && !details[selectedMovie?.id] ? (
          <Spin size="large" />
        ) : details[selectedMovie?.id] ? (
          <div className=''>
             <div className='relative flex justify-center '>
            <img
            src={`https://image.tmdb.org/t/p/w500${details[selectedMovie.id].backdrop_path}`}
            alt={details[selectedMovie.id].title}
          
          />
          <div className=' absolute w-[20%] -bottom-8 border-[3px] box-border  shadow-2xl rounded-lg transition-all'>
          < img
            src={`https://image.tmdb.org/t/p/w500${details[selectedMovie.id].poster_path}`}
            alt={details[selectedMovie.id].title}
            className='rounded'
          /></div>
          

            </div>
            <p className='mt-10'>{details[selectedMovie.id].overview}</p>
            <p><strong>Genres:</strong> {details[selectedMovie.id].genres.map(genre => genre.name).join(', ') || 'N/A'}</p>
            <p><strong>Director:</strong> {details[selectedMovie.id].credits.crew.find(member => member.job === 'Director')?.name}</p>
            <p><strong>Producers:</strong> {details[selectedMovie.id].credits.crew.filter(member => member.job === 'Producer').map(member => member.name).join(', ')}</p>
            <p><strong>Actors:</strong> {details[selectedMovie.id].credits.cast.slice(0, 5).map(actor => actor.name).join(', ')}</p>
            <p><strong>Production Companies:</strong> {details[selectedMovie.id].production_companies.map(company => company.name).join(', ')}</p>
            <p><strong>Release Platform:</strong> {details[selectedMovie.id].platform || 'N/A'}</p>
          </div>
        ) : (
          <p>No additional information available.</p>
        )}
      </Modal>

      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
        <Pagination
          current={page}
          total={totalPages * 7} 
          
          onChange={handlePageChange}
          pageSize={10} 
          showSizeChanger={false} 
          className='my-5'
        />
      </div>
    </div>
  );
};

export default UpcomingMovies;
