import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useNavigate, useParams } from 'react-router-dom';
import "../assets/meeting.css"
const socket = io('https://webrtc-backend-vtyh.onrender.com');
// const socket = io('http://localhost:5000'); // Replace with your backend URL
const VideoCall = () => {
  const [remoteStreams, setRemoteStreams] = useState([]);
  const localVideoRef = useRef(null);
  const peerConnections = useRef({});
  const navigate = useNavigate();
  const { roomId } = useParams();

  useEffect(() => {
    
    // Get local media stream
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        localVideoRef.current.srcObject = stream;

        // Join the room
        socket.emit('join-room', roomId);

        // Listen for new users joining
        socket.on('user-connected', userId => {
          const peerConnection = createPeerConnection(userId, stream);
          peerConnections.current[userId] = peerConnection;

          // Create an offer
          peerConnection.createOffer().then(offer => {
            peerConnection.setLocalDescription(offer);
            socket.emit('offer', { to: userId, offer });
          });
        });

        // Handle receiving an offer
        socket.on('offer', async ({ from, offer }) => {
          const peerConnection = createPeerConnection(from, stream);
          peerConnections.current[from] = peerConnection;
          await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          socket.emit('answer', { to: from, answer });
        });

        // Handle receiving an answer
        socket.on('answer', ({ from, answer }) => {
          const peerConnection = peerConnections.current[from];
          if (peerConnection) {
            peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
          }
        });

        // Handle receiving ICE candidates
        socket.on('ice-candidate', ({ from, candidate }) => {
          const peerConnection = peerConnections.current[from];
          if (peerConnection && candidate) {
            peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
          }
        });

        // Handle users leaving
        socket.on('user-disconnected', userId => {
          if (peerConnections.current[userId]) {
            peerConnections.current[userId].close();
            delete peerConnections.current[userId];
            setRemoteStreams(prevStreams => prevStreams.filter(stream => stream.userId !== userId));
          }
        });
      });

    // Cleanup on unmount
    return () => {
      socket.emit('leave-room', roomId);
      Object.values(peerConnections.current).forEach(pc => pc.close());
      peerConnections.current = {};
    };
  }, [roomId]);

  // Create a new peer connection
  const createPeerConnection = (userId, stream) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    // Add local tracks to the connection
    stream.getTracks().forEach(track => pc.addTrack(track, stream));

    // Handle ICE candidates
    pc.onicecandidate = event => {
      if (event.candidate) {
        socket.emit('ice-candidate', { to: userId, candidate: event.candidate });
      }
    };

    // Handle remote tracks
    pc.ontrack = event => {
      console.log(event.streams);
      const [remoteStream] = event.streams;
      setRemoteStreams(prevStreams => {
        const existingStream = prevStreams.find(stream => stream.userId === userId);
        if (!existingStream) {
          return [...prevStreams, { userId, stream: remoteStream }];
        }
        return prevStreams;
      });
    };

    return pc;
  };

  return (
    <div className="video-call-container">
      <video ref={localVideoRef} autoPlay playsInline muted className="local-video" />
      <div className="remote-videos">
        {remoteStreams.map(({ userId, stream }) => (
          <video
            key={userId}
            ref={ref => {
              if (ref) ref.srcObject = stream;
            }}
            autoPlay
            playsInline
            className="remote-video"
          />
        ))}
      </div>
    </div>
  );
};

export default VideoCall;
