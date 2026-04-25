// Admin Logic - Handles Doctor CRUD and Clinical Records
let doctorList, doctorModal, doctorForm, addDoctorBtn, closeModal, modalTitle, passwordField;
let doctors = [];

const initAdmin = () => {
    doctorList = document.getElementById('doctor-list');
    doctorModal = document.getElementById('doctor-modal');
    doctorForm = document.getElementById('doctor-form');
    addDoctorBtn = document.getElementById('add-doctor-btn');
    closeModal = document.getElementById('close-modal');
    modalTitle = document.getElementById('modal-title');
    passwordField = document.getElementById('password-field');
    const closeDetails = document.getElementById('close-details');

    if (!doctorList || !addDoctorBtn) {
        setTimeout(initAdmin, 100);
        return;
    }

    addDoctorBtn.addEventListener('click', () => openModal('add'));
    closeModal.addEventListener('click', closeDoctorModal);
    if (closeDetails) closeDetails.addEventListener('click', () => document.getElementById('details-modal').classList.add('hidden'));
    
    doctorForm.addEventListener('submit', handleFormSubmit);
    fetchDoctors();
};

const fetchDoctors = async () => {
    try {
        const data = await apiFetch('/admin/doctors');
        doctors = data;
        renderDoctors();
    } catch (err) {
        if (doctorList) doctorList.innerHTML = `<div class="col-span-full text-center text-danger font-bold py-10">Error: ${err.message}</div>`;
    }
};

const renderDoctors = () => {
    if (!doctorList) return;
    if (doctors.length === 0) {
        doctorList.innerHTML = `<div class="col-span-full text-center py-20 text-slate-400">No doctors found. Click "Add New Doctor" to start.</div>`;
        return;
    }
    doctorList.innerHTML = doctors.map(doc => `
        <div class="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all group relative">
            <div class="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button onclick="editDoctor('${doc._id}')" class="p-2 bg-secondary text-white rounded-xl shadow-md hover:scale-110 active:scale-95 transition-all">
                    <i data-lucide="edit-3" class="w-4 h-4"></i>
                </button>
                <button onclick="deleteDoctor('${doc._id}')" class="p-2 bg-danger text-white rounded-xl shadow-md hover:scale-110 active:scale-95 transition-all">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
            </div>
            <div class="flex items-center gap-4 mb-6">
                <div class="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center border-2 border-white dark:border-slate-600 shadow-sm">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${doc.name}" class="w-12 h-12">
                </div>
                <div>
                    <h3 class="font-display font-black text-lg text-slate-800 dark:text-white">${doc.name}</h3>
                    <p class="text-xs font-bold text-primary uppercase tracking-widest">Medical Doctor</p>
                </div>
            </div>
            <div class="space-y-4">
                <div class="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                    <i data-lucide="mail" class="w-4 h-4"></i>
                    <span class="text-sm font-medium">${doc.email}</span>
                </div>
                <button onclick="viewDoctorDetails('${doc._id}')" class="w-full py-3 bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 text-sm mt-2 border-b-4 border-slate-200 dark:border-slate-800 active:border-b-0 active:translate-y-1">
                    <i data-lucide="bar-chart-2" class="w-4 h-4"></i> View Clinical Record
                </button>
            </div>
        </div>
    `).join('');
    if (window.lucide) lucide.createIcons();
};

const handleFormSubmit = async (e) => {
    e.preventDefault();
    const id = document.getElementById('doctor-id').value;
    const name = document.getElementById('doc-name').value;
    const email = document.getElementById('doc-email').value;
    const password = document.getElementById('doc-password').value;

    const data = { name, email };
    if (password) data.password = password;

    try {
        const method = id ? 'PUT' : 'POST';
        const url = id ? `/admin/doctors/${id}` : '/admin/doctors';
        await apiFetch(url, { method, body: JSON.stringify(data) });
        closeDoctorModal();
        fetchDoctors();
    } catch (err) {
        alert(err.message);
    }
};

const openModal = (mode = 'add', docId = null) => {
    doctorModal.classList.remove('hidden');
    doctorForm.reset();
    document.getElementById('doctor-id').value = docId || '';
    if (mode === 'edit') {
        modalTitle.textContent = 'Edit Doctor';
        const doc = doctors.find(d => d._id === docId);
        if (doc) {
            document.getElementById('doc-name').value = doc.name;
            document.getElementById('doc-email').value = doc.email;
            passwordField.querySelector('input').removeAttribute('required');
            passwordField.querySelector('label').textContent = 'New Password (Optional)';
        }
    } else {
        modalTitle.textContent = 'Add Doctor';
        passwordField.querySelector('input').setAttribute('required', 'true');
        passwordField.querySelector('label').textContent = 'Password';
    }
};

const closeDoctorModal = () => doctorModal.classList.add('hidden');

window.editDoctor = (id) => openModal('edit', id);

window.deleteDoctor = async (id) => {
    if (confirm('Permanently remove this doctor?')) {
        try {
            await apiFetch(`/admin/doctors/${id}`, { method: 'DELETE' });
            fetchDoctors();
        } catch (err) { alert(err.message); }
    }
};

window.viewDoctorDetails = async (id) => {
    const detailsModal = document.getElementById('details-modal');
    const detailsContent = document.getElementById('doctor-details-content');
    detailsModal.classList.remove('hidden');
    detailsContent.innerHTML = `<div class="flex justify-center py-10"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>`;

    try {
        const stats = await apiFetch(`/admin/doctors/${id}/stats`);
        detailsContent.innerHTML = `
            <div class="grid grid-cols-2 gap-4">
                <div class="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-b-4 border-slate-200 dark:border-slate-700">
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Managed Patients</p>
                    <h4 class="text-3xl font-display font-black text-primary">${stats.patientCount}</h4>
                </div>
                <div class="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-b-4 border-slate-200 dark:border-slate-700">
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                    <h4 class="text-3xl font-display font-black text-secondary">Active</h4>
                </div>
            </div>
            <div>
                <h4 class="text-lg font-display font-black text-slate-700 dark:text-white mb-4">Patient Directory</h4>
                <div class="space-y-3">
                    ${stats.patients.length === 0 ? `<p class="text-slate-400 italic text-sm text-center">No patients assigned yet.</p>` : stats.patients.map(p => `
                        <div class="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl">
                            <div class="flex items-center gap-3">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${p.name}" class="w-10 h-10 rounded-xl bg-slate-50">
                                <div><p class="font-bold text-slate-800 dark:text-white">${p.name}</p><p class="text-[10px] text-slate-400 font-medium">${p.email}</p></div>
                            </div>
                            <span class="text-xs font-black text-slate-400 uppercase">${p.age || '??'} Yrs</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        if (window.lucide) lucide.createIcons();
    } catch (err) { detailsContent.innerHTML = `<p class="text-danger font-bold text-center">Error loading stats</p>`; }
};

document.addEventListener('DOMContentLoaded', initAdmin);
