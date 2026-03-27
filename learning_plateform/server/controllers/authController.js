const User = require('../models/User');
const School = require('../models/School');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register student
exports.register = async (req, res) => {
  try {
    const { mobile, password, class: studentClass, city, schoolId } = req.body;
    
    // Check if user exists
    let user = await User.findOne({ mobile });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    let school = null;
    let approved = false;
    
    if (schoolId) {
      school = await School.findOne({ schoolId });
      if (!school) {
        return res.status(400).json({ msg: 'Invalid School ID' });
      }
      // Student needs approval
      approved = false;
    } else {
      // Skip school ID, auto-approved
      approved = true;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    user = new User({
      mobile,
      password: hashedPassword,
      class: studentClass,
      city,
      schoolId: school ? school._id : null,
      schoolIdNumber: schoolId || '',
      approved,
      premium: false
    });

    await user.save();

    // Create JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user.id, mobile: user.mobile, role: user.role, approved: user.approved } });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token, 
          user: { 
            id: user.id, 
            mobile: user.mobile, 
            role: user.role, 
            approved: user.approved,
            premium: user.premium,
            name: user.name,
            class: user.class,
            city: user.city,
            schoolIdNumber: user.schoolIdNumber
          } 
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get current user
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, class: studentClass, city } = req.body;
    const user = await User.findById(req.user.id);
    
    if (name) user.name = name;
    if (studentClass) user.class = studentClass;
    if (city) user.city = city;
    
    await user.save();
    res.json({ msg: 'Profile updated', user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Upgrade to premium with school ID
exports.upgradeToPremium = async (req, res) => {
  try {
    const { schoolId } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!schoolId) {
      return res.status(400).json({ msg: 'School ID is required' });
    }
    
    const school = await School.findOne({ schoolId });
    if (!school) {
      return res.status(400).json({ msg: 'Invalid School ID' });
    }
    
    // In a real app, integrate payment gateway here
    // For demo, we'll just set premium to true
    user.premium = true;
    user.schoolId = school._id;
    user.schoolIdNumber = schoolId;
    user.approved = true; // Auto-approve when paying
    
    await user.save();
    
    res.json({ msg: 'Successfully upgraded to premium!', premium: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};