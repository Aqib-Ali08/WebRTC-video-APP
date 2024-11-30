import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';  // Import Socket.IO client
import '../assets/videoCall.css';
import { useNavigate, useParams } from 'react-router-dom';

const socket = io('https://webrtc-backend-vtyh.onrender.com'); // Adjust for your server

const CallInterface = () => {
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isCallEnded, setIsCallEnded] = useState(false);
  const [remoteStreams, setRemoteStreams] = useState([]);
  const localVideoRef = useRef(null);
  const remoteVideoRefs = useRef({});
  const peerConnections = useRef({});
  const navigate = useNavigate();
  const { roomId } = useParams();

  useEffect(() => {
    // Join the room when the component mounts
    socket.emit('join-room', roomId);
console.log("Joined Room ID:",roomId);
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        localVideoRef.current.srcObject = stream;
console.log(stream);
        socket.on('user-connected', userId => {
          const peerConnection = createPeerConnection(userId, stream);
          peerConnections.current[userId] = peerConnection;
        });

        socket.on('offer', async ({ userId, offer }) => {
          const peerConnection = createPeerConnection(userId, stream);
          await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          socket.emit('answer', { roomId, answer, to: userId });
        });

        socket.on('answer', ({ userId, answer }) => {
          const peerConnection = peerConnections.current[userId];
          if (peerConnection) {
            peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
          }
        });

        socket.on('ice-candidate', ({ userId, candidate }) => {
          const peerConnection = peerConnections.current[userId];
          if (candidate && peerConnection) {
            peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
          }
        });
      });

    // Cleanup on component unmount
    return () => {
      socket.emit('leave-room', roomId);
      Object.values(peerConnections.current).forEach(pc => pc.close());
      peerConnections.current = {};
    };
  }, [roomId]);

  const createPeerConnection = (userId, stream) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    stream.getTracks().forEach(track => pc.addTrack(track, stream));

    pc.onicecandidate = event => {
      if (event.candidate) {
        socket.emit('ice-candidate', {
          roomId,
          candidate: event.candidate,
          to: userId
        });
      }
    };

    pc.ontrack = event => {
      const [remoteStream] = event.streams;

      if (!remoteVideoRefs.current[userId]) {
        setRemoteStreams(prevStreams => [...prevStreams, { userId, stream: remoteStream }]);
        remoteVideoRefs.current[userId] = remoteStream;
      }
    };

    return pc;
  };

  const toggleMic = () => {
    setIsMicMuted(!isMicMuted);
    localVideoRef.current.srcObject.getAudioTracks()[0].enabled = isMicMuted;
  };

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    localVideoRef.current.srcObject.getVideoTracks()[0].enabled = !isVideoOff;
  };

  const endCall = () => {
    setIsCallEnded(true);
    setTimeout(() => {
      setIsCallEnded(false);
      socket.emit('leave-room', roomId);
      navigate("/meeting");
      window.location.reload();
    }, 4000);
  };

  if (isCallEnded) {
    return (
      <div className="endMessage">
        Call has ended. Redirecting you to the Meeting page.<br />
        Thank you for using the service!
      </div>
    );
  }

  return (
    <div className='maincontainer3'>
      <div id="callInterface">
        <div className="Vidheader">
          <span className="status-icon">{isMicMuted ? '🔇' : '🎤'}</span>
        </div>
        <div className="vid-main-content">
          <video ref={localVideoRef} autoPlay playsInline muted />
          <div className="remote-videos">
            {remoteStreams.map(({ userId, stream }) => (
              <video
                key={userId}
                ref={ref => {
                  if (ref) {
                    ref.srcObject = stream;
                  }
                }}
                autoPlay
                playsInline
              />
            ))}
          </div>
        </div>
        <div className="footer">
          <div className="footer-icons">
            <div
              id="micButton"
              className={`footer-icon ${isMicMuted ? 'muted' : ''}`}
              onClick={toggleMic}
            >
              {isMicMuted ? '🔇' : '🎤'}
            </div>
            <div
              id="videoButton"
              className={`footer-icon ${isVideoOff ? 'video-off' : ''}`}
              onClick={toggleVideo}
            >
              {isVideoOff ? '📷' : '🎥'}
            </div>
            <div id="endCallButton" className="footer-icon red" onClick={endCall}>
              📞
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallInterface;
