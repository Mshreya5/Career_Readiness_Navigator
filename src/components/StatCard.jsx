export default function StatCard({ icon, label, value, color = 'var(--primary)' }) {
  return (
    <div className="card stat-card">
      <div className="stat-icon" style={{ background: color + '20', color }}>
        {icon}
      </div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  )
}
