const fs = require('fs');
let code = fs.readFileSync('frontend/public/js/dashboard.js', 'utf8');

code = code.replace(
    /<th class="px-8 py-4 text-\[10px\] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Risk Level<\/th>/,
    '<th class="px-8 py-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Risk Level</th>\n                        <th class="px-8 py-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">Vitals (HR/BP)</th>'
);

code = code.replace(
    /const \[stats, logs\] = await Promise\.all\(\[/,
    'const [stats, logs, vitalsData] = await Promise.all(['
);

code = code.replace(
    /apiFetch\(`\/logs\/patient\/\$\{p\._id\}`\)\r?\n\s*\]\);/,
    'apiFetch(`/logs/patient/${p._id}`),\n                apiFetch(`/vitals/stats/${p._id}`).catch(() => [])\n            ]);'
);

code = code.replace(
    /const lastMissed = logs\.find\(l => l\.status === 'skipped'\);/,
    "const lastMissed = logs.find(l => l.status === 'skipped');\n            const vitals = vitalsData && vitalsData.length > 0 ? vitalsData[0] : null;"
);

code = code.replace(
    /return \{ \.\.\.p, adherence: avg, lastMissed, risk, riskColor, logs \};/,
    'return { ...p, adherence: avg, lastMissed, risk, riskColor, logs, vitals };'
);

code = code.replace(
    /<td class="px-8 py-6 text-right">\r?\n\s*<div class="flex items-center justify-end gap-2">/,
    `<td class="px-8 py-6">
                    <div class="flex items-center justify-center gap-1" onclick="event.stopPropagation()">
                        <input type="number" id="hr-\${p._id}" placeholder="\${p.vitals?.heartRate || 'HR'}" class="w-12 text-xs font-bold p-1.5 rounded border border-slate-200 dark:bg-slate-800 dark:border-slate-700 outline-none focus:border-primary text-center">
                        <input type="number" id="sys-\${p._id}" placeholder="\${p.vitals?.bloodPressure?.systolic || 'Sys'}" class="w-12 text-xs font-bold p-1.5 rounded border border-slate-200 dark:bg-slate-800 dark:border-slate-700 outline-none focus:border-primary text-center">
                        <span class="text-slate-400">/</span>
                        <input type="number" id="dia-\${p._id}" placeholder="\${p.vitals?.bloodPressure?.diastolic || 'Dia'}" class="w-12 text-xs font-bold p-1.5 rounded border border-slate-200 dark:bg-slate-800 dark:border-slate-700 outline-none focus:border-primary text-center">
                        <button onclick="updatePatientVitals('\${p._id}')" class="p-1.5 ml-1 bg-primary text-white rounded hover:bg-primary-dark transition-all">
                            <i data-lucide="save" class="w-3.5 h-3.5"></i>
                        </button>
                    </div>
                </td>
                <td class="px-8 py-6 text-right">
                    <div class="flex items-center justify-end gap-2">`
);

fs.writeFileSync('frontend/public/js/dashboard.js', code);
console.log('Updated dashboard.js');
