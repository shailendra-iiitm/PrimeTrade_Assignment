const Note = require('../models/Note');
const Task = require('../models/Task');

exports.getTaskNotes = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({
        status: 'error',
      message: 'Task not found'
    });
    }

    if (req.user.role !== 'admin' && task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to view notes for this task'
      });
    }

    const notes = await Note.find({ task: req.params.taskId })
      .populate('user', 'name email role')
      .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      count: notes.length,
      data: { notes }
    });
  } catch (error) {
    next(error);
  }
};

exports.addNote = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({
        status: 'error',
      message: 'Task not found'
    });
    }

    if (req.user.role !== 'admin' && task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to add notes to this task'
      });
    }

    const note = await Note.create({
      content: req.body.content,
      task: req.params.taskId,
      user: req.user.id,
      isAdminNote: req.user.role === 'admin'
    });

    await note.populate('user', 'name email role');

    res.status(201).json({
      status: 'success',
      message: 'Note added successfully',
      data: { note }
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        status: 'error',
        message: 'Note not found'
      });
    }

    if (note.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to delete this note'
      });
    }

    await note.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Note deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
