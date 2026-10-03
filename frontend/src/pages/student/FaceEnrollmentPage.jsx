import React, { useState, useEffect, useRef } from 'react';
import { studentApi } from '../../api/studentApi.js';
import { ScanFace, Shield, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import * as faceapi from 'face-api.js';

const MODELS_URL = 'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights';

export const FaceEnrollmentPage = () => {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [descriptor, setDescriptor] = useState(null);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        setLoading(true);
        setMessage('Downloading AI models (approx 5MB). Please wait...');
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODELS_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODELS_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODELS_URL)
        ]);
        setModelsLoaded(true);
        setMessage(null);
        startVideo();
      } catch (err) {
        console.error(err);
        setError('Failed to load AI models. Please check your internet connection.');
        setLoading(false);
      }
    };
    loadModels();

    return () => {
      stopVideo();
    };
  }, []);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        streamRef.current = stream;
        let video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          video.play();
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Camera permission denied or camera not found.');
        setLoading(false);
      });
  };

  const stopVideo = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleVideoPlay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(async () => {
      if (videoRef.current && canvasRef.current && modelsLoaded) {
        const detection = await faceapi.detectSingleFace(videoRef.current)
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (detection) {
          setFaceDetected(true);
          setDescriptor(Array.from(detection.descriptor)); // Convert Float32Array to standard array
          
          const dims = faceapi.matchDimensions(canvasRef.current, videoRef.current, true);
          const resizedResult = faceapi.resizeResults(detection, dims);
          const ctx = canvasRef.current.getContext('2d');
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          faceapi.draw.drawDetections(canvasRef.current, resizedResult);
          faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedResult);
        } else {
          setFaceDetected(false);
          const ctx = canvasRef.current.getContext('2d');
          ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      }
    }, 500);
  };

  const handleEnroll = async () => {
    if (!descriptor) return;

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      await studentApi.enrollFace({
        faceDescriptor: descriptor,
        consentGiven: true,
      });
      setMessage('Facial biometric descriptor registered successfully!');
      stopVideo();
    } catch (err) {
      setError(`Failed to enroll: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>
          Facial Biometric <span className="gradient-text">Enrollment</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Secure, irreversible mathematical embedding for proxy-free attendance authentication
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '32px' }}>
        {/* Biometric Privacy Card */}
        <div
          style={{
            padding: '18px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(99, 102, 241, 0.08)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <Shield size={22} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                Privacy First Architecture
              </strong>
              Your raw photographic images are never stored on central servers. We extract a one-way 128-float mathematical descriptor that cannot be reverse-engineered back into a face.
            </div>
          </div>
        </div>

        {message && !error && (
          <div
            style={{
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: 'var(--accent-emerald)',
              fontSize: '0.875rem',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <CheckCircle2 size={18} />
            {message}
          </div>
        )}

        {error && (
          <div
            style={{
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: 'var(--accent-rose)',
              fontSize: '0.875rem',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <AlertTriangle size={18} />
            {error}
          </div>
        )}

        {/* Camera Preview */}
        {!message?.includes('successfully') && (
          <div
            style={{
              height: '340px',
              borderRadius: 'var(--radius-md)',
              background: 'black',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              marginBottom: '24px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {loading && !modelsLoaded ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--accent-cyan)' }}>
                <Loader2 size={40} className="spin" style={{ marginBottom: '16px' }} />
                <span style={{ fontSize: '0.85rem' }}>Loading neural networks...</span>
              </div>
            ) : (
              <>
                <video 
                  ref={videoRef} 
                  autoPlay 
                  muted 
                  onPlay={handleVideoPlay}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <canvas 
                  ref={canvasRef} 
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                />
                {!faceDetected && modelsLoaded && !loading && (
                  <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    background: 'rgba(244, 63, 94, 0.8)',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    color: 'white',
                    fontSize: '0.85rem'
                  }}>
                    No face detected. Please look at the camera.
                  </div>
                )}
                {faceDetected && (
                   <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    background: 'rgba(16, 185, 129, 0.8)',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    color: 'white',
                    fontSize: '0.85rem'
                  }}>
                    Face identified! Ready to enroll.
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {!message?.includes('successfully') && (
          <button
            onClick={handleEnroll}
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={loading || !faceDetected || !descriptor}
          >
            <ScanFace size={18} />
            {loading ? 'Processing...' : 'Capture & Enroll Face'}
          </button>
        )}
      </div>
    </div>
  );
};

export default FaceEnrollmentPage;
