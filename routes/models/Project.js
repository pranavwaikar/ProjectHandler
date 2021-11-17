const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    required: true,
  },
  noOfHours: {
    type: String,
    default: '0',
  },
  cost: {
    type: String,
    default: '0',
  },
  users: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

const Project = mongoose.model('project', ProjectSchema);
module.exports = Project;
