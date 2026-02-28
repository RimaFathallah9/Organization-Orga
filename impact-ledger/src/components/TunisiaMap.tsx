import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './TunisiaMap.module.css';

interface Opportunity {
  id: number;
  title: string;
  location: string;
  lat: number;
  lng: number;
  type: 'remote' | 'hybrid' | 'local';
  xpReward: number;
  status: 'open' | 'closing-soon' | 'closed';
}

interface TunisiaMapProps {
  userLat?: number;
  userLng?: number;
  opportunities: Opportunity[];
  onOpportunitySelect?: (opportunity: Opportunity) => void;
}

const opportunities: Opportunity[] = [
  {
    id: 1,
    title: 'Digital Literacy Program',
    location: 'Tunis',
    lat: 36.8065,
    lng: 10.1815,
    type: 'local',
    xpReward: 150,
    status: 'open'
  },
  {
    id: 2,
    title: 'Community Healthcare Initiative',
    location: 'Sfax',
    lat: 34.7404,
    lng: 10.7605,
    type: 'hybrid',
    xpReward: 200,
    status: 'open'
  },
  {
    id: 3,
    title: 'Environmental Conservation',
    location: 'Gafsa',
    lat: 34.4269,
    lng: 8.7869,
    type: 'local',
    xpReward: 180,
    status: 'open'
  },
  {
    id: 4,
    title: 'Youth Mentorship Program',
    location: 'Sousse',
    lat: 35.8256,
    lng: 10.6369,
    type: 'remote',
    xpReward: 120,
    status: 'closing-soon'
  },
  {
    id: 5,
    title: 'Agricultural Support Network',
    location: 'Kairouan',
    lat: 35.6781,
    lng: 9.5197,
    type: 'local',
    xpReward: 160,
    status: 'open'
  },
  {
    id: 6,
    title: 'Women Entrepreneurship Hub',
    location: 'Monastir',
    lat: 35.7674,
    lng: 10.8165,
    type: 'hybrid',
    xpReward: 190,
    status: 'open'
  },
  {
    id: 7,
    title: 'Tech Skills Training',
    location: 'Djerba',
    lat: 33.8111,
    lng: 10.9217,
    type: 'local',
    xpReward: 170,
    status: 'open'
  },
  {
    id: 8,
    title: 'Water Conservation Project',
    location: 'Tataouine',
    lat: 32.9281,
    lng: 11.0833,
    type: 'remote',
    xpReward: 140,
    status: 'open'
  }
];

export default function TunisiaMap({ userLat = 36.8065, userLng = 10.1815, onOpportunitySelect }: TunisiaMapProps) {
  const center: LatLngExpression = [36.8006, 10.1881];

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'local':
        return '#FF6B6B';
      case 'hybrid':
        return '#4ECDC4';
      case 'remote':
        return '#45B7D1';
      default:
        return '#3B82F6';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'closing-soon':
        return '⏰ Closing Soon';
      case 'closed':
        return '❌ Closed';
      default:
        return '✅ Open';
    }
  };

  return (
    <div className={styles.mapWrapper}>
      <div className={styles.header}>
        <h2>Find Opportunities Near You</h2>
        <p>Explore civic engagement opportunities across Tunisia</p>
      </div>

      <MapContainer
        center={center}
        zoom={7}
        className={styles.map}
        style={{ height: '500px', borderRadius: '1rem' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {/* User location circle */}
        <Circle
          center={[userLat, userLng]}
          radius={50000}
          pathOptions={{
            color: '#3B82F6',
            fillColor: '#3B82F6',
            fillOpacity: 0.15,
            weight: 2,
            dashArray: '5, 5'
          }}
        />

        {/* User location marker */}
        <Marker position={[userLat, userLng]}>
          <Popup>
            <div className={styles.popupContent}>
              <strong>Your Location</strong>
            </div>
          </Popup>
        </Marker>

        {/* Opportunity markers */}
        {opportunities.map(opp => (
          <Marker
            key={opp.id}
            position={[opp.lat, opp.lng]}
            eventHandlers={{
              click: () => onOpportunitySelect?.(opp)
            }}
          >
            <Popup>
              <div className={styles.popupContent}>
                <strong>{opp.title}</strong>
                <p className={styles.location}>{opp.location}</p>
                <p className={styles.xpReward}>💎 {opp.xpReward} XP</p>
                <span className={styles[`status-${opp.status}`]}>
                  {getStatusBadge(opp.status)}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={styles.legendColor} style={{ background: '#FF6B6B' }} />
          <span>Local Opportunities</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendColor} style={{ background: '#4ECDC4' }} />
          <span>Hybrid Opportunities</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendColor} style={{ background: '#45B7D1' }} />
          <span>Remote Opportunities</span>
        </div>
      </div>

      <div className={styles.opportunitiesList}>
        <h3>Available Opportunities ({opportunities.length})</h3>
        <div className={styles.listGrid}>
          {opportunities.map(opp => (
            <div
              key={opp.id}
              className={`${styles.opportunityCard} ${styles[`status-${opp.status}`]}`}
              onClick={() => onOpportunitySelect?.(opp)}
            >
              <div className={styles.cardHeader}>
                <h4>{opp.title}</h4>
                <span className={styles.badge} style={{ background: getMarkerColor(opp.type) }}>
                  {opp.type}
                </span>
              </div>
              <p className={styles.cardLocation}>📍 {opp.location}</p>
              <div className={styles.cardFooter}>
                <span className={styles.xp}>💎 {opp.xpReward} XP</span>
                <span className={styles.statusText}>{getStatusBadge(opp.status)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
