import React, { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface ImageModalProps {
  images: string[];
  isOpen: boolean;
  onClose: () => void;
  currentIndex: number;
  onNext: () => void;
  onPrevious: () => void;
}

export default function ImageModal({
  images,
  isOpen,
  onClose,
  currentIndex,
  onNext,
  onPrevious,
}: ImageModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    }
  }, [scrollPosition]);

  if (!mounted || !isOpen) return null;

  const visibleImages = getVisibleImages(images, currentIndex);

  const handleScroll = (direction: 'left' | 'right') => {
    const scrollAmount = 300; // Adjust this value based on your image width
    if (direction === 'left') {
      setScrollPosition((prev) => Math.max(0, prev - scrollAmount));
    } else {
      setScrollPosition((prev) => prev + scrollAmount);
    }
  };

  const modalContent = (
    <div className="relative isolate" style={{ zIndex: 99999 }}>
      <div className="fixed inset-0 bg-black/90" aria-hidden="true" />
      <div 
        ref={modalRef}
        className="fixed inset-0 flex flex-col isolate"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex justify-end p-4">
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="flex-1 overflow-x-auto pl-4 py-2 scrollbar-hide">
          <div className="h-[calc(100vh-140px)] flex items-center">
            <div className="flex gap-4 h-full">
              {visibleImages.map((img, idx) => (
                <div 
                  key={idx} 
                  className="h-full w-[calc(33vw-20px)] flex-shrink-0 last:mr-0 relative"
                  style={{ marginRight: idx === visibleImages.length - 1 ? '33%' : '0' }}
                >
                  <Image
                    src={img}
                    alt={`Image ${idx + 1}`}
                    fill
                    className="object-cover rounded-lg"
                    quality={100}
                    loading="eager"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 w-full flex justify-between px-8 py-4">
          <button
            onClick={() => {
              onPrevious();
              handleScroll('left');
            }}
            className="text-white hover:text-gray-300 disabled:opacity-50"
            disabled={currentIndex === 0}
            aria-label="Previous image"
          >
            <ArrowLeft size={24} />
          </button>
          <button
            onClick={() => {
              onNext();
              handleScroll('right');
            }}
            className="text-white hover:text-gray-300 disabled:opacity-50"
            disabled={currentIndex === images.length - 1}
            aria-label="Next image"
          >
            <ArrowRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );

  const portalRoot = document.querySelector('body > div[data-overlay-container]') || document.body;
  return createPortal(modalContent, portalRoot);
}

function getVisibleImages(images: string[], currentIndex: number): string[] {
  const totalImagesToShow = 3;
  const startIdx = Math.max(0, currentIndex - 1);
  return images.slice(startIdx, startIdx + totalImagesToShow);
}