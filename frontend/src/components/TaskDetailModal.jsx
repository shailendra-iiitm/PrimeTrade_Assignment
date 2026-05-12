import { useState, useEffect } from 'react';
import { notesAPI } from '../api/axios';

const TaskDetailModal = ({ task, onClose, onSubmitResponse, isUser = false }) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotes();
    if (task.response) {
      setResponse(task.response);
    }
  }, [task]);

  const fetchNotes = async () => {
    try {
      const res = await notesAPI.getTaskNotes(task._id);
      setNotes(res.data.data.notes);
    } catch (err) {
      console.error('Failed to fetch notes:', err);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      setLoading(true);
      await notesAPI.addNote(task._id, newNote);
      setNewNote('');
      fetchNotes();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add note');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitResponse = async (e) => {
    e.preventDefault();
    if (!response.trim()) return;

    try {
      setLoading(true);
      await onSubmitResponse(task._id, response);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit response');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{task.title}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <div className="task-details">
            <div className="detail-row">
              <strong>Description:</strong>
              <p>{task.description}</p>
            </div>

            <div className="detail-grid">
              <div className="detail-item">
                <strong>Status:</strong>
                <span className={`badge status-${task.status}`}>{task.status}</span>
              </div>
              <div className="detail-item">
                <strong>Priority:</strong>
                <span className={`badge priority-${task.priority}`}>{task.priority}</span>
              </div>
              <div className="detail-item">
                <strong>Assigned to:</strong>
                <span>{task.assignedTo?.name}</span>
              </div>
              <div className="detail-item">
                <strong>Created by:</strong>
                <span>{task.createdBy?.name}</span>
              </div>
              <div className="detail-item">
                <strong>Due Date:</strong>
                <span>{task.dueDate ? formatDate(task.dueDate) : 'No due date'}</span>
              </div>
              <div className="detail-item">
                <strong>Created:</strong>
                <span>{formatDate(task.createdAt)}</span>
              </div>
            </div>

            {task.completedAt && (
              <div className="detail-row">
                <strong>Completed at:</strong>
                <span>{formatDate(task.completedAt)}</span>
              </div>
            )}
          </div>

          {isUser && (
            <div className="response-section">
              <h3>Your Response</h3>
              <form onSubmit={handleSubmitResponse}>
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Enter your response or update to the task..."
                  maxLength="1000"
                  rows="4"
                  className="response-textarea"
                />
                <div className="response-actions">
                  <small>{response.length}/1000 characters</small>
                  <button type="submit" className="btn-primary" disabled={loading || !response.trim()}>
                    {loading ? 'Submitting...' : 'Submit Response'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {task.response && !isUser && (
            <div className="response-section">
              <h3>User Response</h3>
              <div className="response-content">
                {task.response}
              </div>
              {task.responseSubmittedAt && (
                <small>Submitted: {formatDate(task.responseSubmittedAt)}</small>
              )}
            </div>
          )}

          <div className="notes-section">
            <h3>Notes</h3>
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleAddNote} className="add-note-form">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note..."
                maxLength="1000"
                rows="3"
              />
              <button type="submit" className="btn-primary" disabled={loading || !newNote.trim()}>
                Add Note
              </button>
            </form>

            <div className="notes-list">
              {notes.length === 0 ? (
                <p className="no-notes">No notes yet</p>
              ) : (
                notes.map((note) => (
                  <div key={note._id} className={`note-item ${note.isAdminNote ? 'admin-note' : 'user-note'}`}>
                    <div className="note-header">
                      <strong>{note.user?.name}</strong>
                      {note.isAdminNote && <span className="admin-badge">Admin</span>}
                      <span className="note-time">{formatDate(note.createdAt)}</span>
                    </div>
                    <p className="note-content">{note.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
