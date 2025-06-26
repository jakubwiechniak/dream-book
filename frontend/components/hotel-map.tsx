import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in Leaflet
(delete (L.Icon.Default.prototype as any)._getIconUrl);
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface Hotel {
  id: number;
  name: string;
  location: string;
  latitude: number | string;  // Accept both number and string
  longitude: number | string; // Accept both number and string
}

interface HotelMapProps {
  hotels: Hotel[];
  className?: string; // Opcjonalna klasa CSS
}

export default function HotelMap({ hotels = [], className }: HotelMapProps) {
    // Check if we have any hotels with valid coordinates
    const validHotels = hotels.filter(hotel => {
      const lat = typeof hotel.latitude === 'string' ? parseFloat(hotel.latitude) : hotel.latitude;
      const lng = typeof hotel.longitude === 'string' ? parseFloat(hotel.longitude) : hotel.longitude;
      return !isNaN(lat) && !isNaN(lng);
    });
    
    if (validHotels.length === 0) {
      return (
        <div className={`${className || ""} flex items-center justify-center bg-gray-100 rounded-lg`} style={{ minHeight: "400px" }}>
          <p className="text-gray-500">No hotel locations available</p>
        </div>
      );
    }
    
    // Calculate map center dynamically if hotels are available
    const getMapCenter = () => {
      if (hotels.length === 0) {
        return [52.2297, 21.0122]; // Default to Warsaw, Poland
      }
      
      // Find the first hotel with valid coordinates
      for (const hotel of hotels) {
        const lat = typeof hotel.latitude === 'string' ? parseFloat(hotel.latitude) : hotel.latitude;
        const lng = typeof hotel.longitude === 'string' ? parseFloat(hotel.longitude) : hotel.longitude;
        
        if (!isNaN(lat) && !isNaN(lng)) {
          return [lat, lng];
        }
      }
      
      return [52.2297, 21.0122]; // Default fallback
    };
    
    return (
      <MapContainer
        center={getMapCenter() as [number, number]}
        zoom={hotels.length > 1 ? 4 : 10} // Zoom out if multiple hotels, zoom in if only one
        className={`rounded-lg shadow-md mx-auto ${className || ""}`} 
        style={{ width: "100%", height: "100%", minHeight: "400px" }} // Responsive sizing
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {hotels.map((hotel) => {
          // Convert latitude and longitude to numbers
          const lat = typeof hotel.latitude === 'string' ? parseFloat(hotel.latitude) : hotel.latitude;
          const lng = typeof hotel.longitude === 'string' ? parseFloat(hotel.longitude) : hotel.longitude;
          
          // Only render markers with valid coordinates
          if (!isNaN(lat) && !isNaN(lng)) {
            return (
              <Marker key={hotel.id} position={[lat, lng]}>
                <Popup>
                  <strong>{hotel.name}</strong>
                  <br />
                  {hotel.location}
                </Popup>
              </Marker>
            );
          }
          return null; // Skip invalid coordinates
        })}
      </MapContainer>
    );
  }