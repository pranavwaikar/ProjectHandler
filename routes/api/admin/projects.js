const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const authAdmin = require('../../../middleware/authAdmin');
const logger = require('../../../config/logger');

const User = require('../../models/User');
const Project = require('../../models/Project');
const Task = require('../../models/Task');
const { TASK_STATUS } = require('../../../config/conf');

// @route   POST api/admin/projects
// @desc    Create a project
// @access  Private
router.post(
  '/',
  [authAdmin, [check('name', 'name is required!').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, description } = req.body;
      const newProjectParams = {};

      newProjectParams.name = name;
      newProjectParams.status = TASK_STATUS.NOT_STARTED;
      if (description) {
        newProjectParams.description = description;
      }

      const newProject = new Project(newProjectParams);

      const project = await newProject.save();

      res.json(project);
    } catch (error) {
      logger.error(error.message);
      res.status(500).send({ errors: [{ msg: 'server error' }] });
    }
  }
);

// @route   GET api/admin/projects
// @desc    Get all projects
// @access  Private
router.get('/', authAdmin, async (req, res) => {
  try {
    const projects = await Project.find().sort({ date: -1 });
    res.json(projects);
  } catch (error) {
    logger.error(error.message);
    res.status(500).send({ errors: [{ msg: 'server error' }] });
  }
});

// @route   GET api/admin/projects/:id
// @desc    Get projects by id
// @access  Private
router.get('/:id', authAdmin, async (req, res) => {
  try {
    const projects = await Project.findById(req.params.id);

    if (!projects) {
      res.status(404).send({ msg: 'Project not found!' });
    }
    res.json(projects);
  } catch (error) {
    logger.error(error.message);
    if (error.kind === 'ObjectId') {
      res.status(404).send({ msg: 'Project not found!' });
    }
    res.status(500).send({ errors: [{ msg: 'server error' }] });
  }
});

// @route   Delete api/admin/projects/:id
// @desc    Delete a project by id
// @access  Private
router.delete('/:id', authAdmin, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404).send({ msg: 'Project not found!' });
    }

    await project.remove();

    res.json(project);
  } catch (error) {
    logger.error(error.message);
    if (error.kind === 'ObjectId') {
      res.status(404).send({ msg: 'Project not found!' });
    }
    res.status(500).send({ errors: [{ msg: 'server error' }] });
  }
});

// @route   PUT api/admin/projects/:id
// @desc    update a project by id
// @access  Private
router.put('/:id', authAdmin, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404).send({ msg: 'Project not found!' });
    }

    const { name, description, status, noOfHours, cost } = req.body;

    if (name) {
      project.name = name;
    }
    if (description) {
      project.description = description;
    }
    if (status) {
      if (
        [
          TASK_STATUS.NOT_STARTED,
          TASK_STATUS.STARTED,
          TASK_STATUS.FINISHED,
        ].includes(status)
      ) {
        project.status = status;
      } else {
        throw new Error('Invalid status!');
      }
    }

    if (noOfHours) {
      project.noOfHours = noOfHours;
    }
    if (cost) {
      project.cost = cost;
    }

    await project.save();

    res.json(project);
  } catch (error) {
    logger.error(error.message);
    res.status(500).send({ errors: [{ msg: 'server error' }] });
  }
});

// @route   PUT api/admin/projects/:id/assign/:user_id
// @desc    assign a user to the project by user_id
// @access  Private
router.put('/:id/assign/:user_id', authAdmin, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404).send({ msg: 'Project not found!' });
    }
    const user = await User.findById(req.params.user_id);
    if (!user) {
      res.status(404).send({ msg: 'User not found!' });
    }

    project.users.unshift({ user: user.id });
    await project.save();

    res.json(project);
  } catch (error) {
    logger.error(error.message);
    res.status(500).send({ errors: [{ msg: 'server error' }] });
  }
});

// @route   GET api/admin/projects/:id/tasks
// @desc    Get all tasks under given project id
// @access  Private
router.get('/:id/tasks', authAdmin, async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.id }).sort({
      creationDate: -1,
    });

    res.json(tasks);
  } catch (error) {
    logger.error(error.message);
    res.status(500).send({ errors: [{ msg: 'server error' }] });
  }
});

module.exports = router;
