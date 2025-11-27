import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { tasksAPI, usersAPI } from '../api/axios';
import AdminTaskForm from '../components/AdminTaskForm';
import AdminTaskList from '../components/AdminTaskList';
import AdminAnalytics from '../components/AdminAnalytics';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState({ status: '', priority: '', assignedTo: '' });
  const [activeTab, setActiveTab] = useState('tasks');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [tasksRes, usersRes, analyticsRes] = await Promise.all([
        tasksAPI.getTasks(filter),
        usersAPI.getUsers(),
        tasksAPI.getAnalytics()
      ]);
      
      setTasks(tasksRes.data.data.tasks);
      setUsers(usersRes.data.data.users);
      setAnalytics(analyticsRes.data.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateTask = async (taskData) => {
    try {
      await tasksAPI.createTask(taskData);
      setShowForm(false);
      fetchData();
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleUpdateTask = async (id, taskData) => {
    try {
      await tasksAPI.updateTask(id, taskData);
      setEditingTask(null);
      fetchData();
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await tasksAPI.deleteTask(id);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleAssignTask = async (taskId, userId) => {
    try {
      await tasksAPI.assignTask(taskId, userId);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign task');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="header-content">
            <h1>Admin Dashboard</h1>
            <p>Manage tasks, users, and track performance</p>
          </div>
          <div className="header-actions">
            <div className="user-info">
              <div className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
              <div className="user-details">
                <strong>{user?.name}</strong>
                <span>Administrator</span>
              </div>
            </div>
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </div>
        </div>

        <div className="dashboard-tabs">
          <button
            className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics Overview
          </button>
          <button
            className={`tab-button ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            Task Management
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {activeTab === 'analytics' && analytics && (
          <AdminAnalytics analytics={analytics} />
        )}

        {activeTab === 'tasks' && (
          <div className="task-management-section">
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
                    <option value="cancelled">Cancelled</option>
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

                <div className="filter-group">
                  <label>Assigned To</label>
                  <select
                    value={filter.assignedTo}
                    onChange={(e) => setFilter({ ...filter, assignedTo: e.target.value })}
                  >
                    <option value="">All Users</option>
                    {users.filter(u => u.role === 'user').map(u => (
                      <option key={u._id} value={u._id}>{u.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {(showForm || editingTask) && (
              <div className="create-task-section">
                <h3>{editingTask ? 'Edit Task' : 'Create New Task'}</h3>
                <AdminTaskForm
                  task={editingTask}
                  users={users.filter(u => u.role === 'user')}
                  onSubmit={editingTask ? (id, data) => handleUpdateTask(id, data) : handleCreateTask}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingTask(null);
                  }}
                />
              </div>
            )}

            {!showForm && !editingTask && (
              <div className="create-task-section">
                <button
                  onClick={() => setShowForm(true)}
                  className="btn-primary"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '1rem 2rem',
                    borderRadius: '10px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    width: '100%',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease'
                  }}
                >
                  + Create New Task
                </button>
              </div>
            )}

            <div className="tasks-section">
              <h3>All Tasks ({tasks.length})</h3>
              <AdminTaskList
                tasks={tasks}
                users={users.filter(u => u.role === 'user')}
                onEdit={setEditingTask}
                onDelete={handleDeleteTask}
                onAssign={handleAssignTask}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
