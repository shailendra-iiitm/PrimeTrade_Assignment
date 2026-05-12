import './AdminAnalytics.css';

const AdminAnalytics = ({ analytics }) => {
  if (!analytics) {
    return <div className="no-data">No analytics data available</div>;
  }

  return (
    <div className="admin-analytics">
      <div className="analytics-summary">
        <div className="summary-card">
          <h3>Total Tasks</h3>
          <p className="value">{analytics.totalTasks}</p>
        </div>
        <div className="summary-card">
          <h3>Total Users</h3>
          <p className="value">{analytics.totalUsers}</p>
        </div>
      </div>

      <div className="user-performance">
        <h3>Task Distribution by User</h3>
        <div className="performance-grid">
          {analytics.tasksByUser.map((userStat) => {
            const completionRate = userStat.completionRate;
            const completionClass = completionRate >= 70 ? 'high' : completionRate >= 40 ? 'medium' : 'low';
            
            return (
              <div key={userStat.userId} className="user-card">
                <div className="user-card-header">
                  <div className="user-info">
                    <h4>{userStat.userName}</h4>
                    <p>{userStat.userEmail}</p>
                  </div>
                  <div className={`completion-badge ${completionClass}`}>
                    {completionRate.toFixed(0)}%
                  </div>
                </div>
                <div className="task-stats">
                  <div className="stat-item">
                    <span className="label">Total</span>
                    <span className="value">{userStat.total}</span>
                  </div>
                  <div className="stat-item">
                    <span className="label">Completed</span>
                    <span className="value">{userStat.completed}</span>
                  </div>
                  <div className="stat-item">
                    <span className="label">In Progress</span>
                    <span className="value">{userStat.inProgress}</span>
                  </div>
                  <div className="stat-item">
                    <span className="label">Pending</span>
                    <span className="value">{userStat.pending}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
