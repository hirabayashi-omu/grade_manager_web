
// ==================== DATA CONSTANTS ====================
// ==================== DATA CONSTANTS ====================
// These are factory defaults. We use localStorage for actual master data.
const DEFAULT_STUDENTS_RAW = `
学生太郎,学生次郎,学生花子,学生A,学生B,学生C,学生D,学生E
`;

const DEFAULT_SUBJECTS_RAW = `授業科目,単位,学年,種別1,種別2,種別3,種別4,除外
国語1,2,1,必履修,一般,DP-C,コース共通,
国語2,2,2,必履修,一般,DP-C,コース共通,
国語3,2,3,必履修,一般,DP-C,コース共通,
言語と文化,2,4,必履修,一般,DP-C,コース共通,1
社会1,2,1,必履修,一般,DP-A,コース共通,
社会2,2,2,必履修,一般,DP-A,コース共通,
社会3,2,3,必履修,一般,DP-A,コース共通,
現代社会論,2,4,必履修,一般,DP-A,コース共通,
法律,2,5,選,一般,DP-A,コース共通,1
経済,2,5,選,一般,DP-A,コース共通,1
哲学,2,5,選,一般,DP-A,コース共通,1
心理学,2,5,選,一般,DP-A,コース共通,1
基礎数学A,2,1,必修得,一般,DP-B,コース共通,
基礎数学B,2,1,必修得,一般,DP-B,コース共通,
基礎数学C,2,1,必修得,一般,DP-B,コース共通,
微分積分1,2,2,必履修,一般,DP-B,コース共通,
微分積分2,2,2,必履修,一般,DP-B,コース共通,
ベクトル・行列,2,2,必履修,一般,DP-B,コース共通,
解析1,2,3,必履修,一般,DP-B,コース共通,
解析2,2,3,必履修,一般,DP-B,コース共通,
線形代数・微分方程式,2,3,必履修,一般,DP-B,コース共通,
確率統計,2,4,必履修,一般,DP-B,コース共通,
基礎物理1,2,1,必履修,一般,DP-B,コース共通,
基礎物理2,2,2,必履修,一般,DP-B,コース共通,
基礎物理3,2,3,必履修,一般,DP-B,コース共通,
現代物理学概論,2,5,選,一般,DP-B,コース共通,1
化学1,3,1,必履修,一般,DP-B,コース共通,
化学2,2,2,必履修,一般,DP-B,コース共通,
生物,2,2,必履修,一般,DP-B,コース共通,
保健・体育1,2,1,必履修,一般,DP-A,コース共通,
保健・体育2,2,2,必履修,一般,DP-A,コース共通,
保健・体育3,2,3,必履修,一般,DP-A,コース共通,
保健・体育4,2,4,必履修,一般,DP-A,コース共通,
英語1,2,1,必履修,一般,DP-C,コース共通,
英語2,2,1,必履修,一般,DP-C,コース共通,
英語3,2,2,必履修,一般,DP-C,コース共通,
英語4,2,2,必履修,一般,DP-C,コース共通,
英語5,2,3,必履修,一般,DP-C,コース共通,
英語6,2,4,必履修,一般,DP-C,コース共通,
英語表現1,2,1,必履修,一般,DP-C,コース共通,
英語表現2,2,2,必履修,一般,DP-C,コース共通,
英語表現3,2,3,必履修,一般,DP-C,コース共通,
英語A,2,4,選,一般,DP-C,コース共通,1
英語B,2,4,選,一般,DP-C,コース共通,1
中国語,2,4,選,一般,DP-C,コース共通,1
ドイツ語,2,4,選,一般,DP-C,コース共通,1
美術,2,1,選必,一般,DP-A,コース共通,1
書道,2,1,選必,一般,DP-A,コース共通,1
音楽,2,1,選必,一般,DP-A,コース共通,1
総合工学システム概論,1,1,必修得,専門共通,DP-D,コース共通,
総合工学システム実験実習,4,1,必修得,専門共通,DP-D,コース共通,
情報1,2,1,必履修,専門共通,DP-D,コース共通,
情報2,2,2,必履修,専門共通,DP-D,コース共通,
情報3,2,3,必履修,専門共通,DP-D,コース共通,
ダイバーシティと人権,1,1,必履修,専門共通,"DP-A, SDGs",コース共通,
多文化共生,1,4,必履修,専門共通,"DP-A, SDGs",コース共通,
労働環境と人権,2,5,必履修,専門共通,"DP-A, SDGs",コース共通,
技術倫理,2,5,必履修,専門共通,"DP-A, SDGs",コース共通,
システム安全入門,1,5,選,専門共通,"DP-A, SDGs",コース共通,
環境システム工学,1,5,選,専門共通,"DP-A, SDGs",コース共通,
資源と産業,1,5,選,専門共通,"DP-A, SDGs",コース共通,
環境倫理,1,5,選,専門共通,"DP-A, SDGs",コース共通,
応用数学A,2,4,必履修,専門共通,DP-B,コース共通,
応用数学B,2,4,必履修,専門共通,DP-B,コース共通,
物理学A,2,4,必履修,専門共通,DP-B,コース共通,
物理学B,2,4,必履修,専門共通,DP-B,コース共通,
計測工学,2,5,必履修,専門共通,DP-D,コース共通,
技術英語,2,5,必履修,専門共通,DP-C,コース共通,
機械工学概論,1,2,必履修,基盤専門,DP-D,エネルギー機械,
基礎製図,2,2,必履修,基盤専門,DP-D,エネルギー機械,
電気・電子回路,1,2,必履修,基盤専門,DP-D,エネルギー機械,
シーケンス制御,1,2,必履修,基盤専門,DP-D,エネルギー機械,
機械工作実習1,4,2,必修得,基盤専門,DP-D,エネルギー機械,
材料力学入門,1,3,必履修,基盤専門,DP-D,エネルギー機械,
熱力学入門,1,3,必履修,基盤専門,DP-D,エネルギー機械,
流体力学入門,1,3,必履修,基盤専門,DP-D,エネルギー機械,
機械工作法,2,3,必履修,基盤専門,DP-D,エネルギー機械,
CAD製図,2,3,必履修,基盤専門,DP-D,エネルギー機械,
機械設計製図,2,3,必履修,基盤専門,DP-D,エネルギー機械,
機械工作実習2,4,3,必修得,基盤専門,DP-D,エネルギー機械,
材料力学,2,4,必履修,基盤専門,DP-D,エネルギー機械,
熱力学,2,4,必履修,基盤専門,DP-D,エネルギー機械,
流れ学,2,4,必履修,基盤専門,DP-D,エネルギー機械,
機械力学,2,4,必履修,基盤専門,DP-D,エネルギー機械,
材料学,2,4,必履修,基盤専門,DP-D,エネルギー機械,
数値計算,2,4,必履修,基盤専門,DP-D,エネルギー機械,
エネルギー機械実験1,4,4,必修得,基盤専門,DP-D,エネルギー機械,
機械設計,2,5,必履修,基盤専門,DP-D,エネルギー機械,
伝熱工学,2,5,必履修,基盤専門,DP-D,エネルギー機械,
流体工学,2,5,必履修,基盤専門,DP-D,エネルギー機械,
生産加工工学,2,5,必履修,基盤専門,DP-D,エネルギー機械,
制御工学,2,5,必履修,基盤専門,DP-D,エネルギー機械,
制御工学,2,5,必履修,基盤専門,DP-D,プロダクトデザイン,
エネルギー変換工学,2,5,必履修,基盤専門,DP-D,エネルギー機械,
エネルギー機械実験2,2,5,必修得,基盤専門,DP-D,エネルギー機械,
卒業研究,6,5,必修得,基盤専門,DP-E,エネルギー機械,
プロダクトデザイン概論,1,2,必履修,基盤専門,DP-D,プロダクトデザイン,
製図基礎,2,2,必履修,基盤専門,DP-D,プロダクトデザイン,
プログラミング基礎,1,2,必履修,基盤専門,DP-D,プロダクトデザイン,
機械工作法,1,2,必履修,基盤専門,DP-D,プロダクトデザイン,
機械工作実習,4,2,必修得,基盤専門,DP-D,プロダクトデザイン,
工業力学,1,3,必履修,基盤専門,DP-D,プロダクトデザイン,
CAD設計製図,2,3,必履修,基盤専門,DP-D,プロダクトデザイン,
材料学,2,3,必履修,基盤専門,DP-D,プロダクトデザイン,
加工学,2,3,必履修,基盤専門,DP-D,プロダクトデザイン,
ユニバーサルデザイン,2,3,必履修,基盤専門,DP-D,プロダクトデザイン,
生産機械実習,4,3,必修得,基盤専門,DP-D,プロダクトデザイン,
材料力学,2,4,必履修,基盤専門,DP-D,プロダクトデザイン,
熱力学,2,4,必履修,基盤専門,DP-D,プロダクトデザイン,
流体力学,2,4,必履修,基盤専門,DP-D,プロダクトデザイン,
機械力学,2,4,必履修,基盤専門,DP-D,プロダクトデザイン,
メカトロニクス,2,4,必履修,基盤専門,DP-D,プロダクトデザイン,
ロボット工学,2,4,必履修,基盤専門,DP-D,プロダクトデザイン,
プロダクトデザイン実験,4,4,必修得,基盤専門,DP-D,プロダクトデザイン,
プロダクトデザイン,2,5,必履修,基盤専門,DP-D,プロダクトデザイン,
CAM/CAE,2,5,必履修,基盤専門,DP-D,プロダクトデザイン,
生産システム工学,2,5,必履修,基盤専門,DP-D,プロダクトデザイン,
感性工学,2,5,必履修,基盤専門,DP-D,プロダクトデザイン,
プロダクトデザイン実習,2,5,必修得,基盤専門,DP-D,プロダクトデザイン,
卒業研究,6,5,必修得,基盤専門,DP-E,プロダクトデザイン,
エレクトロニクス概論,1,2,必履修,基盤専門,DP-D,エレクトロニクス,
電気設備,1,2,必履修,基盤専門,DP-D,エレクトロニクス,
電気回路1,1,2,必履修,基盤専門,DP-D,エレクトロニクス,
電子回路1,1,2,必履修,基盤専門,DP-D,エレクトロニクス,
電気電子材料1,1,2,必履修,基盤専門,DP-D,エレクトロニクス,
エレクトロニクス実験実習,4,2,必修得,基盤専門,DP-D,エレクトロニクス,
電気回路2,1,3,必履修,基盤専門,DP-D,エレクトロニクス,
電磁気学1,2,3,必履修,基盤専門,DP-D,エレクトロニクス,
電気電子材料2,2,3,必履修,基盤専門,DP-D,エレクトロニクス,
半導体工学1,2,3,必履修,基盤専門,DP-D,エレクトロニクス,
工学設計演習,2,3,必履修,基盤専門,DP-D,エレクトロニクス,
エレクトロニクス実験1,4,3,必修得,基盤専門,DP-D,エレクトロニクス,
電子回路2,2,4,必履修,基盤専門,DP-D,エレクトロニクス,
電気回路3,2,4,必履修,基盤専門,DP-D,エレクトロニクス,
電磁気学2,1,4,必履修,基盤専門,DP,エレクトロニクス,
電気電子材料3,2,4,必履修,基盤専門,DP-D,エレクトロニクス,
半導体工学2,2,4,必履修,基盤専門,DP-D,エレクトロニクス,
コンピュータ工学基礎,2,4,必履修,基盤専門,DP-D,エレクトロニクス,
制御工学1,1,4,必履修,基盤専門,DP-D,エレクトロニクス,
エレクトロニクス実験2,4,4,必修得,基盤専門,DP-D,エレクトロニクス,
制御工学2,1,5,必履修,基盤専門,DP-D,エレクトロニクス,
電気機器,1,5,必履修,基盤専門,DP-D,エレクトロニクス,
電力技術,2,5,必履修,基盤専門,DP-D,エレクトロニクス,
パワーエレクトロニクス,2,5,必履修,基盤専門,DP-D,エレクトロニクス,
信号処理,2,5,必履修,基盤専門,DP-D,エレクトロニクス,
電気化学,1,5,必履修,基盤専門,DP-D,エレクトロニクス,
センサー工学,2,5,必履修,基盤専門,DP-D,エレクトロニクス,
ワイヤレス技術,1,5,必履修,基盤専門,DP-D,エレクトロニクス,
エレクトロニクス実験3,2,5,必修得,基盤専門,DP-D,エレクトロニクス,
卒業研究,6,5,必修得,基盤専門,DP-E,エレクトロニクス,
メディアデザイン入門,1,2,必履修,基盤専門,DP-D,知能情報,
論理回路1,1,2,必履修,基盤専門,DP-D,知能情報,
マイクロコンピュータ,1,2,必履修,基盤専門,DP-D,知能情報,
プログラミング1,2,2,必履修,基盤専門,DP-D,知能情報,
工学基礎実習,4,2,必修得,基盤専門,DP-D,知能情報,
プログラミング2,2,3,必履修,基盤専門,DP-D,知能情報,
プログラミング3,2,3,必履修,基盤専門,DP-D,知能情報,
アルゴリズムとデータ構造1,1,3,必履修,基盤専門,DP-D,知能情報,
論理回路2,1,3,必履修,基盤専門,DP-D,知能情報,
電気電子回路1,1,3,必履修,基盤専門,DP-D,知能情報,
知識科学概論,2,3,必履修,基盤専門,DP-D,知能情報,
知能情報実験実習1,4,3,必修得,基盤専門,DP-D,知能情報,
アルゴリズムとデータ構造2,2,4,必履修,基盤専門,DP-D,知能情報,
電気電子回路2,2,4,必履修,基盤専門,DP-D,知能情報,
データベース工学,2,4,必履修,基盤専門,DP-D,知能情報,
マルチメディア情報処理,2,4,必履修,基盤専門,DP-D,知能情報,
情報通信ネットワーク,2,4,必履修,基盤専門,DP-D,知能情報,
コンピュータシステム,2,4,必履修,基盤専門,DP-D,知能情報,
知能情報実験実習2,4,4,必修得,基盤専門,DP-D,知能情報,
オートマトンと形式言語,2,5,必履修,基盤専門,DP-D,知能情報,
ソフトウェア工学,2,5,必履修,基盤専門,DP-D,知能情報,
知能情報実験実習3,2,5,必修得,基盤専門,DP-D,知能情報,
オペレーティングシステム,2,5,必履修,基盤専門,DP-D,知能情報,
人工知能,2,5,必履修,基盤専門,DP-D,知能情報,
情報理論,2,5,必履修,基盤専門,DP-D,知能情報,
コンピュータアーキテクチャ,2,5,必履修,基盤専門,DP-D,知能情報,
卒業研究,6,5,必修得,基盤専門,DP-E,知能情報,
応用専門概論,1,3,必修得,応用専門,DP-E,コース共通,
応用専門PBL1,1,3,必修得,応用専門,DP-E,コース共通,
応用専門PBL2,2,4,必修得,応用専門,DP-E,コース共通,
インターンシップ,1,4,選,応用専門,DP-E,コース共通,
生活と物質,1,4,選必,応用専門,DP-E,コース共通,
社会と環境,1,4,選必,応用専門,DP-E,コース共通,
物質プロセス基礎,2,5,選必,応用専門,DP-E,コース共通,
物質デザイン概論,2,5,選必,応用専門,DP-E,コース共通,
防災工学,2,4,選必,応用専門,DP-E,コース共通,
エルゴノミクス,2,4,選必,応用専門,DP-E,コース共通,
食品エンジニアリング,2,5,選必,応用専門,DP-E,コース共通,
コスメティックス,2,5,選必,応用専門,DP-E,コース共通,
バイオテクノロジー,2,5,選必,応用専門,DP-E,コース共通,
高純度化技術,2,5,選必,応用専門,DP-E,コース共通,
環境モニタリング,2,5,選必,応用専門,DP-E,コース共通,
エネルギー変換デバイス,2,5,選必,応用専門,DP-E,コース共通,
食と健康のセンサ,2,5,選必,応用専門,DP-E,コース共通,
環境対応デバイス,2,5,選必,応用専門,DP-E,コース共通,
社会基盤構造,2,5,選必,応用専門,DP-E,コース共通,
環境衛生工学,2,5,選必,応用専門,DP-E,コース共通,
維持管理工学,2,5,選必,応用専門,DP-E,コース共通,
水環境工学,2,5,選必,応用専門,DP-E,コース共通,
環境デザイン論,2,5,選必,応用専門,DP-E,コース共通,
インクルーシブデザイン,2,5,選必,応用専門,DP-E,コース共通,
空間情報学,2,5,選必,応用専門,DP-E,コース共通,
環境行動,2,5,選必,応用専門,DP-E,コース共通,
特・特別活動1,0,1,必修得,その他,Other,コース共通,
特・特別活動2,0,2,必修得,その他,Other,コース共通,
特・特別活動3,0,3,必修得,その他,Other,コース共通,
特・防災リテラシー,1,0,選,専門,"DP-A, SDGs",コース共通,1
特・総合課題実習1,1,0,選,特別学修,DP-E,コース共通,1
特・総合課題実習2,1,0,選,特別学修,DP-E,コース共通,1
特・総合課題実習3,1,0,選,特別学修,DP-E,コース共通,1
`;

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
    currentCourse: localStorage.getItem('gm_state_course') || '',
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
    localStorage.setItem('gm_state_course', state.currentCourse || '');

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
    const savedCourse = localStorage.getItem('gm_state_course');
    const savedAtRiskThreshold = localStorage.getItem('gm_state_atrisk_threshold');
    const savedAtRiskTest = localStorage.getItem('gm_state_atrisk_test');
    const savedAtRiskYear = localStorage.getItem('gm_state_atrisk_year');
    const savedAtRiskMode = localStorage.getItem('gm_state_atrisk_mode');

    if (savedTab) state.currentTab = savedTab;
    if (savedHideEmpty !== null) state.hideEmptySubjects = (savedHideEmpty === 'true');
    if (savedYear) state.currentYear = parseInt(savedYear);
    if (savedBPYear) state.boxPlotYear = parseInt(savedBPYear);
    if (savedBPTest) state.boxPlotTest = savedBPTest;
    if (savedCourse !== null) state.currentCourse = savedCourse;
    if (savedAtRiskThreshold) state.atRiskThreshold = parseInt(savedAtRiskThreshold);
    if (savedAtRiskTest) state.atRiskTest = savedAtRiskTest;
    if (savedAtRiskYear) state.atRiskYear = parseInt(savedAtRiskYear);
    if (savedAtRiskMode) state.atRiskMode = savedAtRiskMode;

    // MIGRATION: Rename courses to formal names
    const courseMap = {
        'Mコース': 'エネルギー機械',
        'Dコース': 'プロダクトデザイン',
        'Eコース': 'エレクトロニクス',
        'Iコース': '知能情報'
    };
    if (courseMap[state.currentCourse]) {
        state.currentCourse = courseMap[state.currentCourse];
    }

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
    // Auth check must happen first to block UI
    initAuth();

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

    initAtRiskDefaults();
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

    if (!overlay || !mainApp) return;

    if (!state.passwordHash) {
        // No password set - First time setup
        mainApp.style.display = 'none';
        overlay.style.display = 'flex';
        overlay.classList.add('open');
        setupView.style.display = 'block';
        loginView.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'none';
    } else if (!state.isLoggedIn) {
        // Password exists but not logged in
        mainApp.style.display = 'none';
        overlay.style.display = 'flex';
        overlay.classList.add('open');
        setupView.style.display = 'none';
        loginView.style.display = 'block';
        if (logoutBtn) logoutBtn.style.display = 'none';

        // Auto-focus after a short delay to ensure modal is visible
        setTimeout(() => document.getElementById('loginPass').focus(), 100);
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
    if (!passInput) return;

    const password = passInput.value;

    if (!password) {
        alert('パスワードを入力してください。');
        return;
    }

    const hash = await hashPassword(password);
    if (hash === state.passwordHash) {
        state.isLoggedIn = true;
        if (errorMsg) errorMsg.style.display = 'none';
        passInput.value = '';
        initAuth(); // This will reveal the main content and hide overlay
    } else {
        if (errorMsg) errorMsg.style.display = 'block';
        passInput.value = '';
        passInput.focus();
    }
}

async function handleSetup() {
    const p1El = document.getElementById('setupPass1');
    const p2El = document.getElementById('setupPass2');
    if (!p1El || !p2El) return;

    const p1 = p1El.value;
    const p2 = p2El.value;

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
            let line = lines[i].trim();
            if (!line) continue;

            let parts;
            let isCsv = false;

            if (line.includes('\t')) {
                parts = line.split('\t');
            } else if (line.includes(',')) {
                // Improved CSV split to handle quoted fields
                parts = line.match(/(".*?"|[^",\r\n]+)(?=\s*,|\s*$)/g);
                if (parts) {
                    parts = parts.map(p => p.startsWith('"') && p.endsWith('"') ? p.slice(1, -1) : p.trim());
                } else {
                    parts = line.split(',');
                }
                isCsv = true;
            } else {
                parts = line.split(/\s+/);
            }

            if (parts.length >= 5) {
                let type3 = '';
                let type4 = '';
                let exclude = false;

                if (isCsv) {
                    // CSV format: Name, Credits, Year, Type1, Type2, Type3, Type4, Exclude
                    type3 = parts.length > 5 ? parts[5].trim() : '';
                    type4 = parts.length > 6 ? parts[6].trim() : '';
                    exclude = parts.length > 7 ? (parts[7].trim() === '1') : false;

                    // Support Migration within refreshMasterData
                    const cm = { 'Mコース': 'エネルギー機械', 'Dコース': 'プロダクトデザイン', 'Eコース': 'エレクトロニクス', 'Iコース': '知能情報' };
                    if (cm[type4]) type4 = cm[type4];
                } else {
                    // Legacy TSV: Name, Credits, Year, Type1, Type2, Exclude
                    exclude = parts.length > 5 ? (parts[5].trim() === '1') : false;
                }

                // Handle academic year better (parseInt handles numeric prefixes like '1年' but fails on '特別')
                let yearVal = parseInt(parts[2]);
                if (isNaN(yearVal)) yearVal = 1; // Default to 1 if parsing fails

                state.subjects.push({
                    name: parts[0].trim(),
                    credits: parseInt(parts[1]) || 0,
                    year: yearVal,
                    type1: parts[3].trim(),
                    type2: parts[4].trim(),
                    type3: type3,
                    type4: type4,
                    exclude: exclude
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
        state.boxPlotYear = state.currentYear;
        statsYearSelect.value = state.boxPlotYear || '';
    }

    // 4. Course Select Sync
    const courseFilterHeader = document.getElementById('subjectCourseFilterHeader');
    if (courseFilterHeader) courseFilterHeader.value = state.currentCourse;
    const courseFilterSettings = document.getElementById('subjectCourseFilter');
    if (courseFilterSettings) courseFilterSettings.value = state.currentCourse;
}

function setupEventListeners() {
    document.getElementById('studentSelect')?.addEventListener('change', (e) => {
        state.currentStudent = e.target.value;
        saveSessionState();
        render();
    });
    document.getElementById('yearSelect')?.addEventListener('change', (e) => {
        state.currentYear = parseInt(e.target.value);
        saveSessionState();
        // Update box plot to show this year's data
        state.boxPlotYear = state.currentYear;
        state.boxPlotTest = null;
        render();
    });
    document.getElementById('hideEmptySubjects')?.addEventListener('change', (e) => {
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
    document.getElementById('saveBtn')?.addEventListener('click', saveData);
    document.getElementById('printBtn')?.addEventListener('click', () => window.print());
    document.getElementById('exportJsonBtn')?.addEventListener('click', exportJson);

    // Import CSV
    document.getElementById('importBtn')?.addEventListener('click', () => {
        document.getElementById('csvFileInput')?.click();
    });
    document.getElementById('csvFileInput')?.addEventListener('change', handleFileUpload);

    // Paste Modal
    document.getElementById('closeModalBtn')?.addEventListener('click', closePasteModal);
    document.getElementById('cancelPasteBtn')?.addEventListener('click', closePasteModal);
    document.getElementById('applyPasteBtn')?.addEventListener('click', applyPaste);

    // Close modal on click outside
    document.getElementById('pasteModal')?.addEventListener('click', (e) => {
        if (e.target === document.getElementById('pasteModal')) closePasteModal();
    });

    // Box Plot Controls
    document.getElementById('boxPlotYearSelect')?.addEventListener('change', (e) => {
        const val = e.target.value;
        state.boxPlotYear = val ? parseInt(val) : null;
        saveSessionState();
        renderBoxPlot();
    });

    document.getElementById('boxPlotTestSelect')?.addEventListener('change', (e) => {
        state.boxPlotTest = e.target.value || null;
        saveSessionState();
        renderBoxPlot();
    });

    // Class Stats Listener
    document.getElementById('generateClassStatsBtn')?.addEventListener('click', () => {
        generateClassStats();
    });
    document.getElementById('classStatsTest')?.addEventListener('change', () => {
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
    document.getElementById('addStudentBtn')?.addEventListener('click', addStudentSetting);
    document.getElementById('addSubjectBtn')?.addEventListener('click', () => openSubjectModal());
    document.getElementById('saveSubjectItemBtn')?.addEventListener('click', saveSubjectItem);
    document.getElementById('finalSaveSettingsBtn')?.addEventListener('click', saveFinalSettings);
    document.getElementById('restoreDefaultsBtn')?.addEventListener('click', restoreMasterDefaults);
    document.getElementById('changePassBtn')?.addEventListener('click', openPasswordChange);
    document.getElementById('clearAllDataBtn')?.addEventListener('click', clearAllDataHard);
    document.getElementById('headerHelpBtn')?.addEventListener('click', () => switchTab('help'));

    // Auth Listeners
    document.getElementById('doLoginBtn')?.addEventListener('click', handleLogin);
    document.getElementById('loginPass')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });
    document.getElementById('confirmSetupBtn')?.addEventListener('click', handleSetup);
    document.getElementById('setupPass2')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSetup();
    });
    document.getElementById('logoutBtn')?.addEventListener('click', handleLogout);
    document.getElementById('forgotPassBtn')?.addEventListener('click', () => {
        if (confirm('【警告】パスワードを忘れたため、システムを初期化しますか？\n\nこの操作を行うと、入力済みの成績データ、学生リスト、科目設定がすべて消去されます。元に戻すことはできません。')) {
            if (confirm('本当によろしいですか？（すべてのデータが削除されます）')) {
                localStorage.clear();
                alert('すべてのデータを消去しました。ページを再読み込みします。');
                location.reload();
            }
        }
    });

    document.getElementById('exportStudentsCsvBtn')?.addEventListener('click', exportStudentsCsv);
    document.getElementById('exportSubjectsCsvBtn')?.addEventListener('click', exportSubjectsCsv);

    document.getElementById('subjectSearchInput')?.addEventListener('input', render);

    document.getElementById('subjectCourseFilterHeader')?.addEventListener('change', (e) => {
        state.currentCourse = e.target.value;
        const other = document.getElementById('subjectCourseFilter');
        if (other) other.value = state.currentCourse;
        saveSessionState();
        render();
    });

    document.getElementById('subjectCourseFilter')?.addEventListener('change', (e) => {
        state.currentCourse = e.target.value;
        const other = document.getElementById('subjectCourseFilterHeader');
        if (other) other.value = state.currentCourse;
        saveSessionState();
        render();
    });

    document.getElementById('gradCourseFilter')?.addEventListener('change', (e) => {
        state.currentCourse = e.target.value;
        // Sync other course selects if they exist
        ['subjectCourseFilterHeader', 'subjectCourseFilter'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = state.currentCourse;
        });
        saveSessionState();
        render();
    });

    document.getElementById('isSpecialSubject')?.addEventListener('change', (e) => {
        const isSpecial = e.target.checked;
        const yearWrapper = document.getElementById('subjectYearWrapper');
        const type1Wrapper = document.getElementById('subjectType1Wrapper');
        if (yearWrapper) yearWrapper.style.display = isSpecial ? 'none' : 'flex';
        if (type1Wrapper) type1Wrapper.style.display = isSpecial ? 'none' : 'flex';
    });
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
    } else if (tabName === 'grad_requirements') {
        renderGraduationRequirements();
    } else if (tabName === 'class_stats') {
        initClassStats();
    } else if (tabName === 'at_risk') {
        // Just switch, user clicks button
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
        const isCurrent = (s === state.currentStudent);
        if (isCurrent) {
            item.style.background = '#eff6ff';
            item.style.borderColor = '#3b82f6';
        }
        item.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.6rem; overflow: hidden; cursor: pointer;" onclick="document.getElementById('studentSelect').value='${s}'; state.currentStudent='${s}'; saveSessionState(); renderSettings();">
                <div style="width: 24px; height: 24px; background: ${isCurrent ? '#bfdbfe' : '#f1f5f9'}; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; color: ${isCurrent ? '#1e40af' : '#64748b'};">${idx + 1}</div>
                <span style="font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; ${isCurrent ? 'color: #1d4ed8;' : ''}">${s} ${isCurrent ? '<span style="font-size:0.7em; color:#3b82f6; border:1px solid #3b82f6; padding:1px 4px; border-radius:4px; margin-left:4px;">選択中</span>' : ''}</span>
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
    updatePlaceholderNames();

    // 2. Render Subjects (Grouped List)
    const container = document.getElementById('subjectsGroupedList'); // Ensure this ID matches HTML
    // Note: Originally it was subjectsContainer. Previous code used subjectsContainer. 
    // Step 129 used subjectsContainer in renderSettings. 
    // Step 186 snippet used subjectsContainer (passed as arg? No, selected).
    // Let's use subjectsContainer to be safe, but the user snippet above had 'subjectsGroupedList'.
    // I will check if 'subjectsGroupedList' exists in HTML.
    // If unsure, use 'subjectsContainer' which was standard. 
    // Wait, the viewed code had 'subjectsGroupedList' at line 947 in previous turn. So I stick with it.
    if (!container) return;
    container.innerHTML = '';

    const searchQuery = document.getElementById('subjectSearchInput')?.value.toLowerCase() || '';
    const courseFilter = state.currentCourse;

    // A. PREPARE SORTED COPY (Sort by Year ASC to prioritize earliest year for duplicates)
    // Also handling non-numeric years gracefully if any (though we import safe integers)
    const sortedSubjects = [...state.subjects].sort((a, b) => (a.year || 0) - (b.year || 0));

    // B. FILTER & DEDUPLICATE
    const seenNames = new Set();
    const visibleSubjects = sortedSubjects.filter(s => {
        // 1. Search Query Filter
        const matchesSearch = s.name.toLowerCase().includes(searchQuery) ||
            s.type1?.toLowerCase().includes(searchQuery) ||
            s.type2?.toLowerCase().includes(searchQuery);
        if (!matchesSearch) return false;

        // 2. Course Filter
        if (courseFilter) {
            const t4 = s.type4 || 'コース共通'; // Default to common if undefined
            // Logic: Show if subject is Common OR belongs to the specific course
            let matchesCourse = false;
            if (t4 === 'コース共通') {
                matchesCourse = true;
            } else {
                if (t4 === courseFilter) matchesCourse = true;
            }
            if (!matchesCourse) return false;
        }

        // 3. Deduplication (Distinct Name)
        // Only keep the first occurrence of a subject name from the sorted (lowest year) list
        if (seenNames.has(s.name)) return false;
        seenNames.add(s.name);

        return true;
    });

    // C. GROUPING
    const groups = {};
    visibleSubjects.forEach(sub => {
        // Exclude Special Studies and Others from the main year groups
        if (sub.name.startsWith('特・') || sub.type2 === 'その他') return;

        if (!groups[sub.year]) groups[sub.year] = [];
        groups[sub.year].push(sub);
    });

    // D. RENDER NORMAL YEAR GROUPS
    for (let year = 1; year <= 5; year++) {
        // Only render year group if it has subjects or if there's a search query 
        // (If filters active and no match, skip unless user expects 'Empty' block)
        // If courseFilter is active and no subjects match for this year, we skip usually.
        if (!groups[year] && (searchQuery || courseFilter)) continue;

        const yearGroup = document.createElement('div');
        const listId = `year-${year}-list`;
        yearGroup.innerHTML = `
            <h3 style="font-size: 1.15rem; border-left: 5px solid ${getYearColor(year)}; padding: 0.2rem 0 0.2rem 1rem; margin-bottom: 1.2rem; color: #1e293b; margin-top: 2rem; display: flex; align-items: center; justify-content: space-between;">
                <span>${year}年 (Year ${year})</span>
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

                if (typeA.includes('専門') && !typeB.includes('専門')) return -1;
                if (!typeA.includes('専門') && typeB.includes('専門')) return 1;

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
                        ${sub.type3 ? `<span style="background: #f0fdf4; color: #166534; padding: 0.15rem 0.6rem; border-radius: 0.4rem; font-size: 0.75rem; border: 1px solid #dcfce7;">${sub.type3}</span>` : ''}
                        ${sub.type4 ? `<span style="background: #faf5ff; color: #6b21a8; padding: 0.15rem 0.6rem; border-radius: 0.4rem; font-size: 0.75rem; border: 1px solid #e9d5ff;">${sub.type4}</span>` : ''}
                        ${sub.exclude ? '<span style="background: #fee2e2; color: #ef4444; padding: 0.15rem 0.6rem; border-radius: 0.4rem; font-size: 0.75rem;">GPA対象外</span>' : ''}
                    </div>
                `;
                listContainer.appendChild(card);
            });
        } else if (!searchQuery && !courseFilter) {
            listContainer.innerHTML = `
                <div style="grid-column: 1 / -1; background: #f8fafc; border: 1px dashed #e2e8f0; border-radius: 0.8rem; padding: 2rem; text-align: center; color: #94a3b8; font-size: 0.9rem;">
                    この学年の科目はありません
                </div>
            `;
        } else {
            // Filters Active but no content
            listContainer.innerHTML = `
                <div style="grid-column: 1 / -1; background: #f8fafc; border: 1px dashed #e2e8f0; border-radius: 0.8rem; padding: 2rem; text-align: center; color: #94a3b8; font-size: 0.9rem;">
                    検索条件に一致する科目はありません
                </div>
            `;
        }
    }

    // 3. Render Others (Using visibleSubjects so defaults/filters apply)
    const othersGroup = document.createElement('div');
    const othersSubjects = visibleSubjects.filter(s => s.type2 === 'その他');
    othersGroup.innerHTML = `
        <h3 style="font-size: 1.15rem; border-left: 5px solid #8b5cf6; padding: 0.2rem 0 0.2rem 1rem; margin-bottom: 1.2rem; color: #1e293b; margin-top: 3rem; display: flex; align-items: center; justify-content: space-between;">
            <span>その他・特別活動 (Others)</span>
            <span style="font-size: 0.85rem; font-weight: normal; color: #5b21b6; background: #f3e8ff; padding: 0.2rem 0.6rem; border-radius: 999px;">
                ${othersSubjects.length} 科目
            </span>
        </h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.2rem;" id="others-subjects-list"></div>
    `;
    container.appendChild(othersGroup);

    const othersList = othersGroup.querySelector('#others-subjects-list');
    if (othersSubjects.length > 0) {
        othersSubjects.sort((a, b) => {
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
                    ${sub.type3 ? `<span style="background: #f0fdf4; color: #166534; padding: 0.15rem 0.6rem; border-radius: 0.4rem; font-size: 0.75rem; border: 1px solid #dcfce7;">${sub.type3}</span>` : ''}
                    ${sub.type4 ? `<span style="background: #faf5ff; color: #6b21a8; padding: 0.15rem 0.6rem; border-radius: 0.4rem; font-size: 0.75rem; border: 1px solid #e9d5ff;">${sub.type4}</span>` : ''}
                    ${sub.exclude ? '<span style="background: #fee2e2; color: #ef4444; padding: 0.15rem 0.6rem; border-radius: 0.4rem; font-size: 0.75rem;">GPA対象外</span>' : ''}
                </div>
            `;
            othersList.appendChild(card);
        });
    } else {
        othersList.innerHTML = '<div style="grid-column: 1 / -1; background: #f3e8ff; border: 1px dashed #d8b4fe; border-radius: 0.8rem; padding: 2rem; text-align: center; color: #6b21a8; font-size: 0.9rem;">その他・特別活動の登録はありません</div>';
    }

    // 4. Render Special Studies Subjects (filtered and deduped)
    const specialGroup = document.createElement('div');
    const specialSubjects = visibleSubjects.filter(s => s.name.startsWith('特・') && s.type2 !== 'その他');

    specialGroup.innerHTML = `
        <h3 style="font-size: 1.15rem; border-left: 5px solid #f59e0b; padding: 0.2rem 0 0.2rem 1rem; margin-bottom: 1.2rem; color: #1e293b; margin-top: 3rem; display: flex; align-items: center; justify-content: space-between;">
            <span>特別学修科目 (Special Studies)</span>
            <span style="font-size: 0.85rem; font-weight: normal; color: #b45309; background: #fffbeb; padding: 0.2rem 0.6rem; border-radius: 999px;">
                ${specialSubjects.length} 科目
            </span>
        </h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.2rem;" id="special-subjects-list"></div>
    `;
    container.appendChild(specialGroup);

    const specialList = specialGroup.querySelector('#special-subjects-list');

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
                     ${sub.type3 ? `<span style="background: #f0fdf4; color: #166534; padding: 0.15rem 0.6rem; border-radius: 0.4rem; font-size: 0.75rem; border: 1px solid #dcfce7;">${sub.type3}</span>` : ''}
                     ${sub.type4 ? `<span style="background: #faf5ff; color: #6b21a8; padding: 0.15rem 0.6rem; border-radius: 0.4rem; font-size: 0.75rem; border: 1px solid #e9d5ff;">${sub.type4}</span>` : ''}
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
            document.getElementById('subjectType3Input').value = sub.type3 || '';
            document.getElementById('subjectType4Input').value = sub.type4 || '';
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
        document.getElementById('subjectType1Input').value = '必';
        document.getElementById('subjectType2Input').value = '一般';
        document.getElementById('subjectType3Input').value = '';
        document.getElementById('subjectType4Input').value = 'コース共通';
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
    const type3 = document.getElementById('subjectType3Input').value.trim();
    const type4 = document.getElementById('subjectType4Input').value.trim();
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
            state.subjects[idx] = { name: newName, credits, year, type1, type2, type3, type4, exclude };
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
        state.subjects.push({ name: newName, credits, year, type1, type2, type3, type4, exclude });
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
    const header = ['授業科目', '単位', '学年', '種別1', '種別2', '種別3', '種別4'].join(',');
    const rows = state.subjects.map(s => [
        s.name,
        s.credits,
        s.year,
        s.type1 || '',
        s.type2 || '',
        s.type3 || '',
        s.type4 || ''
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
        // Format: Name,Credits,Year,Type1,Type2,Type3,Type4,Exclude
        const header = "授業科目,単位,学年,種別1,種別2,種別3,種別4,除外";
        const rows = state.subjects
            .map(s => `${s.name},${s.credits},${s.year},${s.type1 || ''},${s.type2 || ''},${s.type3 || ''},${s.type4 || ''},${s.exclude ? '1' : ''}`);
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
    if (confirm('科目定義のみを初期値（デフォルト）に戻しますか？\n\n・現在編集中の科目定義は失われます。\n・学生リストや成績データは保持されます。')) {
        localStorage.removeItem('gm_master_subjects');
        localStorage.removeItem('gm_master_subjects_json'); // Clear JSON cache to force default reload

        // Do NOT touch students or scores
        // localStorage.setItem('grade_manager_students', JSON.stringify([])); 
        // localStorage.setItem('grade_manager_initialized', 'true');

        alert('科目定義を初期値に戻しました。');
        location.reload();
    }
}

function clearAllDataHard() {
    if (confirm('【危険】全てのデータをリセットしますか？\n\n・学生リスト\n・科目定義\n・全ての成績データ\n\nが完全に削除され、初期状態に戻ります。\n(パスワード設定のみ保持されます)')) {
        if (confirm('本当に実行してよろしいですか？\nこの操作は取り消せません。')) {
            localStorage.removeItem('gm_master_subjects');
            localStorage.removeItem('gm_master_subjects_json');
            localStorage.removeItem('grade_manager_students');
            localStorage.removeItem('grade_manager_scores');
            // Remove initialized flag to force re-generation of defaults if code has them
            localStorage.removeItem('grade_manager_initialized');

            // Also clear state settings but keep auth
            localStorage.removeItem('gm_state_tab');
            localStorage.removeItem('gm_state_student');
            localStorage.removeItem('gm_state_year');
            localStorage.removeItem('gm_state_hide_empty');
            localStorage.removeItem('gm_state_boxplot_year');
            localStorage.removeItem('gm_state_boxplot_test');
            localStorage.removeItem('gm_state_course');

            alert('全データをリセットしました。アプリケーションを再読み込みします。');
            location.reload();
        }
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
            // Improved CSV split to handle quoted fields
            const rows = text.replace(/\r/g, '').split('\n').map(line => {
                let parts = line.match(/(".*?"|[^",\r\n]+)(?=\s*,|\s*$)/g);
                if (parts) {
                    return parts.map(p => p.startsWith('"') && p.endsWith('"') ? p.slice(1, -1) : p.trim());
                }
                return line.split(',');
            });
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
            // Header: 授業科目, 単位, 学年, 種別1, 種別2, [種別3], [種別4], [除外]
            if (header.length <= 9 && header[0].trim() === '授業科目') {
                const newSubjects = [];
                rows.slice(1).forEach(row => {
                    if (row.length < 3) return;
                    const name = row[0].trim();
                    if (!name) return;

                    // Support numeric year or map '特別' to 0/1
                    let y = parseInt(row[2]);
                    if (isNaN(y)) y = 1;

                    newSubjects.push({
                        name: name,
                        credits: parseInt(row[1]) || 0,
                        year: y,
                        type1: row[3]?.trim() || '',
                        type2: row[4]?.trim() || '',
                        type3: row.length > 5 ? row[5]?.trim() : '',
                        type4: row.length > 6 ? row[6]?.trim() : '',
                        exclude: row.length > 7 ? (row[7]?.trim() === '1') : false
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
                const courseFilter = state.currentCourse;

                // Prioritize Course Match
                let subject = state.subjects.find(s => {
                    if (normalizeName(s.name) !== normalizedSubjectName) return false;
                    const t4 = s.type4 || 'コース共通';
                    if (courseFilter && t4 !== 'コース共通' && t4 !== courseFilter) return false;
                    return true;
                });

                // Fallback to any subject with that name
                if (!subject) {
                    subject = state.subjects.find(s => normalizeName(s.name) === normalizedSubjectName);
                }

                if (!subject) {
                    // Add new subject
                    const newSubject = {
                        name: subjectName, // Use original name or normalized? Original is usually safer for display, but lookup needs norm.
                        credits: !isNaN(csvCredits) ? csvCredits : 0,
                        year: !isNaN(csvYear) ? csvYear : 1,
                        type1: row[3] || '不明',
                        type2: row[4] || '一般',
                        type4: courseFilter || 'コース共通'
                    };
                    state.subjects.push(newSubject);
                } else {
                    // Update existing
                    // Only update credits if we have a valid positive number (prevent overwriting with 0)
                    if (!isNaN(csvCredits) && csvCredits > 0 && (!subject.credits || subject.credits === 0)) {
                        subject.credits = csvCredits;
                    }
                    if (!isNaN(csvYear) && (!subject.year || subject.year === 0)) {
                        subject.year = csvYear;
                    }
                    // Only update Types if they are currently missing (don't overwrite with old CSV data)
                    if (row[3] && !subject.type1) subject.type1 = row[3];
                    if (row[4] && !subject.type2) subject.type2 = row[4];
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

// --- Graduation Requirements Logic ---
function renderGraduationRequirements() {
    const studentName = state.currentStudent;
    if (!studentName) return;

    const summaryContainer = document.getElementById('gradRequirementsSummary');
    const detailsBody = document.getElementById('gradRequirementsDetails');
    const courseFilterSelect = document.getElementById('gradCourseFilter');
    if (!summaryContainer || !detailsBody) return;

    if (courseFilterSelect) {
        courseFilterSelect.value = state.currentCourse || '';
    }

    summaryContainer.innerHTML = '';
    detailsBody.innerHTML = '';

    // Logic to identify passed subjects
    const isPassed = (sub) => {
        const score = getScore(studentName, sub.name, '学年末');
        if (score === '認' || score === '履' || score === '修' || score === '合') return true;
        const n = parseFloat(score);
        return !isNaN(n) && n >= 60;
    };

    // Filters and counts
    let totalGeneralCredits = 0;
    let totalProfessionalCredits = 0;

    // Special Study units
    let earnedSpecialStudyRaw = 0;

    let dpACredits = 0;
    let dpBCredits = 0;
    let dpCCredits = 0;
    let dpDCredits = 0;
    let dpECredits = 0;
    let sdgsCount = 0;

    let allRequiredPassed = true;
    let totalRequiredCount = 0;
    let completedRequiredCount = 0;

    // Filter subjects by selected course
    const courseFilter = state.currentCourse;
    const subjects = state.subjects.filter(s => {
        if (courseFilter) {
            const t4 = s.type4 || 'コース共通';
            if (t4 !== 'コース共通' && t4 !== courseFilter) return false;
        }
        return true;
    });

    subjects.forEach(sub => {
        const passed = isPassed(sub);
        const credits = parseFloat(sub.credits) || 0;
        const type1 = sub.type1 || '';
        const type2 = sub.type2 || '';
        const type3 = (sub.type3 || '').toLowerCase();

        // (2) All Required completed
        // User requested that "Required Subjects Completion" refers to '必修得' (Mandatory Credit).
        // We include legacy '必'/'必修' for backward compatibility but exclude '必履修' (Mandatory Enrollment).
        const isRequired = ['必', '必修', '必修得'].includes(type1);
        if (isRequired) {
            totalRequiredCount++;
            if (passed) {
                completedRequiredCount++;
            } else {
                allRequiredPassed = false;
            }
        }

        if (passed) {
            // (1) General vs Professional count
            if (type2 === '一般') {
                totalGeneralCredits += credits;
            } else if (type2 !== 'その他') {
                // Professional usually includes 専門共通, 基盤専門, 応用専門, 特別学修
                if (type2 === '特別学修') {
                    earnedSpecialStudyRaw += credits;
                } else {
                    totalProfessionalCredits += credits;
                }
            }

            // (3)-(7) DPs and SDGs
            if (type3.includes('sdgs')) {
                sdgsCount++;
            }
            if (type3.includes('dp-a')) dpACredits += credits;
            if (type3.includes('dp-b')) dpBCredits += credits;
            if (type3.includes('dp-c')) dpCCredits += credits;
            if (type3.includes('dp-d')) dpDCredits += credits;
            if (type3.includes('dp-e')) dpECredits += credits;
        }
    });

    // Add Special Study to Professional credits (Upper limit not considered as per user request)
    totalProfessionalCredits += earnedSpecialStudyRaw;

    const totalCredits = totalGeneralCredits + totalProfessionalCredits;

    // Requirements Data
    const requirements = [
        {
            name: "卒業所要単位 (合計)",
            target: "167単位以上",
            current: `${totalCredits.toFixed(1)}単位`,
            percent: (totalCredits / 167) * 100,
            judge: totalCredits >= 167,
            id: "req-total"
        },
        {
            name: "一般科目 単位数",
            target: "75単位以上",
            current: `${totalGeneralCredits.toFixed(1)}単位`,
            percent: (totalGeneralCredits / 75) * 100,
            judge: totalGeneralCredits >= 75,
            id: "req-general"
        },
        {
            name: "専門科目 単位数",
            target: "82単位以上",
            current: `${totalProfessionalCredits.toFixed(1)}単位`,
            percent: (totalProfessionalCredits / 82) * 100,
            judge: totalProfessionalCredits >= 82,
            id: "req-professional"
        },
        {
            name: "必修科目 完勝状況",
            target: courseFilter ? `全${totalRequiredCount}科目` : '-',
            current: courseFilter ? `${completedRequiredCount}科目取得` : 'コース未選択',
            percent: courseFilter && totalRequiredCount > 0 ? (completedRequiredCount / totalRequiredCount) * 100 : 0,
            judge: courseFilter ? allRequiredPassed : false,
            id: "req-required"
        },
        {
            name: "DP-A 単位数",
            target: "25単位以上",
            current: `${dpACredits.toFixed(1)}単位`,
            percent: (dpACredits / 25) * 100,
            judge: dpACredits >= 25,
            id: "req-dpa"
        },
        {
            name: "SDGs 取得科目数",
            target: "5科目以上",
            current: `${sdgsCount}科目`,
            percent: (sdgsCount / 5) * 100,
            judge: sdgsCount >= 5,
            id: "req-sdgs"
        },
        {
            name: "DP-B 単位数 (数・理・情)",
            target: "39単位以上",
            current: `${dpBCredits.toFixed(1)}単位`,
            percent: (dpBCredits / 39) * 100,
            judge: dpBCredits >= 39,
            id: "req-dpb"
        },
        {
            name: "DP-C 単位数 (Com)",
            target: "20単位以上",
            current: `${dpCCredits.toFixed(1)}単位`,
            percent: (dpCCredits / 20) * 100,
            judge: dpCCredits >= 20,
            id: "req-dpc"
        },
        {
            name: "DP-D 単位数 (基盤専門)",
            target: "50単位以上",
            current: `${dpDCredits.toFixed(1)}単位`,
            percent: (dpDCredits / 50) * 100,
            judge: dpDCredits >= 50,
            id: "req-dpd"
        },
        {
            name: "DP-E 単位数 (応用専門)",
            target: "13単位以上",
            current: `${dpECredits.toFixed(1)}単位`,
            percent: (dpECredits / 13) * 100,
            judge: dpECredits >= 13,
            id: "req-dpe"
        }
    ];

    // Card colors
    const getThemeColor = (req) => req.judge ? '#10b981' : (req.percent > 80 ? '#f59e0b' : '#ef4444');

    requirements.forEach(req => {
        // Summary Card
        const card = document.createElement('div');
        card.className = 'card';
        card.style.padding = '1.25rem';
        card.style.marginBottom = '0'; // use gap instead
        card.style.borderTop = `4px solid ${getThemeColor(req)}`;
        card.innerHTML = `
            <div style="font-size: 0.85rem; font-weight: 600; color: #64748b; margin-bottom: 0.75rem; display: flex; justify-content: space-between;">
                ${req.name}
                ${req.judge ? '<span style="color:#10b981">●達成</span>' : ''}
            </div>
            <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 0.5rem;">
                <div style="font-size: 1.5rem; font-weight: 700; color: #1e293b;">${req.current}</div>
                <div style="font-size: 0.8rem; color: #94a3b8; padding-bottom: 0.2rem;">目標: ${req.target}</div>
            </div>
            <div style="height: 6px; background: #f1f5f9; border-radius: 3px; overflow: hidden; margin-top: 0.5rem;">
                <div style="height: 100%; width: ${Math.min(req.percent, 100)}%; background: ${getThemeColor(req)}; transition: width 0.5s ease-out;"></div>
            </div>
        `;
        summaryContainer.appendChild(card);

        // Details Row
        const tr = document.createElement('tr');
        const statusHTML = req.judge
            ? `<span style="background: #dcfce7; color: #166534; padding: 0.2rem 0.6rem; border-radius: 1rem; font-size: 0.75rem; font-weight: 700;">達成</span>`
            : `<span style="background: #fee2e2; color: #991b1b; padding: 0.2rem 0.6rem; border-radius: 1rem; font-size: 0.75rem; font-weight: 700;">未達成</span>`;

        tr.innerHTML = `
            <td style="font-weight: 600;">${req.name}</td>
            <td style="color: #64748b;">${req.target}</td>
            <td style="font-weight: 600;">${req.current}</td>
            <td>
                <div style="display: flex; align-items: center; gap: 0.8rem;">
                    <div style="flex: 1; height: 6px; background: #f1f5f9; border-radius: 3px; overflow: hidden; min-width: 60px;">
                        <div style="height: 100%; width: ${Math.min(req.percent, 100)}%; background: ${getThemeColor(req)};"></div>
                    </div>
                    <span style="font-size: 0.8rem; font-weight: 600; width: 40px;">${req.percent.toFixed(0)}%</span>
                </div>
            </td>
            <td style="text-align: center;">${statusHTML}</td>
        `;
        detailsBody.appendChild(tr);
    });

    // Render Gantt Chart
    renderDPGanttChart(studentName, subjects, isPassed);
}

function renderDPGanttChart(studentName, subjects, isPassed) {
    const container = document.getElementById('dpGanttChartContainer');
    if (!container) return;
    container.innerHTML = '';

    const dps = ['DP-A', 'DP-B', 'DP-C', 'DP-D', 'DP-E', 'SDGs'];
    const years = [1, 2, 3, 4, 5];

    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.fontSize = '0.85rem';
    table.style.minWidth = '800px';

    // Header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `<th style="width: 120px; padding: 0.75rem; border: 1px solid #e2e8f0; background: #f1f5f9; text-align: left; position: sticky; left: 0; z-index: 10;">項目</th>`;
    years.forEach(y => {
        const isPastOrCurrent = (y <= state.currentYear);
        const bg = isPastOrCurrent ? '#e2e8f0' : '#f1f5f9';
        headerRow.innerHTML += `<th style="padding: 0.75rem; border: 1px solid #e2e8f0; background: ${bg}; text-align: center;">${y}年</th>`;
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Body
    const tbody = document.createElement('tbody');
    dps.forEach(dp => {
        const row = document.createElement('tr');
        row.innerHTML = `<td style="padding: 0.75rem; border: 1px solid #e2e8f0; font-weight: 700; background: #f8fafc; color: #1e293b; position: sticky; left: 0; z-index: 5;">${dp}</td>`;

        years.forEach(y => {
            const td = document.createElement('td');
            td.style.padding = '0.6rem';
            td.style.border = '1px solid #e2e8f0';
            td.style.verticalAlign = 'top';
            td.style.minWidth = '140px';

            // Background logic for past/current years
            const isPastOrCurrent = (y <= state.currentYear);
            td.style.background = isPastOrCurrent ? '#f1f5f9' : '#fff';

            const filtered = subjects.filter(s => {
                const type3 = (s.type3 || '').toLowerCase();
                const dpTarget = dp.toLowerCase();
                const belongsToDp = type3.split(',').some(part => part.trim() === dpTarget);
                if (!belongsToDp) return false;

                // Match academic year: Either fixed year or float year (year 0) assigned to this year
                let yearMatches = (s.year === y);
                if (s.year === 0) {
                    const scoreObj = (state.scores[studentName] || {})[s.name];
                    yearMatches = (scoreObj && scoreObj.obtainedYear === y);
                }
                if (!yearMatches) return false;

                // SPECIAL FILTER: For past/current years, exclude subjects with no input
                if (isPastOrCurrent) {
                    const scoreObj = (state.scores[studentName] || {})[s.name];
                    const hasInput = scoreObj && SCORE_KEYS.some(k => {
                        const val = scoreObj[k];
                        return val !== undefined && val !== null && val !== '';
                    });
                    if (!hasInput) return false;
                }

                return true;
            });

            if (filtered.length === 0) {
                td.innerHTML = '<div style="color: #cbd5e1; text-align: center; font-size: 0.75rem; margin-top: 0.5rem;">-</div>';
            } else {
                const listWrapper = document.createElement('div');
                listWrapper.style.display = 'flex';
                listWrapper.style.flexDirection = 'column';
                listWrapper.style.gap = '0.5rem';

                filtered.forEach(sub => {
                    const passed = isPassed(sub);
                    const block = document.createElement('div');
                    block.style.padding = '0.5rem 0.75rem';
                    block.style.borderRadius = '0.4rem';
                    block.style.fontSize = '0.75rem';
                    block.style.color = '#fff';
                    block.style.fontWeight = '600';
                    block.style.lineHeight = '1.3';
                    block.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
                    block.style.transition = 'transform 0.1s ease';
                    block.style.cursor = 'default';

                    // Colors based on Status
                    if (passed) {
                        block.style.background = '#10b981'; // Success Green
                        block.style.borderLeft = '4px solid #059669';
                    } else {
                        block.style.background = '#3b82f6'; // Primary Blue
                        block.style.borderLeft = '4px solid #2563eb';
                        block.style.opacity = '0.85';
                    }

                    block.textContent = `${sub.name} (${sub.credits})`;
                    block.title = `${sub.name}\n単位: ${sub.credits}\n状況: ${passed ? '修得済み' : '開講予定'}`;

                    // Hover effect
                    block.onmouseover = () => { block.style.transform = 'translateY(-1px)'; block.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)'; };
                    block.onmouseout = () => { block.style.transform = 'translateY(0)'; block.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)'; };

                    listWrapper.appendChild(block);
                });
                td.appendChild(listWrapper);
            }
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });
    table.appendChild(tbody);
    container.appendChild(table);
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
    } else if (state.currentTab === 'grad_requirements') {
        renderGraduationRequirements();
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
let stats2SimpleChartInstance = null;
let stats2WeightedChartInstance = null;
let stats2GpaChartInstance = null;

// --- GPA / Year Utilities ---

// Helper: Filter subjects based on UI settings (Course, etc.)
const getTargetSubjects = (predicate) => {
    const courseFilter = state.currentCourse;
    return state.subjects.filter(s => {
        if (!predicate(s)) return false;
        if (s.exclude) return false;

        // Course Filter
        if (courseFilter) {
            const t4 = s.type4 || 'コース共通';
            if (courseFilter === 'コース未配属') {
                if (t4 !== 'コース共通') return false;
            } else {
                if (t4 !== 'コース共通' && t4 !== courseFilter) return false;
            }
        }
        return true;
    });
};

// Check if a year is "Finished"
const isYearFinished = (studentName, year) => {
    // Check availability of next year data
    const subjectsNext = getTargetSubjects(s => {
        const nextY = year + 1;
        if (s.year === nextY) return true;
        if (s.year === 0) {
            const scoreObj = (state.scores[studentName] || {})[s.name];
            return scoreObj && scoreObj.obtainedYear === nextY;
        }
        return false;
    });
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

    const subjects = getTargetSubjects(s => {
        if (s.year === year) return true;
        if (s.year === 0) {
            const scoreObj = (state.scores[studentName] || {})[s.name];
            return scoreObj && scoreObj.obtainedYear === year;
        }
        return false;
    });
    if (subjects.length === 0) return true;

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

    // Helper: Filter subjects based on UI settings (Course, etc.)
    // --- GPA Calculation Part ---


    // 2. Get Stats for "Term A"
    const getTermA = (studentName, year) => {
        let sum = 0;
        let count = 0;
        let wSum = 0;
        let creds = 0;
        let gpWSum = 0;
        let gpCreds = 0;

        const subjects = getTargetSubjects(s => {
            if (s.year === year) return true;
            if (s.year === 0) {
                const scoreObj = (state.scores[studentName] || {})[s.name];
                return scoreObj && scoreObj.obtainedYear === year;
            }
            return false;
        });

        subjects.forEach(sub => {
            // ... rest of function logic ...
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
                const subAvg = subValSum / subValCount;
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

    // 3. Get Stats for "Term B"
    const getTermB = (studentName, limitYear) => {
        let sum = 0;
        let count = 0;
        let wSum = 0;
        let creds = 0;
        let gpWSum = 0;
        let gpCreds = 0;

        const subjects = getTargetSubjects(s => {
            if (s.year > 0 && s.year <= limitYear) return true;
            if (s.year === 0) {
                const scoreObj = (state.scores[studentName] || {})[s.name];
                return scoreObj && scoreObj.obtainedYear > 0 && scoreObj.obtainedYear <= limitYear;
            }
            return false;
        });

        subjects.forEach(sub => {
            // ... rest ...
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
        const subjects = getTargetSubjects(s => {
            if (s.year === year) return true;
            if (s.year === 0) {
                const scoreObj = (state.scores[studentName] || {})[s.name];
                return scoreObj && scoreObj.obtainedYear === year;
            }
            return false;
        });
        // ... rest ...
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

        const finished = isYearFinished(studentName, year);

        if (finished) {
            const res = getTermB(studentName, year);
            return { hasData: res !== null, ...res };
        } else {
            const termA = getTermA(studentName, year);
            let termB = null;
            if (year > 1) {
                termB = getTermB(studentName, year - 1);
            }

            if (!termA) return { hasData: false };

            if (!termB) {
                return { hasData: true, ...termA };
            } else {
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

    // --- Helper to create a dual-axis chart for Stats2 ---
    const createStats2Chart = (canvasId, label, valueData, rankData, instanceVar, valueMax, valueTitle) => {
        const ctx = document.getElementById(canvasId)?.getContext('2d');
        if (!ctx) return null;

        // Destroy old instance if it exists
        if (instanceVar && typeof instanceVar.destroy === 'function') {
            instanceVar.destroy();
        }

        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: label,
                        data: valueData,
                        borderColor: '#2563eb', // Blue
                        backgroundColor: '#2563eb',
                        yAxisID: 'y',
                        tension: 0.1,
                        borderWidth: 3,
                        pointRadius: 5
                    },
                    {
                        label: '順位',
                        data: rankData,
                        borderColor: '#ef4444', // Red
                        backgroundColor: '#ef4444',
                        yAxisID: 'y1',
                        tension: 0.1,
                        borderWidth: 2,
                        borderDash: [5, 5],
                        pointRadius: 4,
                        pointStyle: 'rectRot'
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
                layout: { padding: { top: 30, bottom: 10 } },
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    title: { display: true, text: label + ' 推移', font: { weight: 'bold', size: 16 } },
                    legend: { display: true, position: 'top' },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                if (context.datasetIndex === 1) {
                                    return `順位: ${context.parsed.y}位 / ${state.students.length}人`;
                                }
                                return `${label}: ${context.parsed.y.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: true, color: 'rgba(0,0,0,0.1)' },
                        border: { display: true, color: '#000', width: 1.5 },
                        ticks: { color: '#000' }
                    },
                    y: {
                        type: 'linear',
                        position: 'left',
                        min: 0,
                        max: valueMax,
                        title: { display: true, text: valueTitle, font: { weight: 'bold' } },
                        grid: { color: 'rgba(0,0,0,0.1)' },
                        border: { display: true, color: '#000', width: 1.5 },
                        ticks: { color: '#000' }
                    },
                    y1: {
                        type: 'linear',
                        position: 'right',
                        reverse: true,
                        min: 1,
                        max: Math.max(state.students.length, 1),
                        title: { display: true, text: '順位', font: { weight: 'bold' } },
                        grid: { drawOnChartArea: false },
                        border: { display: true, color: '#000', width: 1.5 },
                        ticks: { color: '#000', stepSize: 1, callback: (v) => Math.floor(v) === v ? v : '' }
                    }
                }
            }
        });
    };

    stats2SimpleChartInstance = createStats2Chart('stats2SimpleChart', '平均点 (単純)', simpleAvgData, rankSimpleData, stats2SimpleChartInstance, 100, '点数');
    stats2WeightedChartInstance = createStats2Chart('stats2WeightedChart', '平均点 (加重)', weightedAvgData, rankWeightedData, stats2WeightedChartInstance, 100, '点数');
    stats2GpaChartInstance = createStats2Chart('stats2GpaChart', 'GPA', gpaData, rankGpaData, stats2GpaChartInstance, 4.0, 'GPA');
}

// Event listener for toggle


function renderGradesTable() {
    const tbody = document.getElementById('gradesBody');
    const specialTbody = document.getElementById('specialGradesBody');
    const otherTbody = document.getElementById('otherGradesBody');

    tbody.innerHTML = '';
    specialTbody.innerHTML = '';
    if (otherTbody) otherTbody.innerHTML = '';

    const courseFilter = state.currentCourse;

    // 0. Credits Counter
    let totalCreditsCurrentYear = 0;

    const subjects = state.subjects.filter(s => {
        // 1. Course Filter
        if (courseFilter) {
            const t4 = s.type4 || 'コース共通';
            if (t4 !== 'コース共通' && t4 !== courseFilter) return false;
        }

        // 2. Year Match Logic

        // A. Standard Year Specific Subjects
        if (s.year === state.currentYear) return true;

        // B. Floater / Special Subjects (Year = 0)
        if (s.year === 0) {
            const scoreObj = (state.scores[state.currentStudent] || {})[s.name];

            // SPECIAL FIX: For "Special Activities 1-3", they correspond roughly to Year 1-3.
            // If they are strictly named "特・特別活動N", map them to Year N.
            const match = s.name.match(/特・特別活動(\d+)/);
            if (match) {
                const targetYear = parseInt(match[1]);
                if (targetYear === state.currentYear) return true;
                return false;
            }

            // Other Special Subjects:
            // If obtainedYear is recorded, Strict Check
            if (scoreObj && scoreObj.obtainedYear) {
                if (scoreObj.obtainedYear === state.currentYear) return true;
                return false; // Belongs to another year
            }

            // If NO obtainedYear, default to SHOW (for new inputs)
            return true;
        }

        return false;
    });
    const studentScores = state.scores[state.currentStudent] || {};

    // Check based on Summary Table logic (Visible subjects ONLY)
    // If ANY subject in the current visible list has a "Year End" score, we consider the summary valid/year finished.
    // EXCLUDE Special Activities themselves from this check to avoid circular logic or self-validation (as they are '0' year subjects usually)
    const hasSummaryBaseData = subjects.some(s => {
        if (s.name.startsWith('特・')) return false; // Ignore special subjects for base data check
        const scoreObj = studentScores[s.name];
        return scoreObj && scoreObj['学年末'] && scoreObj['学年末'] !== '';
    });

    subjects.forEach(sub => {
        // Filter logic: if hiding empty, check if ANY score exists for this subject
        if (state.hideEmptySubjects) {
            const scoreObj = studentScores[sub.name];

            // EXCEPTION CHECK FIRST: Special Activities
            // They should be displayed if criteria met (Summary table logic) regardless of whether they have local data scoreObj yet.
            const isSpecialActivity = (sub.name === '特・特別活動1' || sub.name === '特・特別活動2' || sub.name === '特・特別活動3');

            if (isSpecialActivity) {
                if (hasSummaryBaseData) {
                    // Show ONLY if Summary Base Data exists (Year End of normal subjects is done)
                } else {
                    return; // Hide if Summary logic not met (even if it has data?) 
                    // User said: "学年末が終わっていない学年すなわち、成績集計 (Summary)の学年末が空欄の学年も表示されます" -> implies they want it HIDDEN if year not done.
                }
            } else {
                // Regular Hiding Logic

                // Do NOT hide Required (必/必修得) subjects for the current year, even if empty, to allow entry.
                // Note: Special Activities are '必修得' but handled above.
                // Do NOT hide Required (必) subjects for the current year, even if empty, to allow entry.
                // Note: Special Activities are '必修得' but handled above.
                if (sub.type1 !== '必') {
                    if (!scoreObj) return; // No data object at all -> Hide

                    const hasValue = SCORE_KEYS.some(key => {
                        const val = scoreObj[key];
                        return val !== undefined && val !== null && val !== '';
                    });

                    if (!hasValue) return; // Object exists but no values -> Hide
                }
            }
        }

        let targetTbody = tbody;
        let isSpecialRow = false;

        if (sub.name.startsWith('特・')) {
            // "特・特別活動1/2/3" are explicitly requested to be in Others table
            if (sub.name === '特・特別活動1' || sub.name === '特・特別活動2' || sub.name === '特・特別活動3') {
                targetTbody = otherTbody;
            } else {
                targetTbody = specialTbody;
            }
            isSpecialRow = true;
        } else if (sub.type2 === 'その他') {
            targetTbody = otherTbody;
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

            // If Year End is empty, look for ANY other value (e.g. Early Mid, Late Mid, etc.)
            // This is crucial for Special Activities which might have data in other columns depending on import or error.
            if (!currentVal) {
                for (const k of SCORE_KEYS) {
                    if (scoreObj[k]) {
                        currentVal = scoreObj[k];
                        break;
                    }
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
            input.title = `${sub.name} - 認定/履修状況`;

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
                input.title = `${sub.name} - ${key}`;

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

        // Add to Credit Count if passed
        // Logic: specific keys or '学年末' >= 60 or '合/認/修/履'
        let isPassed = false;
        // Check representative value (Final)
        let finalVal = (studentScores[sub.name] || {})['学年末'];

        // Also check numerical scores in other tests if Final is empty (simple average check?) NO, usually credit is based on Final.
        // But for Special Studies, we use '学年末' as slot.
        const passingGrades = ['合', '認', '修', '履', 'S', 'A', 'B', 'C'];

        if (passingGrades.includes(finalVal)) {
            isPassed = true;
        } else {
            const n = parseFloat(finalVal);
            if (!isNaN(n) && n >= 60) isPassed = true;
        }

        if (isPassed) {
            totalCreditsCurrentYear += (sub.credits || 0);
        }
    });

    /* Summary Row (Total Credits) Disabled by user request
    if (totalCreditsCurrentYear > 0 || hasYearEndData) {
        // Code removed
    } */

    const pasteIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>`;

    // Hide empty Special/Other tables
    const specialCard = specialTbody.closest('.card');
    if (specialCard) {
        specialCard.style.display = specialTbody.children.length > 0 ? 'block' : 'none';
    }

    const otherCard = otherTbody ? otherTbody.closest('.card') : null;
    if (otherCard) {
        otherCard.style.display = (otherTbody && otherTbody.children.length > 0) ? 'block' : 'none';
    }

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

    // For year-0 subjects (Floaters), pin them to the year they were first entered
    const courseFilter = state.currentCourse;
    const subDef = state.subjects.find(s => {
        if (s.name !== subject) return false;
        const t4 = s.type4 || 'コース共通';
        if (courseFilter && t4 !== 'コース共通' && t4 !== courseFilter) return false;
        return true;
    }) || state.subjects.find(s => s.name === subject);

    if (subDef && subDef.year === 0) {
        if (!state.scores[student][subject].obtainedYear) {
            state.scores[student][subject].obtainedYear = state.currentYear;
        }
    }

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

    const courseFilter = state.currentCourse;
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

        const courseFilter = state.currentCourse;
        const normName = normalizeStr(subjectName);

        // Preferred Match: Name AND (Course Match OR Common)
        let existingSub = state.subjects.find(s => {
            if (normalizeStr(s.name) !== normName) return false;
            const t4 = s.type4 || 'コース共通';
            if (courseFilter && t4 !== 'コース共通' && t4 !== courseFilter) return false;
            return true;
        });

        // Fallback 1: Just Name match
        if (!existingSub) {
            existingSub = state.subjects.find(s => normalizeStr(s.name) === normName);
        }

        // Fallback 2: Fuzzy Match with prefix, prioritizing course
        if (!existingSub) {
            const fuzzy = "特・" + normName;
            existingSub = state.subjects.find(s => {
                if (normalizeStr(s.name) !== fuzzy) return false;
                const t4 = s.type4 || 'コース共通';
                if (courseFilter && t4 !== 'コース共通' && t4 !== courseFilter) return false;
                return true;
            }) || state.subjects.find(s => normalizeStr(s.name) === fuzzy);
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
        // Apply filters: Course Filter & Hide Empty
        const courseFilter = state.currentCourse;

        const subjects = state.subjects.filter(s => {
            // 1. Year Match (Standard or Floater)
            let yearMatches = (s.year === year);
            if (s.year === 0) {
                const scoreObj = (state.scores[state.currentStudent] || {})[s.name];
                yearMatches = (scoreObj && scoreObj.obtainedYear === year);
            }
            if (!yearMatches) return false;

            // 2. Course Filter
            if (courseFilter) {
                const t4 = s.type4 || 'コース共通';
                if (t4 !== 'コース共通' && t4 !== courseFilter) return false;
            }

            // 3. Hide Empty (No Credit / No Score)
            if (state.hideEmptySubjects) {
                const scoreObj = state.scores[state.currentStudent] && state.scores[state.currentStudent][s.name];
                if (!scoreObj) return false;

                const hasValue = SCORE_KEYS.some(key => {
                    const val = scoreObj[key];
                    return val !== undefined && val !== null && val !== '';
                });
                if (!hasValue) return false;
            }

            return true;
        });

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
        const courseFilter = state.currentCourse;

        const subjects = state.subjects.filter(s => {
            if (s.year !== latestYear) return false;
            if (s.name.startsWith('特・')) return false;

            // Course Filter
            if (courseFilter) {
                const t4 = s.type4 || 'コース共通';
                if (courseFilter === 'コース未配属') {
                    if (t4 !== 'コース共通') return false;
                } else {
                    if (t4 !== 'コース共通' && t4 !== courseFilter) return false;
                }
            }

            // Hide Empty (If enabled, show only if current student has ANY data for this subject)
            if (state.hideEmptySubjects) {
                const scoreObj = state.scores[state.currentStudent] && state.scores[state.currentStudent][s.name];
                if (!scoreObj) return false;
                const keys = ["前期中間", "前期末", "後期中間", "学年末"];
                const hasValue = keys.some(k => {
                    const v = scoreObj[k];
                    return v !== undefined && v !== null && v !== '';
                });
                if (!hasValue) return false;
            }

            return true;
        });

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

    const courseFilter = state.currentCourse;
    const hideEmpty = state.hideEmptySubjects;

    // Collect all timepoints (Year-Test combinations)
    // Iterate 1 to 5 (asc)
    const labels = [];
    const avgData = []; // Average Score
    const rankData = []; // Rank

    // We iterate 1..5. Always include axis even if empty.
    for (let y = 1; y <= 5; y++) {
        // Filter subjects
        const subs = state.subjects.filter(s => {
            // 1. Year Match (Standard or Floater)
            let yearMatches = (s.year === y);
            if (s.year === 0) {
                const scoreObj = (state.scores[state.currentStudent] || {})[s.name];
                yearMatches = (scoreObj && scoreObj.obtainedYear === y);
            }
            if (!yearMatches) return false;

            if (s.name.startsWith('特・')) return false;

            // 2. Course Filter
            if (courseFilter) {
                const t4 = s.type4 || 'コース共通';
                if (t4 !== 'コース共通' && t4 !== courseFilter) return false;
            }

            // 3. Hide Empty
            if (hideEmpty) {
                const scoreObj = state.scores[state.currentStudent] && state.scores[state.currentStudent][s.name];
                if (!scoreObj) return false;
                const hasValue = SCORE_KEYS.some(k => {
                    const v = scoreObj[k];
                    return v !== undefined && v !== null && v !== '';
                });
                if (!hasValue) return false;
            }
            return true;
        });

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

// ==================== CLASS STATS ====================

function initClassStats() {
    // Initial render or clear?
    // User needs to click 'Generate' to see stats usually, or we can auto-generate.
    // Let's auto-generate using default '学年末' if container is empty.
    const container = document.getElementById('classStatsContainer');
    if (container && container.innerHTML.trim() === '') {
        document.getElementById('classStatsTest').value = '学年末'; // Default
        generateClassStats();
    }
}

function generateClassStats() {
    const testKey = document.getElementById('classStatsTest').value;
    const container = document.getElementById('classStatsContainer');
    if (!container) return;

    container.innerHTML = '<p>集計中 (Calculating)...</p>';

    // Filter Subjects based on User Settings
    // 1. Course Filter
    // 2. Hide Empty (personal relevance)
    const courseFilter = state.currentCourse;
    const hideEmpty = state.hideEmptySubjects; // "単位認定のない科目を隠す"

    // Group subjects by Year? Or just flat list?
    // Class Stats usually implies "All Class Subjects".
    // Let's list by Year then Subject.

    // Filter
    const targetSubjects = state.subjects.filter(s => {
        if (s.exclude) return false;

        // Course Filter
        if (courseFilter) {
            const t4 = s.type4 || 'コース共通';
            if (t4 !== 'コース共通' && t4 !== courseFilter) return false;
        }

        // Hide Empty: Check if CURRENT STUDENT has data
        // This makes the report "My Relevant Class Stats"
        if (hideEmpty) {
            const scoreObj = state.scores[state.currentStudent] && state.scores[state.currentStudent][s.name];
            if (!scoreObj) return false;
            const keys = ["前期中間", "前期末", "後期中間", "学年末"];
            const hasValue = keys.some(k => {
                const v = scoreObj[k];
                return v !== undefined && v !== null && v !== '';
            });
            if (!hasValue) return false;
        }

        return true;
    });

    if (targetSubjects.length === 0) {
        container.innerHTML = '<p>表示する科目がありません (No subjects match filter).</p>';
        return;
    }

    // Sort by Year, then Name
    targetSubjects.sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.name.localeCompare(b.name, 'ja');
    });

    // Generate Table Data
    let html = `
        <table class="report-table" style="font-size: 0.9rem; width: 100%;">
            <thead>
                <tr>
                    <th style="width: 50px;">学年</th>
                    <th>科目名 (Subject)</th>
                    <th style="width: 60px;">単位</th>
                    <th style="width: 80px;">コース</th>
                    <th style="width: 60px;">平均</th>
                    <th style="width: 60px;">最高</th>
                    <th style="width: 60px;">最低</th>
                    <th style="width: 80px;">受験者数</th>
                    <th style="width: 60px;">自分の点</th>
                    <th style="width: 60px;">偏差値</th>
                </tr>
            </thead>
            <tbody>
    `;

    targetSubjects.forEach(sub => {
        // Calculate Class Stats
        let total = 0;
        let count = 0;
        let min = 100;
        let max = 0;
        const scores = [];

        state.students.forEach(std => {
            const val = getScore(std, sub.name, testKey);
            if (typeof val === 'number') {
                scores.push(val);
                total += val;
                count++;
                if (val < min) min = val;
                if (val > max) max = val;
            }
        });

        if (count === 0) {
            // No data for this subject in the class
            // Skip or show empty? Show empty to indicate it exists.
            // Wait, if hideEmpty is checked, we might have skipped it if *I* didn't take it.
            // If I took it but nobody has scores yet (e.g. future test), show dash.
            html += `
                <tr>
                    <td style="text-align: center;">${sub.year}</td>
                    <td>${sub.name}</td>
                    <td style="text-align: center;">${sub.credits}</td>
                    <td style="text-align: center;"><span class="badge badge-purple">${sub.type4 || '-'}</span></td>
                    <td style="text-align: center;">-</td>
                    <td style="text-align: center;">-</td>
                    <td style="text-align: center;">-</td>
                    <td style="text-align: center;">0</td>
                    <td style="text-align: center;">-</td>
                    <td style="text-align: center;">-</td>
                </tr>
            `;
            return;
        }

        const avg = total / count;

        // Std Dev
        let sumSqDiff = 0;
        scores.forEach(s => sumSqDiff += Math.pow(s - avg, 2));
        const variance = sumSqDiff / count; // Population or Sample? Usually population for class stats
        const stdDev = Math.sqrt(variance);

        // My Score
        const myScore = getScore(state.currentStudent, sub.name, testKey);
        let myScoreDisplay = '-';
        let myDevDisplay = '-';

        if (typeof myScore === 'number') {
            myScoreDisplay = myScore;
            if (stdDev > 0) {
                const dev = 50 + 10 * ((myScore - avg) / stdDev);
                myDevDisplay = dev.toFixed(1);
            } else {
                myDevDisplay = '50.0';
            }
        } else if (myScore) {
            myScoreDisplay = myScore; // String value (Pass, etc)
        }

        html += `
            <tr>
                <td style="text-align: center;">${sub.year === 0 ? ((state.scores[state.currentStudent]?.[sub.name]?.obtainedYear) || '特別') : sub.year}</td>
                <td><div style="font-weight: 600;">${sub.name}</div></td>
                <td style="text-align: center;">${sub.credits}</td>
                <td style="text-align: center;"><span class="badge ${sub.type4 ? 'badge-purple' : 'badge-gray'}" style="${sub.type4 ? 'background:#faf5ff; color:#6b21a8; border-color:#e9d5ff;' : ''}">${sub.type4 || '-'}</span></td>
                <td style="text-align: center;">${avg.toFixed(1)}</td>
                <td style="text-align: center;">${max}</td>
                <td style="text-align: center;">${min}</td>
                <td style="text-align: center;">${count}</td>
                <td style="text-align: center; font-weight: bold; ${typeof myScore === 'number' && myScore < 60 ? 'color: red;' : ''}">${myScoreDisplay}</td>
                <td style="text-align: center;">${myDevDisplay}</td>
            </tr>
        `;
    });

    html += `</tbody></table>`;

    // Add Summary
    html += `<div style="margin-top: 1rem; text-align: right; color: #64748b; font-size: 0.85rem;">対象科目数: ${targetSubjects.length}</div>`;

    container.innerHTML = html;
}

// Helpers
function getYearColor(year) {
    const colors = {
        1: '#3b82f6', // Year 1: Blue
        2: '#10b981', // Year 2: Green
        3: '#f59e0b', // Year 3: Amber
        4: '#ef4444', // Year 4: Red
        5: '#8b5cf6'  // Year 5: Purple
    };
    return colors[year] || '#94a3b8'; // Default: Slate
}

// Start
document.addEventListener('DOMContentLoaded', init);

// --- At Risk Students Report ---
function toggleAtRiskInputs() {
    const type = document.getElementById('atRiskTypeSelect')?.value;
    const testWrapper = document.getElementById('atRiskTestWrapper');
    const instrTest = document.getElementById('instr-test');
    const instrYear = document.getElementById('instr-year_avg');

    if (testWrapper) testWrapper.style.display = (type === 'test') ? 'flex' : 'none';
    if (instrTest) instrTest.classList.toggle('hidden', type !== 'test');
    if (instrYear) instrYear.classList.toggle('hidden', type !== 'year_avg');
}

function initAtRiskDefaults() {
    const yearSelect = document.getElementById('atRiskYearSelect');
    const testSelect = document.getElementById('atRiskTestSelect');
    if (!yearSelect || !testSelect) return;

    // 1. Set default year to the overall current year
    if (state.currentYear) {
        yearSelect.value = state.currentYear;
    } else {
        let maxYear = 1;
        state.subjects.forEach(s => { if (s.year > maxYear) maxYear = s.year; });
        yearSelect.value = maxYear;
    }

    const targetYear = parseInt(yearSelect.value);

    // 2. Default to latest test with significant data in THAT year
    const priorities = ["前期中間", "前期末", "後期中間", "学年末"];
    let maxFoundIdx = -1;

    // Search across all students to see what tests have data for the target year
    outerLoop:
    for (const s of state.students) {
        const yearSubjects = state.subjects.filter(sub => sub.year === targetYear && !sub.exclude);
        for (const sub of yearSubjects) {
            for (let idx = 0; idx < priorities.length; idx++) {
                if (idx > maxFoundIdx) {
                    const key = priorities[idx];
                    const v = getScore(s, sub.name, key);
                    if (v !== undefined && v !== null && v !== '') {
                        maxFoundIdx = idx;
                        if (maxFoundIdx === 3) break outerLoop; // Found Year-End data, absolute max
                    }
                }
            }
        }
    }

    if (maxFoundIdx !== -1) {
        testSelect.value = priorities[maxFoundIdx];
    } else {
        testSelect.value = "前期末"; // Default fallback
    }
}

function renderAtRiskReport() {
    const type = document.getElementById('atRiskTypeSelect')?.value;
    const yearSelect = document.getElementById('atRiskYearSelect');
    const testSelect = document.getElementById('atRiskTestSelect');
    if (!yearSelect || !testSelect) return;

    const year = yearSelect.value;
    const test = testSelect.value;
    const reportArea = document.getElementById('atRiskReportArea');
    if (!reportArea) return;

    const yearSubjects = state.subjects.filter(s => s.year == year && !s.exclude);
    const results = [];

    state.students.forEach(studentName => {
        let count59 = 0;
        let count49 = 0;
        let count39 = 0;
        const lowScores = [];

        yearSubjects.forEach(sub => {
            let scoreValue = NaN;

            if (type === 'test') {
                scoreValue = parseFloat(getScore(studentName, sub.name, test));
            } else {
                // Year Average
                const tests = ["前期中間", "前期末", "後期中間", "学年末"];
                let sum = 0;
                let count = 0;
                tests.forEach(t => {
                    const s = parseFloat(getScore(studentName, sub.name, t));
                    if (!isNaN(s)) {
                        sum += s;
                        count++;
                    }
                });
                if (count > 0) scoreValue = sum / count;
            }

            if (!isNaN(scoreValue)) {
                if (scoreValue <= 59.9) { // Using 59.9 to capture below 60
                    count59++;
                    if (scoreValue <= 49.9) count49++;
                    if (scoreValue <= 39.9) count39++;
                    lowScores.push({ name: sub.name, score: scoreValue });
                }
            }
        });

        // Condition Test: (<=59) >= 4 OR (<=49) >= 3 OR (<=39) >= 2
        // Condition Year Avg: (<=59) >= 3 OR (<=49) >= 2 OR (<=39) >= 1
        let isAtRisk = false;
        if (type === 'test') {
            isAtRisk = (count59 >= 4 || count49 >= 3 || count39 >= 2);
        } else {
            isAtRisk = (count59 >= 3 || count49 >= 2 || count39 >= 1);
        }

        if (isAtRisk) {
            results.push({
                name: studentName,
                count59,
                count49,
                count39,
                lowScores: lowScores
            });
        }
    });

    if (results.length === 0) {
        reportArea.innerHTML = `
            <div style="text-align: center; padding: 4rem; background: #f8fafc; border-radius: 1rem; border: 2px dashed #e2e8f0;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">✅</div>
                <div style="font-size: 1.1rem; font-weight: 600; color: #1e293b;">該当する学生はいません</div>
                <div style="color: #64748b; margin-top: 0.5rem;">${year}年 ${type === 'test' ? test : '通年平均'} において、抽出条件に合致する学生は見つかりませんでした。</div>
            </div>
        `;
        return;
    }

    let html = `
        <div class="card" style="border: 2px solid #fee2e2; background: #fff;">
            <div style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div style="font-weight: 700; font-size: 1.25rem; color: #b91c1c;">抽出結果: ${results.length} 名</div>
                    <div style="font-size: 0.85rem; color: #64748b; margin-top: 2px;">対象: ${year}年 ${type === 'test' ? test : '科目別通年平均'}</div>
                </div>
                <div class="no-print">
                    <button class="btn btn-secondary" onclick="window.print()" style="gap: 0.5rem; display: flex; align-items: center; border: 1px solid #cbd5e1;">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" width="18" height="18">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        帳票として印刷 (Print)
                    </button>
                </div>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr style="background: #fef2f2;">
                            <th style="width: 150px;">学生名</th>
                            <th style="width: 250px;">アラート条件</th>
                            <th>対象科目と${type === 'test' ? '点数' : '平均点'}</th>
                        </tr>
                    </thead>
                    <tbody>
    `;

    results.forEach(res => {
        const reasons = [];
        if (type === 'test') {
            if (res.count59 >= 4) reasons.push(`59点以下 × ${res.count59}`);
            if (res.count49 >= 3) reasons.push(`49点以下 × ${res.count49}`);
            if (res.count39 >= 2) reasons.push(`39点以下 × ${res.count39}`);
        } else {
            if (res.count59 >= 3) reasons.push(`平均59点以下 × ${res.count59}`);
            if (res.count49 >= 2) reasons.push(`平均49点以下 × ${res.count49}`);
            if (res.count39 >= 1) reasons.push(`平均39点以下 × ${res.count39}`);
        }

        const scoreBadges = res.lowScores
            .sort((a, b) => a.score - b.score)
            .map(s => {
                let colorClass = 'background: #fee2e2; color: #b91c1c; border: 1px solid #fecaca;';
                if (s.score <= 39.9) colorClass = 'background: #450a0a; color: #fff;';
                else if (s.score <= 49.9) colorClass = 'background: #7f1d1d; color: #fff;';

                const valDisplay = type === 'test' ? s.score : s.score.toFixed(1);
                return `<span style="display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; ${colorClass} margin-right: 4px; margin-bottom: 4px;">
                    ${s.name}: ${valDisplay}
                </span>`;
            }).join('');

        html += `
            <tr>
                <td style="font-weight: 700; color: #1e293b; font-size: 1.1rem;">${res.name}</td>
                <td>
                    <div style="display: flex; flex-direction: column; gap: 4px;">
                        ${reasons.map(r => `<span style="color: #dc2626; font-weight: 600; font-size: 0.85rem;">⚠️ ${r}</span>`).join('')}
                    </div>
                </td>
                <td style="padding: 1rem;">
                    ${scoreBadges}
                </td>
            </tr>
        `;
    });

    html += `
                    </tbody>
                </table>
            </div>
        </div>
    `;

    reportArea.innerHTML = html;
}
