import React from 'react';
import { Users, FileText, Settings, Search, Filter } from 'lucide-react';

const DoctorDashboard: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-4">
        <div>
          <h1 className="text-3xl">Clinic Overview</h1>
          <p className="text-slate-500">Welcome back, Dr. Smith</p>
        </div>
        <button className="bg-primary-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-primary-500/20 flex items-center gap-2">
          <FileText size={20} /> New Prescription
        </button>
      </header>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
           <div className="p-4 bg-primary-50 rounded-2xl text-primary-600">
             <Users size={32} />
           </div>
           <div>
             <p className="text-sm text-slate-400 font-bold uppercase">Total Patients</p>
             <h3 className="text-3xl">1,284</h3>
           </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
           <div className="p-4 bg-secondary-50 rounded-2xl text-secondary-600">
             <Settings size={32} />
           </div>
           <div>
             <p className="text-sm text-slate-400 font-bold uppercase">System Health</p>
             <h3 className="text-3xl">Optimal</h3>
           </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
           <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600">
             <TrendingUp size={32} />
           </div>
           <div>
             <p className="text-sm text-slate-400 font-bold uppercase">Avg. Adherence</p>
             <h3 className="text-3xl">89.4%</h3>
           </div>
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
           <h3 className="text-xl">Patient Management</h3>
           <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="text" placeholder="Search patients..." className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <button className="p-2 bg-slate-50 rounded-xl text-slate-500">
                <Filter size={20} />
              </button>
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/50 text-slate-400 text-sm uppercase">
               <tr>
                 <th className="px-6 py-4 text-left">Patient</th>
                 <th className="px-6 py-4 text-left">Prescriptions</th>
                 <th className="px-6 py-4 text-left">Status</th>
                 <th className="px-6 py-4 text-left">Adherence</th>
                 <th className="px-6 py-4 text-right">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {[
                 { name: 'Alice Johnson', meds: 4, status: 'Active', rate: '92%', risk: 'Low' },
                 { name: 'Bob Wilson', meds: 2, status: 'Under Review', rate: '45%', risk: 'High' },
                 { name: 'Charlie Davis', meds: 6, status: 'Active', rate: '98%', risk: 'Low' },
               ].map((patient, i) => (
                 <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                   <td className="px-6 py-4">
                     <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-xs">
                         {patient.name[0]}
                       </div>
                       <span className="font-medium">{patient.name}</span>
                     </div>
                   </td>
                   <td className="px-6 py-4 text-slate-500">{patient.meds} Active</td>
                   <td className="px-6 py-4">
                     <span className={`px-3 py-1 rounded-full text-xs font-bold ${patient.status === 'Active' ? 'bg-secondary-50 text-secondary-600' : 'bg-amber-50 text-amber-600'}`}>
                       {patient.status}
                     </span>
                   </td>
                   <td className="px-6 py-4">
                     <div className="flex items-center gap-2">
                       <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                         <div className={`h-full rounded-full ${parseInt(patient.rate) > 80 ? 'bg-secondary-500' : 'bg-red-500'}`} style={{width: patient.rate}} />
                       </div>
                       <span className="text-sm font-bold">{patient.rate}</span>
                     </div>
                   </td>
                   <td className="px-6 py-4 text-right">
                     <button className="text-primary-600 font-bold text-sm">Review</button>
                   </td>
                 </tr>
               ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const TrendingUp = ({ size, className }: any) => <TrendingUpLucide size={size} className={className} />;
import { TrendingUp as TrendingUpLucide } from 'lucide-react';

export default DoctorDashboard;
