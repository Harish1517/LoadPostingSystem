import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Connect to Backend Socket

const LoadTracking = () => {
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });

  useEffect(() => {
    // Listen for Load Location from Backend
    socket.on('loadLocation', (newLocation) => {
      setLocation(newLocation);
    });

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="tracking-container">
      <h1>Real-Time Load Tracking 📍</h1>
      <p>Current Location:</p>
      <h2>Latitude: {location.latitude}</h2>
      <h2>Longitude: {location.longitude}</h2>

      <style jsx>{`
        .tracking-container {
          text-align: center;
          margin-top: 50px;
        }
      `}</style>
    </div>
  );
};

export default LoadTracking;
