const User = require('../models/User');
const School = require('../models/School');
const Notification = require('../models/Notification');

// Get pending students for a school
exports.getPendingStudents = async (req, res) => {
  try {
    const school = await School.findOne({ schoolId: req.params.schoolId });
    if (!school) {
      return res.status(404).json({ msg: 'School not found' });
    }
    
    const students = await User.find({ 
      schoolId: school._id, 
      approved: false,
      role: 'student'
    }).select('-password');
    
    res.json(students);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Approve student
exports.approveStudent = async (req, res) => {
  try {
    const student = await User.findById(req.params.studentId);
    if (!student) {
      return res.status(404).json({ msg: 'Student not found' });
    }
    
    student.approved = true;
    await student.save();
    
    // Create notification for student
    const notification = new Notification({
      userId: student._id,
      message: `Your registration has been approved by ${student.schoolIdNumber} school. You can now access all features!`
    });
    await notification.save();
    
    res.json({ msg: 'Student approved successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Verify school ID
exports.verifySchoolId = async (req, res) => {
  try {
    const { schoolId } = req.params;
    const school = await School.findOne({ schoolId });
    
    if (school) {
      res.json({ valid: true, name: school.name, city: school.city });
    } else {
      res.json({ valid: false });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Create school (admin only, for demo)
exports.createSchool = async (req, res) => {
  try {
    const { schoolId, name, city, fee } = req.body;
    
    const existingSchool = await School.findOne({ schoolId });
    if (existingSchool) {
      return res.status(400).json({ msg: 'School ID already exists' });
    }
    
    const school = new School({
      schoolId,
      name,
      city,
      fee: fee || 999
    });
    
    await school.save();
    res.json({ msg: 'School created successfully', school });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};