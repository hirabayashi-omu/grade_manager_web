
// ==================== SETTINGS UI HELPER ====================

function updateSourceSummaryDisplay() {
    const info = state.sourceInfo || {};

    const updateEl = (id, data, type) => {
        const el = document.getElementById(id);
        if (!el) return;

        if (!data || !data.date) {
            // Default Empty State
            let label = '未読込';
            if (type === 'roster') label = '名簿未読込';
            if (type === 'faculty') label = '名簿未読込';
            if (type === 'attendance') label = 'データ未読込';
            el.innerHTML = `<div style="color: #94a3b8; text-align: center;">${label}</div>`;
            return;
        }

        // Format Date
        const d = new Date(data.date);
        const dateStr = d.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });

        // Build HTML
        let html = `<div style="display: flex; flex-direction: column; gap: 0.3rem;">`;
        html += `<div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: 600; color: #334155;">${data.filename || '不明なファイル'}</span>
                    <span style="font-size: 0.75rem; background: #e0e7ff; color: #4338ca; padding: 1px 6px; border-radius: 4px;">済</span>
                 </div>`;

        if (type === 'roster' || type === 'faculty') {
            html += `<div style="font-size: 0.75rem; color: #64748b;">登録人数: <span style="font-weight: 600; color: #0f172a;">${data.count}</span> 名</div>`;
        } else if (type === 'attendance') {
            html += `<div style="font-size: 0.75rem; color: #64748b;">期間: ${data.startDate} ～ ${data.endDate}</div>`;
            html += `<div style="font-size: 0.75rem; color: #64748b;">対象: <span style="font-weight: 600; color: #0f172a;">${data.count}</span> 名分</div>`;
        }

        html += `<div style="font-size: 0.7rem; color: #94a3b8; text-align: right; margin-top: 0.2rem;">読込日時: ${dateStr}</div>`;
        html += `</div>`;

        el.innerHTML = html;
        el.style.background = '#f0f9ff'; // Slight blue tint for success
        el.style.border = '1px solid #bae6fd';
    };

    updateEl('rosterFileSummary', info.roster, 'roster');
    updateEl('facultyFileSummary', info.faculty, 'faculty');
    updateEl('attendanceFileSummary', info.attendance, 'attendance');
}
