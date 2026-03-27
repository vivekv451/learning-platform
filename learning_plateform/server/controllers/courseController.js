const Course = require('../models/Course');

// Get all courses (with free chapters only for non-premium)
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    const isPremium = req.user?.premium || false;
    
    // If not premium, only show first 5 chapters per course
    const coursesWithLimitedChapters = courses.map(course => {
      const courseObj = course.toObject();
      if (!isPremium) {
        courseObj.chapters = courseObj.chapters.slice(0, 5);
      }
      return courseObj;
    });
    
    res.json(coursesWithLimitedChapters);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get single course details
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }
    
    const isPremium = req.user?.premium || false;
    const courseObj = course.toObject();
    
    if (!isPremium) {
      courseObj.chapters = courseObj.chapters.slice(0, 5);
    }
    
    res.json(courseObj);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Create course (admin only, for demo)
exports.createCourse = async (req, res) => {
  try {
    const { title, description, thumbnail, chapters } = req.body;
    
    const course = new Course({
      title,
      description,
      thumbnail,
      chapters
    });
    
    await course.save();
    res.json({ msg: 'Course created successfully', course });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};