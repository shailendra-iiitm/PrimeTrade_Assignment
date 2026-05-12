const Task = require('../models/Task');
const User = require('../models/User');
const mongoose = require('mongoose');

exports.getTasks = async (req, res, next) => {
  try {
    let query;

    if (req.user.role === 'admin') {
      query = Task.find()
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email');
    } else {
      query = Task.find({ assignedTo: req.user.id })
        .populate('createdBy', 'name email');
    }

    if (req.query.status) {
      query = query.where('status').equals(req.query.status);
    }

    if (req.query.priority) {
      query = query.where('priority').equals(req.query.priority);
    }

    if (req.query.assignedTo && req.user.role === 'admin') {
      query = query.where('assignedTo').equals(req.query.assignedTo);
    }

    const sortBy = req.query.sortBy || '-createdAt';
    query = query.sort(sortBy);

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    query = query.skip(startIndex).limit(limit);

    const tasks = await query;
    const total = await Task.countDocuments(
      req.user.role === 'admin' ? {} : { assignedTo: req.user.id }
    );

    res.status(200).json({
      status: 'success',
      count: tasks.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: { tasks }
    });
  } catch (error) {
    next(error);
  }
};

exports.getTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email role')
      .populate('createdBy', 'name email role');

    if (!task) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found'
      });
    }

    if (req.user.role !== 'admin' && task.assignedTo._id.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to access this task'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { task }
    });
  } catch (error) {
    next(error);
  }
};

exports.createTask = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Only admins can create tasks'
      });
    }

    const assignedUser = await User.findById(req.body.assignedTo);
    if (!assignedUser) {
      return res.status(404).json({
        status: 'error',
        message: 'Assigned user not found'
      });
    }

    req.body.createdBy = req.user.id;

    const task = await Task.create(req.body);
    await task.populate('assignedTo', 'name email');

    res.status(201).json({
      status: 'success',
      message: 'Task created successfully',
      data: { task }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found'
      });
    }

    if (req.user.role === 'admin') {
      task = await Task.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      }).populate('assignedTo', 'name email').populate('createdBy', 'name email');
    } else {
      if (task.assignedTo.toString() !== req.user.id) {
        return res.status(403).json({
          status: 'error',
          message: 'Not authorized to update this task'
        });
      }

      const allowedUpdates = {};
      if (req.body.status) allowedUpdates.status = req.body.status;
      if (req.body.response) {
        allowedUpdates.response = req.body.response;
        allowedUpdates.responseSubmittedAt = Date.now();
      }

      if (req.body.status === 'completed') {
        allowedUpdates.completedAt = Date.now();
      }

      task = await Task.findByIdAndUpdate(req.params.id, allowedUpdates, {
        new: true,
        runValidators: true
      }).populate('assignedTo', 'name email').populate('createdBy', 'name email');
    }

    res.status(200).json({
      status: 'success',
      message: 'Task updated successfully',
      data: { task }
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Only admins can delete tasks'
      });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found'
      });
    }

    await task.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Task deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

exports.getTaskStats = async (req, res, next) => {
  try {
    const matchStage = req.user.role === 'admin' 
      ? {} 
      : { assignedTo: new mongoose.Types.ObjectId(req.user.id) };

    const stats = await Task.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const priorityStats = await Task.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    const total = await Task.countDocuments(matchStage);
    
    const overdue = await Task.countDocuments({
      ...matchStage,
      dueDate: { $lt: new Date() },
      status: { $nin: ['completed', 'cancelled'] }
    });

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const completedThisWeek = await Task.countDocuments({
      ...matchStage,
      status: 'completed',
      completedAt: { $gte: weekAgo }
    });

    res.status(200).json({
      status: 'success',
      data: {
        total,
        overdue,
        completedThisWeek,
        byStatus: stats,
        byPriority: priorityStats
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getAdminAnalytics = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Admin access required'
      });
    }

    const totalTasks = await Task.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });

    const tasksByUser = await Task.aggregate([
      {
        $group: {
          _id: '$assignedTo',
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          userId: '$_id',
          userName: '$user.name',
          userEmail: '$user.email',
          total: 1,
          completed: 1,
          pending: 1,
          inProgress: 1,
          completionRate: {
            $cond: [
              { $eq: ['$total', 0] },
              0,
              { $multiply: [{ $divide: ['$completed', '$total'] }, 100] }
            ]
          }
        }
      },
      {
        $sort: { total: -1 }
      }
    ]);

    const recentTasks = await Task.find()
      .sort('-createdAt')
      .limit(10)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    res.status(200).json({
      status: 'success',
      data: {
        totalTasks,
        totalUsers,
        tasksByUser,
        recentTasks
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.assignTask = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Only admins can assign tasks'
      });
    }

    const { userId } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { assignedTo: userId },
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email').populate('createdBy', 'name email');

    if (!task) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Task assigned successfully',
      data: { task }
    });
  } catch (error) {
    next(error);
  }
};

