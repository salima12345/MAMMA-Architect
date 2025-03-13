import React from 'react';
import { X } from 'lucide-react';

interface PopupContainerProps {
  children: React.ReactNode;
  onClose: () => void;
  title?: React.ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
}

const PopupContainer: React.FC<PopupContainerProps> = ({
  children,
  onClose,
  title,
  showBackButton = false,
  onBack,
}) => {
  return (
    <div className="fixed bottom-4 right-4 flex items-end justify-end">
      <div className="rounded-[20px] bg-[#FAFAFA] border-2 border-[#C42644] w-[366px] max-h-[600px] flex flex-col px-2 overflow-hidden">
        <div className="flex justify-between items-center py-3">
          <div className="text-[#C42644]">
            {showBackButton ? (
              <button onClick={onBack} className="font-medium">
                Retour
              </button>
            ) : (
              <span className="text-[14px] font-medium">{title}</span>
            )}
          </div>
          <div className='flex items-center gap-3'>
            <span className='font-medium text-[12px] leading-[13.19px] tracking-[0.1em] text-[#C42644] hover:text-[#9B1E35] cursor-pointer' onClick={onClose}>
              FERMER
            </span>
            <button onClick={onClose} className="text-[#C42644] hover:text-[#9B1E35]">
              <X size={24} />
            </button>
          </div>
        </div>
        <div className="overflow-y-auto flex flex-col gap-2 custom-scrollbar pb-3">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PopupContainer;