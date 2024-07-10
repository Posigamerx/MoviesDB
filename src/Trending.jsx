// src/Trending.js
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Tabs, Pagination, Spin } from 'antd';
import MoviesSection from './MovieSection';
import SeriesSection from './SeriesSection';

const { TabPane } = Tabs;

const Trending = () => {
  const [movies, setMovies] = useState([]);
  const [tvSeries, setTvSeries] = useState([]);
  const [genres, setGenres] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("1");
  const totalPages = 50;

  useEffect(() => {
    const fetchTrending = async (page, type) => {
      setLoading(true);
      try {
        const movieEndpoint = type === "1" ? 'movie' : 'tv';
        const trendingResponse = await axios.get(
          `https://api.themoviedb.org/3/trending/${movieEndpoint}/week`,
          {
            params: {
              api_key: '4f0c8e1226cda34b94196a1dfa4f229d',
              page: page,
            },
          }
        );

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

        if (type === "1") {
          setMovies(trendingResponse.data.results);
        } else {
          setTvSeries(trendingResponse.data.results);
        }

        setGenres(genresData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTrending(page, activeTab);
  }, [page, activeTab]);

  const handlePageChange = (page) => {
    setPage(page);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    setPage(1);
  };

  if (loading) return <div className='h-screen flex justify-center items-center'><Spin size="large" /></div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className=' bg-gray-900 0 bg-no-repeat bg-fixed bg-center'>
      <h1 className='pt-20 mb-2 ml-5 text-2xl sm:pt-28 sm:mb-5 sm:ml-10 sm:text-4xl  font-bold text-white'>Trending</h1>
      <Tabs activeKey={activeTab} centered onChange={handleTabChange  } tabBarStyle={{ margin: '2% 4%' , color:'white'   }}>
        <TabPane tab="Movies" key="1">
          <MoviesSection movies={movies} genres={genres} />
        </TabPane>
        <TabPane tab="TV Series" key="2">
          <SeriesSection series={tvSeries} genres={genres} />
        </TabPane>
      </Tabs>
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
        <Pagination
          current={page}
          total={totalPages * 10}
          onChange={handlePageChange}
          pageSize={10}
          showSizeChanger={false}
          className='my-5'
        />
      </div>
    </div>
  );
};

export default Trending;
