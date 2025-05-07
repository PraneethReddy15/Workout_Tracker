// const mongoose = require('mongoose');

// const workoutSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   exercises: [{
//     name: {
//       type: String,
//       required: true
//     },
//     sets: {
//       type: Number,
//       required: true,
//       min:1
//     },
//     reps: {
//       type: Number,
//       required: true,
//       min:1
//     },
//     weight: {
//       type: Number,
//       default:0
//     }
//   }],
//   duration: {
//     type: Number
//   },
//   date: {
//     type: Date,
//     default: Date.now
//   },
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   }
// }, {
//   timestamps: true
// });

// const Workout = mongoose.model('Workout', workoutSchema);

// module.exports = Workout;
const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  workoutType: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: Number,
    required: true
  },
  intensity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  date: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    trim: true
  },
  bodyParts: [{
    type: String
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const Workout = mongoose.model('Workout', workoutSchema);
module.exports = Workout;
