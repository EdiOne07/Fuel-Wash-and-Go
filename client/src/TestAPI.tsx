import React, { useEffect, useState } from 'react';

const TestAPI: React.FC = () => {
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    // Fetch data from the backend API
    fetch('http://localhost:3000/test-auth')
      .then((response) => response.text())
      .then((data) => {
        setMessage(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setMessage('Failed to fetch data');
      });
  }, []);

  return (
    <div>
      <h1>API Response</h1>
      <p>{message}</p>
    </div>
  );
};

export default TestAPI;
