import React from 'react';
import { Users, AlertCircle, TrendingUp, PhoneCall, UserCheck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const CaregiverDashboard: React.FC = () => {
  const data = [
    { name: 'Mon', val: 90 },
    { name: 'Tue', val: 85 },
    { name: 'Wed', val: 100 },
    { name: 'Thu', val: 95 },
    { name: 'Fri', val: 80 },
    { name: 'Sat', val: 90 },
    { name: 'Sun', val: 92 },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <header className="py-4">
         <p className="text-primary-600 font-bold uppercase tracking-wider text-xs">Caregiver Portal</p>
         <h1 className="text-3xl">Patient Monitoring</h1>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {[
           { label: 'Overall Adherence', val: '94%', color: 'text-secondary-500', icon: TrendingUp },
           { label: 'Doses Taken', val: '124', color: 'text-primary-500', icon: UserCheck },
           { label: 'Missed Today', val: '0', color: 'text-red-500', icon: AlertCircle },
           { label: 'Active Patients', val: '2', color: 'text-indigo-500', icon: Users },
         ].map((stat, i) => (
           <div key={i} className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
             <stat.icon className={`${stat.color} mb-2`} size={20} />
             <p className="text-xs text-slate-400 font-bold uppercase">{stat.label}</p>
             <h3 className={`text-2xl ${stat.color}`}>{stat.val}</h3>
           </div>
         ))}
      </div>

      {/* Charts */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="text-xl mb-6">Weekly Adherence Trend</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
              <Bar dataKey="val" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Patient List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
           <h3 className="text-xl">Patients Under Care</h3>
           <button className="text-primary-600 font-bold text-sm">+ Add Patient</button>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                <img src="https://ui-avatars.com/api/?name=John+Doe&background=random" alt="User" />
              </div>
              <div>
                <h4 className="text-lg font-bold">John Doe (Father)</h4>
                <p className="text-sm text-slate-400">Last medicine taken at 08:00 AM</p>
              </div>
           </div>
           <div className="flex gap-2 w-full md:w-auto">
              <button className="flex-1 md:flex-none py-3 px-6 rounded-2xl bg-primary-50 text-primary-600 font-bold flex items-center justify-center gap-2">
                <Activity size={18} /> View Stats
              </button>
              <button className="flex-1 md:flex-none py-3 px-6 rounded-2xl bg-red-50 text-red-600 font-bold flex items-center justify-center gap-2">
                <PhoneCall size={18} /> Emergency
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CaregiverDashboard;
