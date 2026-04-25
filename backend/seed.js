const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Medicine = require('./models/Medicine');
const Log = require('./models/Log');

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding...');

        // Clear existing data
        await User.deleteMany();
        await Medicine.deleteMany();
        await Log.deleteMany();

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        // 1. Create Patient
        const patient = await User.create({
            name: 'John Patient',
            email: 'patient@example.com',
            password: hashedPassword,
            role: 'patient',
            age: 65,
            doctorName: 'Dr. Smith'
        });

        // 2. Create Caregiver
        const caregiver = await User.create({
            name: 'Sarah Caregiver',
            email: 'caregiver@example.com',
            password: hashedPassword,
            role: 'caregiver',
            patientIds: [patient._id]
        });

        // 3. Create Doctor
        const doctor = await User.create({
            name: 'Dr. James Smith',
            email: 'doctor@example.com',
            password: hashedPassword,
            role: 'doctor'
        });

        // 4. Create Admin
        const admin = await User.create({
            name: 'System Administrator',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin'
        });

        // 4. Create Sample Medicines for Patient
        const med1 = await Medicine.create({
            user: patient._id,
            name: 'Aspirin',
            dosage: '100mg',
            time: '08:00 AM',
            frequency: 'Daily'
        });

        const med2 = await Medicine.create({
            user: patient._id,
            name: 'Metformin',
            dosage: '500mg',
            time: '12:00 PM',
            frequency: 'Daily'
        });

        const med3 = await Medicine.create({
            user: patient._id,
            name: 'Lisinopril',
            dosage: '10mg',
            time: '08:00 PM',
            frequency: 'Daily'
        });

        // 5. Create Sample Logs
        await Log.create({
            user: patient._id,
            medicine: med1._id,
            status: 'taken',
            date: new Date(new Date().setHours(8, 0, 0, 0))
        });

        await Log.create({
            user: patient._id,
            medicine: med2._id,
            status: 'skipped',
            date: new Date(new Date().setHours(12, 0, 0, 0))
        });

        console.log('Seeding Complete!');
        console.log('------------------');
        console.log('Credentials:');
        console.log('Patient: patient@example.com / password123');
        console.log('Caregiver: caregiver@example.com / password123');
        console.log('Doctor: doctor@example.com / password123');
        console.log('Admin: admin@example.com / password123');
        
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
