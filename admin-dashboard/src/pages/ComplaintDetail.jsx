// ============================================
// Fix It Admin — Complaint Detail Page
// ============================================
import { useParams, useNavigate } from 'react-router-dom';
import { MdArrowBack, MdLocationOn, MdPerson, MdCalendarToday, MdBusiness, MdFlag } from 'react-icons/md';
import { useEffect, useState } from 'react';
import apiClient from '../api/client';
import './pages.css';

export default function ComplaintDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const res = await apiClient.get(`/complaints/${id}`);
        setComplaint(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaint();
  }, [id]);

  if (loading) return <div className="p-8 text-center text-gray-400">Loading complaint...</div>;

  if (!complaint) {
    return (
      <div className="detail-page" style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>Complaint not found</h2>
        <button className="btn btn-primary" onClick={() => navigate('/complaints')} style={{ marginTop: '1rem' }}>Back to Complaints</button>
      </div>
    );
  }

  const formatDate = (d) => d ? new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

  return (
    <div className="detail-page">
      <div className="page-header">
        <div className="flex items-center gap-3">
          <button className="btn btn-ghost btn-icon" onClick={() => navigate('/complaints')}><MdArrowBack size={20} /></button>
          <div>
            <h1 className="page-title">{complaint.complaint_number}</h1>
            <p className="page-subtitle">{complaint.title}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <span className={`badge badge-${complaint.status}`}>{complaint.status.replace('_', ' ')}</span>
          <span className={`badge badge-${complaint.priority}`}>{complaint.priority}</span>
          {complaint.is_emergency && <span className="badge badge-critical">🚨 Emergency</span>}
        </div>
      </div>

      <div className="detail-grid">
        {/* Main Info */}
        <div>
          <div className="detail-card" style={{ marginBottom: '1.5rem' }}>
            <h3>Complaint Details</h3>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>{complaint.description}</p>
            <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div className="detail-row"><span className="detail-label"><MdPerson size={14} /> Citizen</span><span className="detail-value">{complaint.is_anonymous ? 'Anonymous' : complaint.citizen?.profile?.full_name}</span></div>
              <div className="detail-row"><span className="detail-label"><MdCalendarToday size={14} /> Filed</span><span className="detail-value">{formatDate(complaint.created_at)}</span></div>
              <div className="detail-row"><span className="detail-label">{complaint.category?.icon} Category</span><span className="detail-value">{complaint.category?.name}</span></div>
              <div className="detail-row"><span className="detail-label"><MdLocationOn size={14} /> Ward</span><span className="detail-value">{complaint.ward?.name}</span></div>
              <div className="detail-row"><span className="detail-label"><MdBusiness size={14} /> Department</span><span className="detail-value">{complaint.assigned_department?.name || 'Unassigned'}</span></div>
              <div className="detail-row"><span className="detail-label"><MdFlag size={14} /> AI Score</span><span className="detail-value">{complaint.ai_severity_score}</span></div>
              <div className="detail-row"><span className="detail-label">📍 Address</span><span className="detail-value">{complaint.address}</span></div>
              <div className="detail-row"><span className="detail-label">👤 Assigned</span><span className="detail-value">{complaint.assigned_official?.profile?.full_name || 'Not assigned'}</span></div>
              <div className="detail-row"><span className="detail-label">👍 Upvotes</span><span className="detail-value">{complaint.upvotes}</span></div>
              <div className="detail-row"><span className="detail-label">⏰ ETA</span><span className="detail-value">{formatDate(complaint.resolution_eta)}</span></div>
            </div>
          </div>

          {/* Actions */}
          <div className="detail-card">
            <h3>Quick Actions</h3>
            <div className="flex flex-wrap gap-2" style={{ marginTop: '0.5rem' }}>
              <button className="btn btn-primary btn-sm">Update Status</button>
              <button className="btn btn-ghost btn-sm">Assign Official</button>
              <button className="btn btn-ghost btn-sm">Escalate</button>
              <button className="btn btn-ghost btn-sm">Add Internal Note</button>
              <button className="btn btn-ghost btn-sm">Generate QR</button>
              <button className="btn btn-ghost btn-sm">Download PDF</button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* Timeline */}
          <div className="detail-card" style={{ marginBottom: '1.5rem' }}>
            <h3>Status Timeline</h3>
            <div className="timeline">
              {(complaint.status_history || []).map((t, i) => (
                <div key={i} className="timeline-item">
                  <div className={`timeline-dot ${t.new_status}`} />
                  <div className="timeline-content">
                    <div className="timeline-status">{t.new_status?.replace('_', ' ')}</div>
                    <div className="timeline-by">{t.changed_by?.profile?.full_name || 'System'} — {t.notes}</div>
                    <div className="timeline-date">{formatDate(t.created_at)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="detail-card">
            <h3>Location</h3>
            <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              <p>📍 {complaint.latitude?.toFixed(6)}, {complaint.longitude?.toFixed(6)}</p>
              <p style={{ marginTop: '0.5rem' }}>{complaint.address}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
