import React, { useEffect, useState, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../context/socketContext';
import { Box, Typography, IconButton, Grid, Paper, Tooltip, CircularProgress, alpha, useTheme, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import CallEndIcon from '@mui/icons-material/CallEnd';
import { useSelector } from 'react-redux';
import { getCurrentUserFullName } from '../services';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

const VideoCard = ({ stream, isLocal, name, isVideoOn = true }) => {
  const videoRef = useRef();
  const theme = useTheme();

  // Combine track existence and the explicit isVideoOn toggle state
  const hasVideoTrack = stream && stream.getVideoTracks().length > 0;
  const showVideo = isVideoOn && hasVideoTrack;

  useEffect(() => {
    if (videoRef.current && stream && showVideo) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, showVideo]);

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
      sx={{
        width: '100%',
        height: '100%',
        position: 'relative',
        borderRadius: 4,
        overflow: 'hidden',
        bgcolor: alpha(theme.palette.background.paper, 0.4),
        backdropFilter: 'blur(16px)',
        border: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
        boxShadow: `0 8px 32px ${alpha('#000', 0.25)}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '&:hover .overlay-gradient': {
          opacity: 1,
        }
      }}
    >
      {showVideo ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: isLocal ? 'scaleX(-1)' : 'none',
          }}
        />
      ) : (
        <Avatar 
          sx={{ 
            width: 90, 
            height: 90, 
            bgcolor: theme.palette.primary.main, 
            fontSize: '2.5rem',
            boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.4)}`
          }}
        >
          {(name || (isLocal ? "You" : "P")).charAt(0).toUpperCase()}
        </Avatar>
      )}

      {/* Gradient Overlay for legibility */}
      <Box 
        className="overlay-gradient"
        sx={{ 
          position: 'absolute', 
          bottom: 0, left: 0, right: 0, 
          height: '40%', 
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)',
          pointerEvents: 'none',
          transition: 'opacity 0.3s ease',
          opacity: 0.8
        }} 
      />

      {/* Name Badge */}
      <Box 
        sx={{ 
          position: 'absolute', 
          bottom: 16, 
          left: 16, 
          display: 'flex',
          alignItems: 'center',
          gap: 1.2,
          bgcolor: alpha('#000', 0.5), 
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha('#fff', 0.1)}`,
          px: 1.5, 
          py: 0.8, 
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}
      >
        {isLocal && (
          <Box 
            component={motion.div}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            sx={{ 
              width: 10, 
              height: 10, 
              borderRadius: '50%', 
              bgcolor: '#10b981', // Emerald green
              boxShadow: `0 0 10px #10b981` 
            }} 
          />
        )}
        <Typography variant="body2" fontWeight="600" color="white" sx={{ letterSpacing: 0.3 }}>
          {name || (isLocal ? "You" : "Participant")}
        </Typography>
      </Box>
    </Box>
  );
};

const MeetingRoomPage = () => {
  const { meetingId: roomId } = useParams();
  const navigate = useNavigate();
  const socket = useSocket();
  const user = useSelector((state) => state.auth.authData?.user);
  const displayName = getCurrentUserFullName() || user || "Participant";
  const theme = useTheme();

  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({});
  const [remoteMediaStates, setRemoteMediaStates] = useState({}); // Track remote mic/video states
  const [remoteNames, setRemoteNames] = useState({}); // Track remote participant names
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);

  const peerConnections = useRef({}); // Store RTCPeerConnections
  const pendingCandidates = useRef({}); // Store candidates if remote desc not set
  const streamRef = useRef(null);

  // Initialize WebRTC
  useEffect(() => {
    if (!socket || !roomId) return;

    let mounted = true;

    const handleJoin = async ({ userId, socketId }) => {
      if (socketId === socket.id) return;
      console.log("New user joined:", socketId);
      const pc = createPeerConnection(socketId, streamRef.current);
      
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit('client:meeting:signal', {
          targetId: socketId,
          roomId,
          signal: { type: 'offer', offer, name: displayName }
        });
      } catch (err) {
        console.error("Error creating offer:", err);
      }
    };

    const handleSignal = async ({ senderSocketId, signal }) => {
      if (senderSocketId === socket.id) return;
      
      if (signal.name) {
        setRemoteNames(prev => ({ ...prev, [senderSocketId]: signal.name }));
      }
      
      if (signal.type === 'offer') {
        const pc = createPeerConnection(senderSocketId, streamRef.current);
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(signal.offer));
          if (pendingCandidates.current[senderSocketId]) {
            pendingCandidates.current[senderSocketId].forEach(c => pc.addIceCandidate(new RTCIceCandidate(c)));
            pendingCandidates.current[senderSocketId] = [];
          }
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit('client:meeting:signal', {
            targetId: senderSocketId,
            roomId,
            signal: { type: 'answer', answer, name: displayName }
          });
        } catch (err) {
          console.error("Error handling offer:", err);
        }
      } 
      else if (signal.type === 'answer') {
        const pc = peerConnections.current[senderSocketId];
        if (pc) {
          try {
            await pc.setRemoteDescription(new RTCSessionDescription(signal.answer));
            if (pendingCandidates.current[senderSocketId]) {
              pendingCandidates.current[senderSocketId].forEach(c => pc.addIceCandidate(new RTCIceCandidate(c)));
              pendingCandidates.current[senderSocketId] = [];
            }
          } catch (err) {
            console.error("Error handling answer:", err);
          }
        }
      } 
      else if (signal.type === 'candidate') {
        const pc = peerConnections.current[senderSocketId];
        if (pc && pc.remoteDescription && pc.remoteDescription.type) {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
          } catch (err) {
            console.error("Error adding ice candidate:", err);
          }
        } else {
          if (!pendingCandidates.current[senderSocketId]) pendingCandidates.current[senderSocketId] = [];
          pendingCandidates.current[senderSocketId].push(signal.candidate);
        }
      }
      else if (signal.type === 'media-toggle') {
        setRemoteMediaStates(prev => ({
          ...prev,
          [senderSocketId]: {
            ...prev[senderSocketId],
            video: signal.video !== undefined ? signal.video : prev[senderSocketId]?.video,
            audio: signal.audio !== undefined ? signal.audio : prev[senderSocketId]?.audio
          }
        }));
      }
    };

    const handleLeave = ({ socketId }) => {
      if (peerConnections.current[socketId]) {
        peerConnections.current[socketId].close();
        delete peerConnections.current[socketId];
        
        setRemoteStreams(prev => {
          const newStreams = { ...prev };
          delete newStreams[socketId];
          return newStreams;
        });
        
        setRemoteMediaStates(prev => {
          const newStates = { ...prev };
          delete newStates[socketId];
          return newStates;
        });
        
        setRemoteNames(prev => {
          const newNames = { ...prev };
          delete newNames[socketId];
          return newNames;
        });
      }
    };

    const initMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (!mounted) {
           stream.getTracks().forEach(track => track.stop());
           return;
        }
        setLocalStream(stream);
        streamRef.current = stream;

        // Tell server we joined
        socket.emit('client:meeting:join', { roomId });

        socket.on('meeting:join', handleJoin);
        socket.on('meeting:signal', handleSignal);
        socket.on('meeting:leave', handleLeave);
      } catch (err) {
        console.error("Error accessing media devices.", err);
      }
    };

    initMedia();

    return () => {
      mounted = false;
      socket.emit('client:meeting:leave', { roomId });
      socket.off('meeting:join', handleJoin);
      socket.off('meeting:signal', handleSignal);
      socket.off('meeting:leave', handleLeave);
      
      Object.values(peerConnections.current).forEach(pc => pc.close());
      peerConnections.current = {};
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
    // eslint-disable-next-line
  }, [socket, roomId]);

  const createPeerConnection = (targetSocketId, stream) => {
    const pc = new RTCPeerConnection(ICE_SERVERS);
    peerConnections.current[targetSocketId] = pc;

    // Add local tracks
    if (stream) {
      stream.getTracks().forEach(track => pc.addTrack(track, stream));
    }

    // Handle ICE Candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('client:meeting:signal', {
          targetId: targetSocketId,
          roomId,
          signal: { type: 'candidate', candidate: event.candidate }
        });
      }
    };

    // Handle incoming streams
    pc.ontrack = (event) => {
      setRemoteStreams(prev => ({
        ...prev,
        [targetSocketId]: event.streams[0]
      }));
    };

    return pc;
  };

  const toggleMic = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);

        // Notify all peers
        Object.keys(peerConnections.current).forEach(targetSocketId => {
          socket.emit('client:meeting:signal', {
            targetId: targetSocketId,
            roomId,
            signal: { type: 'media-toggle', audio: audioTrack.enabled }
          });
        });
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);

        // Notify all peers
        Object.keys(peerConnections.current).forEach(targetSocketId => {
          socket.emit('client:meeting:signal', {
            targetId: targetSocketId,
            roomId,
            signal: { type: 'media-toggle', video: videoTrack.enabled }
          });
        });
      }
    }
  };

  const handleEndCall = () => {
    navigate('/meetings'); // Redirect back
  };

  const participantCount = 1 + Object.keys(remoteStreams).length;
  
  // Calculate dynamic dimensions for video grid
  const getGridItemProps = () => {
    if (participantCount === 1) return { xs: 12, height: '100%' };
    if (participantCount === 2) return { xs: 12, md: 6, height: { xs: '50%', md: '100%' } };
    if (participantCount <= 4) return { xs: 12, sm: 6, height: '50%' };
    if (participantCount <= 6) return { xs: 12, sm: 4, height: '50%' };
    return { xs: 12, sm: 4, md: 3, height: '33.33%' };
  };

  const itemProps = getGridItemProps();

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      
      {/* Header */}
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="h6" fontWeight="bold">Meeting Room</Typography>
        <Box sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), px: 2, py: 0.5, borderRadius: 2 }}>
          <Typography variant="caption" color="primary.light">ID: {roomId}</Typography>
        </Box>
      </Box>

      {/* Video Grid */}
      <Box sx={{ flex: 1, p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        {!localStream ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={2} sx={{ width: '100%', height: '100%', justifyContent: 'center', alignContent: 'center' }}>
            <Grid item xs={itemProps.xs} sm={itemProps.sm} md={itemProps.md} sx={{ height: itemProps.height, transition: 'all 0.3s ease' }}>
              <VideoCard stream={localStream} isLocal name={displayName} isVideoOn={isVideoOn} />
            </Grid>
            
            {Object.entries(remoteStreams).map(([id, stream]) => (
              <Grid item xs={itemProps.xs} sm={itemProps.sm} md={itemProps.md} key={id} sx={{ height: itemProps.height, transition: 'all 0.3s ease' }}>
                <VideoCard stream={stream} isLocal={false} name={remoteNames[id]} isVideoOn={remoteMediaStates[id]?.video !== false} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Controls */}
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', gap: 3, borderTop: `1px solid ${theme.palette.divider}`, bgcolor: alpha(theme.palette.background.paper, 0.8), backdropFilter: 'blur(10px)' }}>
        <Tooltip title={isMicOn ? "Turn off mic" : "Turn on mic"}>
          <IconButton 
            onClick={toggleMic}
            sx={{ 
              bgcolor: isMicOn ? alpha(theme.palette.primary.main, 0.2) : alpha(theme.palette.error.main, 0.2), 
              color: isMicOn ? 'primary.main' : 'error.main',
              '&:hover': { bgcolor: isMicOn ? alpha(theme.palette.primary.main, 0.3) : alpha(theme.palette.error.main, 0.3) }
            }}
          >
            {isMicOn ? <MicIcon fontSize="large" /> : <MicOffIcon fontSize="large" />}
          </IconButton>
        </Tooltip>

        <Tooltip title={isVideoOn ? "Turn off video" : "Turn on video"}>
          <IconButton 
            onClick={toggleVideo}
            sx={{ 
              bgcolor: isVideoOn ? alpha(theme.palette.primary.main, 0.2) : alpha(theme.palette.error.main, 0.2), 
              color: isVideoOn ? 'primary.main' : 'error.main',
              '&:hover': { bgcolor: isVideoOn ? alpha(theme.palette.primary.main, 0.3) : alpha(theme.palette.error.main, 0.3) }
            }}
          >
            {isVideoOn ? <VideocamIcon fontSize="large" /> : <VideocamOffIcon fontSize="large" />}
          </IconButton>
        </Tooltip>

        <Tooltip title="End Call">
          <IconButton 
            onClick={handleEndCall}
            sx={{ 
              bgcolor: theme.palette.error.main, 
              color: '#fff',
              '&:hover': { bgcolor: theme.palette.error.dark }
            }}
          >
            <CallEndIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default MeetingRoomPage;
