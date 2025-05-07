// const express = require('express');
// const router = express.Router();
// const Workout = require('../models/Workout');
// const auth = require('../middleware/auth');

// // Get all workouts for logged in user
// router.get('/', auth, async (req, res) => {
//   try {
//     const workouts = await Workout.find({ user: req.user.id }).sort({ date: -1 });
//     res.json(workouts);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Get single workout
// router.get('/:id', auth, async (req, res) => {
//   try {
//     const workout = await Workout.findById(req.params.id);
    
//     if (!workout) {
//       return res.status(404).json({ message: 'Workout not found' });
//     }
    
//     // Check if workout belongs to user
//     if (workout.user.toString() !== req.user.id) {
//       return res.status(401).json({ message: 'Not authorized' });
//     }
    
//     res.json(workout);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Create a workout
// router.post('/', auth, async (req, res) => {
//   try {
//     const { title, exercises, duration, date } = req.body;
    
//     const newWorkout = new Workout({
//       title,
//       exercises,
//       duration,
//       date,
//       user: req.user.id
//     });
    
//     const savedWorkout = await newWorkout.save();
//     res.status(201).json(savedWorkout);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Update workout
// router.put('/:id', auth, async (req, res) => {
//   try {
//     const { title, exercises, duration, date } = req.body;
    
//     // Find workout
//     let workout = await Workout.findById(req.params.id);
    
//     if (!workout) {
//       return res.status(404).json({ message: 'Workout not found' });
//     }
    
//     // Check if workout belongs to user
//     if (workout.user.toString() !== req.user.id) {
//       return res.status(401).json({ message: 'Not authorized' });
//     }
    
//     workout = await Workout.findByIdAndUpdate(
//       req.params.id,
//       { title, exercises, duration, date },
//       { new: true }
//     );
    
//     res.json(workout);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Delete workout
// router.delete('/:id', auth, async (req, res) => {
//   try {
//     const workout = await Workout.findById(req.params.id);
    
//     if (!workout) {
//       return res.status(404).json({ message: 'Workout not found' });
//     }
    
//     // Check if workout belongs to user
//     if (workout.user.toString() !== req.user.id) {
//       return res.status(401).json({ message: 'Not authorized' });
//     }
    
//     await workout.deleteOne();
//     res.json({ message: 'Workout removed' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');
const auth = require('../middleware/auth');

// Get all workouts for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 9, workoutType, startDate, endDate, intensity } = req.query;
const query = { user: req.user.id };

// Apply filters
if (workoutType) query.workoutType = { $regex: new RegExp(workoutType, 'i') };
if (intensity) query.intensity = intensity;
if (startDate || endDate) {
  query.date = {};
  if (startDate) query.date.$gte = new Date(startDate);
  if (endDate) query.date.$lte = new Date(endDate);
}

const total = await Workout.countDocuments(query);
const workouts = await Workout.find(query)
  .sort({ date: -1 })
  .skip((page - 1) * limit)
  .limit(parseInt(limit));

res.json({ workouts, total });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single workout
router.get('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) return res.status(404).json({ message: 'Workout not found' });
    if (workout.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });
    res.json(workout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a workout
router.post('/', auth, async (req, res) => {
  try {
    const { workoutType, duration, intensity, date, notes, bodyParts } = req.body;

    const newWorkout = new Workout({
      workoutType,
      duration,
      intensity,
      date,
      notes,
      bodyParts,
      user: req.user.id
    });

    const savedWorkout = await newWorkout.save();
    res.status(201).json(savedWorkout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update workout
router.put('/:id', auth, async (req, res) => {
  try {
    const { workoutType, duration, intensity, date, notes, bodyParts } = req.body;

    let workout = await Workout.findById(req.params.id);
    if (!workout) return res.status(404).json({ message: 'Workout not found' });
    if (workout.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    workout = await Workout.findByIdAndUpdate(
      req.params.id,
      { workoutType, duration, intensity, date, notes, bodyParts },
      { new: true }
    );

    res.json(workout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete workout
router.delete('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) return res.status(404).json({ message: 'Workout not found' });
    if (workout.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    await workout.deleteOne();
    res.json({ message: 'Workout removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
