import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { tasksAPI } from '../api/axios';
import UserTaskList from '../components/UserTaskList';
import UserStats from '../components/UserStats';
import './UserDashboard.css';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({ status: '', priority: '' });
  const [selectedTask, setSelectedTask] = useState(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await tasksAPI.getTasks(filter);
      setTasks(response.data.data.tasks);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await tasksAPI.getStats();
      setStats(response.data.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [fetchTasks, fetchStats]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await tasksAPI.updateTask(id, { status });
      fetchTasks();
      fetchStats();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task status');
    }
  };

  const handleSubmitResponse = async (id, response) => {
    try {
      await tasksAPI.updateTask(id, { response });
      fetchTasks();
      setSelectedTask(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit response');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <div className="loading">Loading your tasks...</div>;
  }

  return (
    <div className="user-dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="header-content">
            <h1>My Tasks</h1>
            <p>View and manage your assigned tasks</p>
          </div>
          <div className="header-actions">
            <div className="user-info">
              <div className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
              <div className="user-details">
                <strong>{user?.name}</strong>
                <span>Team Member</span>
              </div>
            </div>
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </div>
        </div>

        {stats && <UserStats stats={stats} />}

        <div className="filters-section">
          <h3>Filter Tasks</h3>
          <div className="filters-grid">
            <div className="filter-group">
              <label>Status</label>
              <select
                value={filter.status}
                onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Priority</label>
              <select
                value={filter.priority}
                onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
              >
                <option value="">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="tasks-section">
          <h3>Your Tasks ({tasks.length})</h3>
          <UserTaskList
            tasks={tasks}
            onUpdateStatus={handleUpdateStatus}
            onSubmitResponse={handleSubmitResponse}
            onSelectTask={setSelectedTask}
            selectedTask={selectedTask}
          />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
