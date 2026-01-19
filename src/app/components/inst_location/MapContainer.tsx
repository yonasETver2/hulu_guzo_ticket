// components/MapContainer.tsx
import styles from "./location.module.css";

//type
interface MapContainerProps {
  loading: boolean;
  error: string | boolean; // error is a string in your code
  userLocation: { lat: number; lng: number } | null; // correct type
  mapUrl?: string; // optional, so it can be undefined
}

export default function MapContainer({
  loading,
  error,
  userLocation,
  mapUrl,
}: MapContainerProps) {
  return (
    <div className={`flex-1 overflow-auto px-4 pb-4 ${styles.scrollbar_hide}`}>
      {!loading && !error && userLocation && mapUrl && (
        <div className="w-full max-w-4xl mx-auto md:mb-35 h-full shadow-lg rounded-lg overflow-hidden">
          <iframe
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={mapUrl}
          ></iframe>
        </div>
      )}
    </div>
  );
}
