const medicineList = document.getElementById('medicine-list');
const addMedicineBtn = document.getElementById('add-medicine-btn');

document.addEventListener('DOMContentLoaded', loadMedicines);

async function loadMedicines() {
    medicineList.innerHTML = '<div class="p-8 text-center text-slate-400">Loading medicines...</div>';
    try {
        const medicines = await apiFetch('/medicines');
        medicineList.innerHTML = '';

        if (medicines.length === 0) {
            medicineList.innerHTML = '<div class="p-8 text-center text-slate-400">No medicines found. Click "+ Add New" to start.</div>';
            return;
        }

        medicines.forEach(med => {
            const card = document.createElement('div');
            card.className = 'p-6 hover:bg-slate-50 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4';
            card.innerHTML = `
                <div class="flex items-center gap-4">
                    <div class="w-14 h-14 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-500">
                        <i data-lucide="pill"></i>
                    </div>
                    <div>
                        <h4 class="font-bold text-lg">${med.name}</h4>
                        <p class="text-slate-500 text-sm font-medium">${med.dosage || 'No dosage'} • ${med.time} • ${med.frequency}</p>
                    </div>
                </div>
                <div class="flex gap-2 w-full md:w-auto">
                    <button onclick="deleteMedicine('${med._id}')" class="flex-1 md:flex-none py-2 px-4 rounded-xl bg-rose-50 text-rose-600 font-bold hover:bg-rose-500 hover:text-white transition-all text-sm">
                        Remove
                    </button>
                </div>
            `;
            medicineList.appendChild(card);
        });
        lucide.createIcons();
    } catch (err) {
        medicineList.innerHTML = '<div class="p-8 text-center text-rose-500">Error loading medicines.</div>';
    }
}

addMedicineBtn.addEventListener('click', () => {
    const name = prompt('Medicine Name:');
    const dosage = prompt('Dosage:');
    const time = prompt('Time (e.g. 08:00 AM):');
    const frequency = prompt('Frequency (e.g. Daily):');

    if (name && time) {
        saveMedicine({ name, dosage, time, frequency });
    }
});

async function saveMedicine(data) {
    try {
        const res = await apiFetch('/medicines', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        if (res._id) {
            loadMedicines();
        } else {
            alert(res.msg || 'Failed to add medicine');
        }
    } catch (err) {
        alert('Error adding medicine');
    }
}

async function deleteMedicine(id) {
    if (!confirm('Are you sure you want to remove this medicine?')) return;
    try {
        await apiFetch(`/medicines/${id}`, { method: 'DELETE' });
        loadMedicines();
    } catch (err) {
        alert('Error deleting medicine');
    }
}
