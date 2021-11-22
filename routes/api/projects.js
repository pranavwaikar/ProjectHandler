const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const logger = require('../../config/logger');

const Project = require('../models/Project');
const Task = require('../models/Task');

// @route   GET api/projects
// @desc    Get all projects
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find().sort({ date: -1 });
    const currentUserProjects = projects.filter((entry) => {
      const userIds = entry.users.map((userEntry) => userEntry.user.toString());
      return userIds.includes(req.user.id);
    });

    res.json(currentUserProjects);
  } catch (error) {
    logger.error(error.message);
    res.status(500).send({ errors: [{ msg: 'server error' }] });
  }
});

// @route   GET api/projects/:id
// @desc    Get all projects
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const projects = await Project.find().sort({ date: -1 });
    const currentUserProjects = projects.filter((entry) => {
      const userIds = entry.users.map((userEntry) => userEntry.user.toString());
      return userIds.includes(req.user.id);
    });

    const targetProject = currentUserProjects.find((entry) => {
      if (entry.id === req.params.id) {
        return entry;
      }
    });

    if (!targetProject) {
      throw new Error(`user might not have access to the project`);
    }

    res.json(targetProject);
  } catch (error) {
    logger.error(error.message);
    res.status(500).send({ errors: [{ msg: 'server error' }] });
  }
});

// @route   GET api/projects/:id/tasks
// @desc    Get all tasks under given project id
// @access  Private
router.get('/:id/tasks', auth, async (req, res) => {
  try {
    const projects = await Project.find().sort({ date: -1 });
    const currentUserProjects = projects.filter((entry) => {
      const userIds = entry.users.map((userEntry) => userEntry.user.toString());
      return userIds.includes(req.user.id);
    });

    const targetProject = currentUserProjects.find((entry) => {
      if (entry.id === req.params.id) {
        return entry;
      }
    });

    if (!targetProject) {
      throw new Error(`user might not have access to the project`);
    }

    const tasks = await Task.find({
      project: req.params.id,
      user: req.user.id,
    }).sort({
      creationDate: -1,
    });

    res.json(tasks);
  } catch (error) {
    logger.error(error.message);
    res.status(500).send({ errors: [{ msg: 'server error' }] });
  }
});

module.exports = router;
