import {  NavLink } from 'react-router-dom';
import './Navbar.css'
import Logo from "./assets/Un.png"
import { SiThemoviedatabase } from "react-icons/si";
import { IoMenu , IoCloseSharp} from "react-icons/io5";

import { useState } from 'react';



const Navbar = () => {

  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className=" font-['Montserrat'] flex justify-center z-50 relative">
      <div className={`fixed shadow-md text-white	z-50 flex sm:flex-row justify-between  rounded-full top-2 w-[90vw] transition-all duration-300 ease-in-out lg:h-[4rem] px-4 lg:px-8 flex-row ${!isOpen ? ('h-[20rem]'): ('h-[3rem]')} `} id='nav'>
        <div className='flex mt-1 lg:mt-0 lg:relative '> <NavLink activeClassName='notactive' to={'/'}> 

            <h1 className='font-bold text-4xl lg:text-6xl text-blue-800   ' onClick={() => {!isOpen ? (setIsOpen(!isOpen)): (null)} }><SiThemoviedatabase/></h1></NavLink>
        </div>  
         
          <ul className='flex flex-row'>
         
        <div className=" flex-row items-center gap-8 font-['Montserrat'] text-lg font-medium hidden lg:flex">

        <h3 className="hover:font-semibold cursor-pointer hover:transition delay-150 duration-300 ease-in-out">
        <NavLink   activeClassname='active' to='/top-rated'>Top Rated</NavLink> 
        </h3>
        <h3  className="hover:font-semibold cursor-pointer hover:transition delay-150 duration-300 ease-in-out">
        <NavLink activeClassname='active'  to='/trending'>Trending</NavLink>  
        </h3>
        <h3  className="hover:font-semibold cursor-pointer hover:transition delay-150 duration-300 ease-in-out">
        <NavLink activeClassname='active'  to='/upcomingMovies'>Upcoming</NavLink>  
        </h3>
        <h3 className="hover:font-semibold cursor-pointer hover:transition delay-150 duration-300 ease-in-out">
        <NavLink activeClassname='active' to='/search'> Search</NavLink> 
        </h3>
       
        </div> 
         </ul>

         <div className=' lg:hidden flex mt-1 text-4xl text-white cursor-pointer transition-all duration-1000 ease-in'>
              
              {
                 !isOpen ?  ( <IoCloseSharp onClick={() => setIsOpen(!isOpen)}/> )  :(<IoMenu onClick={() => setIsOpen(!isOpen)} />)

                 

              }
              {
                isOpen ?( 
                  <div></div>
                ):(
                  <div className=' absolute left-1 w-full mt-10 gap-16 flex flex-row transition-all duration-2000 ease-in ' >
         
                  <div className=" flex-col ml-10 mt-10 flex gap-4 font-['Montserrat'] text-base font-medium ">
          
                  <h3 className="hover:font-semibold hover:text-blue-800 cursor-pointer hover:transition delay-150 duration-300 ease-in-out" onClick={() => setIsOpen(!isOpen)}>
                  <NavLink    to='/top-rated'>Top Rated</NavLink> 
                  </h3>
                  <h3  className="hover:font-semibold hover:text-blue-800 cursor-pointer hover:transition delay-150 duration-300 ease-in-out" onClick={() => setIsOpen(!isOpen)}>
                  <NavLink   to='/trending'>Trending</NavLink>  
                  </h3>
                  <h3  className="hover:font-semibold hover:text-blue-800 cursor-pointer hover:transition delay-150 duration-300 ease-in-out" onClick={() => setIsOpen(!isOpen)}>
                  <NavLink   to='/upcomingMovies'>Upcoming</NavLink>  
                  </h3>
                  <h3 className="hover:font-semibold hover:text-blue-800 cursor-pointer hover:transition delay-150 duration-300 ease-in-out" onClick={() => setIsOpen(!isOpen)}>
                  <NavLink  to='/search'> Search</NavLink> 
                  </h3>
                 
                  </div> 
                   </div>
                )
              }
            </div>
      </div>
    </div>
  )
}

export default Navbar
