"use client"
import React, { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [terminalUrl, setTerminalUrl] = useState(null);
  const handleIconClick = async (dbType) => {
    console.log("dbType", dbType);
    const response = await axios.post('http://localhost:3001/api/spawn-terminal', {
      dbType
    });

    const data = response.data;
    if (data.terminalUrl) {
      setTerminalUrl(data.terminalUrl);
    } else {
      alert(data.error || 'Failed to spawn terminal');
    }
  };
  return (
    <>
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>Database Terminal</h1>
        <div>
          <button onClick={() => handleIconClick('mysql')}>Connect to MySQL</button>
          <button onClick={() => handleIconClick('postgresql')}>Connect to PostgreSQL</button>
        </div>
        {terminalUrl && (
          <iframe
            src={terminalUrl}
            width="100%"
            height="600px"
            style={{ border: '1px solid #ccc', marginTop: '20px' }}
          />
        )}
      </div>
    </>
  );
}
