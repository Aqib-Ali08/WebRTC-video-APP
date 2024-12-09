import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useNavigate, useParams } from 'react-router-dom';
import "../assets/videoCall.css"
import { Box, Grid } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import CallEndIcon from '@mui/icons-material/CallEnd';
import { useLogin } from "../context/loginContext.jsx";
const socket = io('https://webrtc-backend-vtyh.onrender.com');
// const socket = io('http://localhost:5000'); // Replace with your backend URL
const VideoCall = () => {
  const [remoteStreams, setRemoteStreams] = useState([]);
  const [ismicOff, setIsmicOff] = useState(true);
  const [isVideoOff, setIsVideoOff] = useState(true);
  const [userDetails, setUserDetails] = useState([]);
  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerConnections = useRef({});
  const navigate = useNavigate();
  const { roomId } = useParams();
  const { user } = useLogin()
  let email = useRef(null);
  useEffect(() => {
    email.current = user.user.email
    fetchUserDetails()
    // Get local media stream
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        console.log("stream:", stream);

        localStreamRef.current = stream; // Store the stream
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream; // Attach stream to video element
        }
        // localVideoRef.current.srcObject = stream;

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
  const handleMic = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0]
      audioTrack.enabled = !audioTrack.enabled; // Toggle audio track
      setIsmicOff(!ismicOff);
    };

  }
  const handleVideo = async () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled; // Toggle video track
        setIsVideoOff(!isVideoOff);

        // If turning the video back on, ensure the stream is re-initialized
        if (!isVideoOff) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            const newVideoTrack = stream.getVideoTracks()[0];
            if (newVideoTrack) {
              localStreamRef.current.removeTrack(videoTrack); // Remove the old track
              localStreamRef.current.addTrack(newVideoTrack); // Add the new track
              if (localVideoRef.current) {
                localVideoRef.current.srcObject = localStreamRef.current; // Update the video element
              }
            }
          } catch (err) {
            console.error("Error re-enabling video:", err);
          }
        }
      }
    }
  };

  const handleEndCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    socket.emit('leave-room', roomId);
    navigate('/meeting');
  };
  const fetchUserDetails = async () => {
    try {
      const response = await fetch("https://webrtc-backend-vtyh.onrender.com/api/auth/users", {
        // const response = await fetch("http://localhost:5000/api/auth/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.current }),
      });

      if (!response.ok) {
        throw new Error("Login failed. Please check your credentials.");
      }

      const data = await response.json();
      // alert("Login successful! Redirecting...");
      // console.log("Login response:", data);
      // navigate('/meeting')
      // login(data)
      console.log(data)
      setUserDetails(data)
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
    }
  }

  return (
    <div className="maincontainer3">
      <div className='callInterface'>
        <div className="vid-main-content">
          <div className="app-main">
            <div className="video-call-wrapper" style={remoteStreams.length === 0 ? { justifyContent: "center" } : {}} >
              <div className="video-participant" >
                <video ref={localVideoRef} autoPlay playsInline muted className={remoteStreams.length === 0 ? "local-video" : "remote-video"} />
              </div>
              {remoteStreams.map(({ userId, stream }) => (
                <div className="video-participant">
                  <video
                    key={userId}
                    ref={ref => {
                      if (ref) ref.srcObject = stream;
                    }}
                    autoPlay
                    playsInline
                    className="remote-video"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="footer">
          <div className="footer-icons">
            <div id="micButton" className="footer-icon" onClick={handleMic}>{ismicOff ? <MicIcon /> : <MicOffIcon />}</div>
            <div id="videoButton" className="footer-icon" onClick={handleVideo}>{isVideoOff ? <VideocamIcon /> : <VideocamOffIcon />}</div>
            <div id="endCallButton" className="footer-icon red" onClick={handleEndCall}><CallEndIcon /></div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default VideoCall;
