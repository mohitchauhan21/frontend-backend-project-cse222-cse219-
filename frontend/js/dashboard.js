const user = JSON.parse(localStorage.getItem('user'));

document.addEventListener('DOMContentLoaded', () => {
    if (!user) {
        window.location.href = 'index.html';
        return;
    }
    initDashboard();
    if (Notification.permission !== 'granted') {
        Notification.requestPermission();
    }
});

async function initDashboard() {
    const container = document.getElementById('dashboard-content');
    if (user.role === 'doctor') {
        renderDoctorView(container);
    } else if (user.role === 'caregiver') {
        renderCaregiverView(container);
    } else {
        renderPatientView(container);
    }
    lucide.createIcons();
}

// --- PATIENT VIEW ---
async function renderPatientView(container) {
    const now = new Date();
    const timeDisplay = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const greeting = now.getHours() < 12 ? 'Good Morning' : now.getHours() < 17 ? 'Good Afternoon' : 'Good Evening';

    container.innerHTML = `
        <header class="flex justify-between items-start mb-8">
            <div>
                <h1 class="text-4xl font-display font-bold text-slate-900">${greeting}</h1>
                <p class="text-xl text-slate-500 font-medium">${user.name} • ${timeDisplay}</p>
            </div>
            <div class="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-primary cursor-pointer hover:bg-sky-200" onclick="window.location.href='profile.html'">
                <i data-lucide="user"></i>
            </div>
        </header>

        <div id="next-dose-container"></div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div class="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
                <h3 class="font-bold text-slate-400 uppercase text-xs tracking-widest mb-4">Daily Progress</h3>
                <div class="flex items-end gap-2 mb-2">
                    <span id="progress-text" class="text-4xl font-display font-bold text-primary">0/0</span>
                    <span class="text-slate-400 font-bold pb-1 text-sm">Taken</span>
                </div>
                <div class="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div id="progress-bar" class="h-full bg-secondary transition-all duration-1000" style="width: 0%"></div>
                </div>
            </div>
            <div id="alert-container" class="hidden"></div>
        </div>

        <h3 class="text-2xl font-display font-bold mb-6 ml-2 text-slate-800">Today's Schedule</h3>
        <div id="schedule-list" class="space-y-4"></div>
    `;

    try {
        const [meds, logs] = await Promise.all([
            apiFetch('/medicines'),
            apiFetch('/logs')
        ]);

        const todayLogs = logs.filter(log => new Date(log.date).toDateString() === now.toDateString());
        const medsWithStatus = meds.map(med => {
            const log = todayLogs.find(l => l.medicine && l.medicine._id === med._id);
            return { ...med, status: log ? log.status : 'upcoming' };
        });

        const takenCount = medsWithStatus.filter(m => m.status === 'taken').length;
        const totalCount = medsWithStatus.length;
        document.getElementById('progress-text').textContent = `${takenCount}/${totalCount}`;
        document.getElementById('progress-bar').style.width = `${totalCount > 0 ? (takenCount / totalCount) * 100 : 0}%`;

        // Notification Check
        const upcoming = medsWithStatus.filter(m => m.status === 'upcoming');
        if (upcoming[0]) {
            const nextMed = upcoming[0];
            const nextDoseContainer = document.getElementById('next-dose-container');
            nextDoseContainer.innerHTML = `
                <div class="bg-gradient-to-br from-primary to-sky-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-sky-200 mb-10 relative overflow-hidden">
                    <div class="relative z-10">
                        <div class="flex items-center gap-2 mb-4">
                            <span class="bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md">NEXT ACTION</span>
                            <span class="text-sky-100 text-sm font-medium">Due at ${nextMed.time}</span>
                        </div>
                        <h2 class="text-5xl font-display font-bold mb-2">${nextMed.name}</h2>
                        <p class="text-xl text-sky-100 mb-8 font-medium">${nextMed.dosage || '1 Tablet'}</p>
                        <div class="flex gap-4">
                            <button onclick="logMed('${nextMed._id}', 'taken')" class="flex-1 bg-white text-primary py-5 rounded-2xl font-bold text-xl shadow-lg flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
                                <i data-lucide="check-circle"></i> I Took It
                            </button>
                            <button onclick="logMed('${nextMed._id}', 'skipped')" class="px-8 bg-black/10 text-white border border-white/20 py-5 rounded-2xl font-bold flex items-center justify-center hover:bg-black/20 transition-all">
                                Skip
                            </button>
                        </div>
                    </div>
                    <i data-lucide="pill" class="absolute -right-12 -bottom-12 w-64 h-64 opacity-10 rotate-12"></i>
                </div>
            `;
        } else {
            document.getElementById('next-dose-container').innerHTML = `
                <div class="bg-emerald-500 rounded-[2.5rem] p-8 text-white shadow-xl shadow-emerald-100 mb-10 text-center">
                    <h2 class="text-3xl font-display font-bold mb-2">All Clear! 🎉</h2>
                    <p class="text-emerald-50 font-medium">No more doses scheduled for today.</p>
                </div>
            `;
        }

        const list = document.getElementById('schedule-list');
        list.innerHTML = '';
        medsWithStatus.forEach(med => {
            const card = document.createElement('div');
            const isTaken = med.status === 'taken';
            const isSkipped = med.status === 'skipped';
            card.className = `bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex justify-between items-center transition-all ${isTaken || isSkipped ? 'opacity-60' : ''}`;
            card.innerHTML = `
                <div class="flex items-center gap-5">
                    <div class="w-16 h-16 rounded-2xl ${isTaken ? 'bg-emerald-50 text-emerald-500' : isSkipped ? 'bg-rose-50 text-rose-500' : 'bg-sky-50 text-sky-500'} flex items-center justify-center">
                        <i data-lucide="${isTaken ? 'check' : isSkipped ? 'x' : 'pill'}"></i>
                    </div>
                    <div>
                        <h4 class="font-bold text-xl text-slate-800">${med.name}</h4>
                        <p class="text-slate-400 font-medium text-sm">${med.time} • ${med.dosage || ''}</p>
                    </div>
                </div>
                <div>
                    ${med.status === 'upcoming' ? `
                        <div class="flex gap-2">
                            <button onclick="logMed('${med._id}', 'taken')" class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all"><i data-lucide="check" class="w-4 h-4"></i></button>
                            <button onclick="logMed('${med._id}', 'skipped')" class="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"><i data-lucide="x" class="w-4 h-4"></i></button>
                        </div>
                    ` : `
                        <span class="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest ${isTaken ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}">${med.status}</span>
                    `}
                </div>
            `;
            list.appendChild(card);
        });
        lucide.createIcons();
    } catch (err) { console.error(err); }
}

// --- CAREGIVER VIEW ---
async function renderCaregiverView(container) {
    container.innerHTML = `
        <header class="flex justify-between items-center mb-8">
            <div>
                <p class="text-primary font-bold uppercase tracking-widest text-xs mb-1">Caregiver Portal</p>
                <h1 class="text-3xl font-display font-bold text-slate-800">Patient Monitoring</h1>
            </div>
            <button onclick="linkPatient()" class="bg-primary/10 text-primary px-4 py-2 rounded-xl font-bold text-sm border border-primary/20">+ Link Patient</button>
        </header>

        <div class="grid grid-cols-2 gap-4 mb-8">
            <div class="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                <p class="text-xs text-slate-400 font-bold uppercase mb-2">Total Patients</p>
                <h3 id="patient-count" class="text-3xl font-display font-bold text-primary">0</h3>
            </div>
            <div class="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                <p class="text-xs text-slate-400 font-bold uppercase mb-2">Today's Risk</p>
                <h3 id="risk-status" class="text-3xl font-display font-bold text-emerald-500 text-sm">Low</h3>
            </div>
        </div>

        <div class="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 mb-8">
            <h3 class="font-bold text-xl mb-6 text-slate-700">Weekly Performance</h3>
            <div class="h-64"><canvas id="caregiverChart"></canvas></div>
        </div>

        <div id="patient-monitoring-list" class="space-y-6">
            <h3 class="font-bold text-xl ml-2 text-slate-800">Patients Under Care</h3>
        </div>
    `;

    try {
        const patients = await apiFetch('/users/my-patients');
        document.getElementById('patient-count').textContent = patients.length;
        const list = document.getElementById('patient-monitoring-list');

        if (patients.length > 0) {
            const stats = await apiFetch(`/logs/stats/${patients[0]._id}`);
            initCaregiverChart(stats);

            for (const patient of patients) {
                const logs = await apiFetch('/logs');
                const patientLogs = logs.filter(l => l.user === patient._id || (l.user && l.user._id === patient._id));
                const missed = patientLogs.filter(l => l.status === 'skipped').length;
                
                const card = document.createElement('div');
                card.className = 'bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-6';
                card.innerHTML = `
                    <div class="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center border-4 border-white shadow-sm overflow-hidden text-slate-400">
                        <i data-lucide="user" class="w-10 h-10"></i>
                    </div>
                    <div class="flex-1 text-center md:text-left">
                        <h4 class="font-bold text-2xl text-slate-800">${patient.name}</h4>
                        <p class="text-slate-400 font-medium">Last 24h: <span class="${missed > 0 ? 'text-rose-500' : 'text-emerald-500'} font-bold">${missed > 0 ? missed + ' Missed' : '100% Adherence'}</span></p>
                    </div>
                    <div class="flex gap-2 w-full md:w-auto">
                        <button onclick="window.location.href='tel:123'" class="flex-1 md:flex-none bg-emerald-50 text-emerald-600 px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-500 hover:text-white transition-all"><i data-lucide="phone"></i> Call</button>
                        <button class="flex-1 md:flex-none bg-primary/10 text-primary px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all"><i data-lucide="bell"></i> Notify</button>
                    </div>
                `;
                list.appendChild(card);
            }
        } else {
            list.innerHTML += '<div class="bg-white p-8 rounded-[2rem] text-center text-slate-400">No patients linked yet.</div>';
        }
        lucide.createIcons();
    } catch (err) { console.error(err); }
}

async function linkPatient() {
    const email = prompt('Enter patient email address:');
    if (email) {
        try {
            await apiFetch('/users/link-patient', { method: 'POST', body: JSON.stringify({ email }) });
            initDashboard();
        } catch (err) { alert('Patient not found or already linked'); }
    }
}

function initCaregiverChart(data) {
    const ctx = document.getElementById('caregiverChart');
    if (!ctx) return;
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(s => s.day),
            datasets: [{ label: 'Adherence %', data: data.map(s => s.percentage), backgroundColor: '#0ea5e9', borderRadius: 12 }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 100 }, x: { grid: { display: false } } } }
    });
}

// --- DOCTOR VIEW ---
async function renderDoctorView(container) {
    container.innerHTML = `
        <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
            <div>
                <h1 class="text-4xl font-display font-bold text-slate-900">Clinic Overview</h1>
                <p class="text-lg text-slate-500 font-medium font-display">Medical Director: ${user.name}</p>
            </div>
            <button onclick="addNewPrescription()" class="bg-primary text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-sky-100 flex items-center gap-2 hover:scale-105 transition-all">
                <i data-lucide="plus"></i> New Prescription
            </button>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div class="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <div class="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center text-primary mb-6"><i data-lucide="users"></i></div>
                <p class="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">Clinic Patients</p>
                <h3 id="doc-patient-count" class="text-4xl font-display font-bold text-slate-800">...</h3>
            </div>
            <div class="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <div class="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 mb-6"><i data-lucide="activity"></i></div>
                <p class="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">Global Adherence</p>
                <h3 class="text-4xl font-display font-bold text-emerald-500">92.4%</h3>
            </div>
            <div class="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <div class="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mb-6"><i data-lucide="alert-triangle"></i></div>
                <p class="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">Critical Alerts</p>
                <h3 class="text-4xl font-display font-bold text-rose-500">2</h3>
            </div>
        </div>

        <div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <div class="p-8 border-b border-slate-50">
                <h3 class="font-bold text-2xl text-slate-800">Patient Directory</h3>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-slate-50/50 text-slate-400 text-xs font-bold uppercase tracking-widest">
                        <tr><th class="px-8 py-5 text-left">Details</th><th class="px-8 py-5 text-left">Meds</th><th class="px-8 py-5 text-left">Status</th><th class="px-8 py-5 text-right">Action</th></tr>
                    </thead>
                    <tbody id="doctor-patient-list" class="divide-y divide-slate-50"></tbody>
                </table>
            </div>
        </div>
    `;

    try {
        const patients = await apiFetch('/users/patients');
        document.getElementById('doc-patient-count').textContent = patients.length;
        const list = document.getElementById('doctor-patient-list');
        list.innerHTML = '';

        patients.forEach(patient => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-slate-50/50 transition-all';
            row.innerHTML = `
                <td class="px-8 py-6"><div class="flex items-center gap-4"><div class="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">${patient.name[0]}</div><div><p class="font-bold text-slate-800">${patient.name}</p><p class="text-xs text-slate-400 font-medium">${patient.email}</p></div></div></td>
                <td class="px-8 py-6"><span class="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase">Active</span></td>
                <td class="px-8 py-6"><div class="flex items-center gap-2"><div class="w-2 h-2 rounded-full bg-emerald-500"></div><span class="text-emerald-500 text-sm font-bold">Stable</span></div></td>
                <td class="px-8 py-6 text-right"><button class="text-primary font-bold text-sm hover:underline">View File</button></td>
            `;
            list.appendChild(row);
        });
        lucide.createIcons();
    } catch (err) { console.error(err); }
}

async function addNewPrescription() {
    const patientEmail = prompt('Enter Patient Email:');
    const medName = prompt('Medicine Name:');
    const dosage = prompt('Dosage:');
    const time = prompt('Time (e.g. 10:00 AM):');

    if (patientEmail && medName && time) {
        try {
            const patients = await apiFetch('/users/patients');
            const patient = patients.find(p => p.email === patientEmail);
            if (!patient) { alert('Patient not found'); return; }

            await apiFetch('/medicines', {
                method: 'POST',
                body: JSON.stringify({ name: medName, dosage, time, user: patient._id, frequency: 'Daily' })
            });
            alert('Prescription added successfully!');
            initDashboard();
        } catch (err) { alert('Failed to add prescription'); }
    }
}

async function logMed(id, status) {
    try {
        await apiFetch('/logs', { method: 'POST', body: JSON.stringify({ medicineId: id, status }) });
        initDashboard();
        if (status === 'taken') {
            new Notification('MedRemind: Success!', { body: 'Your dose has been logged. Great job!', icon: 'favicon.ico' });
        }
    } catch (err) { console.error(err); }
}
