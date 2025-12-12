import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN as string;

// Temporary default center for V1 dev
const DEFAULT_CENTER: [number, number] = [-84.39, 33.75]; // ATL-ish
const DEFAULT_ZOOM = 11;

type HomeMapProps = {
  recenterKey: number;
};

export const HomeMap: React.FC<HomeMapProps> = ({ recenterKey }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  // Initial map setup
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
    });

    // Optional: disable rotation / pitch for now
    mapRef.current.dragRotate.disable();
    mapRef.current.touchZoomRotate.disableRotation();

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // Handle recenter requests
  useEffect(() => {
    if (!mapRef.current) return;

    mapRef.current.flyTo({
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      speed: 1.4,
      curve: 1.2,
      essential: true,
    });
  }, [recenterKey]);

  return <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />;
};