import React from 'react';
import { Plus, Minus } from 'lucide-react';

interface AccordionButtonProps {
  isExpanded?: boolean;
}

const AccordionButton = ({ isExpanded = false }: AccordionButtonProps) => {
  return (
    <button className="flex items-center justify-center rounded-full bg-black text-white w-6 h-6 transition-all duration-300 ease-in-out hover:bg-[#C42644]">
      {isExpanded ? (
        <Minus
          size={14}
          className="text-white transition-transform duration-300"
        />
      ) : (
        <Plus
          size={14}
          className="text-white transition-transform duration-300"
        />
      )}
    </button>
  );
};

export default AccordionButton;