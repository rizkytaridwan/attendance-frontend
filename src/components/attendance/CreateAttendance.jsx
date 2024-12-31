import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AttendancePage = () => {
  const navigate = useNavigate();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const [location, setLocation] = useState(null);
  const [userIP, setUserIP] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    const fetchIP = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setUserIP(data.ip);
      } catch (err) {
        console.error('Failed to fetch IP:', err);
        setError('Failed to detect IP address');
      }
    };
    
    fetchIP();
    checkAttendanceStatus();
    initializeLocation();

    // Cleanup function
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const checkAttendanceStatus = async () => {
    try {
      const response = await fetch("http://localhost:8000/attendance-status", {
        method: "GET",
        credentials: "include"
      });
      const data = await response.json();
      setIsCheckedIn(data.isCheckedIn);
    } catch (err) {
      console.error("Failed to fetch attendance status:", err);
    }
  };

  const initializeLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (err) => {
          setError("Please enable location services to use this feature.");
        }
      );
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError("Failed to access camera. Please make sure you have granted camera permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
  };

  const captureImage = async () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
    
    // Create URL for preview
    const dataUrl = canvas.toDataURL("image/jpeg");
    setCapturedImage(dataUrl);
    
    // Create File object for upload
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        const file = new File([blob], `${isCheckedIn ? "checkout" : "checkin"}.jpg`, { type: "image/jpeg" });
        resolve(file);
      }, "image/jpeg");
    });
  };

  const handleCapture = async () => {
    const imageFile = await captureImage();
    stopCamera();
  };

  const handleAttendance = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      if (!location) {
        throw new Error("Location is not available. Please enable GPS.");
      }

      if (!userIP) {
        throw new Error("IP address detection failed. Please try again.");
      }

      if (!capturedImage) {
        throw new Error("Please capture your photo first.");
      }

      const formData = new FormData();
      
      // Convert base64 to blob
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      const imageFile = new File([blob], `${isCheckedIn ? "checkout" : "checkin"}.jpg`, { type: "image/jpeg" });
      
      if (!isCheckedIn) {
        formData.append("checkInImage", imageFile);
        formData.append("check_in_ip", userIP);
      } else {
        formData.append("checkOutImage", imageFile);
        formData.append("checkOut", "true");
        formData.append("check_out_ip", userIP);
      }
      
      formData.append("location[latitude]", location.latitude);
      formData.append("location[longitude]", location.longitude);

      const submitResponse = await fetch("http://localhost:8000/attendance", {
        method: "POST",
        body: formData,
        credentials: "include"
      });

      const data = await submitResponse.json();
      
      if (!submitResponse.ok) {
        throw new Error(data.msg);
      }

      setSuccess(data.msg);
      setIsCheckedIn(!isCheckedIn);
      setCapturedImage(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCameraToggle = async () => {
    if (!showCamera) {
      setShowCamera(true);
      await startCamera();
    } else {
      stopCamera();
    }
  };

  return (
    <div id="attendance">
      <div className="attendance-page container">
        <div className="col-md-8 col-12 offset-md-2">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title text-center">Attendance System</h4>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="alert alert-success" role="alert">
                  {success}
                </div>
              )}

              <div className="text-center mb-4">
                {showCamera && !capturedImage && (
                  <div className="mb-4" style={{ maxWidth: "100%", aspectRatio: "16/9" }}>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      className="rounded"
                    />
                  </div>
                )}

                {capturedImage && (
                  <div className="mb-4" style={{ maxWidth: "100%", aspectRatio: "16/9" }}>
                    <img
                      src={capturedImage}
                      alt="Captured"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      className="rounded"
                    />
                  </div>
                )}

                <div className="d-flex gap-2 justify-content-center">
                  {!capturedImage && (
                    <button 
                      onClick={showCamera ? handleCapture : handleCameraToggle}
                      className="btn btn-outline-primary btn-lg"
                    >
                      <i className="bi bi-camera me-2"></i>
                      {showCamera ? "Capture Photo" : "Open Camera"}
                    </button>
                  )}

                  {capturedImage && (
                    <button
                      onClick={handleAttendance}
                      disabled={loading || !location || !userIP}
                      className="btn btn-primary btn-lg"
                    >
                      {loading ? "Processing..." : isCheckedIn ? "Check Out" : "Check In"}
                    </button>
                  )}
                </div>

                <div className="mt-3 text-muted">
                  {location && (
                    <div>📍 Location: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}</div>
                  )}
                  {userIP && (
                    <div>🌐 IP Address: {userIP}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;