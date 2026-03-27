const Progress = require('../models/Progress');
const Course = require('../models/Course');
const Notification = require('../models/Notification');

// Get user progress for all courses
exports.getUserProgress = async (req, res) => {
  try {
    const progresses = await Progress.find({ userId: req.user.id });
    res.json(progresses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Mark chapter as completed
exports.completeChapter = async (req, res) => {
  try {
    const { courseId, chapterIndex } = req.body;
    
    let progress = await Progress.findOne({ userId: req.user.id, courseId });
    
    if (!progress) {
      progress = new Progress({
        userId: req.user.id,
        courseId,
        completedChapters: []
      });
    }
    
    // Check if chapter already completed
    if (!progress.completedChapters.includes(chapterIndex)) {
      progress.completedChapters.push(chapterIndex);
      await progress.save();
      
      // Create notification
      const course = await Course.findById(courseId);
      const notification = new Notification({
        userId: req.user.id,
        message: `Congratulations! You completed chapter ${chapterIndex + 1}: ${course.chapters[chapterIndex].title}`
      });
      await notification.save();
    }
    
    res.json({ msg: 'Chapter completed!', progress });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get progress for specific course
exports.getCourseProgress = async (req, res) => {
  try {
    const progress = await Progress.findOne({ userId: req.user.id, courseId: req.params.courseId });
    res.json(progress || { completedChapters: [] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};