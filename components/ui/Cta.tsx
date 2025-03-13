import React from 'react';
import { ArrowUpRight, ArrowRight } from 'lucide-react';


const Cta = () => {
    return (
        <button className=" flex items-center justify-center rounded-full bg-[#C4264480] p-4 transition-all duration-300 ease-in-out group-hover:bg-[#C42644] w-[24px] h-[24px]">
          <ArrowUpRight 
            className="text-white absolute transform transition-all duration-500 ease-in-out group-hover:rotate-90 group-hover:opacity-0"
            size={14}
          />
          <ArrowRight 
            className="text-white absolute transform transition-all duration-500 ease-in-out -rotate-90 opacity-0 group-hover:rotate-0 group-hover:opacity-100"
            size={14}
          />
        </button>
      );
    };


export default Cta;