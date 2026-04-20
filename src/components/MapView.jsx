import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// Fix leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const userIcon = L.divIcon({
  html: `<div style="width:16px;height:16px;background:#D6C5AB;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.4)"></div>`,
  className: "",
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const restaurantIcon = L.divIcon({
  html: `<div style="width:30px;height:30px;background:#303743;border:2px solid #D6C5AB;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 2px 8px rgba(0,0,0,0.4)">🍽️</div>`,
  className: "",
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

export default function MapView({ restaurants, userLat, userLng, dish }) {
  const validRestaurants = restaurants.filter(r => r.latitude && r.longitude);
  const center = userLat && userLng
    ? [userLat, userLng]
    : validRestaurants.length > 0
      ? [validRestaurants[0].latitude, validRestaurants[0].longitude]
      : [51.5074, -0.1278];

  return (
    <MapContainer
      center={center}
      zoom={12}
      style={{ height: "100%", width: "100%" }}
      className="z-0"
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      />

      {/* User location */}
      {userLat && userLng && (
        <Marker position={[userLat, userLng]} icon={userIcon}>
          <Popup>Your Location</Popup>
        </Marker>
      )}

      {/* Restaurant markers */}
      {validRestaurants.map(r => (
        <Marker key={r.place_id} position={[r.latitude, r.longitude]} icon={restaurantIcon}>
          <Popup>
            <div style={{ background: "#303743", color: "white", padding: "8px", borderRadius: "8px", minWidth: "180px" }}>
              <p style={{ fontWeight: "bold", marginBottom: "4px" }}>{r.name}</p>
              {r.rating && <p style={{ fontSize: "12px", color: "#D6C5AB" }}>⭐ {r.rating}</p>}
              <p style={{ fontSize: "11px", color: "#aaa", marginTop: "4px" }}>{r.address}</p>
              {r.distance_miles && <p style={{ fontSize: "11px", color: "#D6C5AB", marginTop: "4px" }}>📍 {r.distance_miles} mi</p>}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}