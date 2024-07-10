// src/SeriesSection.js
import { useState } from 'react';
import { Spin, Modal } from 'antd';
import { StarFilled } from '@ant-design/icons';
import axios from 'axios';

const SeriesSection = ({ series, genres }) => {
  const [details, setDetails] = useState({});
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState(null);

  const fetchDetails = async (seriesId) => {
    if (details[seriesId]) return; // Avoid refetching if details are already available

    setLoadingDetails(true);
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/tv/${seriesId}`, {
        params: {
          api_key: '4f0c8e1226cda34b94196a1dfa4f229d', // Replace with your TMDb API key
          append_to_response: 'credits',
        },
      });
      setDetails((prevDetails) => ({
        ...prevDetails,
        [seriesId]: response.data,
      }));
      setLoadingDetails(false);
    } catch (error) {
      console.error('Error fetching series details:', error);
      setLoadingDetails(false);
    }
  };

  const showModal = (series) => {
    setSelectedSeries(series);
    fetchDetails(series.id);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedSeries(null);
  };

  return (
    <ul className='flex flex-wrap gap-2 xs:gap-5 justify-center '>
      {series.map((item) => (
        <li key={item.id} onClick={() => showModal(item)} className="cursor-pointer md:w-[17vw] xs:w-[20vw]   w-[28vw]  text-white   rounded transform transition duration-300 ease-in-out hover:scale-105" >
           <img
            src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
            alt={item.name}
          /> 
        <div className='flex flex-row justify-between text-[9px]  px-2 sm:font-medium sm:text-sm my-1 xs:my-2 '>
          <p>
             <StarFilled style={{ color: 'gold' }} /> {item.vote_average.toFixed(1)}
          </p>
          <p>{new Date(item.first_air_date).getFullYear()}</p>
          <p>{item.original_language}</p>
          </div>
          <h3 className='px-2 text-xs h-15 sm:font-semibold sm:text-base'>{item.name}</h3>
        </li>
      ))}

      <Modal
        title={selectedSeries?.name}
        visible={modalVisible}
        onCancel={closeModal}
        footer={null}
      >
        {loadingDetails && !details[selectedSeries?.id] ? (
          <Spin size="large" className='flex justify-center'/>
        ) : details[selectedSeries?.id] ? (
          <div>
              <div className='relative flex justify-center '>
            <img
            src={`https://image.tmdb.org/t/p/w500${details[selectedSeries.id].backdrop_path}`}
            alt={details[selectedSeries.id].title}
          
          />
          <div className=' absolute w-[20%] -bottom-8 border-[3px] box-border  shadow-2xl rounded-lg transition-all'>
          < img
            src={`https://image.tmdb.org/t/p/w500${details[selectedSeries.id].poster_path}`}
            alt={details[selectedSeries.id].title}
            className='rounded'
          /></div>
          

            </div>
            <p className='mt-10'>{details[selectedSeries.id].overview}</p>
            <p><strong>Genres:</strong> {details[selectedSeries.id].genres.map(genre => genre.name).join(', ') || 'N/A'}</p>

            <p><strong>Director:</strong> {details[selectedSeries.id].credits.crew.find(member => member.job === 'Director')?.name}</p>
            <p><strong>Producers:</strong> {details[selectedSeries.id].credits.crew.filter(member => member.job === 'Producer').map(member => member.name).join(', ')}</p>
            <p><strong>Actors:</strong> {details[selectedSeries.id].credits.cast.slice(0, 5).map(actor => actor.name).join(', ')}</p>
            <p><strong>Production Companies:</strong> {details[selectedSeries.id].production_companies.map(company => company.name).join(', ')}</p>
            <p><strong>Release Platform:</strong> {details[selectedSeries.id].platform || 'N/A'}</p>
          </div>
        ) : (
          <p>No additional information available.</p>
        )}
      </Modal>
    </ul>
  );
};

export default SeriesSection;
