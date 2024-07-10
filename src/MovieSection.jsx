// src/MoviesSection.js
import { useState } from 'react';
import { Spin, Modal } from 'antd';
import { StarFilled } from '@ant-design/icons';
import axios from 'axios';

const MoviesSection = ({ movies, genres }) => {
  const [details, setDetails] = useState({});
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

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
        
      } ));
      
      
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
console.log(movies)
  return (
    <ul className='flex flex-wrap gap-2 xs:gap-5 justify-center'> 
      {movies.map((movie) => (
        <li key={movie.id} onClick={() => showModal(movie)} className="cursor-pointer md:w-[17vw] xs:w-[20vw]   w-[28vw]  text-white   rounded "  >

           <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className='hover:shadow-inner rounded '
          />
          <div className='flex flex-row justify-between text-[9px]  px-2 sm:font-medium sm:text-sm my-1 xs:my-2 '>
          <p>
           <StarFilled style={{ color: 'gold' }} />  {movie.vote_average.toFixed(1)}
          </p>

          <p>
            {new Date(movie.release_date).getFullYear()}
          </p>
          <p>{movie.original_language}</p>
          </div>
          <h3 className='px-2 text-xs h-15 sm:font-semibold sm:text-base'>{movie.title} </h3>
          
         
        </li>
      ))}

      <Modal
        title={selectedMovie?.title}
        visible={modalVisible}
        onCancel={closeModal}
        footer={null}
        
        styles={{mask:{backdropFilter:"blur(10px)"} }}
      >
        {loadingDetails && !details[selectedMovie?.id] ? (
          <Spin size="large" className='flex justify-center'/>
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
    </ul>
  );
};

export default MoviesSection;
