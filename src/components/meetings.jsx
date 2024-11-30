import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import '../assets/meeting.css';
import meetingBGImg from '../assets/metting1.png';

const socket = io('http://localhost:5000'); // Adjust for your server

const MeetingPage = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
   
    updateTime();
    const intervalId = setInterval(updateTime, 1000);
    return () => clearInterval(intervalId);
    
  }, []);

  const updateTime = () => {
    const now = new Date();
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    const formattedTime = now.toLocaleString('en-US', options);
    setCurrentTime(formattedTime);
  };

  const generateRoomId = () => {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
  };

  const handleCreateMeeting = () => {
    const roomId = generateRoomId();
    console.log("Created Room ID:",roomId);
    socket.emit('create-room', roomId);
    socket.on('room-created', ({ roomId }) => {
      navigate(`/videocall/${roomId}`);
    });
  };

  const handleJoinMeeting = () => {
    socket.emit('join-room', roomCode);
    socket.on('room-joined', ({ roomId }) => {
      navigate(`/videocall/${roomId}`);
    });
    socket.on('error', (data) => {
      setError(data.message);
    });
  };

  return (
    <div className='maincontainer2'>
      <div className="Meetingcontainer">
        <aside className="sidebar">
          <div className="logo">SYNC SPACE</div>
          <ul className="menu">
            <li><span className="icon">📅</span> Meetings</li>
            <li><span className="icon">📞</span> Calls</li>
            <li><span className="icon">💬</span> Messages</li>
          </ul>
        </aside>
        <main className="main-content">
          <div className="header">
            <div className="time">{currentTime} | Sat, OCT 26, 2024</div>
            <div className="icons">
              <span>🔍</span>
              <span>⚙️</span>
              <span className="user-icon">B</span>
            </div>
          </div>
          <div className="content">
            <h1>SYNC AND WORK TOGETHER FOR WORK AND CASUAL MEETINGS</h1>
            <div className="actions">
              <div className="action">
                <input
                  type="text"
                  placeholder="Enter a code or nickname"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                />
                <button onClick={handleJoinMeeting}>JOIN</button>
              </div>
              {error && <p className="error">{error}</p>}
              <div className="action">
                <button onClick={handleCreateMeeting}>Create a meeting</button>
              </div>
            </div>
            <div className="illustration">
              <img src={meetingBGImg} alt="Video Call" />
              <p>A playful twist for memorable and simple meetings</p>
            </div>
          </div>
          <footer>
            <a href="#">Learn more about SYNC SPACE</a>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default MeetingPage;
