// ------------------------------------------------------------------
// Class Stats Report Generation
// ------------------------------------------------------------------

let currentClassStatsData = [];
let currentSortCol = 'r2Gpa'; // Default sort by GPA Rank
let currentSortOrder = 'asc'; // asc (1 is top)

function initClassStats() {
    const yearSelect = document.getElementById('classStatsYear');
    const testSelect = document.getElementById('classStatsTest');
    const exportBtn = document.getElementById('exportClassStatsCsvBtn');
    const printBtn = document.getElementById('printClassStatsBtn');

    // 1. Set Default Year
    if (yearSelect && state.currentYear) {
        yearSelect.value = state.currentYear;
    }

    // 2. Set Default Test (based on data availability)
    updateClassStatsTestDefault();

    // 3. Auto-Generate Report immediately
    setTimeout(generateClassStats, 50);

    // 4. Attach Listeners for auto-update
    if (yearSelect) {
        yearSelect.onchange = function () {
            updateClassStatsTestDefault();
            generateClassStats();
        };
    }
    if (testSelect) {
        testSelect.onchange = function () {
            generateClassStats();
        };
    }
    if (exportBtn) {
        exportBtn.onclick = exportClassStatsCsv;
    }
    if (printBtn) {
        printBtn.onclick = printClassStats;
    }
}

function updateClassStatsTestDefault() {
    const yearSelect = document.getElementById('classStatsYear');
    const testSelect = document.getElementById('classStatsTest');
    if (!yearSelect || !testSelect) return;

    const targetYear = parseInt(yearSelect.value);
    const priorities = ["前期中間", "前期末", "後期中間", "学年末"];
    let maxFoundIdx = -1;

    const targetStudents = getClassStudents(targetYear, state.currentCourse);

    outerLoop:
    for (const s of targetStudents) {
        const subjects = state.subjects.filter(sub => sub.year === targetYear && !sub.exclude);
        for (const sub of subjects) {
            for (let idx = 0; idx < priorities.length; idx++) {
                if (idx > maxFoundIdx) {
                    const key = priorities[idx];
                    const v = getScore(s, sub.name, key);
                    if (v !== undefined && v !== null && v !== '') {
                        maxFoundIdx = idx;
                        if (maxFoundIdx === 3) break outerLoop;
                    }
                }
            }
        }
    }

    if (maxFoundIdx !== -1) {
        testSelect.value = priorities[maxFoundIdx];
    } else {
        testSelect.value = "前期中間";
    }
}


function generateClassStats() {
    const yearSelect = document.getElementById('classStatsYear');
    const testSelect = document.getElementById('classStatsTest');
    const container = document.getElementById('classStatsContainer');

    if (!yearSelect || !testSelect || !container) return;

    const targetYear = parseInt(yearSelect.value);
    const targetTest = testSelect.value;

    const priorityMap = {
        "前期中間": 1,
        "前期末": 2,
        "後期中間": 3,
        "学年末": 4
    };
    const targetPriority = priorityMap[targetTest] || 4;

    // --- 1. Compute Data for ALL Students ---
    const calcStats1 = (studentName) => {
        let sum = 0;
        let count = 0;
        const subjects = state.subjects.filter(s => s.year === targetYear && !s.exclude);
        subjects.forEach(sub => {
            const v = getScore(studentName, sub.name, targetTest);
            if (v !== undefined && v !== null && v !== '' && !isNaN(parseFloat(v))) {
                sum += parseFloat(v);
                count++;
            }
        });
        if (count === 0) return { avg: null, hasData: false, count: 0 };
        return { avg: sum / count, hasData: true, count: count };
    };

    const calcStats2 = (studentName) => {
        let termA = null;
        let countA = 0;
        {
            let sum = 0, count = 0;
            let wSum = 0, creds = 0;
            let gpWSum = 0, gpCreds = 0;

            const subjects = state.subjects.filter(s => s.year === targetYear && !s.exclude);
            subjects.forEach(sub => {
                const keys = ["学年末", "後期中間", "前期末", "前期中間"];
                let subValSum = 0; let subValCount = 0;
                keys.forEach(k => {
                    if (priorityMap[k] <= targetPriority) {
                        const v = getScore(studentName, sub.name, k);
                        if (v !== undefined && v !== null && v !== '' && !isNaN(parseFloat(v))) {
                            subValSum += parseFloat(v);
                            subValCount++;
                        }
                    }
                });
                if (subValCount > 0) {
                    const subAvg = subValSum / subValCount;
                    sum += subAvg; count++;
                    const c = sub.credits || 0;
                    wSum += subAvg * c; creds += c;
                    let gp = 0;
                    if (subAvg >= 90) gp = 4.0; else if (subAvg >= 80) gp = 3.0; else if (subAvg >= 70) gp = 2.0; else if (subAvg >= 60) gp = 1.0;
                    gpWSum += gp * c; gpCreds += c;
                }
            });
            if (count > 0) {
                countA = count;
                termA = { simple: sum / count, weighted: creds > 0 ? wSum / creds : 0, gpa: gpCreds > 0 ? gpWSum / gpCreds : 0 };
            }
        }

        let termB = null;
        let countB = 0;
        if (targetYear > 1) {
            let yearEndSum = 0, yearEndCount = 0;
            let wSum = 0, creds = 0;
            let gpWSum = 0, gpCreds = 0;
            const subjects = state.subjects.filter(s_1 => s_1.year < targetYear && !s_1.exclude);
            subjects.forEach(sub => {
                const v = getScore(studentName, sub.name, '学年末');
                if (v !== undefined && v !== null && v !== '' && !isNaN(parseFloat(v))) {
                    const val = parseFloat(v);
                    yearEndSum += val; yearEndCount++;
                    const c = sub.credits || 0;
                    wSum += val * c; creds += c;
                    let gp = 0;
                    if (val >= 90) gp = 4.0; else if (val >= 80) gp = 3.0; else if (val >= 70) gp = 2.0; else if (val >= 60) gp = 1.0;
                    gpWSum += gp * c; gpCreds += c;
                }
            });
            if (yearEndCount > 0) {
                countB = yearEndCount;
                termB = { simple: yearEndSum / yearEndCount, weighted: creds > 0 ? wSum / creds : 0, gpa: gpCreds > 0 ? gpWSum / gpCreds : 0 };
            }
        }

        if (!termA) return null;
        let result = { count: countA + countB };
        if (termB) {
            result.simple = (termA.simple + termB.simple) / 2;
            result.weighted = (termA.weighted + termB.weighted) / 2;
            result.gpa = (termA.gpa + termB.gpa) / 2;
        } else {
            result.simple = termA.simple;
            result.weighted = termA.weighted;
            result.gpa = termA.gpa;
        }
        return result;
    };

    const targetStudents = getClassStudents(targetYear, state.currentCourse);
    currentClassStatsData = targetStudents.map(s => {
        const s1 = calcStats1(s);
        let s2 = calcStats2(s);
        if (!s1.hasData) s2 = null;
        return { name: s, s1: s1, s2: s2 };
    });

    const assignRank = (arr, keyFn, rankProp) => {
        const valid = arr.filter(item => keyFn(item) !== null);
        valid.sort((a, b) => keyFn(b) - keyFn(a));
        valid.forEach((item, idx) => { item[rankProp] = idx + 1; });
    };

    assignRank(currentClassStatsData, x => (x.s1 && x.s1.hasData) ? x.s1.avg : null, 'r1');
    assignRank(currentClassStatsData, x => x.s2 ? x.s2.simple : null, 'r2Simple');
    assignRank(currentClassStatsData, x => x.s2 ? x.s2.weighted : null, 'r2Weighted');
    assignRank(currentClassStatsData, x => x.s2 ? x.s2.gpa : null, 'r2Gpa');

    renderClassStatsTable();
}

function sortClassStats(col) {
    if (currentSortCol === col) {
        currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
    } else {
        currentSortCol = col;
        currentSortOrder = 'asc';
    }
    renderClassStatsTable();
}

function renderClassStatsTable() {
    const container = document.getElementById('classStatsContainer');
    if (!container) return;

    currentClassStatsData.sort((a, b) => {
        let valA = -999, valB = -999;
        const getVal = (item, col) => {
            if (col === 'name') return item.name;
            if (col === 's1Avg') return (item.s1 && item.s1.hasData) ? item.s1.avg : -999;
            if (col === 'r1') return item.r1 ?? 999;
            if (col === 's2Simple') return item.s2 ? item.s2.simple : -999;
            if (col === 'r2Simple') return item.r2Simple ?? 999;
            if (col === 's2Weighted') return item.s2 ? item.s2.weighted : -999;
            if (col === 'r2Weighted') return item.r2Weighted ?? 999;
            if (col === 's2Gpa') return item.s2 ? item.s2.gpa : -999;
            if (col === 'r2Gpa') return item.r2Gpa ?? 999;
            return 0;
        };
        valA = getVal(a, currentSortCol);
        valB = getVal(b, currentSortCol);
        if (typeof valA === 'string' && typeof valB === 'string') {
            return currentSortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        if (valA < valB) return currentSortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return currentSortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const thStyle = "border:1px solid #cbd5e1; padding:0.5rem; cursor:pointer; user-select:none; background:#f1f5f9; position:sticky; top:0;";
    const getSortInd = (col) => currentSortCol === col ? (currentSortOrder === 'asc' ? ' ▲' : ' ▼') : ' <span style="opacity:0.3">▼</span>';
    const cellStyle = "border:1px solid #e2e8f0; padding:0.4rem; text-align:center;";

    let html = `
        <table style="width:100%; min-width:900px; border-collapse: separate; border-spacing:0; font-size: 0.85rem; table-layout:fixed;">
            <thead>
                <tr>
                    <th style="border:1px solid #cbd5e1; padding:0.5rem; text-align:left; background:#fff; width:150px;"></th>
                    <th style="border:1px solid #cbd5e1; padding:0.5rem; text-align:center; background:#e0f2fe;" colspan="3">統計１ (${document.getElementById('classStatsTest').value})</th>
                    <th style="border:1px solid #cbd5e1; padding:0.5rem; text-align:center; background:#fef3c7;" colspan="7">統計２ (累積)</th>
                </tr>
                <tr>
                    <th onclick="sortClassStats('name')" style="${thStyle} text-align:left; width:150px;">氏名${getSortInd('name')}</th>
                    <th style="${thStyle} width:50px;">科目</th>
                    <th onclick="sortClassStats('s1Avg')" style="${thStyle} width:80px;">平均点${getSortInd('s1Avg')}</th>
                    <th onclick="sortClassStats('r1')" style="${thStyle} width:60px;">順位${getSortInd('r1')}</th>
                    
                    <th style="${thStyle} width:50px;">科目</th>
                    <th onclick="sortClassStats('s2Simple')" style="${thStyle} width:80px;">単純平均${getSortInd('s2Simple')}</th>
                    <th onclick="sortClassStats('r2Simple')" style="${thStyle} width:60px;">順位${getSortInd('r2Simple')}</th>
                    <th onclick="sortClassStats('s2Weighted')" style="${thStyle} width:80px;">加重平均${getSortInd('s2Weighted')}</th>
                    <th onclick="sortClassStats('r2Weighted')" style="${thStyle} width:60px;">順位${getSortInd('r2Weighted')}</th>
                    <th onclick="sortClassStats('s2Gpa')" style="${thStyle} width:65px;">GPA${getSortInd('s2Gpa')}</th>
                    <th onclick="sortClassStats('r2Gpa')" style="${thStyle} width:60px;">順位${getSortInd('r2Gpa')}</th>
                </tr>
            </thead>
            <tbody>
    `;

    currentClassStatsData.forEach(row => {
        let s1Avg = (row.s1 && row.s1.hasData) ? row.s1.avg.toFixed(2) : '-';
        let s1Count = row.s1 ? row.s1.count : 0;
        let s2Count = row.s2 ? row.s2.count : 0;
        let s2Simple = row.s2 ? row.s2.simple.toFixed(2) : '-';
        let s2Weighted = row.s2 ? row.s2.weighted.toFixed(2) : '-';
        let s2Gpa = row.s2 ? row.s2.gpa.toFixed(2) : '-';
        let r1 = row.r1 ?? '-';
        let r2S = row.r2Simple ?? '-';
        let r2W = row.r2Weighted ?? '-';
        let r2G = row.r2Gpa ?? '-';

        html += `
            <tr style="background:#fff; transition:background 0.2s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='#fff'">
                <td style="border:1px solid #e2e8f0; padding:0.4rem; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${row.name}</td>
                <td style="${cellStyle}">${s1Count}</td>
                <td style="${cellStyle}">${s1Avg}</td>
                <td style="${cellStyle}">${r1}</td>
                <td style="${cellStyle}">${s2Count}</td>
                <td style="${cellStyle}">${s2Simple}</td>
                <td style="${cellStyle}">${r2S}</td>
                <td style="${cellStyle}">${s2Weighted}</td>
                <td style="${cellStyle}">${r2W}</td>
                <td style="${cellStyle} color:#2563eb; font-weight:bold;">${s2Gpa}</td>
                <td style="${cellStyle}">${r2G}</td>
            </tr>
        `;
    });

    html += `</tbody></table>`;
    html += `<div style="margin-top:0.5rem; font-size:0.8rem; color:#64748b;">Total Students: ${currentClassStatsData.length}</div>`;
    container.innerHTML = html;
}

function exportClassStatsCsv() {
    if (currentClassStatsData.length === 0) {
        alert("データがありません。");
        return;
    }
    const testLabel = document.getElementById('classStatsTest').value;
    const yearLabel = document.getElementById('classStatsYear').value;

    let csv = "\uFEFF";
    csv += `クラス統計,学年:${yearLabel},時点:${testLabel}\n`;
    csv += "氏名,統計1科目数,統計1平均点,統計1順位,統計2(累積)科目数,単純平均,単純順位,加重平均,加重順位,GPA,GPA順位\n";

    currentClassStatsData.forEach(row => {
        const s1Avg = (row.s1 && row.s1.hasData) ? row.s1.avg.toFixed(2) : '';
        const s1Count = row.s1 ? row.s1.count : 0;
        const s2Count = row.s2 ? row.s2.count : 0;
        const s2Simple = row.s2 ? row.s2.simple.toFixed(2) : '';
        const s2Weighted = row.s2 ? row.s2.weighted.toFixed(2) : '';
        const s2Gpa = row.s2 ? row.s2.gpa.toFixed(2) : '';
        const r1 = row.r1 ?? '';
        const r2S = row.r2Simple ?? '';
        const r2W = row.r2Weighted ?? '';
        const r2G = row.r2Gpa ?? '';

        csv += `"${row.name}",${s1Count},${s1Avg},${r1},${s2Count},${s2Simple},${r2S},${s2Weighted},${r2W},${s2Gpa},${r2G}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `class_stats_${yearLabel}_${testLabel}.csv`);
    link.click();
}

function printClassStats() {
    // Explicitly set portrait class on body for this printed report
    document.body.classList.remove('print-landscape');
    window.print();
}
