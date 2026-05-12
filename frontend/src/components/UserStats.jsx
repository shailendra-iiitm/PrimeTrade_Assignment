import './UserStats.css';

const UserStats = ({ stats }) => {
  const getStatValue = (statArray, key) => {
    const stat = statArray.find(s => s._id === key);
    return stat ? stat.count : 0;
  };

  return (
    <div className="stats-container">
      <div className="stat-card pending">
        <h3>Pending</h3>
        <p className="stat-number">{getStatValue(stats.byStatus, 'pending')}</p>
      </div>
      <div className="stat-card in-progress">
        <h3>In Progress</h3>
        <p className="stat-number">{getStatValue(stats.byStatus, 'in-progress')}</p>
      </div>
      <div className="stat-card completed">
        <h3>Completed</h3>
        <p className="stat-number">{getStatValue(stats.byStatus, 'completed')}</p>
      </div>
      <div className="stat-card overdue">
        <h3>Overdue</h3>
        <p className="stat-number">{stats.overdue}</p>
      </div>
    </div>
  );
};

export default UserStats;
