const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../../middleware/auth');
const logger = require('../../config/logger');

const Project = require('../models/Project');
const Task = require('../models/Task');
const { TASK_STATUS, TASK_TYPE } = require('../../config/conf');

// @route   GET api/tasks
// @desc    Get all tasks
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({
      creationDate: -1,
    });

    res.json(tasks);
  } catch (error) {
    logger.error(error.message);
    res.status(500).send({ errors: [{ msg: 'server error' }] });
  }
});

// @route   GET api/tasks/:id
// @desc    Get task by id
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404).send({ msg: 'Post not found!' });
    }
    if (!(task.user.toString() === req.user.id)) {
      throw new Error(`user might not have access to project`);
    }
    res.json(task);
  } catch (error) {
    logger.error(error.message);
    if (error.kind === 'ObjectId') {
      res.status(404).send({ msg: 'Post not found!' });
    }
    res.status(500).send({ errors: [{ msg: 'server error' }] });
  }
});

// @route   PUT api/tasks/:id/start
// @desc    Turn task status to start
// @access  Private
router.put('/:id/start', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404).send({ errors: [{ msg: 'Task not found!' }] });
    }
    if (!(task.user.toString() === req.user.id)) {
      throw new Error(`user might not have access to project`);
    }

    // check if all mandatory tasks for this user are completed
    const tasks = await Task.find({
      user: req.user.id,
      project: task.project.toString(),
    }).sort({ creationDate: -1 });

    if (!tasks) {
      res.status(404).send({
        errors: [{ msg: 'No tasks under current project for this user!' }],
      });
      return;
    }

    const mandatoryTasks = tasks.filter(
      (entry) => entry.type === TASK_TYPE.MANDATORY_TASK && entry.status !== TASK_STATUS.FINISHED
    );

    if (task.type === TASK_TYPE.NORMAL_TASK && mandatoryTasks.length > 0) {
      res
        .status(403)
        .send({ errors: [{ msg: 'please complete mandatory tasks first!' }] });
      return;
    }

    // if its already finished task then give error
    if (task.status === TASK_STATUS.FINISHED) {
      res
        .status(403)
        .send({ errors: [{ msg: 'can not start finished task!' }] });
      return;
    }

    // check if all pre-requisite tasks are finished

    if (task.prerequisites) {
      for (let index = 0; index < task.prerequisites.length; index++) {
        const preRequiredTask = task.prerequisites[index];

        const testTask = await Task.findById(preRequiredTask.id.toString());
        if (testTask.status !== TASK_STATUS.FINISHED) {
          res.status(403).send({
            errors: [{ msg: 'please complete pre-requisite tasks first!' }],
          });
          return;
        }
      }
    }

    task.status = TASK_STATUS.STARTED;
    task.actualStartDate = Date.now();

    await task.save();

    // update parent project status to started

    const project = await Project.findById(task.project.toString());
    project.status = TASK_STATUS.STARTED;
    await project.save();

    res.json(task);
  } catch (error) {
    logger.error(error.message);
    res.status(500).send({ errors: [{ msg: 'server error' }] });
  }
});

// @route   PUT api/tasks/:id/finish
// @desc    Turn task status to finish
// @access  Private
router.put(
  '/:id/finish',
  [auth, [check('noOfHours', 'noOfHours is required!').not().isEmpty()]],
  async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);

      if (!task) {
        res.status(404).send({ errors: [{ msg: 'Task not found!' }] });
      }
      if (!(task.user.toString() === req.user.id)) {
        throw new Error(`user might not have access to project`);
      }

      // check if all mandatory tasks for this user are completed
      const tasks = await Task.find({
        user: req.user.id,
        project: task.project.toString(),
      }).sort({ creationDate: -1 });

      if (!tasks) {
        res.status(404).send({
          errors: [{ msg: 'No tasks under current project for this user!' }],
        });
        return;
      }

      const mandatoryTasks = tasks.filter(
        (entry) => entry.type === TASK_TYPE.MANDATORY_TASK  && entry.status !== TASK_STATUS.FINISHED
      );

      if (task.type === TASK_TYPE.NORMAL_TASK && mandatoryTasks.length > 0) {
        res.status(403).send({
          errors: [{ msg: 'please complete mandatory tasks first!' }],
        });
        return;
      }

      // if its already finished task then give error
      if (task.status === TASK_STATUS.NOT_STARTED) {
        res.status(403).send({
          errors: [{ msg: 'you need to start task before finishing!' }],
        });
        return;
      }

      // calculate cost of ticket
      const { noOfHours } = req.body;
      const cost = parseFloat(noOfHours) * parseFloat(task.hourlyRate);
      task.cost = cost.toString();
      task.noOfHours = noOfHours;

      // check if all pre-requisite tasks are finished

      if (task.prerequisites) {
        for (let index = 0; index < task.prerequisites.length; index++) {
          const preRequiredTask = task.prerequisites[index];

          const testTask = await Task.findById(preRequiredTask.id.toString());
          if (testTask.status !== TASK_STATUS.FINISHED) {
            res.status(403).send({
              errors: [{ msg: 'please complete pre-requisite tasks first!' }],
            });
            return;
          }
        }
      }
      // update status
      task.status = TASK_STATUS.FINISHED;
      task.actualEndDate = Date.now();

      await task.save();

      // update cost and no of hours on project
      const project = await Project.findById(task.project.toString());
      project.noOfHours = (
        parseFloat(project.noOfHours) + parseFloat(noOfHours)
      ).toString();
      project.cost = (parseFloat(project.cost) + cost).toString();

      // update parent project status to finished if its a last ticket
      const allProjecttasks = await Task.find({
        project: task.project.toString(),
      }).sort({ creationDate: -1 });
      const notFinishedTasks = allProjecttasks.filter(
        (entry) =>
          entry.status === TASK_STATUS.NOT_STARTED ||
          entry.status === TASK_STATUS.STARTED
      );
      if (notFinishedTasks.length === 0) {
        project.status = TASK_STATUS.FINISHED;
      }
      await project.save();

      res.json(task);
    } catch (error) {
      logger.error(error.message);
      res.status(500).send({ errors: [{ msg: 'server error' }] });
    }
  }
);

module.exports = router;
