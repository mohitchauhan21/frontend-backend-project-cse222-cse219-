const express = require('express');
const router = express.Router();
const { getDoctors, createDoctor, updateDoctor, deleteDoctor, getDoctorStats } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

// All routes here require being an admin
router.use(protect);
router.use(adminOnly);

router.get('/doctors', getDoctors);
router.post('/doctors', createDoctor);
router.put('/doctors/:id', updateDoctor);
router.delete('/doctors/:id', deleteDoctor);
router.get('/doctors/:id/stats', getDoctorStats);

module.exports = router;
