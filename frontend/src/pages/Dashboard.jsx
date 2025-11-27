import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { tasksAPI } from '../api/axios';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState({ status: '', priority: '' });

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [filter]);

  const fetchTasks = async () => {
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
  };

  const fetchStats = async () => {
    try {
      const response = await tasksAPI.getStats();
      setStats(response.data.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      await tasksAPI.createTask(taskData);
      setShowForm(false);
      fetchTasks();
      fetchStats();
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleUpdateTask = async (id, taskData) => {
    try {
      await tasksAPI.updateTask(id, taskData);
      setEditingTask(null);
      fetchTasks();
      fetchStats();
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await tasksAPI.deleteTask(id);
      fetchTasks();
      fetchStats();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="navbar-brand">
          <h2>PrimeTrade Task Manager</h2>
        </div>
        <div className="navbar-menu">
          <span className="user-info">
            {user?.name} ({user?.role})
          </span>
          <button onClick={handleLogout} className="btn-secondary">
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Welcome, {user?.name}!</h1>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingTask(null);
            }}
            className="btn-primary"
          >
            + New Task
          </button>
        </div>

        {stats && (
          <div className="stats-container">
            <div className="stat-card">
              <h3>Total Tasks</h3>
              <p className="stat-number">{stats.total}</p>
            </div>
            {stats.stats.map((stat) => (
              <div key={stat._id} className="stat-card">
                <h3>{stat._id.charAt(0).toUpperCase() + stat._id.slice(1)}</h3>
                <p className="stat-number">{stat.count}</p>
              </div>
            ))}
          </div>
        )}

        <div className="filters">
          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={filter.priority}
            onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
            className="filter-select"
          >
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {error && <div className="error-message">{error}</div>}

        {(showForm || editingTask) && (
          <TaskForm
            task={editingTask}
            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
            onCancel={() => {
              setShowForm(false);
              setEditingTask(null);
            }}
          />
        )}

        {loading ? (
          <div className="loading">Loading tasks...</div>
        ) : (
          <TaskList
            tasks={tasks}
            onEdit={setEditingTask}
            onDelete={handleDeleteTask}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
