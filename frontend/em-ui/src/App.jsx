import { useEffect, useState } from 'react';

export default function App() {

  const [message, setMessage] = useState("");

  useEffect(() => {
    const response = fetch("http://localhost:3000/api/front")
      .then(res => res.json())
      .then(data => {
        setMessage(data);
      })
      .catch(err => {
        console.error("Error fetching message:", err);
      });
  }, []);

  return (
    <div className="App">
      {message && (
        <div>
          <p>{message.text}</p>
          <p>{message.time}</p>
          <p>{JSON.stringify(message)}</p>
        </div>
      )}
    </div>
  )
}