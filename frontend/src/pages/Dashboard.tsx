import React from 'react';
import { useAuthStore } from '../store/authStore';
import PatientDashboard from '../components/PatientDashboard';
import CaregiverDashboard from '../components/CaregiverDashboard';
import DoctorDashboard from '../components/DoctorDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <div className="min-h-screen pb-20">
      {user.role === 'patient' && <PatientDashboard />}
      {user.role === 'caregiver' && <CaregiverDashboard />}
      {user.role === 'doctor' && <DoctorDashboard />}
      
      {/* Bottom Nav for Mobile */}
      {user.role !== 'doctor' && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-3 md:hidden shadow-2xl">
           <button className="flex flex-col items-center text-primary-500">
             <span className="text-xs mt-1">Home</span>
           </button>
           <button className="flex flex-col items-center text-slate-400">
             <span className="text-xs mt-1">History</span>
           </button>
           <button className="flex flex-col items-center text-slate-400">
             <span className="text-xs mt-1">Profile</span>
           </button>
        </nav>
      )}
    </div>
  );
};

export default Dashboard;
