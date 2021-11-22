const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const authAdmin = require('../../../middleware/authAdmin');
const logger = require('../../../config/logger');

const User = require('../../models/User');
const Project = require('../../models/Project');
const Task = require('../../models/Task');
const { TASK_STATUS, TASK_TYPE } = require('../../../config/conf');

// @route   POST api/admin/tasks
// @desc    Create a task
// @access  Private
router.post(
  '/',
  [
    authAdmin,
    [
      check('name', 'name is required!').not().isEmpty(),
      check('startDate', 'startDate is required!').not().isEmpty(),
      check('endDate', 'endDate is required!').not().isEmpty(),
      check('hourlyRate', 'status is required!').not().isEmpty(),
      check('type', 'type is required!').not().isEmpty(),
      check('user', 'user is required!').not().isEmpty(),
      check('project', 'project is required!').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const {
        name,
        description,
        startDate,
        endDate,
        hourlyRate,
        user,
        project,
        prerequisites,
        type,
      } = req.body;

      const projectToAssign = await Project.findById(project);
      const userToAssign = await User.findById(user);

      const newTaskParams = {};
      newTaskParams.name = name;
      newTaskParams.startDate = startDate;
      newTaskParams.endDate = endDate;
      newTaskParams.status = TASK_STATUS.NOT_STARTED;
      newTaskParams.hourlyRate = hourlyRate;
      newTaskParams.user = userToAssign;
      newTaskParams.project = projectToAssign;
      newTaskParams.prerequisites = [];

      if ([TASK_TYPE.NORMAL_TASK, TASK_TYPE.MANDATORY_TASK].includes(type)) {
        newTaskParams.type = type;
      } else {
        throw new Error('Invalid task type!');
      }

      if (description) {
        newTaskParams.description = description;
      }
      if (prerequisites) {
        for (let index = 0; index < prerequisites.length; index++) {
          let entry = prerequisites[index];
          let TaskToAssign = await Task.findById(entry);
          newTaskParams.prerequisites.push(TaskToAssign);
        }
      }

      const newTask = new Task(newTaskParams);
      const task = await newTask.save();

      res.json(task);
    } catch (error) {
      logger.error(error.message);
      res.status(500).send({ errors: [{ msg: 'server error' }] });
    }
  }
);

// @route   GET api/admin/tasks
// @desc    Get all tasks
// @access  Private
router.get('/', authAdmin, async (req, res) => {
  try {
    const tasks = await Task.find().sort({ creationDate: -1 });
    res.json(tasks);
  } catch (error) {
    logger.error(error.message);
    res.status(500).send({ errors: [{ msg: 'server error' }] });
  }
});

// @route   GET api/admin/tasks/:id
// @desc    Get tasks by id
// @access  Private
router.get('/:id', authAdmin, async (req, res) => {
  try {
    const tasks = await Task.findById(req.params.id);

    if (!tasks) {
      res.status(404).send({ msg: 'Project not found!' });
    }
    res.json(tasks);
  } catch (error) {
    logger.error(error.message);
    if (error.kind === 'ObjectId') {
      res.status(404).send({ msg: 'Project not found!' });
    }
    res.status(500).send({ errors: [{ msg: 'server error' }] });
  }
});

// @route   Delete api/admin/tasks/:id
// @desc    Delete a tasks by id
// @access  Private
router.delete('/:id', authAdmin, async (req, res) => {
  try {
    const tasks = await Task.findById(req.params.id);
    if (!tasks) {
      res.status(404).send({ msg: 'tasks not found!' });
    }

    await tasks.remove();

    res.json(tasks);
  } catch (error) {
    logger.error(error.message);
    if (error.kind === 'ObjectId') {
      res.status(404).send({ msg: 'Project not found!' });
    }
    res.status(500).send({ errors: [{ msg: 'server error' }] });
  }
});

// @route   PUT api/admin/tasks/:id
// @desc    update a task by id
// @access  Private
router.put('/:id', authAdmin, async (req, res) => {
  try {
    const tasks = await Task.findById(req.params.id);
    if (!tasks) {
      res.status(404).send({ msg: 'Task not found!' });
    }

    const {
      name,
      description,
      startDate,
      endDate,
      hourlyRate,
      user,
      project,
      prerequisites,
      cost,
      status,
      noOfHours,
      type,
    } = req.body;

    if (name) {
      tasks.name = name;
    }

    if (description) {
      tasks.description = description;
    }

    if (startDate) {
      tasks.startDate = startDate;
    }

    if (endDate) {
      tasks.endDate = endDate;
    }

    if (hourlyRate) {
      tasks.hourlyRate = hourlyRate;
    }

    if (user) {
      const userToAssign = await User.findById(user);
      tasks.user = userToAssign;
    }
    if (project) {
      const projectToAssign = await Project.findById(project);
      tasks.project = projectToAssign;
    }
    if (hourlyRate) {
      tasks.hourlyRate = hourlyRate;
    }

    if (prerequisites) {
      tasks.prerequisites = [];

      for (let index = 0; index < prerequisites.length; index++) {
        let entry = prerequisites[index];
        let TaskToAssign = await Task.findById(entry);
        tasks.prerequisites.push(TaskToAssign);
      }
    }

    if (type) {
      if ([TASK_TYPE.NORMAL_TASK, TASK_TYPE.MANDATORY_TASK].includes(type)) {
        tasks.type = type;
      } else {
        throw new Error('Invalid task type!');
      }
    }

    // TODO:  automatically update to project
    if (noOfHours) {
      tasks.noOfHours = noOfHours;
    }

    // TODO:  automatically calculate the cost
    // TODO:  automatically update to project
    if (cost) {
      tasks.cost = cost;
    }

    if (status) {
      // TODO:  for first task - update project status to started
      // TODO:  for last task - update project status to started
      // TODO:  if pre-requisite tasks are not complete - cant start
      if (
        [
          TASK_STATUS.NOT_STARTED,
          TASK_STATUS.STARTED,
          TASK_STATUS.FINISHED,
        ].includes(status)
      ) {
        tasks.status = status;
      } else {
        throw new Error('Invalid status!');
      }
    }

    await tasks.save();

    res.json(tasks);
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

module.exports = router;
