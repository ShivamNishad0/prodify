const express = require('express');
const { Op } = require('sequelize');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Tasks');
const User = require('../models/User');

// Helper function to update parent progress
const updateParentProgress = async (parentId) => {
  if (!parentId) return;

  const subtasks = await Task.findAll({ where: { parentTaskId: parentId } });
  if (subtasks.length === 0) return;

  const totalProgress = subtasks.reduce((sum, task) => sum + (task.progress || 0), 0);
  const averageProgress = Math.round(totalProgress / subtasks.length);

  const parent = await Task.findByPk(parentId);
  if (parent) {
    parent.progress = averageProgress;
    if (averageProgress === 100) {
      parent.status = 'Completed';
    } else if (averageProgress > 0) {
      parent.status = 'In Progress';
    }
    await parent.save();

    // Recursively update upwards
    if (parent.parentTaskId) {
      await updateParentProgress(parent.parentTaskId);
    }
  }
};

// @route   GET api/tasks
// @desc    Get all tasks based on user role
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    let query = {};

    if (user.role === 'admin') {
      // Admin sees everything
      query = {};
    } else if (user.role === 'manager') {
      // Manager sees tasks they created or are assigned to
      query = {
        [Op.or]: [{ userId: req.user.id }, { assignedToId: req.user.id }]
      };
    } else if (user.role === 'tl' || user.role === 'employee') {
      // TL and Employee see tasks assigned to them
      query = { assignedToId: req.user.id };
    }

    const tasks = await Task.findAll({
      where: query,
      include: [
        { model: User, as: 'assignedTo', attributes: ['id', 'name', 'email', 'role'] },
        { model: User, as: 'assignedBy', attributes: ['id', 'name', 'email', 'role'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/tasks
// @desc    Create a task
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, assignedTo, parentTask, priority, dueDate, color } = req.body;

    const task = await Task.create({
      title,
      description,
      userId: req.user.id,
      assignedById: req.user.id,
      assignedToId: assignedTo || null,
      parentTaskId: parentTask || null,
      priority,
      dueDate: dueDate || null,
      color
    });

    if (parentTask) {
      await updateParentProgress(parentTask);
    }

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/tasks/:id
// @desc    Update a task
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, status, priority, progress, dueDate, color, assignedTo } = req.body;

    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    // Update fields
    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (progress !== undefined) task.progress = progress;
    if (dueDate) task.dueDate = dueDate;
    if (color) task.color = color;
    if (assignedTo) task.assignedToId = assignedTo;

    await task.save();

    if (task.parentTaskId) {
      await updateParentProgress(task.parentTaskId);
    }

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/tasks/:id
// @desc    Delete a task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    const parentId = task.parentTaskId;
    await task.destroy();

    // Delete subtasks recursively
    await Task.destroy({ where: { parentTaskId: req.params.id } });

    if (parentId) {
      await updateParentProgress(parentId);
    }

    res.json({ msg: 'Task removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;