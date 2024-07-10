// src/HomePage.js
import React from 'react';
import TrendingMovies from './Carousel/TrendingMovies';
import TrendingSeries from './Carousel/TrendingSeries';
import TopRatedMovies from './Carousel/TopRatedMovies';
import TopRatedSeries from './Carousel/TopRatedSeries';
import PopularNow from './Carousel/TrendingNow';
import { BsCollectionPlayFill } from "react-icons/bs";
import { Tabs,  } from 'antd';
import AmazonPrimeTrending from './Carousel/Recommended';
import RecommendedMovies from './Carousel/RecommendedMovies';
import NetflixTrending from './Carousel/RecommendedMovies';
import AppleTVPlusTrending from './Carousel/AppleMovies';
import DisneyPlusTrending from './Carousel/Disney';


const { TabPane } = Tabs;

const HomePage = () => {
  const [activeTab, setActiveTab] = React.useState("1");
  const [secondActiveTab, setSecondActiveTab] = React.useState("3");

  const handleTabChange = (key) => {
    setActiveTab(key);
  
  };
  const handleSecondTabChange = (key) => {
    setSecondActiveTab(key);
  
  };

  return (
   
     
      <div className='bg-gray-900 bg-no-repeat bg-fixed  bg-center'>
        <PopularNow/>
       
      <div className='absolute w-screen top-[90vh] pt-0 xs:top-[100vh] bg-gray-900 lg:pt-20 lg:top[100vh] md:pb-10 pb-5  md:top-[100vh] xl:pt-10 xl:top-[110vh] '>
        <div className='border mx-10 my-10'></div> 
        <div className= 'w-full'>
        <h1 className='mb-5 lg:text-3xl text-xl xs:text-2xl font-bold ml-10 text-white flex items-center'> <BsCollectionPlayFill  className='mr-3'/>Trending Movies</h1>
        <div className='flex flex-col md:flex-row justify-center w-full '>
        <Tabs activeKey={activeTab} type='line' onChange={handleTabChange} centered className='xl:w-8/12 flex  w-full  relative' tabBarStyle={{ margin: '2% 4%' , color:'white'   }}>
        <TabPane tab="Movies" key="1" className='md:w-full w-screen xs:px-5'>
          <div className=''>
          <TrendingMovies  /></div>
        </TabPane>
        <TabPane tab="TV Series" key="2" className='md:w-full w-screen xs:px-5'>
          <div className=''>
         <TrendingSeries /></div>
        </TabPane>
      </Tabs> <div className='xl:w-[full] hidden md:w-2/6 xl:flex md:-mt-2 flex-col gap-24'>
      <NetflixTrending />
       <AmazonPrimeTrending />
      </div>
     </div>
      </div>   
      <div className= 'w-full mt-14'>
        <h1 className='mb-5 lg:text-3xl text-xl xs:text-2xl font-bold ml-10 text-white flex items-center'> <BsCollectionPlayFill  className='mr-3 '/>Top Rated</h1>
        <div className='flex flex-col md:flex-row justify-center w-full '>
        <Tabs activeKey={secondActiveTab} onChange={handleSecondTabChange}  centered className='xl:w-8/12 flex  w-full  relative' tabBarStyle={{ margin: '2% 4%' , color:'white'   }} >
        <TabPane tab="Movies" key="3" className='md:w-full w-screen md:px-5'>
          <div className=''>
          <TopRatedMovies /></div>
        </TabPane>
        <TabPane tab="TV Series" key="4" className='md:w-full w-screen md:px-5'>
          <div className=''>
          <TopRatedSeries /></div>
        </TabPane>
      </Tabs>
      <div className='xl:w-[full] md:w-2/6 hidden xl:flex md:-mt-2 flex-col gap-24'>
      
      <AppleTVPlusTrending/> 
       <DisneyPlusTrending/>
       </div>
       </div>
      </div>

    
     
     

      </div>
     
     
    
    
     </div>
  );
};

export default HomePage;
