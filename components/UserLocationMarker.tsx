import React from 'react';

interface UserLocationMarkerProps {
  position: google.maps.LatLngLiteral;
}

const UserLocationMarker: React.FC<UserLocationMarkerProps> = ({ position }) => {
  return (
    <div style={{
      position: 'absolute',
      transform: 'translate(-50%, -100%)',
      left: '0px',
      top: '0px'
    }}>
      <div style={{
        width: '30px',
        height: '30px',
        animation: 'pulse 2s infinite'
      }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="#C42644"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      </div>
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            filter: drop-shadow(0 0 0 rgba(196, 38, 68, 0.4));
          }
          70% {
            transform: scale(1.1);
            filter: drop-shadow(0 0 5px rgba(196, 38, 68, 0.7));
          }
          100% {
            transform: scale(1);
            filter: drop-shadow(0 0 0 rgba(196, 38, 68, 0.4));
          }
        }
      `}</style>
    </div>
  );
};

export default UserLocationMarker;

