import React from 'react'
import heroimg from '../assets/blog2.png'
const Herosection = () => {
  return (
    <div className="w-full flex flex-col lg:flex-row mt-8 min-h-[480px] lg:h-120">
  {/* Content Section */}
  <div className="w-full lg:w-[60%] flex items-center justify-center flex-col gap-5 px-5 md:px-10 lg:px-0">
    <h1 className="w-full max-w-165 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center lg:text-left">
      Explore the Latest Tech & Web Trends
    </h1>
    <p className="w-full max-w-150 text-base md:text-lg text-center lg:text-left lg:mr-13">
      Stay ahead with in-depth articles, tutorials, and insights on web development, digital marketing, and tech innovations
    </p>
    <div className="flex items-center justify-center gap-4 md:gap-8">
      <button className="bg-black text-white h-12 w-32 md:h-13 md:w-35 cursor-pointer font-bold rounded-2xl">
        Get Started
      </button>
      <button className="text-black h-12 w-32 md:h-13 md:w-35 font-bold hover:bg-gray-400 cursor-pointer rounded-2xl">
        Learn More
      </button>
    </div>
  </div>
  {/* Image Section */}
  <div className="w-full lg:w-[40%] flex items-center justify-center mt-8 lg:mt-0 px-5">
    <img
      className="w-full max-w-[400px] h-auto lg:h-[85%] lg:w-auto object-contain"
      src={heroimg}
      alt="Hero"
    />
  </div>
</div>
  )
}
export default Herosection