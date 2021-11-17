const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  noOfHours: {
    type: String,
    default: '0',
  },
  hourlyRate: {
    type: String,
    required: true,
  },
  cost: {
    type: String,
    default: '0',
  },
  type: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: 'project',
    required: true,
  },
  prerequisites: [
    {
      task: {
        type: Schema.Types.ObjectId,
        ref: 'task',
      },
    },
  ],
  actualStartDate: {
    type: Date,
  },
  actualEndDate: {
    type: Date,
  },
});

const Task = mongoose.model('task', TaskSchema);
module.exports = Task;
