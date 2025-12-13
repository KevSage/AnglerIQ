import { useEffect, useMemo, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { HomeLake } from "../../types/Lake";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN as string;

type HomeMapProps = {
  recenterKey: number;
  centerLat: number;
  centerLon: number;
  zoom?: number;

  // Emits a transient candidate (or null). MUST NOT mutate HomeLake.
  onSoftLockCandidate?: (candidate: HomeLake | null) => void;
};

const DEFAULT_ZOOM = 11;

// Dev-only reference points (not authoritative geography).
const KNOWN_LAKES_DEV: Array<Omit<HomeLake, "zoom">> = [
  { name: "Lake Lanier", lat: 34.18, lon: -84.07 },
  { name: "Lake Allatoona", lat: 34.16, lon: -84.71 },
  { name: "West Point Lake", lat: 32.88, lon: -85.18 },
];

const SOFT_LOCK_MIN_ZOOM = 9.5;
const SOFT_LOCK_MAX_DISTANCE_KM = 12;

function distanceKm(aLat: number, aLon: number, bLat: number, bLon: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371;

  const dLat = toRad(bLat - aLat);
  const dLon = toRad(bLon - aLon);

  const lat1 = toRad(aLat);
  const lat2 = toRad(bLat);

  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);

  const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * (sinDLon * sinDLon);
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return R * c;
}

export function HomeMap({
  recenterKey,
  centerLat,
  centerLon,
  zoom = DEFAULT_ZOOM,
  onSoftLockCandidate,
}: HomeMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const center = useMemo<[number, number]>(() => [centerLon, centerLat], [centerLat, centerLon]);

  const candidateCbRef = useRef<HomeMapProps["onSoftLockCandidate"]>(undefined);
  useEffect(() => {
    candidateCbRef.current = onSoftLockCandidate;
  }, [onSoftLockCandidate]);

  const lastCandidateKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center,
      zoom,
    });

    // Canon: 2D north-up only
    map.dragRotate.disable();
    map.touchZoomRotate.disableRotation();

    const handleMoveEnd = () => {
      const cb = candidateCbRef.current;
      if (!cb) return;

      const z = map.getZoom();
      if (z < SOFT_LOCK_MIN_ZOOM) {
        if (lastCandidateKeyRef.current !== null) {
          lastCandidateKeyRef.current = null;
          cb(null);
        }
        return;
      }

      const c = map.getCenter();
      const cLat = c.lat;
      const cLon = c.lng;

      let best: { lake: Omit<HomeLake, "zoom">; dKm: number } | null = null;

      for (const lake of KNOWN_LAKES_DEV) {
        const d = distanceKm(cLat, cLon, lake.lat, lake.lon);
        if (!best || d < best.dKm) best = { lake, dKm: d };
      }

      const base = best && best.dKm <= SOFT_LOCK_MAX_DISTANCE_KM ? best.lake : null;

      // Candidate becomes a Saved Water View anchored to what the user is looking at.
      const candidate: HomeLake | null = base ? { ...base, zoom: z } : null;

      const key = candidate ? candidate.name : null;

      if (lastCandidateKeyRef.current !== key) {
        lastCandidateKeyRef.current = key;
        cb(candidate);
      }
    };

    map.on("moveend", handleMoveEnd);

    mapRef.current = map;

    return () => {
      map.off("moveend", handleMoveEnd);
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    map.flyTo({
      center,
      zoom,
      speed: 1.4,
      curve: 1.2,
      essential: true,
    });
  }, [recenterKey, center, zoom]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    map.flyTo({
      center,
      zoom,
      speed: 1.2,
      curve: 1.1,
      essential: true,
    });
  }, [center, zoom]);

  return <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />;
}