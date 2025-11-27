const TaskList = ({ tasks, onEdit, onDelete }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="no-tasks">
        <p>No tasks found. Create your first task to get started!</p>
      </div>
    );
  }

  const getPriorityClass = (priority) => {
    switch (priority) {
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
      default: return '';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div key={task._id} className="task-card">
          <div className="task-header">
            <h3>{task.title}</h3>
            <div className="task-badges">
              <span className={`badge ${getStatusClass(task.status)}`}>
                {task.status}
              </span>
              <span className={`badge ${getPriorityClass(task.priority)}`}>
                {task.priority}
              </span>
            </div>
          </div>
          
          <p className="task-description">{task.description}</p>
          
          <div className="task-footer">
            <span className="task-date">
              Created: {formatDate(task.createdAt)}
            </span>
            <div className="task-actions">
              <button
                onClick={() => onEdit(task)}
                className="btn-edit"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(task._id)}
                className="btn-delete"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
