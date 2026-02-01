
// ==================== DATA CONSTANTS ====================
// ==================== DATA CONSTANTS ====================
// These are factory defaults. We use localStorage for actual master data.
const DEFAULT_STUDENTS_RAW = `
学生太郎,学生次郎,学生花子,学生A,学生B,学生C,学生D,学生E
`;

const DEFAULT_SUBJECTS_RAW = `授業科目	単位	学年	種別1	種別2
国語1	2	1	必	一般
国語2	2	2	必	一般
国語3	2	3	必	一般
言語と文化	2	4	必	一般
社会1	2	1	必	一般
社会2	2	2	必	一般
社会3	2	3	必	一般
現代社会論	2	4	必	一般
法律	2	5	選	一般
経済	2	5	選	一般
哲学	2	5	選	一般
心理学	2	5	選	一般
基礎数学A	2	1	必	一般
基礎数学B	2	1	必	一般
基礎数学C	2	1	必	一般
微分積分1	2	2	必	一般
微分積分2	2	2	必	一般
ベクトル・行列	2	2	必	一般
解析1	2	3	必	一般
解析2	2	3	必	一般
線形代数・微分方程式	2	3	必	一般
確率統計	2	4	必	一般
基礎物理1	2	1	必	一般
基礎物理2	2	2	必	一般
基礎物理3	2	3	必	一般
現代物理概論	2	5	選	一般
化学1	3	1	必	一般
化学2	2	2	必	一般
生物	2	2	必	一般
保健・体育1	2	1	必	一般
保健・体育2	2	2	必	一般
保健・体育3	2	3	必	一般
保健・体育4	2	4	必	一般
英語1	2	1	必	一般
英語2	2	1	必	一般
英語3	2	2	必	一般
英語4	2	2	必	一般
英語5	2	3	必	一般
英語6	2	4	必	一般
英語表現1	2	1	必	一般
英語表現2	2	2	必	一般
英語表現3	2	3	必	一般
英語A	2	4	選	一般
英語B	2	4	選	一般
中国語	2	4	選	一般
ドイツ語	2	4	選	一般
音楽	2	1	選必	一般
美術	2	1	選必	一般
書道	2	1	選必	一般
総合工学システム概論	1	1	必	専門
総合工学システム実験実習	4	1	必	専門
情報1	2	1	必	専門
情報2	2	2	必	専門
情報3	2	3	必	専門
ダイバーシティと人権	1	1	必	専門
多文化共生	1	4	必	専門
労働環境と人権	2	5	必	専門
技術倫理	2	5	必	専門
システム安全入門	1	5	選	専門
環境システム工学	1	5	選	専門
資源と産業	1	5	選	専門
環境倫理	1	5	選	専門
応用数学A	2	4	必	専門
応用数学B	2	4	必	専門
物理学A	2	4	必	専門
物理学B	2	4	必	専門
計測工学	2	5	必	専門
技術英語	2	5	必	専門
機械工学概論	1	2	必	専門
基礎製図	2	2	必	専門
電気・電子回路	1	2	必	専門
シーケンス制御	1	2	必	専門
機械工作実習1	4	2	必	専門
材料力学入門	1	3	必	専門
熱力学入門	1	3	必	専門
流体力学入門	1	3	必	専門
機械工作法	2	3	必	専門
CAD製図	2	3	必	専門
機械設計製図	2	3	必	専門
機械工作実習2	4	3	必	専門
材料力学	2	4	必	専門
熱力学	2	4	必	専門
流れ学	2	4	必	専門
機械力学	2	4	必	専門
エネルギー機械実験1	4	4	必	専門
機械設計	2	5	必	専門
伝熱工学	2	5	必	専門
流体工学	2	5	必	専門
生産加工工学	2	5	必	専門
制御工学	2	5	必	専門
エネルギー変換工学	2	5	必	専門
エネルギー機械実験2	2	5	必	専門
卒業研究	6	5	必	専門
応用専門概論	1	3	必	専門
応用専門PBL1	1	3	必	専門
応用専門PBL2	2	4	必	専門
インターンシップ	1	4	選	専門
生活と物質	1	4	選必	専門
社会と環境	1	4	選必	専門
物質プロセス基礎	2	4	選必	専門
食品エンジニアリング	2	5	選必	専門
コスメティックス	2	5	選必	専門
バイオテクノロジー	2	5	選必	専門
高純度化化学	2	5	選必	専門
物質デザイン概論	2	4	選必	専門
環境モニタリング	2	5	選必	専門
エネルギー変換デバイス	2	5	選必	専門
食と健康のセンサ	2	5	選必	専門
環境対応デバイス	2	5	選必	専門
防災工学	2	4	選必	専門
社会基盤構造	2	5	選必	専門
環境衛生工学	2	5	選必	専門
維持管理工学	2	5	選必	専門
水環境工学	2	5	選必	専門
エルゴノミクス	2	4	選必	専門
環境デザイン論	2	5	選必	専門
インクルーシブデザイン	2	5	選必	専門
環境情報学	2	5	選必	専門
環境行動	2	5	選必	専門
防災リテラシー	1	1	必	専門
特・特別活動1	0	1	必	その他
特・特別活動2	0	2	必	その他
特・特別活動3	0	3	必	その他`;

// Load current master data from storage
let STUDENTS_RAW = localStorage.getItem('gm_master_students') || DEFAULT_STUDENTS_RAW;
let SUBJECTS_RAW = localStorage.getItem('gm_master_subjects') || DEFAULT_SUBJECTS_RAW;

// ==================== STATE MANAGEMENT ====================
let state = {
    students: [],
    subjects: [], // List of subject objects
    scores: {}, // Key: StudentName, Value: { SubjectName: { EarlyMid: 80, ... } }
    currentStudent: null,
    currentYear: 1,
    currentTab: 'grades',
    hideEmptySubjects: true,
    boxPlotYear: null, // Year for box plot (null = auto-detect latest)
    boxPlotTest: null,  // Test for box plot (null = auto-detect latest)
    isLoggedIn: false,
    passwordHash: localStorage.getItem('gm_auth_hash') || null
};

const SCORE_KEYS = ["前期中間", "前期末", "後期中間", "学年末"];
const SCORE_KEYS_EN = ["earlyMid", "earlyFinal", "lateMid", "lateFinal"]; // map for object keys

// Current pasting target
let currentPasteKey = null;

// ==================== STATE PERSISTENCE ====================
function saveSessionState() {
    localStorage.setItem('gm_state_tab', state.currentTab);
    localStorage.setItem('gm_state_student', state.currentStudent || '');
    localStorage.setItem('gm_state_year', state.currentYear);
    localStorage.setItem('gm_state_hide_empty', state.hideEmptySubjects);
    localStorage.setItem('gm_state_boxplot_year', state.boxPlotYear || '');
    localStorage.setItem('gm_state_boxplot_test', state.boxPlotTest || '');

    // Auto-save the actual lists and scores so everything is remembered on reload
    localStorage.setItem('grade_manager_students', JSON.stringify(state.students));
    localStorage.setItem('gm_master_subjects_json', JSON.stringify(state.subjects));
    localStorage.setItem('grade_manager_scores', JSON.stringify(state.scores));
}

function loadSessionState() {
    const savedTab = localStorage.getItem('gm_state_tab');
    const savedStudent = localStorage.getItem('gm_state_student');
    const savedYear = localStorage.getItem('gm_state_year');
    const savedHideEmpty = localStorage.getItem('gm_state_hide_empty');
    const savedBPYear = localStorage.getItem('gm_state_boxplot_year');
    const savedBPTest = localStorage.getItem('gm_state_boxplot_test');

    if (savedTab) state.currentTab = savedTab;
    if (savedHideEmpty !== null) state.hideEmptySubjects = (savedHideEmpty === 'true');
    if (savedYear) state.currentYear = parseInt(savedYear);
    if (savedBPYear) state.boxPlotYear = parseInt(savedBPYear);
    if (savedBPTest) state.boxPlotTest = savedBPTest;

    // Ensure the student exists in the current list
    if (savedStudent && state.students.includes(savedStudent)) {
        state.currentStudent = savedStudent;
    } else if (state.students.length > 0) {
        state.currentStudent = state.students[0];
    } else {
        state.currentStudent = null;
    }
}

// ==================== INITIALIZATION ====================
function init() {
    setupEventListeners();
    refreshMasterData();
    mockData();

    // OPTIMIZATION: Clean up orphaned scores if they accumulate too much
    // (Prevents memory/storage bloat if many students were added/removed or due to the massive array bug)
    const scoreCount = Object.keys(state.scores).length;
    if (scoreCount > 1000 && scoreCount > state.students.length * 2) {
        const validNames = new Set(state.students);
        let removed = 0;
        for (const name in state.scores) {
            if (!validNames.has(name)) {
                delete state.scores[name];
                removed++;
            }
        }
        if (removed > 0) {
            console.log(`Cleaned up ${removed} orphaned score records to free memory.`);
            localStorage.setItem('grade_manager_scores', JSON.stringify(state.scores));
        }
    }

    // Restore persistent state
    loadSessionState();

    populateControls();

    // Only auto-detect year if we don't have a saved one
    if (!localStorage.getItem('gm_state_year')) {
        setDefaultYear();
    }

    // Auth check
    initAuth();
}

// ==================== AUTHENTICATION ====================
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function initAuth() {
    const overlay = document.getElementById('authOverlay');
    const setupView = document.getElementById('setupView');
    const loginView = document.getElementById('loginView');
    const logoutBtn = document.getElementById('logoutBtn');
    const mainApp = document.getElementById('mainApp');

    if (!state.passwordHash) {
        // No password set - First time setup
        mainApp.style.display = 'none';
        overlay.classList.add('open');
        setupView.style.display = 'block';
        loginView.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'none';
    } else if (!state.isLoggedIn) {
        // Password exists but not logged in
        mainApp.style.display = 'none';
        overlay.classList.add('open');
        setupView.style.display = 'none';
        loginView.style.display = 'block';
        if (logoutBtn) logoutBtn.style.display = 'none';
        document.getElementById('loginPass').focus();
    } else {
        // Logged in - Unlock the app
        mainApp.style.display = 'flex'; // sidebar layout uses flex
        overlay.classList.remove('open');
        overlay.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'inline-flex';
        switchTab(state.currentTab);
    }
}

async function handleLogin() {
    const passInput = document.getElementById('loginPass');
    const errorMsg = document.getElementById('loginError');
    const password = passInput.value;

    if (!password) {
        alert('パスワードを入力してください。');
        return;
    }

    const hash = await hashPassword(password);
    if (hash === state.passwordHash) {
        state.isLoggedIn = true;
        errorMsg.style.display = 'none';
        passInput.value = '';
        initAuth(); // This will reveal the main content and hide overlay
    } else {
        errorMsg.style.display = 'block';
        passInput.value = '';
        passInput.focus();
    }
}

async function handleSetup() {
    const p1 = document.getElementById('setupPass1').value;
    const p2 = document.getElementById('setupPass2').value;

    if (!p1 || p1.length < 4) {
        alert('パスワードは4文字以上で入力してください（これは新しく決めるパスワードです）。');
        return;
    }
    if (p1 !== p2) {
        alert('上の入力欄と下の確認用入力欄が一致しません。同じパスワードを2回入力してください。');
        return;
    }

    const hash = await hashPassword(p1);
    state.passwordHash = hash;
    state.isLoggedIn = true;
    localStorage.setItem('gm_auth_hash', hash);

    alert('パスワードを設定しました。今後はこのパスワードでログインしてください。');
    initAuth();
}

function handleLogout() {
    state.isLoggedIn = false;
    initAuth();
}

async function openPasswordChange() {
    // Safety check
    if (!state.passwordHash) {
        alert('現在パスワードは設定されていません。初期設定ページへ移動します。');
        initAuth();
        return;
    }

    const currentPass = prompt('【確認】現在のパスワードを入力してください:');
    if (currentPass === null) return;

    const currentHash = await hashPassword(currentPass);
    if (currentHash !== state.passwordHash) {
        alert('入力された「現在のパスワード」が正しくありません。変更を中断します。');
        return;
    }

    const newPass = prompt('【新規】新しく設定するパスワードを入力してください\n(空欄にして進むと、パスワード保護を「解除」できます):');
    if (newPass === null) return;

    if (newPass === '') {
        if (confirm('パスワード保護を解除してもよろしいですか？\n解除すると誰でもデータを見れるようになります。')) {
            state.passwordHash = null;
            localStorage.removeItem('gm_auth_hash');
            alert('パスワード保護を解除しました。');
            initAuth();
        }
    } else {
        if (newPass.length < 4) {
            alert('新しいパスワードは4文字以上で設定してください。');
            return;
        }
        const newHash = await hashPassword(newPass);
        state.passwordHash = newHash;
        localStorage.setItem('gm_auth_hash', newHash);
        alert('パスワードを新しく更新しました。');
    }
}

function setDefaultYear() {
    // Find the latest year that has actual grade data for the current student
    const yearsWithData = new Set();

    // Check which years have data for any student
    for (const studentName in state.scores) {
        const studentScores = state.scores[studentName];
        for (const subjectName in studentScores) {
            // Find the subject to get its year
            const subject = state.subjects.find(s => s.name === subjectName);
            if (subject && typeof subject.year === 'number') {
                // Check if there's any actual score data
                const scoreObj = studentScores[subjectName];
                const hasData = SCORE_KEYS.some(key => {
                    const val = scoreObj[key];
                    return val !== undefined && val !== null && val !== '';
                });
                if (hasData) {
                    yearsWithData.add(subject.year);
                }
            }
        }
    }

    // Set to the highest year with data, or default to 1
    if (yearsWithData.size > 0) {
        state.currentYear = Math.max(...Array.from(yearsWithData));
    } else {
        state.currentYear = 1;
    }

    // Update the year select dropdown
    const yearSelect = document.getElementById('yearSelect');
    if (yearSelect) {
        yearSelect.value = state.currentYear;
    }
}

function refreshMasterData() {
    // A. Students
    const storedStudents = localStorage.getItem('grade_manager_students');
    const initializedStr = localStorage.getItem('grade_manager_initialized');

    if (!initializedStr) {
        // ONLY on the very first visit ever: use default students
        state.students = DEFAULT_STUDENTS_RAW.replace(/\n/g, '').split(',').map(s => s.trim()).filter(s => s);
        localStorage.setItem('grade_manager_students', JSON.stringify(state.students));
        localStorage.setItem('grade_manager_initialized', 'true');
    } else if (storedStudents) {
        state.students = JSON.parse(storedStudents);
    } else {
        state.students = [];
    }

    // SAFETY CHECK: Prevent massive array freeze (Protection against user entering Student ID as No.)
    // If list is absurdly large (e.g. > 1000), it causes freezing in rendering and logic.
    if (state.students.length > 1000) {
        const originalCount = state.students.length;
        // 1. Try to keep only real names (remove placeholders)
        let cleaned = state.students.filter(s => s && !s.includes('(未登録 No.'));

        // 2. If still huge, hard truncate
        if (cleaned.length > 1000) {
            cleaned = cleaned.slice(0, 1000);
        }

        // Apply fix
        if (cleaned.length < originalCount) {
            state.students = cleaned;
            localStorage.setItem('grade_manager_students', JSON.stringify(state.students));
            // Defer alert to allow UI to render first/avoid blocking loop immediately? 
            // Better to alert immediately so they know why data changed.
            setTimeout(() => {
                alert(`※警告: 学生リストのデータサイズ異常を検出し、修復しました。\n(No.欄に学籍番号などを入力した可能性があります)\n\nRepaired abnormal data size (${originalCount} -> ${state.students.length} items).`);
            }, 100);
        }
    }

    // Fallback if currentStudent isn't set yet (will be overridden by init if saved)
    if (!state.currentStudent) {
        state.currentStudent = state.students[0] || null;
    }

    // B. Subjects
    state.subjects = [];

    // Try to load from JSON first (latest auto-saved state)
    const storedSubjectsJson = localStorage.getItem('gm_master_subjects_json');
    const rawSubjects = localStorage.getItem('gm_master_subjects') || DEFAULT_SUBJECTS_RAW;

    if (storedSubjectsJson) {
        state.subjects = JSON.parse(storedSubjectsJson);
    } else {
        const lines = rawSubjects.trim().split('\n');
        // Skip header and parse lines
        for (let i = 1; i < lines.length; i++) {
            let parts = lines[i].trim().split('\t');
            if (parts.length < 5) parts = lines[i].trim().split(/\s+/);

            if (parts.length >= 5) {
                state.subjects.push({
                    name: parts[0].trim(),
                    credits: parseInt(parts[1]),
                    year: parseInt(parts[2]),
                    type1: parts[3].trim(),
                    type2: parts[4].trim(),
                    exclude: parts.length > 5 ? (parts[5].trim() === '1') : false
                });
            }
        }
    }

    // If subjects still empty (bad data in storage), force defaults
    if (state.subjects.length === 0 && rawSubjects !== DEFAULT_SUBJECTS_RAW) {
        localStorage.removeItem('gm_master_subjects');
        refreshMasterData();
    }
}

function mockData() {
    const stored = localStorage.getItem('grade_manager_scores');
    if (stored) {
        state.scores = JSON.parse(stored);

        // Load custom subjects from storage
        const storedCustom = localStorage.getItem('grade_manager_custom_subjects');
        if (storedCustom) {
            const customSubjects = JSON.parse(storedCustom);
            customSubjects.forEach(customSub => {
                if (!state.subjects.find(s => normalizeStr(s.name) === normalizeStr(customSub.name))) {
                    state.subjects.push(customSub);
                }
            });
        }
    } else {
        // Initialize empty structure for all students
        state.students.forEach(student => {
            state.scores[student] = {};
        });
    }
}

function populateControls() {
    // 1. Student Select
    const studentSelect = document.getElementById('studentSelect');
    if (studentSelect) {
        studentSelect.innerHTML = ''; // IMPORTANT: Clear old options
        state.students.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s;
            opt.textContent = s;
            studentSelect.appendChild(opt);
        });
        studentSelect.value = state.currentStudent;
    }

    // 2. Year Select
    const yearSelect = document.getElementById('yearSelect');
    if (yearSelect) {
        yearSelect.value = state.currentYear;
    }

    // 3. Stats Controls
    const statsYearSelect = document.getElementById('boxPlotYearSelect');
    if (statsYearSelect) {
        // Sync stats year with current year initially
        if (!state.boxPlotYear) state.boxPlotYear = state.currentYear;
        statsYearSelect.value = state.boxPlotYear || '';
    }
}

function setupEventListeners() {
    document.getElementById('studentSelect').addEventListener('change', (e) => {
        state.currentStudent = e.target.value;
        saveSessionState();
        render();
    });

    document.getElementById('yearSelect').addEventListener('change', (e) => {
        state.currentYear = parseInt(e.target.value);
        saveSessionState();
        // Update box plot to show this year's data
        state.boxPlotYear = state.currentYear;
        state.boxPlotTest = null;
        render();
    });

    document.getElementById('hideEmptySubjects').addEventListener('change', (e) => {
        state.hideEmptySubjects = e.target.checked;
        saveSessionState();
        render();
    });

    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const tab = e.currentTarget.dataset.tab;
            switchTab(tab);
        });
    });

    document.getElementById('saveBtn').addEventListener('click', saveData);
    document.getElementById('printBtn').addEventListener('click', () => window.print());
    document.getElementById('exportJsonBtn').addEventListener('click', exportJson);

    // Import CSV
    document.getElementById('importBtn').addEventListener('click', () => {
        document.getElementById('csvFileInput').click();
    });
    document.getElementById('csvFileInput').addEventListener('change', handleFileUpload);

    // Clear All Data
    document.getElementById('clearBtn').addEventListener('click', clearAllData);

    // Paste Modal
    document.getElementById('closeModalBtn').addEventListener('click', closePasteModal);
    document.getElementById('cancelPasteBtn').addEventListener('click', closePasteModal);
    document.getElementById('applyPasteBtn').addEventListener('click', applyPaste);

    // Close modal on click outside
    document.getElementById('pasteModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('pasteModal')) closePasteModal();
    });

    // Box Plot Controls
    document.getElementById('boxPlotYearSelect').addEventListener('change', (e) => {
        const val = e.target.value;
        state.boxPlotYear = val ? parseInt(val) : null;
        saveSessionState();
        renderBoxPlot();
    });

    document.getElementById('boxPlotTestSelect').addEventListener('change', (e) => {
        state.boxPlotTest = e.target.value || null;
        saveSessionState();
        renderBoxPlot();
    });

    // Class Stats Listener
    document.getElementById('generateClassStatsBtn')?.addEventListener('click', () => {
        generateClassStats();
    });

    // Mobile tabs
    document.querySelectorAll('.mobile-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            const tabName = e.currentTarget.dataset.tab;
            switchTab(tabName);

            // Update mobile tab active state
            document.querySelectorAll('.mobile-tab').forEach(t => t.classList.remove('active'));
            e.currentTarget.classList.add('active');
        });
    });

    // Show/hide mobile tabs based on screen size
    function updateMobileTabsVisibility() {
        const mobileTabs = document.querySelector('.mobile-tabs');
        if (window.innerWidth <= 768) {
            mobileTabs.style.display = 'flex';
        } else {
            mobileTabs.style.display = 'none';
        }
    }

    // Initial check
    updateMobileTabsVisibility();

    // Window resize handler for charts and mobile tabs
    let resizeTimeout;
    window.addEventListener('resize', () => {
        // Debounce resize events to avoid excessive re-rendering
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Update mobile tabs visibility
            updateMobileTabsVisibility();

            // Re-render charts based on current tab to ensure optimal layout
            if (state.currentTab === 'stats') {
                renderBoxPlot();
                renderTrendChart();
            } else if (state.currentTab === 'stats2') {
                renderStats2();
            }
        }, 250); // Wait 250ms after resize stops
    });

    // Setting Editor Controls
    document.getElementById('addStudentBtn').addEventListener('click', addStudentSetting);
    document.getElementById('addSubjectBtn').addEventListener('click', () => openSubjectModal());
    document.getElementById('saveSubjectItemBtn').addEventListener('click', saveSubjectItem);
    document.getElementById('finalSaveSettingsBtn').addEventListener('click', saveFinalSettings);
    document.getElementById('restoreDefaultsBtn').addEventListener('click', restoreMasterDefaults);
    document.getElementById('changePassBtn').addEventListener('click', openPasswordChange);
    document.getElementById('headerHelpBtn').addEventListener('click', () => switchTab('help'));

    // Auth Listeners
    document.getElementById('doLoginBtn').addEventListener('click', handleLogin);
    document.getElementById('loginPass').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });
    document.getElementById('confirmSetupBtn').addEventListener('click', handleSetup);
    document.getElementById('setupPass2').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSetup();
    });
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);

    const exportStudentsBtn = document.getElementById('exportStudentsCsvBtn');
    if (exportStudentsBtn) {
        exportStudentsBtn.addEventListener('click', exportStudentsCsv);
    }
    const exportSubjectsBtn = document.getElementById('exportSubjectsCsvBtn');
    if (exportSubjectsBtn) {
        exportSubjectsBtn.addEventListener('click', exportSubjectsCsv);
    }

    const subjectSearch = document.getElementById('subjectSearchInput');
    if (subjectSearch) {
        subjectSearch.addEventListener('input', renderSettings);
    }

    const isSpecialCheckbox = document.getElementById('isSpecialSubject');
    if (isSpecialCheckbox) {
        isSpecialCheckbox.addEventListener('change', (e) => {
            const isSpecial = e.target.checked;
            const yearWrapper = document.getElementById('subjectYearWrapper');
            const type1Wrapper = document.getElementById('subjectType1Wrapper');
            if (yearWrapper) yearWrapper.style.display = isSpecial ? 'none' : 'flex';
            if (type1Wrapper) type1Wrapper.style.display = isSpecial ? 'none' : 'flex';
        });
    }
}

function switchTab(tabName) {
    // Update nav items
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    document.querySelector(`.nav-item[data-tab="${tabName}"]`)?.classList.add('active');

    // Update mobile tabs
    document.querySelectorAll('.mobile-tab').forEach(el => el.classList.remove('active'));
    document.querySelector(`.mobile-tab[data-tab="${tabName}"]`)?.classList.add('active');

    // Safety: close any open modals when switching tabs
    document.getElementById('subjectModal')?.classList.remove('open');
    document.getElementById('pasteModal')?.classList.remove('open');

    // Add tab-specific class to body for CSS targeting (especially for print)
    document.body.className = `tab-${tabName}`;

    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.getElementById(`${tabName}-content`).classList.remove('hidden');

    state.currentTab = tabName;
    saveSessionState();

    // Handle Rendering based on tab
    if (tabName === 'grades') {
        renderGradesTable();
    } else if (tabName === 'stats') {
        renderStats();
    } else if (tabName === 'stats2') {
        renderStats2();
    } else if (tabName === 'class_stats') {
        initClassStats();
    } else if (tabName === 'settings') {
        renderSettings();
    }
}

function saveData() {
    // Save both scores and custom subjects (including special studies)
    const customSubjects = state.subjects.filter(s => s.name.startsWith('特・'));
    localStorage.setItem('grade_manager_scores', JSON.stringify(state.scores));
    localStorage.setItem('grade_manager_custom_subjects', JSON.stringify(customSubjects));
    localStorage.setItem('grade_manager_students', JSON.stringify(state.students));
    alert('データが保存されました (Data Saved)');
}

function clearAllData() {
    // Confirm before clearing
    const confirmed = confirm(
        '本当に全てのデータをクリアしますか？\n' +
        'この操作は取り消せません。\n\n' +
        'Are you sure you want to clear all data?\n' +
        'This action cannot be undone.'
    );

    if (confirmed) {
        // Clear EVERYTHING
        localStorage.clear();

        // Explicitly set as initialized but EMPTY students
        localStorage.setItem('grade_manager_initialized', 'true');
        localStorage.setItem('grade_manager_students', JSON.stringify([]));

        alert('学生名を含め、全てのデータと設定がクリアされました。');
        location.reload();
    }
}

function exportJson() {
    // Prepare data for export
    const customSubjects = state.subjects.filter(s => s.name.startsWith('特・'));

    const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        scores: state.scores,
        customSubjects: customSubjects
    };

    // Convert to JSON string with pretty formatting
    const jsonString = JSON.stringify(exportData, null, 2);

    // Create blob and download
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;

    // Generate filename with current date
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
    a.download = `grade_manager_data_${dateStr}.json`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert('JSONファイルをダウンロードしました (JSON file downloaded)');
}

function renderSettings() {
    // 1. Render Students (List style)
    const studentsList = document.getElementById('studentsList');
    studentsList.innerHTML = '';
    state.students.forEach((s, idx) => {
        const item = document.createElement('div');
        item.style.cssText = 'display: flex; align-items: center; justify-content: space-between; background: white; padding: 0.6rem 0.8rem; border-radius: 0.5rem; border: 1px solid #e2e8f0; font-size: 0.9rem; transition: all 0.2s;';
        item.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.6rem;">
                <div style="width: 24px; height: 24px; background: #f1f5f9; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; color: #64748b;">${idx + 1}</div>
                <span style="font-weight: 500;">${s}</span>
            </div>
            <div style="display: flex; gap: 0.2rem;">
                <button onclick="editStudentSetting(${idx})" style="border:none; background:none; color:#94a3b8; cursor:pointer; padding: 0.2rem; display: flex;" title="編集">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button onclick="removeStudentSetting(${idx})" style="border:none; background:none; color:#94a3b8; cursor:pointer; padding: 0.2rem; display: flex;" title="削除">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
        `;
        studentsList.appendChild(item);
    });

    // 2. Render Subjects (Grouped List)
    const container = document.getElementById('subjectsGroupedList');
    container.innerHTML = '';

    const searchQuery = document.getElementById('subjectSearchInput')?.value.toLowerCase() || '';

    // Filter and Group
    const filtered = state.subjects.filter(s => {
        return s.name.toLowerCase().includes(searchQuery) ||
            s.type1?.toLowerCase().includes(searchQuery) ||
            s.type2?.toLowerCase().includes(searchQuery);
    });

    const groups = {};
    filtered.forEach(sub => {
        // Exclude Special Studies
        if (sub.name.startsWith('特・') && sub.type2 !== 'その他') return;
        // Exclude Others
        if (sub.type2 === 'その他') return;

        if (!groups[sub.year]) groups[sub.year] = [];
        groups[sub.year].push(sub);
    });

    // 2. Render Normal Subjects (Years 1 to 5)
    for (let year = 1; year <= 5; year++) {
        if (!groups[year] && searchQuery) continue;

        const yearGroup = document.createElement('div');
        const listId = `year-${year}-list`;
        yearGroup.innerHTML = `
            <h3 style="font-size: 1.15rem; border-left: 5px solid var(--primary); padding: 0.2rem 0 0.2rem 1rem; margin-bottom: 1.2rem; color: #1e293b; margin-top: 2rem; display: flex; align-items: center; justify-content: space-between;">
                <span>${year}年生</span>
                <span style="font-size: 0.85rem; font-weight: normal; color: #64748b; background: #f1f5f9; padding: 0.2rem 0.6rem; border-radius: 999px;">
                    ${groups[year]?.length || 0} 科目
                </span>
            </h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.2rem;" id="${listId}"></div>
        `;
        container.appendChild(yearGroup);

        const listContainer = yearGroup.querySelector(`#${listId}`);
        if (groups[year] && groups[year].length > 0) {
            // Sort: Specialized (専門) first, then General (一般), then alphabetical
            groups[year].sort((a, b) => {
                const typeA = a.type2 || '';
                const typeB = b.type2 || '';

                // If one is specialized and other is not, specialized comes first
                if (typeA.includes('専門') && !typeB.includes('専門')) return -1;
                if (!typeA.includes('専門') && typeB.includes('専門')) return 1;

                // Otherwise alphabetical
                return a.name.localeCompare(b.name);
            }).forEach(sub => {
                const card = document.createElement('div');
                card.style.cssText = 'background: white; border: 1px solid #e2e8f0; border-radius: 0.8rem; padding: 1.2rem; position: relative; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.05); display: flex; flex-direction: column; gap: 0.8rem;';
                card.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <span style="font-weight: 600; color: #1e293b; font-size: 1rem; line-height: 1.3;">${sub.name}</span>
                        <div style="display: flex; gap: 0.5rem; flex-shrink: 0;">
                            <button class="btn-icon" onclick="openSubjectModal('${sub.name.replace(/'/g, "\\'")}')" title="編集">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            </button>
                            <button class="btn-icon" style="color: #cbd5e1;" onclick="removeSubjectSetting('${sub.name.replace(/'/g, "\\'")}')" title="削除">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        </div>
                    </div>
                    <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
                        <span style="background: #eff6ff; color: #3b82f6; padding: 0.15rem 0.6rem; border-radius: 0.4rem; font-size: 0.75rem; font-weight: 500;">${sub.credits} 単位</span>
                        <span style="background: #f8fafc; color: #64748b; padding: 0.15rem 0.6rem; border-radius: 0.4rem; font-size: 0.75rem; border: 1px solid #f1f5f9;">${sub.type1 || '-'}</span>
                        <span style="background: #f8fafc; color: #64748b; padding: 0.15rem 0.6rem; border-radius: 0.4rem; font-size: 0.75rem; border: 1px solid #f1f5f9;">${sub.type2 || '-'}</span>
                        ${sub.exclude ? '<span style="background: #fee2e2; color: #ef4444; padding: 0.15rem 0.6rem; border-radius: 0.4rem; font-size: 0.75rem;">GPA対象外</span>' : ''}
                    </div>
                `;
                listContainer.appendChild(card);
            });
        } else if (!searchQuery) {
            listContainer.innerHTML = `
                <div style="grid-column: 1 / -1; background: #f8fafc; border: 1px dashed #e2e8f0; border-radius: 0.8rem; padding: 2rem; text-align: center; color: #94a3b8; font-size: 0.9rem;">
                    登録されている科目はありません
                </div>
            `;
        }
    }

    // 3. Render Others (Special Activities etc.)
    const othersGroup = document.createElement('div');
    othersGroup.innerHTML = `
        <h3 style="font-size: 1.15rem; border-left: 5px solid #8b5cf6; padding: 0.2rem 0 0.2rem 1rem; margin-bottom: 1.2rem; color: #1e293b; margin-top: 3rem; display: flex; align-items: center; justify-content: space-between;">
            <span>その他・特別活動 (Others)</span>
            <span style="font-size: 0.85rem; font-weight: normal; color: #5b21b6; background: #f3e8ff; padding: 0.2rem 0.6rem; border-radius: 999px;">
                ${state.subjects.filter(s => s.type2 === 'その他').length} 科目
            </span>
        </h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.2rem;" id="others-subjects-list"></div>
    `;
    container.appendChild(othersGroup);

    const othersList = othersGroup.querySelector('#others-subjects-list');
    const othersSubjects = state.subjects.filter(s => s.type2 === 'その他');

    if (othersSubjects.length > 0) {
        othersSubjects.sort((a, b) => {
            // Sort by year first, then name
            if (a.year !== b.year) return a.year - b.year;
            return a.name.localeCompare(b.name);
        }).forEach(sub => {
            const card = document.createElement('div');
            card.style.cssText = 'background: #f3e8ff; border: 1px solid #d8b4fe; border-radius: 0.8rem; padding: 1.2rem; position: relative; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.05); display: flex; flex-direction: column; gap: 0.8rem;';
            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                        <span style="font-weight: 600; color: #5b21b6; font-size: 1rem; line-height: 1.3;">${sub.name.replace('特・', '')}</span>
                    </div>
                    <div style="display: flex; gap: 0.5rem; flex-shrink: 0;">
                        <button class="btn-icon" style="background: #ede9fe;" onclick="openSubjectModal('${sub.name.replace(/'/g, "\\'")}')" title="編集">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button class="btn-icon" style="background: #ede9fe; color: #8b5cf6;" onclick="removeSubjectSetting('${sub.name.replace(/'/g, "\\'")}')" title="削除">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                    </div>
                </div>
                <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
                    <span style="background: white; color: #64748b; padding: 0.15rem 0.6rem; border-radius: 0.4rem; font-size: 0.75rem; border: 1px solid #e2e8f0;">${sub.year}年</span>
                    <span style="background: white; color: #64748b; padding: 0.15rem 0.6rem; border-radius: 0.4rem; font-size: 0.75rem; border: 1px solid #e2e8f0;">${sub.credits} 単位</span>
                    ${sub.exclude ? '<span style="background: #fee2e2; color: #ef4444; padding: 0.15rem 0.6rem; border-radius: 0.4rem; font-size: 0.75rem;">GPA対象外</span>' : ''}
                </div>
            `;
            othersList.appendChild(card);
        });
    } else {
        othersList.innerHTML = '<div style="grid-column: 1 / -1; background: #f3e8ff; border: 1px dashed #d8b4fe; border-radius: 0.8rem; padding: 2rem; text-align: center; color: #6b21a8; font-size: 0.9rem;">その他・特別活動の登録はありません</div>';
    }

    // 4. Render Special Studies Subjects
    const specialGroup = document.createElement('div');
    specialGroup.innerHTML = `
        <h3 style="font-size: 1.15rem; border-left: 5px solid #f59e0b; padding: 0.2rem 0 0.2rem 1rem; margin-bottom: 1.2rem; color: #1e293b; margin-top: 3rem; display: flex; align-items: center; justify-content: space-between;">
            <span>特別学修科目 (Special Studies)</span>
            <span style="font-size: 0.85rem; font-weight: normal; color: #b45309; background: #fffbeb; padding: 0.2rem 0.6rem; border-radius: 999px;">
                ${state.subjects.filter(s => s.name.startsWith('特・') && s.type2 !== 'その他').length} 科目
            </span>
        </h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.2rem;" id="special-subjects-list"></div>
    `;
    container.appendChild(specialGroup);

    const specialList = specialGroup.querySelector('#special-subjects-list');
    const specialSubjects = state.subjects.filter(s => s.name.startsWith('特・') && s.type2 !== 'その他');

    if (specialSubjects.length > 0) {
        specialSubjects.sort((a, b) => a.name.localeCompare(b.name)).forEach(sub => {
            const card = document.createElement('div');
            card.style.cssText = 'background: #fffbeb; border: 1px solid #fde68a; border-radius: 0.8rem; padding: 1.2rem; position: relative; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.05); display: flex; flex-direction: column; gap: 0.8rem;';
            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                        <span style="font-weight: 600; color: #92400e; font-size: 1rem; line-height: 1.3;">${sub.name.replace('特・', '')}</span>
                    </div>
                    <div style="display: flex; gap: 0.5rem; flex-shrink: 0;">
                        <button class="btn-icon" style="background: #fef3c7;" onclick="openSubjectModal('${sub.name.replace(/'/g, "\\'")}')" title="編集">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button class="btn-icon" style="background: #fef3c7; color: #f59e0b;" onclick="removeSubjectSetting('${sub.name.replace(/'/g, "\\'")}')" title="削除">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                    </div>
                </div>
                <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-top: 0.5rem;">
                     <span style="background: white; color: #b45309; padding: 0.15rem 0.6rem; border-radius: 0.4rem; font-size: 0.75rem; border: 1px solid #fde68a;">${sub.credits} 単位</span>
                     ${sub.exclude ? '<span style="background: #fee2e2; color: #ef4444; padding: 0.15rem 0.6rem; border-radius: 0.4rem; font-size: 0.75rem;">GPA対象外</span>' : ''}
                </div>
            `;
            specialList.appendChild(card);
        });
    } else {
        specialList.innerHTML = '<div style="grid-column: 1 / -1; background: #fffbeb; border: 1px dashed #fde68a; border-radius: 0.8rem; padding: 2rem; text-align: center; color: #b45309; font-size: 0.9rem;">特別学修科目の登録はありません</div>';
    }
}

// Helper to keep placeholder names consistent with their indices
function updatePlaceholderNames() {
    state.students = state.students.map((name, i) => {
        if (typeof name === 'string' && name.startsWith('(未登録 No.')) {
            return `(未登録 No.${i + 1})`;
        }
        return name;
    });
}

function addStudentSetting() {
    const idInput = document.getElementById('newStudentId');
    const nameInput = document.getElementById('newStudentName');
    const id = parseInt(idInput.value);
    const name = nameInput.value.trim();

    if (!name) return;

    // Prevent massive array creation via user error (e.g. typing Student ID "221001" into No field)
    const MAX_STUDENTS = 500;
    if (!isNaN(id) && id > 0) {
        if (id > MAX_STUDENTS) {
            alert(`No.が大きすぎます (最大 ${MAX_STUDENTS})。\n学籍番号ではなく、表示順の連番(1, 2, 3...)を入力してください。`);
            return;
        }
        // Check for massive gap (e.g. adding No.100 when currently only 5 students)
        if (id > state.students.length + 20) {
            if (!confirm(`現在の人数(${state.students.length}名)から大きく離れたNo.(${id})を追加しようとしています。\n間に多数の「未登録」データが作成されますが、続行しますか？`)) {
                return;
            }
        }
    }

    if (!isNaN(id) && id > 0) {
        const idx = id - 1;

        if (idx < state.students.length) {
            // "り下がり挿入" (Shift-down insertion) instead of overwrite
            state.students.splice(idx, 0, name);
        } else {
            // Fill gaps if number is much larger
            while (state.students.length < idx) {
                state.students.push(`(未登録 No.${state.students.length + 1})`);
            }
            state.students[idx] = name;
        }

        updatePlaceholderNames();
        idInput.value = id + 1; // Auto-increment
    } else {
        state.students.push(name);
        if (!isNaN(id)) idInput.value = state.students.length + 1;
    }

    saveSessionState();
    nameInput.value = '';
    nameInput.focus();
    renderSettings();
}

function editStudentSetting(idx) {
    const currentName = state.students[idx];
    const newName = prompt(`No.${idx + 1} の学生名を編集します:`, currentName);
    if (newName !== null) {
        const trimmed = newName.trim();
        if (trimmed) {
            const isRenamingCurrent = (state.students[idx] === state.currentStudent);
            state.students[idx] = trimmed;

            if (isRenamingCurrent) {
                state.currentStudent = trimmed;
            }

            saveSessionState();
            renderSettings();
        }
    }
}

function removeStudentSetting(idx) {
    const nameToRemove = state.students[idx];
    if (confirm(`学生「${nameToRemove}」を削除しますか？`)) {
        state.students.splice(idx, 1);

        // "繰り上がり更新" (Update numbers/shift up)
        updatePlaceholderNames();

        // If we deleted the current student, pick a new one
        if (state.currentStudent === nameToRemove) {
            state.currentStudent = state.students[0] || null;
        }

        saveSessionState();
        renderSettings();
    }
}

function openSubjectModal(subjectName = null) {
    const modal = document.getElementById('subjectModal');
    const title = document.getElementById('subjectModalTitle');
    const form = document.getElementById('subjectForm');

    form.reset();

    if (subjectName) {
        title.textContent = '科目の編集';
        const sub = state.subjects.find(s => s.name === subjectName);
        if (sub) {
            const isSpecial = sub.name.startsWith('特・');
            document.getElementById('editSubjectOldName').value = sub.name;
            document.getElementById('subjectNameInput').value = isSpecial ? sub.name.replace('特・', '') : sub.name;
            document.getElementById('subjectCreditsInput').value = sub.credits;
            document.getElementById('subjectYearInput').value = sub.year;
            document.getElementById('subjectType1Input').value = sub.type1 || '';
            document.getElementById('subjectType2Input').value = sub.type2 || '';
            document.getElementById('isSpecialSubject').checked = isSpecial;
            document.getElementById('excludeFromGpa').checked = sub.exclude || false;

            // Hide year and type1 for special subjects
            document.getElementById('subjectYearWrapper').style.display = isSpecial ? 'none' : 'flex';
            document.getElementById('subjectType1Wrapper').style.display = isSpecial ? 'none' : 'flex';
        }
    } else {
        title.textContent = '新規科目の追加';
        document.getElementById('editSubjectOldName').value = '';
        document.getElementById('subjectNameInput').value = '';
        document.getElementById('subjectCreditsInput').value = 0;
        document.getElementById('subjectYearInput').value = 0;
        document.getElementById('subjectType1Input').value = '';
        document.getElementById('subjectType2Input').value = '';
        document.getElementById('subjectType2Input').value = '';
        document.getElementById('isSpecialSubject').checked = false;
        document.getElementById('excludeFromGpa').checked = false;
        document.getElementById('subjectYearWrapper').style.display = 'flex';
        document.getElementById('subjectType1Wrapper').style.display = 'flex';
    }

    modal.classList.add('open');
}

function closeSubjectModal() {
    document.getElementById('subjectModal').classList.remove('open');
}

function saveSubjectItem() {
    const oldName = document.getElementById('editSubjectOldName').value;
    let newName = document.getElementById('subjectNameInput').value.trim();
    let credits = parseInt(document.getElementById('subjectCreditsInput').value);
    let year = parseInt(document.getElementById('subjectYearInput').value);
    const type1Input = document.getElementById('subjectType1Input');
    let type1 = type1Input.value;
    const type2 = document.getElementById('subjectType2Input').value.trim();
    const isSpecial = document.getElementById('isSpecialSubject').checked;
    const exclude = document.getElementById('excludeFromGpa').checked;

    if (isNaN(credits)) credits = 0;
    if (isNaN(year) || isSpecial) year = 0; // Special subjects don't need a year
    if (isSpecial) type1 = '特別学修'; // Force type 1 for special subjects

    // Ensure '特・' prefix matches the checkbox state
    if (isSpecial) {
        if (!newName.startsWith('特・')) newName = '特・' + newName;
    } else {
        if (newName.startsWith('特・')) newName = newName.replace(/^特・/, '');
    }

    // Required check: Only Name is strictly required text-wise. 
    // Numeric values default to 0 above if empty.
    if (!newName) {
        alert('科目名を入力してください。');
        return;
    }

    if (oldName) {
        // Edit existing
        if (oldName !== newName && state.subjects.find(s => s.name === newName)) {
            alert('変更後の科目名は既に存在します。');
            return;
        }

        const idx = state.subjects.findIndex(s => s.name === oldName);
        if (idx !== -1) {
            state.subjects[idx] = { name: newName, credits, year, type1, type2, exclude };
        }

        // Migrate scores if name changed (e.g., normal <-> Special Study)
        if (oldName !== newName) {
            for (const student in state.scores) {
                if (state.scores[student][oldName]) {
                    state.scores[student][newName] = state.scores[student][oldName];
                    delete state.scores[student][oldName];
                }
            }
        }
    } else {
        // Add new
        if (state.subjects.find(s => s.name === newName)) {
            alert('その科目名は既に存在します。');
            return;
        }
        state.subjects.push({ name: newName, credits, year, type1, type2, exclude });
    }

    saveSessionState();
    closeSubjectModal();
    renderSettings();
}

function exportStudentsCsv() {
    if (state.students.length === 0) {
        alert('出力する学生がいません。');
        return;
    }

    // Prepare CSV content (Standard format: one name per line with header)
    const BOM = '\uFEFF'; // Add BOM for Excel compatibility
    const header = '学生名';
    const csvContent = BOM + [header, ...state.students].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    const timestamp = new Date().toISOString().slice(0, 10);
    link.setAttribute('href', url);
    link.setAttribute('download', `students_list_${timestamp}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function exportSubjectsCsv() {
    if (state.subjects.length === 0) {
        alert('出力する科目がありません。');
        return;
    }

    const BOM = '\uFEFF';
    const header = ['授業科目', '単位', '学年', '種別1', '種別2'].join(',');
    const rows = state.subjects.map(s => [
        s.name,
        s.credits,
        s.year,
        s.type1 || '',
        s.type2 || ''
    ].join(','));

    const csvContent = BOM + [header, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    const timestamp = new Date().toISOString().slice(0, 10);
    link.setAttribute('href', url);
    link.setAttribute('download', `subjects_list_${timestamp}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


function removeSubjectSetting(subjectName) {
    if (confirm(`科目「${subjectName}」を削除しますか？`)) {
        state.subjects = state.subjects.filter(s => s.name !== subjectName);
        saveSessionState();
        renderSettings();
    }
}

function saveFinalSettings() {
    if (state.students.length === 0) {
        alert('学生リストが空です。少なくとも1名は登録してください。');
        return;
    }

    if (confirm('すべての変更を確定保存して、アプリケーションを再読み込みしますか？')) {
        // 1. Save students string for master
        const studentsRaw = state.students.join(',');
        localStorage.setItem('gm_master_students', studentsRaw);

        // 2. Save subjects string for master
        // Format: Name\tCredits\tYear\tType1\tType2\tExclude
        const header = "授業科目\t単位\t学年\t種別1\t種別2\t除外";
        const rows = state.subjects
            .map(s => `${s.name}\t${s.credits}\t${s.year}\t${s.type1 || ''}\t${s.type2 || ''}\t${s.exclude ? '1' : ''}`);
        const subjectsRaw = [header, ...rows].join('\n');
        localStorage.setItem('gm_master_subjects', subjectsRaw);

        // 3. Mark as initialized
        localStorage.setItem('grade_manager_initialized', 'true');

        // 4. Update the actual current session student list
        localStorage.setItem('grade_manager_students', JSON.stringify(state.students));

        // 5. Success and Reload
        alert('設定を保存しました。再読み込みします。');
        location.reload();
    }
}

function restoreMasterDefaults() {
    if (confirm('科目定義をデフォルトに戻し、学生リストを空にしますか？\n(現在の編集内容は失われます。保存済みの成績データは維持されます。)')) {
        localStorage.removeItem('gm_master_subjects');
        // Set students to empty but keep initialized flag so they don't come back
        localStorage.setItem('grade_manager_students', JSON.stringify([]));
        localStorage.setItem('grade_manager_initialized', 'true');

        alert('学生リストを削除し、科目定義をリセットしました。');
        location.reload();
    }
}

function handleJsonImport(file) {
    const reader = new FileReader();
    reader.onload = function (evt) {
        try {
            const jsonData = JSON.parse(evt.target.result);

            // Validate JSON structure
            if (!jsonData.scores) {
                throw new Error('Invalid JSON format: missing scores data');
            }

            // Import scores
            state.scores = jsonData.scores;

            // Import custom subjects if available
            if (jsonData.customSubjects && Array.isArray(jsonData.customSubjects)) {
                jsonData.customSubjects.forEach(customSub => {
                    // Only add if not already in the list
                    if (!state.subjects.find(s => normalizeStr(s.name) === normalizeStr(customSub.name))) {
                        state.subjects.push(customSub);
                    }
                });
            }

            // Save to localStorage
            saveData();

            // Set default year based on imported data
            setDefaultYear();

            // Re-render
            render();

            const importDate = jsonData.exportDate ? new Date(jsonData.exportDate).toLocaleString() : '不明';
            alert(`JSONファイルを読み込みました\nエクスポート日時: ${importDate}\n\nJSON file imported\nExport date: ${importDate}`);

        } catch (err) {
            alert(`JSONファイルの読み込みに失敗しました\nエラー: ${err.message}\n\nFailed to import JSON file\nError: ${err.message}`);
        }
    };
    reader.readAsText(file);
}

function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Check file extension
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith('.json')) {
        // Handle JSON file
        handleJsonImport(file);
        e.target.value = ''; // Clear input
        return;
    }

    // Handle CSV file (existing logic)
    const reader = new FileReader();
    reader.onload = function (evt) {
        const text = evt.target.result;
        try {
            const rows = text.replace(/\r/g, '').split('\n').map(row => row.split(','));
            if (rows.length < 2) throw new Error("Empty or invalid CSV");

            const header = rows[0];

            // CASE 1: Students List (students.csv)
            // Header: 名前
            if (header[0].trim() === '名前') {
                const newStudents = [];
                rows.slice(1).forEach(row => {
                    if (row.length > 0 && row[0].trim() !== '') {
                        newStudents.push(row[0].trim());
                    }
                });

                if (newStudents.length > 0) {
                    state.students = newStudents;
                    // Reset current student if not in new list
                    if (!state.students.includes(state.currentStudent)) {
                        state.currentStudent = state.students[0];
                    }
                    saveSessionState(); // ENSURE THIS IS PERSISTED
                    populateControls(); // Refresh dropdown
                    render();
                    alert(`学生リストを読み込みました: ${newStudents.length} 名`);
                }
                e.target.value = ''; // Clear input
                return;
            }

            // CASE 2: Subject Definitions List
            // Header: 授業科目, 単位, 学年, 種別1, 種別2
            if (header.length <= 6 && header[0].trim() === '授業科目') {
                const newSubjects = [];
                rows.slice(1).forEach(row => {
                    if (row.length < 3) return;
                    const name = row[0].trim();
                    if (!name) return;

                    newSubjects.push({
                        name: name,
                        credits: parseInt(row[1]) || 0,
                        year: parseInt(row[2]) || 1,
                        type1: row[3]?.trim() || '',
                        type2: row[4]?.trim() || ''
                    });
                });

                if (newSubjects.length > 0) {
                    if (confirm('現在の科目リストを上書きしますか？\n(現在の科目は削除され、CSVの内容に置き換わります。)')) {
                        state.subjects = newSubjects;
                        renderSettings();
                        alert(`科目リストを読み込みました: ${newSubjects.length} 科目`);
                    }
                }
                e.target.value = '';
                return;
            }

            // CASE 3: Scores List (student_scores.csv)
            // Header: 授業科目, ..., 学生名
            if (header[0] !== '授業科目') {
                // Relaxed check: if it's not students.csv and doesn't look like scores or subjects
                throw new Error("不明なCSV形式です。ヘッダーを確認してください。");
            }

            let count = 0;
            rows.slice(1).forEach(row => {
                if (row.length < 10) return;
                const subjectName = row[0].trim();
                const studentName = row[9].trim();
                if (!subjectName || !studentName) return;

                // Helper to safely parse int, handling full-width chars and quotes
                const safeParseInt = (val) => {
                    if (val === undefined || val === null) return NaN;
                    // Remove surrounding quotes if present, handling Excel CSV export
                    let s = String(val).trim().replace(/^["']|["']$/g, '');
                    // Full-width to half-width
                    s = s.replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0));
                    return parseInt(s, 10);
                };

                const normalizeName = (name) => {
                    let s = String(name).trim().replace(/^["']|["']$/g, '');
                    return s.replace(/\s+/g, ' ').replace(/　/g, ' ').trim();
                };

                const csvCredits = safeParseInt(row[1]);
                const csvYear = safeParseInt(row[2]);

                // Normalize name for lookup
                const normalizedSubjectName = normalizeName(subjectName);
                let subject = state.subjects.find(s => normalizeName(s.name) === normalizedSubjectName);

                if (!subject) {
                    // Add new subject
                    const newSubject = {
                        name: subjectName, // Use original name or normalized? Original is usually safer for display, but lookup needs norm.
                        credits: !isNaN(csvCredits) ? csvCredits : 0,
                        year: !isNaN(csvYear) ? csvYear : 1,
                        type1: row[3] || '不明',
                        type2: row[4] || '一般'
                    };
                    state.subjects.push(newSubject);
                } else {
                    // Update existing
                    // Only update credits if we have a valid positive number (prevent overwriting with 0)
                    if (!isNaN(csvCredits) && csvCredits > 0 && subject.credits !== csvCredits) {
                        subject.credits = csvCredits;
                    }
                    if (!isNaN(csvYear) && subject.year !== csvYear) {
                        subject.year = csvYear;
                    }
                    if (row[3] && subject.type1 !== row[3]) subject.type1 = row[3];
                    if (row[4] && subject.type2 !== row[4]) subject.type2 = row[4];
                }

                if (!state.scores[studentName]) state.scores[studentName] = {};
                if (!state.scores[studentName][subjectName]) state.scores[studentName][subjectName] = {};

                const keys = ["前期中間", "前期末", "後期中間", "学年末"];
                const indices = [5, 6, 7, 8];

                indices.forEach((idx, i) => {
                    const scoreKey = keys[i];
                    const val = row[idx].trim();
                    let cleanVal = val === '-' ? '' : val;

                    if (cleanVal !== '') {
                        updateScore(studentName, subjectName, scoreKey, cleanVal);
                    }
                });
                count++;
            });

            alert(`成績データを読み込みました: ${count} 件\n(Imported ${count} records)`);
            render();
            // Clear input
            e.target.value = '';
        } catch (err) {
            alert(`エラー: ${err.message}`);
            e.target.value = '';
        }
    };
    reader.readAsText(file);
}

// ==================== RENDERING ====================
function render() {
    updatePrintHeader();

    if (state.currentTab === 'grades') {
        renderGradesTable();
    } else if (state.currentTab === 'stats') {
        renderStats();
    } else if (state.currentTab === 'stats2') {
        renderStats2();
    } else if (state.currentTab === 'class_stats') {
        initClassStats();
    } else if (state.currentTab === 'settings') {
        renderSettings();
    }
}

function updatePrintHeader() {
    const titleEl = document.getElementById('print-report-title');
    const nameEl = document.getElementById('print-student-name');
    const dateEl = document.getElementById('print-date');

    if (titleEl) {
        const titles = {
            'grades': '成績一覧 (Grades List)',
            'stats': '統計・推移レポート (Stats & Trend Report)',
            'stats2': '累積推移レポート (Cumulative Stats Report)',
            'class_stats': '全体統計・順位帳票 (Class Statistics Report)'
        };
        titleEl.textContent = titles[state.currentTab] || '成績管理システム';
    }

    if (nameEl) {
        if (state.currentTab === 'class_stats') {
            nameEl.parentElement.style.display = 'none'; // Don't show student name on class-wide report
        } else {
            nameEl.parentElement.style.display = 'block';
            nameEl.textContent = state.currentStudent || '-';
        }
    }

    if (dateEl) {
        const now = new Date();
        dateEl.textContent = now.toLocaleString();
    }
}

// Chart instance variables
let stats2ChartInstance = null;
let stats2RankChartInstance = null;

function renderStats2() {
    const tbody = document.getElementById('stats2Body');
    tbody.innerHTML = '';
    const currentStudent = state.currentStudent;

    const simpleAvgData = [];
    const weightedAvgData = [];
    const gpaData = [];

    const rankSimpleData = [];
    const rankWeightedData = [];
    const rankGpaData = [];

    const labels = ["1年", "2年", "3年", "4年", "5年"];

    // --- Helpers ---

    // 1. Check if a year is "Finished" for a student
    // Definition: All subjects registered for this year have a "Year End" (学年末) score.
    // (Or simpler: If "Year End" exists for the *majority*? Let's be strict: if any subject has data but no Year End, it's In Progress.
    //  Actually, safest is: If 'Year End' exists for ANY subject, assume finished? No, that's partial.
    //  Let's stick to the prompt implication: "Year End exam finished" -> Results available.
    //  Let's check if the specific subject has Year End.
    //  But the policy applies to the *Grade*.
    //  Logic: If the student has ANY score for a later year, this year is definitely Finished.
    //  If this is the latest year, check if Year End scores are populated.
    const isYearFinished = (studentName, year) => {
        // Check availability of next year data
        const subjectsNext = state.subjects.filter(s => s.year === year + 1 && !s.exclude);
        let hasNextData = false;
        for (const sub of subjectsNext) {
            const keys = ["学年末", "後期中間", "前期末", "前期中間"];
            for (const k of keys) {
                const v = getScore(studentName, sub.name, k);
                if (v !== undefined && v !== null && v !== '') { hasNextData = true; break; }
            }
            if (hasNextData) break;
        }
        if (hasNextData) return true;

        // If no next year data, check this year's "Year End" completeness
        // If > 50% of registered subjects have Year End, consider it Finished? 
        // Or simply: If we have ANY "Year End" score, treat as finished? 
        // Given the request "Grades where Year End is not finished", implies current active term.
        // Let's assume if there is ANY "Year End" score, it's finished. (Simple trigger).
        // User might paste all Year End scores at once.
        const subjects = state.subjects.filter(s => s.year === year && !s.exclude);
        if (subjects.length === 0) return true; // No subjects = finished/skipped

        let hasYearEnd = false;
        for (const sub of subjects) {
            const v = getScore(studentName, sub.name, '学年末');
            if (v !== undefined && v !== null && v !== '') {
                hasYearEnd = true;
                break;
            }
        }
        return hasYearEnd;
    };


    // 2. Get Stats for "Term A" (Current Year, All Regular Exams)
    const getTermA = (studentName, year) => {
        let sum = 0;
        let count = 0;
        let wSum = 0;
        let creds = 0;
        let gpWSum = 0;
        let gpCreds = 0;

        const subjects = state.subjects.filter(s => s.year === year && !s.exclude);

        subjects.forEach(sub => {
            // Average of all available regular exams for this subject
            const keys = ["学年末", "後期中間", "前期末", "前期中間"];
            let subValSum = 0;
            let subValCount = 0;

            keys.forEach(k => {
                const v = getScore(studentName, sub.name, k);
                if (v !== undefined && v !== null && v !== '' && !isNaN(parseFloat(v))) {
                    subValSum += parseFloat(v);
                    subValCount++;
                }
            });

            if (subValCount > 0) {
                const subAvg = subValSum / subValCount; // Unweighted average of exams

                sum += subAvg;
                count++;

                const c = sub.credits || 0;
                wSum += subAvg * c;
                creds += c;

                let gp = 0;
                if (subAvg >= 90) gp = 4.0;
                else if (subAvg >= 80) gp = 3.0;
                else if (subAvg >= 70) gp = 2.0;
                else if (subAvg >= 60) gp = 1.0;
                else gp = 0.0;

                gpWSum += gp * c;
                gpCreds += c;
            }
        });

        if (count === 0) return null;

        return {
            simple: sum / count,
            weighted: creds > 0 ? (wSum / creds) : 0,
            gpa: gpCreds > 0 ? (gpWSum / gpCreds) : 0
        };
    };

    // 3. Get Stats for "Term B" (Cumulative Year End up to limitYear)
    const getTermB = (studentName, limitYear) => {
        let sum = 0;
        let count = 0;
        let wSum = 0;
        let creds = 0;
        let gpWSum = 0;
        let gpCreds = 0;

        const subjects = state.subjects.filter(s => s.year <= limitYear && !s.exclude);

        subjects.forEach(sub => {
            // ONLY Year End scores
            const v = getScore(studentName, sub.name, '学年末');
            if (v !== undefined && v !== null && v !== '' && !isNaN(parseFloat(v))) {
                const val = parseFloat(v);
                sum += val;
                count++;

                const c = sub.credits || 0;
                wSum += val * c;
                creds += c;

                let gp = 0;
                if (val >= 90) gp = 4.0;
                else if (val >= 80) gp = 3.0;
                else if (val >= 70) gp = 2.0;
                else if (val >= 60) gp = 1.0;
                else gp = 0.0;

                gpWSum += gp * c;
                gpCreds += c;
            }
        });

        if (count === 0) return null;
        return {
            simple: sum / count,
            weighted: creds > 0 ? (wSum / creds) : 0,
            gpa: gpCreds > 0 ? (gpWSum / gpCreds) : 0
        };
    };

    // Combined Stats Calculation
    const getStudentFinalStats = (studentName, year) => {
        // Check if ANY data exists for this year
        const subjects = state.subjects.filter(s => s.year === year && !s.exclude);
        let hasAnyData = false;
        for (const sub of subjects) {
            const keys = ["学年末", "後期中間", "前期末", "前期中間"];
            for (const k of keys) {
                const v = getScore(studentName, sub.name, k);
                if (v !== undefined && v !== null && v !== '') { hasAnyData = true; break; }
            }
            if (hasAnyData) break;
        }

        if (!hasAnyData) return { hasData: false };

        // Policy Check
        // If finished: Use Term B (Cumulative up to current year) - wait, "That grade's final grades".
        // Re-reading Policy 1: "Grades where Year End is finished -> Final grades (Year End)". 
        // Does it mean Cumulative up to Year? Or Just This Year?
        // Context: "Stats 2" was "Cumulative". 
        // I will assume Policy 1 is: Term B(year). (Cumulative Year End).

        const finished = isYearFinished(studentName, year);

        if (finished) {
            // Policy 1
            const res = getTermB(studentName, year);
            return { hasData: res !== null, ...res };
        } else {
            // Policy 2
            // Average of (Term A(year)) and (Term B(year-1))
            const termA = getTermA(studentName, year);

            // Term B is cumulative up to year-1
            // If year=1, Term B is null (or 0?). 
            // If year=1 in progress, we basically just show Term A.
            let termB = null;
            if (year > 1) {
                termB = getTermB(studentName, year - 1);
            }

            if (!termA) return { hasData: false }; // No current data

            if (!termB) {
                // Only Term A available
                return { hasData: true, ...termA };
            } else {
                // Average of A and B
                return {
                    hasData: true,
                    simple: (termA.simple + termB.simple) / 2,
                    weighted: (termA.weighted + termB.weighted) / 2,
                    gpa: (termA.gpa + termB.gpa) / 2
                };
            }
        }
    };


    // --- Main Loop ---
    for (let targetYear = 1; targetYear <= 5; targetYear++) {

        // 1. Calculate for ALL students (for Ranking)
        const allStats = state.students.map(s => {
            const stats = getStudentFinalStats(s, targetYear);
            return { name: s, ...stats };
        });

        // 2. Current Student
        const myStats = allStats.find(s => s.name === currentStudent);

        // 3. Ranks
        let rSimple = null, rWeighted = null, rGpa = null;
        if (myStats && myStats.hasData) {
            // Simple
            const vSimple = allStats.filter(s => s.hasData && s.simple !== undefined).sort((a, b) => b.simple - a.simple);
            const iSimple = vSimple.findIndex(s => s.name === currentStudent);
            if (iSimple !== -1) rSimple = iSimple + 1;

            // Weighted
            const vWeighted = allStats.filter(s => s.hasData && s.weighted !== undefined).sort((a, b) => b.weighted - a.weighted);
            const iWeighted = vWeighted.findIndex(s => s.name === currentStudent);
            if (iWeighted !== -1) rWeighted = iWeighted + 1;

            // GPA
            const vGpa = allStats.filter(s => s.hasData && s.gpa !== undefined).sort((a, b) => b.gpa - a.gpa);
            const iGpa = vGpa.findIndex(s => s.name === currentStudent);
            if (iGpa !== -1) rGpa = iGpa + 1;
        }

        // 4. Push Chart Data
        // Policy 3: If no data, do not display (push null)
        if (myStats && myStats.hasData) {
            simpleAvgData.push(myStats.simple);
            weightedAvgData.push(myStats.weighted);
            gpaData.push(myStats.gpa);
            rankSimpleData.push(rSimple);
            rankWeightedData.push(rWeighted);
            rankGpaData.push(rGpa);
        } else {
            simpleAvgData.push(null);
            weightedAvgData.push(null);
            gpaData.push(null);
            rankSimpleData.push(null);
            rankWeightedData.push(null);
            rankGpaData.push(null);
        }

        // 5. Render Table (If data exists)
        if (myStats && myStats.hasData) {
            // Count helper (just for display)
            // Show count of subjects involved in Term A (Current Year)
            // Or Total Cumulative Subjects?
            // "Subject Count" implies total subjects counted.
            // If In Progress: Subjects in Term A + Subjects in Term B?
            // Let's count subjects in Year <= targetYear that have any valid score used.
            let subCount = 0;
            const subjects = state.subjects.filter(s => s.year <= targetYear && !s.exclude);
            subjects.forEach(sub => {
                const k = ["学年末", "後期中間", "前期末", "前期中間"];
                for (const key of k) {
                    if (getScore(currentStudent, sub.name, key) !== null) { subCount++; break; }
                }
            });

            const totalStudents = state.students.length;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="text-align:center;">${targetYear}年</td>
                <td style="text-align:center;">${subCount}</td>
                <td style="text-align:center;">${myStats.simple.toFixed(2)}</td>
                <td style="text-align:center;">${rSimple ? rSimple + ' / ' + totalStudents : '-'}</td>
                <td style="text-align:center;">${myStats.weighted.toFixed(2)}</td>
                <td style="text-align:center;">${rWeighted ? rWeighted + ' / ' + totalStudents : '-'}</td>
                <td style="text-align:center; font-weight:bold; color:#2563eb;">${myStats.gpa.toFixed(2)}</td>
                <td style="text-align:center;">${rGpa ? rGpa + ' / ' + totalStudents : '-'}</td>
            `;
            tbody.appendChild(tr);
        }
    }

    // --- Chart 1: Scores & GPA ---
    const ctx = document.getElementById('stats2Chart')?.getContext('2d');
    if (ctx) {
        if (stats2ChartInstance) stats2ChartInstance.destroy();
        stats2ChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: '平均点 (単純)',
                        data: simpleAvgData,
                        borderColor: '#2563eb', // Blue
                        backgroundColor: '#2563eb',
                        yAxisID: 'y',
                        tension: 0.1,
                        borderWidth: 2
                    },
                    {
                        label: '平均点 (加重)',
                        data: weightedAvgData,
                        borderColor: '#f59e0b', // Amber
                        backgroundColor: '#f59e0b',
                        yAxisID: 'y',
                        tension: 0.1,
                        borderWidth: 2,
                        borderDash: [5, 5] // Dashed for distinction
                    },
                    {
                        label: 'GPA',
                        data: gpaData,
                        borderColor: '#2563eb',
                        backgroundColor: '#2563eb',
                        yAxisID: 'y1',
                        tension: 0.1,
                        borderWidth: 3, // Very thick for GPA
                        pointStyle: 'rectRot' // Different marker
                    }
                ]
            },
            plugins: [{
                id: 'plotAreaBorder',
                beforeDraw(chart) {
                    const { ctx, chartArea: { top, bottom, left, right } } = chart;
                    ctx.save();
                    ctx.strokeStyle = '#000000'; // Clear black border
                    ctx.lineWidth = 1.5;
                    ctx.strokeRect(left, top, right - left, bottom - top);
                    ctx.restore();
                }
            }],
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 50,
                        bottom: 10
                    }
                },
                plugins: {
                    title: { display: true, text: '平均点・GPA推移', font: { weight: 'bold', size: 16 } },
                    legend: { display: false }
                },
                scales: {
                    x: {
                        grid: { display: true, color: 'rgba(0,0,0,0.15)' },
                        border: { display: true, color: '#000', width: 1.5 },
                        ticks: {
                            color: '#000',
                            minRotation: 90,
                            maxRotation: 90,
                            autoSkip: false
                        },
                        afterFit: (axis) => { axis.height = 80; }
                    },
                    y: {
                        type: 'linear',
                        position: 'left',
                        min: 0,
                        max: 100,
                        title: { display: true, text: '点数', font: { weight: 'bold' } },
                        grid: { color: 'rgba(0,0,0,0.2)' },
                        border: { display: true, color: '#000', width: 1.5 },
                        ticks: { color: '#000' },
                        afterFit: (axis) => { axis.width = 60; }
                    },
                    y1: {
                        type: 'linear',
                        position: 'right',
                        min: 0,
                        max: 4.0,
                        grid: { drawOnChartArea: false },
                        title: { display: true, text: 'GPA', font: { weight: 'bold' } },
                        border: { display: true, color: '#000', width: 1.5 },
                        ticks: { color: '#000' },
                        afterFit: (axis) => { axis.width = 60; }
                    }
                }
            }
        });
    }

    // --- Chart 2: Rank ---
    const ctx2 = document.getElementById('stats2RankChart')?.getContext('2d');
    if (ctx2) {
        if (stats2RankChartInstance) stats2RankChartInstance.destroy();
        stats2RankChartInstance = new Chart(ctx2, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: '順位 (単純)',
                        data: rankSimpleData,
                        borderColor: '#64748b', // Gray
                        backgroundColor: '#64748b',
                        tension: 0.1,
                        borderWidth: 2,
                        pointRadius: 4
                    },
                    {
                        label: '順位 (加重)',
                        data: rankWeightedData,
                        borderColor: '#f59e0b', // Amber
                        backgroundColor: '#f59e0b',
                        tension: 0.1,
                        borderWidth: 2,
                        pointRadius: 4
                    },
                    {
                        label: '順位 (GPA)',
                        data: rankGpaData,
                        borderColor: '#2563eb', // Blue
                        backgroundColor: '#2563eb',
                        tension: 0.1,
                        borderWidth: 3,
                        pointRadius: 4
                    }
                ]
            },
            plugins: [{
                id: 'plotAreaBorder',
                beforeDraw(chart) {
                    const { ctx, chartArea: { top, bottom, left, right } } = chart;
                    ctx.save();
                    ctx.strokeStyle = '#000000'; // Black border
                    ctx.lineWidth = 1.5;
                    ctx.strokeRect(left, top, right - left, bottom - top);
                    ctx.restore();
                }
            }],
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 50,
                        bottom: 10
                    }
                },
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    title: { display: true, text: '順位推移 (Rank Trend)', font: { size: 16, weight: 'bold' } },
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return `${context.dataset.label}: ${context.parsed.y}位 / ${state.students.length}人`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: true, color: 'rgba(0,0,0,0.15)' },
                        border: { display: true, color: '#000', width: 1.5 },
                        ticks: {
                            color: '#000',
                            minRotation: 90,
                            maxRotation: 90,
                            autoSkip: false
                        },
                        afterFit: (axis) => { axis.height = 80; }
                    },
                    y: {
                        type: 'linear',
                        reverse: true,
                        min: 1,
                        max: state.students.length > 10 ? state.students.length : 10,
                        title: { display: true, text: '順位 (位)', font: { weight: 'bold' } },
                        grid: { color: 'rgba(0,0,0,0.2)' },
                        border: { display: true, color: '#000', width: 1.5 },
                        ticks: { color: '#000' },
                        afterFit: (axis) => { axis.width = 60; }
                    },
                    yPaddingRight: {
                        type: 'linear',
                        position: 'right',
                        display: true,
                        title: { display: false },
                        ticks: { display: false },
                        grid: { drawOnChartArea: false },
                        border: { display: false },
                        afterFit: (axis) => { axis.width = 60; }
                    }
                }
            }
        });
    }
}

// Event listener for toggle


function renderGradesTable() {
    const tbody = document.getElementById('gradesBody');
    const specialTbody = document.getElementById('specialGradesBody');
    const otherTbody = document.getElementById('otherGradesBody');

    tbody.innerHTML = '';
    specialTbody.innerHTML = '';
    if (otherTbody) otherTbody.innerHTML = '';

    const subjects = state.subjects.filter(s => s.year === state.currentYear);
    const studentScores = state.scores[state.currentStudent] || {};

    subjects.forEach(sub => {
        // Filter logic: if hiding empty, check if ANY score exists for this subject
        if (state.hideEmptySubjects) {
            const scoreObj = studentScores[sub.name];
            if (!scoreObj) return; // Student does not have this subject initialized

            // Check for ANY value in any slot (applies to Normal, Special, and Others)
            const hasValue = SCORE_KEYS.some(key => {
                const val = scoreObj[key];
                return val !== undefined && val !== null && val !== '';
            });

            if (!hasValue) return; // Skip this subject if no data exists
        }

        let targetTbody = tbody;
        let isSpecialRow = false;

        if (sub.type2 === 'その他') {
            targetTbody = otherTbody;
            isSpecialRow = true;
        } else if (sub.name.startsWith('特・')) {
            targetTbody = specialTbody;
            isSpecialRow = true;
        } else {
            targetTbody = tbody;
            isSpecialRow = false;
        }

        if (isSpecialRow) {
            // Special Studies / Others: Simplified Row
            // Columns: Subject, Credits, Type1, Type2, Approval (uses '学年末' as representative slot)
            const trSpecial = document.createElement('tr');
            let typeBadgeClass = 'badge-gray';
            if (sub.type1 === '特別学修') typeBadgeClass = 'badge-orange';
            else if (sub.type1 === '必') typeBadgeClass = 'badge-blue';
            else if (sub.type1 === '選必') typeBadgeClass = 'badge-success';

            // Get actual value from data (prefer '学年末' - Final, or any existing)
            const scoreObj = studentScores[sub.name] || {};
            let currentVal = scoreObj['学年末'] || '';
            if (!currentVal) {
                // Fallback: search other keys if Final is empty
                for (const k of SCORE_KEYS) {
                    if (scoreObj[k]) { currentVal = scoreObj[k]; break; }
                }
            }

            // Create cell content
            const tdStatus = document.createElement('td');
            tdStatus.style.textAlign = 'center';

            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'score-input';
            input.style.textAlign = 'center';
            input.style.width = '60px';
            input.value = currentVal;
            input.placeholder = sub.name.includes('特別活動') ? '履' : '認'; // STATUS FIX: "履" for Special Activities

            input.addEventListener('change', (e) => {
                const newVal = e.target.value;
                // For simplified subjects, we save to '学年末' (Final) as the primary key
                updateScore(state.currentStudent, sub.name, '学年末', newVal);
            });

            tdStatus.appendChild(input);

            trSpecial.innerHTML = `
                <td><div style="font-weight:600">${sub.name}</div></td>
                <td style="text-align:center"><span class="badge badge-gray">${sub.credits}</span></td>
                <td style="text-align:center"><span class="badge ${typeBadgeClass}">${sub.type1}</span></td>
                <td style="text-align:center">${sub.type2}</td>
            `;
            trSpecial.appendChild(tdStatus);
            targetTbody.appendChild(trSpecial);
        } else {
            // Normal Subject (includes 'Others')
            const tr = document.createElement('tr');

            let typeBadgeClass = 'badge-gray';
            if (sub.type1 === '必') typeBadgeClass = 'badge-blue';
            else if (sub.type1 === '選必') typeBadgeClass = 'badge-success';

            tr.innerHTML = `
                <td><div style="font-weight:600">${sub.name}</div></td>
                <td style="text-align:center"><span class="badge badge-gray">${sub.credits}</span></td>
                <td style="text-align:center"><span class="badge ${typeBadgeClass}">${sub.type1}</span></td>
                <td style="text-align:center">${sub.type2}</td>
            `;

            SCORE_KEYS.forEach(key => {
                const td = document.createElement('td');
                td.style.textAlign = 'center';

                const scoreObj = studentScores[sub.name] || {};
                const val = scoreObj[key] !== undefined ? scoreObj[key] : '';

                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'score-input';
                input.value = val;

                validateInput(input, val, sub.name);

                input.addEventListener('change', (e) => {
                    const newVal = e.target.value;
                    updateScore(state.currentStudent, sub.name, key, newVal);
                    validateInput(e.target, newVal, sub.name);
                });

                td.appendChild(input);
                tr.appendChild(td);
            });
            if (targetTbody) targetTbody.appendChild(tr);
        }
    });

    const pasteIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>`;

    const headers = document.querySelectorAll('th');
    // 1. Normal Subjects Table: 4 Tests (Index 4-7)
    SCORE_KEYS.forEach((key, i) => {
        const h = headers[4 + i];
        if (h) {
            h.classList.add('clickable-header');
            h.title = "クリックして一括貼り付け";
            h.onclick = () => openPasteModal(key);
            if (!h.querySelector('.paste-icon')) {
                const icon = document.createElement('span');
                icon.className = 'paste-icon';
                icon.innerHTML = pasteIconSvg;
                h.prepend(icon);
            }
        }
    });

    // 2. Special Studies Table: Approval (Index 12)
    const specialHeader = headers[12];
    if (specialHeader && specialHeader.textContent === '認定') {
        specialHeader.classList.add('clickable-header');
        specialHeader.title = "クリックして一括貼り付け";
        specialHeader.onclick = () => openPasteModal('学年末');
        if (!specialHeader.querySelector('.paste-icon')) {
            const icon = document.createElement('span');
            icon.className = 'paste-icon';
            icon.innerHTML = pasteIconSvg;
            specialHeader.prepend(icon);
        }
    }

    // 3. Others Table: Approval (Index 17)
    const otherHeader = headers[17];
    if (otherHeader && otherHeader.textContent === '認定') {
        otherHeader.classList.add('clickable-header');
        otherHeader.title = "クリックして一括貼り付け";
        otherHeader.onclick = () => openPasteModal('学年末');
        if (!otherHeader.querySelector('.paste-icon')) {
            const icon = document.createElement('span');
            icon.className = 'paste-icon';
            icon.innerHTML = pasteIconSvg;
            otherHeader.prepend(icon);
        }
    }
}

// Helper to identify subjects that are numeric (0-100 scores)
function isNumericSubject(name) {
    if (!name) return false;
    // Exclude experiments, practical training, graduation research, and disaster literacy
    return !name.match(/(実験|実習|卒業研究|防災リテラシー)/);
}

function validateInput(input, value, subjectName) {
    if (value === '') return;

    // If subject is non-numeric, don't validate as number
    if (subjectName && !isNumericSubject(subjectName)) {
        input.classList.remove('low-score');
        // Optional: Highlight 'Fail' values red
        if (['否', '不可', 'D', 'Fail', 'F'].includes(value)) {
            input.style.color = 'red';
            input.style.fontWeight = 'bold';
        } else {
            input.style.color = 'inherit';
            input.style.fontWeight = 'normal';
        }
        return;
    }

    const num = parseFloat(value);
    if (!isNaN(num)) {
        if (num < 60) {
            input.classList.add('low-score');
            input.style.color = 'red';
            input.style.fontWeight = 'bold';
        } else {
            input.classList.remove('low-score');
            input.style.color = 'inherit';
            input.style.fontWeight = 'normal';
        }
    }
}

function updateScore(student, subject, key, value) {
    if (!state.scores[student]) state.scores[student] = {};
    if (!state.scores[student][subject]) state.scores[student][subject] = {};

    // Only parse as float if it's a numeric subject and looks like a number
    if (isNumericSubject(subject) && value !== '' && !isNaN(value)) {
        state.scores[student][subject][key] = parseFloat(value);
    } else {
        state.scores[student][subject][key] = value;
    }

    // Global auto-save on every keystroke/change
    saveSessionState();
}

// ==================== PASTE LOGIC ====================

function openPasteModal(key) {
    currentPasteKey = key;
    document.getElementById('modalTitle').textContent = `${key} の成績貼り付け`;
    document.getElementById('pasteArea').value = '';
    document.getElementById('pasteModal').classList.add('open');
    document.getElementById('pasteArea').focus();
}

function closePasteModal() {
    document.getElementById('pasteModal').classList.remove('open');
    currentPasteKey = null;
}

function normalizeStr(s) {
    if (!s) return "";
    return String(s).trim().replace(/\s/g, '').replace(/　/g, '');
}

function applyPaste() {
    if (!currentPasteKey) return;

    const content = document.getElementById('pasteArea').value;
    const lines = content.split('\n');
    let currentYear = null;
    let currentCategory = null;
    let updatedCount = 0;
    let addedCount = 0;

    const student = state.currentStudent;
    if (!state.scores[student]) state.scores[student] = {};

    const subjectMap = {};
    state.subjects.forEach(s => {
        subjectMap[normalizeStr(s.name)] = s;
    });

    lines.forEach(line => {
        line = line.trim();
        if (!line) return;

        const yearMatch = line.match(/(\d)年/);
        if (yearMatch) {
            currentYear = parseInt(yearMatch[1]);
            return;
        }

        if (line.match(/^(授業科目|一般科目|専門科目|その他)/)) {
            if (line.includes("一般科目")) currentCategory = "一般";
            else if (line.includes("専門科目")) currentCategory = "専門";
            else currentCategory = null;
            return;
        }

        const parts = line.split('\t');
        if (parts.length < 3) return;

        const subjectName = parts[0].trim();
        const unitStr = parts[1].trim();

        // Handling flexible column layouts:
        // Standard: Subject \t Credits \t Score \t Evaluation
        // Variation: Subject \t Credits \t Score
        // Priority for Special/Others: Evaluation (Col 3) > Score (Col 2)
        // Priority for Others: Score (Col 2)

        const scoreStr = parts[2].trim();
        const evalStr = parts.length > 3 ? parts[3].trim() : '';

        const normName = normalizeStr(subjectName);
        let existingSub = state.subjects.find(s => normalizeStr(s.name) === normName);

        // Fuzzy Match: Try adding "特・" prefix if not found (common for Special Activities)
        if (!existingSub) {
            existingSub = state.subjects.find(s => normalizeStr(s.name) === "特・" + normName);
        }

        if (existingSub) {
            if (!state.scores[student][existingSub.name]) state.scores[student][existingSub.name] = {};

            // LOGIC for value selection
            let valToSet = null;

            // 1. If it's "Special Activities" (Special/Others), prioritize 'Evaluation' column (e.g. '履')
            if (existingSub.name.includes('特別活動') || existingSub.type2 === 'その他' || existingSub.name.startsWith('特・')) {
                if (evalStr && (evalStr === '履' || evalStr === '認' || evalStr === '修')) {
                    valToSet = evalStr;
                } else if (!isNumericSubject(existingSub.name)) {
                    // If standard score column has text like 'R' or '履', take it
                    valToSet = scoreStr;
                } else {
                    // Fallback
                    valToSet = scoreStr;
                }
            } else {
                // 2. Normal Numeric Subjects: Prioritize Score column
                valToSet = scoreStr;
            }

            // Save the value
            // Note: Validation (parseFloat) is handled in updateScore or here?
            // updateScore handles parsing if numeric subject.
            // But here we need to be careful not to overwrite with garbage.

            if (valToSet !== null && valToSet !== '' && valToSet !== '-') {
                // For simplified subjects (Special/Others), we typically bind to '学年末' in the UI.
                // So if we are pasting into any column, correct it to '学年末' OR ensure UI reads from all.
                // Since render logic PRIORITIZES '学年末' but falls back, saving to the pasted key (e.g. '後期中間') is technically fine,
                // BUT if we want to ensure it shows up in the single input box which binds to '学年末' on change,
                // it's safer to save to '学年末' for these specific subjects.
                let targetKey = currentPasteKey;
                if (existingSub.name.includes('特別活動') || existingSub.type2 === 'その他' || existingSub.name.startsWith('特・')) {
                    targetKey = '学年末';
                }
                updateScore(student, existingSub.name, targetKey, valToSet);
                updatedCount++;
            }
        } else {
            // New Subject Creation Logic (omitted, effectively ignored here)
        }
    });
    closePasteModal();
    render();
    alert(`貼り付け完了\n更新: ${updatedCount}件\n追加: ${addedCount}件`);
}

// ==================== STATISTICS ====================
let boxPlotInstance = null;
let trendChartInstance = null;

function renderStats() {
    const tbody = document.getElementById('statsBody');
    tbody.innerHTML = '';

    // Iterate years 1 to 5 (as in Python version)
    // Needs cumulative calculation for credits

    let cumGeneral = 0;
    let cumSpecial = 0;
    let cumTotal = 0;

    const promotionUnits = { 1: 27, 2: 62, 3: 97, 4: 136, 5: 167 };

    for (let year = 1; year <= 5; year++) {
        // Find subject data for this year
        const subjects = state.subjects.filter(s => s.year === year);
        if (subjects.length === 0) continue;

        // Row
        const tr = document.createElement('tr');

        // 1. Year
        tr.innerHTML = `<td style="font-weight:bold; position:sticky; left:0; background:white; z-index:1; border-right:1px solid #e2e8f0;">${year}年</td>`;

        // 2-9. Scores & Ranks for 4 tests
        SCORE_KEYS.forEach(key => {
            let studentTotal = 0;
            let count = 0;
            subjects.forEach(sub => {
                if (sub.name.startsWith('特・')) return;
                // Exclude non-numeric subjects from Average/Rank calc
                if (!isNumericSubject(sub.name)) return;

                const s = getScore(state.currentStudent, sub.name, key);
                if (typeof s === 'number') {
                    studentTotal += s;
                    count++;
                }
            });

            const avg = count > 0 ? (studentTotal / count).toFixed(1) : "";
            const rank = count > 0 ? calculateRank(year, key, state.currentStudent) : "";

            const avgClass = (avg !== "" && parseFloat(avg) < 60) ? 'color:red;' : '';

            // Create cells without click functionality
            const avgTd = document.createElement('td');
            avgTd.style.textAlign = 'center';
            avgTd.style.borderLeft = '1px solid #e2e8f0';
            avgTd.style.cssText += avgClass;
            avgTd.textContent = avg;

            const rankTd = document.createElement('td');
            rankTd.style.textAlign = 'center';
            rankTd.textContent = rank;

            tr.appendChild(avgTd);
            tr.appendChild(rankTd);
        });

        // 10-12. Cumulative Credits
        // Calculate credits for THIS year first
        let currentYearGeneral = 0;
        let currentYearSpecial = 0;

        subjects.forEach(sub => {
            const score = getScore(state.currentStudent, sub.name, '学年末');
            // Support both numeric pass (>=60) and string pass
            let passed = false;
            if (typeof score === 'number') {
                passed = score >= 60;
            } else if (typeof score === 'string' && score.trim() !== '') {
                // Check if it is a known Pass string or NOT a known Fail string
                // Known Fails: 否, 不可, D, F, Fail
                // Known Passes: 合, 合格, 認, 認定, A, B, C
                const s = score.trim();
                if (['合', '合格', '認', '認定', 'A', 'B', 'C', '履'].includes(s)) passed = true;
                else if (!['否', '不可', 'D', 'F', 'Fail'].includes(s)) passed = true; // Assume pass if not fail? Safest is explicit.

                // Explicit check for Special Study default value "認"
                if (s === '認') passed = true;
            }

            // Special handling for Special Studies: strict pass if record exists?
            // Since UI forces "認", we should treat existence of record as pass for stats to match UI.
            if (sub.name.startsWith('特・')) {
                const scoreEntry = state.scores[state.currentStudent] && state.scores[state.currentStudent][sub.name];
                // If entry exists (meaning it was in CSV for this student), count it.
                if (scoreEntry) passed = true;
            }

            if (passed) {
                if (sub.type2 === '専門') currentYearSpecial += sub.credits;
                else currentYearGeneral += sub.credits;
            }
        });

        cumGeneral += currentYearGeneral;
        cumSpecial += currentYearSpecial;
        cumTotal = cumGeneral + cumSpecial;

        tr.innerHTML += `<td style="text-align:center; border-left:1px solid #e2e8f0;">${cumGeneral}</td>`;
        tr.innerHTML += `<td style="text-align:center;">${cumSpecial}</td>`;
        tr.innerHTML += `<td style="text-align:center; font-weight:bold;">${cumTotal}</td>`;

        // 13-14. Promotion
        const required = promotionUnits[year] || 0;
        const shortfall = cumTotal - required;
        const shortFallClass = shortfall < 0 ? 'color:red; font-weight:bold;' : '';

        tr.innerHTML += `<td style="text-align:center; border-left:1px solid #e2e8f0;">${required}</td>`;
        tr.innerHTML += `<td style="text-align:center; ${shortFallClass}">${shortfall}</td>`;

        // 15. Overall Rank (based on Total Score of Final Exam for current year)
        // Python: cum_total_scores = sum(学年末) for current year
        const overallRank = calculateOverallRank(year, state.currentStudent);
        tr.innerHTML += `<td style="text-align:center; border-left:1px solid #e2e8f0;">${overallRank}</td>`;

        tbody.appendChild(tr);
    }

    renderTrendChart();
    renderBoxPlot();
}

function calculateOverallRank(year, targetStudent) {
    // Only numeric, normal subjects count for Overall Rank
    const subjects = state.subjects.filter(s => s.year === year && isNumericSubject(s.name) && !s.name.startsWith('特・'));
    if (subjects.length === 0) return "";

    const sums = [];
    state.students.forEach(s => {
        let total = 0;
        let count = 0;
        subjects.forEach(sub => {
            const sc = getScore(s, sub.name, '学年末');
            if (typeof sc === 'number') {
                total += sc;
                count++;
            }
        });
        if (count > 0) {
            sums.push({ name: s, total });
        }
    });

    sums.sort((a, b) => b.total - a.total);
    const idx = sums.findIndex(x => x.name === targetStudent);
    return idx !== -1 ? `${idx + 1} / ${sums.length}` : "";
}

function getScore(student, subject, key) {
    if (state.scores[student] && state.scores[student][subject]) {
        return state.scores[student][subject][key];
    }
    return null;
}

function calculateRank(year, key, targetStudent) {
    // Only normal subjects
    const subs = state.subjects.filter(sub => sub.year === year && !sub.name.startsWith('特・'));

    // Calc avg for each student
    const avgs = [];
    state.students.forEach(s => {
        let total = 0;
        let count = 0;
        subs.forEach(sub => {
            const val = getScore(s, sub.name, key);
            if (typeof val === 'number') {
                total += val;
                count++;
            }
        });
        if (count > 0) avgs.push({ name: s, val: total / count });
    });

    avgs.sort((a, b) => b.val - a.val);
    const idx = avgs.findIndex(x => x.name === targetStudent);
    if (idx !== -1) return idx + 1;
    return "";
}

function calculateCredits(student, year) {
    // Keep definition as it might be used elsewhere or remove if unused, 
    // but better to keep for safety if referenced by old code.
    // Logic is now duplicated inside renderStats for loop.
    return {};
}

// ---------------- CHARTS ----------------

// 1. Box Plot (Latest Test)
function renderBoxPlot() {
    const canvas = document.getElementById('boxPlotChart');
    const container = canvas.parentElement;

    // Clear previous usage
    if (boxPlotInstance) {
        boxPlotInstance.destroy();
        boxPlotInstance = null;
    }

    // Clear specific error messages
    const oldError = container.querySelector('.chart-message');
    if (oldError) oldError.remove();

    if (typeof Chart === 'undefined') {
        showChartMessage(container, 'ライブラリ(Chart.js)のロードに失敗しました', true);
        return;
    }

    try {
        // Determine which year and test to display
        let latestYear = state.boxPlotYear;
        let latestTest = state.boxPlotTest;

        // If not set, auto-detect latest
        if (!latestYear || !latestTest) {
            // Determine Latest Test Context
            // Search backward from 5年 to 1年, and 学年末 to 前期中間
            const years = [5, 4, 3, 2, 1];
            const tests = [...SCORE_KEYS].reverse(); // 学年末 -> 前期中間

            // Find the latest test that has ANY data
            yearLoop: for (const y of years) {
                const subs = state.subjects.filter(s => s.year === y && !s.name.startsWith('特・'));
                if (subs.length === 0) continue;

                for (const t of tests) {
                    let hasData = false;
                    for (const s of state.students) {
                        for (const sub of subs) {
                            const sc = getScore(s, sub.name, t);
                            if (typeof sc === 'number') {
                                hasData = true;
                                break;
                            }
                        }
                        if (hasData) break;
                    }

                    if (hasData) {
                        latestYear = y;
                        latestTest = t;
                        break yearLoop;
                    }
                }
            }
        }

        if (!latestYear || !latestTest) {
            showChartMessage(container, '表示するデータがありません (No Data)');
            return;
        }

        // Prepare BoxPlot Data
        const subjects = state.subjects.filter(s => s.year === latestYear && !s.name.startsWith('特・'));
        const subjectLabels = subjects.map(s => s.name);

        // Data: Array of arrays.
        const boxData = subjects.map(sub => {
            const scores = [];
            state.students.forEach(s => {
                const sc = getScore(s, sub.name, latestTest);
                if (typeof sc === 'number') scores.push(sc);
            });
            return scores;
        });

        // My Score Scatter Data
        const myScores = subjects.map((sub, i) => {
            const sc = getScore(state.currentStudent, sub.name, latestTest);
            // Use subject name for X axis matching
            return (typeof sc === 'number') ? { x: sub.name, y: sc } : null;
        }).filter(v => v !== null);

        const ctx = canvas.getContext('2d');

        boxPlotInstance = new Chart(ctx, {
            type: 'boxplot',
            data: {
                labels: subjectLabels,
                datasets: [
                    {
                        label: `${latestYear}年 ${latestTest} (全体)`,
                        data: boxData,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                        outlierColor: '#999999',
                        padding: 20,
                        itemRadius: 0,
                        itemStyle: 'circle',
                        itemBackgroundColor: '#000'
                    },
                    {
                        type: 'scatter',
                        label: 'あなた (You)',
                        data: myScores,
                        backgroundColor: 'red',
                        borderColor: 'red',
                        pointRadius: 7,
                        pointStyle: 'circle',
                        order: 0
                    }
                ]
            },
            plugins: [{
                id: 'plotAreaBorder',
                beforeDraw(chart) {
                    const { ctx, chartArea: { top, bottom, left, right } } = chart;
                    ctx.save();
                    ctx.strokeStyle = '#000000'; // Black border
                    ctx.lineWidth = 1.5;
                    ctx.strokeRect(left, top, right - left, bottom - top);
                    ctx.restore();
                }
            }],
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'category',
                        offset: true,
                        grid: { display: true, color: 'rgba(0,0,0,0.15)' },
                        border: { display: true, color: '#000', width: 1.5 },
                        ticks: {
                            minRotation: 90,
                            maxRotation: 90,
                            autoSkip: false,
                            color: '#000'
                        },
                        afterFit: (axis) => { axis.height = 80; }
                    },
                    y: {
                        min: 0,
                        max: 100,
                        title: { display: true, text: '点数', font: { weight: 'bold' } },
                        grid: { color: 'rgba(0,0,0,0.2)' },
                        border: { display: true, color: '#000', width: 1.5 },
                        ticks: { color: '#000' },
                        afterFit: (axis) => { axis.width = 60; }
                    },
                    yPaddingRight: {
                        type: 'linear',
                        position: 'right',
                        display: true,
                        title: { display: false },
                        ticks: { display: false },
                        grid: { drawOnChartArea: false },
                        border: { display: false },
                        afterFit: (axis) => { axis.width = 60; }
                    }
                },
                layout: {
                    padding: {
                        top: 50,
                        bottom: 10
                    }
                },
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: `${latestYear}年 ${latestTest} 成績分布`,
                        font: { size: 16, weight: 'bold' }
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                if (context.dataset.type === 'scatter') {
                                    return `あなた: ${context.parsed.y}点`;
                                }
                                const v = context.raw;
                                if (v && v.min !== undefined) {
                                    return `Min:${v.min}, Max:${v.max}, Med:${v.median}, Q1:${v.q1}, Q3:${v.q3}`;
                                }
                                return '';
                            }
                        }
                    }
                }
            },
            plugins: [{
                id: 'plotAreaBorder',
                beforeDraw(chart) {
                    const { ctx, chartArea: { top, bottom, left, right } } = chart;
                    ctx.save();
                    ctx.strokeStyle = '#64748b';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(left, top, right - left, bottom - top);
                    ctx.restore();
                }
            }]
        });
    } catch (e) {
        console.error(e);
        showChartMessage(container, `エラーが発生しました: ${e.message}`, true);
    }
}

function showChartMessage(container, msg, isError = false) {
    const div = document.createElement('div');
    div.className = 'chart-message';
    div.style.position = 'absolute';
    div.style.top = '50%';
    div.style.left = '50%';
    div.style.transform = 'translate(-50%, -50%)';
    div.style.color = isError ? 'red' : '#64748b';
    div.style.fontWeight = 'bold';
    div.style.textAlign = 'center';
    div.style.background = 'rgba(255,255,255,0.8)';
    div.style.padding = '10px';
    div.style.borderRadius = '5px';
    div.textContent = msg;
    container.appendChild(div);
}

// 2. Trend Chart (All Years: Rank & Average)
function renderTrendChart() {
    const ctx = document.getElementById('trendChart').getContext('2d');
    if (trendChartInstance) trendChartInstance.destroy();

    // Collect all timepoints (Year-Test combinations)
    // Iterate 1 to 5 (asc)
    const labels = [];
    const avgData = []; // Average Score
    const rankData = []; // Rank

    // We iterate 1..5. Always include axis even if empty.
    for (let y = 1; y <= 5; y++) {
        const subs = state.subjects.filter(s => s.year === y && !s.name.startsWith('特・'));

        // For each test type
        SCORE_KEYS.forEach(test => {
            // Calculate My Rank and My Average for this timepoint
            let myTotal = 0;
            let count = 0;

            if (subs.length > 0) {
                subs.forEach(sub => {
                    const sc = getScore(state.currentStudent, sub.name, test);
                    if (typeof sc === 'number') {
                        myTotal += sc;
                        count++;
                    }
                });
            }

            labels.push(`${y}年\n${test.replace('前期', '前').replace('後期', '後').replace('中間', '中').replace('末', '末')}`); // Shorten

            if (count > 0) {
                const myAvg = myTotal / count;

                // Calculate Rank among valid students
                // 1. Get avg for all students
                const allAvgs = state.students.map(s => {
                    let t = 0, c = 0;
                    subs.forEach(sub => {
                        const v = getScore(s, sub.name, test);
                        if (typeof v === 'number') { t += v; c++; }
                    });
                    return c > 0 ? (t / c) : null;
                }); // list of avgs or null

                // Pair with name
                const ranked = state.students.map((name, i) => ({ name, avg: allAvgs[i] }))
                    .filter(x => x.avg !== null)
                    .sort((a, b) => b.avg - a.avg);

                const myRankIdx = ranked.findIndex(x => x.name === state.currentStudent);
                const myRank = myRankIdx !== -1 ? myRankIdx + 1 : null;

                avgData.push(myAvg);
                rankData.push(myRank);
            } else {
                // No data for this point
                avgData.push(null);
                rankData.push(null);
            }
        });
    }

    // Calculate Least Squares Trend Line for Avg Scores
    const trendData = new Array(avgData.length).fill(null);
    const validPoints = [];
    avgData.forEach((val, i) => {
        if (val !== null) validPoints.push({ x: i, y: val });
    });

    if (validPoints.length >= 2) {
        let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
        const n = validPoints.length;

        validPoints.forEach(p => {
            sumX += p.x;
            sumY += p.y;
            sumXY += p.x * p.y;
            sumXX += p.x * p.x;
        });

        const denominator = (n * sumXX - sumX * sumX);
        if (denominator !== 0) {
            const slope = (n * sumXY - sumX * sumY) / denominator;
            const intercept = (sumY - slope * sumX) / n;

            // Generate trend line points for the entire axis
            for (let i = 0; i < avgData.length; i++) {
                trendData[i] = slope * i + intercept;
            }
        }
    }

    trendChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: '85点',
                    data: new Array(labels.length).fill(85),
                    borderColor: 'rgba(255, 0, 0, 0.3)',
                    borderWidth: 1,
                    borderDash: [5, 5],
                    pointRadius: 0,
                    yAxisID: 'yAvg',
                    fill: false,
                    tension: 0
                },
                {
                    label: '60点',
                    data: new Array(labels.length).fill(60),
                    borderColor: 'rgba(255, 0, 0, 0.3)',
                    borderWidth: 1,
                    borderDash: [5, 5],
                    pointRadius: 0,
                    yAxisID: 'yAvg',
                    fill: false,
                    tension: 0
                },
                {
                    label: '平均点 (Avg Score)',
                    data: avgData,
                    borderColor: 'red',
                    backgroundColor: 'red',
                    yAxisID: 'yAvg',
                    tension: 0.2,
                    fill: false
                },
                {
                    label: '近似線 (Trend)',
                    data: trendData,
                    borderColor: 'red',
                    backgroundColor: 'red',
                    borderWidth: 1,
                    pointRadius: 0,
                    yAxisID: 'yAvg',
                    fill: false,
                    tension: 0
                },
                {
                    label: '順位 (Rank)',
                    data: rankData,
                    borderColor: 'blue',
                    backgroundColor: 'blue',
                    yAxisID: 'yRank',
                    tension: 0.2,
                    fill: false
                }
            ]
        },
        plugins: [{
            id: 'plotAreaBorder',
            beforeDraw(chart) {
                const { ctx, chartArea: { top, bottom, left, right } } = chart;
                ctx.save();
                ctx.strokeStyle = '#000000'; // Clear black border
                ctx.lineWidth = 1.5;
                ctx.strokeRect(left, top, right - left, bottom - top);
                ctx.restore();
            }
        }],
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    top: 50,
                    bottom: 10
                }
            },
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: { display: false },
                title: { display: true, text: '学年別成績トレンド', font: { size: 16, weight: 'bold' } }
            },
            scales: {
                x: {
                    grid: { display: true, color: 'rgba(0,0,0,0.15)' },
                    border: { display: true, color: '#000', width: 1.5 },
                    ticks: {
                        minRotation: 90,
                        maxRotation: 90,
                        autoSkip: false,
                        color: '#000'
                    },
                    afterFit: (axis) => { axis.height = 80; }
                },
                yAvg: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    min: 0,
                    max: 100,
                    title: { display: true, text: '平均点', color: '#b91c1c', font: { weight: 'bold' } }, // Darker red for contrast
                    grid: { drawOnChartArea: true, color: 'rgba(0,0,0,0.1)' },
                    border: { display: true, color: '#b91c1c', width: 1.5 },
                    afterFit: (axis) => { axis.width = 60; }
                },
                yRank: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    reverse: true, // Rank 1 is top
                    min: 1,
                    suggestedMax: state.students.length, // Ensure it covers the class size
                    title: { display: true, text: '順位', color: '#1d4ed8', font: { weight: 'bold' } }, // Darker blue for contrast
                    grid: { color: 'rgba(0,0,0,0.1)' },
                    border: { display: true, color: '#1d4ed8', width: 1.5 },
                    afterFit: (axis) => { axis.width = 60; }
                }
            },
            layout: {
                padding: {
                    bottom: 20
                }
            }
        }
    });

}

// Start
document.addEventListener('DOMContentLoaded', init);
