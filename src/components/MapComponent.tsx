import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Stack,
} from "@mui/material";
import {
  MyLocation,
  DirectionsRounded,
  ZoomIn,
  ZoomOut,
  Layers,
} from "@mui/icons-material";

const MapComponent = ({ role, data }) => {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(13);
  const [mapType, setMapType] = useState("roadmap");

  // Mock coordinates for demonstration
  const mockLocations = {
    driver: {
      lat: -33.9249,
      lng: 18.4241,
    },
    pickup: {
      lat: -33.9185,
      lng: 18.423,
    },
    destination: {
      lat: -33.932,
      lng: 18.46,
    },
  };

  useEffect(() => {
    // Initialize mock map
    initializeMap();
  }, []);

  const initializeMap = () => {
    // Simulate map loading
    setTimeout(() => {
      setMapLoaded(true);
    }, 1000);
  };

  const handleZoomIn = () => {
    if (currentZoom < 20) {
      setCurrentZoom((prev) => prev + 1);
    }
  };

  const handleZoomOut = () => {
    if (currentZoom > 1) {
      setCurrentZoom((prev) => prev - 1);
    }
  };

  const toggleMapType = () => {
    setMapType((prev) => (prev === "roadmap" ? "satellite" : "roadmap"));
  };

  const centerOnCurrentLocation = () => {
    // Mock centering on current location
    console.log("Centering on current location");
  };

  const renderMapContent = () => {
    if (!mapLoaded) {
      return (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100%"
          sx={{ bgcolor: "#f5f5f5" }}
        >
          <Typography color="text.secondary">Loading map...</Typography>
        </Box>
      );
    }

    return (
      <Box
        position="relative"
        height="100%"
        sx={{
          bgcolor: mapType === "satellite" ? "#2a4d3a" : "#f0f8ff",
          backgroundImage:
            mapType === "satellite"
              ? "radial-gradient(circle at 30% 30%, #4a7c59, #2a4d3a)"
              : "linear-gradient(45deg, #e3f2fd 25%, transparent 25%), linear-gradient(-45deg, #e3f2fd 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e3f2fd 75%), linear-gradient(-45deg, transparent 75%, #e3f2fd 75%)",
          backgroundSize: mapType === "satellite" ? "auto" : "20px 20px",
          backgroundPosition:
            mapType === "satellite"
              ? "0 0"
              : "0 0, 0 10px, 10px -10px, -10px 0px",
        }}
      >
        {/* Mock Driver Location */}
        <Box
          position="absolute"
          top="40%"
          left="35%"
          sx={{
            width: 16,
            height: 16,
            bgcolor: "#1976d2",
            borderRadius: "50%",
            border: "3px solid white",
            boxShadow: 2,
            zIndex: 2,
          }}
        >
          <Tooltip title="Your Location">
            <Box />
          </Tooltip>
        </Box>

        {/* Mock Pickup Location */}
        {role === "driver" && data?.currentTrip && (
          <Box
            position="absolute"
            top="30%"
            left="30%"
            sx={{
              width: 12,
              height: 12,
              bgcolor: "#ff9800",
              borderRadius: "50%",
              border: "2px solid white",
              boxShadow: 1,
              zIndex: 2,
            }}
          >
            <Tooltip title="Pickup Location">
              <Box />
            </Tooltip>
          </Box>
        )}

        {/* Mock Destination */}
        {role === "driver" && data?.currentTrip && (
          <Box
            position="absolute"
            top="60%"
            left="70%"
            sx={{
              width: 12,
              height: 12,
              bgcolor: "#4caf50",
              borderRadius: "50%",
              border: "2px solid white",
              boxShadow: 1,
              zIndex: 2,
            }}
          >
            <Tooltip title="Destination">
              <Box />
            </Tooltip>
          </Box>
        )}

        {/* Mock Route Line */}
        {role === "driver" && data?.currentTrip && (
          <svg
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              zIndex: 1,
            }}
          >
            <path
              d="M 35% 40% Q 50% 20% 70% 60%"
              stroke="#1976d2"
              strokeWidth="3"
              fill="none"
              strokeDasharray="5,5"
            />
          </svg>
        )}

        {/* Map Controls */}
        <Box position="absolute" top={8} right={8} sx={{ zIndex: 3 }}>
          <Stack spacing={1}>
            <Paper elevation={2}>
              <IconButton onClick={handleZoomIn} size="small">
                <ZoomIn fontSize="small" />
              </IconButton>
            </Paper>
            <Paper elevation={2}>
              <IconButton onClick={handleZoomOut} size="small">
                <ZoomOut fontSize="small" />
              </IconButton>
            </Paper>
            <Paper elevation={2}>
              <IconButton onClick={toggleMapType} size="small">
                <Layers fontSize="small" />
              </IconButton>
            </Paper>
          </Stack>
        </Box>

        {/* Current Location Button */}
        <Box position="absolute" bottom={8} right={8} sx={{ zIndex: 3 }}>
          <Paper elevation={2}>
            <IconButton onClick={centerOnCurrentLocation} color="primary">
              <MyLocation />
            </IconButton>
          </Paper>
        </Box>

        {/* Map Info */}
        <Box position="absolute" bottom={8} left={8} sx={{ zIndex: 3 }}>
          <Paper elevation={2} sx={{ p: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="caption" color="text.secondary">
                Zoom: {currentZoom}
              </Typography>
              <Chip
                label={mapType === "roadmap" ? "Road" : "Satellite"}
                size="small"
                variant="outlined"
              />
            </Stack>
          </Paper>
        </Box>

        {/* Trip Status Overlay for Driver */}
        {role === "driver" && data?.currentTrip && (
          <Box position="absolute" top={8} left={8} sx={{ zIndex: 3 }}>
            <Paper elevation={3} sx={{ p: 2, maxWidth: 250 }}>
              <Stack spacing={1}>
                <Typography variant="subtitle2" fontWeight="bold">
                  {data.currentTrip.memberName}
                </Typography>
                <Box display="flex" alignItems="center">
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      bgcolor: "#ff9800",
                      borderRadius: "50%",
                      mr: 1,
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Pickup: {data.currentTrip.pickupAddress?.substring(0, 30)}
                    ...
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      bgcolor: "#4caf50",
                      borderRadius: "50%",
                      mr: 1,
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Drop: {data.currentTrip.destination?.substring(0, 30)}...
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mt={1}>
                  <DirectionsRounded
                    fontSize="small"
                    sx={{ mr: 1, color: "primary.main" }}
                  />
                  <Typography variant="caption" color="primary">
                    ETA: 12 mins
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Paper
      elevation={2}
      sx={{
        height: "100%",
        overflow: "hidden",
        position: "relative",
      }}
      ref={mapRef}
    >
      {renderMapContent()}
    </Paper>
  );
};

export default MapComponent;
