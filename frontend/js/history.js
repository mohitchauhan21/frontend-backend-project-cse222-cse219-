document.addEventListener('DOMContentLoaded', loadHistory);

async function loadHistory() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '<div class="p-12 text-center text-slate-400">Loading history...</div>';

    try {
        const logs = await apiFetch('/logs');
        historyList.innerHTML = '';

        if (logs.length === 0) {
            historyList.innerHTML = `
                <div class="bg-white p-12 rounded-[2.5rem] shadow-sm border border-slate-100 text-center text-slate-400">
                    <p>No activity recorded yet.</p>
                </div>
            `;
            return;
        }

        logs.forEach(log => {
            const date = new Date(log.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
            const item = document.createElement('div');
            item.className = 'bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex justify-between items-center group hover:shadow-md transition-all';
            
            const statusClass = log.status === 'taken' ? 'text-emerald-500 bg-emerald-50' : 'text-rose-500 bg-rose-50';
            const icon = log.status === 'taken' ? 'check-circle' : 'alert-circle';

            item.innerHTML = `
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-2xl ${statusClass} flex items-center justify-center">
                        <i data-lucide="${icon}"></i>
                    </div>
                    <div>
                        <h4 class="font-bold text-slate-700">${log.medicine ? log.medicine.name : 'Unknown Medicine'}</h4>
                        <p class="text-xs text-slate-400 font-medium">${date}</p>
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    <div class="px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${statusClass}">
                        ${log.status}
                    </div>
                    <button onclick="deleteLog('${log._id}')" class="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                </div>
            `;
            historyList.appendChild(item);
        });
        lucide.createIcons();
    } catch (err) {
        historyList.innerHTML = '<div class="p-12 text-center text-rose-500">Error loading history.</div>';
    }
}

async function deleteLog(id) {
    if (!confirm('Remove this log entry?')) return;
    try {
        await apiFetch(`/logs/${id}`, { method: 'DELETE' });
        loadHistory();
    } catch (err) {
        alert('Error deleting log');
    }
}
