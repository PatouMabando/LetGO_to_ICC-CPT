import {
  GoogleMap,
  DirectionsRenderer,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useEffect, useState } from "react";

type Props = {
  origin: string;
  destination: string;
};

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: -33.9249, // Cape Town
  lng: 18.4241,
};

const RouteMap = ({ origin, destination }: Props) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);

  useEffect(() => {
    if (!isLoaded || !origin || !destination) return;

    const service = new google.maps.DirectionsService();

    service.route(
      {
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);
        }
      }
    );
  }, [isLoaded, origin, destination]);

  if (!isLoaded) return null;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={12}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
      }}
    >
      {directions && <DirectionsRenderer directions={directions} />}
    </GoogleMap>
  );
};

export default RouteMap;
