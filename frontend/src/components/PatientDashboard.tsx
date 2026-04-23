import React, { useEffect, useState } from 'react';
import { Clock, CheckCircle2, XCircle, Activity, Bell } from 'lucide-react';
import api from '../services/api';

const PatientDashboard: React.FC = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeds = async () => {
      try {
        const res = await api.get('/medicines');
        setMedicines(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMeds();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <header className="flex justify-between items-center py-4">
        <div>
          <p className="text-slate-500 font-medium">Hello, 👋</p>
          <h1 className="text-3xl font-display">Daily Schedule</h1>
        </div>
        <button className="p-2 rounded-full bg-white shadow-sm text-slate-400">
          <Bell size={24} />
        </button>
      </header>

      {/* Next Dose Highlight */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-primary-100 font-medium">Next Dose in 12 min</p>
          <h2 className="text-4xl my-2">Paracetamol</h2>
          <p className="text-primary-500 bg-white/20 inline-block px-3 py-1 rounded-full text-sm font-bold backdrop-blur-sm">
            500mg • 08:00 AM
          </p>
        </div>
        <Clock size={120} className="absolute -right-8 -bottom-8 opacity-20" />
      </div>

      {/* Progress */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold flex items-center gap-2">
            <Activity className="text-secondary-500" size={20} />
            Today's Adherence
          </h3>
          <span className="text-primary-600 font-bold">75%</span>
        </div>
        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-secondary-500 rounded-full w-[75%]" />
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold px-2">Upcoming Medicines</h3>
        {loading ? (
          <p>Loading...</p>
        ) : medicines.map((med: any) => (
          <div key={med._id} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex justify-between items-center group transition-all hover:border-primary-500">
            <div className="flex gap-4 items-center">
               <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600">
                 <Clock size={24} />
               </div>
               <div>
                 <h4 className="text-lg">{med.name}</h4>
                 <p className="text-slate-400 text-sm">{med.dosage} • {med.time}</p>
               </div>
            </div>
            <div className="flex gap-2">
               <button className="w-12 h-12 rounded-2xl bg-secondary-50 text-secondary-600 flex items-center justify-center transition-colors hover:bg-secondary-500 hover:text-white">
                 <CheckCircle2 size={24} />
               </button>
               <button className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center transition-colors hover:bg-red-500 hover:text-white">
                 <XCircle size={24} />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientDashboard;
