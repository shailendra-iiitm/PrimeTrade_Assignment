import { useState } from 'react';
import TaskDetailModal from './TaskDetailModal';
import './TaskDetailModal.css';
import './UserTaskList.css';

const UserTaskList = ({ tasks, onUpdateStatus, onSubmitResponse, onSelectTask, selectedTask }) => {
  const [showModal, setShowModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  if (!tasks || tasks.length === 0) {
    return (
      <div className="no-tasks">
        <p>No tasks assigned to you yet.</p>
      </div>
    );
  }

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'urgent': return 'priority-urgent';
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'in-progress': return 'status-in-progress';
      case 'pending': return 'status-pending';
      case 'on-hold': return 'status-on-hold';
      default: return '';
    }
  };

  const formatDate = (date) => {
    if (!date) return 'No due date';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const handleViewDetails = (task) => {
    setCurrentTask(task);
    setShowModal(true);
  };

  return (
    <>
      <div className="user-task-list">
        {tasks.map((task) => (
          <div key={task._id} className={`user-task-card ${isOverdue(task.dueDate) && task.status !== 'completed' ? 'overdue-card' : ''}`}>
            <div className="task-header">
              <h3>{task.title}</h3>
              <div className="task-badges">
                <span className={`badge ${getStatusClass(task.status)}`}>
                  {task.status}
                </span>
                <span className={`badge ${getPriorityClass(task.priority)}`}>
                  {task.priority}
                </span>
                {task.dueDate && isOverdue(task.dueDate) && task.status !== 'completed' && (
                  <span className="badge overdue">Overdue</span>
                )}
              </div>
            </div>
            
            <p className="task-description">{task.description}</p>

            <div className="task-meta">
              <div className="meta-item">
                <strong>Assigned by:</strong> {task.createdBy?.name}
              </div>
              <div className="meta-item">
                <strong>Due date:</strong>
                <span className={isOverdue(task.dueDate) && task.status !== 'completed' ? 'overdue-text' : ''}>
                  {formatDate(task.dueDate)}
                </span>
              </div>
              {task.response && (
                <div className="meta-item response-preview">
                  <strong>Your Response:</strong> {task.response.substring(0, 100)}
                  {task.response.length > 100 && '...'}
                </div>
              )}
            </div>
            
            <div className="task-footer">
              <span className="task-date">
                Created: {formatDate(task.createdAt)}
              </span>
              <div className="task-actions">
                <button
                  onClick={() => handleViewDetails(task)}
                  className="btn-view"
                >
                  View Details
                </button>
                <select
                  value={task.status}
                  onChange={(e) => onUpdateStatus(task._id, e.target.value)}
                  className="status-select"
                  disabled={task.status === 'completed'}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && currentTask && (
        <TaskDetailModal
          task={currentTask}
          onClose={() => {
            setShowModal(false);
            setCurrentTask(null);
          }}
          onSubmitResponse={onSubmitResponse}
          isUser={true}
        />
      )}
    </>
  );
};

export default UserTaskList;
