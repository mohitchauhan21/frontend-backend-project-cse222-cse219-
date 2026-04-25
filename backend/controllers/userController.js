const User = require('../models/User');

// @desc     Get all patients (for Doctors)
// @route    GET api/users/patients
// @access   Private (Doctor only)
exports.getPatients = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.role !== 'doctor') return res.status(403).json({ msg: 'Access denied' });
        
        const patients = await User.find({ role: 'patient' }).select('-password');
        res.json(patients);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc     Get patients linked to caregiver
// @route    GET api/users/my-patients
// @access   Private (Caregiver only)
exports.getMyPatients = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('patientIds', '-password');
        if (user.role !== 'caregiver') return res.status(403).json({ msg: 'Access denied' });
        
        res.json(user.patientIds);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc     Link a patient to caregiver
// @route    POST api/users/link-patient
// @access   Private (Caregiver only)
exports.linkPatient = async (req, res) => {
    try {
        const { email, diagnosis } = req.body;
        const user = await User.findById(req.user.id);
        if (user.role !== 'caregiver' && user.role !== 'doctor') return res.status(403).json({ msg: 'Access denied' });

        const patient = await User.findOne({ email, role: 'patient' });
        if (!patient) return res.status(404).json({ msg: 'Patient not found' });

        // Update diagnosis if provided
        if (diagnosis) {
            patient.diagnosis = diagnosis.trim();
            await patient.save();
        }

        // Link logic for caregivers
        if (user.role === 'caregiver') {
            if (!user.patientIds.includes(patient._id)) {
                user.patientIds.push(patient._id);
                await user.save();
            }
        }
        
        res.json({ msg: 'Patient linked successfully', patient });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc     Update user profile
// @route    PUT api/users/profile
// @access   Private
exports.updateProfile = async (req, res) => {
    try {
        const { name, age, specialty } = req.body;
        const updateFields = {};
        if (name) updateFields.name = name.trim();
        if (age) updateFields.age = parseInt(age);
        if (specialty) updateFields.specialty = specialty.trim();

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updateFields },
            { new: true }
        ).select('-password');

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc     Get user profile
// @route    GET api/users/profile
// @access   Private
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
