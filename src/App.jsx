import Navbar from "./Navbar"
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Searchs from "./Search";
import Trending from "./Trending";
import TopRated from "./TopRated";
import MainPage from "./MainPage";
import './App.css'
import UpcomingMovies from "./UpcomingMovies";




function App() {

  return ( 


  
  <BrowserRouter >
 
   <Navbar />
   <Routes>
   <Route path="/" element={<MainPage/>} />
   <Route path="/search" element={<Searchs />} />
   <Route path="/trending" element={<Trending/>}/>
   <Route path="/upcomingmovies" element={<UpcomingMovies/>} />
   <Route path="/top-rated" element={<TopRated />}/>


   </Routes>
 </BrowserRouter> 
  )
}

export default App
