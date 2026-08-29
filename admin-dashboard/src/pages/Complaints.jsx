// ============================================
// Fix It Admin — Complaints Page
// ============================================
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdFilterList, MdClear, MdVisibility } from 'react-icons/md';
import useStore from '../store/store';
import { useEffect } from 'react';
import './pages.css';

const statuses = ['submitted', 'acknowledged', 'assigned', 'in_progress', 'resolved', 'closed', 'rejected', 'reopened'];
const priorities = ['low', 'medium', 'high', 'critical'];

export default function Complaints() {
  const navigate = useNavigate();
  const { filters, setFilter, clearFilters, selectedComplaints, toggleComplaintSelection, selectAllComplaints, complaints, categories, wards, departments, fetchComplaints, fetchWards, fetchDepartments, fetchDashboardData } = useStore();
  const [page, setPage] = useState(1);
  const perPage = 15;

  useEffect(() => {
    if (complaints.length === 0) fetchComplaints();
    if (categories.length === 0) fetchDashboardData();
    if (wards.length === 0) fetchWards();
    if (departments.length === 0) fetchDepartments();
  }, []);

  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      if (filters.status && c.status !== filters.status) return false;
      if (filters.priority && c.priority !== filters.priority) return false;
      if (filters.category && c.category?.id !== parseInt(filters.category)) return false;
      if (filters.ward && c.ward?.id !== parseInt(filters.ward)) return false;
      if (filters.department && c.assigned_department?.id !== parseInt(filters.department)) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        return c.title.toLowerCase().includes(q) || c.complaint_number.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
      }
      return true;
    });
  }, [filters]);

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);
  const hasActiveFilters = Object.values(filters).some((v) => v);

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="complaints-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Complaint Management</h1>
          <p className="page-subtitle">{filtered.length} complaints found</p>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <MdFilterList size={18} style={{ color: 'var(--text-muted)' }} />
        <select className="filter-select" value={filters.status} onChange={(e) => setFilter('status', e.target.value)}>
          <option value="">All Status</option>
          {statuses.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
        <select className="filter-select" value={filters.priority} onChange={(e) => setFilter('priority', e.target.value)}>
          <option value="">All Priority</option>
          {priorities.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <select className="filter-select" value={filters.category} onChange={(e) => setFilter('category', e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
        </select>
        <select className="filter-select" value={filters.ward} onChange={(e) => setFilter('ward', e.target.value)}>
          <option value="">All Wards</option>
          {wards.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
        </select>
        <select className="filter-select" value={filters.department} onChange={(e) => setFilter('department', e.target.value)}>
          <option value="">All Depts</option>
          {departments.map((d) => <option key={d.id} value={d.id}>{d.name.split(' ')[0]}</option>)}
        </select>
        <input
          type="text"
          className="filter-search"
          placeholder="Search complaints..."
          value={filters.search}
          onChange={(e) => setFilter('search', e.target.value)}
        />
        {hasActiveFilters && (
          <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
            <MdClear size={14} /> Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="table-card">
        <div className="table-actions">
          <div className="table-actions-left">
            <input
              type="checkbox"
              checked={selectedComplaints.length === paginated.length && paginated.length > 0}
              onChange={selectAllComplaints}
              style={{ accentColor: 'var(--primary-500)' }}
            />
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {selectedComplaints.length > 0 ? `${selectedComplaints.length} selected` : `Showing ${paginated.length} of ${filtered.length}`}
            </span>
          </div>
          {selectedComplaints.length > 0 && (
            <div className="table-actions-right">
              <button className="btn btn-primary btn-sm">Bulk Assign</button>
              <button className="btn btn-ghost btn-sm">Escalate</button>
            </div>
          )}
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '30px' }}></th>
                <th>ID</th>
                <th>Title</th>
                <th>Category</th>
                <th>Ward</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((c) => (
                <tr key={c.id} onClick={() => navigate(`/complaints/${c.id}`)}>
                  <td onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" checked={selectedComplaints.includes(c.id)} onChange={() => toggleComplaintSelection(c.id)} style={{ accentColor: 'var(--primary-500)' }} />
                  </td>
                  <td><span className="complaint-id">{c.complaint_number}</span></td>
                  <td className="truncate" style={{ maxWidth: '220px' }}>{c.is_emergency && '🚨 '}{c.title}</td>
                  <td><span className="text-sm">{c.category?.icon || '📝'} {c.category?.name}</span></td>
                  <td className="text-sm">{c.ward?.name}</td>
                  <td><span className={`badge badge-${c.status}`}>{c.status.replace('_', ' ')}</span></td>
                  <td><span className={`badge badge-${c.priority}`}>{c.priority}</span></td>
                  <td className="text-sm" style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{formatDate(c.created_at)}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <button className="btn btn-ghost btn-sm btn-icon" onClick={() => navigate(`/complaints/${c.id}`)} title="View">
                      <MdVisibility size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-pagination">
          <span>Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <button className="btn btn-ghost btn-sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
            <button className="btn btn-ghost btn-sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
