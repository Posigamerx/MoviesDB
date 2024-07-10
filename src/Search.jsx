// src/SearchPage.js
import { useState } from 'react';
import axios from 'axios';
import { Input, Spin, Modal } from 'antd';
import { StarFilled } from '@ant-design/icons';

const { Search } = Input;

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState({});
  const [details, setDetails] = useState({});
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);

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

  const handleSearch = async (value) => {
    setSearchTerm(value);
    setLoading(true);
    setError(null);
    if (Object.keys(genres).length === 0) {
      await fetchGenres();
    }
    try {
      const searchResponse = await axios.get(
        'https://api.themoviedb.org/3/search/multi',
        {
          params: {
            api_key: '4f0c8e1226cda34b94196a1dfa4f229d',
            query: value,
          },
        }
      );
      if (searchResponse.data.results.length === 0) {
        setError('No results found.');
      } else {
        setResults(searchResponse.data.results);
      }
    } catch (err) {
      console.error('Error fetching search results:', err);
      setError('An error occurred while fetching search results.');
    }
    setLoading(false);
  };

  const fetchDetails = async (id, mediaType) => {
    if (details[id]) return;

    setLoadingDetails(true);
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/${mediaType}/${id}`, {
        params: {
          api_key: '4f0c8e1226cda34b94196a1dfa4f229d',
          append_to_response: 'credits',
        },
      });
      setDetails((prevDetails) => ({
        ...prevDetails,
        [id]: response.data,
      }));
      setLoadingDetails(false);
    } catch (error) {
      console.error('Error fetching details:', error);
      setLoadingDetails(false);
    }
  };

  const showModal = (result) => {
    setSelectedResult(result);
    fetchDetails(result.id, result.media_type);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedResult(null);
  };

  return (
    <div className={` bg-gray-900 bg-no-repeat bg-fixed bg-center ${results.length === 0 ? 'h-screen' : 'h-full'}`}>
      <h1 className='pt-20 mb-2 ml-5 text-2xl sm:pt-28 sm:mb-5 sm:ml-10 sm:text-4xl font-bold text-white'>Search    </h1>
      <div className='mx-5 sm:mx-10'>
      <Search
        placeholder="Search for a movie or TV series"
        enterButton="Search"
        size="large"
        onSearch={handleSearch}
        styles={{ backgroundColor: 'gray', }}
      /></div>
      {loading ? (
        <div className="h-screen flex justify-center items-center"><Spin size="large" /></div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <ul className='flex flex-wrap gap-2 xs:gap-5 justify-center pb-5'>
          {results.map((result) => (
            <li key={result.id} onClick={() => showModal(result)} className={`cursor-pointer md:w-[17vw] xs:w-[20vw]  mt-5  w-[28vw]  text-white   rounded transform transition duration-300  ease-in-out hover:scale-105 ${result.poster_path ==null ? ('hidden')  : ('')}`}> 

              {result.poster_path ? (
                <div >
                  <img
                    src={`https://image.tmdb.org/t/p/w500${result.poster_path}`}
                    alt={result.title || result.name}
                  />
                  <div className='flex flex-row justify-between text-[9px]  px-2 sm:font-medium sm:text-sm my-1 xs:my-2 '>
                  <p>{result.media_type === 'movie' ? 'Movie' : 'TV Series'}</p>
                  <p>{result.original_language}</p>

                  <p> <StarFilled style={{ color: 'gold' }} /> {result.vote_average.toFixed(1)}</p></div>
                  <h3 className='px-2 text-xs h-15 sm:font-semibold sm:text-base'>{result.title || result.name} ({result.release_date || result.first_air_date ? new Date(result.release_date || result.first_air_date).getFullYear() : 'N/A'})</h3>

                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}

      <Modal
        title={selectedResult?.title || selectedResult?.name}
        visible={modalVisible}
        onCancel={closeModal}
        footer={null}
      >
        {loadingDetails && !details[selectedResult?.id] ? (
          <Spin size="large" />
        ) : details[selectedResult?.id] ? (
          <div>
             <div className='relative flex justify-center '>
            <img
            src={`https://image.tmdb.org/t/p/w500${details[selectedResult.id].backdrop_path}`}
            alt={details[selectedResult.id].title}
          
          />
          <div className=' absolute w-[20%] -bottom-8 border-[3px] box-border  shadow-2xl rounded-lg transition-all'>
          < img
            src={`https://image.tmdb.org/t/p/w500${details[selectedResult.id].poster_path}`}
            alt={details[selectedResult.id].title}
            className='rounded'
          /></div>
          

            </div>
            
            <p className='mt-10'>{details[selectedResult.id].overview}</p>
            <p><strong>Genres:</strong> {details[selectedResult.id].genres.map(genre => genre.name).join(', ') || 'N/A'}</p>
            <p><strong>Release Date:</strong> {details[selectedResult.id].release_date || 'N/A' } </p>
            <p><strong>Director:</strong> {details[selectedResult.id].credits.crew.find(member => member.job === 'Director')?.name || 'N/A'}</p>
            <p><strong>Producers:</strong> {details[selectedResult.id].credits.crew.filter(member => member.job === 'Producer').map(member => member.name).join(', ') || 'N/A'}</p>
            <p><strong>Actors:</strong> {details[selectedResult.id].credits.cast.slice(0, 5).map(actor => actor.name).join(', ') || 'N/A'}</p>
            <p><strong>Production Companies:</strong> {details[selectedResult.id].production_companies.map(company => company.name).join(', ') || 'N/A'}</p>
          </div>
        ) : (
          <p className='text-center text-white'>No additional information available.</p>
        )}
      </Modal>
    </div>
  );
};

export default SearchPage;
