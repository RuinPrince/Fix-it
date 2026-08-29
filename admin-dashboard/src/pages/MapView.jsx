// ============================================
// Fix It Admin — Map View Page
// ============================================
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import useStore from '../store/store';
import './pages.css';

const priorityColors = { low: '#10b981', medium: '#f59e0b', high: '#f97316', critical: '#ef4444' };

export default function MapView() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showHeatmap, setShowHeatmap] = useState(false);
  const { complaints, categories, fetchComplaints, fetchDashboardData } = useStore();

  useEffect(() => {
    if(complaints.length === 0) fetchComplaints();
    if(categories.length === 0) fetchDashboardData();
  }, []);

  const filtered = selectedCategory
    ? complaints.filter((c) => c.category?.id === parseInt(selectedCategory))
    : complaints;

  return (
    <div className="map-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">City Map View</h1>
          <p className="page-subtitle">{filtered.length} complaints mapped across Chennai</p>
        </div>
        <div className="flex gap-2">
          <select className="filter-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
          </select>
          <button className={`btn ${showHeatmap ? 'btn-primary' : 'btn-ghost'} btn-sm`} onClick={() => setShowHeatmap(!showHeatmap)}>
            🌡️ Heatmap
          </button>
        </div>
      </div>

      <div className="map-container">
        <MapContainer center={[13.0827, 80.2707]} zoom={12} style={{ width: '100%', height: '100%' }} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filtered.map((c) => (
            <CircleMarker
              key={c.id}
              center={[c.latitude, c.longitude]}
              radius={showHeatmap ? 12 : 7}
              fillColor={priorityColors[c.priority]}
              color={priorityColors[c.priority]}
              fillOpacity={showHeatmap ? 0.4 : 0.7}
              weight={2}
            >
              <Popup>
                <div style={{ minWidth: 200, fontFamily: 'Inter, sans-serif' }}>
                  <strong style={{ fontSize: '0.85rem' }}>{c.complaint_number}</strong>
                  <p style={{ margin: '4px 0', fontSize: '0.8rem' }}>{c.title}</p>
                  <p style={{ fontSize: '0.75rem', color: '#666' }}>{c.category?.icon} {c.category?.name} | {c.ward?.name}</p>
                  <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                    <span style={{ padding: '2px 8px', background: `${priorityColors[c.priority]}20`, color: priorityColors[c.priority], borderRadius: 12, fontSize: '0.7rem', fontWeight: 600 }}>{c.priority}</span>
                    <span style={{ padding: '2px 8px', background: '#3b82f620', color: '#3b82f6', borderRadius: 12, fontSize: '0.7rem', fontWeight: 600 }}>{c.status.replace('_', ' ')}</span>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="flex gap-4 items-center" style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'var(--glass-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
        <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Priority:</span>
        {Object.entries(priorityColors).map(([k, v]) => (
          <div key={k} className="flex items-center gap-1">
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: v }} />
            <span className="text-xs" style={{ textTransform: 'capitalize', color: 'var(--text-secondary)' }}>{k}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
