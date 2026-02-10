// ==================== TIMETABLE EDITOR ====================

// Timetable data structure
// state.timetables = {
//   "1": { "前期": { "月": { "1": "科目名", ... }, ... }, "後期": { ... } },
//   "2": { ... },
//   ...
// }

const PERIOD_TIMES = [
    { period: 1, time: "9:00～9:45" },
    { period: 2, time: "9:50～10:35" },
    { period: 3, time: "10:45～11:30" },
    { period: 4, time: "11:35～12:20" },
    { period: 5, time: "13:05～13:50" },
    { period: 6, time: "13:55～14:40" },
    { period: 7, time: "14:50～15:35" },
    { period: 8, time: "15:40～16:25" }
];

const DAYS_OF_WEEK = ["月", "火", "水", "木", "金"];

let selectedCells = []; // [{ day, period }, ...]
let timetableClipboard = null; // data

function initTimetableData() {
    if (!state.timetables) {
        state.timetables = {};
    }
}

function getCurrentTimetable() {
    initTimetableData();
    const year = state.currentYear;
    const semester = document.getElementById('timetableSemester')?.value || '前期';

    if (!state.timetables[year]) {
        state.timetables[year] = {};
    }
    if (!state.timetables[year][semester]) {
        state.timetables[year][semester] = {};
    }

    return state.timetables[year][semester];
}

function renderTimetableGrid() {
    console.log('renderTimetableGrid called');
    const tbody = document.getElementById('timetableBody');
    if (!tbody) {
        console.error('timetableBody element not found');
        return;
    }

    // Check if state object exists
    if (typeof state === 'undefined') {
        console.error('state object is not defined. Make sure script.js is loaded first.');
        tbody.innerHTML = '<tr><td colspan="6" style="padding: 2rem; text-align: center; color: #ef4444;">エラー: システムが初期化されていません。ページを再読み込みしてください。</td></tr>';
        return;
    }

    tbody.innerHTML = '';
    const timetable = getCurrentTimetable();
    console.log('Current timetable:', timetable);

    // Pre-calculate rowspans for each day
    const rowspans = {}; // { day: { period: span } }
    const skipCell = {}; // { day: { period: true } }

    DAYS_OF_WEEK.forEach(day => {
        rowspans[day] = {};
        skipCell[day] = {};

        for (let i = 0; i < PERIOD_TIMES.length; i++) {
            const period = PERIOD_TIMES[i].period;
            if (skipCell[day][period]) continue;

            let span = 1;
            const currentData = timetable[day]?.[period];
            if (!currentData) continue;

            const currentSubj = typeof currentData === 'string' ? currentData : (currentData.s || '');
            const currentTeacher = typeof currentData === 'string' ? '' : (currentData.t || '');

            if (!currentSubj) continue;

            for (let j = i + 1; j < PERIOD_TIMES.length; j++) {
                const nextPeriod = PERIOD_TIMES[j].period;
                const nextData = timetable[day]?.[nextPeriod];
                if (!nextData) break;

                const nextSubj = typeof nextData === 'string' ? nextData : (nextData.s || '');
                const nextTeacher = typeof nextData === 'string' ? '' : (nextData.t || '');

                // Requirement: Same subject name = merge (even if teacher differs)
                if (currentSubj === nextSubj) {
                    span++;
                    skipCell[day][nextPeriod] = true;
                } else {
                    break;
                }
            }
            if (span > 1) {
                rowspans[day][period] = span;
            }
        }
    });

    PERIOD_TIMES.forEach(({ period, time }) => {
        const row = document.createElement('tr');

        // Period column
        const periodCell = document.createElement('td');
        periodCell.style.cssText = 'padding: 1rem; text-align: center; font-weight: 600; background: #f8fafc; border: 1px solid #e2e8f0;';
        periodCell.innerHTML = `<div style="font-size: 1rem; color: #1e293b;">${period}限</div><div style="font-size: 0.75rem; color: #64748b; margin-top: 0.25rem;">${time}</div>`;
        row.appendChild(periodCell);

        // Day columns
        DAYS_OF_WEEK.forEach(day => {
            if (skipCell[day][period]) return;

            const cell = document.createElement('td');
            cell.id = `cell-${day}-${period}`; // For flashing/targeting
            cell.className = 'timetable-cell'; // Essential for CSS user-select: none
            const span = rowspans[day][period] || 1;
            if (span > 1) {
                cell.rowSpan = span;
            }
            cell.style.cssText = 'padding: 0.75rem; border: 1px solid #e2e8f0; cursor: pointer; transition: all 0.2s; min-height: 60px; vertical-align: middle; position: relative;';

            const data = timetable[day]?.[period];
            const subject = data ? (typeof data === 'string' ? data : data.s) : '';

            // Get teacher/email arrays or handle legacy strings
            let teacherList = [];
            if (data && typeof data === 'object') {
                const names = Array.isArray(data.t) ? data.t : (data.t ? [data.t] : []);
                const emails = Array.isArray(data.email) ? data.email : (data.email ? [data.email] : []);
                teacherList = names.map((name, i) => ({ name, email: emails[i] || '' }));
            }

            if (subject) {
                const iconsHtml = typeof getSubjectMetadataIcons === 'function' ? getSubjectMetadataIcons(subject) : '';
                const theme = typeof getSubjectTheme === 'function' ? getSubjectTheme(subject) : { gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' };
                let html = `
                    <div style="font-weight: 600; text-align: center; padding: 0.5rem; background: ${theme.gradient}; color: white; border-radius: 0.375rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 4px;">${subject}</div>
                    ${iconsHtml}
                `;

                if (teacherList.length > 0) {
                    html += `<div style="display: flex; flex-direction: column; gap: 2px;">`;
                    teacherList.forEach(t => {
                        html += `<div style="text-align: center; font-size: 0.8rem; color: #1e293b; font-weight: 600;">${t.name}</div>`;
                        if (t.email) {
                            html += `<div style="text-align: center; font-size: 0.7rem; color: #64748b; word-break: break-all; line-height: 1; display: flex; justify-content: center; gap: 8px; margin-top: 2px;">
                                <a href="mailto:${t.email}" style="color: inherit; text-decoration: none;" onclick="event.stopPropagation();" title="メールを送る">📧 メール</a>
                                <a href="https://teams.microsoft.com/l/chat/0/0?users=${t.email}" target="_blank" style="color: #4f46e5; text-decoration: none; font-weight: 600;" onclick="event.stopPropagation();" title="Teamsチャットを開始">💬 Teams</a>
                            </div>`;
                        }
                    });
                    html += `</div>`;
                }

                cell.innerHTML = html;
                cell.style.background = '#faf5ff';
            } else {
                cell.innerHTML = `<div style="text-align: center; color: #cbd5e1; font-size: 0.85rem;">クリックして選択</div>`;
                cell.style.background = 'white';
            }

            // Hover effect
            cell.addEventListener('mouseenter', () => {
                if (!isSelected) cell.style.boxShadow = 'inset 0 0 0 2px #667eea';
            });
            cell.addEventListener('mouseleave', () => {
                if (!isSelected) cell.style.boxShadow = 'none';
            });

            // Selection highlight logic
            const isSelected = selectedCells.some(c => c.day === day && c.period === period);
            if (isSelected) {
                cell.style.boxShadow = 'inset 0 0 0 3px #4f46e5';
                cell.style.backgroundColor = '#f0f7ff';
                cell.style.zIndex = '5';
            }

            // Click to select or edit
            cell.addEventListener('click', (e) => {
                console.log(`Cell clicked: ${day}曜日 ${period}限, span: ${span}`);

                // Get all constituent periods for this cell (handles merged cells)
                const constituentPeriods = [];
                for (let p = 0; p < span; p++) {
                    constituentPeriods.push({ day, period: period + p });
                }

                if (e.ctrlKey || e.metaKey) {
                    // Toggle selection for all constituent periods
                    const exists = selectedCells.some(c => c.day === day && c.period === period);
                    if (exists) {
                        selectedCells = selectedCells.filter(c => !(c.day === day && c.period >= period && c.period < period + span));
                    } else {
                        selectedCells.push(...constituentPeriods);
                    }
                } else if (e.shiftKey && selectedCells.length > 0) {
                    // Range selection from the first selected item
                    const start = selectedCells[0];
                    selectedCells = getTimetableRange(start, { day, period: period + span - 1 });
                } else {
                    // Single selection (of the whole merged block) or open modal
                    const isAlreadySelectedOnlyThis = selectedCells.length === span &&
                        selectedCells.every(c => c.day === day && c.period >= period && c.period < period + span);

                    if (isAlreadySelectedOnlyThis) {
                        editTimetableCell(day, period);
                        return;
                    }
                    selectedCells = constituentPeriods;
                }
                renderTimetableGrid();
            });

            // --- Context Menu & Long Press Logic ---
            let pressTimer;
            const handlePressStart = (e) => {
                if (e.type === 'mousedown' && e.button !== 0) return;
                pressTimer = setTimeout(() => {
                    showTimetableContextMenu(e, day, period, span);
                }, 600);
            };
            const handlePressCancel = () => clearTimeout(pressTimer);

            cell.addEventListener('mousedown', handlePressStart);
            cell.addEventListener('touchstart', handlePressStart, { passive: true });
            cell.addEventListener('mouseup', handlePressCancel);
            cell.addEventListener('mouseleave', handlePressCancel);
            cell.addEventListener('touchend', handlePressCancel);
            cell.addEventListener('touchmove', handlePressCancel);

            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                showTimetableContextMenu(e, day, period, span);
            });

            row.appendChild(cell);
        });

        tbody.appendChild(row);
    });
    console.log('Grid rendered successfully');
}


function editTimetableCell(day, period) {
    console.log(`editTimetableCell called for ${day}曜日 ${period}限`);

    const timetable = getCurrentTimetable();
    const currentData = timetable[day]?.[period];
    const currentSubject = currentData ? (typeof currentData === 'string' ? currentData : (currentData.s || '')) : '';

    // Support plural teachers/emails
    let teachers = [];
    if (currentData && typeof currentData === 'object') {
        if (Array.isArray(currentData.t)) {
            teachers = currentData.t.map((name, i) => ({
                name,
                email: (Array.isArray(currentData.email) ? currentData.email[i] : (i === 0 ? currentData.email : '')) || ''
            }));
        } else if (currentData.t) {
            // Legacy single teacher format
            teachers = [{ name: currentData.t, email: currentData.email || '' }];
        }
    }

    const year = state.currentYear;
    const currentCourse = state.currentCourse;

    const subjects = state.subjects.filter(s => {
        if (s.year !== year || s.exclude) return false;
        if (s.type2 === '基盤専門') {
            if (!currentCourse) return true;
            return (s.type4 === currentCourse || s.type4 === 'コース共通' || !s.type4);
        }
        return true;
    });

    const subjectOptions = ['', '特別活動（ホームルーム）', ...subjects.map(s => s.name)];

    // Faculty lookup
    const facultyList = (typeof facultyImportState !== 'undefined' && facultyImportState.candidates) ?
        facultyImportState.candidates : [];
    const teacherMap = new Map();
    facultyList.forEach(c => { if (c.name) teacherMap.set(c.name, c.email); });
    const teacherNames = Array.from(teacherMap.keys());

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 10000; display: flex; align-items: center; justify-content: center;';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal';
    modalContent.style.cssText = 'max-width: 600px; width: 95%; max-height: 90vh; overflow-y: auto;';

    const renderTeacherList = () => {
        const container = document.getElementById('addedTeachersList');
        if (!container) return;
        container.innerHTML = teachers.map((t, i) => `
            <div style="display: flex; align-items: center; gap: 0.5rem; background: #f1f5f9; padding: 0.5rem 0.75rem; border-radius: 0.375rem; margin-bottom: 0.5rem; border: 1px solid #e2e8f0;">
                <div style="flex: 1;">
                    <div style="font-weight: 600; color: #1e293b; font-size: 0.95rem;">${t.name}</div>
                    <div style="font-size: 0.8rem; color: #64748b;">${t.email || '(メールなし)'}</div>
                </div>
                <button type="button" class="btn-remove-teacher" data-index="${i}" style="background: #fee2e2; color: #ef4444; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 0.8rem;">削除</button>
            </div>
        `).join('') || '<div style="color: #94a3b8; font-size: 0.9rem; font-style: italic; padding: 0.5rem;">教員が追加されていません</div>';

        // Add delete listeners
        container.querySelectorAll('.btn-remove-teacher').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.dataset.index);
                teachers.splice(idx, 1);
                renderTeacherList();
            });
        });
    };

    modalContent.innerHTML = `
        <div class="modal-header" style="background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
            <h3 class="modal-title" style="font-size: 1.25rem;">${day}曜日 ${period}限 の科目編集</h3>
            <div style="font-size: 0.85rem; color: #64748b; margin-top: 0.25rem;">対象: ${currentCourse || '全コース'} / ${year}年</div>
        </div>
        <div class="modal-body" style="padding: 1.5rem;">
            <div style="margin-bottom: 1.5rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #334155;">科目名:</label>
                <select id="timetableSubjectSelect" style="width: 100%; padding: 0.8rem; border: 2px solid #e2e8f0; border-radius: 0.5rem; font-size: 1.1rem; margin-bottom: 0.5rem;">
                    <option value="">（選択肢から）</option>
                    ${subjectOptions.slice(1).map(s => `<option value="${s}" ${s === currentSubject ? 'selected' : ''}>${s}</option>`).join('')}
                </select>
                <input type="text" id="timetableSubjectInput" placeholder="直接入力" value="${currentSubject}" 
                    style="width: 100%; padding: 0.8rem; border: 2px solid #e2e8f0; border-radius: 0.5rem; font-size: 1.1rem;">
            </div>

            <div style="margin-bottom: 1.5rem; border: 1px solid #e2e8f0; padding: 1rem; border-radius: 0.75rem; background: #fbfcfe;">
                <label style="display: block; margin-bottom: 0.75rem; font-weight: 600; color: #1e293b;">担当教員の追加:</label>
                <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
                    <div style="flex: 1;">
                        <input type="text" id="addTeacherName" list="facultyDatalist" placeholder="教員名 (検索可)" 
                            style="width: 100%; padding: 0.7rem; border: 2px solid #e2e8f0; border-radius: 0.5rem; font-size: 1rem;">
                        <datalist id="facultyDatalist">${teacherNames.map(name => `<option value="${name}">`).join('')}</datalist>
                    </div>
                    <button id="btnAddTeacher" class="btn btn-primary" style="padding: 0 1.25rem; font-weight: 600;">追加</button>
                </div>
                
                <div id="addedTeachersList" style="max-height: 200px; overflow-y: auto; margin-top: 0.5rem;"></div>
            </div>
            
            <div style="background: #f0f9ff; padding: 1rem; border-radius: 0.5rem; border: 1px solid #bae6fd; font-size: 0.85rem; color: #0369a1;">
                同一科目が連続する場合、自動的に枠が結合されます。複数教員の設定も可能です。
            </div>
        </div>
        <div class="modal-footer" style="padding: 1.25rem 1.5rem; border-top: 1px solid #e2e8f0; background: #f8fafc; display: flex; gap: 1rem; justify-content: flex-end;">
            <button class="btn btn-secondary" id="timetableCancelBtn">キャンセル</button>
            <button class="btn btn-danger" id="timetableClearBtn" style="background: #ef4444; color: white;">削除</button>
            <button class="btn btn-primary" id="timetableSaveBtn" style="min-width: 120px;">更新</button>
        </div>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Trigger open state for CSS transition defined in style.css
    setTimeout(() => modal.classList.add('open'), 10);

    console.log('Modal opened (DOM class added)');
    renderTeacherList();

    // Event listeners
    const subSelect = document.getElementById('timetableSubjectSelect');
    const subInput = document.getElementById('timetableSubjectInput');
    const tNameInput = document.getElementById('addTeacherName');
    const btnAdd = document.getElementById('btnAddTeacher');

    subSelect.addEventListener('change', () => { subInput.value = subSelect.value; });
    subInput.addEventListener('input', () => { subSelect.value = ''; });

    btnAdd.addEventListener('click', () => {
        const name = tNameInput.value.trim();
        if (!name) return;
        const email = teacherMap.get(name) || '';
        teachers.push({ name, email });
        tNameInput.value = '';
        renderTeacherList();
    });

    const closeModal = () => {
        modal.classList.remove('open');
        setTimeout(() => {
            if (modal.parentNode) {
                document.body.removeChild(modal);
            }
        }, 300); // Wait for transition
    };

    document.getElementById('timetableCancelBtn').addEventListener('click', closeModal);

    document.getElementById('timetableClearBtn').addEventListener('click', () => {
        const merged = getFullMergedRange(timetable, day, period);
        merged.forEach(m => {
            if (timetable[m.day]) delete timetable[m.day][m.period];
        });
        saveTimetableData();
        renderTimetableGrid();
        closeModal();
    });

    document.getElementById('timetableSaveBtn').addEventListener('click', () => {
        const newSubject = subInput.value.trim();

        if (newSubject) {
            if (!timetable[day]) timetable[day] = {};
            timetable[day][period] = {
                s: newSubject,
                t: teachers.map(t => t.name),
                email: teachers.map(t => t.email)
            };
        } else {
            // Treat saving as empty subject same as clearing (including merged parts)
            const merged = getFullMergedRange(timetable, day, period);
            merged.forEach(m => {
                if (timetable[m.day]) delete timetable[m.day][m.period];
            });
        }

        saveTimetableData();
        renderTimetableGrid();
        closeModal();
    });

    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Helper function to save timetable data
function saveTimetableData() {
    if (typeof saveSessionState === 'function') {
        saveSessionState();
    } else {
        // Fallback: save to localStorage directly
        console.warn('saveSessionState not found, using fallback localStorage save');
        try {
            localStorage.setItem('gm_state_timetables', JSON.stringify(state.timetables));
        } catch (e) {
            console.error('Failed to save timetable data:', e);
        }
    }
}


function saveTimetable() {
    saveTimetableData();
    alert('時間割データを保存しました。');
}

function exportTimetablePdf() {
    const year = state.currentYear;
    const semester = document.getElementById('timetableSemester')?.value || '前期';
    const timetable = getCurrentTimetable();

    // Formal Title construction via helper
    const className = typeof getClassName === 'function' ? getClassName() : `${year}学年`;

    // Pre-calculate rowspans (Same logic as in render)
    const rowspans = {};
    const skipCell = {};
    DAYS_OF_WEEK.forEach(day => {
        rowspans[day] = {};
        skipCell[day] = {};
        for (let i = 0; i < PERIOD_TIMES.length; i++) {
            const period = PERIOD_TIMES[i].period;
            if (skipCell[day][period]) continue;
            let span = 1;
            const currentData = timetable[day]?.[period];
            if (!currentData) continue;
            const currentSubj = typeof currentData === 'string' ? currentData : (currentData.s || '');
            if (!currentSubj) continue;
            for (let j = i + 1; j < PERIOD_TIMES.length; j++) {
                const nextPeriod = PERIOD_TIMES[j].period;
                const nextData = timetable[day]?.[nextPeriod];
                if (!nextData) break;
                const nextSubj = typeof nextData === 'string' ? nextData : (nextData.s || '');
                if (currentSubj === nextSubj) {
                    span++;
                    skipCell[day][nextPeriod] = true;
                } else {
                    break;
                }
            }
            if (span > 1) rowspans[day][period] = span;
        }
    });

    let contentHtml = `
        <div style="margin-bottom: 20px; text-align: center;">
            <h1 style="margin: 0 0 10px 0; font-size: 20pt; font-weight: 800; color: #1e293b;">${className} 時間割表</h1>
            <div style="font-size: 13pt; color: #64748b; font-weight: 500;">${semester} (${year}年生)</div>
            <div style="font-size: 9pt; color: #94a3b8; margin-top: 8px;">出力日: ${new Date().toLocaleDateString('ja-JP')}</div>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px; table-layout: fixed; border: 2pt solid #4f46e5;">
            <thead>
                <tr style="background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%); color: white; -webkit-print-color-adjust: exact; print-color-adjust: exact;">
                    <th style="padding: 12px; text-align: center; font-weight: 700; border: 1pt solid #4338ca; width: 12%;">時限</th>
                    ${DAYS_OF_WEEK.map(day => `<th style="padding: 12px; text-align: center; font-weight: 700; border: 1pt solid #4338ca;">${day}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
    `;

    PERIOD_TIMES.forEach(({ period, time }) => {
        contentHtml += `<tr>`;
        contentHtml += `<td style="padding: 12px; text-align: center; font-weight: 700; background: #f5f3ff; border: 1pt solid #ddd6fe; -webkit-print-color-adjust: exact; print-color-adjust: exact;">
            <div style="font-size: 13pt; color: #4338ca;">${period}</div>
            <div style="font-size: 7.5pt; color: #6d61f2; margin-top: 4px; font-weight: 600;">${time}</div>
        </td>`;

        DAYS_OF_WEEK.forEach(day => {
            if (skipCell[day][period]) return;
            const span = rowspans[day][period] || 1;
            const data = timetable[day]?.[period];
            const subject = data ? (typeof data === 'string' ? data : (data.s || '')) : '';

            let teacherList = [];
            if (data && typeof data === 'object') {
                const names = Array.isArray(data.t) ? data.t : (data.t ? [data.t] : []);
                const emails = Array.isArray(data.email) ? data.email : (data.email ? [data.email] : []);
                teacherList = names.map((name, i) => ({ name, email: emails[i] || '' }));
            }

            const iconsHtml = typeof getSubjectMetadataIcons === 'function' ? getSubjectMetadataIcons(subject) : '';
            const theme = typeof getSubjectTheme === 'function' ? getSubjectTheme(subject) : {
                bg: '#f8fafc',
                text: '#64748b',
                border: '#e2e8f0',
                gradient: 'linear-gradient(135deg, #64748b 0%, #475569 100%)'
            };

            contentHtml += `<td ${span > 1 ? `rowspan="${span}"` : ''} style="padding: 10px; border: 1pt solid ${subject ? theme.border : '#e2e8f0'}; text-align: center; vertical-align: middle; background: ${subject ? theme.bg : 'white'}; -webkit-print-color-adjust: exact; print-color-adjust: exact;">
                ${subject ? `
                    <div style="font-size: 11pt; font-weight: 700; background: ${theme.gradient}; color: white; padding: 6px; border-radius: 4px; margin-bottom: 6px; box-shadow: 0 1px 2px rgba(0,0,0,0.1); -webkit-print-color-adjust: exact; print-color-adjust: exact;">${subject}</div>
                    <div style="display: flex; justify-content: center; gap: 4px; margin-bottom: 6px;">${iconsHtml}</div>
                    ${teacherList.map(t => `
                        <div style="margin-top: 2px;">
                            <div style="font-size: 8.5pt; color: #1e293b; font-weight: 600; line-height: 1.1;">${t.name}</div>
                            ${t.email ? `
                                <div style="font-size: 7.5pt; color: #64748b; word-break: break-all; line-height: 1.1; margin-top: 1px;">
                                    ${t.email}
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                ` : `<div style="color: #cbd5e1; font-size: 9pt;">-</div>`}
            </td>`;
        });
        contentHtml += `</tr>`;
    });

    contentHtml += `
            </tbody>
        </table>
        
        <div style="margin-top: 25px; display: flex; justify-content: space-between; align-items: flex-start;">
            <div style="padding: 12px; background: #f8fafc; border-radius: 8px; border: 1pt solid #e2e8f0; width: 45%;">
                <div style="font-weight: 700; margin-bottom: 8px; color: #1e293b; font-size: 10pt;">登下校・時限案内:</div>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; font-size: 8.5pt; color: #64748b;">
                    ${PERIOD_TIMES.map(({ period, time }) => `<div>${period}限: ${time}</div>`).join('')}
                </div>
            </div>
            <div style="text-align: right; color: #94a3b8; font-size: 8pt; align-self: flex-end;">
                Generated by Grade Manager GENE
            </div>
        </div>
    `;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        alert('ポップアップがブロックされました。PDF出力を許可してください。');
        return;
    }

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${className} 時間割表</title>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet">
            <style>
                body {
                    margin: 0; padding: 15mm 10mm;
                    font-family: 'Inter', 'Noto Sans JP', sans-serif;
                    color: #1e293b; background: white;
                }
                @media print {
                    @page { margin: 0; }
                    body { padding: 15mm 10mm; }
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
            </style>
        </head>
        <body onload="setTimeout(() => { window.print(); window.close(); }, 800)">
            ${contentHtml}
        </body>
        </html>
    `);
    printWindow.document.close();
}

function exportTimetableJson() {
    const year = state.currentYear;
    const semester = document.getElementById('timetableSemester')?.value || '前期';
    const timetable = getCurrentTimetable();

    const data = {
        year: year,
        semester: semester,
        timetable: timetable,
        exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `timetable_${year}年_${semester}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function clearTimetable() {
    const semester = document.getElementById('timetableSemester')?.value || '前期';
    if (confirm(`${semester}の時間割内容をすべて消去しますか？\n（この操作は取り消せません）`)) {
        const year = state.currentYear;
        if (state.timetables[year] && state.timetables[year][semester]) {
            state.timetables[year][semester] = {};
            selectedCells = [];
            saveTimetableData();
            renderTimetableGrid();
            alert(`${semester}のデータを全消去しました。`);
        }
    }
}


function importTimetableJson() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';

    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);

                if (!data.timetable) {
                    alert('無効な時間割データです。');
                    return;
                }

                const year = data.year || state.currentYear;
                const semester = data.semester || '前期';

                if (confirm(`${year}年 ${semester}の時間割データを読み込みますか？\n既存のデータは上書きされます。`)) {
                    if (!state.timetables[year]) {
                        state.timetables[year] = {};
                    }
                    state.timetables[year][semester] = data.timetable;

                    saveTimetableData();

                    // Update UI if viewing the same year/semester
                    if (year === state.currentYear && semester === document.getElementById('timetableSemester')?.value) {
                        renderTimetableGrid();
                    }

                    alert('時間割データを読み込みました。');
                }
            } catch (err) {
                console.error('Import error:', err);
                alert('ファイルの読み込みに失敗しました:\n' + err.message);
            }
        };

        reader.readAsText(file);
    });

    input.click();
}

// Initialize timetable editor when tab is shown
let timetableEditorInitialized = false;

function initTimetableEditor() {
    console.log('initTimetableEditor called, initialized:', timetableEditorInitialized);

    initTimetableData();
    renderTimetableGrid();

    // Only add event listeners once
    if (!timetableEditorInitialized) {
        console.log('Adding event listeners...');

        const semesterSelect = document.getElementById('timetableSemester');
        if (semesterSelect) {
            semesterSelect.addEventListener('change', () => {
                // Clear selection when changing semester to prevent accidental pastes
                // but keep the clipboard data intact.
                selectedCells = [];
                renderTimetableGrid();
            });
        }

        const saveBtn = document.getElementById('saveTimetableBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', saveTimetable);
        }

        const pdfBtn = document.getElementById('exportTimetablePdfBtn');
        if (pdfBtn) {
            pdfBtn.addEventListener('click', exportTimetablePdf);
        }

        const jsonExportBtn = document.getElementById('exportTimetableJsonBtn');
        if (jsonExportBtn) {
            jsonExportBtn.addEventListener('click', exportTimetableJson);
        }

        const jsonImportBtn = document.getElementById('importTimetableJsonBtn');
        if (jsonImportBtn) {
            jsonImportBtn.addEventListener('click', importTimetableJson);
        }

        const clearBtn = document.getElementById('clearTimetableBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', clearTimetable);
        }

        // Context Menu Item Listeners
        const ctxCut = document.getElementById('ctxCut');
        const ctxCopy = document.getElementById('ctxCopy');
        const ctxPaste = document.getElementById('ctxPaste');
        const ctxDelete = document.getElementById('ctxDelete');

        if (ctxCut) ctxCut.onclick = () => { performClipboardAction('x'); closeTimetableContextMenu(); };
        if (ctxCopy) ctxCopy.onclick = () => { performClipboardAction('c'); closeTimetableContextMenu(); };
        if (ctxPaste) ctxPaste.onclick = () => { performClipboardAction('v'); closeTimetableContextMenu(); };
        if (ctxDelete) ctxDelete.onclick = () => { performClipboardAction('delete'); closeTimetableContextMenu(); };

        // Global click to close context menu
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.context-menu')) closeTimetableContextMenu();
        });

        // Global keyboard shortcuts for Copy/Cut/Paste
        window.removeEventListener('keydown', handleTimetableKeydown);
        window.addEventListener('keydown', handleTimetableKeydown);

        timetableEditorInitialized = true;
        console.log('Event listeners added successfully');
    }
}


// Auto-initialize when DOM is ready and when tab is shown
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setupTimetableTabListener();
    });
} else {
    setupTimetableTabListener();
}

function setupTimetableTabListener() {
    console.log('setupTimetableTabListener called');

    // Listen for tab changes
    const navItems = document.querySelectorAll('.nav-item[data-tab="timetable"], .mobile-tab[data-tab="timetable"]');
    console.log('Found nav items:', navItems.length);

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            console.log('Timetable tab clicked');
            setTimeout(() => {
                const content = document.getElementById('timetable-content');
                if (content && !content.classList.contains('hidden')) {
                    console.log('Timetable content is visible, initializing...');
                    initTimetableEditor();
                }
            }, 100);
        });
    });

    // Check if timetable tab is already active on page load
    setTimeout(() => {
        const content = document.getElementById('timetable-content');
        const tbody = document.getElementById('timetableBody');

        // If we're on a test page (tbody exists but no tab content), initialize directly
        if (tbody && !content) {
            console.log('Test page detected, initializing directly...');
            initTimetableEditor();
        } else if (content && !content.classList.contains('hidden')) {
            console.log('Timetable content is visible on load, initializing...');
            initTimetableEditor();
        }
    }, 100);
}

// Export functions to global scope
window.initTimetableEditor = initTimetableEditor;
window.renderTimetableGrid = renderTimetableGrid;
window.editTimetableCell = editTimetableCell;
window.saveTimetable = saveTimetable;
window.exportTimetablePdf = exportTimetablePdf;
window.exportTimetableJson = exportTimetableJson;
window.importTimetableJson = importTimetableJson;
window.clearTimetable = clearTimetable;


function showTimetableContextMenu(e, day, period, span) {
    const menu = document.getElementById('timetableContextMenu');
    if (!menu) return;

    // Ensure the cell is selected before showing menu
    const isSelected = selectedCells.some(c => c.day === day && c.period >= period && c.period < period + span);
    if (!isSelected) {
        // Auto-select if not already
        const constituentPeriods = [];
        for (let p = 0; p < span; p++) {
            constituentPeriods.push({ day, period: period + p });
        }
        selectedCells = constituentPeriods;
        renderTimetableGrid();
    }

    const x = e.pageX || (e.touches ? e.touches[0].pageX : 0);
    const y = e.pageY || (e.touches ? e.touches[0].pageY : 0);

    menu.style.display = 'block';

    // Position adjustments to keep menu in viewport
    const menuWidth = menu.offsetWidth;
    const menuHeight = menu.offsetHeight;
    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;

    let posX = x;
    let posY = y;

    if (x + menuWidth > winWidth) posX = x - menuWidth;
    if (y + menuHeight > winHeight) posY = y - menuHeight;

    menu.style.left = `${posX}px`;
    menu.style.top = `${posY}px`;
}

function closeTimetableContextMenu() {
    const menu = document.getElementById('timetableContextMenu');
    if (menu) menu.style.display = 'none';
}

// --- Clipboard & Shortcut Handlers ---

function performClipboardAction(action) {
    // Re-use the existing handleTimetableKeydown logic by spoofing an event
    const mockEvent = {
        key: action === 'delete' ? 'Delete' : action,
        ctrlKey: true,
        metaKey: false,
        preventDefault: () => { },
        stopPropagation: () => { }
    };

    // For delete, it doesn't need ctrlKey
    if (action === 'delete') mockEvent.ctrlKey = false;

    handleTimetableKeydown(mockEvent);
}

function handleTimetableKeydown(e) {
    // Check if timetable tab is active
    const content = document.getElementById('timetable-content');
    if (!content || content.classList.contains('hidden')) return;

    // Ignore if modal is open
    if (document.querySelector('.modal-overlay.open')) return;

    // Ignore if typing in an input
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

    // Selection clearing with Escape
    if (e.key === 'Escape') {
        if (selectedCells.length > 0) {
            selectedCells = [];
            renderTimetableGrid();
        }
        return;
    }

    if (selectedCells.length === 0) return;

    const timetable = getCurrentTimetable();

    // Delete keys
    if (e.key === 'Delete' || e.key === 'Backspace') {
        const expandedSelected = [];
        selectedCells.forEach(c => {
            const merged = getFullMergedRange(timetable, c.day, c.period);
            merged.forEach(m => {
                if (!expandedSelected.some(existing => existing.day === m.day && existing.period === m.period)) {
                    expandedSelected.push(m);
                }
            });
        });

        expandedSelected.forEach(({ day, period }) => {
            if (timetable[day]) delete timetable[day][period];
        });
        saveTimetableData();
        renderTimetableGrid();
        e.preventDefault();
        return;
    }

    if (e.ctrlKey || e.metaKey) {
        if (e.key === 'c' || e.key === 'x') {
            const isCut = e.key === 'x';

            // Multi-cell copy: calculate relative positions
            // Expand selection to include all merged parts before copying/cutting
            const expandedSelection = [];
            selectedCells.forEach(c => {
                const merged = getFullMergedRange(timetable, c.day, c.period);
                merged.forEach(m => {
                    if (!expandedSelection.some(existing => existing.day === m.day && existing.period === m.period)) {
                        expandedSelection.push(m);
                    }
                });
            });

            const sorted = [...expandedSelection].sort((a, b) => {
                const dayDiff = DAYS_OF_WEEK.indexOf(a.day) - DAYS_OF_WEEK.indexOf(b.day);
                if (dayDiff !== 0) return dayDiff;
                return a.period - b.period;
            });

            const origin = sorted[0];
            const originDayIdx = DAYS_OF_WEEK.indexOf(origin.day);

            const payload = sorted.map(c => {
                const data = timetable[c.day]?.[c.period];
                return {
                    dDay: DAYS_OF_WEEK.indexOf(c.day) - originDayIdx,
                    dPeriod: c.period - origin.period,
                    data: data ? JSON.parse(JSON.stringify(data)) : null
                };
            }).filter(item => item.data !== null);

            if (payload.length > 0) {
                timetableClipboard = {
                    type: 'cells',
                    items: payload
                };
                console.log(`Copied ${payload.length} cells (including merged parts)`);

                if (isCut) {
                    expandedSelection.forEach(({ day, period }) => {
                        if (timetable[day]) delete timetable[day][period];
                        flashCell(day, period, '#fee2e2');
                    });
                    saveTimetableData();
                    renderTimetableGrid();
                } else {
                    expandedSelection.forEach(({ day, period }) => {
                        flashCell(day, period, '#dcfce7');
                    });
                }
            }
            e.preventDefault();
        } else if (e.key === 'v') {
            // Paste multi-cell payload relative to the current primary selection
            if (timetableClipboard && timetableClipboard.type === 'cells') {
                const targetOrigin = selectedCells[0];
                const targetDayIdx = DAYS_OF_WEEK.indexOf(targetOrigin.day);

                timetableClipboard.items.forEach(item => {
                    const targetDayIdxComputed = targetDayIdx + item.dDay;
                    const targetPeriodComputed = targetOrigin.period + item.dPeriod;

                    if (targetDayIdxComputed >= 0 && targetDayIdxComputed < DAYS_OF_WEEK.length &&
                        targetPeriodComputed >= 1 && targetPeriodComputed <= 8) {

                        const targetDay = DAYS_OF_WEEK[targetDayIdxComputed];
                        if (!timetable[targetDay]) timetable[targetDay] = {};
                        timetable[targetDay][targetPeriodComputed] = JSON.parse(JSON.stringify(item.data));

                        setTimeout(() => flashCell(targetDay, targetPeriodComputed, '#dbeafe'), 10);
                    }
                });
                saveTimetableData();
                renderTimetableGrid();
            } else if (timetableClipboard && timetableClipboard.type === 'full_semester') {
                // Fallback to the Full Paste logic if that's what's in clipboard
                pasteAllTimetable();
            }
            e.preventDefault();
        }
    }
}

function getTimetableRange(start, end) {
    const d1 = DAYS_OF_WEEK.indexOf(start.day);
    const d2 = DAYS_OF_WEEK.indexOf(end.day);
    const p1 = start.period;
    const p2 = end.period;

    const dMin = Math.min(d1, d2);
    const dMax = Math.max(d1, d2);
    const pMin = Math.min(p1, p2);
    const pMax = Math.max(p1, p2);

    const range = [];
    for (let d = dMin; d <= dMax; d++) {
        for (let p = pMin; p <= pMax; p++) {
            range.push({ day: DAYS_OF_WEEK[d], period: p });
        }
    }
    return range;
}

function getFullMergedRange(timetable, day, period) {
    const data = timetable[day]?.[period];
    if (!data) return [{ day, period }];
    const subj = typeof data === 'string' ? data : (data.s || '');
    if (!subj) return [{ day, period }];

    // Find top boundary of the merge
    let top = period;
    while (top > 1) {
        const prevData = timetable[day]?.[top - 1];
        if (!prevData) break;
        const prevSubj = typeof prevData === 'string' ? prevData : (prevData.s || '');
        if (prevSubj !== subj) break;
        top--;
    }

    // Find bottom boundary of the merge
    let bottom = period;
    while (bottom < 8) {
        const nextData = timetable[day]?.[bottom + 1];
        if (!nextData) break;
        const nextSubj = typeof nextData === 'string' ? nextData : (nextData.s || '');
        if (nextSubj !== subj) break;
        bottom++;
    }

    const range = [];
    for (let p = top; p <= bottom; p++) {
        range.push({ day, period: p });
    }
    return range;
}

function flashCell(day, period, color) {
    // Find the cell in the rendered table
    const tbody = document.getElementById('timetableBody');
    if (!tbody) return;

    const rows = tbody.querySelectorAll('tr');
    let targetRow = null;

    // Find the row for this period
    rows.forEach(row => {
        const periodText = row.querySelector('td')?.innerText;
        if (periodText && periodText.includes(`${period}限`)) {
            targetRow = row;
        }
    });

    if (!targetRow) return;

    // Find the cell for this day
    const dayIndex = DAYS_OF_WEEK.indexOf(day);
    if (dayIndex === -1) return;

    // Account for the "Period" column at index 0
    const cells = targetRow.querySelectorAll('td');
    // Note: Due to rowspan, the index might be tricky.
    // A simpler way is to use a data attribute if we had them.
    // Let's rely on the fact that we can add an ID to cells during render.
    const cellId = `cell-${day}-${period}`;
    const cell = document.getElementById(cellId);

    if (cell) {
        const originalBg = cell.style.backgroundColor;
        cell.style.transition = 'background-color 0s';
        cell.style.backgroundColor = color;

        setTimeout(() => {
            cell.style.transition = 'background-color 0.8s ease-out';
            cell.style.backgroundColor = originalBg;
        }, 100);
    }
}
