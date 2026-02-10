
// ==================== SIDEBAR CONTROL ====================
function toggleSidebar(show) {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    if (show) {
        if (sidebar) sidebar.classList.add('open');
        if (overlay) overlay.classList.add('active');
    } else {
        if (sidebar) sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
    }
}

function normalizeDateStr(s) {
    if (!s) return "";
    const parts = s.split('/');
    if (parts.length < 3) return s;
    const y = parts[0];
    const m = parts[1].padStart(2, '0');
    const d = parts[2].padStart(2, '0');
    return `${y}/${m}/${d}`;
}

/**
 * 日本の祝日を判定・取得するヘルパー
 * 2099年までの祝日法(ハッピーマンデー、振替休日、国民の休日等)に対応
 */
function getJapaneseHolidays(year) {
    const holidays = {};

    function add(date, name) {
        const key = `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
        holidays[key] = name;
    }

    // --- 固定祝日 ---
    add(new Date(year, 0, 1), "元日");
    add(new Date(year, 1, 11), "建国記念の日");
    add(new Date(year, 1, 23), "天皇誕生日");
    add(new Date(year, 3, 29), "昭和の日");
    add(new Date(year, 4, 3), "憲法記念日");
    add(new Date(year, 4, 4), "みどりの日");
    add(new Date(year, 4, 5), "こどもの日");
    add(new Date(year, 7, 11), "山の日");
    add(new Date(year, 10, 3), "文化の日");
    add(new Date(year, 10, 23), "勤労感謝の日");

    // --- ハッピーマンデー (第n月曜日) ---
    function nthMonday(year, month, n) {
        const first = new Date(year, month, 1);
        const day = first.getDay(); // 0:Sun
        const offset = (day <= 1) ? (1 - day) : (8 - day);
        return new Date(year, month, 1 + offset + (n - 1) * 7);
    }
    add(nthMonday(year, 0, 2), "成人の日");
    add(nthMonday(year, 6, 3), "海の日");
    add(nthMonday(year, 8, 3), "敬老の日");
    add(nthMonday(year, 9, 2), "スポーツの日");

    // --- 節気由来 (春分・秋分) 簡易計算式 ---
    const shunbun = Math.floor(20.8431 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4));
    add(new Date(year, 2, shunbun), "春分の日");
    const shubun = Math.floor(23.2488 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4));
    add(new Date(year, 8, shubun), "秋分の日");

    // --- 振替休日の判定 ---
    // 祝日が日曜日の場合、その後の最初の平日を振替休日とする
    let holidayDates = Object.keys(holidays).map(k => new Date(k)).sort((a, b) => a - b);
    holidayDates.forEach(d => {
        if (d.getDay() === 0) { // 日曜日が祝日の場合
            let helper = new Date(d);
            let key;
            do {
                helper.setDate(helper.getDate() + 1);
                key = `${helper.getFullYear()}/${(helper.getMonth() + 1).toString().padStart(2, '0')}/${helper.getDate().toString().padStart(2, '0')}`;
            } while (holidays[key]); // 既に他の祝日なら翌日にずらす
            add(helper, "振替休日");
        }
    });

    // --- 国民の休日 (祝日と祝日に挟まれた平日) ---
    holidayDates = Object.keys(holidays).map(k => new Date(k)).sort((a, b) => a - b);
    for (let i = 0; i < holidayDates.length - 1; i++) {
        const d1 = holidayDates[i];
        const d2 = holidayDates[i + 1];
        // 1日飛ばしで祝日がある場合
        if (d2.getTime() - d1.getTime() === 2 * 24 * 60 * 60 * 1000) {
            const mid = new Date(d1);
            mid.setDate(mid.getDate() + 1);
            if (mid.getDay() !== 0) { // 日曜でない場合 (日曜なら上記の振替休日ロジックが優先される)
                add(mid, "国民の休日");
            }
        }
    }

    return holidays;
}

// ==================== DATA CONSTANTS ====================
// These are factory defaults. We use localStorage for actual master data.
const DEFAULT_STUDENTS_RAW = `
学生太郎,学生次郎,学生花子,学生A,学生B,学生C,学生D,学生E
`;

let holidayCache = {};
function getJapaneseHolidaysCached(year) {
    if (!holidayCache[year]) holidayCache[year] = getJapaneseHolidays(year);
    return holidayCache[year];
}


const DEFAULT_OFFICER_ROLES = [
    {
        category: "クラス役員 (HR Officers)",
        roles: [
            { id: "sodai", name: "総代", limit: 1, desc: "代表としてクラスをまとめる。高専祭等においてクラスの長を務める。" },
            { id: "fuku_sodai", name: "副総代", limit: 1, desc: "HRの進行役。記録も付ける。" },
            { id: "hr_iincho", name: "HR委員長", limit: 1, desc: "HRの計画・運営を指揮する。" },
            { id: "hr_iin", name: "HR委員", limit: 0, desc: "HRの計画・運営をする。" }
        ]
    },
    {
        category: "係・分掌 (Class Duties)",
        roles: [
            { id: "kyomu", name: "教務係", limit: 1, desc: "出席簿管理、印刷物配布などを行う。" },
            { id: "taiiku_m", name: "体育係(男)", limit: 1, desc: "体育時の貴重品管理、教員連絡(男)。" },
            { id: "taiiku_f", name: "体育係(女)", limit: 1, desc: "体育時の貴重品管理、教員連絡(女)。" },
            { id: "kankyo", name: "環境推進員", limit: 1, desc: "教室環境（電灯・空調・加湿器）の管理。" },
            { id: "kaikei", name: "会計係", limit: 1, desc: "クラスイベント時の会計管理。" },
            { id: "bika", name: "美化委員", limit: 0, desc: "教室及び校内美化を推進する。" }
        ]
    },
    {
        category: "行事委員 (Event Committees)",
        roles: [
            { id: "olympic", name: "高専オリンピック委員", limit: 0, desc: "イベント運営の補助。" },
            { id: "kosensai", name: "高専祭委員", limit: 0, desc: "イベント運営の補助。" },
            { id: "album", name: "アルバム委員", limit: 2, desc: "卒業アルバムの作成準備。" }
        ]
    },
    {
        category: "学友会関連 (Student Association)",
        roles: [
            { id: "hyogi", name: "評議員", limit: 0, desc: "クラスを代表して評議会に出席し、学友会執行部の提案を審議する。審議内容をクラスに報告する。" },
            { id: "shikko", name: "准執行委員", limit: 0, desc: "執行委員長を補佐し、執行委員会の業務を分掌する。" },
            { id: "senkyo", name: "選挙管理委員", limit: 0, desc: "選挙等を管理する。" }
        ]
    }
];

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
    currentClass: localStorage.getItem('gm_state_class') || '1',
    isLoggedIn: false,
    passwordHash: localStorage.getItem('gm_auth_hash') || null,
    seating: {
        cols: 7,
        rows: 7,
        assignments: {},
        fixed: [],
        disabled: [],
        perspective: 'teacher',
        colorMode: 'none', // 'none', 'grade', 'attendance'
        gradeThreshold: 60,
        gradeMethod: 'cumulative'
    },
    seatingPresets: [],
    studentMetadata: {}, // Store tag info (extra columns from roster)
    nameDisplayMode: localStorage.getItem('gm_state_name_display') || 'name', // 'name' or 'initial'
    attendance: {
        records: {}, // Key: StudentName, Value: { "YYYY/MM/DD": [ { p:1, subj:"Math", status:"欠", teacher:"Tanaka" }, ... ] }
        periodInfo: { start: '', end: '' },
        fileName: '',
        memos: {}, // Key: "StudentName_YYYY/MM/DD", Value: { text: "...", color: "blue" }
        periodEvents: [] // Array of { student: string, start: "YYYY/MM/DD", end: "YYYY/MM/DD", text: "...", color: "blue" }
    },
    timetables: {}, // Key: year, Value: { semester: { day: { period: { s, t, email } } } }
    officerRoles: JSON.parse(localStorage.getItem('gm_state_officerRoles') || 'null'), // Default in init
    officers: JSON.parse(localStorage.getItem('gm_state_officers') || '{}'), // Key: year, Value: { roleId: [name1, name2], ... }
    sourceInfo: JSON.parse(localStorage.getItem('gm_state_sourceInfo') || '{}') // Metadata for imported files
};

/**
 * Generates a sortable key for a student based on metadata (Year-Class-Number).
 */
function getStudentSortKey(studentName) {
    const meta = getStudentMetadataSafe(studentName) || {};

    const getVal = (m, keys) => {
        for (const k of keys) {
            if (m[k] !== undefined && m[k] !== '' && m[k] !== null) return String(m[k]);
        }
        return '';
    };

    // Standard keys used in OMU roster imports
    const year = getVal(meta, ['年', '学年', 'year']);
    const class_ = getVal(meta, ['組', 'クラス', 'class']);
    const no = getVal(meta, ['番号', '出席番号', 'no']);

    const pad = (v, n) => {
        const s = v.trim();
        // If it's effectively empty, use a high value to push to end if others have values
        if (!s) return '9'.repeat(n);
        // Handle full-width numbers to be safe
        const cleanS = s.replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0));
        return cleanS.padStart(n, '0');
    };

    // Sort by Year -> Class -> No -> Name
    return `${pad(year, 2)}-${pad(class_, 2)}-${pad(no, 3)}-${studentName}`;
}

/**
 * Returns a new array of student names sorted by roster (metadata) order.
 */
function sortStudentsByRoster(studentNames) {
    if (!Array.isArray(studentNames)) return [];
    return [...studentNames].sort((a, b) => {
        const keyA = getStudentSortKey(a);
        const keyB = getStudentSortKey(b);
        return keyA.localeCompare(keyB, undefined, { numeric: true, sensitivity: 'base' });
    });
}

const ATTENDANCE_STATUS_GAP = "-";
const ATTENDANCE_STATUS_ABSENT = "欠";
const ATTENDANCE_STATUS_LATE = "遅";
const ATTENDANCE_STATUS_EARLY = "早";
const ATTENDANCE_STATUS_CANCELLED = "休講";

const SCORE_KEYS = ["前期中間", "前期末", "後期中間", "学年末"];
const SCORE_KEYS_EN = ["earlyMid", "earlyFinal", "lateMid", "lateFinal"]; // map for object keys

// Current pasting target
let currentPasteKey = null;

// Attendance Drag State (Calendar)
let attendanceDragStart = null;
let attendanceDragEnd = null;
let isAttendanceDragging = false;

// Attendance Drag State (Gantt)
let ganttDragStart = null;
let ganttDragEnd = null;
let ganttDragStudent = null;
let isGanttDragging = false;

// Import State
let importState = {
    candidates: [], // { name, sortKey, metadata }
    filters: {},    // { key: selectedValue }
    searchText: '', // Search Query
    selected: new Set(),
    sortKey: 'original', // 'year', 'class', 'no', 'name', ...
    sortOrder: 'asc' // 'asc' or 'desc'
};

// Faculty Roster State
let facultyImportState = {
    candidates: [],
    filters: {},
    searchText: '',
    selected: new Set(),
    sortKey: 'original',
    sortOrder: 'asc'
};

// ==================== PERFORMANCE OPTIMIZATION (CACHE) ====================
let candidateLookupCache = {
    allRegistered: null,    // Memoized union list of names
    metadataMap: new Map(),  // Map: Name -> Metadata Object
    normMetadataMap: new Map(), // Map: NormalizedName -> Metadata Object
    version: 0               // Incremented when invalidated
};

function invalidateCandidateCache() {
    candidateLookupCache.allRegistered = null;
    candidateLookupCache.metadataMap.clear();
    candidateLookupCache.normMetadataMap.clear();
    candidateLookupCache.version++;
}

/**
 * Ensures the candidate lookup cache is populated for O(1) performance.
 */
function ensureCandidateCache() {
    if (candidateLookupCache.allRegistered) return; // Already cached

    const manualNames = state.students || [];
    const rosterCandidates = importState.candidates || [];

    // 1. Build Metadata Maps (Priority: Manual Settings > Roster Candidates)
    // We process Roster first, then Manual Overwrites it
    rosterCandidates.forEach(c => {
        if (!c.name) return;
        if (c.metadata) {
            candidateLookupCache.metadataMap.set(c.name, c.metadata);
            candidateLookupCache.normMetadataMap.set(normalizeStudentName(c.name), c.metadata);
        }
    });

    // 2. Integration with existing state metadata
    if (state.studentMetadata) {
        Object.entries(state.studentMetadata).forEach(([name, meta]) => {
            candidateLookupCache.metadataMap.set(name, meta);
            candidateLookupCache.normMetadataMap.set(normalizeStudentName(name), meta);
        });
    }

    // 3. Memoize the union list
    const rosterNames = rosterCandidates.map(c => c.name);
    candidateLookupCache.allRegistered = Array.from(new Set([...manualNames, ...rosterNames]));
}

/**
 * Returns strictly the students registered in the application's core settings.
 */
function getRegisteredStudents() {
    return state.students || [];
}

/**
 * Returns a union of students from System Settings and the Master Roster.
 * Used primarily for name resolution and identification.
 */
function getAllPossibleStudents() {
    ensureCandidateCache();
    const manualNames = state.students || [];
    const rosterNames = (importState.candidates || []).map(c => c.name);
    return Array.from(new Set([...manualNames, ...rosterNames]));
}

function normalizeStudentName(s) {
    return (s || "").toString().trim()
        .toLowerCase()
        .replace(/\s+/g, '')
        .replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0))
        .replace(/^\d+[\.\-\s]/, '')
        .replace(/[\(\)（）]/g, '');
}
// =========================================================================

// ==================== ATTENDANCE COMPRESSION ====================
/**
 * Compresses attendance data for storage by using dictionaries for repetitive strings.
 * This significantly reduces localStorage usage (often by 70-80%).
 */
function serializeAttendance(att) {
    if (!att || !att.records || att._v === 3) return att;

    const subjects = [];
    const teachers = [];
    const statuses = [];

    const getIdx = (arr, val) => {
        const valStr = (val || "").toString().trim();
        if (!valStr) return -1;
        let idx = arr.indexOf(valStr);
        if (idx === -1) {
            idx = arr.length;
            arr.push(valStr);
        }
        return idx;
    };

    const compressedRecords = {};
    for (const student in att.records) {
        compressedRecords[student] = {};
        for (const date in att.records[student]) {
            compressedRecords[student][date] = att.records[student][date].map(r => [
                r.p,
                getIdx(subjects, r.subj),
                getIdx(statuses, r.status),
                getIdx(teachers, r.teacher)
            ]);
        }
    }

    return {
        _v: 3,
        records: compressedRecords,
        subjects: subjects,
        teachers: teachers,
        statuses: statuses,
        periodInfo: att.periodInfo,
        fileName: att.fileName,
        memos: att.memos,
        periodEvents: att.periodEvents
    };
}

/**
 * Decompresses attendance data from storage.
 */
function deserializeAttendance(data) {
    if (!data || data._v !== 3) return data;

    const records = {};
    const subjects = data.subjects || [];
    const teachers = data.teachers || [];
    const statuses = data.statuses || [];

    for (const student in data.records) {
        records[student] = {};
        for (const date in data.records[student]) {
            records[student][date] = data.records[student][date].map(r => ({
                p: r[0],
                subj: r[1] === -1 ? "" : subjects[r[1]],
                status: r[2] === -1 ? "" : statuses[r[2]],
                teacher: r[3] === -1 ? "" : teachers[r[3]]
            }));
        }
    }

    return {
        records: records,
        periodInfo: data.periodInfo || { start: '', end: '' },
        fileName: data.fileName || '',
        memos: data.memos || {},
        periodEvents: data.periodEvents || []
    };
}

// ==================== STATE PERSISTENCE ====================
// ==================== STATE PERSISTENCE ====================
function saveSessionState() {
    try {
        // Ensure presets are saved FIRST (to avoid quota issues/errors from other large data blocking it)
        const presets = state.seatingPresets || [];
        localStorage.setItem('gm_state_seatingPresets', JSON.stringify(presets));

        localStorage.setItem('gm_state_tab', state.currentTab);
        localStorage.setItem('gm_state_student', state.currentStudent || '');
        localStorage.setItem('gm_state_year', state.currentYear);
        localStorage.setItem('gm_state_hide_empty', state.hideEmptySubjects);
        localStorage.setItem('gm_state_boxplot_year', state.boxPlotYear || '');
        localStorage.setItem('gm_state_boxplot_test', state.boxPlotTest || '');
        localStorage.setItem('gm_state_course', state.currentCourse || '');
        localStorage.setItem('gm_state_class', state.currentClass || '1');
        localStorage.setItem('gm_state_name_display', state.nameDisplayMode || 'name');
        localStorage.setItem('gm_state_seating', JSON.stringify(state.seating));
        localStorage.setItem('gm_state_officers', JSON.stringify(state.officers));
        localStorage.setItem('gm_state_officerRoles', JSON.stringify(state.officerRoles));
        // Use sessionStorage for login state so it clears when browser is closed
        sessionStorage.setItem('gm_state_isLoggedIn', state.isLoggedIn ? 'true' : 'false');

        // Auto-save the actual lists and scores so everything is remembered on reload
        localStorage.setItem('grade_manager_students', JSON.stringify(state.students));
        localStorage.setItem('gm_student_metadata', JSON.stringify(state.studentMetadata));
        localStorage.setItem('gm_master_subjects_json', JSON.stringify(state.subjects));
        localStorage.setItem('grade_manager_scores', JSON.stringify(state.scores));

        localStorage.setItem('gm_state_sourceInfo', JSON.stringify(state.sourceInfo));
        localStorage.setItem('gm_roster_candidates', JSON.stringify(importState.candidates));
        localStorage.setItem('gm_faculty_candidates', JSON.stringify(facultyImportState.candidates));

        // Attendance Persistence (with Compression)
        const serialized = serializeAttendance(state.attendance);
        localStorage.setItem('gm_attendance_data', JSON.stringify(serialized));

        // Timetable Persistence
        localStorage.setItem('gm_state_timetables', JSON.stringify(state.timetables || {}));

    } catch (e) {
        console.error('Save State Error:', e);
        if (e.name === 'QuotaExceededError' || e.code === 22) {
            alert('【警告】ブラウザの保存容量上限（約5MB）に達したため、データが保存できませんでした。\n\n「システム環境設定」タブの「ストレージ容量管理」から、不要な「名簿ドキュメント一時データ」などを削除してください。');
            // Proactively switch to settings tab so they can fix it
            if (state.currentTab !== 'settings') {
                setTimeout(() => switchTab('settings'), 500);
            }
        }
    }
}

function loadSessionState() {
    const savedTab = localStorage.getItem('gm_state_tab');
    const savedStudent = localStorage.getItem('gm_state_student');
    const savedYear = localStorage.getItem('gm_state_year');
    const savedHideEmpty = localStorage.getItem('gm_state_hide_empty');
    const savedBPYear = localStorage.getItem('gm_state_boxplot_year');
    const savedBPTest = localStorage.getItem('gm_state_boxplot_test');
    const savedCourse = localStorage.getItem('gm_state_course');
    const savedNameDisplay = localStorage.getItem('gm_state_name_display');
    const savedSeating = localStorage.getItem('gm_state_seating');
    // Load from sessionStorage so login state is cleared when browser closes
    const savedIsLoggedIn = sessionStorage.getItem('gm_state_isLoggedIn');

    if (savedTab) state.currentTab = savedTab;
    if (savedYear) state.currentYear = parseInt(savedYear);
    if (savedHideEmpty !== null) state.hideEmptySubjects = (savedHideEmpty === 'true');
    if (savedBPYear) state.boxPlotYear = parseInt(savedBPYear);
    if (savedBPTest) state.boxPlotTest = savedBPTest;
    if (savedCourse !== null) state.currentCourse = savedCourse;
    if (savedNameDisplay) state.nameDisplayMode = savedNameDisplay;
    if (savedSeating) state.seating = JSON.parse(savedSeating);
    if (savedIsLoggedIn !== null) state.isLoggedIn = (savedIsLoggedIn === 'true');

    const savedOfficers = localStorage.getItem('gm_state_officers');
    if (savedOfficers) state.officers = JSON.parse(savedOfficers);

    const savedOfficerRoles = localStorage.getItem('gm_state_officerRoles');
    if (savedOfficerRoles) state.officerRoles = JSON.parse(savedOfficerRoles);

    // Load presets (Isolated function)
    loadPresetsOnly();

    // Student Metadata is now loaded in refreshMasterData() to ensure availability

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

    // Restore Roster Candidates
    try {
        const savedRoster = localStorage.getItem('gm_roster_candidates');
        if (savedRoster) {
            importState.candidates = JSON.parse(savedRoster) || [];
            console.log(`Loaded ${importState.candidates.length} student roster candidates.`);
        }
    } catch (e) {
        console.error('Failed to restore student roster:', e);
        importState.candidates = [];
    }

    try {
        const savedFaculty = localStorage.getItem('gm_faculty_candidates');
        if (savedFaculty) {
            facultyImportState.candidates = JSON.parse(savedFaculty) || [];
            console.log(`Loaded ${facultyImportState.candidates.length} faculty roster candidates.`);
        }
    } catch (e) {
        console.error('Failed to restore faculty roster:', e);
        facultyImportState.candidates = [];
    }

    // Restore Attendance Data
    try {
        const savedAttendance = localStorage.getItem('gm_attendance_data');
        if (savedAttendance) {
            const rawData = JSON.parse(savedAttendance);
            state.attendance = deserializeAttendance(rawData);
            console.log("Attendance records loaded and decompressed.");
        }
    } catch (e) {
        console.error('Failed to restore attendance data:', e);
    }

    // Restore Timetable Data
    try {
        const savedTimetables = localStorage.getItem('gm_state_timetables');
        if (savedTimetables) {
            state.timetables = JSON.parse(savedTimetables) || {};
            console.log("Timetable data loaded.");
        }
    } catch (e) {
        console.error('Failed to restore timetable data:', e);
    }

    // If no year was saved or it's invalid, auto-detect the latest year with data
    if (!state.currentYear) {
        setDefaultYear();
    }
}

// ==================== INITIALIZATION ====================
// ==================== INITIALIZATION ====================
// ==================== INITIALIZATION ====================
function init() {
    setupEventListeners();

    // 1. Load Master Data & Scores
    refreshMasterData();
    mockData();

    // 2. Restore Session State (Roster, Tab, Filters, etc.)
    // MUST be done before syncSpecialActivitiesForAll because that function triggers a save,
    // and we need the roster data loaded so it doesn't get overwritten with empty arrays.
    loadSessionState();

    // 3. Logic that might trigger a save
    syncSpecialActivitiesForAll();

    // OPTIMIZATION: Clean up orphaned scores if they accumulate too much
    const scoreCount = Object.keys(state.scores).length;
    const allRegistered = getRegisteredStudents();
    if (scoreCount > 1000 && scoreCount > allRegistered.length * 2) {
        const validNames = new Set(allRegistered);
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

    populateControls();

    // Set default year if not loaded or invalid, otherwise respect saved year
    if (!state.currentYear) {
        setDefaultYear();
    }

    // Roster Board Sort Listeners
    setupRosterHeaderSort();

    initAtRiskDefaults();
    initContextMenu();

    // 4. Initialize Auth & UI (Last, so data is ready for rendering)
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

let isLoginProcessing = false;

async function handleLogin() {
    if (isLoginProcessing) {
        console.log('Login already processing, ignoring duplicate call');
        return; // Prevent duplicate calls
    }

    const passInput = document.getElementById('loginPass');
    const errorMsg = document.getElementById('loginError');
    if (!passInput) return;

    const password = passInput.value;

    if (!password) {
        console.log('Password is empty');
        // Don't show alert - just display error message
        if (errorMsg) {
            errorMsg.textContent = 'パスワードを入力してください';
            errorMsg.style.display = 'block';
        }
        return;
    }

    isLoginProcessing = true;
    console.log('Starting login process...');

    try {
        const hash = await hashPassword(password);
        console.log('Password hashed, checking...');

        if (hash === state.passwordHash) {
            console.log('Login successful!');
            state.isLoggedIn = true;
            saveSessionState(); // Save the logged-in state
            if (errorMsg) errorMsg.style.display = 'none';
            passInput.value = '';
            initAuth(); // This will reveal the main content and hide overlay
        } else {
            console.log('Login failed - incorrect password');
            if (errorMsg) {
                errorMsg.textContent = 'パスワードが正しくありません';
                errorMsg.style.display = 'block';
            }
            passInput.value = '';
            passInput.focus();
        }
    } catch (error) {
        console.error('Login error:', error);
    } finally {
        isLoginProcessing = false;
        console.log('Login process completed');
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
    const studentName = state.currentStudent;
    if (!studentName) {
        state.currentYear = 1;
        return;
    }

    const studentScores = state.scores[studentName] || {};
    let latestYear = 0;

    // Check which years have data for the CURRENT student
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
                const oy = scoreObj.obtainedYear ? parseInt(scoreObj.obtainedYear) : 0;
                let y = (subject.year === 0) ? oy : subject.year;
                if (subject.year === 0 && y === 0) y = 1; // Fallback for orphans with data
                if (y > latestYear) latestYear = y;
            }
        }
    }

    // If current student has data, use it.
    if (latestYear > 0) {
        state.currentYear = latestYear;
    } else {
        // Fallback to checking ALL students (legacy behavior)
        const yearsWithData = new Set();
        for (const sName in state.scores) {
            const scores = state.scores[sName];
            for (const subName in scores) {
                const sub = state.subjects.find(s => s.name === subName);
                if (sub && typeof sub.year === 'number') {
                    const scoreObj = scores[subName];
                    const hasData = SCORE_KEYS.some(key => {
                        const val = scoreObj[key];
                        return val !== undefined && val !== null && val !== '';
                    });
                    if (hasData) {
                        const oy = scoreObj.obtainedYear ? parseInt(scoreObj.obtainedYear) : 0;
                        let y = (sub.year === 0) ? oy : sub.year;
                        if (sub.year === 0 && y === 0) y = 1;
                        if (y > 0) yearsWithData.add(y);
                    }
                }
            }
        }
        if (yearsWithData.size > 0) {
            state.currentYear = Math.max(...Array.from(yearsWithData));
        } else {
            state.currentYear = 1;
        }
    }
    console.log(`Auto-detected latest year: ${state.currentYear} for student ${studentName}`);

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
        try {
            state.students = JSON.parse(storedStudents);
            if (!Array.isArray(state.students)) state.students = [];
        } catch (e) {
            console.error('Failed to parse students:', e);
            state.students = [];
        }
    } else {
        state.students = [];
    }

    // FALLBACK: If list became empty somehow, restore defaults for safety
    if (state.students.length === 0) {
        state.students = DEFAULT_STUDENTS_RAW.replace(/\n/g, '').split(',').map(s => s.trim()).filter(s => s);
        localStorage.setItem('grade_manager_students', JSON.stringify(state.students));
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

    // A-2. Student Metadata (Ensure this is loaded with students)
    const storedMetadata = localStorage.getItem('gm_student_metadata');
    if (storedMetadata) {
        try {
            state.studentMetadata = JSON.parse(storedMetadata);
        } catch (e) {
            console.error('Failed to parse student metadata:', e);
            state.studentMetadata = {};
        }
    } else {
        state.studentMetadata = {};
    }

    // Ensure state.students is sorted by roster order (Year-Class-No)
    state.students = sortStudentsByRoster(state.students);
    invalidateCandidateCache(); // Ensure cache is ready with fresh data

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
                // Robust CSV split to handle quoted fields and empty values
                parts = [];
                let cur = '';
                let inQuote = false;
                for (let i = 0; i < line.length; i++) {
                    const char = line[i];
                    if (char === '"') {
                        if (inQuote && line[i + 1] === '"') { cur += '"'; i++; }
                        else { inQuote = !inQuote; }
                    } else if (char === ',' && !inQuote) {
                        parts.push(cur.trim());
                        cur = '';
                    } else { cur += char; }
                }
                parts.push(cur.trim());
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

/**
 * Generates HTML for metadata icons (badges) based on subject definitions.
 * @param {string} subjectName Name of the subject to look up.
 * @returns {string} HTML string of icon/badge elements.
 */
function getSubjectMetadataIcons(subjectName) {
    if (!subjectName) return '';
    // Handle dot variations
    const norm = (s) => (s || "").toString().trim().replace(/・/g, '･');
    const nName = norm(subjectName);
    const sub = state.subjects.find(s => norm(s.name) === nName);
    if (!sub) return '';

    let iconsHtml = '<div class="subject-meta-icons" style="margin-top: 4px; display: flex; flex-wrap: wrap; gap: 4px; justify-content: center; align-items: center; pointer-events: none;">';

    // 1. Requirement Type (種別1: 必, 選, 選必, etc.)
    if (sub.type1) {
        let color = '#f1f5f9'; // default light gray
        let textColor = '#475569';
        let borderColor = '#e2e8f0';

        if (sub.type1.includes('必')) {
            color = '#dbeafe'; // Blue 100
            textColor = '#1d4ed8'; // Blue 700
            borderColor = '#bfdbfe';
        } else if (sub.type1.includes('選')) {
            color = '#dcfce7'; // Green 100
            textColor = '#15803d'; // Green 700
            borderColor = '#bbf7d0';
        }

        iconsHtml += `<span style="font-size: 0.6rem; padding: 1px 4px; border-radius: 3px; background: ${color}; color: ${textColor}; font-weight: 800; border: 1px solid ${borderColor}; line-height: 1; min-width: 1.2rem; text-align: center;">${sub.type1}</span>`;
    }

    // 2. DP Category (種別3)
    if (sub.type3) {
        const dps = sub.type3.split(/[,\s]+/).filter(d => d.startsWith('DP-'));
        dps.forEach(dp => {
            iconsHtml += `<span style="font-size: 0.6rem; padding: 1px 4px; border-radius: 3px; background: #fff7ed; color: #c2410c; font-weight: 800; border: 1px solid #ffedd5; line-height: 1;">${dp.replace('DP-', '')}</span>`;
        });
    }

    // 3. Credits (単位)
    if (sub.credits > 0) {
        iconsHtml += `<span style="font-size: 0.6rem; padding: 1px 4px; border-radius: 3px; background: #f8fafc; color: #64748b; font-weight: bold; border: 1px solid #e2e8f0; line-height: 1; display: flex; align-items: center; gap: 1px;">
            <svg viewBox="0 0 24 24" width="8" height="8" fill="currentColor" style="opacity:0.6;"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>
            ${sub.credits}</span>`;
    }

    iconsHtml += '</div>';
    return iconsHtml;
}
window.getSubjectMetadataIcons = getSubjectMetadataIcons;

/**
 * Returns a color theme based on subject category (type2).
 * @param {string} subjectName
 * @returns {object} { bg, text, border, gradient }
 */
function getSubjectTheme(subjectName) {
    const norm = (s) => (s || "").toString().trim().replace(/・/g, '･');
    const nName = norm(subjectName);
    const sub = state.subjects.find(s => norm(s.name) === nName);

    // Default: Professional Slate
    const defaultTheme = {
        bg: '#f8fafc',
        text: '#64748b',
        border: '#e2e8f0',
        gradient: 'linear-gradient(135deg, #64748b 0%, #475569 100%)'
    };

    if (!sub) return defaultTheme;

    const t2 = sub.type2 || '';
    if (t2.includes('一般')) {
        return {
            bg: '#f1f5f9',
            text: '#475569',
            border: '#cbd5e1',
            gradient: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)'
        };
    } else if (t2.includes('専門共通')) {
        return {
            bg: '#eff6ff',
            text: '#1d4ed8',
            border: '#bfdbfe',
            gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
        };
    } else if (t2.includes('基盤専門')) {
        return {
            bg: '#faf5ff',
            text: '#7e22ce',
            border: '#e9d5ff',
            gradient: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)'
        };
    } else if (t2.includes('応用専門')) {
        return {
            bg: '#fff1f2',
            text: '#be123c',
            border: '#fecdd3',
            gradient: 'linear-gradient(135deg, #fb7185 0%, #be123c 100%)'
        };
    } else if (t2.includes('その他') || t2.includes('特別学修')) {
        return {
            bg: '#fff7ed',
            text: '#c2410c',
            border: '#ffedd5',
            gradient: 'linear-gradient(135deg, #f97316 0%, #c2410c 100%)'
        };
    }

    return defaultTheme;
}
window.getSubjectTheme = getSubjectTheme;

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
    // 1. Main Student Select (Sorted by Roster)
    const studentSelect = document.getElementById('studentSelect');
    if (studentSelect) {
        studentSelect.innerHTML = '';
        const allStudents = getRegisteredStudents();
        const filteredStudents = getClassStudents(state.currentYear, state.currentCourse, allStudents);
        const sortedStudents = sortStudentsByRoster(filteredStudents);
        sortedStudents.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s;
            opt.textContent = getDisplayName(s);
            if (s === state.currentStudent) opt.selected = true;
            studentSelect.appendChild(opt);
        });
    }



    // 3. Name Display Dropdown
    const displaySelect = document.getElementById('settingNameDisplay');
    if (displaySelect) {
        displaySelect.value = state.nameDisplayMode || 'name';
    }

    // 4. Year Select
    const yearSelect = document.getElementById('yearSelect');
    if (yearSelect) {
        yearSelect.value = state.currentYear;
    }

    // 5. Stats Controls
    const statsYearSelect = document.getElementById('boxPlotYearSelect');
    if (statsYearSelect) {
        statsYearSelect.value = state.boxPlotYear || '';
    }

    // 6. Course Select Sync
    const courseFilterHeader = document.getElementById('subjectCourseFilterHeader');
    if (courseFilterHeader) courseFilterHeader.value = state.currentCourse;
    const courseFilterSettings = document.getElementById('subjectCourseFilter');
    if (courseFilterSettings) courseFilterSettings.value = state.currentCourse;

    // 7. Summary Year Select
    const summaryYear = document.getElementById('summaryYearSelect');
    if (summaryYear) summaryYear.value = state.currentYear;
}

function setupEventListeners() {
    document.getElementById('studentSelect')?.addEventListener('change', (e) => {
        state.currentStudent = e.target.value;
        setDefaultYear(); // Automatically jump to the latest year with data for this student
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


    document.getElementById('summaryTestSelect')?.addEventListener('change', (e) => {
        render();
    });


    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const tab = e.currentTarget.dataset.tab;
            switchTab(tab);
            if (window.innerWidth <= 768) {
                toggleSidebar(false);
            }
        });
    });
    document.getElementById('saveBtn')?.addEventListener('click', saveData);
    document.getElementById('printBtn')?.addEventListener('click', () => {
        updatePrintHeader();
        window.print();
    });
    document.getElementById('exportJsonBtn')?.addEventListener('click', exportJson);

    // Import JSON
    document.getElementById('importJsonBtn')?.addEventListener('click', () => {
        document.getElementById('jsonFileInput')?.click();
    });
    document.getElementById('jsonFileInput')?.addEventListener('change', handleJsonImport);

    // Import CSV
    document.getElementById('importBtn')?.addEventListener('click', () => {
        document.getElementById('csvFileInput')?.click();
    });
    document.getElementById('csvFileInput')?.addEventListener('change', handleFileUpload);

    // New Roster Import (Settings Tab)
    document.getElementById('rosterImportBtn')?.addEventListener('click', () => {
        document.getElementById('rosterFileInput')?.click();
    });
    // This is shared input for both
    document.getElementById('rosterFileInput')?.addEventListener('change', handleRosterSelect);

    // Roster Board Controls (New Listeners)
    document.getElementById('triggerRosterLoadBtn')?.addEventListener('click', () => {
        document.getElementById('rosterFileInput')?.click();
    });
    document.getElementById('applyRosterImportBtn')?.addEventListener('click', confirmImportFromBoard);
    document.getElementById('teamsChatSelectedBtn')?.addEventListener('click', openTeamsChatForSelected);
    document.getElementById('sendMailSelectedBtn')?.addEventListener('click', openMailForSelected);

    document.getElementById('rosterSortSelect')?.addEventListener('change', (e) => {
        importState.sortMethod = e.target.value;
        renderRosterBoardTable();
    });

    // Search Inputs
    document.getElementById('rosterSearchInput')?.addEventListener('input', (e) => {
        importState.searchText = e.target.value;
        renderRosterBoardTable();
    });

    document.getElementById('facultySearchInput')?.addEventListener('input', (e) => {
        facultyImportState.searchText = e.target.value;
        renderFacultyTable();
    });

    document.getElementById('rosterSelectAll')?.addEventListener('click', (e) => {
        const checked = e.target.checked;
        const visible = getFilteredAndSortedCandidates();
        visible.forEach(c => {
            if (checked) importState.selected.add(c.name);
            else importState.selected.delete(c.name);
        });
        renderRosterBoardTable();
    });

    // Faculty Roster Controls
    document.getElementById('triggerFacultyLoadBtn')?.addEventListener('click', () => {
        document.getElementById('facultyFileInput')?.click();
    });
    document.getElementById('facultyFileInput')?.addEventListener('change', handleFacultyRosterSelect);
    document.getElementById('facultyTeamsChatBtn')?.addEventListener('click', openFacultyTeamsChat);
    document.getElementById('facultySendMailBtn')?.addEventListener('click', openFacultyMail);
    document.getElementById('facultySelectAll')?.addEventListener('click', (e) => {
        const checked = e.target.checked;
        facultyImportState.candidates.forEach(c => {
            if (checked) facultyImportState.selected.add(c.id);
            else facultyImportState.selected.delete(c.id);
        });
        renderFacultyTable();
    });

    // Clear Filters Buttons
    document.getElementById('clearRosterFiltersBtn')?.addEventListener('click', () => {
        importState.filters = {};
        importState.searchText = '';
        document.getElementById('rosterSearchInput').value = '';
        document.querySelectorAll('#rosterFilterContainer select').forEach(select => {
            select.value = '';
        });
        renderRosterBoardTable();
    });

    document.getElementById('clearFacultyFiltersBtn')?.addEventListener('click', () => {
        facultyImportState.filters = {};
        facultyImportState.searchText = '';
        document.getElementById('facultySearchInput').value = '';
        document.querySelectorAll('#facultyFilterContainer select').forEach(select => {
            select.value = '';
        });
        renderFacultyTable();
    });

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
    document.getElementById('classStatsYear')?.addEventListener('change', () => {
        generateClassStats();
    });
    document.getElementById('classStatsTest')?.addEventListener('change', () => {
        generateClassStats();
    });
    document.getElementById('exportClassStatsCsvBtn')?.addEventListener('click', exportClassStatsCsv);

    // Class Stats Sub-nav Listener
    document.querySelectorAll('.sub-nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const targetTab = e.target.dataset.csTab;
            const parent = e.target.closest('.card');

            // Toggle buttons
            parent.querySelectorAll('.sub-nav-item').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');

            // Toggle contents
            parent.querySelectorAll('.cs-tab-content').forEach(content => content.classList.add('hidden'));
            parent.querySelector(`#cs-tab-${targetTab}`).classList.remove('hidden');
        });
    });

    document.getElementById('generateClassAttendanceStatsBtn')?.addEventListener('click', generateClassAttendanceStats);
    document.getElementById('exportClassAttendanceCsvBtn')?.addEventListener('click', exportClassAttendanceCsv);

    document.getElementById('classSelect')?.addEventListener('change', (e) => {
        state.currentClass = e.target.value;
        saveSessionState();
        render();
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

    // Seating Assignment Listeners
    document.getElementById('updateSeatingGridBtn')?.addEventListener('click', () => {
        state.seating.cols = parseInt(document.getElementById('seatingCols').value) || 7;
        state.seating.rows = parseInt(document.getElementById('seatingRows').value) || 7;
        saveSessionState();
        renderSeatingGrid();
    });
    document.getElementById('seatingPerspective')?.addEventListener('change', (e) => {
        state.seating.perspective = e.target.value;
        saveSessionState();
        renderSeatingGrid();
    });
    document.getElementById('randomAssignBtn')?.addEventListener('click', randomAssignSeats);
    document.getElementById('clearSeatingBtn')?.addEventListener('click', clearSeatingAssignments);
    document.getElementById('seatingColorMode')?.addEventListener('change', (e) => {
        state.seating.colorMode = e.target.value;
        const methodWrapper = document.getElementById('seatingGradeMethodWrapper');
        if (methodWrapper) methodWrapper.style.display = (e.target.value === 'grade') ? 'flex' : 'none';
        saveSessionState();
        renderSeatingGrid();
    });
    document.getElementById('seatingGradeMethod')?.addEventListener('change', (e) => {
        state.seating.gradeMethod = e.target.value;
        saveSessionState();
        updateGradeMethodInfo();
        if (state.seating.colorMode === 'grade') renderSeatingGrid();
    });
    document.getElementById('saveSeatingBtn')?.addEventListener('click', saveSeatingLayout);
    document.getElementById('loadSeatingBtn')?.addEventListener('click', loadSeatingLayout);

    document.getElementById('changePassBtn')?.addEventListener('click', openPasswordChange);
    document.getElementById('clearAllDataBtn')?.addEventListener('click', clearAllDataHard);
    document.getElementById('headerHelpBtn')?.addEventListener('click', () => switchTab('help'));

    // Auth Listeners
    document.getElementById('doLoginBtn')?.addEventListener('click', handleLogin);
    document.getElementById('loginPass')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleLogin();
        }
    });
    document.getElementById('confirmSetupBtn')?.addEventListener('click', handleSetup);
    document.getElementById('setupPass2')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSetup();
        }
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

    document.getElementById('clearRosterCacheBtn')?.addEventListener('click', () => clearStorageType('roster'));
    document.getElementById('clearAttendanceDataBtn')?.addEventListener('click', () => clearStorageType('attendance'));

    document.getElementById('exportStudentsCsvBtn')?.addEventListener('click', exportStudentsCsv);
    document.getElementById('importStudentsCsvBtn')?.addEventListener('click', () => {
        document.getElementById('studentsCsvFileInput')?.click();
    });
    document.getElementById('studentsCsvFileInput')?.addEventListener('change', handleStudentsCsvImport);

    document.getElementById('exportSubjectsCsvBtn')?.addEventListener('click', exportSubjectsCsv);
    document.getElementById('importSubjectsCsvBtn')?.addEventListener('click', () => {
        document.getElementById('subjectsCsvFileInput')?.click();
    });
    document.getElementById('subjectsCsvFileInput')?.addEventListener('change', handleSubjectsCsvImport);

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

    render();

    document.getElementById('isSpecialSubject')?.addEventListener('change', (e) => {
        const isSpecial = e.target.checked;
        const yearWrapper = document.getElementById('subjectYearWrapper');
        const type1Wrapper = document.getElementById('subjectType1Wrapper');
        if (yearWrapper) yearWrapper.style.display = isSpecial ? 'none' : 'flex';
        if (type1Wrapper) type1Wrapper.style.display = isSpecial ? 'none' : 'flex';
    });

    // Sidebar Toggle Listeners
    const menuToggleBtn = document.getElementById('menuToggle');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    if (menuToggleBtn) {
        menuToggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSidebar(true);
        });

        let touchStarted = false;
        menuToggleBtn.addEventListener('touchstart', (e) => {
            touchStarted = true;
        }, { passive: true });

        menuToggleBtn.addEventListener('touchend', (e) => {
            if (touchStarted) {
                e.preventDefault();
                toggleSidebar(true);
                touchStarted = false;
            }
        }, { passive: false });
    }
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', () => toggleSidebar(false));
        sidebarOverlay.addEventListener('touchend', () => toggleSidebar(false), { passive: true });
    }

    setupAttendanceListeners();
}

function setupAttendanceListeners() {
    document.getElementById('attendanceMonthSelect')?.addEventListener('change', (e) => {
        // Sync with Class Attendance Target Date
        const targetInput = document.getElementById('classAttendanceTargetDate');
        if (targetInput) {
            const mStr = e.target.value; // "4月" etc
            const mNum = parseInt(mStr.replace('月', ''));
            const year = parseInt(state.currentYear || new Date().getFullYear());
            let realYear = year;
            if (mNum <= 3) realYear = year + 1;
            const y = realYear;
            const m = String(mNum).padStart(2, '0');
            targetInput.value = `${y}-${m}-01`;
        }
        renderAttendanceCalendar();
        renderAttendanceStats();
    });

    document.getElementById('importAttendanceCsvBtn')?.addEventListener('click', () => {
        document.getElementById('attendanceCsvFileInput')?.click();
    });

    document.getElementById('attendanceCsvFileInput')?.addEventListener('change', handleAttendanceFileUpload);

    document.getElementById('attendanceSubjectFilter')?.addEventListener('change', () => {
        renderSubjectAttendanceChart();
    });

    document.getElementById('attendanceDayFilter')?.addEventListener('change', () => {
        renderDayAttendanceChart();
    });

    document.getElementById('attendancePeriodFilter')?.addEventListener('change', () => {
        renderPeriodAttendanceChart();
    });


    document.getElementById('classAttendanceTargetDate')?.addEventListener('change', (e) => {
        // Sync with Individual Attendance Month selector
        const mainSelect = document.getElementById('attendanceMonthSelect');
        if (mainSelect) {
            const date = new Date(e.target.value);
            if (!isNaN(date.getTime())) {
                const mNum = date.getMonth() + 1;
                // April=0, ..., March=11 in the dropdown
                const idx = mNum >= 4 ? mNum - 4 : mNum + 8;
                mainSelect.selectedIndex = idx;

                renderAttendanceCalendar();
                renderAttendanceStats();
            }
        }
        renderClassAttendanceStats();
    });

    document.getElementById('classAttendanceRangeSelect')?.addEventListener('change', () => {
        renderClassAttendanceStats();
    });

    // Global Mouse Handlers for Drag Selection (Calendar & Gantt)
    window.onmouseup = (event) => {
        if (isAttendanceDragging) {
            isAttendanceDragging = false;
        } else if (isGanttDragging) {
            isGanttDragging = false;
        }
    };

    // Global Touch Handlers for Drag Selection (Smartphones)
    let touchStartPos = null;
    let touchMoveStartedForDrag = false;
    let touchStartDate = null;
    let touchStartStudent = null;
    let touchStartType = null;

    window.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY)?.closest('.calendar-day-cell, .gantt-day-cell');
        if (!target) return;

        touchStartPos = { x: touch.clientX, y: touch.clientY };
        touchMoveStartedForDrag = false;
        touchStartDate = target.dataset.date;
        touchStartStudent = target.dataset.student;
        touchStartType = target.classList.contains('calendar-day-cell') ? 'attendance' : 'gantt';

        // Check if we touched outside existing multi-day selection to reset immediately
        if (touchStartType === 'attendance') {
            const hasRange = attendanceDragStart && attendanceDragEnd && attendanceDragStart !== attendanceDragEnd;
            if (hasRange) {
                const s = attendanceDragStart < attendanceDragEnd ? attendanceDragStart : attendanceDragEnd;
                const end = attendanceDragStart < attendanceDragEnd ? attendanceDragEnd : attendanceDragStart;
                if (touchStartDate < s || touchStartDate > end) {
                    attendanceDragStart = touchStartDate;
                    attendanceDragEnd = touchStartDate;
                    updateAttendanceDragVisuals();
                }
            } else {
                attendanceDragStart = touchStartDate;
                attendanceDragEnd = touchStartDate;
                updateAttendanceDragVisuals();
            }
        } else if (touchStartType === 'gantt') {
            const hasRange = ganttDragStart && ganttDragEnd && ganttDragStart !== ganttDragEnd;
            if (hasRange) {
                const s = ganttDragStart < ganttDragEnd ? ganttDragStart : ganttDragEnd;
                const end = ganttDragStart < ganttDragEnd ? ganttDragEnd : ganttDragStart;
                if (touchStartStudent !== ganttDragStudent || touchStartDate < s || touchStartDate > end) {
                    ganttDragStart = touchStartDate;
                    ganttDragEnd = touchStartDate;
                    ganttDragStudent = touchStartStudent;
                    updateGanttDragVisuals();
                }
            } else {
                ganttDragStart = touchStartDate;
                ganttDragEnd = touchStartDate;
                ganttDragStudent = touchStartStudent;
                updateGanttDragVisuals();
            }
        }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (!touchStartPos) return;
        const touch = e.touches[0];
        const dx = touch.clientX - touchStartPos.x;
        const dy = touch.clientY - touchStartPos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // threshold to distinguish drag-to-select from scrolling
        if (!touchMoveStartedForDrag && dist > 15) {
            touchMoveStartedForDrag = true;
            // Now we are sure it is a drag. Set the start point to where the touch began.
            if (touchStartType === 'attendance') {
                attendanceDragStart = touchStartDate;
                attendanceDragEnd = touchStartDate;
                isAttendanceDragging = true;
            } else if (touchStartType === 'gantt') {
                ganttDragStart = touchStartDate;
                ganttDragEnd = touchStartDate;
                ganttDragStudent = touchStartStudent;
                isGanttDragging = true;
            }
        }

        if (isAttendanceDragging || isGanttDragging) {
            if (e.cancelable) e.preventDefault(); // Prevent scrolling while selecting
            const target = document.elementFromPoint(touch.clientX, touch.clientY)?.closest('.calendar-day-cell, .gantt-day-cell');
            if (isAttendanceDragging && target?.classList.contains('calendar-day-cell')) {
                attendanceDragEnd = target.dataset.date;
                updateAttendanceDragVisuals();
            } else if (isGanttDragging && target?.classList.contains('gantt-day-cell')) {
                if (target.dataset.student === ganttDragStudent) {
                    ganttDragEnd = target.dataset.date;
                    updateGanttDragVisuals();
                }
            }
        }
    }, { passive: false });

    window.addEventListener('touchend', (e) => {
        if (isAttendanceDragging || isGanttDragging) {
            isAttendanceDragging = false;
            isGanttDragging = false;
        }
        touchStartPos = null;
        touchStartDate = null;
        touchStartStudent = null;
        touchStartType = null;
    });
}

function switchTab(tabName) {
    console.log('Switching to tab:', tabName);
    // Update nav items
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    document.querySelector(`.nav-item[data-tab="${tabName}"]`)?.classList.add('active');

    // Update mobile tabs
    document.querySelectorAll('.mobile-tab').forEach(el => el.classList.remove('active'));
    const mobileTab = document.querySelector(`.mobile-tab[data-tab="${tabName}"]`);
    if (mobileTab) {
        mobileTab.classList.add('active');
    }

    // Safety: close any open modals when switching tabs
    document.getElementById('subjectModal')?.classList.remove('open');
    document.getElementById('pasteModal')?.classList.remove('open');
    document.getElementById('attendanceEventModal')?.classList.remove('open');

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
    } else if (tabName === 'attendance') {
        initAttendance();
    } else if (tabName === 'class_attendance_stats') {
        initClassAttendanceStats();
        renderClassAttendanceStats();
    } else if (tabName === 'class_stats') {
        initClassStats();
    } else if (tabName === 'stats2') {
        renderStats2();
    } else if (tabName === 'grad_requirements') {
        setDefaultYear();
        renderGraduationRequirements();
    } else if (tabName === 'at_risk') {
        renderAtRiskReport();
    } else if (tabName === 'seating') {
        initSeating();
        renderSeatingChart();
    } else if (tabName === 'class_officers') {
        renderClassOfficers();
    } else if (tabName === 'subject_management') {
        renderSubjectManagement();
    } else if (tabName === 'metadata_editor') {
        renderMetadataEditor();
    } else if (tabName === 'settings') {
        renderSettings();
    } else if (tabName === 'roster_board') {
        renderRosterBoardFilters();
        renderRosterBoardTable();
    } else if (tabName === 'faculty_roster') {
        renderFacultyFilters();
        renderFacultyTable();
    } else if (tabName === 'student_summary') {
        populateControls();
        renderStudentSummary();
    } else if (tabName === 'timetable') {
        if (typeof initTimetableEditor === 'function') {
            initTimetableEditor();
        }
    }
}

function saveData() {
    // Save both scores and custom subjects (including special studies)
    const customSubjects = state.subjects.filter(s => s.name.startsWith('特・'));
    localStorage.setItem('grade_manager_scores', JSON.stringify(state.scores));
    localStorage.setItem('grade_manager_custom_subjects', JSON.stringify(customSubjects));
    invalidateCandidateCache();
    localStorage.setItem('grade_manager_students', JSON.stringify(state.students));
    saveSessionState();
    alert('データが保存されました (Data Saved)');
}



function exportJson() {
    // Generate filename with current date and time
    const now = new Date();
    const ts = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);

    // Prepare full state backup
    // We export a subset of state and important import states
    const exportData = {
        version: '2.0',
        exportDate: now.toISOString(),
        state: {
            students: state.students,
            subjects: state.subjects,
            scores: state.scores,
            studentMetadata: state.studentMetadata,
            attendance: state.attendance,
            seating: state.seating,
            seatingPresets: state.seatingPresets,
            officers: state.officers,
            officerRoles: state.officerRoles,
            currentYear: state.currentYear,
            currentCourse: state.currentCourse,
            currentClass: state.currentClass,
            nameDisplayMode: state.nameDisplayMode
        },
        importState: {
            candidates: importState.candidates
        }
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grade_manager_full_backup_${ts}.json`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert('【全データ・確定保存】\n現在の全システム情報をJSONファイルとして出力しました。\nこのファイルを読み込むことで、全ての状態を完全に復元できます。');
}

function handleJsonImport(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Updated to use readFileText for consistent encoding handling
    readFileText(file).then(text => {
        try {
            const importData = JSON.parse(text);

            // Validate data structure
            if (!importData.scores && !importData.students && !importData.subjects) {
                // Relaxed validation: check for any major key
                // Ideally check for specific keys based on expected JSON structure
                if (!importData.scores) console.warn("No scores found in JSON");
            }

            // Basic validation - at least expect it to be an object
            if (typeof importData !== 'object' || importData === null) {
                throw new Error('無効なJSON形式です。');
            }

            if (!confirm('現在のシステム内の全データを上書きしますか？\n\n※名簿、成績、出欠状況、座席配置など、すべての情報が読み込んだファイルの内容で置き換えられます。')) {
                return;
            }

            // Version 2.0+ Full State Support
            if (importData.version >= '2.0' && importData.state) {
                const s = importData.state;
                if (s.scores) state.scores = s.scores;
                if (s.students) state.students = s.students;
                if (s.subjects) state.subjects = s.subjects;
                if (s.studentMetadata) state.studentMetadata = s.studentMetadata;
                if (s.attendance) state.attendance = s.attendance;
                if (s.seating) state.seating = s.seating;
                if (s.seatingPresets) state.seatingPresets = s.seatingPresets || [];
                if (s.officers) state.officers = s.officers;
                if (s.officerRoles) state.officerRoles = s.officerRoles;
                if (s.currentYear) state.currentYear = s.currentYear;
                if (s.currentCourse) state.currentCourse = s.currentCourse;
                if (s.currentClass) state.currentClass = s.currentClass;
                if (s.nameDisplayMode) state.nameDisplayMode = s.nameDisplayMode;

                if (importData.importState && importData.importState.candidates) {
                    importState.candidates = importData.importState.candidates;
                }
            } else {
                // Legacy / Partial Restore logic
                if (importData.scores) state.scores = importData.scores;
                if (importData.students) state.students = importData.students;
                if (importData.subjects) state.subjects = importData.subjects;

                if (importData.customSubjects && Array.isArray(importData.customSubjects)) {
                    const existingNames = new Set(state.subjects.map(sub => sub.name));
                    importData.customSubjects.forEach(sub => {
                        if (!existingNames.has(sub.name)) {
                            state.subjects.push(sub);
                            existingNames.add(sub.name);
                        }
                    });
                }
            }

            saveSessionState();
            alert('全データを正常に読み込みました。アプリケーションを再起動して反映します。');
            location.reload();

        } catch (err) {
            console.error('JSON import error:', err);
            alert('JSONファイルの読み込みに失敗しました:\n' + err.message);
        }
    }).catch(err => {
        console.error('File read error:', err);
        alert('ファイルの読み込みに失敗しました:\n' + err.message);
    }).finally(() => {
        e.target.value = '';
    });
}

function updateStorageUsageDisplay() {
    const textEl = document.getElementById('storage-usage-text');
    if (!textEl) return;

    const usage = getLocalStorageUsageInMB();
    const limit = 5.0; // Standard localStorage limit is approx 5MB

    const barEl = document.getElementById('storage-usage-bar');
    if (textEl) textEl.textContent = usage.toFixed(2);
    if (barEl) {
        const percent = Math.min((usage / limit) * 100, 100);
        barEl.style.width = percent + '%';
        if (percent > 90) barEl.style.background = '#ef4444';
        else if (percent > 70) barEl.style.background = '#f59e0b';
        else barEl.style.background = '#3b82f6';
    }

    // Individual component sizes
    const rosterSize = (getItemSizeInKB('gm_roster_candidates') + getItemSizeInKB('gm_faculty_candidates'));
    const attSize = getItemSizeInKB('gm_attendance_data');

    const rosterSizeEl = document.getElementById('storage-roster-size');
    const attSizeEl = document.getElementById('storage-attendance-size');
    if (rosterSizeEl) rosterSizeEl.textContent = rosterSize > 1024 ? (rosterSize / 1024).toFixed(2) + ' MB' : rosterSize.toFixed(0) + ' KB';
    if (attSizeEl) attSizeEl.textContent = attSize > 1024 ? (attSize / 1024).toFixed(2) + ' MB' : attSize.toFixed(0) + ' KB';
}

function getLocalStorageUsageInMB() {
    let total = 0;
    try {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const val = localStorage.getItem(key);
            if (val) total += (key.length + val.length) * 2; // Roughly 2 bytes per character for UTF-16
        }
    } catch (e) {
        console.error("Usage calculation error", e);
    }
    return total / (1024 * 1024);
}

function getItemSizeInKB(key) {
    const val = localStorage.getItem(key);
    if (!val) return 0;
    return ((key.length + val.length) * 2) / 1024;
}

function clearStorageType(type) {
    if (type === 'roster') {
        const rosterSize = (getItemSizeInKB('gm_roster_candidates') + getItemSizeInKB('gm_faculty_candidates'));
        if (rosterSize < 1) {
            alert('名簿キャッシュは既に空です。');
            return;
        }

        if (confirm('名簿ドキュメントの一時キャッシュを削除しますか？\n(既に確定した学生リストや成績などは削除されません。次に名簿を取り込む際に再度ファイルを読み込む必要があります)')) {
            localStorage.removeItem('gm_roster_candidates');
            localStorage.removeItem('gm_faculty_candidates');
            importState.candidates = [];
            facultyImportState.candidates = [];
            alert('名簿キャッシュを削除しました。');
            updateStorageUsageDisplay();
            // Refresh table if on roster tab
            if (state.currentTab === 'roster_board') renderRosterBoardTable();
        }
    } else if (type === 'attendance') {
        if (confirm('【注意】出欠ログデータを「すべて」削除しますか？\n削除するとこれまで読み込んだ出欠履歴が消え、元に戻せません。')) {
            if (confirm('本当によろしいですか？')) {
                localStorage.removeItem('gm_attendance_data');
                state.attendance = {
                    records: {},
                    periodInfo: { start: '', end: '' },
                    fileName: '',
                    memos: {},
                    periodEvents: []
                };
                alert('出欠データを削除しました。');
                updateStorageUsageDisplay();
                if (state.currentTab === 'attendance') renderAttendanceCalendar();
            }
        }
    }
}

function renderSettings() {
    // 0. Refresh imported file summaries
    updateSourceSummaryDisplay();

    // 1. Render Students (List style)
    const studentsList = document.getElementById('studentsList');
    if (studentsList) {
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
                    <span style="font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: ${isCurrent ? '#1d4ed8' : '#334155'};">${s} ${isCurrent ? '<span style="font-size:0.7em; color:#3b82f6; border:1px solid #3b82f6; padding:1px 4px; border-radius:4px; margin-left:4px;">選択中</span>' : ''}</span>
                </div>
                <div style="display: flex; gap: 0.2rem;">
                    <button onclick="editStudentMetadata('${s}')" style="border:none; background:none; color:#94a3b8; cursor:pointer; padding: 0.2rem; display: flex;" title="詳細情報を編集">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <!-- Rename Button (Separate from Metadata) -->
                    <button onclick="editStudentSetting(${idx})" style="border:none; background:none; color:#94a3b8; cursor:pointer; padding: 0.2rem; display: flex;" title="氏名変更">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button onclick="removeStudentSetting(${idx})" style="border:none; background:none; color:#94a3b8; cursor:pointer; padding: 0.2rem; display: flex;" title="削除">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
            `;
            studentsList.appendChild(item);
        });
        updatePlaceholderNames();
    }

    // 4. Update Storage Usage
    updateStorageUsageDisplay();


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
        state.students = sortStudentsByRoster(state.students);
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

    // Collect all metadata keys
    const metadataKeys = new Set();
    state.students.forEach(student => {
        const meta = state.studentMetadata[student] || {};
        Object.keys(meta).forEach(key => metadataKeys.add(key));
    });

    const BOM = '\uFEFF';

    // Create header with metadata columns
    const baseHeaders = ['学生名'];
    const metaHeaders = Array.from(metadataKeys).sort();
    const headers = [...baseHeaders, ...metaHeaders];

    // Create rows with metadata
    const rows = state.students.map(student => {
        const meta = state.studentMetadata[student] || {};
        const row = [student];

        // Add metadata values in the same order as headers
        metaHeaders.forEach(key => {
            row.push(meta[key] || '');
        });

        return row.join(',');
    });

    const csvContent = BOM + [headers.join(','), ...rows].join('\n');

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

function handleStudentsCsvImport(e) {
    const file = e.target.files[0];
    if (!file) return;

    readFileText(file).then(text => {
        try {
            const rows = parseCSV(text).filter(row => row.length > 0 && row.some(col => col.trim()));

            if (rows.length < 2) {
                throw new Error('CSVファイルが空か、データが不足しています。');
            }

            // Parse header (BOM already handled by readFileText if present)
            const header = rows[0].map(h => h.trim());

            if (header[0] !== '学生名') {
                throw new Error('CSVファイルの形式が正しくありません。\n最初の列は「学生名」である必要があります。');
            }

            // Extract metadata column names
            const metadataColumns = header.slice(1);

            // Parse students and metadata
            const importedStudents = [];
            const importedMetadata = {};

            for (let i = 1; i < rows.length; i++) {
                const cols = rows[i].map(c => c.trim());
                if (cols.length < 1 || !cols[0]) continue; // Skip invalid rows

                const studentName = cols[0];
                importedStudents.push(studentName);

                // Parse metadata
                const metadata = {};
                metadataColumns.forEach((colName, idx) => {
                    const value = cols[idx + 1];
                    if (value) {
                        metadata[colName] = value;
                    }
                });

                if (Object.keys(metadata).length > 0) {
                    importedMetadata[studentName] = metadata;
                }
            }

            if (importedStudents.length === 0) {
                throw new Error('有効な学生データが見つかりませんでした。');
            }

            // Check for duplicates
            const existingNames = new Set(state.students);
            const duplicates = importedStudents.filter(s => existingNames.has(s));

            let confirmMsg = `${importedStudents.length}名の学生データを読み込みます。\n`;
            if (metadataColumns.length > 0) {
                confirmMsg += `メタデータ列: ${metadataColumns.join(', ')}\n`;
            }
            confirmMsg += '\n';

            if (duplicates.length > 0) {
                confirmMsg += `※ ${duplicates.length}名の重複する学生が見つかりました。\n`;
                confirmMsg += '重複する学生のメタデータは上書きされます。\n\n';
            }

            confirmMsg += '続行しますか？';

            if (!confirm(confirmMsg)) {
                e.target.value = '';
                return;
            }

            // Merge students (add new, keep existing)
            const studentSet = new Set(state.students);
            importedStudents.forEach(s => studentSet.add(s));
            state.students = Array.from(studentSet);

            // Merge metadata (overwrite duplicates)
            Object.keys(importedMetadata).forEach(name => {
                if (!state.studentMetadata[name]) {
                    state.studentMetadata[name] = {};
                }
                Object.assign(state.studentMetadata[name], importedMetadata[name]);
            });

            // Sort state.students by roster order (Year-Class-No)
            state.students = sortStudentsByRoster(state.students);

            // Save to localStorage
            localStorage.setItem('grade_manager_students', JSON.stringify(state.students));
            localStorage.setItem('gm_student_metadata', JSON.stringify(state.studentMetadata));

            saveSessionState();
            renderSettings();
            populateControls();

            alert(`学生データを読み込みました！\n\n読込: ${importedStudents.length}名\n重複: ${duplicates.length}名\n合計: ${state.students.length}名`);

        } catch (err) {
            console.error('CSV import error:', err);
            alert('CSVファイルの読み込みに失敗しました:\n' + err.message);
        } finally {
            e.target.value = '';
        }
    }).catch(err => {
        console.error('File read error:', err);
        alert('ファイルの読み込みに失敗しました:\n' + err.message);
        e.target.value = '';
    });
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

function handleSubjectsCsvImport(e) {
    const file = e.target.files[0];
    if (!file) return;

    readFileText(file).then(text => {
        try {
            const rows = parseCSV(text).filter(row => row.length > 0 && row.some(col => col.trim()));

            if (rows.length < 2) {
                throw new Error('CSVファイルが空か、データが不足しています。');
            }

            // Parse header (BOM already handled by readFileText if present)
            const header = rows[0].map(h => h.trim());

            // Validate header format
            const expectedHeaders = ['授業科目', '単位', '学年', '種別1', '種別2', '種別3', '種別4'];
            const hasValidHeader = expectedHeaders.every((h, i) => header[i] === h);

            if (!hasValidHeader) {
                throw new Error('CSVファイルの形式が正しくありません。\n期待されるヘッダー: ' + expectedHeaders.join(', '));
            }

            // Parse subjects
            const importedSubjects = [];
            for (let i = 1; i < rows.length; i++) {
                const cols = rows[i].map(c => c.trim());
                if (cols.length < 3) continue; // Skip invalid rows

                const subject = {
                    name: cols[0],
                    credits: parseFloat(cols[1]) || 0,
                    year: parseInt(cols[2]) || 1,
                    type1: cols[3] || '',
                    type2: cols[4] || '',
                    type3: cols[5] || '',
                    type4: cols[6] || '',
                    exclude: false
                };

                if (subject.name) {
                    importedSubjects.push(subject);
                }
            }

            if (importedSubjects.length === 0) {
                throw new Error('有効な科目データが見つかりませんでした。');
            }

            // Check for duplicates
            const existingNames = new Set(state.subjects.map(s => s.name));
            const duplicates = importedSubjects.filter(s => existingNames.has(s.name));

            let confirmMsg = `${importedSubjects.length}件の科目データを読み込みます。\n\n`;

            if (duplicates.length > 0) {
                confirmMsg += `※ ${duplicates.length}件の重複する科目が見つかりました。\n`;
                confirmMsg += '重複する科目は上書きされます。\n\n';
            }

            confirmMsg += '続行しますか？';

            if (!confirm(confirmMsg)) {
                e.target.value = '';
                return;
            }

            // Merge subjects (replace duplicates)
            const nameToSubject = new Map();

            // Add existing subjects
            state.subjects.forEach(s => {
                nameToSubject.set(s.name, s);
            });

            // Overwrite with imported subjects
            importedSubjects.forEach(s => {
                nameToSubject.set(s.name, s);
            });

            // Update state
            state.subjects = Array.from(nameToSubject.values());

            // Save to localStorage
            localStorage.setItem('grade_manager_subjects', JSON.stringify(state.subjects));
            localStorage.setItem('gm_master_subjects_json', JSON.stringify(state.subjects));

            saveSessionState();
            renderSettings();

            alert(`科目データを読み込みました！\n\n読込: ${importedSubjects.length}件\n上書き: ${duplicates.length}件\n合計: ${state.subjects.length}件`);

        } catch (err) {
            console.error('CSV import error:', err);
            alert('CSVファイルの読み込みに失敗しました:\n' + err.message);
        } finally {
            e.target.value = '';
        }
    }).catch(err => {
        console.error('File read error:', err);
        alert('ファイルの読み込みに失敗しました:\n' + err.message);
        e.target.value = '';
    });
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

    if (confirm('すべての変更情報を確定保存（Global Save）しますか？\n\n・名簿、科目定義、全成績、出欠情報、座席配置をブラウザに固定します。\n・念のためバックアップJSONファイルの出力もおすすめします。')) {

        // 1. Perform a thorough session save
        saveSessionState();

        // 2. Update Master Data (used for resets)
        // Students master
        const studentsRaw = state.students.join(',');
        localStorage.setItem('gm_master_students', studentsRaw);

        // Subjects master (CSV format)
        const header = "授業科目,単位,学年,種別1,種別2,種別3,種別4,除外";
        const rows = state.subjects
            .map(s => `${s.name},${s.credits},${s.year},${s.type1 || ''},${s.type2 || ''},${s.type3 || ''},${s.type4 || ''},${s.exclude ? '1' : ''}`);
        const subjectsRaw = [header, ...rows].join('\n');
        localStorage.setItem('gm_master_subjects', subjectsRaw);

        // 3. Mark as fully initialized
        localStorage.setItem('grade_manager_initialized', 'true');

        // 4. Offer JSON Backup
        if (confirm('ブラウザへのデータ固定が完了しました。\n続けて、PCへのバックアップファイル（JSON）も出力しますか？（強く推奨）')) {
            exportJson();
            setTimeout(() => location.reload(), 1500);
        } else {
            alert('設定を確定保存しました。再読み込みします。');
            location.reload();
        }
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

function parseCSV(text) {
    const rows = [];
    let row = [];
    let cur = '';
    let inQuote = false;
    // Normalize newlines
    const chars = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    for (let i = 0; i < chars.length; i++) {
        const c = chars[i];
        if (inQuote) {
            if (c === '"') {
                if (i + 1 < chars.length && chars[i + 1] === '"') {
                    cur += '"';
                    i++;
                } else {
                    inQuote = false;
                }
            } else {
                cur += c;
            }
        } else {
            if (c === '"') {
                inQuote = true;
            } else if (c === ',') {
                row.push(cur);
                cur = '';
            } else if (c === '\n') {
                row.push(cur);
                rows.push(row);
                row = [];
                cur = '';
            } else {
                cur += c;
            }
        }
    }
    if (cur || row.length > 0) {
        row.push(cur);
        rows.push(row);
    }
    return rows;
}

function readFileText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const buffer = e.target.result;
            try {
                const view = new Uint8Array(buffer);

                // 1. Check for UTF-8 BOM
                if (view.length >= 3 && view[0] === 0xEF && view[1] === 0xBB && view[2] === 0xBF) {
                    const decoder = new TextDecoder('utf-8');
                    resolve(decoder.decode(buffer));
                    return;
                }

                // 2. Check for UTF-16LE BOM
                if (view.length >= 2 && view[0] === 0xFF && view[1] === 0xFE) {
                    const decoder = new TextDecoder('utf-16le');
                    resolve(decoder.decode(buffer));
                    return;
                }

                // 3. Check for UTF-16BE BOM
                if (view.length >= 2 && view[0] === 0xFE && view[1] === 0xFF) {
                    const decoder = new TextDecoder('utf-16be');
                    resolve(decoder.decode(buffer));
                    return;
                }

                // 4. Try UTF-8 (Strict)
                try {
                    const decoder = new TextDecoder('utf-8', { fatal: true });
                    resolve(decoder.decode(buffer));
                    return;
                } catch (utfError) {
                    // Not valid UTF-8, continue to Shift-JIS
                }

                // 5. Try Shift_JIS variants
                // Note: windows-31j is more comprehensive for Japanese Excel CSVs
                const encodings = ['windows-31j', 'shift-jis', 'shift_jis', 'sjis', 'cp932'];
                for (const enc of encodings) {
                    try {
                        const decoder = new TextDecoder(enc, { fatal: true });
                        resolve(decoder.decode(buffer));
                        return;
                    } catch (err) {
                        continue;
                    }
                }

                // 6. Last resort: UTF-8 with replacement characters
                const decoder = new TextDecoder('utf-8', { fatal: false });
                resolve(decoder.decode(buffer));
            } catch (error) {
                console.error('readFileText error:', error);
                reject(error);
            }
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsArrayBuffer(file);
    });
}

function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Check file extension
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith('.json')) {
        // Handle JSON file - pass the event to handleJsonImport
        handleJsonImport(e);
        return;
    }

    // Handle CSV file (existing logic)
    readFileText(file).then(text => {
        try {
            // New logic: Only try to parse Score CSV or Subject Definitions here. 
            // Roster CSV should ideally go through "Roster Import" button, but we can support fallback or redirect.

            const rows = parseCSV(text).filter(row => row.length > 0);
            if (rows.length < 2) throw new Error("Empty or invalid CSV");

            const header = rows[0];
            const h0 = header[0]?.trim().replace(/^"|"$/g, '');

            // Check if it looks like a Roster
            const isRoster = (h0 === '名前') || (header.some(h => h.includes('出席') && h.includes('番号')) && header.includes('氏名'));

            if (isRoster) {
                // If user used the generic "Load" button for a roster, redirect to the new flow
                if (confirm("名簿ファイルが検出されました。\n「名簿読込」機能として処理しますか？\n(キャンセルすると通常のファイルとして処理を続行します)")) {
                    processRosterCSV(rows, header);
                    e.target.value = '';
                    return;
                }
            }

            // ... Continue with Score/Subject Parsing (Subject Defs, Score List) ...

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
                    // ONLY update year if currently MISSING or 0, BUT avoid changing it if it was intentionally 0 (floater)
                    // If it's a Special Study (naming convention or type2), we likely want to keep it as year 0.
                    const isFloater = (subject.year === 0 || subject.name.startsWith('特・') || subject.type2 === '特別学修');
                    if (!isNaN(csvYear) && (!subject.year || (subject.year === 0 && !isFloater))) {
                        subject.year = csvYear;
                    }
                    // Only update Types if they are currently missing (don't overwrite with old CSV data)
                    if (row[3] && !subject.type1) subject.type1 = row[3];
                    if (row[4] && !subject.type2) subject.type2 = row[4];
                }

                if (!state.scores[studentName]) state.scores[studentName] = {};
                if (!state.scores[studentName][subjectName]) state.scores[studentName][subjectName] = {};

                // Set obtainedYear for floater subjects using the Year column in CSV
                if (subject && subject.year === 0 && !isNaN(csvYear) && csvYear > 0) {
                    state.scores[studentName][subjectName].obtainedYear = csvYear;
                }

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
            syncSpecialActivitiesForAll();
            render();
            // Clear input
            e.target.value = '';
        } catch (err) {
            alert(`エラー: ${err.message}`);
            e.target.value = '';
        }
    }).catch(err => {
        alert(`エラー: ${err.message}`);
        e.target.value = '';
    });
}


// --- New Dedicated Roster Import Logic ---

function handleRosterSelect(e) {
    const file = e.target.files[0];
    if (!file) return;

    readFileText(file).then(text => {
        try {
            const rows = parseCSV(text).filter(row => row.length > 0);
            if (rows.length < 2) throw new Error("Empty or invalid CSV");
            importState.filename = file.name; // Store filename temporarily
            const header = rows[0];
            processRosterCSV(rows, header);
        } catch (err) {
            alert('名簿読み込みエラー: ' + err.message);
        } finally {
            e.target.value = ''; // Reset
        }
    }).catch(err => {
        alert('名簿読み込みエラー: ' + err.message);
        e.target.value = '';
    });
}

function processRosterCSV(rows, header) {
    // Shared Logic
    const h0 = header[0].trim().replace(/^"|"$/g, '');
    const isNewRoster = header.some(h => h.includes('出席') && h.includes('番号')) && header.includes('氏名');

    const newStudents = [];

    if (isNewRoster) {
        // New Format Logic
        const colName = header.findIndex(h => h.trim() === '氏名');
        // Fix: Year might be quoted or contain whitespace
        const colYear = header.findIndex(h => h.trim().replace(/"/g, '') === '年' || h.trim() === '年');
        const colClass = header.findIndex(h => h.trim().replace(/"/g, '') === '組' || h.trim() === '組');
        const colNo = header.findIndex(h => h.includes('出席') && h.includes('番号'));
        const colId = header.findIndex(h => h.includes('学籍') && h.includes('番号')); // Optional

        if (colName === -1) throw new Error("CSVに「氏名」列が見つかりません。");

        rows.slice(1).forEach(row => {
            const name = row[colName]?.trim();
            if (name) {
                const y = row[colYear]?.trim();
                const c = row[colClass]?.trim();

                // Debug fallback if extraction failed but columns seem likely position-based
                // User hint: Year is 2nd column (index 1)
                const finalY = y || (colYear === -1 && row[1] ? row[1] : '9');
                // Assume Class might be 3rd column (index 2) if Year is index 1, or maybe index 2? 
                // Let's rely on name search primarily. If Class search failed too, guess index 2.
                const finalC = c || (colClass === -1 && row[2] ? row[2] : 'Z');
                const n = row[colNo]?.trim();
                const sid = colId !== -1 ? row[colId]?.trim() : '';

                // Metadata
                const meta = {};
                header.forEach((h, idx) => {
                    const cleanH = h.replace(/\n/g, '').replace(/"/g, '').trim();
                    if (cleanH) meta[cleanH] = row[idx];
                });

                // Force include Year/Class in metadata if missing (using fallback values)
                if (!meta['年'] && !meta['year']) meta['年'] = finalY;
                if (!meta['組'] && !meta['class']) meta['組'] = finalC;

                newStudents.push({
                    name: name,
                    sortKey: `${finalY || '9'}-${finalC || 'Z'}-${(n || '999').padStart(3, '0')}`,
                    metadata: meta,
                    year: finalY,
                    class: finalC,
                    no: n,
                    studentId: sid
                });
            }
        });
    } else {
        // Fallback for simple list
        rows.slice(1).forEach(row => {
            if (row.length > 0 && row[0].trim() !== '') {
                const name = row[0].trim();
                newStudents.push({
                    name: name,
                    sortKey: name,
                    metadata: {},
                    year: '',
                    class: ''
                });
            }
        });
    }

    if (newStudents.length === 0) throw new Error("有効な学生データが見つかりませんでした。");

    // Default Sort
    newStudents.sort((a, b) => a.sortKey.localeCompare(b.sortKey));

    openRosterBoard(newStudents);
}

// --- Graduation Requirements Logic ---
function renderGraduationRequirements() {
    const studentName = state.currentStudent;
    if (!studentName) return;

    // Clean up/Sync Special Activities before rendering
    syncSpecialActivitiesForAll();

    const summaryContainer = document.getElementById('gradRequirementsSummary');
    const detailsBody = document.getElementById('gradRequirementsDetails');
    if (!summaryContainer || !detailsBody) return;

    summaryContainer.innerHTML = '';
    detailsBody.innerHTML = '';

    // Logic to identify passed subjects
    const isPassed = (sub) => {
        const scoreObj = (state.scores[studentName] || {})[sub.name];
        if (!scoreObj) return false;

        // Special Activities: Passed if "履" exists in any column OR any data in "学年末"
        if (sub.name.includes('特別活動')) {
            const finalVal = scoreObj['学年末'];
            const hasFinalData = (finalVal !== undefined && finalVal !== null && finalVal !== '' && finalVal !== '-');
            const hasAttended = SCORE_KEYS.some(k => scoreObj[k] === '履');
            if (hasFinalData || hasAttended) return true;
        }

        // Regular Subjects: Passed if numeric score >= 60 in '学年末'
        const finalScore = scoreObj['学年末'];
        const n = parseFloat(finalScore);
        if (!isNaN(n) && n >= 60) return true;

        // All Subjects: Passed if a passing status string is found in any column
        const passingStatuses = ['合', '合格', '認', '認定', 'A', 'B', 'C', '履', '修'];
        return SCORE_KEYS.some(k => {
            const val = scoreObj[k];
            return val !== undefined && val !== null && typeof val === 'string' && passingStatuses.includes(val.trim());
        });
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
            const type2Raw = (sub.type2 || 'その他').trim();
            let effectiveType2 = type2Raw;

            // Force Arts subjects to be '一般' (General) to ensure they are counted
            if (['音楽', '美術', '書道'].some(art => sub.name.includes(art))) {
                effectiveType2 = '一般';
            }

            if (effectiveType2 === '一般') {
                totalGeneralCredits += credits;
            } else if (effectiveType2 !== 'その他') {
                // Professional usually includes 専門共通, 基盤専門, 応用専門, 特別学修
                if (effectiveType2 === '特別学修' || effectiveType2 === '特別学習') {
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

    // Render Gantt Charts
    renderMandatoryGanttChart(studentName, subjects, isPassed);
    renderDPGanttChart(studentName, subjects, isPassed);
}




// ==================== RENDERING ====================
function render() {
    updateClassSelectVisibility();
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
    } else if (state.currentTab === 'at_risk') {
        renderAtRiskReport();
    } else if (state.currentTab === 'settings') {
        renderSettings();
    } else if (state.currentTab === 'attendance') {
        initAttendance();
    } else if (state.currentTab === 'class_attendance_stats') {
        renderClassAttendanceStats();
    } else if (state.currentTab === 'student_summary') {
        renderStudentSummary();
    } else if (state.currentTab === 'seating') {
        renderSeatingChart();
    } else if (state.currentTab === 'class_officers') {
        renderClassOfficers();
    } else if (state.currentTab === 'subject_management') {
        renderSubjectManagement();
    } else if (state.currentTab === 'metadata_editor') {
        renderMetadataEditor();
    } else if (state.currentTab === 'roster_board') {
        renderRosterBoardTable();
    } else if (state.currentTab === 'faculty_roster') {
        renderFacultyTable();
    } else if (state.currentTab === 'timetable') {
        if (typeof renderTimetableGrid === 'function') {
            renderTimetableGrid();
        }
    }
}

// Chart instance variables
let stats2SimpleChartInstance = null;
let stats2WeightedChartInstance = null;
let stats2GpaChartInstance = null;
let attendanceChartInstance = null;
let subjectAttendanceChartInstance = null;
let dayAttendanceChartInstance = null;
let periodAttendanceChartInstance = null;

// --- GPA / Year Utilities ---

// Helper: Filter subjects based on UI settings (Course, etc.)
const getTargetSubjects = (predicate) => {
    const courseFilter = state.currentCourse;
    return state.subjects.filter(s => {
        if (!predicate(s)) return false;

        // Exclude logic: Skip subjects marked 'exclude' (GPA exempt), 
        // BUT allow Arts subjects and Special Studies because they count for credits even if GPA exempt.
        const isArts = ["音楽", "美術", "書道"].some(art => s.name.includes(art));
        const namesStartsContents = ['特・', '特･'];
        const isSpecial = (s.type2 === '特別学修' || s.type2 === '特別学習' || namesStartsContents.some(prefix => s.name.startsWith(prefix)));
        if (s.exclude && !isArts && !isSpecial) return false;

        // Course Filter
        if (courseFilter && courseFilter !== "") {
            const t1 = (s.type1 || "").trim();
            const t3 = (s.type3 || "").trim();
            const t4 = (s.type4 || "").trim();

            // Explicitly include Elective Required Arts subjects regardless of course
            const isArts = ["音楽", "美術", "書道"].some(art => s.name.includes(art));
            if (isArts) return true;

            if (courseFilter === 'コース未配属') {
                // Only show truly common subjects
                const hasNoCourseTag = (!t4 || t4 === 'コース共通' || t4 === '共通');
                if (!hasNoCourseTag) return false;
            } else {
                // Determine if this subject is "Common"
                // Check multiple indicators:
                // 1. type1: '必履修', '選必', '必修得' are common to all students
                // 2. type3/type4: '一般', '共通', '専門共通', or numeric year tags
                // 3. Empty type4 defaults to common
                const isCommonByType1 = (t1 === '必履修' || t1 === '選必' || t1 === '必修得' || t1.includes('必'));
                const isCommonByType3 = (t3 === '一般' || t3 === '共通' || t3.includes('共通'));
                const isCommonByType4 = (!t4 || t4 === 'コース共通' || t4 === '共通' || t4 === '一般' || t4.includes('共通') || /^\d/.test(t4));

                const isCommon = isCommonByType1 || isCommonByType3 || isCommonByType4;
                const isMatch = (t4 === courseFilter || courseFilter.includes(t4) || t4.includes(courseFilter));

                if (!isCommon && !isMatch) return false;
            }
        }
        return true;
    });
};

/**
 * Returns strictly the students registered in the application's core settings.
 */
function getRegisteredStudents() {
    return state.students || [];
}

/**
 * Standardized way to get the list of students for a specific year and course.
 */
// Helper to safely get metadata even if name is slightly different or encrypted
function getStudentMetadataSafe(rawName) {
    if (!rawName) return null;
    ensureCandidateCache();

    // 1. Direct match (O(1))
    if (candidateLookupCache.metadataMap.has(rawName)) {
        return candidateLookupCache.metadataMap.get(rawName);
    }

    // 2. Normalized match (O(1))
    const targetNorm = normalizeStudentName(rawName);
    if (candidateLookupCache.normMetadataMap.has(targetNorm)) {
        return candidateLookupCache.normMetadataMap.get(targetNorm);
    }

    // 3. Deep search for alias/encrypted name (Fallback - slightly slower but rare)
    // This is only needed if the metadata key doesn't match the name AND normalized name
    const keys = Array.from(candidateLookupCache.metadataMap.keys());
    for (const k of keys) {
        const meta = candidateLookupCache.metadataMap.get(k);
        const aliases = [
            getDisplayName(k),
            meta['暗号化氏名1'], meta['暗号化氏名'], meta['EncryptedName'],
            meta['氏名'], meta['名前'], meta['Name'],
            meta['学籍番号'], meta['id'], meta['studentId']
        ];
        if (aliases.some(a => a && normalizeStudentName(a) === targetNorm)) return meta;
    }

    return null;
}

/**
 * Robustly extract a value from metadata by checking multiple possible Japanese/English keys.
 */
function getMetaValue(meta, possibleKeys) {
    if (!meta) return "";
    const metaKeys = Object.keys(meta);
    for (const pk of possibleKeys) {
        // Direct
        if (meta[pk] !== undefined && meta[pk] !== null && meta[pk] !== "") return String(meta[pk]).trim();
        // Normalized key match
        const normPk = pk.toLowerCase().replace(/\s/g, '');
        const foundKey = metaKeys.find(mk => mk.toLowerCase().replace(/\s/g, '') === normPk);
        if (foundKey && meta[foundKey] !== undefined && meta[foundKey] !== null && meta[foundKey] !== "") {
            return String(meta[foundKey]).trim();
        }
    }
    return "";
}

/**
 * Standardized way to get the list of students for a specific year and course.
 */
function getClassStudents(year, course, sourceList = null) {
    const currentName = state.currentStudent;
    const targetYear = parseInt(year);

    // Use provided list or union of all registered students
    const studentList = sourceList || getRegisteredStudents();

    const result = studentList.filter(s => {
        let stYear = 1;
        let stCourse = "";

        const m = getStudentMetadataSafe(s);

        if (m) {
            const yStr = getMetaValue(m, ['年', '学年', 'year', 'Grade', '年次']);
            stYear = parseInt(yStr) || 1;
            stCourse = getMetaValue(m, ['コース', '学科', 'course', 'Dept', '応用専門分野・領域', '所属']);
        } else {
            // Fallback for current student
            if (s === currentName || s.trim() === currentName) {
                stYear = parseInt(state.currentYear);
                stCourse = state.currentCourse;
            } else {
                const yearMatch = s.match(/(\d)年/);
                if (yearMatch) stYear = parseInt(yearMatch[1]);
                else stYear = targetYear;
            }
        }

        if (stYear !== targetYear) return false;

        // Course Filter:
        if (!course || course === "" || course === "全体 (All Courses)") return true;

        // Robust match (includes, same, etc.)
        const normC = (course || "").trim();
        const normStC = (stCourse || "").trim();
        if (normStC === "" || normStC === normC || normC.includes(normStC) || normStC.includes(normC)) return true;

        return false;
    });

    // Ensure the CURRENT student is always reachable if they match the year
    if (currentName && !result.some(s => s === currentName || getStudentMetadataSafe(s) === getStudentMetadataSafe(currentName))) {
        const m = getStudentMetadataSafe(currentName);
        const yStr = m ? getMetaValue(m, ['年', '学年', 'year', 'Grade', '年次']) : "";
        const curY = parseInt(yStr) || parseInt(state.currentYear);
        if (curY === targetYear) result.push(currentName);
    }

    return result;
}


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

/**
 * Correctly calculates cumulative statistics for a student up to a specific year and test point.
 * This ensures consistency between Personal Stats and Class Statistics reports.
 */
function getStudentStats(studentName, targetYear, targetTest) {
    // 1. Stats 1 (Snapshot of current year/test)
    const subjects1 = getTargetSubjects(s => {
        if (s.year === targetYear) return true;
        if (s.year === 0) {
            const scoreObj = (state.scores[studentName] || {})[s.name];
            return scoreObj && scoreObj.obtainedYear === targetYear;
        }
        return false;
    });


    let s1Sum = 0, s1Count = 0;
    subjects1.forEach(sub => {
        if (sub.name.startsWith('特・')) return;
        if (!isNumericSubject(sub.name)) return;

        const sc = getScore(studentName, sub.name, targetTest);
        if (typeof sc === 'number') { s1Sum += sc; s1Count++; }
    });
    const stats1 = { avg: s1Count > 0 ? (s1Sum / s1Count) : 0, sum: s1Sum, count: s1Count };

    // 2. Stats 2 (Cumulative from Year 1 up to targetYear/targetTest)
    const subjects2 = getTargetSubjects(s => {
        // Fix: Explicitly include Arts subjects if they have any data, preventing exclusion due to missing 'year'
        if (['音楽', '美術', '書道'].some(art => s.name.includes(art))) {
            const scoreObj = (state.scores[studentName] || {})[s.name];
            if (scoreObj && SCORE_KEYS.some(k => scoreObj[k])) return true;
        }

        if (s.year > 0 && s.year <= targetYear) return true;
        if (s.year === 0) {
            const scoreObj = (state.scores[studentName] || {})[s.name];
            if (!scoreObj) return false;
            // Support subjects obtained in specific year, or fallback to ANY year presence for stats2 (cumulative)
            const oy = scoreObj.obtainedYear || 0;
            if (oy > 0 && oy <= targetYear) return true;
            // Fallback: If obtainedYear is missing, check if there's any score data recorded
            const hasData = SCORE_KEYS.some(k => scoreObj[k] !== undefined && scoreObj[k] !== null && scoreObj[k] !== '');
            if (hasData && oy === 0) return true; // Assume year 1 if data exists but year is missing? 
            // Better: if year is 0 but it has data, for cumulative credits, we probably should count it.
        }
        return false;
    });

    let s2Sum = 0, s2Count = 0, s2WgtN = 0, s2WgtD = 0, s2GpN = 0, s2GpD = 0;
    let s2CredGen = 0, s2CredSpec = 0;

    subjects2.forEach(sub => {
        const scoreObj = (state.scores[studentName] || {})[sub.name] || {};
        const stYear = sub.year === 0 ? (scoreObj.obtainedYear || 0) : sub.year;
        const isPastYear = stYear < targetYear;

        // Average/GPA logic uses current test for current year, Final for past years
        const testKey = isPastYear ? '学年末' : targetTest;
        const val = getScore(studentName, sub.name, testKey);

        const isNumeric = !sub.name.startsWith('特・') && isNumericSubject(sub.name);

        if (typeof val === 'number' && isNumeric) {
            s2Sum += val; s2Count++;
            const cr = sub.credits || 0;
            s2WgtN += val * cr; s2WgtD += cr;
            let gp = 0;
            if (val >= 90) gp = 4; else if (val >= 80) gp = 3; else if (val >= 70) gp = 2; else if (val >= 60) gp = 1;
            s2GpN += gp * cr; s2GpD += cr;
        }

        // Credit Calculation Logic (Sync with renderStats)
        let passed = false;
        const finalVal = scoreObj['学年末'];

        if (sub.name.includes('特別活動')) {
            const hasFinalData = (finalVal !== undefined && finalVal !== null && finalVal !== '' && finalVal !== '-');
            const hasAttended = SCORE_KEYS.some(k => scoreObj[k] === '履');
            passed = hasFinalData || hasAttended;
        } else {
            // STRICT but aligned with Graduation Requirements:
            // 1. Numeric check: Only check '学年末' (Final Exam) >= 60
            // 2. String status check: Check ALL columns for passing status (allow early credit recognition)
            const passingStatuses = ['合', '合格', '認', '認定', '修', '完了', '履', '履修', 'S', 'A', 'B', 'C'];

            // 1. Numeric Check (Year End Only)
            if (finalVal !== undefined && finalVal !== null && finalVal !== '') {
                const n = parseFloat(finalVal);
                if (!isNaN(n)) {
                    if (n >= 60) passed = true;
                }
            }

            // 2. String Status Check (Any Period - matches Graduation Requirements logic)
            if (!passed) {
                passed = SCORE_KEYS.some(k => {
                    const val = scoreObj[k];
                    return val !== undefined && val !== null && typeof val === 'string' && passingStatuses.includes(val.trim());
                });
            }

            // Debug Arts
            if (['音楽', '美術', '書道'].some(art => sub.name.includes(art))) {
                console.log(`[Art Debug] ${sub.name}: year=${sub.year}, type2="${sub.type2}", passed=${passed}, credits=${sub.credits}, finalVal="${finalVal}"`);
            }

            // Auto-pass for other special subjects ONLY if they have some data (to match Hide Empty)
            if (!passed && (sub.name.startsWith('特・') || sub.type2 === '特別学修')) {
                const hasAnyYearEnd = (finalVal !== undefined && finalVal !== null && finalVal !== '');
                if (hasAnyYearEnd) passed = true;
            }
        }

        // Debug logging for credit calculation
        if (studentName === state.currentStudent && targetYear === state.currentYear) {
            console.log(`[Credit Check] ${sub.name}: type2="${sub.type2}", finalVal="${finalVal}", passed=${passed}, credits=${sub.credits}`);
        }

        if (passed) {
            const t2 = (sub.type2 || "").trim();
            const namesStartsContents = ['特・', '特･'];
            const isSpecial = (t2 === '特別学修' || t2 === '特別学習' || namesStartsContents.some(prefix => sub.name.startsWith(prefix)));
            const credits = parseFloat(sub.credits) || 0;
            if (t2.includes('専門') || isSpecial) s2CredSpec += credits;
            else s2CredGen += credits;
        }
    });

    return {
        stats1,
        stats2: {
            credits: s2CredGen + s2CredSpec,
            credGen: s2CredGen,
            credSpec: s2CredSpec,
            avg_sim: s2Count > 0 ? (s2Sum / s2Count) : 0,
            avg_wgt: s2WgtD > 0 ? (s2WgtN / s2WgtD) : 0,
            gpa: s2GpD > 0 ? (s2GpN / s2GpD) : 0,
            count: s2Count,
            total_sum: s2Sum
        }
    };
}

/**
 * Helper to check if a student has any recorded scores in a specific academic year.
 */
function hasDataForYear(studentName, year) {
    const yearSubjects = state.subjects.filter(s => s.year === year && !s.exclude);
    return yearSubjects.some(sub => {
        for (const key of SCORE_KEYS) {
            const v = getScore(studentName, sub.name, key);
            if (v !== undefined && v !== null && v !== '') return true;
        }
        return false;
    });
}

function getScore(studentName, subjectName, testKey) {
    if (!studentName || !subjectName) return null;

    // Resolve Identity
    let dataKey = studentName;
    if (!state.scores[dataKey]) {
        // Try metadata-based identity resolution
        const targetMeta = getStudentMetadataSafe(studentName);
        if (targetMeta) {
            const foundKey = Object.keys(state.scores).find(k => getStudentMetadataSafe(k) === targetMeta);
            if (foundKey) dataKey = foundKey;
        }

        // Fallback: Display Name mapping
        if (dataKey === studentName && !state.scores[dataKey]) {
            const found = Object.keys(state.scores).find(k => getDisplayName(k) === studentName);
            if (found) dataKey = found;
        }
    }

    const studentScores = state.scores[dataKey] || {};

    // Dot-agnostic lookup
    let scoreObj = studentScores[subjectName];
    if (!scoreObj) {
        const altName = subjectName.includes('・') ? subjectName.replace('・', '･') : subjectName.replace('･', '・');
        scoreObj = studentScores[altName] || {};
    }
    const val = scoreObj[testKey];
    if (val === undefined || val === null || val === '') return null;
    const num = parseFloat(val);
    return isNaN(num) ? val : num;
}

function renderStats2() {
    const tbody = document.getElementById('stats2Body');
    if (!tbody) return;
    tbody.innerHTML = '';
    const currentStudent = state.currentStudent;
    if (!currentStudent) return;

    const totalStudents = state.students.length;
    const testKeys = ["学年末", "後期中間", "前期末", "前期中間"];
    const rowData = [];

    // Rule: Iterate 1 to 5. Determine if a row/plot exists for each.
    for (let y = 1; y <= 5; y++) {
        // Condition: Does this specific year y have ANY data for the student?
        if (!hasDataForYear(currentStudent, y)) continue;

        // Determine the latest test point for the "current" year snapshot
        let targetTest = '学年末';
        // Priority: 学年末 -> 後期中間 -> 前期末 -> 前期中間
        for (const tk of testKeys) {
            // MUST check for NUMERIC subjects and NUMERIC values, 
            // otherwise auto-filled "履" in Year-End will pick Year-End even if no grades exist yet.
            const hasNumericScores = state.subjects.filter(s => s.year === y && isNumericSubject(s.name)).some(s => {
                const sc = getScore(currentStudent, s.name, tk);
                return typeof sc === 'number';
            });
            if (hasNumericScores) {
                targetTest = tk;
                break;
            }
        }

        const studentsStats = state.students.map(name => {
            const stats = getStudentStats(name, y, targetTest);
            return { name, ...stats.stats2 };
        });

        const getRank = (list, key, name) => {
            const filtered = list.filter(s => s.count > 0);
            const sorted = [...filtered].sort((a, b) => (b[key] || 0) - (a[key] || 0));
            const idx = sorted.findIndex(s => s.name === name);
            if (idx === -1) return null;

            // Tie-handling
            let rank = 1;
            for (let i = 0; i < sorted.length; i++) {
                if (i > 0 && Math.abs((sorted[i][key] || 0) - (sorted[i - 1][key] || 0)) > 0.0001) {
                    rank = i + 1;
                }
                if (sorted[i].name === name) return rank;
            }
            return idx + 1;
        };

        const myStats = studentsStats.find(s => s.name === currentStudent);
        if (myStats) {
            rowData.push({
                year: y,
                count: myStats.count,
                avg_sim: myStats.avg_sim,
                avg_wgt: myStats.avg_wgt,
                gpa: myStats.gpa,
                rank_sim: getRank(studentsStats, 'avg_sim', currentStudent),
                rank_wgt: getRank(studentsStats, 'avg_wgt', currentStudent),
                rank_gpa: getRank(studentsStats, 'gpa', currentStudent)
            });
        }
    }

    // 2. Render Table
    rowData.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="text-align:center;">${row.year}年</td>
            <td style="text-align:center;">${row.count}</td>
            <td style="text-align:center;">${row.avg_sim.toFixed(2)}</td>
            <td style="text-align:center;">${row.rank_sim ? row.rank_sim + ' / ' + totalStudents : '-'}</td>
            <td style="text-align:center;">${row.avg_wgt.toFixed(2)}</td>
            <td style="text-align:center;">${row.rank_wgt ? row.rank_wgt + ' / ' + totalStudents : '-'}</td>
            <td style="text-align:center; font-weight:bold; color:#2563eb;">${row.gpa.toFixed(2)}</td>
            <td style="text-align:center;">${row.rank_gpa ? row.rank_gpa + ' / ' + totalStudents : '-'}</td>
        `;
        tbody.appendChild(tr);
    });

    // 3. Update Charts
    updateStats2Charts(rowData);
}

function updateStats2Charts(activeData) {
    const labels = ["1年", "2年", "3年", "4年", "5年"];
    const simpleAvgData = [null, null, null, null, null];
    const weightedAvgData = [null, null, null, null, null];
    const gpaData = [null, null, null, null, null];
    const rankSimData = [null, null, null, null, null];
    const rankWgtData = [null, null, null, null, null];
    const rankGpaData = [null, null, null, null, null];

    activeData.forEach(r => {
        const idx = r.year - 1;
        if (idx >= 0 && idx < 5) {
            simpleAvgData[idx] = r.avg_sim;
            weightedAvgData[idx] = r.avg_wgt;
            gpaData[idx] = r.gpa;
            rankSimData[idx] = r.rank_sim;
            rankWgtData[idx] = r.rank_wgt;
            rankGpaData[idx] = r.rank_gpa;
        }
    });

    const maxRank = Math.max(state.students.length, 1);

    stats2SimpleChartInstance = createStats2Chart('stats2SimpleChart', '平均点 (単純)', labels, simpleAvgData, rankSimData, stats2SimpleChartInstance, 100, '点数', maxRank);
    stats2WeightedChartInstance = createStats2Chart('stats2WeightedChart', '平均点 (加重)', labels, weightedAvgData, rankWgtData, stats2WeightedChartInstance, 100, '点数', maxRank);
    stats2GpaChartInstance = createStats2Chart('stats2GpaChart', 'GPA', labels, gpaData, rankGpaData, stats2GpaChartInstance, 4.0, 'GPA', maxRank);
}

function createStats2Chart(canvasId, label, labels, valueData, rankData, instanceVar, valueMax, valueTitle, maxRank) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    if (instanceVar) instanceVar.destroy();

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: label,
                    data: valueData,
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    yAxisID: 'y',
                    tension: 0.1,
                    fill: true
                },
                {
                    label: '順位',
                    data: rankData,
                    borderColor: '#94a3b8',
                    borderDash: [5, 5],
                    yAxisID: 'y1',
                    tension: 0,
                    pointStyle: 'circle',
                    pointRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
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
                    title: { display: true, text: valueTitle },
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
        if (parseInt(s.year) === 0) {
            const studentScores = state.scores[state.currentStudent] || {};
            // Dot-agnostic lookup for filter
            let scoreObj = studentScores[s.name];
            if (!scoreObj) {
                const alt = s.name.includes('・') ? s.name.replace('・', '･') : s.name.replace('･', '・');
                scoreObj = studentScores[alt];
            }

            const oy = scoreObj ? parseInt(scoreObj.obtainedYear) : 0;

            // SPECIAL FIX: For "Special Activities 1-3", they correspond roughly to Year 1-3.
            const match = s.name.match(/特[・･]特別活動(\d+)/);
            if (match) {
                const targetYear = parseInt(match[1]);
                return targetYear == state.currentYear;
            }

            // Other Special Subjects:
            if (oy > 0) {
                return oy == state.currentYear;
            }

            // Check if it already has ANY score data
            const hasData = scoreObj && SCORE_KEYS.some(k => {
                const val = scoreObj[k];
                return val !== undefined && val !== null && val !== '' && val !== '-';
            });

            if (hasData) {
                // Anchor to Year 1 if data exists but no obtainedYear
                return state.currentYear == 1;
            }

            // If NO data, show everywhere so the user can start entry
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

        const isSpecialStart = sub.name.startsWith('特・') || sub.name.startsWith('特･');
        const isSpecialActMatch = sub.name.match(/特[・･]特別活動(\d+)/);

        if (isSpecialStart) {
            // "特・特別活動1/2/3" are explicitly requested to be in Others table
            if (isSpecialActMatch) {
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
            let scoreObj = studentScores[sub.name];
            if (!scoreObj) {
                const alt = sub.name.includes('・') ? sub.name.replace('・', '･') : sub.name.replace('･', '・');
                scoreObj = studentScores[alt];
            }
            scoreObj = scoreObj || {};
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

            const theme = getSubjectTheme(sub.name);
            trSpecial.innerHTML = `
                <td>
                    <div style="font-weight:600">${sub.name}</div>
                    ${getSubjectMetadataIcons(sub.name)}
                </td>
                <td style="text-align:center"><span class="badge badge-gray">${sub.credits}</span></td>
                <td style="text-align:center"><span class="badge ${typeBadgeClass}">${sub.type1}</span></td>
                <td style="text-align:center">
                    <span style="font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; background: ${theme.bg}; color: ${theme.text}; border: 1px solid ${theme.border}; font-weight: 700;">
                        ${sub.type2}
                    </span>
                </td>
            `;
            trSpecial.appendChild(tdStatus);
            targetTbody.appendChild(trSpecial);
        } else {
            // Normal Subject (includes 'Others')
            const tr = document.createElement('tr');

            let typeBadgeClass = 'badge-gray';
            if (sub.type1 === '必') typeBadgeClass = 'badge-blue';
            else if (sub.type1 === '選必') typeBadgeClass = 'badge-success';

            const theme = getSubjectTheme(sub.name);
            tr.innerHTML = `
                <td>
                    <div style="font-weight:600">${sub.name}</div>
                    ${getSubjectMetadataIcons(sub.name)}
                </td>
                <td style="text-align:center"><span class="badge badge-gray">${sub.credits}</span></td>
                <td style="text-align:center"><span class="badge ${typeBadgeClass}">${sub.type1}</span></td>
                <td style="text-align:center">
                    <span style="font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; background: ${theme.bg}; color: ${theme.text}; border: 1px solid ${theme.border}; font-weight: 700;">
                        ${sub.type2}
                    </span>
                </td>
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
    // Exclude special activities and floater subjects that are non-numeric
    if (name.includes('特別活動')) return false;
    if (name.startsWith('特・') || name.startsWith('特･')) return false;
    // Exclude experiments, practical training, graduation research
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

/**
 * Global Sync: For all students and all years (1-5),
 * if there's any non-special subject with a "Year End" score,
 * automatically set the corresponding "Special Activity" to "履".
 */
function syncSpecialActivitiesForAll() {
    const years = [1, 2, 3, 4, 5];
    const allStudents = getRegisteredStudents();
    allStudents.forEach(student => {
        const studentScores = state.scores[student];
        if (!studentScores) return;

        years.forEach(year => {
            // Check if any standard subject in this year has a Year End score
            const hasYearEndData = state.subjects.some(sub => {
                if (sub.name.includes('特別活動')) return false;
                if (sub.type1 === '特別学修' || sub.type2 === '特別学修') return false;

                // Year match logic (standard or floater)
                let matchesYear = (sub.year === year);
                if (sub.year === 0) {
                    matchesYear = (studentScores[sub.name] && studentScores[sub.name].obtainedYear === year);
                }
                if (!matchesYear) return false;

                const scoreObj = studentScores[sub.name];
                return scoreObj && scoreObj['学年末'] && scoreObj['学年末'] !== '' && scoreObj['学年末'] !== '-';
            });

            const spActName1 = `特・特別活動${year}`;
            const spActName2 = `特･特別活動${year}`;
            const spAct = state.subjects.find(s => s.name === spActName1 || s.name === spActName2);
            if (spAct) {
                const actualName = spAct.name;
                if (hasYearEndData) {
                    if (!studentScores[actualName]) studentScores[actualName] = {};
                    studentScores[actualName]['学年末'] = '履';
                } else if (studentScores[actualName] && studentScores[actualName]['学年末'] === '履') {
                    // Bi-directional sync: If no regular data exists, clear the automatic '履' status
                    studentScores[actualName]['学年末'] = '';
                }
            }
        });
    });
    saveSessionState();
}

function updateScore(student, subject, key, value) {
    if (!state.scores[student]) state.scores[student] = {};
    // Dot-agnostic subject lookup to prevent duplicates
    let scoreObj = state.scores[student][subject];
    if (!scoreObj) {
        const alt = subject.includes('・') ? subject.replace('・', '･') : subject.replace('･', '・');
        if (state.scores[student][alt]) {
            scoreObj = state.scores[student][alt];
            subject = alt; // Redirect to existing key
        } else {
            state.scores[student][subject] = {};
            scoreObj = state.scores[student][subject];
        }
    }

    // For year-0 subjects (Floaters), pin them to the year they were first entered
    const courseFilter = state.currentCourse;
    const subDef = state.subjects.find(s => {
        if (s.name !== subject) return false;
        const t4 = s.type4 || 'コース共通';
        if (courseFilter && t4 !== 'コース共通' && t4 !== courseFilter) return false;
        return true;
    }) || state.subjects.find(s => s.name === subject);

    if (subDef && parseInt(subDef.year) === 0) {
        if (!scoreObj.obtainedYear) {
            scoreObj.obtainedYear = state.currentYear;
        }
    }

    // Only parse as float if it's a numeric subject and looks like a number
    if (isNumericSubject(subject) && value !== '' && !isNaN(value)) {
        state.scores[student][subject][key] = parseFloat(value);
    } else {
        state.scores[student][subject][key] = value;
    }

    // Auto-mark Special Activities "履" when any Year End score for that year is entered
    const isSpecialStudy = subDef && (subDef.type1 === '特別学修' || subDef.type2 === '特別学修');
    if (key === '学年末' && value !== '' && value !== '-' && !subject.includes('特別活動') && !isSpecialStudy) {
        let sy = 0;
        if (subDef) {
            sy = (subDef.year !== 0) ? subDef.year : (state.scores[student][subject].obtainedYear || state.currentYear);
        }
        if (sy > 0) {
            const spActName = `特・特別活動${sy}`;
            if (state.subjects.some(s => s.name === spActName)) {
                if (!state.scores[student][spActName]) state.scores[student][spActName] = {};
                state.scores[student][spActName]['学年末'] = '履';
            }
        }
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

        const subjects = getTargetSubjects(s => {
            // Year Match (Standard or Floater)
            if (s.year === year) return true;
            if (s.year === 0) {
                const scoreObj = (state.scores[state.currentStudent] || {})[s.name];
                return scoreObj && scoreObj.obtainedYear === year;
            }
            return false;
        }).filter(s => {
            // Hide Empty (No Credit / No Score)
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
        let rowHtml = `<td style="font-weight:bold; position:sticky; left:0; background:white; z-index:1; border-right:1px solid #e2e8f0;">${year}年</td>`;

        // All scores, ranks, and credits are now driven by the centralized getStudentStats
        const sStats = getStudentStats(state.currentStudent, year, '学年末');

        // 2-9. Scores & Ranks for 4 tests
        let testRowsHtml = '';
        SCORE_KEYS.forEach(key => {
            const periodStats = getStudentStats(state.currentStudent, year, key);
            const avg = periodStats.stats1.count > 0 ? periodStats.stats1.avg.toFixed(1) : "";
            const rank = calculateRank(year, key, state.currentStudent);

            const avgClass = (avg !== "" && parseFloat(avg) < 60) ? 'color:red;' : '';
            testRowsHtml += `
                <td style="text-align:center; border-left:1px solid #e2e8f0; ${avgClass}">${avg}</td>
                <td style="text-align:center;">${rank}</td>
            `;
        });
        rowHtml += testRowsHtml;

        // 10-12. Cumulative Credits
        const creditsHtml = `
            <td style="text-align:center; border-left:1px solid #e2e8f0;">${sStats.stats2.credGen}</td>
            <td style="text-align:center;">${sStats.stats2.credSpec}</td>
            <td style="text-align:center; font-weight:bold;">${sStats.stats2.credits}</td>
        `;
        rowHtml += creditsHtml;

        // 13-14. Promotion
        const required = promotionUnits[year] || 0;
        const shortfall = sStats.stats2.credits - required;
        const shortFallClass = shortfall < 0 ? 'color:red; font-weight:bold;' : '';

        const promotionHtml = `
            <td style="text-align:center; border-left:1px solid #e2e8f0;">${required}</td>
            <td style="text-align:center; ${shortFallClass}">${shortfall}</td>
        `;
        rowHtml += promotionHtml;

        // 15. Overall Rank (Yearly Total Score)
        const overallRank = calculateOverallRank(year, state.currentStudent);
        const overallRankHtml = `<td style="text-align:center; border-left:1px solid #e2e8f0;">${overallRank}</td>`;
        rowHtml += overallRankHtml;

        tr.innerHTML = rowHtml;
        tbody.appendChild(tr);
    }

    renderTrendChart();
    renderBoxPlot();
}

function calculateOverallRank(year, targetStudent) {
    const course = state.currentCourse;

    // Fix: Use cohort year for classmate lookup
    let cohortYear = year;
    const m = getStudentMetadataSafe(targetStudent);
    if (m) {
        cohortYear = parseInt(getMetaValue(m, ['年', '学年', 'year', 'Grade', '年次'])) || year;
    } else if (targetStudent === state.currentStudent) {
        cohortYear = state.currentYear;
    }

    const classStudents = getClassStudents(cohortYear, course);

    const sums = [];
    classStudents.forEach(s => {
        const sStats = getStudentStats(s, year, '学年末');
        if (sStats.stats1.count > 0) {
            sums.push({ name: s, total: sStats.stats1.sum });
        }
    });

    sums.sort((a, b) => b.total - a.total);

    // Tie-handling
    let rank = 1;
    for (let i = 0; i < sums.length; i++) {
        if (i > 0 && Math.abs(sums[i].total - sums[i - 1].total) > 0.0001) {
            rank = i + 1;
        }
        if (sums[i].name === targetStudent) return `${rank} / ${classStudents.length}`;
    }
    return "";
}

function calculateRank(year, key, targetStudent) {
    const course = state.currentCourse;

    // Fix: Use the student's CURRENT enrollment year (cohort) to find classmates
    let cohortYear = year;
    const m = getStudentMetadataSafe(targetStudent);
    if (m) {
        cohortYear = parseInt(getMetaValue(m, ['年', '学年', 'year', 'Grade', '年次'])) || year;
    } else if (targetStudent === state.currentStudent) {
        cohortYear = state.currentYear;
    }

    const classStudents = getClassStudents(cohortYear, course);

    const avgs = [];
    classStudents.forEach(s => {
        const sStats = getStudentStats(s, year, key);
        if (sStats.stats1.count > 0) {
            avgs.push({ name: s, val: sStats.stats1.avg });
        }
    });

    avgs.sort((a, b) => b.val - a.val);


    // Tie-handling
    let rank = 1;
    for (let i = 0; i < avgs.length; i++) {
        if (i > 0 && Math.abs(avgs[i].val - avgs[i - 1].val) > 0.0001) {
            rank = i + 1;
        }
        if (avgs[i].name === targetStudent) {
            const result = `${rank} / ${classStudents.length}`;
            return result;
        }
    }

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

            // Find the latest test that has ANY data among ACTIVE students
            const activeStudents = getRegisteredStudents();
            yearLoop: for (const y of years) {
                const subs = state.subjects.filter(s => s.year === y && !s.name.startsWith('特・'));
                if (subs.length === 0) continue;

                for (const t of tests) {
                    let hasData = false;
                    for (const s of activeStudents) {
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

        const targetStudents = getClassStudents(latestYear, state.currentCourse);

        // Data: Array of arrays.
        const boxData = subjects.map(sub => {
            const scores = [];
            targetStudents.forEach(s => {
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
                    const { ctx, chartArea: { top, bottom, left, right } = {} } = chart;
                    if (top === undefined) return; // Ensure chartArea is defined
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
                    const { ctx, chartArea: { top, bottom, left, right } = {} } = chart;
                    if (top === undefined) return; // Ensure chartArea is defined
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
                // Determine cohort: Use current student's enrollment year to find classmates
                let cohortYear = parseInt(state.currentYear);
                const m = getStudentMetadataSafe(state.currentStudent);
                if (m) {
                    const yStr = getMetaValue(m, ['年', '学年', 'year', 'Grade', '年次']);
                    if (yStr) cohortYear = parseInt(yStr);
                }

                const studentsToRank = getClassStudents(cohortYear, courseFilter);

                // 1. Get avg for all students
                const allAvgs = studentsToRank.map(s => {
                    let t = 0, c = 0;
                    subs.forEach(sub => {
                        const v = getScore(s, sub.name, test);
                        if (typeof v === 'number') { t += v; c++; }
                    });
                    return c > 0 ? (t / c) : null;
                }); // list of avgs or null

                // Pair with name
                const ranked = studentsToRank.map((name, i) => ({ name, avg: allAvgs[i] }))
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
                const { ctx, chartArea: { top, bottom, left, right } = {} } = chart;
                if (top === undefined) return; // Ensure chartArea is defined
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
    const yearEl = document.getElementById('classStatsYear');
    const testEl = document.getElementById('classStatsTest');
    if (!yearEl || !testEl) return;

    // 1. Sync Year
    if (!yearEl.value || yearEl.value == "1") {
        yearEl.value = state.currentYear || "1";
    }

    // 2. Determine best default test based on ANY student's data in that year
    const targetYear = parseInt(yearEl.value);
    const priorities = ["前期中間", "前期末", "後期中間", "学年末"];
    let maxFoundIdx = -1;

    // Fast check for default
    outerLoop:
    for (const s of state.students) {
        for (let idx = priorities.length - 1; idx >= 0; idx--) {
            if (idx <= maxFoundIdx) break; // No point checking lower priorities
            const testKey = priorities[idx];
            // Check if student has at least one numeric score in this test/year
            const hasData = state.subjects.filter(sub => sub.year === targetYear && !sub.exclude).some(sub => {
                const v = getScore(s, sub.name, testKey);
                return typeof v === 'number';
            });
            if (hasData) {
                maxFoundIdx = idx;
                if (maxFoundIdx === 3) break outerLoop;
            }
        }
    }
    if (maxFoundIdx !== -1) {
        testEl.value = priorities[maxFoundIdx];
    }

    generateClassStats();
}

function sortClassStats(col) {
    if (state.classStatsSortCol === col) {
        state.classStatsSortOrder = state.classStatsSortOrder === 'asc' ? 'desc' : 'asc';
    } else {
        state.classStatsSortCol = col;
        state.classStatsSortOrder = (col === 'name') ? 'asc' : 'desc'; // Default Desc for numeric
    }
    generateClassStats();
}

function generateClassStats() {
    const yearEl = document.getElementById('classStatsYear');
    const testEl = document.getElementById('classStatsTest');
    const targetYear = yearEl ? parseInt(yearEl.value) : state.currentYear;
    const testKey = testEl ? testEl.value : '学年末';

    const container = document.getElementById('classStatsContainer');
    if (!container) return;

    container.innerHTML = '<div style="padding: 2rem; text-align: center; color: #64748b;">集計中...</div>';

    setTimeout(() => {
        const studentData = calculateClassStatsList(targetYear, testKey);

        if (studentData.length === 0) {
            container.innerHTML = '<div style="padding: 2.5rem; text-align: center; color: #64748b; background: #f8fafc; border-radius: 0.5rem; border: 1px dashed #e2e8f0;">対象となる学生が見つかりません</div>';
            return;
        }

        const getSortIndicator = (col) => {
            if (state.classStatsSortCol !== col) return '<span style="opacity:0.2">?</span>';
            return state.classStatsSortOrder === 'asc' ? '▲' : '▼';
        };

        const thBase = "padding: 0.8rem 0.5rem; cursor: pointer; user-select: none; border-bottom: 2px solid #e2e8f0; transition: background 0.2s;";

        let html = `
            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); overflow: hidden;">
                <div style="overflow-x: auto;">
                    <table class="report-table" style="font-size: 0.82rem; width: 100%; white-space: nowrap; border-collapse: separate; border-spacing: 0;">
                        <thead>
                            <tr style="background: #f8fafc;">
                                <th style="padding: 1rem 0.8rem; border-bottom: 2px solid #e2e8f0; position: sticky; left: 0; background: #f8fafc; z-index: 10; width: 180px; text-align: left;">学生氏名 (Name)</th>
                                <th colspan="3" style="text-align: center; border-left: 2px solid #e2e8f0; border-bottom: 2px solid #e2e8f0; background: #f0f9ff; color: #1e40af; font-weight: 700;">統計1 (${testKey})</th>
                                <th colspan="7" style="text-align: center; border-left: 2px solid #e2e8f0; border-bottom: 2px solid #e2e8f0; background: #f0fdf4; color: #166534; font-weight: 700;">統計2 (累積)</th>
                            </tr>
                            <tr style="background: #f1f5f9; font-size: 0.72rem; color: #475569;">
                                <th onclick="sortClassStats('name')" style="${thBase} position: sticky; left: 0; background: #f1f5f9; z-index: 10; padding-left: 0.8rem; text-align:left;">氏名 ${getSortIndicator('name')}</th>
                                <th style="width: 50px; text-align: center; border-left: 2px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">科目</th>
                                <th onclick="sortClassStats('stats1_avg')" style="${thBase} width: 70px; text-align: center;">平均 ${getSortIndicator('stats1_avg')}</th>
                                <th onclick="sortClassStats('stats1_rank')" style="${thBase} width: 50px; text-align: center;">順位 ${getSortIndicator('stats1_rank')}</th>
                                <th style="width: 50px; text-align: center; border-left: 2px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">単位</th>
                                <th onclick="sortClassStats('stats2_avg_sim')" style="${thBase} width: 75px; text-align: center;">単純平均 ${getSortIndicator('stats2_avg_sim')}</th>
                                <th onclick="sortClassStats('stats2_rank_sim')" style="${thBase} width: 50px; text-align: center;">順位 ${getSortIndicator('stats2_rank_sim')}</th>
                                <th onclick="sortClassStats('stats2_avg_wgt')" style="${thBase} width: 75px; text-align: center;">加重平均 ${getSortIndicator('stats2_avg_wgt')}</th>
                                <th onclick="sortClassStats('stats2_rank_wgt')" style="${thBase} width: 50px; text-align: center;">順位 ${getSortIndicator('stats2_rank_wgt')}</th>
                                <th onclick="sortClassStats('stats2_gpa')" style="${thBase} width: 60px; text-align: center; color:#1e40af; font-weight:700;">GPA ${getSortIndicator('stats2_gpa')}</th>
                                <th onclick="sortClassStats('stats2_rank_gpa')" style="${thBase} width: 50px; text-align: center;">順位 ${getSortIndicator('stats2_rank_gpa')}</th>
                            </tr>
                        </thead>
                        <tbody>`;

        studentData.forEach((row, idx) => {
            const rowStyle = idx % 2 === 1 ? 'background: #f8fafc;' : 'background: white;';
            html += `
                <tr style="${rowStyle}">
                    <td style="font-weight: 600; padding: 0.6rem 0.8rem; position: sticky; left: 0; background: inherit; z-index: 5; border-right: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; color: #334155;">${getDisplayName(row.name)}</td>
                    <td style="text-align: center; border-left: 2px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; color: #475569;">${row.stats1_count}</td>
                    <td style="text-align: center; border-bottom: 1px solid #f1f5f9; color: #1e293b;">${row.stats1_avg.toFixed(2)}</td>
                    <td style="text-align: center; border-bottom: 1px solid #f1f5f9; font-size: 0.8rem; color: #64748b;">${row.stats1_rank}</td>
                    <td style="text-align: center; border-left: 2px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; color: #475569;">${row.stats2_credits}</td>
                    <td style="text-align: center; border-bottom: 1px solid #f1f5f9; color: #1e293b;">${row.stats2_avg_sim.toFixed(2)}</td>
                    <td style="text-align: center; border-bottom: 1px solid #f1f5f9; font-size: 0.8rem; color: #64748b;">${row.stats2_rank_sim}</td>
                    <td style="text-align: center; border-bottom: 1px solid #f1f5f9; color: #1e293b;">${row.stats2_avg_wgt.toFixed(2)}</td>
                    <td style="text-align: center; border-bottom: 1px solid #f1f5f9; font-size: 0.8rem; color: #64748b;">${row.stats2_rank_wgt}</td>
                    <td style="text-align: center; font-weight: 700; color: #1d4ed8; border-bottom: 1px solid #f1f5f9;">${row.stats2_gpa.toFixed(2)}</td>
                    <td style="text-align: center; border-bottom: 1px solid #f1f5f9; font-size: 0.8rem; color: #64748b;">${row.stats2_rank_gpa}</td>
                </tr>
            `;
        });

        html += `</tbody></table></div></div>
            <div style="margin-top: 1rem; text-align: right; color: #64748b; font-size: 0.75rem;">
                ※ 統計1は ${targetYear}年・${testKey} の集計。統計2は累積。<br>
                ※ GPA = S:4, A:3, B:2, C:1, D/F:0
            </div>`;
        container.innerHTML = html;
        updatePrintHeader();
    }, 10);
}

function exportClassStatsCsv() {
    const yearEl = document.getElementById('classStatsYear');
    const testEl = document.getElementById('classStatsTest');
    const targetYear = yearEl ? parseInt(yearEl.value) : state.currentYear;
    const testKey = testEl ? testEl.value : '学年末';

    const data = calculateClassStatsList(targetYear, testKey);
    if (data.length === 0) { alert('データなし'); return; }

    let csvContent = "\uFEFF氏名,統計1科目数,統計1平均,統計1順位,統計2単位,統計2単純平均,統計2単純順位,統計2加重平均,統計2加重順位,統計2GPA,統計2GPA順位\n";
    data.forEach(row => {
        csvContent += [
            getDisplayName(row.name), row.stats1_count, row.stats1_avg.toFixed(2), row.stats1_rank,
            row.stats2_credits, row.stats2_avg_sim.toFixed(2), row.stats2_rank_sim,
            row.stats2_avg_wgt.toFixed(2), row.stats2_rank_wgt, row.stats2_gpa.toFixed(2), row.stats2_rank_gpa
        ].join(',') + "\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ClassStats_${targetYear}年_${testKey}.csv`;
    link.click();
}

function assignRank(data, scoreKey, rankKey) {
    if (!data || data.length === 0) return;
    data.sort((a, b) => (b[scoreKey] || 0) - (a[scoreKey] || 0));
    data.forEach((row, idx) => {
        if (idx > 0 && Math.abs((row[scoreKey] || 0) - (data[idx - 1][scoreKey] || 0)) < 0.0001) {
            row[rankKey] = data[idx - 1][rankKey];
        } else {
            row[rankKey] = idx + 1;
        }
    });
}

function calculateClassStatsList(targetYear, targetTest) {
    const course = state.currentCourse;
    const students = getClassStudents(targetYear, course);

    const list = students.map(name => {
        const stats = getStudentStats(name, targetYear, targetTest);
        return {
            name,
            stats1_count: stats.stats1.count,
            stats1_avg: stats.stats1.avg,
            stats2_credits: stats.stats2.credits,
            stats2_avg_sim: stats.stats2.avg_sim,
            stats2_avg_wgt: stats.stats2.avg_wgt,
            stats2_gpa: stats.stats2.gpa,
            count_check: stats.stats2.count // for ranking filter
        };
    });

    assignRank(list, 'stats1_avg', 'stats1_rank');
    assignRank(list, 'stats2_avg_sim', 'stats2_rank_sim');
    assignRank(list, 'stats2_avg_wgt', 'stats2_rank_wgt');
    assignRank(list, 'stats2_gpa', 'stats2_rank_gpa');

    // SORTING LOGIC
    const col = state.classStatsSortCol;
    const order = state.classStatsSortOrder;

    return list.sort((a, b) => {
        let valA = a[col];
        let valB = b[col];

        // Handle case where we click Rank (Lower is better usually, but here we treat it as numeric)
        // If sorting by name
        if (col === 'name') {
            return order === 'asc' ? valA.localeCompare(valB, 'ja') : valB.localeCompare(valA, 'ja');
        }

        // Numeric Sort
        valA = valA || 0;
        valB = valB || 0;
        if (order === 'asc') return valA - valB;
        return valB - valA;
    });
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
    const attWrapper = document.getElementById('atRiskAttendanceWrapper');
    const instrTest = document.getElementById('instr-test');
    const instrYear = document.getElementById('instr-year_avg');
    const instrAttAbs = document.getElementById('instr-attendance_abs');
    const instrAttLat = document.getElementById('instr-attendance_lat');
    const instrAttPat = document.getElementById('instr-attendance_pattern');

    if (testWrapper) testWrapper.style.display = (type === 'test') ? 'flex' : 'none';
    if (attWrapper) attWrapper.style.display = 'none'; // Replaced by fixed precision logic

    if (instrTest) instrTest.classList.toggle('hidden', type !== 'test');
    if (instrYear) instrYear.classList.toggle('hidden', type !== 'year_avg');
    if (instrAttAbs) instrAttAbs.classList.toggle('hidden', type !== 'attendance_abs');
    if (instrAttLat) instrAttLat.classList.toggle('hidden', type !== 'attendance_lat');
    if (instrAttPat) instrAttPat.classList.toggle('hidden', type !== 'attendance_pattern');
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
    try {
        const typeSelect = document.getElementById('atRiskTypeSelect');
        const yearSelect = document.getElementById('atRiskYearSelect');
        const testSelect = document.getElementById('atRiskTestSelect');
        if (!typeSelect || !yearSelect || !testSelect) {
            console.error('At Risk UI elements not found');
            return;
        }

        const type = typeSelect.value;
        const year = yearSelect.value;
        const test = testSelect.value;
        const reportArea = document.getElementById('atRiskReportArea');
        if (!reportArea) return;

        // Defensive check for state structure
        const allStudents = getRegisteredStudents();
        if (!state.subjects || allStudents.length === 0) {
            reportArea.innerHTML = '<div style="color:red; padding:1rem;">データが読み込まれていません。</div>';
            return;
        }

        const yearSubjects = state.subjects.filter(s => s.year == year && !s.exclude);
        const results = [];

        // Attendance limits from UI
        const absLimitTotal = parseInt(document.getElementById('atRiskAbsLimit')?.value || 10);
        const latLimitTotal = parseInt(document.getElementById('atRiskLatLimit')?.value || 15);

        // Limit to students of current year/course for better precision
        const classStudents = getClassStudents(year, state.currentCourse, allStudents);

        classStudents.forEach(studentName => {
            try {
                if (type === 'attendance_abs' || type === 'attendance_lat' || type === 'attendance_pattern') {
                    // --- NEW PRECISION ATTENDANCE MODE (3-WAY SPLIT) ---
                    const attObj = state.attendance || {};
                    const records = attObj.records || {};
                    const studentAttendance = records[studentName] || {};
                    const datesSorted = Object.keys(studentAttendance).sort((a, b) => new Date(a) - new Date(b));

                    const subStats = {}; // subj -> { abs, lat, total }
                    const dowStats = {}; // dow -> { abs, lat }
                    const periodStats = {}; // period -> { abs, lat, total }
                    let totalAbs = 0, totalLat = 0, totalSessions = 0;

                    // 1. Consecutive Check (Bad days vs Late days)
                    let maxStreak = 0, currentStreak = 0;
                    let streakStart = null, maxStreakRange = { start: "", end: "" };

                    let maxLatStreak = 0, currentLatStreak = 0;
                    let latStreakStart = null, maxLatStreakRange = { start: "", end: "" };

                    datesSorted.forEach(dStr => {
                        const dayEvents = studentAttendance[dStr] || [];
                        const isBadDay = dayEvents.some(ev => ev.status === "欠" || ev.status === "遅");
                        const isLateDay = dayEvents.some(ev => ev.status === "遅");

                        if (isBadDay) {
                            if (currentStreak === 0) streakStart = dStr;
                            currentStreak++;
                            if (currentStreak >= maxStreak) {
                                maxStreak = currentStreak;
                                maxStreakRange = { start: streakStart, end: dStr };
                            }
                        } else {
                            currentStreak = 0;
                        }

                        if (isLateDay) {
                            if (currentLatStreak === 0) latStreakStart = dStr;
                            currentLatStreak++;
                            if (currentLatStreak >= maxLatStreak) {
                                maxLatStreak = currentLatStreak;
                                maxLatStreakRange = { start: latStreakStart, end: dStr };
                            }
                        } else {
                            currentLatStreak = 0;
                        }

                        dayEvents.forEach(ev => {
                            if (!ev.subj) return;
                            totalSessions++;
                            if (!subStats[ev.subj]) subStats[ev.subj] = { abs: 0, lat: 0, total: 0 };
                            subStats[ev.subj].total++;

                            if (ev.status === "欠") { subStats[ev.subj].abs++; totalAbs++; }
                            else if (ev.status === "遅") { subStats[ev.subj].lat++; totalLat++; }

                            const pKey = ev.p || "?";
                            if (!periodStats[pKey]) periodStats[pKey] = { abs: 0, lat: 0, total: 0 };
                            periodStats[pKey].total++;
                            if (ev.status === "欠") periodStats[pKey].abs++;
                            else if (ev.status === "遅") periodStats[pKey].lat++;

                            const di = new Date(dStr).getDay();
                            const dl = ["日", "月", "火", "水", "木", "金", "土"][di];
                            if (!dowStats[dl]) dowStats[dl] = { abs: 0, lat: 0, total: 0 };
                            dowStats[dl].total++;
                            if (ev.status === "欠") dowStats[dl].abs++;
                            else if (ev.status === "遅") dowStats[dl].lat++;
                        });
                    });

                    const reasons = [];

                    if (type === 'attendance_pattern') {
                        // Filter 1: Consecutive Abs (3:Yellow, 5:Orange, 7:Red, 8+:Black)
                        if (maxStreak >= 3) {
                            let level = 'yellow';
                            if (maxStreak >= 8) level = 'black';
                            else if (maxStreak >= 7) level = 'red';
                            else if (maxStreak >= 5) level = 'orange';
                            reasons.push({ type: 'consecutive', value: maxStreak, level, range: maxStreakRange });
                        }
                        // Filter 3: Day of Week Pattern (3+ points)
                        Object.entries(dowStats).forEach(([dow, s]) => {
                            const points = s.abs + s.lat * 0.5;
                            if (points >= 3) {
                                reasons.push({ type: 'dow', day: dow, value: points, total: s.total, level: 'yellow' });
                            }
                        });
                    }

                    if (type === 'attendance_lat') {
                        // Simple high-count thresholds for "incidental" lateness
                        Object.entries(subStats).forEach(([subj, s]) => {
                            if (s.lat >= 2) {
                                let level = 'yellow';
                                if (s.lat >= 4) level = 'red';
                                else if (s.lat >= 3) level = 'orange';
                                reasons.push({ type: 'subject_lat', subject: subj, value: s.lat, level });
                            }
                        });
                        // Day of Week Pattern (Pure Lateness)
                        Object.entries(dowStats).forEach(([dow, s]) => {
                            if (s.lat >= 3) {
                                reasons.push({ type: 'dow_lat', day: dow, value: s.lat, level: 'yellow' });
                            }
                        });
                        // Relaxed: Cumulative Late Count
                        if (totalLat >= 5) {
                            let level = 'yellow';
                            if (totalLat >= 10) level = 'orange';
                            reasons.push({ type: 'total_lat_count', value: totalLat, level });
                        }
                    }

                    if (type === 'attendance_abs') {
                        // Filter 2: Subject Density (3/6:Yellow, 4/6:Orange, 5/6:Red, 6/6:Black)
                        Object.entries(subStats).forEach(([subj, s]) => {
                            const points = s.abs + s.lat * 0.5;
                            const ratio = s.total > 0 ? points / s.total : 0;
                            // Threshold: 10 points (2 lates = 1 abs) in a typical 15-week course is ~30%
                            // But here we use ratio. Let's adjust ratio thresholds if needed, 
                            // or use absolute points. The user specifically asked for "10 points".
                            if (points >= 10) {
                                let level = 'yellow';
                                if (ratio >= 1 / 3) level = 'black'; // 33.33%
                                else if (ratio >= 0.30) level = 'red';
                                else if (ratio >= 0.20) level = 'orange';
                                reasons.push({ type: 'subject', subject: subj, value: points, total: s.total, level, ratioStr: `${(ratio * 100).toFixed(0)}%` });
                            }
                        });
                        // Filter 4: Period Density
                        Object.entries(periodStats).forEach(([p, s]) => {
                            const points = s.abs + s.lat * 0.5;
                            const ratio = s.total > 0 ? points / s.total : 0;
                            if (ratio >= 0.10) {
                                let level = 'yellow';
                                if (ratio >= 1 / 3) level = 'black';
                                else if (ratio >= 0.30) level = 'red';
                                else if (ratio >= 0.20) level = 'orange';
                                reasons.push({ type: 'period', period: p, value: points, total: s.total, level, ratioStr: `${(ratio * 100).toFixed(0)}%` });
                            }
                        });
                        // Filter 5: Cumulative Density
                        const totalPoints = totalAbs + totalLat * 0.5;
                        const totalRatio = totalSessions > 0 ? totalPoints / totalSessions : 0;
                        if (totalRatio >= 0.10) {
                            let level = 'yellow';
                            if (totalRatio >= 1 / 3) level = 'black';
                            else if (totalRatio >= 0.30) level = 'red';
                            else if (totalRatio >= 0.20) level = 'orange';
                            reasons.push({ type: 'total', value: totalPoints, total: totalSessions, level });
                        }
                    }

                    if (reasons.length > 0) {
                        results.push({
                            name: studentName,
                            type: 'attendance_new',
                            reasons: reasons,
                            totalAbs, totalLat
                        });
                    }
                } else {
                    // --- GRADE MODE (test or year_avg) ---
                    let count59 = 0, count49 = 0, count39 = 0;
                    const lowScores = [];

                    yearSubjects.forEach(sub => {
                        let scoreValue = NaN;
                        if (type === 'test') {
                            scoreValue = parseFloat(getScore(studentName, sub.name, test));
                        } else {
                            const tests = ["前期中間", "前期末", "後期中間", "学年末"];
                            let sum = 0, count = 0;
                            tests.forEach(t => {
                                const s = parseFloat(getScore(studentName, sub.name, t));
                                if (!isNaN(s)) { sum += s; count++; }
                            });
                            if (count > 0) scoreValue = sum / count;
                        }

                        if (!isNaN(scoreValue) && scoreValue <= 59.9) {
                            count59++;
                            if (scoreValue <= 49.9) count49++;
                            if (scoreValue <= 39.9) count39++;
                            lowScores.push({ name: sub.name, score: scoreValue });
                        }
                    });

                    // Restore original conditions for grades
                    let isAtRisk = (type === 'test')
                        ? (count59 >= 4 || count49 >= 3 || count39 >= 2)
                        : (count59 >= 3 || count49 >= 2 || count39 >= 1);

                    if (isAtRisk) {
                        const reasons = [];
                        if (type === 'test') {
                            if (count59 >= 4) reasons.push(`60点未満 × ${count59}`);
                            if (count49 >= 3) reasons.push(`50点未満 × ${count49}`);
                            if (count39 >= 2) reasons.push(`40点未満 × ${count39}`);
                        } else {
                            if (count59 >= 3) reasons.push(`平均60点未満 × ${count59}`);
                            if (count49 >= 2) reasons.push(`平均50点未満 × ${count49}`);
                            if (count39 >= 1) reasons.push(`平均40点未満 × ${count39}`);
                        }
                        results.push({
                            name: studentName,
                            type: 'grade',
                            reasons: reasons,
                            lowScores: lowScores.sort((a, b) => a.score - b.score)
                        });
                    }
                }
            } catch (studentErr) {
                console.warn(`Error processing student ${studentName}:`, studentErr);
            }
        });

        if (results.length === 0) {
            reportArea.innerHTML = `<div style="text-align: center; padding: 3rem; color: #10b981; font-weight: bold; background: #f0fdf4; border-radius: 0.5rem; border: 1px solid #bbf7d0;">
                該当する要注意学生は見つかりませんでした。
            </div>`;
            return;
        }

        let html = `
            <div style="margin-bottom: 1rem; font-weight: bold; color: #ef4444; font-size: 1.1rem; display: flex; justify-content: space-between; align-items: center;">
                <span>抽出結果: ${results.length} 名</span>
                <span style="font-size:0.8rem; color:#64748b; font-weight:normal;">対象学年: ${year}年 / 判定基準: ${type === 'attendance' ? '出欠状況' : (type === 'test' ? test : '科目別通年平均')}</span>
            </div>
            <div class="table-container">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: #fee2e2;">
                            <th style="padding: 10px; text-align: left; width: 160px;">氏名</th>
                            <th style="padding: 10px; text-align: left; width: 220px;">抽出理由 (アラート)</th>
                            <th style="padding: 10px; text-align: left;">詳細情報</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        results.forEach(res => {
            let detailHtml = '';
            let reasonHtml = '';
            if (res.type === 'attendance_new') {
                reasonHtml = '<span style="color:#ef4444; font-weight:bold;">?? 出欠注意</span>';
                detailHtml = `<div style="display:flex; flex-wrap:wrap; gap:0.4rem;">`;
                res.reasons.forEach(r => {
                    let bg = '#fde047', tc = '#854d0e', border = '#eab308', label = '';
                    if (r.level === 'black') { bg = '#000'; tc = '#fff'; border = '#000'; }
                    else if (r.level === 'red') { bg = '#ef4444'; tc = '#fff'; border = '#b91c1c'; }
                    else if (r.level === 'orange') { bg = '#fb923c'; tc = '#fff'; border = '#ea580c'; }

                    const formatDate = (s) => s ? s.split('/').slice(1).join('/') : '';
                    if (r.type === 'consecutive') {
                        label = `連続${r.value}日 (${formatDate(r.range.start)}~${formatDate(r.range.end)})`;
                    }
                    else if (r.type === 'consecutive_lat') {
                        label = `連続遅刻${r.value}日 (${formatDate(r.range.start)}~${formatDate(r.range.end)})`;
                    }
                    else if (r.type === 'subject') label = `${r.subject}: 欠席率 ${r.ratioStr}`;
                    else if (r.type === 'subject_lat') label = `${r.subject}: 遅刻${r.value}回`;
                    else if (r.type === 'period') label = `${r.period}限: 欠席率 ${r.ratioStr}`;
                    else if (r.type === 'dow') label = `${r.day}曜日: 欠席率 ${(r.value / r.total * 100).toFixed(0)}%`; // Need total
                    else if (r.type === 'dow_lat') label = `${r.day}曜日に遅刻集中(${r.value}回)`;
                    else if (r.type === 'total') label = `累積欠席率: ${(r.value / r.total * 100).toFixed(1)}%`;
                    else if (r.type === 'total_lat_count') label = `累計遅刻:${r.value}回`;

                    detailHtml += `<span style="background:${bg}; color:${tc}; padding:2px 10px; border-radius:999px; font-size:0.8rem; font-weight:600; border:1px solid ${border};">${label}</span>`;
                });
                detailHtml += `</div>`;
            } else if (res.type === 'attendance') {
                // Legacy fallback (should rarely be used now)
                reasonHtml = '<span style="color:#ef4444; font-weight:bold;">?? 出席不良</span>';
                detailHtml = `<div style="display:flex; flex-wrap:wrap; gap:0.4rem;">
                    <div style="width:100%; font-size:0.8rem; color:#64748b; margin-bottom:0.2rem;">累計: 欠${res.totalAbs}・遅${res.totalLat}</div>
                    ${res.reasons.map(r => {
                    if (typeof r === 'string') return `<span style="background:#fee2e2; color:#b91c1c; padding:2px 10px; border-radius:999px; font-size:0.8rem; font-weight:600; border:1px solid #fecaca;">${r}</span>`;
                    return `<span style="background:#fee2e2; color:#b91c1c; padding:2px 10px; border-radius:999px; font-size:0.8rem; font-weight:600; border:1px solid #fecaca;">${r.subject}:${r.count.toFixed(1)}回</span>`;
                }).join('')}
                </div>`;
            } else {
                reasonHtml = res.reasons.join('<br>');
                detailHtml = `
                    <div style="display: flex; flex-wrap: wrap; gap: 5px;">
                        ${res.lowScores.map(s => {
                    const color = s.score < 40 ? 'background:#450a0a; color:#fff;' : 'background:#fff1f2; color:#b91c1c; border:1px solid #fca5a5;';
                    return `<span style="padding: 2px 8px; border-radius: 4px; font-size: 0.8rem; ${color}">${s.name}: ${Math.round(s.score)}点</span>`;
                }).join('')}
                    </div>
                `;
            }

            html += `
                <tr style="border-bottom: 1px solid #fecaca;">
                    <td style="padding: 12px 10px; font-weight: bold; background: #fff;">${getDisplayName(res.name)}</td>
                    <td style="padding: 12px 10px; background: #fff;">${reasonHtml}</td>
                    <td style="padding: 12px 10px; background: #fff;">${detailHtml}</td>
                </tr>
            `;
        });

        html += `</tbody></table></div>`;
        reportArea.innerHTML = html;
    } catch (globalErr) {
        console.error('renderAtRiskReport Failed:', globalErr);
        alert('抽出実行中にエラーが発生しました。コンソールを確認してください。');
    }
}

function renderMandatoryGanttChart(studentName, subjects, isPassed) {
    const categories = [
        { name: '一般必修', filter: s => s.type2 === '一般' && ['必', '必修', '必修得'].includes(s.type1) },
        { name: '専門必修', filter: s => s.type2 !== '一般' && s.type2 !== 'その他' && ['必', '必修', '必修得'].includes(s.type1) },
        { name: '特別・その他必修', filter: s => (s.type2 === 'その他' || s.name.startsWith('特・') || s.name.includes('特別活動')) && ['必', '必修', '必修得'].includes(s.type1) }
    ];
    renderGenericGanttChart('mandatoryGanttChartContainer', studentName, categories, subjects, isPassed, true);
}

function renderDPGanttChart(studentName, subjects, isPassed) {
    const dps = ['DP-A', 'DP-B', 'DP-C', 'DP-D', 'DP-E', 'SDGs'];
    const categories = dps.map(dp => ({
        name: dp,
        filter: s => {
            const type3 = (s.type3 || '').toLowerCase();
            const dpTarget = dp.toLowerCase();
            return type3.split(',').some(part => part.trim() === dpTarget);
        }
    }));
    renderGenericGanttChart('dpGanttChartContainer', studentName, categories, subjects, isPassed, false);
}

function renderGenericGanttChart(containerId, studentName, categories, subjects, isPassed, alwaysShowAll = false) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

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
    categories.forEach(cat => {
        const row = document.createElement('tr');
        row.innerHTML = `<td style="padding: 0.75rem; border: 1px solid #e2e8f0; font-weight: 700; background: #f8fafc; color: #1e293b; position: sticky; left: 0; z-index: 5;">${cat.name}</td>`;

        years.forEach(y => {
            const td = document.createElement('td');
            td.style.padding = '0.6rem';
            td.style.border = '1px solid #e2e8f0';
            td.style.verticalAlign = 'top';
            td.style.minWidth = '140px';

            const isPastOrCurrent = (y <= state.currentYear);
            td.style.background = isPastOrCurrent ? '#f1f5f9' : '#fff';

            const filtered = subjects.filter(s => {
                if (!cat.filter(s)) return false;
                let yearMatches = (s.year === y);
                if (s.year === 0) {
                    const scoreObj = (state.scores[studentName] || {})[s.name];
                    yearMatches = (scoreObj && scoreObj.obtainedYear === y);
                }
                if (!yearMatches) return false;

                // SPECIAL FILTER: For past/current years, exclude subjects with no input
                // BUT skip this filter if alwaysShowAll is true (e.g. for Mandatory chart)
                if (isPastOrCurrent && !alwaysShowAll) {
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

                    if (passed) {
                        block.style.background = '#10b981';
                        block.style.borderLeft = '4px solid #059669';
                    } else {
                        block.style.background = '#3b82f6';
                        block.style.borderLeft = '4px solid #2563eb';
                        block.style.opacity = '0.85';
                    }

                    block.textContent = `${sub.name} (${sub.credits})`;
                    block.title = `${sub.name}\n単位: ${sub.credits}\n状況: ${passed ? '修得済み' : '開講予定'}`;
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

/* ==================== SEATING ASSIGNMENT ==================== */
function initSeating() {
    // Ensure seating object exists
    if (!state.seating) {
        state.seating = {
            cols: 7,
            rows: 7,
            assignments: {},
            fixed: [],
            disabled: []
        };
    }
    // Safety check for nested properties (in case of partial load)
    if (!state.seating.assignments) state.seating.assignments = {};
    if (!state.seating.fixed) state.seating.fixed = [];
    if (!state.seating.disabled) state.seating.disabled = [];

    // Sync UI with state
    const colInput = document.getElementById('seatingCols');
    const rowInput = document.getElementById('seatingRows');
    const perspectiveInput = document.getElementById('seatingPerspective');
    const colorModeInput = document.getElementById('seatingColorMode');
    const gradeMethodInput = document.getElementById('seatingGradeMethod');
    if (colInput) colInput.value = state.seating.cols;
    if (rowInput) rowInput.value = state.seating.rows;
    if (perspectiveInput) perspectiveInput.value = state.seating.perspective || 'teacher';
    if (colorModeInput) colorModeInput.value = state.seating.colorMode || 'none';
    if (gradeMethodInput) gradeMethodInput.value = state.seating.gradeMethod || 'cumulative';

    const methodWrapper = document.getElementById('seatingGradeMethodWrapper');
    if (methodWrapper) methodWrapper.style.display = (state.seating.colorMode === 'grade') ? 'flex' : 'none';

    updateGradeMethodInfo();

    // Add Event Listeners for Presets
    const savePresetBtn = document.getElementById('savePresetBtn');
    const deletePresetBtn = document.getElementById('deletePresetBtn');
    const presetSelect = document.getElementById('seatingPresetSelect');

    if (savePresetBtn) savePresetBtn.onclick = saveSeatingPreset;
    if (deletePresetBtn) deletePresetBtn.onclick = deleteSeatingPreset;
    if (presetSelect) presetSelect.onchange = loadSeatingPreset;


    renderPresetList();
    const autoAssignBtn = document.getElementById('autoAssignBtn'); if (autoAssignBtn) autoAssignBtn.onclick = autoAssignSeating;

    renderSeatingRoster();
    renderSeatingGrid();
}

function renderSeatingRoster() {
    const list = document.getElementById('seatingRosterList');
    if (!list) return;

    // Use filtered students for current class
    const classStudents = getClassStudents(state.currentYear, state.currentCourse);

    list.innerHTML = '';

    // Safety check for assignments
    if (!state.seating) state.seating = { assignments: {} };
    if (!state.seating.assignments) state.seating.assignments = {};

    // Students currently assigned to any seat
    const assignedStudents = new Set(Object.values(state.seating.assignments));

    // Calculate seat statistics
    const totalStudents = classStudents.length;
    const assignedCount = assignedStudents.size;
    const { cols, rows, disabled } = state.seating;
    const totalSeats = cols * rows;
    const availableSeats = totalSeats - (disabled ? disabled.length : 0);

    // Update count info display
    const countInfo = document.getElementById('seatingCountInfo');
    if (countInfo) {
        const seatStatus = availableSeats >= totalStudents ?
            `<span style="color: #10b981;">? 十分</span>` :
            `<span style="color: #ef4444;">? 不足</span>`;

        countInfo.innerHTML = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.3rem;">
                <span>学生数:</span>
                <strong>${totalStudents}名</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.3rem;">
                <span>有効席数:</span>
                <strong>${availableSeats}席 ${seatStatus}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>配置済み:</span>
                <strong style="color: #3b82f6;">${assignedCount}名</strong>
            </div>
        `;
        // Sort students by roster before rendering
        const sortedRoster = sortStudentsByRoster(classStudents);

        sortedRoster.forEach(student => {
            const item = document.createElement('div');
            item.className = 'roster-item' + (assignedStudents.has(student) ? ' assigned' : '');
            item.draggable = !assignedStudents.has(student);
            item.innerHTML = `<span>${student}</span>`;

            if (!assignedStudents.has(student)) {
                item.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text/plain', student);
                    e.dataTransfer.effectAllowed = 'move';
                });
            }

            list.appendChild(item);
        });
    }
}

function renderSeatingGrid() {
    const grid = document.getElementById('seatingGrid');
    const oldDesk = document.getElementById('seatingDesk');
    if (oldDesk) oldDesk.remove();

    if (!grid) return;

    const { cols, rows, perspective } = state.seating;
    const isTeacher = perspective === 'teacher';

    // Calculate dynamic sizing based on grid size
    const totalCells = cols * rows;
    let cellSize, fontSize, labelFontSize;

    // Adjust sizes based on number of columns (most important for width)
    if (cols <= 5) {
        cellSize = '80px';
        fontSize = '0.95rem';
        labelFontSize = '0.75rem';
    } else if (cols <= 7) {
        cellSize = '70px';
        fontSize = '0.85rem';
        labelFontSize = '0.7rem';
    } else if (cols <= 10) {
        cellSize = '60px';
        fontSize = '0.75rem';
        labelFontSize = '0.65rem';
    } else if (cols <= 15) {
        cellSize = '50px';
        fontSize = '0.65rem';
        labelFontSize = '0.6rem';
    } else {
        cellSize = '40px';
        fontSize = '0.55rem';
        labelFontSize = '0.55rem';
    }

    // Set grid template with calculated size and dynamic gap
    const gap = cols > 10 ? '4px' : '8px';
    grid.style.gridTemplateColumns = `repeat(${cols}, ${cellSize})`;
    grid.style.gap = gap;

    // Store sizes as data attributes for CSS access
    grid.dataset.cellSize = cellSize;
    grid.dataset.fontSize = fontSize;
    grid.dataset.labelFontSize = labelFontSize;

    grid.innerHTML = '';

    // Create Layout Desk Element
    const desk = document.createElement('div');
    desk.className = 'teacher-desk-grid';
    desk.innerText = '教 卓 (前方)';
    desk.style.gridColumn = '1 / -1';

    // CENTER ALIGNMENT
    desk.style.justifySelf = 'center';
    desk.style.width = 'auto';
    desk.style.minWidth = '200px';

    desk.style.textAlign = 'center';
    desk.style.background = '#e2e8f0';
    desk.style.padding = '0.4rem 1.5rem';
    desk.style.borderRadius = '0.3rem';
    desk.style.fontWeight = 'bold';
    desk.style.color = '#475569';
    desk.style.fontSize = labelFontSize;
    // Visual spacing
    desk.style.marginBottom = !isTeacher ? '15px' : '0';
    desk.style.marginTop = isTeacher ? '15px' : '0';

    if (!isTeacher) {
        grid.appendChild(desk);
    }

    for (let currentR = 0; currentR < rows; currentR++) {
        for (let currentC = 0; currentC < cols; currentC++) {
            // Coordinate mapping based on perspective
            const rowIdx = isTeacher ? rows - 1 - currentR : currentR;
            const colIdx = isTeacher ? cols - 1 - currentC : currentC;

            const pos = `${rowIdx}-${colIdx}`;
            const student = state.seating.assignments[pos];
            const isFixed = state.seating.fixed.includes(pos);
            const isDisabled = state.seating.disabled.includes(pos);
            const label = String.fromCharCode(65 + colIdx) + (rowIdx + 1);

            const cell = document.createElement('div');
            cell.className = 'seat-item' +
                (student ? '' : ' empty') +
                (isFixed ? ' fixed' : '') +
                (isDisabled ? ' disabled' : '');
            cell.dataset.pos = pos;

            // Look for attendance number in metadata
            let attendanceNo = '';
            if (student && state.studentMetadata && state.studentMetadata[student]) {
                const meta = state.studentMetadata[student];
                attendanceNo = meta['出席番号'] || meta['番号'] || meta['No.'] || meta['No'] || '';
            }

            // Display base labels and name
            cell.innerHTML = `
                <div class="seat-label" style="font-size: ${labelFontSize};">${label}</div>
                ${attendanceNo ? `<div class="attendance-no" style="position: absolute; top: 2px; right: 4px; font-size: ${labelFontSize}; color: #64748b; font-weight: bold;">${attendanceNo}</div>` : ''}
                <div class="student-name" style="font-size: ${fontSize};">${student || ''}</div>
            `;

            // Calculate color coding
            let r_col, g_col, b_col, displayVal = '';
            let hasColor = false;
            const colorMode = state.seating.colorMode || 'none';

            if (student && colorMode === 'grade') {
                const avg = getStudentAverage(student);
                if (avg !== null) {
                    hasColor = true;
                    displayVal = avg.toFixed(1);
                    if (avg < 50) { r_col = 255; g_col = 100; b_col = 100; }
                    else if (avg < 75) {
                        const p = (avg - 50) / 25;
                        r_col = 255; g_col = Math.round(100 + (155 * p)); b_col = Math.round(100 * (1 - p));
                    } else {
                        const p = (avg - 75) / 25;
                        r_col = Math.round(255 * (1 - p)); g_col = 255; b_col = 0;
                    }
                }
            } else if (student && colorMode === 'attendance') {
                const attendance = state.attendance.records[student] || {};
                let totalAbs = 0, totalLat = 0;
                Object.values(attendance).forEach(dayEvents => {
                    dayEvents.forEach(ev => {
                        if (ev.status === "欠") totalAbs++;
                        else if (ev.status === "遅") totalLat++;
                    });
                });

                if (totalAbs > 0 || totalLat > 0) {
                    hasColor = true;
                    // Milestones: 5(Yellow), 10(Orange), 15(Red), 20(Black)
                    const score = totalAbs + (totalLat * 0.5);
                    displayVal = `欠${totalAbs}・遅${totalLat} (${score.toFixed(1)}pt)`;

                    // RGB Values for milestones
                    const m = [
                        { p: 0, r: 255, g: 255, b: 255 }, // White
                        { p: 10, r: 253, g: 224, b: 71 }, // Yellow (fde047) - Milestone 1: 10pt
                        { p: 15, r: 251, g: 146, b: 60 }, // Orange (fb923c)
                        { p: 20, r: 239, g: 68, b: 68 },  // Red (ef4444)
                        { p: 25, r: 0, g: 0, b: 0 }       // Black
                    ];

                    let r, g, b;
                    if (score <= m[0].p) {
                        hasColor = false;
                    } else if (score >= m[m.length - 1].p) {
                        r = m[m.length - 1].r; g = m[m.length - 1].g; b = m[m.length - 1].b;
                    } else {
                        for (let i = 0; i < m.length - 1; i++) {
                            if (score >= m[i].p && score < m[i + 1].p) {
                                const ratio = (score - m[i].p) / (m[i + 1].p - m[i].p);
                                r = Math.round(m[i].r + (m[i + 1].r - m[i].r) * ratio);
                                g = Math.round(m[i].g + (m[i + 1].g - m[i].g) * ratio);
                                b = Math.round(m[i].b + (m[i + 1].b - m[i].b) * ratio);
                                break;
                            }
                        }
                    }
                    r_col = r; g_col = g; b_col = b;
                }
            }

            if (hasColor) {
                cell.style.background = `rgba(${r_col}, ${g_col}, ${b_col}, 0.2)`;
                cell.style.borderColor = `rgba(${r_col}, ${g_col}, ${b_col}, 0.6)`;

                // Adjust text color for dark backgrounds
                const brightness = (r_col * 299 + g_col * 587 + b_col * 114) / 1000;
                if (brightness < 100) {
                    cell.querySelector('.student-name').style.color = '#fff';
                    cell.querySelector('.seat-label').style.color = 'rgba(255,255,255,0.7)';
                    if (cell.querySelector('.attendance-no')) cell.querySelector('.attendance-no').style.color = 'rgba(255,255,255,0.9)';
                }

                const badge = document.createElement('div');
                badge.className = 'no-print';
                badge.style.cssText = `
                    position: absolute; bottom: 2px; right: 4px;
                    font-size: 0.65rem; font-weight: 700;
                    color: ${brightness < 128 ? '#fff' : '#000'};
                    text-shadow: ${brightness >= 128 ? 'none' : '0 0 2px #000'};
                `;
                badge.textContent = displayVal;
                cell.appendChild(badge);
            }

            // Drag & Drop events
            cell.addEventListener('dragover', (e) => {
                if (isDisabled || isFixed) return;
                e.preventDefault();
                cell.classList.add('drag-over');
            });

            cell.addEventListener('dragleave', () => {
                cell.classList.remove('drag-over');
            });

            cell.addEventListener('drop', (e) => {
                if (isDisabled || isFixed) return;
                e.preventDefault();
                cell.classList.remove('drag-over');
                const studentName = e.dataTransfer.getData('text/plain');
                const sourcePos = e.dataTransfer.getData('source-pos');
                if (studentName) {
                    assignStudentToSeat(studentName, pos, sourcePos);
                }
            });

            // Right click menu for fixed/disabled
            cell.addEventListener('contextmenu', (e) => {
                showSeatContextMenu(e, pos); // Correct function name
            });
            // Mobile Long Press Support
            addLongPressTrigger(cell);

            // Allow dragging student OUT of seat
            if (student && !isFixed) {
                cell.draggable = true;
                cell.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text/plain', student);
                    e.dataTransfer.setData('source-pos', pos);
                });
            }

            grid.appendChild(cell);
        }
    }

    // Teacher View: Desk is at BOTTOM
    if (isTeacher) {
        grid.appendChild(desk);
    }
}

function assignStudentToSeat(studentName, targetPos, sourcePos) {
    if (sourcePos === targetPos) return;

    const existingStudentAtTarget = state.seating.assignments[targetPos];

    if (sourcePos) {
        // Seat to Seat swap
        state.seating.assignments[sourcePos] = existingStudentAtTarget;
        state.seating.assignments[targetPos] = studentName;

        // If swapping move a student to an empty seat, clean up
        if (!state.seating.assignments[sourcePos]) {
            delete state.seating.assignments[sourcePos];
        }
    } else {
        // Roster to Seat
        // Note: Roster item only draggable if not assigned, but safety check:
        for (let k in state.seating.assignments) {
            if (state.seating.assignments[k] === studentName) {
                delete state.seating.assignments[k];
            }
        }
        state.seating.assignments[targetPos] = studentName;
    }

    saveSessionState();
    renderSeatingRoster();
    renderSeatingGrid();
}



function toggleFixed(pos) {
    const idx = state.seating.fixed.indexOf(pos);
    if (idx > -1) {
        state.seating.fixed.splice(idx, 1);
    } else {
        state.seating.fixed.push(pos);
    }
    saveSessionState();
    renderSeatingGrid();
}

function toggleDisabled(pos) {
    const idx = state.seating.disabled.indexOf(pos);
    if (idx > -1) {
        state.seating.disabled.splice(idx, 1);
    } else {
        state.seating.disabled.push(pos);
    }
    saveSessionState();
    renderSeatingGrid();
}

function unassignSeat(pos) {
    delete state.seating.assignments[pos];
    // Also unfix if it was fixed
    const idx = state.seating.fixed.indexOf(pos);
    if (idx > -1) state.seating.fixed.splice(idx, 1);

    saveSessionState();
    renderSeatingRoster();
    renderSeatingGrid();
}

function randomAssignSeats() {
    // 1. Get available seats (enabled and not fixed)
    const availableSeats = [];
    const { cols, rows } = state.seating;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const pos = `${r}-${c}`;
            if (!state.seating.disabled.includes(pos) && !state.seating.fixed.includes(pos)) {
                availableSeats.push(pos);
            }
        }
    }

    // 2. Get students to assign (those not in fixed seats)
    const fixedStudents = new Set();
    state.seating.fixed.forEach(pos => {
        if (state.seating.assignments[pos]) {
            fixedStudents.add(state.seating.assignments[pos]);
        }
    });

    const studentsToAssign = state.students.filter(s => !fixedStudents.has(s));

    if (availableSeats.length < studentsToAssign.length) {
        alert('有効な座席数が足りません。列または行を増やしてください。');
        return;
    }

    // Shuffle students to assign
    const shuffledStudents = [...studentsToAssign];
    for (let i = shuffledStudents.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledStudents[i], shuffledStudents[j]] = [shuffledStudents[j], shuffledStudents[i]];
    }

    // Clear non-fixed assignments
    for (let pos in state.seating.assignments) {
        if (!state.seating.fixed.includes(pos)) {
            delete state.seating.assignments[pos];
        }
    }

    // Assign students to available seats (sequential in shuffled list)
    shuffledStudents.forEach((student, i) => {
        state.seating.assignments[availableSeats[i]] = student;
    });

    saveSessionState();
    renderSeatingRoster();
    renderSeatingGrid();
}

function clearSeatingAssignments() {
    if (!confirm('すべての配置（固定以外）をクリアしますか？')) return;
    for (let pos in state.seating.assignments) {
        if (!state.seating.fixed.includes(pos)) {
            delete state.seating.assignments[pos];
        }
    }
    saveSessionState();
    renderSeatingRoster();
    renderSeatingGrid();
}

function saveSeatingLayout() {
    const data = {
        cols: state.seating.cols,
        rows: state.seating.rows,
        assignments: state.seating.assignments,
        fixed: state.seating.fixed,
        disabled: state.seating.disabled,
        perspective: state.seating.perspective,
        timestamp: new Date().toISOString()
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seating_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function loadSeatingLayout() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        readFileText(file).then(text => {
            try {
                const data = JSON.parse(text);

                // Validate data
                if (!data.cols || !data.rows || !data.assignments) {
                    alert('無効なファイル形式です。');
                    return;
                }

                // Apply loaded data
                state.seating.cols = data.cols;
                state.seating.rows = data.rows;
                state.seating.assignments = data.assignments || {};
                state.seating.fixed = data.fixed || [];
                state.seating.disabled = data.disabled || [];
                state.seating.perspective = data.perspective || 'teacher';

                // Update UI
                document.getElementById('seatingCols').value = data.cols;
                document.getElementById('seatingRows').value = data.rows;
                document.getElementById('seatingPerspective').value = data.perspective || 'teacher';

                saveSessionState();
                renderSeatingRoster();
                renderSeatingGrid();

                alert('座席配置を読み込みました。');
            } catch (err) {
                alert('ファイルの読み込みに失敗しました: ' + err.message);
            }
        }).catch(err => {
            alert('ファイルの読み込みに失敗しました: ' + err.message);
        });
    };
    input.click();
}

function updateGradeMethodInfo() {
    const infoDiv = document.getElementById('seatingGradeMethodInfo');
    if (!infoDiv) return;

    const method = state.seating.gradeMethod || 'cumulative';

    if (method === 'latest') {
        const targetYear = state.currentYear || 5;
        let latestTest = null;

        // Find latest test with data for the target year
        for (let i = SCORE_KEYS.length - 1; i >= 0; i--) {
            const testKey = SCORE_KEYS[i];

            // Check if any student has data for this test in the target year
            // Optimization: check first few students
            const subjects = state.subjects.filter(sub => sub.year === targetYear && !sub.exclude);
            if (subjects.length > 0) {
                const hasData = state.students.some(student => {
                    return subjects.some(sub => {
                        const val = getScore(student, sub.name, testKey);
                        return val !== undefined && val !== null && val !== '';
                    });
                });

                if (hasData) {
                    latestTest = testKey;
                    break;
                }
            }
        }

        if (latestTest) {
            infoDiv.textContent = `（${targetYear}年 ${latestTest}を使用）`;
        } else {
            const lastKey = SCORE_KEYS[SCORE_KEYS.length - 1];
            infoDiv.textContent = `（${targetYear}年 ${lastKey}を使用）`;
        }
    } else {
        infoDiv.textContent = '';
    }
}

function renderPresetList() {
    const select = document.getElementById('seatingPresetSelect');
    if (!select) return;

    // Save current selection if possible
    const currentVal = select.value;

    select.innerHTML = '<option value="">-- 選択 --</option>';

    // Ensure it's an array
    if (!Array.isArray(state.seatingPresets)) {
        state.seatingPresets = [];
    }

    // Separate presets into two groups
    const layoutOnly = [];
    const withStudents = [];

    state.seatingPresets.forEach((preset, index) => {
        const hasAssignments = preset.assignments && Object.keys(preset.assignments).length > 0;
        if (hasAssignments) {
            withStudents.push({ preset, index });
        } else {
            layoutOnly.push({ preset, index });
        }
    });

    // Create optgroup for layout-only presets
    if (layoutOnly.length > 0) {
        const layoutGroup = document.createElement('optgroup');
        layoutGroup.label = '席配置のみ';
        layoutOnly.forEach(({ preset, index }) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = preset.name;
            layoutGroup.appendChild(option);
        });
        select.appendChild(layoutGroup);
    }

    // Create optgroup for presets with student assignments
    if (withStudents.length > 0) {
        const studentsGroup = document.createElement('optgroup');
        studentsGroup.label = '学生配置あり';
        withStudents.forEach(({ preset, index }) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = preset.name;
            studentsGroup.appendChild(option);
        });
        select.appendChild(studentsGroup);
    }

    // Restore selection if index still exists
    if (currentVal && state.seatingPresets[currentVal]) {
        select.value = currentVal;
    }
}


function saveSeatingPreset() {
    const name = prompt('保存するプリセット名を入力してください:', 'レイアウト ' + (state.seatingPresets.length + 1));
    if (!name) return;

    // Save current layout configuration (only structure, not students)
    const preset = {
        name: name,
        cols: state.seating.cols,
        rows: state.seating.rows,
        disabled: [...(state.seating.disabled || [])],
        assignments: { ...state.seating.assignments }, // Save student positions
        fixed: [...(state.seating.fixed || [])],       // Save fixed seats
        timestamp: new Date().toISOString()
    };

    state.seatingPresets.push(preset);
    savePresetsOnly(); // Isolated Save
    saveSessionState();
    renderPresetList();
    const autoAssignBtn = document.getElementById('autoAssignBtn'); if (autoAssignBtn) autoAssignBtn.onclick = autoAssignSeating;


    // Select the new preset
    const select = document.getElementById('seatingPresetSelect');
    if (select) select.value = state.seatingPresets.length - 1;

    alert('プリセット「' + name + '」を保存しました。');
}


function loadSeatingPreset(e) {
    const index = e.target.value;
    if (index === '') return;

    const preset = state.seatingPresets[index];
    if (!preset) return;

    // Confirm if layout is different and assignments exist
    if (Object.keys(state.seating.assignments).length > 0 &&
        (state.seating.cols !== preset.cols || state.seating.rows !== preset.rows)) {
        if (!confirm('座席のサイズが変更されます。配置済みの学生がリセットされる可能性がありますがよろしいですか？')) {
            e.target.value = ''; // Reset selection
            return;
        }
    }

    state.seating.cols = preset.cols;
    state.seating.rows = preset.rows;
    state.seating.disabled = [...(preset.disabled || [])];
    state.seating.assignments = { ...(preset.assignments || {}) }; // Restore assignments
    state.seating.fixed = [...(preset.fixed || [])];               // Restore fixed

    // Update UI inputs
    document.getElementById('seatingCols').value = preset.cols;
    document.getElementById('seatingRows').value = preset.rows;

    saveSessionState();
    renderSeatingRoster(); // Update roster list to show checked statuses
    renderSeatingGrid();
}


function deleteSeatingPreset() {
    const select = document.getElementById('seatingPresetSelect');
    if (!select || select.value === '') {
        alert('削除するプリセットを選択してください。');
        return;
    }

    const index = parseInt(select.value);
    const preset = state.seatingPresets[index];

    if (confirm('プリセット「' + preset.name + '」を削除しますか？')) {
        state.seatingPresets.splice(index, 1);
        saveSessionState();
        renderPresetList();
        const autoAssignBtn = document.getElementById('autoAssignBtn'); if (autoAssignBtn) autoAssignBtn.onclick = autoAssignSeating;

    }
}


function getStudentAverage(student) {
    if (!student || !state.scores[student]) return 0;

    const method = state.seating.gradeMethod || 'cumulative';
    let avg = 0;

    if (method === 'latest') {
        const targetYear = state.currentYear || 5;
        let latestScores = [];

        for (let i = SCORE_KEYS.length - 1; i >= 0; i--) {
            const testKey = SCORE_KEYS[i];
            const subjects = state.subjects.filter(sub => sub.year === targetYear && !sub.exclude);
            const testScores = [];

            subjects.forEach(sub => {
                const val = getScore(student, sub.name, testKey);
                if (val !== undefined && val !== null && val !== '' && !isNaN(parseFloat(val))) {
                    testScores.push(parseFloat(val));
                }
            });

            if (testScores.length > 0) {
                latestScores = testScores;
                break;
            }
        }

        if (latestScores.length > 0) {
            avg = latestScores.reduce((a, b) => a + b, 0) / latestScores.length;
        }
    } else {
        // Cumulative
        const scoreData = state.scores[student];
        const allScores = [];
        Object.values(scoreData).forEach(subjectScores => {
            if (typeof subjectScores === 'object') {
                SCORE_KEYS.forEach(key => {
                    const val = subjectScores[key];
                    if (val !== undefined && val !== null && val !== '' && !isNaN(parseFloat(val))) {
                        allScores.push(parseFloat(val));
                    }
                });
            }
        });
        if (allScores.length > 0) {
            avg = allScores.reduce((a, b) => a + b, 0) / allScores.length;
        }
    }
    return avg;
}

function autoAssignSeating() {
    try {
        const methodSelect = document.getElementById('seatingAssignMethod');
        if (!methodSelect) return;
        const method = methodSelect.value;
        if (!method) return;

        // Preserve assignments for fixed seats
        const fixedStudents = new Set();
        const currentAssignments = state.seating.assignments || {};
        const newAssignments = {};

        if (state.seating.fixed) {
            state.seating.fixed.forEach(pos => {
                if (currentAssignments[pos]) {
                    newAssignments[pos] = currentAssignments[pos];
                    fixedStudents.add(currentAssignments[pos]);
                }
            });
        }

        // Set assignments to only the fixed ones (effectively clearing non-fixed)
        state.seating.assignments = newAssignments;

        // Determine available seats (excluding disabled AND fixed)
        // Order: Top-Left (Teacher's Right-Front) origin

        const seats = [];
        const rows = state.seating.rows;
        const cols = state.seating.cols;

        const isExcluded = (pos) => {
            return (state.seating.disabled && state.seating.disabled.includes(pos)) || (state.seating.fixed && state.seating.fixed.includes(pos));
        };

        if (method === 'roster_v') {
            // Vertical from Screen Left (Student Right)
            for (let c = 0; c < cols; c++) {
                for (let r = 0; r < rows; r++) {
                    const pos = r + '-' + c;
                    if (!isExcluded(pos)) {
                        seats.push(pos);
                    }
                }
            }
        } else {
            // Horizontal (Screen Left -> Right, Top -> Bottom)
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const pos = r + '-' + c;
                    if (!isExcluded(pos)) {
                        seats.push(pos);
                    }
                }
            }
        }

        // Prepare students list (Exclude fixed students)
        // Ensure its sorted by roster initially
        let studentsToAssign = sortStudentsByRoster(state.students).filter(s => !fixedStudents.has(s));

        if (method === 'grades_asc' || method === 'attendance_desc') {
            // Sort students based on selected metric
            if (method === 'grades_asc') {
                // Ascending Grade (Lower grades come first)
                studentsToAssign.sort((a, b) => getStudentAverage(a) - getStudentAverage(b));
            } else {
                // Descending Attendance Score (Higher risks come first)
                const getAttScore = (name) => {
                    const att = state.attendance.records[name] || {};
                    let score = 0;
                    Object.values(att).forEach(day => {
                        day.forEach(ev => {
                            if (ev.status === "欠") score += 1.0;
                            else if (ev.status === "遅") score += 0.5;
                        });
                    });
                    return score;
                };
                studentsToAssign.sort((a, b) => getAttScore(b) - getAttScore(a));
            }

            // Fill rows from Front to Back, but randomize WITHIN each row
            let studentIndex = 0;
            for (let r = 0; r < rows; r++) {
                const seatsInRow = [];
                for (let c = 0; c < cols; c++) {
                    const pos = r + '-' + c;
                    if (!isExcluded(pos)) seatsInRow.push(pos);
                }
                if (seatsInRow.length === 0) continue;

                const chunk = studentsToAssign.slice(studentIndex, studentIndex + seatsInRow.length);
                studentIndex += seatsInRow.length;

                // Shuffle WITHIN this row group
                for (let i = chunk.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [chunk[i], chunk[j]] = [chunk[j], chunk[i]];
                }

                seatsInRow.forEach((pos, idx) => {
                    if (idx < chunk.length) state.seating.assignments[pos] = chunk[idx];
                });

                if (studentIndex >= studentsToAssign.length) break;
            }
        } else {
            // Standard Assignment for other methods
            // Sort students
            if (method === 'random') {
                for (let i = studentsToAssign.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [studentsToAssign[i], studentsToAssign[j]] = [studentsToAssign[j], studentsToAssign[i]];
                }
            }

            // Assign
            for (let i = 0; i < seats.length && i < studentsToAssign.length; i++) {
                state.seating.assignments[seats[i]] = studentsToAssign[i];
            }
        }

        saveSessionState();
        renderSeatingRoster();
        renderSeatingGrid();
    } catch (e) {
        alert('自動配置エラー: ' + e.message);
        console.error(e);
    }
}

function savePresetsOnly() {
    try {
        if (!state.seatingPresets) state.seatingPresets = [];
        localStorage.setItem('gm_state_seatingPresets_v2', JSON.stringify(state.seatingPresets));
    } catch (e) {
        alert('プリセット保存エラー: ' + e.message);
    }
}

function loadPresetsOnly() {
    try {
        const raw = localStorage.getItem('gm_state_seatingPresets_v2');
        if (raw) {
            state.seatingPresets = JSON.parse(raw);
        }
    } catch (e) {
        console.error('Preset load error', e);
    }
}

// Context Menu Logic
let currentContextMenuSeat = null;

function initContextMenu() {
    let menu = document.getElementById('seatContextMenu');
    if (menu) return; // Only create once

    menu = document.createElement('div');
    menu.id = 'seatContextMenu';
    menu.style.cssText = `
        position: fixed;
        background: white;
        border: 1px solid #cbd5e1;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 99999;
        display: none;
        min-width: 180px;
        border-radius: 0.5rem;
        padding: 0.5rem 0;
        font-family: sans-serif;
    `;

    menu.innerHTML = `
        <div class="context-menu-item" data-action="clear-seat" style="padding: 0.6rem 1rem; cursor: pointer; color: #ef4444; font-weight: bold; font-size: 0.9rem;">席をクリア</div>
        <div class="context-menu-item" data-action="toggle-fix" style="padding: 0.6rem 1rem; cursor: pointer; color: #475569; font-size: 0.9rem;">?? 位置を固定/解除</div>
        <div id="sep-clear" style="height: 1px; background: #e2e8f0; margin: 0.4rem 0;"></div>
        <div class="context-menu-item" data-action="toggle-disable" style="padding: 0.6rem 1rem; cursor: pointer; color: #475569; font-size: 0.9rem;">無効化/有効化 (Toggle)</div>
        <div style="height: 1px; background: #e2e8f0; margin: 0.4rem 0;"></div>
        <div class="context-menu-item" data-action="disable-col" style="padding: 0.6rem 1rem; cursor: pointer; color: #475569; font-size: 0.9rem;">縦一列を無効化</div>
        <div class="context-menu-item" data-action="disable-row" style="padding: 0.6rem 1rem; cursor: pointer; color: #475569; font-size: 0.9rem;">横一列を無効化</div>
        <div style="height: 1px; background: #e2e8f0; margin: 0.4rem 0;"></div>
        <div class="context-menu-item" data-action="enable-col" style="padding: 0.6rem 1rem; cursor: pointer; color: #475569; font-size: 0.9rem;">縦一列を有効化</div>
        <div class="context-menu-item" data-action="enable-row" style="padding: 0.6rem 1rem; cursor: pointer; color: #475569; font-size: 0.9rem;">横一列を有効化</div>
    `;
    document.body.appendChild(menu);

    // Hover effect for items (since we are inlining)
    menu.querySelectorAll('.context-menu-item').forEach(item => {
        item.onmouseover = () => item.style.background = '#f1f5f9';
        item.onmouseout = () => item.style.background = 'transparent';
    });

    // Close on any click outside
    document.addEventListener('mousedown', (e) => {
        if (!menu.contains(e.target)) {
            menu.style.display = 'none';
        }
    });

    menu.addEventListener('click', (e) => {
        const item = e.target.closest('.context-menu-item');
        if (item) {
            const action = item.getAttribute('data-action');
            if (action && currentContextMenuSeat) {
                handleSeatMenuAction(action, currentContextMenuSeat);
                menu.style.display = 'none';
            }
        }
    });

    // Prevent default context menu on our custom menu
    menu.oncontextmenu = (e) => e.preventDefault();
}

function showSeatContextMenu(e, pos) {
    e.preventDefault();
    e.stopPropagation();
    currentContextMenuSeat = pos;
    const menu = document.getElementById('seatContextMenu');
    if (menu) {
        // Show/Hide "Clear Seat" depending on assignment
        const hasStudent = !!state.seating.assignments[pos];
        const isFixed = state.seating.fixed.includes(pos);

        const clearItem = menu.querySelector('[data-action="clear-seat"]');
        const fixItem = menu.querySelector('[data-action="toggle-fix"]');
        const sep = document.getElementById('sep-clear');

        if (clearItem) clearItem.style.display = hasStudent ? 'block' : 'none';
        if (fixItem) {
            fixItem.style.display = hasStudent ? 'block' : 'none';
            fixItem.textContent = isFixed ? '?? 固定解除' : '?? 位置を固定';
        }
        if (sep) sep.style.display = hasStudent ? 'block' : 'none';

        menu.style.left = e.clientX + 'px';
        menu.style.top = e.clientY + 'px';
        menu.style.display = 'block';
    }
}

function handleSeatMenuAction(action, pos) {
    const parts = pos.split('-');
    const r = parseInt(parts[0]);
    const c = parseInt(parts[1]);
    const rows = state.seating.rows;
    const cols = state.seating.cols;

    const setDisable = (p, disable) => {
        if (disable) {
            if (!state.seating.disabled.includes(p)) state.seating.disabled.push(p);
            // Remove from fixed
            state.seating.fixed = state.seating.fixed.filter(x => x !== p);
            // Remove assignment
            if (state.seating.assignments[p]) delete state.seating.assignments[p];
        } else {
            state.seating.disabled = state.seating.disabled.filter(x => x !== p);
        }
    };

    if (action === 'clear-seat') {
        if (state.seating.assignments[pos]) {
            delete state.seating.assignments[pos];
        }
    } else if (action === 'toggle-fix') {
        toggleFixed(pos);
        return; // toggleFixed already saves and renders
    } else if (action === 'toggle-disable') {
        const isDisabled = state.seating.disabled.includes(pos);
        setDisable(pos, !isDisabled);
    } else if (action === 'disable-col') {
        for (let i = 0; i < rows; i++) setDisable(i + '-' + c, true);
    } else if (action === 'disable-row') {
        for (let i = 0; i < cols; i++) setDisable(r + '-' + i, true);
    } else if (action === 'enable-col') {
        for (let i = 0; i < rows; i++) setDisable(i + '-' + c, false);
    } else if (action === 'enable-row') {
        for (let i = 0; i < cols; i++) setDisable(r + '-' + i, false);
    }

    // Reset preset selection if layout (disabled/enabled) changed
    if (action !== 'clear-seat') {
        const presetSelect = document.getElementById('seatingPresetSelect');
        if (presetSelect) presetSelect.value = '';
    }

    saveSessionState();
    renderSeatingRoster();
    renderSeatingGrid();
}

// ==================== ROSTER BOARD LOGIC ====================
// Replaces old Import Preview Modal

function initRosterBoard() {
    // Check if we have pending import state or active students
    if (importState.candidates.length === 0 && state.students.length > 0) {
        // If empty candidates but we have students, populate candidates FROM current students?
        // No, Roster Board is specifically for IMPORTING NEW or UPDATING.
        // But maybe we should show current status? 
        // For now, let's keep it clean: "No file loaded".
    }
}

// Event Listeners for Roster Board
// Event Listeners for Roster Board moved to setupEventListeners()
// to ensure DOM readiness.

// rosterSelectAll listener moved to setupEventListeners


// Logic called after CSV parsing
function openRosterBoard(candidates) {
    importState.candidates = candidates;
    invalidateCandidateCache(); // Critical for performance after new import
    importState.selected = new Set(); // Start with NONE selected to avoid accidental full import
    importState.filters = {};
    importState.searchText = '';
    importState.sortKey = 'original';
    importState.sortOrder = 'asc';

    // Reset UI
    // document.getElementById('rosterSortSelect').value = 'original'; // remove if select removed

    // Switch Tab
    switchTab('roster_board');

    // Render Sidebar Filters
    renderRosterBoardFilters();

    // Render Status
    document.getElementById('rosterBoardStatus').textContent = `読み込み完了 (${candidates.length}名)`;
    document.getElementById('rosterBoardStatus').style.color = '#10b981';

    // Render Table
    renderRosterBoardTable();
    setupRosterHeaderSort(); // Attach listeners

    // PERSIST
    saveSessionState();
}

function renderRosterBoardFilters() {
    const filterContainer = document.getElementById('rosterFilterContainer');
    filterContainer.innerHTML = '';

    const candidates = importState.candidates || [];

    // Extract unique values
    const years = [...new Set(candidates.map(c => { const m = c.metadata || {}; return m['年'] || c.year; }).filter(Boolean))].sort();
    const classes = [...new Set(candidates.map(c => { const m = c.metadata || {}; return m['組'] || c.class; }).filter(Boolean))].sort();
    const courses = [...new Set(candidates.map(c => { const m = c.metadata || {}; return m['コース'] || m['応用専門分野・領域']; }).filter(Boolean))].sort();

    const genders = [...new Set(candidates.map(c => { const m = c.metadata || {}; return m['性別']; }).filter(Boolean))].sort();

    // Helper
    const createSelect = (label, key, options, staticOptions = null) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'control-group';
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.gap = '0.3rem';

        wrapper.innerHTML = `<label style="font-size:0.85rem; font-weight:600; color:#64748b;">${label}</label>`;
        const sel = document.createElement('select');
        sel.style.cssText = "width:100%; padding: 0.4rem; border: 1px solid #cbd5e1; border-radius: 0.4rem; font-size: 0.85rem; background: #fff;";

        if (staticOptions) {
            sel.innerHTML = '<option value="">すべて</option>' + staticOptions.map(o => `<option value="${o.val}">${o.label}</option>`).join('');
        } else {
            sel.innerHTML = '<option value="">すべて</option>' + options.map(o => `<option value="${o}">${o}</option>`).join('');
        }

        sel.onchange = (e) => {
            importState.filters[key] = e.target.value;
            renderRosterBoardTable();
            document.getElementById('rosterSelectAll').checked = false;
        };
        wrapper.appendChild(sel);
        filterContainer.appendChild(wrapper);
    };

    if (years.length > 0) createSelect('学年', 'year', years);
    if (classes.length > 0) createSelect('組', 'class', classes);
    if (genders.length > 0) createSelect('性別', 'gender', genders);
    if (courses.length > 0) createSelect('応用専門分野', 'course', courses);

    // Status Filter (Static)
    createSelect('登録状況', 'status', [], [
        { val: 'new', label: '新規 (New)' },
        { val: 'update', label: '更新 (Update)' }
    ]);

    if (filterContainer.children.length === 0) {
        filterContainer.innerHTML = '<div style="color:#94a3b8; font-size:0.85rem;">絞り込み可能な項目がありません</div>';
    }
}

function getFilteredAndSortedCandidates() {
    // 1. Filter
    let list = importState.candidates.filter(c => {
        const meta = c.metadata || {};
        const cYear = getMetaValue(meta, ['年', '学年', 'year', 'Grade', '年次']) || String(c.year);
        if (importState.filters.year && cYear != importState.filters.year) return false;

        const cClass = getMetaValue(meta, ['組', 'クラス', 'class', 'Class']) || c.class;
        if (importState.filters.class && cClass != importState.filters.class) return false;

        if (importState.filters.gender && getMetaValue(meta, ['性別', 'Gender']) != importState.filters.gender) return false;

        const cCourse = getMetaValue(meta, ['コース', '学科', 'course', 'Dept', '応用専門分野・領域', '所属']);
        if (importState.filters.course && cCourse != importState.filters.course) return false;

        if (importState.filters.status) {
            const isNew = !new Set(state.students).has(c.name);
            if (importState.filters.status === 'new' && !isNew) return false;
            if (importState.filters.status === 'update' && isNew) return false;
        }

        // Search Text Filter
        if (importState.searchText) {
            const query = importState.searchText.toLowerCase();
            const searchTargets = [
                c.name,
                c.metadata['暗号化氏名1'],
                c.metadata['暗号化氏名'],
                c.no,
                c.metadata['出席番号'],
                c.studentId,
                c.metadata['学籍番号']
            ].map(v => (v || '').toString().toLowerCase());

            if (!searchTargets.some(t => t.includes(query))) return false;
        }

        return true;
    });

    // 2. Sort
    const key = importState.sortKey;
    const order = importState.sortOrder === 'asc' ? 1 : -1;
    const existingSet = new Set(state.students);

    const compare = (a, b, k) => {
        let valA = '', valB = '';
        if (k === 'year') { valA = a.year || ''; valB = b.year || ''; }
        else if (k === 'class') { valA = a.class || ''; valB = b.class || ''; }
        else if (k === 'no') { valA = String(a.no || 999).padStart(3, '0'); valB = String(b.no || 999).padStart(3, '0'); }
        else if (k === 'name') { valA = a.name; valB = b.name; }
        else if (k === 'gender') { valA = a.metadata['性別'] || ''; valB = b.metadata['性別'] || ''; }
        else if (k === 'selection') { valA = a.metadata['選択'] || ''; valB = b.metadata['選択'] || ''; }
        else if (k === 'course') { valA = a.metadata['応用専門分野・領域'] || ''; valB = b.metadata['応用専門分野・領域'] || ''; }
        else if (k === 'status') {
            // New (= true) vs Update (= false)
            const isNewA = !existingSet.has(a.name);
            const isNewB = !existingSet.has(b.name);
            // Sort: New first? True > False
            if (isNewA === isNewB) return 0;
            return isNewA ? -1 : 1;
        }
        else {
            // Original / key
            return a.sortKey.localeCompare(b.sortKey);
        }

        // Use numeric sort for numbers if needed, else string localeCompare
        if (k === 'no' || k === 'year') {
            return valA.localeCompare(valB, undefined, { numeric: true });
        }
        return valA.localeCompare(valB, 'ja');
    };

    if (key !== 'original') {
        list.sort((a, b) => compare(a, b, key) * order);
    } else {
        list.sort((a, b) => a.sortKey.localeCompare(b.sortKey));
    }

    return list;
}

function setupRosterHeaderSort() {
    const headers = document.querySelectorAll('.sortable-th');
    headers.forEach(th => {
        // Use addEventListener instead of onclick to avoid overwrites
        th.addEventListener('click', () => {
            const sortKey = th.dataset.sort;
            if (importState.sortKey === sortKey) {
                // Toggle order
                importState.sortOrder = importState.sortOrder === 'asc' ? 'desc' : 'asc';
            } else {
                importState.sortKey = sortKey;
                importState.sortOrder = 'asc';
            }
            console.log(`Sorting by ${sortKey} (${importState.sortOrder})`);
            renderRosterBoardTable();
        });

        // Add visual cue logic
        th.addEventListener('mouseover', () => th.style.backgroundColor = '#e2e8f0');
        th.addEventListener('mouseout', () => th.style.backgroundColor = '');
    });
}


function renderRosterBoardTable() {
    const tbody = document.getElementById('rosterBoardBody');
    if (!tbody) return;

    // If no candidates (pending import), show Current Students instead
    if (!importState.candidates || importState.candidates.length === 0) {
        if (state.students && state.students.length > 0) {
            // Load current students into candidates for view/edit
            // This allows the Roster Board to act as a viewer for current data
            importState.candidates = state.students.map(name => {
                const meta = state.studentMetadata[name] || {};
                // Reconstruct a candidate object
                return {
                    name: name,
                    sortKey: meta['sortKey'] || name,
                    metadata: meta,
                    year: meta['年'] || meta['year'] || '',
                    class: meta['組'] || meta['class'] || '',
                    no: meta['出席番号'] || meta['no'] || '',
                    studentId: meta['学籍番号'] || meta['studentId'] || ''
                };
            });
            importState.selected = new Set(); // Default none selected

            // Update Status
            const statusDiv = document.getElementById('rosterBoardStatus');
            if (statusDiv) {
                statusDiv.textContent = `現在登録済みのデータ (${state.students.length}名)`;
                statusDiv.style.color = '#475569';
            }

            // If filters are empty, render filters based on this data
            if (Object.keys(importState.filters).length === 0) {
                renderRosterBoardFilters();
            }
        }
    }

    const visible = getFilteredAndSortedCandidates();
    document.querySelectorAll('.sortable-th .sort-icon').forEach(icon => icon.textContent = '');
    const activeHeader = document.querySelector(`.sortable-th[data-sort="${importState.sortKey}"] .sort-icon`);
    if (activeHeader) {
        activeHeader.textContent = importState.sortOrder === 'asc' ? ' ▲' : ' ▼';
    }

    tbody.innerHTML = '';

    // const visible = getFilteredAndSortedCandidates(); // Already defined
    const existingStudentsSet = new Set(state.students);

    // Update Select All Checkbox State
    const selectAllCb = document.getElementById('rosterSelectAll');
    if (selectAllCb) {
        // Reuse 'visible' which respects filters
        const allSelected = visible.length > 0 && visible.every(c => importState.selected.has(c.name));
        selectAllCb.checked = allSelected;
    }

    if (visible.length === 0) {
        tbody.innerHTML = `<tr><td colspan="11" style="text-align: center; padding: 2rem; color: #94a3b8;">
            条件に一致する学生がいません
        </td></tr>`;
        return;
    }

    visible.forEach(c => {
        const tr = document.createElement('tr');
        const isChecked = importState.selected.has(c.name);
        const isNew = !existingStudentsSet.has(c.name);

        tr.style.background = isChecked ? '#fff' : '#f8fafc';
        if (isChecked) {
            tr.style.background = isNew ? '#ecfdf5' : '#fff'; // Green tint if new, White if update
        }

        const statusBadge = isNew
            ? '<span class="status-pass" style="background:#dcfce7; color:#166534; padding:2px 8px; border-radius:4px; font-size:0.75rem;">新規</span>'
            : '<span style="background:#f1f5f9; color:#64748b; padding:2px 8px; border-radius:4px; font-size:0.75rem;">更新</span>';

        const displayName = c.name;

        tr.innerHTML = `
            <td style="text-align: center;">
                <input type="checkbox" class="roster-checkbox" data-name="${c.name}" ${isChecked ? 'checked' : ''}>
            </td>
            <td>${c.metadata['年'] || c.year || '-'}</td>
            <td>${c.metadata['組'] || c.class || '-'}</td>
            <td>${c.metadata['出席\n番号'] || c.metadata['出席番号'] || c.no || '-'}</td>
            <td><div style="font-weight:500;">${displayName}</div></td>
            <td style="color:#cbd5e1; font-size:0.8rem; font-family:monospace;">${c.metadata['暗号化氏名1'] || c.metadata['暗号化氏名'] || ''}</td>
            <td style="font-family:monospace; font-size:0.85rem;">${c.metadata['OMUID'] || c.metadata['omuid'] || '-'}</td>
            <td style="text-align:center;">
                <div style="display: flex; gap: 0.4rem; justify-content: center;">
                    <a href="https://teams.microsoft.com/l/chat/0/0?users=${encodeURIComponent(getStudentEmail(c.name, c.metadata))}" target="_blank" title="Teamsチャット" style="display:flex;">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#4f46e5" stroke-width="2" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    </a>
                    <a href="mailto:${getStudentEmail(c.name, c.metadata)}" title="メール送信" style="display:flex;">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#0891b2" stroke-width="2" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </a>
                </div>
            </td>
            <td>${c.metadata['性別'] || '-'}</td>
            <td>${c.metadata['選択'] || c.metadata['選択科目'] || '-'}</td>
            <td>${c.metadata['応用専門分野・領域'] || c.metadata['コース'] || '-'}</td>
            <td style="text-align:center;">${statusBadge}</td>
        `;
        tbody.appendChild(tr);
    });

    // Count Update (Optional: could add a status bar text somewhere)
    // document.getElementById('rosterCountInfo').textContent = ...

    // Listeners and Row Interactions
    const rows = tbody.querySelectorAll('tr');
    rows.forEach((tr, index) => {
        const checkbox = tr.querySelector('.roster-checkbox');
        const studentName = checkbox.dataset.name;

        // 1. Click Handler (Selection)
        tr.addEventListener('click', (e) => {
            // If clicked directly on the checkbox, let the change event handle it (but update lastClicked)
            if (e.target.type === 'checkbox') {
                importState.lastClickedIndex = index;
                return;
            }

            // Prevent text selection double-click behavior usually
            // e.preventDefault(); // Might block input focus if any? No inputs in row other than checkbox.

            if (e.shiftKey && importState.lastClickedIndex !== undefined) {
                // Range Selection
                const start = Math.min(importState.lastClickedIndex, index);
                const end = Math.max(importState.lastClickedIndex, index);
                const rangeNames = visible.slice(start, end + 1).map(c => c.name);

                // If Ctrl is NOT pressed, clear others first? 
                // Standard behavior: Shift+Click extends selection. 
                // Usually keeps existing 'anchor' selection.
                // Simplified: Add range to current selection.
                // Or: If Ctrl not pressed, range becomes the ONLY selection? 
                // Let's go with: Shift always adds range, but if Ctrl not pressed, we might want to clear others?
                // Windows Explorer: Shift+Click selects range between anchor and current. Clears others unless Ctrl held? No.
                // Let's stick to "Add Range" logic for simplicity, or "Select Range exclusively" if no Ctrl.

                if (!e.ctrlKey) {
                    importState.selected.clear();
                }

                rangeNames.forEach(n => importState.selected.add(n));

            } else if (e.ctrlKey || e.metaKey) {
                // Toggle
                if (importState.selected.has(studentName)) {
                    importState.selected.delete(studentName);
                } else {
                    importState.selected.add(studentName);
                }
            } else {
                // Single Select (Clear others)
                importState.selected.clear();
                importState.selected.add(studentName);
            }

            importState.lastClickedIndex = index;
            renderRosterBoardTable();
        });

        // 2. Right Click (Context Menu)
        tr.addEventListener('contextmenu', (e) => {
            e.preventDefault();

            // If row is not part of selection, select it (exclusive)
            if (!importState.selected.has(studentName)) {
                importState.selected.clear();
                importState.selected.add(studentName);
                renderRosterBoardTable();
            }

            showRosterContextMenu(e.clientX, e.clientY);
        });
        // Mobile Long Press Support
        addLongPressTrigger(tr);

        // Checkbox Change (keep existing logic for simple checkbox clicks)
        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) importState.selected.add(e.target.dataset.name);
            else importState.selected.delete(e.target.dataset.name);
            // Don't re-render entire table here to avoid losing focus/scroll? 
            // Checkbox state is already visually updated by browser.
            // But we need to update row background.
            // renderRosterBoardTable(); -> This rebuilds DOM, might lose checkbox focus if keyboard used.
            // Better to just update parent row style.
            const row = e.target.closest('tr');
            if (e.target.checked) row.style.backgroundColor = '#fff'; // Simplification, lost 'New' tint logic? 
            // Re-render is safer for consistency.
            renderRosterBoardTable();
        });
    });
}

// Roster Context Menu
function showRosterContextMenu(x, y) {
    let menu = document.getElementById('rosterContextMenu');
    if (!menu) {
        menu = document.createElement('div');
        menu.id = 'rosterContextMenu';
        menu.style.cssText = `
            position: fixed;
            background: white;
            border: 1px solid #cbd5e1;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 99999;
            min-width: 160px;
            border-radius: 0.5rem;
            padding: 0.5rem 0;
            font-family: sans-serif;
            font-size: 0.9rem;
        `;
        menu.innerHTML = `
            <div class="ctx-item" data-action="teams">
                <span class="ctx-icon">??</span> Teamsチャット
            </div>
            <div class="ctx-item" data-action="mail">
                <span class="ctx-icon">??</span> メール送信
            </div>
        `;
        document.body.appendChild(menu);

        // Styling
        const style = document.createElement('style');
        style.textContent = `
            #rosterContextMenu .ctx-item { padding: 0.6rem 1rem; cursor: pointer; color: #475569; display: flex; align-items: center; gap: 0.5rem; }
            #rosterContextMenu .ctx-item:hover { background: #f1f5f9; color: #1e293b; }
            #rosterContextMenu .ctx-icon { width: 16px; text-align: center; }
        `;
        document.head.appendChild(style);

        // Logic
        menu.addEventListener('click', (e) => {
            const item = e.target.closest('.ctx-item');
            if (!item) return;
            const action = item.dataset.action;
            if (action === 'teams') openTeamsChatForSelected();
            if (action === 'mail') openMailForSelected();
            menu.style.display = 'none';
        });

        // Close
        document.addEventListener('mousedown', (e) => {
            if (!menu.contains(e.target)) menu.style.display = 'none';
        });
    }

    menu.style.display = 'block';
    // Boundary check
    const rect = menu.getBoundingClientRect();
    if (x + rect.width > window.innerWidth) x -= rect.width;
    if (y + rect.height > window.innerHeight) y -= rect.height;

    menu.style.left = x + 'px';
    menu.style.top = y + 'px';
}


function confirmImportFromBoard() {
    const selectedNames = Array.from(importState.selected);

    if (selectedNames.length === 0) {
        alert('学生が選択されていません。');
        return;
    }

    if (!confirm(`${selectedNames.length} 名の学生を成績管理に取り込みますか？\n(既存の学生情報は更新・上書きされます)`)) return;

    // Filter candidates
    const finalCandidates = importState.candidates.filter(c => importState.selected.has(c.name));

    // Sort again just to be sure (or use current sort?)
    // Usually user wants the order they see on screen.
    const sortedFinal = getFilteredAndSortedCandidates().filter(c => importState.selected.has(c.name));

    // If user has filtered, we might miss selected but invisible ones in `sortedFinal`.
    // Strategy: Use screen sort for visible, and append invisible ones at end? 
    // Or just use importState.candidates original sort for consistency?
    // Let's use Screen Sort logic for consistency with what user sees.

    // But getFilteredAndSortedCandidates ONLY returns filtered.
    // If I selected someone then changed filter, they are still in `selected` set but not in `sortedFinal`.
    // We should probably just use the `importState.candidates` sorted by `importState.sortMethod`.

    let allCandidates = [...importState.candidates];
    // Sort allCandidates by current sort method
    // Reuse logic (duplicated for brevity or refactor helper)
    const method = importState.sortMethod;
    if (method === 'name') {
        allCandidates.sort((a, b) => a.name.localeCompare(b.name, 'ja'));
    } else if (method === 'studentId') {
        allCandidates.sort((a, b) => (a.studentId || '').localeCompare(b.studentId || '', undefined, { numeric: true }));
    } else if (method === 'year') {
        allCandidates.sort((a, b) => (a.year || '').localeCompare(b.year || '', undefined, { numeric: true }) || a.sortKey.localeCompare(b.sortKey));
    } else if (method === 'class') {
        allCandidates.sort((a, b) => (a.class || '').localeCompare(b.class || '') || a.sortKey.localeCompare(b.sortKey));
    } else {
        allCandidates.sort((a, b) => a.sortKey.localeCompare(b.sortKey));
    }

    const newStudents = [];
    const newMetadata = {};

    allCandidates.forEach(c => {
        if (importState.selected.has(c.name)) {
            newStudents.push(c.name);
            newMetadata[c.name] = c.metadata;
        }
    });

    // MERGE logic: Keep current students IF they are still relevant OR just replace?
    // User said "絞り込んだものを流すイメージ". 
    // Usually this means "Update the master list to MATCH the selected ones".

    state.students = newStudents;
    // For metadata, we merge into existing to preserve any manually added fields not in roster?
    // Actually, roster is usually the source of truth for 'Year/Class/No'.
    // Let's replace metadata for THOSE students, but keep others if we were appending.
    // Since we are replacing state.students, we just use newMetadata.
    state.studentMetadata = newMetadata;
    invalidateCandidateCache(); // Update cache after import

    if (!state.students.includes(state.currentStudent)) {
        state.currentStudent = state.students[0];
    }

    saveSessionState();

    // Update Source Info for Roster
    state.sourceInfo.roster = {
        count: state.students.length,
        date: new Date().toISOString(),
        filename: importState.filename || 'roster.csv'
    };
    // Re-save with source info
    saveSessionState();

    // Clear the candidate cache after successful import to save storage space
    importState.candidates = [];
    localStorage.removeItem('gm_roster_candidates');

    populateControls();
    updateSourceSummaryDisplay();

    alert(`取り込みが完了しました。\n(${state.students.length} 名登録)`);

    // Maybe switch to Settings or Roster? Stay on Roster Board.
    renderRosterBoardTable();
}

function openTeamsChatForSelected() {
    const selectedNames = Array.from(importState.selected);
    if (selectedNames.length === 0) {
        alert('学生が選択されていません。');
        return;
    }

    const emails = getEmailsForSelected(true); // Helper with alert
    if (!emails) return;

    const usersParam = emails.join(',');
    // Teams Deep Link
    // format: https://teams.microsoft.com/l/chat/0/0?users=alice@example.com,bob@example.com
    const url = `https://teams.microsoft.com/l/chat/0/0?users=${encodeURIComponent(usersParam)}`;

    window.open(url, '_blank');
}

function openMailForSelected() {
    const selectedNames = Array.from(importState.selected);
    if (selectedNames.length === 0) {
        alert('学生が選択されていません。');
        return;
    }

    const emails = getEmailsForSelected(true); // Helper with alert
    if (!emails) return; // Alert handled in helper

    // Mailto
    // Outlook often prefers semicolon, others comma. RFC says comma.
    // Let's try comma. If user wants semicolon, they can replace?
    // Some envs (Windows Default Mail) handle comma fine.
    const to = emails.join(',');
    window.location.href = `mailto:${to}`;
}

// Helper to get email for a specific student name with fallback
function getStudentEmail(studentName, metaArg = null) {
    // Priority: 1. Passed metaArg, 2. Global metadata (normalized)
    const meta = metaArg || getStudentMetadataSafe(studentName) || {};
    let email = meta['Email'] || meta['email'] || meta['メール'] || meta['メールアドレス'] || meta['e-mail'];

    // Fallback: If OMUID exists, use it as email prefix
    if (!email) {
        const omuid = meta['OMUID'] || meta['omuid'] || meta['id'] || meta['学籍番号'] || meta['studentId'];
        if (omuid && /^[a-z0-9.]+$/i.test(omuid)) {
            email = `${omuid}@st.omu.ac.jp`; // Correct Student OMU domain
        }
    }
    return email || "";
}

// Helper for faculty email (omu.ac.jp)
function getFacultyEmail(faculty) {
    if (!faculty) return "";
    let email = faculty.email;
    if (!email) {
        const omuid = faculty.omuid || faculty.id;
        if (omuid && /^[a-z0-9.]+$/i.test(omuid)) {
            email = `${omuid}@omu.ac.jp`; // Correct Faculty OMU domain
        }
    }
    return email || "";
}

function getEmailsForSelected(showAlerts = false) {
    const students = importState.candidates.filter(c => importState.selected.has(c.name));
    const emails = [];
    const missing = [];

    students.forEach(s => {
        const email = getStudentEmail(s.name, s.metadata);
        if (email) {
            emails.push(email);
        } else {
            missing.push(s.name);
        }
    });

    if (emails.length === 0) {
        if (showAlerts) alert('選択された学生のメールアドレス情報が見つかりません。\n(CSVに「Email」などの列を追加してください)');
        return null;
    }

    if (missing.length > 0 && showAlerts) {
        if (!confirm(`${missing.length} 名のメールアドレスが見つかりませんでした。\n(見つかった ${emails.length} 名のみで作成しますか？)`)) {
            return null;
        }
    }
    return emails;
}


// ==================== METADATA EDITOR ====================

function editStudentMetadata(studentName) {
    const modal = document.getElementById('metadataEditorModal');
    const container = document.getElementById('metaEditFieldsContainer');
    const nameInput = document.getElementById('metaEditName');
    const originalNameInput = document.getElementById('metaEditOriginalName');

    // Get current metadata
    const meta = state.studentMetadata[studentName] || {};

    nameInput.value = studentName;
    originalNameInput.value = studentName;
    container.innerHTML = '';

    // Default keys to always show (customize as needed)
    // Merge existing keys with common keys
    const commonKeys = ['年', '組', '出席番号', '性別', '選択', '応用専門分野・領域', '暗号化氏名1'];
    const allKeys = new Set([...commonKeys, ...Object.keys(meta)]);

    allKeys.forEach(key => {
        const val = meta[key] || '';
        const wrapper = document.createElement('div');
        wrapper.className = 'control-group';
        wrapper.innerHTML = `
            <label style="font-size: 0.8rem; color: #64748b;">${key}</label>
            <input type="text" class="meta-field-input" data-key="${key}" value="${val}" style="width: 100%; padding: 0.4rem; border: 1px solid #cbd5e1; border-radius: 0.3rem;">
        `;
        container.appendChild(wrapper);
    });

    modal.classList.add('open');
}

function addCustomMetadataField() {
    const key = prompt("新しい項目名を入力してください (例: 部活):");
    if (!key) return;

    const container = document.getElementById('metaEditFieldsContainer');
    const wrapper = document.createElement('div');
    wrapper.className = 'control-group';
    wrapper.innerHTML = `
        <label style="font-size: 0.8rem; color: #64748b;">${key}</label>
        <input type="text" class="meta-field-input" data-key="${key}" value="" style="width: 100%; padding: 0.4rem; border: 1px solid #cbd5e1; border-radius: 0.3rem;">
    `;
    container.appendChild(wrapper);
}

function saveStudentMetadata() {
    const studentName = document.getElementById('metaEditOriginalName').value;
    const inputs = document.querySelectorAll('.meta-field-input');

    const newMeta = {};
    inputs.forEach(input => {
        const key = input.dataset.key;
        const val = input.value.trim();
        if (key && val) { // Only save non-empty? Or save empty to clear? Let's save empty if needed to overwrite.
            newMeta[key] = val;
        }
    });

    state.studentMetadata[studentName] = newMeta;
    saveSessionState();

    // If current student, update UI might be needed if side effects exist (e.g. if we used metadata for display)
    if (state.currentStudent === studentName) {
        // re-render if needed
    }

    closeMetadataEditorModal();
    // Refresh Settings List (optional, but good visual feedback not really shown there)
    // alert('保存しました');
}

function closeMetadataEditorModal() {
    document.getElementById('metadataEditorModal').classList.remove('open');
}

// ==================== PRIVACY / DISPLAY NAME ====================
function getDisplayName(originalName) {
    if (!originalName) return '-';
    if (state.nameDisplayMode === 'name') return originalName;

    const meta = getStudentMetadataSafe(originalName) || {};

    // 1. Check for explicit encrypted name if exists
    const encrypted = getMetaValue(meta, ['暗号化氏名1', '暗号化氏名', 'EncryptedName', 'ニックネーム', 'Nickname']);
    if (encrypted) return encrypted;

    // 2. Try to build identity from Metadata (Grade-Class Number)
    const grade = getMetaValue(meta, ['年', '学年', 'year', 'Grade', '年次']);
    const cls = getMetaValue(meta, ['組', 'クラス', 'class', 'Section', 'HR', '区分']);
    const num = getMetaValue(meta, ['出席番号', 'no', 'Number', '番号']);

    if (num) {
        let label = "";
        if (grade && cls) label = `${grade}-${cls} `;
        else if (grade) label = `${grade}年 `;

        return `${label}No.${num}`;
    }

    // 3. Fallback: Full-width or Half-width space detection for name-based initials
    const trimmed = originalName.trim();
    const parts = trimmed.split(/[\s　]+/);

    if (parts.length >= 2) {
        // e.g. "Tanaka Taro" -> "T.T." or "田中 太郎" -> "田 太"
        if (/^[a-zA-Z]+$/.test(parts[0]) && /^[a-zA-Z]+$/.test(parts[1])) {
            return parts.map(p => p[0].toUpperCase()).join('.') + '.';
        } else {
            return parts.map(p => p[0]).join(' ');
        }
    }

    // 4. Ultimate Fallback: First character + ...
    return trimmed.substring(0, 1) + '...';
}

/**
 * Generates a sortable key for a student based on metadata (Year-Class-Number).
 */

function updateNameDisplayMode(mode) {
    state.nameDisplayMode = mode;
    saveSessionState();

    // Refresh Sidebar
    populateControls();

    // Refresh Settings if active
    if (state.currentTab === 'settings') renderSettings();
    // Refresh Grades if active
    if (state.currentTab === 'grades') renderGradesTable();
    // Refresh Graduation Requirements if active
    if (state.currentTab === 'grad_requirements') renderGraduationRequirements();

    // Refresh Class Stats if previously generated
    const csContainer = document.getElementById('classStatsContainer');
    if (csContainer && csContainer.innerHTML.trim() !== '') {
        generateClassStats();
    }

    // Refresh At Risk Report if previously generated
    const atRiskBody = document.getElementById('atRiskResultsBody');
    if (atRiskBody && atRiskBody.innerHTML.trim() !== '') {
        renderAtRiskReport();
    }

    updatePrintHeader();
}
// ==================== FACULTY ROSTER LOGIC ====================

function handleFacultyRosterSelect(e) {
    const file = e.target.files[0];
    if (!file) return;

    readFileText(file).then(text => {
        try {
            const rows = parseCSV(text).filter(row => row.length > 0 && row.some(col => col.trim()));
            if (rows.length < 2) throw new Error("Empty or invalid CSV");

            // Header: 所属,校務分掌１,校務分掌２,氏名,OMUメール,OMU ID
            const candidates = rows.slice(1).map((row, idx) => ({
                dept: row[0] || '',
                duty1: row[1] || '',
                duty2: row[2] || '',
                name: (row[3] || '').trim(),
                email: (row[4] || '').trim(),
                omuid: (row[5] || '').trim(),
                id: 'fac_' + idx
            })).filter(c => c.name);

            facultyImportState.candidates = candidates;
            facultyImportState.selected = new Set();
            facultyImportState.filters = {};
            facultyImportState.searchText = '';

            switchTab('faculty_roster');
            renderFacultyFilters();
            renderFacultyTable();

            // Update Source Info for Faculty
            state.sourceInfo.faculty = {
                count: candidates.length,
                date: new Date().toISOString(),
                filename: file.name
            };

            saveSessionState();
            updateSourceSummaryDisplay();

            const statusEl = document.getElementById('facultyBoardStatus');
            if (statusEl) {
                statusEl.innerText = `${candidates.length}名読み込み完了`;
                statusEl.style.color = '#10b981';
            }
        } catch (err) {
            alert('名簿読み込みエラー: ' + err.message);
        } finally {
            e.target.value = '';
        }
    }).catch(err => {
        alert('名簿読み込みエラー: ' + err.message);
        e.target.value = '';
    });
}

function renderFacultyFilters() {
    const container = document.getElementById('facultyFilterContainer');
    if (!container) return;
    container.innerHTML = '';
    const candidates = facultyImportState.candidates;

    const depts = [...new Set(candidates.map(c => c.dept).filter(Boolean))].sort();

    const createSelect = (label, key, options) => {
        const div = document.createElement('div');
        div.className = 'control-group';
        div.style.cssText = "display:flex; flex-direction:column; gap:0.4rem;";
        div.innerHTML = `<label style="font-size:0.8rem; font-weight:700; color:#64748b;">${label}</label>`;
        const sel = document.createElement('select');
        sel.style.cssText = "width:100%; padding:0.4rem; border:1px solid #e2e8f0; border-radius:0.4rem; font-size:0.85rem;";
        sel.innerHTML = '<option value="">すべて</option>' + options.map(o => `<option value="${o}">${o}</option>`).join('');
        sel.onchange = (e) => {
            facultyImportState.filters[key] = e.target.value;
            renderFacultyTable();
        };
        div.appendChild(sel);
        container.appendChild(div);
    };

    if (depts.length > 0) createSelect('所属', 'dept', depts);
}

function renderFacultyTable() {
    const tbody = document.getElementById('facultyRosterBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const list = facultyImportState.candidates.filter(c => {
        if (facultyImportState.filters.dept && c.dept !== facultyImportState.filters.dept) return false;

        // Search Filter
        if (facultyImportState.searchText) {
            const query = facultyImportState.searchText.toLowerCase();
            const targets = [c.name, c.email, c.omuid, c.duty1, c.duty2].map(v => (v || '').toString().toLowerCase());
            if (!targets.some(t => t.includes(query))) return false;
        }

        return true;
    });

    list.forEach(c => {
        const tr = document.createElement('tr');
        const isSelected = facultyImportState.selected.has(c.id);
        const rowStyle = isSelected ? 'background-color: #f0f9ff;' : '';
        tr.style.cssText = rowStyle + ' cursor: pointer;';
        tr.dataset.facultyId = c.id;
        const facultyEmail = getFacultyEmail(c);
        tr.dataset.facultyEmail = facultyEmail;
        tr.dataset.facultyName = c.name || '';

        tr.innerHTML = `
            <td style="text-align:center;"><input type="checkbox" class="fac-row-check" data-id="${c.id}" ${isSelected ? 'checked' : ''}></td>
            <td>${c.dept}</td>
            <td>${c.duty1}</td>
            <td>${c.duty2}</td>
            <td style="font-weight:600; color:#334155;">${c.name}</td>
            <td style="font-family: monospace; font-size: 0.8rem;">${facultyEmail}</td>
            <td style="color:#64748b;">${c.omuid}</td>
            <td style="text-align:center;">
                <div style="display: flex; gap: 0.4rem; justify-content: center;">
                    <a href="https://teams.microsoft.com/l/chat/0/0?users=${encodeURIComponent(facultyEmail)}" target="_blank" title="Teamsチャット" style="display:flex;">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#4f46e5" stroke-width="2" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    </a>
                    <a href="mailto:${facultyEmail}" title="メール送信" style="display:flex;">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#0891b2" stroke-width="2" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </a>
                </div>
            </td>
        `;

        // Add right-click context menu
        tr.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            showFacultyContextMenu(e, c);
        });
        addLongPressTrigger(tr);

        // Hover effect
        tr.addEventListener('mouseenter', () => {
            if (!isSelected) tr.style.backgroundColor = '#f8fafc';
        });
        tr.addEventListener('mouseleave', () => {
            if (!isSelected) tr.style.backgroundColor = '';
        });

        tbody.appendChild(tr);
    });

    // Add listeners to checkboxes
    tbody.querySelectorAll('.fac-row-check').forEach(cb => {
        cb.onchange = (e) => {
            const id = e.target.dataset.id;
            if (e.target.checked) facultyImportState.selected.add(id);
            else facultyImportState.selected.delete(id);
            // Toggle highlight
            e.target.closest('tr').style.backgroundColor = e.target.checked ? '#f0f9ff' : '';
        };
    });
}

function showFacultyContextMenu(event, faculty) {
    // Remove existing context menu if any
    const existingMenu = document.getElementById('facultyContextMenu');
    if (existingMenu) existingMenu.remove();

    const facultyEmail = getFacultyEmail(faculty);
    if (!facultyEmail) {
        alert('この教職員にはメールアドレス情報が見つかりません。');
        return;
    }

    // Create context menu
    const menu = document.createElement('div');
    menu.id = 'facultyContextMenu';
    menu.style.cssText = `
        position: fixed;
        left: ${event.clientX}px;
        top: ${event.clientY}px;
        background: white;
        border: 1px solid #cbd5e1;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        z-index: 10000;
        min-width: 200px;
        padding: 0.5rem 0;
    `;

    const menuItems = [
        {
            icon: '??',
            label: 'Teams チャット',
            action: () => {
                const url = `https://teams.microsoft.com/l/chat/0/0?users=${faculty.email}`;
                window.open(url, '_blank');
            }
        },
        {
            icon: '??',
            label: 'メール送信',
            action: () => {
                window.location.href = `mailto:${faculty.email}`;
            }
        }
    ];

    menuItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.style.cssText = `
            padding: 0.75rem 1rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-size: 0.9rem;
            color: #334155;
            transition: background-color 0.15s;
        `;
        menuItem.innerHTML = `
            <span style="font-size: 1.2rem;">${item.icon}</span>
            <span>${item.label}</span>
        `;

        menuItem.addEventListener('mouseenter', () => {
            menuItem.style.backgroundColor = '#f1f5f9';
        });
        menuItem.addEventListener('mouseleave', () => {
            menuItem.style.backgroundColor = '';
        });
        menuItem.addEventListener('click', () => {
            item.action();
            menu.remove();
        });

        menu.appendChild(menuItem);
    });

    document.body.appendChild(menu);

    // Close menu when clicking outside
    const closeMenu = (e) => {
        if (!menu.contains(e.target)) {
            menu.remove();
            document.removeEventListener('click', closeMenu);
        }
    };
    setTimeout(() => document.addEventListener('click', closeMenu), 0);
}

function openFacultyTeamsChat() {
    const selected = facultyImportState.candidates.filter(c => facultyImportState.selected.has(c.id));
    if (selected.length === 0) { alert('対象者を選択してください'); return; }

    const emails = selected.map(c => getFacultyEmail(c)).filter(Boolean);
    if (emails.length === 0) { alert('メールアドレスが見つかりません'); return; }

    const url = `https://teams.microsoft.com/l/chat/0/0?users=${emails.join(',')}`;
    window.open(url, '_blank');
}

function openFacultyMail() {
    const selected = facultyImportState.candidates.filter(c => facultyImportState.selected.has(c.id));
    if (selected.length === 0) { alert('対象者を選択してください'); return; }

    const emails = selected.map(c => getFacultyEmail(c)).filter(Boolean);
    if (emails.length === 0) { alert('メールアドレスが見つかりません'); return; }

    const url = `mailto:${emails.join(';')}`;
    window.location.href = url;
}


// ==================== ATTENDANCE MANAGEMENT (出欠管理) ====================

function initAttendance() {
    const monthSelect = document.getElementById('attendanceMonthSelect');
    if (!monthSelect) return;

    // Populate Months (4月 to 3月 of current or detected year)
    if (monthSelect.options.length === 0) {
        const months = ["4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月", "1月", "2月", "3月"];
        months.forEach(m => {
            const opt = document.createElement('option');
            opt.value = m;
            opt.textContent = m;
            monthSelect.appendChild(opt);
        });
        // Default to current month
        const now = new Date();
        const curM = now.getMonth() + 1; // 1-12
        let idx = curM >= 4 ? curM - 4 : curM + 8;
        monthSelect.selectedIndex = idx;
    }

    document.getElementById('attendanceFileInfo').textContent = `ファイル：${state.attendance.fileName || '未読込'}`;

    // Populate Subject Filter
    populateAttendanceSubjectFilter();

    renderAttendanceCalendar();
    renderAttendanceStats();
    renderCumulativeAttendanceChart();
    renderSubjectAttendanceChart();
    renderDayAttendanceChart();
    renderPeriodAttendanceChart();

    // Sync class stats if it exists
    initClassAttendanceStats();
    renderClassAttendanceStats();
}

function initClassAttendanceStats() {
    const targetInput = document.getElementById('classAttendanceTargetDate');
    if (!targetInput) return;

    // Default to today if not set
    if (!targetInput.value) {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        targetInput.value = `${y}-${m}-${d}`;
    }
}

function jumpToTodayClassAttendanceGantt() {
    const targetInput = document.getElementById('classAttendanceTargetDate');
    if (!targetInput) return;
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    targetInput.value = `${y}-${m}-${d}`;
    renderClassAttendanceStats();
}

function navigateClassAttendanceGantt(direction) {
    const targetInput = document.getElementById('classAttendanceTargetDate');
    const rangeSelect = document.getElementById('classAttendanceRangeSelect');
    if (!targetInput || !rangeSelect) return;

    const current = new Date(targetInput.value);
    const range = parseInt(rangeSelect.value) || 30;

    // Move by half the range amount (common in gantt nav)
    current.setDate(current.getDate() + (direction * Math.ceil(range / 2)));

    const y = current.getFullYear();
    const m = String(current.getMonth() + 1).padStart(2, '0');
    const d = String(current.getDate()).padStart(2, '0');
    targetInput.value = `${y}-${m}-${d}`;
    renderClassAttendanceStats();
}

function renderClassAttendanceStats() {
    const gridWrapper = document.getElementById('classAttendanceGanttWrapper');
    const header = document.getElementById('classAttendanceGanttHeader');
    const body = document.getElementById('classAttendanceGanttBody');
    const targetInput = document.getElementById('classAttendanceTargetDate');
    const rangeSelect = document.getElementById('classAttendanceRangeSelect');
    if (!header || !body || !targetInput || !rangeSelect) return;

    if (!targetInput.value) {
        targetInput.value = new Date().toISOString().split('T')[0];
    }
    const targetDateStr = targetInput.value;
    const targetDate = new Date(targetDateStr);
    if (isNaN(targetDate.getTime())) return;
    targetDate.setHours(0, 0, 0, 0);
    const range = parseInt(rangeSelect.value) || 30;

    const startDate = new Date(targetDate);
    startDate.setDate(startDate.getDate() - Math.floor(range / 2));

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Set print attribute for header
    const container = document.getElementById('class_attendance_stats-content');
    if (container) {
        container.setAttribute('data-print-date', `${startDate.getFullYear()}/${startDate.getMonth() + 1}/${startDate.getDate()} ～`);
    }

    // Prepare Header
    header.innerHTML = '';
    const thName = document.createElement('th');
    thName.textContent = '学生名 / 日付';
    thName.style.position = 'sticky';
    thName.style.left = '0';
    thName.style.zIndex = '40';
    thName.style.minWidth = '160px';
    thName.style.width = '160px';
    thName.style.background = '#f1f5f9';
    thName.style.borderRight = '2px solid #cbd5e1';
    thName.style.borderBottom = '2px solid #cbd5e1';
    thName.style.boxShadow = '2px 0 4px rgba(0,0,0,0.05)';
    header.appendChild(thName);

    for (let i = 0; i < range; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dayOfWeek = date.getDay();
        const d = date.getDate();
        const isToday = date.getTime() === today.getTime();

        // Holiday Check
        const dateStr = `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${d.toString().padStart(2, '0')}`;
        const holidayName = getJapaneseHolidaysCached(date.getFullYear())[dateStr];

        const th = document.createElement('th');
        th.style.minWidth = '70px';
        th.style.width = '70px';
        th.style.padding = '0.75rem 0.25rem';
        th.style.textAlign = 'center';
        th.style.fontSize = '0.8rem';
        th.style.fontWeight = 'bold';
        th.style.background = isToday ? '#fffbeb' : holidayName ? '#fee2e2' : dayOfWeek === 0 ? '#fecaca' : dayOfWeek === 6 ? '#dbeafe' : '#f8fafc';
        th.style.borderRight = '1px solid #e2e8f0';
        th.style.borderBottom = isToday ? '3px solid #f59e0b' : '1px solid #cbd5e1';

        // Month Divider
        if (d === 1 && i !== 0) {
            th.style.borderLeft = '2px solid #64748b';
        }

        if (holidayName) th.title = holidayName;

        if (isToday) th.style.boxShadow = 'inset 0 -2px 0 #f59e0b';

        let monthLabel = '';
        if (d === 1 || i === 0) {
            monthLabel = `<div style="font-size: 0.6rem; color: #94a3b8; margin-bottom: 2px;">${date.getMonth() + 1}月</div>`;
        }

        th.innerHTML = `${monthLabel}<div>${d}</div><div style="font-size: 0.7rem; color: ${(dayOfWeek === 0 || holidayName) ? '#ef4444' : dayOfWeek === 6 ? '#3b82f6' : '#64748b'};">${['日', '月', '火', '水', '木', '金', '土'][dayOfWeek]}</div>`;
        header.appendChild(th);
    }

    // Prepare Body
    body.innerHTML = '';
    const students = getClassStudents(parseInt(state.currentYear), state.currentCourse);

    // Sort students by attendance number (出席番号)
    students.sort((a, b) => {
        const ma = getStudentMetadataSafe(a);
        const mb = getStudentMetadataSafe(b);
        const noA = parseInt(getMetaValue(ma, ['出席番号', 'no', '番号'])) || 999;
        const noB = parseInt(getMetaValue(mb, ['出席番号', 'no', '番号'])) || 999;
        // If same number or both 999, fall back to name
        if (noA === noB) return a.localeCompare(b, 'ja');
        return noA - noB;
    });

    if (students.length === 0) {
        const row = document.createElement('tr');
        const td = document.createElement('td');
        td.setAttribute('colspan', range + 1);
        td.style.padding = '3rem';
        td.style.textAlign = 'center';
        td.style.color = '#94a3b8';
        td.innerHTML = `
            <div style="font-size: 1.1rem; font-weight: bold; color: #475569; margin-bottom: 0.5rem;">表示対象の学生がいません</div>
            <div style="font-size: 0.85rem;">学年（現在: ${state.currentYear}年）やコースのフィルター設定を確認してください。</div>
        `;
        row.appendChild(td);
        body.appendChild(row);
        return;
    }

    students.forEach((stu, sIdx) => {
        const row = document.createElement('tr');
        // Increase contrast for alternating rows
        row.style.background = sIdx % 2 === 0 ? 'white' : '#f1f5f9';

        // Student Column (Sticky)
        const tdName = document.createElement('td');
        tdName.style.position = 'sticky';
        tdName.style.left = '0';
        tdName.style.zIndex = '20';
        tdName.style.background = sIdx % 2 === 0 ? 'white' : '#f1f5f9';
        tdName.style.fontWeight = '600';
        tdName.style.fontSize = '0.9rem';
        tdName.style.padding = '0.75rem 1rem';
        tdName.style.borderRight = '2px solid #cbd5e1';
        tdName.style.borderBottom = '1px solid #e2e8f0';
        tdName.style.boxShadow = '2px 0 4px rgba(0,0,0,0.02)';

        const displayName = getDisplayName(stu);
        const nameInner = document.createElement('div');
        nameInner.style.display = 'flex';
        nameInner.style.alignItems = 'center';
        nameInner.style.gap = '0.5rem';
        nameInner.innerHTML = `<span style="color: #94a3b8; font-size: 0.7rem; font-weight: normal;">${sIdx + 1}</span> ${displayName}`;
        tdName.appendChild(nameInner);
        row.appendChild(tdName);

        // Day Columns
        for (let i = 0; i < range; i++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            const dayOfWeek = date.getDay();
            const dateStr = date.getFullYear() + '/' + (date.getMonth() + 1).toString().padStart(2, '0') + '/' + date.getDate().toString().padStart(2, '0');
            const nDate = normalizeDateStr(dateStr);
            const isToday = date.getTime() === today.getTime();

            const td = document.createElement('td');
            td.classList.add('gantt-day-cell');
            td.dataset.date = nDate;
            td.dataset.student = stu;

            // Holiday Check
            const holidayName = getJapaneseHolidaysCached(date.getFullYear())[nDate];

            td.style.padding = '4px 0';
            // Darker border for better visibility
            td.style.borderRight = '1px solid #cbd5e1';
            td.style.borderBottom = '1px solid #cbd5e1';

            // Month Divider
            if (date.getDate() === 1 && i !== 0) {
                td.style.borderLeft = '2px solid #94a3b8';
            }

            td.style.verticalAlign = 'top';
            td.style.minHeight = '42px';
            td.style.cursor = 'pointer';
            td.style.transition = 'background 0.1s';
            td.style.position = 'relative'; // For positioning memo star

            // Initial Background
            if (isToday) td.style.background = '#fffbeb';
            else if (holidayName || dayOfWeek === 0) td.style.background = '#fee2e2';
            else if (dayOfWeek === 6) td.style.background = '#dbeafe';

            // Render Memo Star if exists
            const memoKey = stu + '_' + nDate;
            if (state.attendance.memos && state.attendance.memos[memoKey]) {
                const star = document.createElement('div');
                star.textContent = '★';
                star.style.position = 'absolute';
                star.style.top = '0';
                star.style.right = '1px';
                star.style.fontSize = '0.7rem';
                star.style.lineHeight = '1';
                star.style.color = state.attendance.memos[memoKey].color || 'blue';
                star.title = state.attendance.memos[memoKey].text;
                td.appendChild(star);
            }

            td.onmousedown = (e) => {
                if (e.button !== 0) return;
                isGanttDragging = true;
                ganttDragStart = nDate;
                ganttDragEnd = nDate;
                ganttDragStudent = stu;
                updateGanttDragVisuals();
                e.preventDefault();
            };

            td.onmouseenter = () => {
                if (isGanttDragging && ganttDragStudent === stu) {
                    ganttDragEnd = nDate;
                    updateGanttDragVisuals();
                } else if (!isGanttDragging) {
                    if (!isToday) td.style.background = '#f1f5f9';
                }
            };

            td.onmouseout = () => {
                if (isGanttDragging) return;

                // Holiday Check
                const dateParts = nDate.split('/');
                const holidayName = getJapaneseHolidaysCached(parseInt(dateParts[0]))[nDate];

                if (isToday) td.style.background = '#fffbeb';
                else if (holidayName || dayOfWeek === 0) td.style.background = '#fee2e2';
                else if (dayOfWeek === 6) td.style.background = '#dbeafe';
                else td.style.background = '';
            };

            td.onclick = () => {
                // If it was a multi-day selection drag, clicking should NOT auto-open the single cell modal
                // This allows the user to see the selection and then right-click.
                if (ganttDragStart && ganttDragEnd && ganttDragStart !== ganttDragEnd && ganttDragStudent === stu) {
                    return;
                }

                state.currentStudent = stu;
                if (typeof populateControls === 'function') populateControls();

                // Normal click (or same-cell drag release): clear visuals and open modal for single day
                ganttDragStart = null;
                ganttDragEnd = null;
                ganttDragStudent = null;
                updateGanttDragVisuals();

                // Open Memo Dialog instead of Period Event Modal on click
                openAttendanceMemoDialog(stu, nDate);
            };

            td.oncontextmenu = (e) => {
                e.preventDefault();
                e.stopPropagation();

                state.currentStudent = stu;
                if (typeof populateControls === 'function') populateControls();

                let s = nDate;
                let end = nDate;
                if (ganttDragStart && ganttDragEnd && ganttDragStudent === stu) {
                    s = ganttDragStart < ganttDragEnd ? ganttDragStart : ganttDragEnd;
                    end = ganttDragStart < ganttDragEnd ? ganttDragEnd : ganttDragStart;
                }

                const items = [
                    {
                        label: 'メモを編集 (★)',
                        action: () => openAttendanceMemoDialog(stu, nDate)
                    },
                    { label: '---', action: null },
                    {
                        label: '新規期間予定',
                        action: () => {
                            openAttendanceEventModal({
                                start: s,
                                end: end,
                                category: '体調不良',
                                note: '',
                                dailyNotes: {}
                            });
                        }
                    }
                ];

                // Find events in the selected/clicked range for this student
                const eventsInRange = (state.attendance.periodEvents || []).filter(pev =>
                    pev.student === stu &&
                    !(normalizeDateStr(pev.end) < s || normalizeDateStr(pev.start) > end)
                );

                if (eventsInRange.length > 0) {
                    items.push({ label: '---', action: null }); // Separator
                    eventsInRange.forEach(pev => {
                        items.push({
                            label: `編集: ${pev.text}`,
                            action: () => openAttendanceEventModal(pev)
                        });
                        items.push({
                            label: `削除: ${pev.text}`,
                            danger: true,
                            action: () => confirmAndDeletePeriodEvent(pev)
                        });
                    });
                }

                showCustomContextMenu(e, items);
                return false;
            };
            addLongPressTrigger(td);

            const container = document.createElement('div');
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            container.style.gap = '2px';
            container.style.minHeight = '36px';

            const pevList = (state.attendance.periodEvents || []).filter(pev =>
                pev.student === stu && nDate >= normalizeDateStr(pev.start) && nDate <= normalizeDateStr(pev.end)
            );

            pevList.forEach(pev => {
                const bar = document.createElement('div');
                bar.className = 'period-event-bar';
                bar.style.height = '14px';
                bar.style.lineHeight = '14px';
                bar.style.fontSize = '0.65rem';
                bar.style.color = 'white';
                bar.style.background = pev.color || '#3b82f6';
                bar.style.marginTop = '2px';
                bar.style.marginBottom = '2px';
                bar.style.overflow = 'hidden';
                bar.style.whiteSpace = 'nowrap';
                bar.style.borderRadius = '2px';

                bar.onclick = (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    state.currentStudent = stu;
                    if (typeof populateControls === 'function') populateControls();
                    openAttendanceEventModal(pev);
                };

                bar.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();

                    state.currentStudent = stu;
                    if (typeof populateControls === 'function') populateControls();

                    let s = nDate;
                    let end = nDate;
                    // Fix: Use ganttDragStart/End for Gantt view, not attendanceDragStart
                    if (ganttDragStart && ganttDragEnd && ganttDragStudent === stu) {
                        s = ganttDragStart < ganttDragEnd ? ganttDragStart : ganttDragEnd;
                        end = ganttDragStart < ganttDragEnd ? ganttDragEnd : ganttDragStart;
                    }

                    const items = [
                        {
                            label: '新規期間予定',
                            action: () => {
                                openAttendanceEventModal({
                                    start: s,
                                    end: end,
                                    category: '体調不良',
                                    note: '',
                                    dailyNotes: {}
                                });
                            }
                        },
                        { label: '編集', action: () => openAttendanceEventModal(pev) },
                        { label: '削除', danger: true, action: () => confirmAndDeletePeriodEvent(pev) }
                    ];
                    showCustomContextMenu(e, items);
                    return false;
                });

                // Prevent default touch actions that might trigger menus
                bar.style.touchAction = 'none';
                bar.style.webkitTouchCallout = 'none';
                bar.style.userSelect = 'none';
                bar.style.webkitUserSelect = 'none';

                addLongPressTrigger(bar); // Support mobile long-press

                const nStart = normalizeDateStr(pev.start);
                const nEnd = normalizeDateStr(pev.end);

                if (nDate === nStart || i === 0) {
                    bar.textContent = pev.text;
                    bar.style.paddingLeft = '4px';
                }

                if (nDate === nStart) {
                    bar.style.borderTopLeftRadius = '4px';
                    bar.style.borderBottomLeftRadius = '4px';
                    bar.style.marginLeft = '4px';
                }
                if (nDate === nEnd) {
                    bar.style.borderTopRightRadius = '4px';
                    bar.style.borderBottomRightRadius = '4px';
                    bar.style.marginRight = '4px';
                }

                bar.title = `${pev.text}${pev.note ? ': ' + pev.note : ''}`;
                container.appendChild(bar);
            });

            // Show Absences/Lates (1-8限)
            const bArea = document.createElement('div');
            bArea.style.padding = '0 4px';
            bArea.style.display = 'flex';
            bArea.style.flexDirection = 'column';
            bArea.style.gap = '1px';

            const stuRecords = (state.attendance.records[stu] || {})[nDate] || [];
            stuRecords.forEach(rec => {
                if (rec.status === "欠" || rec.status === "遅") {
                    const badge = document.createElement('div');
                    badge.style.fontSize = '0.62rem';
                    badge.style.padding = '1px 2px';
                    badge.style.borderRadius = '2px';
                    badge.style.textAlign = 'center';
                    badge.style.whiteSpace = 'nowrap';
                    badge.style.overflow = 'hidden';
                    badge.style.fontWeight = 'bold';

                    if (rec.status === "欠") {
                        badge.style.background = '#fef2f2';
                        badge.style.color = '#ef4444';
                        badge.style.border = '1px solid #fecaca';
                        badge.textContent = `${rec.p}欠`;
                    } else {
                        badge.style.background = '#fffbeb';
                        badge.style.color = '#f59e0b';
                        badge.style.border = '1px solid #fef3c7';
                        badge.textContent = `${rec.p}遅`;
                    }
                    bArea.appendChild(badge);
                }
            });

            container.appendChild(bArea);
            td.appendChild(container);
            row.appendChild(td);
        }
        body.appendChild(row);
    });
}

function populateAttendanceSubjectFilter() {
    const filter = document.getElementById('attendanceSubjectFilter');
    if (!filter) return;

    const studentName = state.currentStudent;
    const subjects = new Set();

    if (studentName && state.attendance.records[studentName]) {
        const records = state.attendance.records[studentName];
        Object.values(records).forEach(dayEvents => {
            dayEvents.forEach(ev => {
                if (ev.subj) subjects.add(ev.subj);
            });
        });
    }

    const sortedSubjects = Array.from(subjects).sort();
    const currentVal = filter.value;

    filter.innerHTML = '<option value="">-- 科目を選択 --</option>';
    sortedSubjects.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s;
        opt.textContent = s;
        filter.appendChild(opt);
    });

    if (sortedSubjects.includes(currentVal)) {
        filter.value = currentVal;
    } else if (sortedSubjects.length > 0) {
        filter.value = sortedSubjects[0];
    }
}

function handleAttendanceFileUpload(e) {
    const file = e.target.files[0];
    console.log('handleAttendanceFileUpload called, file:', file);
    if (!file) {
        console.warn('No file selected');
        return;
    }

    readFileText(file).then(text => {
        try {
            // Use robust CSV parser
            const lines = parseCSV(text).filter(row => row.length > 0 && row.some(col => col.trim()));
            console.log('Parsed lines:', lines.length);
            if (lines.length < 5) throw new Error("CSV行数が不足しています。");

            // Python Logic:
            // df = pd.read_csv(path, encoding="cp932", header=1) -> headers are line 1 (0-indexed)
            // subject_df = skiprows 2, nrows 1 -> line 2
            // teacher_df = skiprows 3, nrows 1 -> line 3
            // df_data = SKIPROWS [2,3] -> line 1 is header, line 4+ is data

            const headerRow = lines[1];
            const subjectRow = lines[2];
            const teacherRow = lines[3];
            const dataRows = lines.slice(4);

            // Find first date column (starts with YYYY/MM/DD)
            const dateRegex = /^\d{4}\/\d{1,2}\/\d{1,2}/;
            let firstDateIdx = -1;
            for (let i = 0; i < headerRow.length; i++) {
                if (dateRegex.test(headerRow[i].trim())) {
                    firstDateIdx = i;
                    break;
                }
            }

            if (firstDateIdx === -1) throw new Error("日付列が見つかりません。");
            console.log('First date column index:', firstDateIdx);

            const records = {};
            let globalMinDate = null;
            let globalMaxDate = null;

            dataRows.forEach(row => {
                if (row.length < 3) return;
                const studentName = row[2].trim(); // Name is in col 2 (0:No, 1:ID, 2:Name)
                if (!studentName) return;

                if (!records[studentName]) records[studentName] = {};

                for (let i = firstDateIdx; i < headerRow.length; i++) {
                    const dp = headerRow[i].trim();
                    if (!dp) continue;
                    const parts = dp.split(/\s+/);
                    const normalizedDate = normalizeDateStr(parts[0]);
                    const period = (parts.length > 1) ? parseInt(parseFloat(parts[1])) : 0;
                    const subject = (subjectRow[i] || "").trim();
                    const teacher = (teacherRow[i] || "").trim();
                    const status = (row[i] || "").trim();

                    if (!dateRegex.test(normalizedDate)) continue;

                    if (!records[studentName][normalizedDate]) records[studentName][normalizedDate] = [];
                    records[studentName][normalizedDate].push({
                        p: period,
                        subj: subject,
                        status: status,
                        teacher: teacher
                    });

                    // Track date range
                    const d = new Date(normalizedDate);
                    if (!isNaN(d)) {
                        if (!globalMinDate || d < globalMinDate) globalMinDate = d;
                        if (!globalMaxDate || d > globalMaxDate) globalMaxDate = d;
                    }
                }
            });

            console.log('Records built, student count:', Object.keys(records).length);
            state.attendance.records = records;
            state.attendance.fileName = file.name;
            if (globalMinDate && globalMaxDate) {
                state.attendance.periodInfo = {
                    start: globalMinDate.toISOString().split('T')[0].replace(/-/g, '/'),
                    end: globalMaxDate.toISOString().split('T')[0].replace(/-/g, '/')
                };
            }

            // Sync with master student list
            const foundNames = Object.keys(records);
            let addedNew = false;
            foundNames.forEach(name => {
                if (!state.students.includes(name)) {
                    state.students.push(name);
                    addedNew = true;
                }
            });

            if (addedNew) {
                state.students.sort();
                if (typeof populateControls === 'function') populateControls();
            }

            // Update Source Info for Attendance
            state.sourceInfo.attendance = {
                startDate: state.attendance.periodInfo.start,
                endDate: state.attendance.periodInfo.end,
                count: Object.keys(records).length,
                date: new Date().toISOString(),
                filename: file.name
            };

            saveSessionState();
            console.log('Attendance data saved, initializing...');
            initAttendance();
            updateSourceSummaryDisplay();
            alert('出欠データを読み込みました。');
        } catch (err) {
            console.error('CSV parsing error:', err);
            alert('CSVの解析に失敗しました: ' + err.message);
        }
    }).catch(err => {
        console.error('File read error:', err);
        alert('ファイルの読み込みに失敗しました: ' + err.message);
    }).finally(() => {
        console.log('Resetting file input');
        e.target.value = '';
    });
}

function renderAttendanceCalendar() {
    const grid = document.getElementById('attendanceCalendarGrid');
    if (!grid) return;
    grid.innerHTML = '';

    // Cleanup drag state on new render
    grid.onmouseleave = () => {
        if (!isAttendanceDragging) {
            attendanceDragStart = null;
            attendanceDragEnd = null;
        }
    };

    const studentName = state.currentStudent;
    if (!studentName || !state.attendance.records[studentName]) {
        grid.innerHTML = '<div style="grid-column: span 7; padding: 3rem; text-align: center; color: #94a3b8; background: white;">学生を選択するか、データを読み込んでください。</div>';
        return;
    }

    const monthStr = document.getElementById('attendanceMonthSelect').value;
    const monthNum = parseInt(monthStr.replace("月", ""));
    // Detect year: look at periodInfo or use current year
    let year = new Date().getFullYear();
    if (state.attendance.periodInfo.start) {
        year = parseInt(state.attendance.periodInfo.start.split('/')[0]);
        // If month is Jan-Mar, and start is Apr, year might need adjustment
        if (monthNum < 4 && state.attendance.periodInfo.start.includes('/04/')) {
            year += 1;
        }
    }

    const firstDay = new Date(year, monthNum - 1, 1);
    const lastDay = new Date(year, monthNum, 0);

    // Day offset (0:Mon, ..., 6:Sun)
    let startOffset = firstDay.getDay();
    startOffset = (startOffset === 0) ? 6 : startOffset - 1;

    // Empty cells at start
    for (let i = 0; i < startOffset; i++) {
        const cell = document.createElement('div');
        cell.style.background = '#f1f5f9';
        cell.style.minHeight = '100px';
        grid.appendChild(cell);
    }

    const records = state.attendance.records[studentName] || {};
    const periodEvents = (state.attendance.periodEvents || []).filter(ev => ev.student === studentName);

    // Fetch holidays for the current year
    const holidays = getJapaneseHolidaysCached(year);

    for (let d = 1; d <= lastDay.getDate(); d++) {
        const dateStr = `${year}/${monthNum.toString().padStart(2, '0')}/${d.toString().padStart(2, '0')}`;
        const dayEvents = records[dateStr] || [];
        const dayOfWeek = new Date(year, monthNum - 1, d).getDay(); // 0:Sun
        const currentDate = new Date(year, monthNum - 1, d);
        const holidayName = holidays[dateStr];

        const cell = document.createElement('div');
        cell.className = 'calendar-day-cell';
        cell.dataset.date = dateStr;
        cell.style.background = 'white';
        if (dayOfWeek === 6) cell.style.background = '#dbeafe'; // Sat (Blue 100)
        if (dayOfWeek === 0 || holidayName) cell.style.background = '#fee2e2'; // Sun or Holiday (Red 100)
        cell.style.minHeight = '100px';
        cell.style.padding = '0.4rem';
        cell.style.border = '1px solid #e2e8f0';
        cell.style.display = 'flex';
        cell.style.flexDirection = 'column';
        cell.style.gap = '2px';
        cell.style.cursor = 'pointer';
        cell.style.position = 'relative';
        if (holidayName) cell.title = holidayName;

        // Drag events
        cell.onmousedown = (e) => {
            if (e.target.closest('.period-event-bar')) return; // Don't drag if clicking event bar
            if (e.button !== 0) return; // Only left click
            isAttendanceDragging = true;
            attendanceDragStart = dateStr;
            attendanceDragEnd = dateStr;
            updateAttendanceDragVisuals();
            e.preventDefault();
        };
        cell.onmouseenter = () => {
            if (isAttendanceDragging) {
                attendanceDragEnd = dateStr;
                updateAttendanceDragVisuals();
            }
        };

        // Date Header
        const header = document.createElement('div');
        header.style.fontSize = '0.75rem';
        header.style.fontWeight = 'bold';
        header.style.marginBottom = '2px';
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';

        const dateLabel = document.createElement('span');
        dateLabel.textContent = d;
        if (dayOfWeek === 6) dateLabel.style.color = '#3b82f6';
        if (dayOfWeek === 0 || holidayName) dateLabel.style.color = '#ef4444';
        header.appendChild(dateLabel);

        // Memo Star
        const memoKey = `${studentName}_${dateStr}`;
        if (state.attendance.memos[memoKey]) {
            const star = document.createElement('span');
            star.style.color = state.attendance.memos[memoKey].color || 'blue';
            star.textContent = '★';
            star.title = state.attendance.memos[memoKey].text;
            header.appendChild(star);
        }
        cell.appendChild(header);

        // Render Period Events
        periodEvents.forEach((pev, pidx) => {
            const startStr = pev.start;
            const endStr = pev.end;

            // Normalize for comparison
            const realStart = startStr < endStr ? startStr : endStr;
            const realEnd = startStr < endStr ? endStr : startStr;

            if (dateStr >= realStart && dateStr <= realEnd) {
                const bar = document.createElement('div');
                bar.className = 'period-event-bar';
                bar.style.height = '14px';
                bar.style.background = pev.color || '#3b82f6';
                bar.style.color = 'white';
                bar.style.fontSize = '0.65rem';
                bar.style.padding = '0 4px';
                bar.style.borderRadius = '2px';
                bar.style.marginBottom = '2px';
                bar.style.display = 'flex';
                bar.style.alignItems = 'center';
                bar.style.position = 'relative';
                bar.style.zIndex = '1';
                bar.style.overflow = 'hidden';
                bar.style.textOverflow = 'ellipsis';
                bar.style.whiteSpace = 'nowrap';

                // Show text only on first day or if space allows
                if (dateStr === realStart) {
                    bar.textContent = pev.text;
                    bar.style.borderTopLeftRadius = '4px';
                    bar.style.borderBottomLeftRadius = '4px';
                }

                if (dateStr === realEnd) {
                    bar.style.borderTopRightRadius = '4px';
                    bar.style.borderBottomRightRadius = '4px';
                    // Arrow character or shape
                    const arrow = document.createElement('span');
                    arrow.innerHTML = '&nbsp;&#9654;'; // Triangle right
                    arrow.style.marginLeft = 'auto';
                    bar.appendChild(arrow);
                }

                addLongPressTrigger(bar); // Enable mobile long-press support

                bar.style.userSelect = 'none'; // Improve long-press on mobile
                bar.style.webkitUserSelect = 'none';

                // Use click, right click (or long press) for edit
                bar.onclick = (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    openAttendanceEventModal(pev);
                };

                // Use addEventListener for better reliability
                // Use addEventListener for better reliability
                bar.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();

                    state.currentStudent = studentName; // Ensure student context
                    if (typeof populateControls === 'function') populateControls();

                    // Determine range for "New"
                    let s = dateStr;
                    let end = dateStr;
                    if (attendanceDragStart && attendanceDragEnd) {
                        s = attendanceDragStart < attendanceDragEnd ? attendanceDragStart : attendanceDragEnd;
                        end = attendanceDragStart < attendanceDragEnd ? attendanceDragEnd : attendanceDragStart;
                    }

                    const items = [
                        {
                            label: '新規期間予定',
                            action: () => {
                                openAttendanceEventModal({
                                    start: s,
                                    end: end,
                                    category: '体調不良',
                                    note: '',
                                    dailyNotes: {}
                                });
                            }
                        },
                        { label: '編集', action: () => openAttendanceEventModal(pev) },
                        { label: '削除', danger: true, action: () => confirmAndDeletePeriodEvent(pev) }
                    ];
                    showCustomContextMenu(e, items);
                    return false;
                });

                // Prevent default touch actions that might trigger menus
                bar.style.touchAction = 'none';
                bar.style.webkitTouchCallout = 'none';

                // Note: We do NOT stop mousedown propagation here because
                // the parent cell's mousedown handler has a check:
                // if (e.target.closest('.period-event-bar')) return;
                // Stopping it might interfere with browser context-menu generation logic in some envs.
                if (pev.note) bar.title = pev.note;
                cell.appendChild(bar);
            }
        });

        // Sort events by period
        dayEvents.sort((a, b) => a.p - b.p);

        dayEvents.forEach(ev => {
            if (ev.status === "-") return; // Skip if no record (-)

            const item = document.createElement('div');
            item.className = 'att-record-item';
            item.style.fontSize = '0.7rem';
            item.style.lineHeight = '1.1';
            item.style.whiteSpace = 'nowrap';
            item.style.overflow = 'hidden';
            item.style.textOverflow = 'ellipsis';

            let color = '#475569';
            if (ev.status === "欠") {
                color = '#ef4444';
                item.classList.add('status-bad');
            } else if (ev.status === "遅") {
                color = '#f59e0b';
                item.classList.add('status-bad');
            } else if (ev.status === "早") {
                color = '#10b981';
            } else if (ev.status === "休講") {
                color = '#94a3b8';
            }

            item.style.color = color;
            const statusDisp = ev.status ? `(${ev.status})` : '';
            item.textContent = `${ev.p}:${ev.subj}${statusDisp}`;
            cell.appendChild(item);
        });

        cell.onclick = (e) => {
            // Keep selection if it was a multi-day drag
            if (attendanceDragStart && attendanceDragEnd && attendanceDragStart !== attendanceDragEnd) {
                return;
            }

            state.currentStudent = studentName; // Ensure correct student context
            if (typeof populateControls === 'function') populateControls();

            // Normal click: open memo and clear previous drag selection
            attendanceDragStart = null;
            attendanceDragEnd = null;
            updateAttendanceDragVisuals();

            openAttendanceMemoDialog(studentName, dateStr);
        };

        cell.oncontextmenu = (e) => {
            e.preventDefault();
            e.stopPropagation();

            state.currentStudent = studentName; // Ensure student context is updated
            if (typeof populateControls === 'function') populateControls();

            let s = dateStr;
            let end = dateStr;
            if (attendanceDragStart && attendanceDragEnd) {
                s = attendanceDragStart < attendanceDragEnd ? attendanceDragStart : attendanceDragEnd;
                end = attendanceDragStart < attendanceDragEnd ? attendanceDragEnd : attendanceDragStart;
            }

            const items = [
                {
                    label: '新規期間予定',
                    action: () => {
                        openAttendanceEventModal({
                            start: s,
                            end: end,
                            category: '体調不良',
                            note: '',
                            dailyNotes: {}
                        });
                    }
                }
            ];

            // Find events in the selected/clicked range for this student
            const eventsInRange = (state.attendance.periodEvents || []).filter(pev =>
                pev.student === studentName &&
                !(normalizeDateStr(pev.end) < s || normalizeDateStr(pev.start) > end)
            );

            if (eventsInRange.length > 0) {
                items.push({ label: '---', action: null }); // Separator
                eventsInRange.forEach(pev => {
                    items.push({
                        label: `編集: ${pev.text}`,
                        action: () => openAttendanceEventModal(pev)
                    });
                    items.push({
                        label: `削除: ${pev.text}`,
                        danger: true,
                        action: () => confirmAndDeletePeriodEvent(pev)
                    });
                });
            }

            showCustomContextMenu(e, items);
            return false;
        };
        addLongPressTrigger(cell); // Support mobile long-press
        grid.appendChild(cell);
    }

    // Global mouseup consolidated in setupEventListeners
}

function openAttendanceEventModal(pev = null) {
    if (!pev) return; // Guard against null call

    // Every clicked event should be editable/deletable if it's already in the records
    const isEdit = pev && (pev.id || (state.attendance.periodEvents && state.attendance.periodEvents.includes(pev)));
    const modal = document.getElementById('attendanceEventModal');
    if (!modal) return;

    // Fill basic fields
    document.getElementById('attEventModalTitle').textContent = isEdit ? 'イベントの編集' : 'イベントの追加';
    document.getElementById('attEventId').value = isEdit ? (pev.id || 'temp-' + Date.now()) : '';

    // Show student name (respecting display mode)
    const nameEl = document.getElementById('attEventStudentNameValue');
    if (nameEl) {
        nameEl.textContent = getDisplayName(state.currentStudent);
    }

    // Convert YYYY/MM/DD to YYYY-MM-DD for input[type=date]
    if (pev.start) document.getElementById('attEventStartDate').value = pev.start.replace(/\//g, '-');
    if (pev.end) document.getElementById('attEventEndDate').value = pev.end.replace(/\//g, '-');
    document.getElementById('attEventDeleteBtn').style.display = isEdit ? 'flex' : 'none';

    // Internal state for daily notes from original pev
    window.currentAttEventDailyNotes = pev.dailyNotes || {};

    updateAttEventModalDates(false); // Update count and notes container

    // Category and Notes
    const category = pev.category || '体調不良';
    document.getElementById('attEventCategory').value = category;
    document.getElementById('attEventNote').value = pev.note || '';

    // Custom Label Logic
    const customArea = document.getElementById('attEventCustomLabelArea');
    if (category === 'その他') {
        customArea.style.display = 'block';
        document.getElementById('attEventCustomLabel').value = pev.text || '';
    } else {
        customArea.style.display = 'none';
        document.getElementById('attEventCustomLabel').value = '';
    }

    modal.classList.add('open');
}

function updateAttEventModalDates(preserveInputs = true) {
    const startStr = document.getElementById('attEventStartDate').value;
    const endStr = document.getElementById('attEventEndDate').value;
    if (!startStr || !endStr) return;

    // Preserve already typed notes in current session
    if (preserveInputs) {
        document.querySelectorAll('.daily-note-input').forEach(input => {
            if (!window.currentAttEventDailyNotes) window.currentAttEventDailyNotes = {};
            window.currentAttEventDailyNotes[input.dataset.date] = input.value.trim();
        });
    }

    const sDate = new Date(startStr);
    const eDate = new Date(endStr);
    const dMin = sDate < eDate ? sDate : eDate;
    const dMax = sDate < eDate ? eDate : sDate;

    // Calculate days
    const diffTime = Math.abs(dMax - dMin);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    document.getElementById('attEventDaysCount').textContent = `${diffDays} 日`;

    // Regenerate daily notes
    const container = document.getElementById('attEventDailyNotesContainer');
    container.innerHTML = '';

    let current = new Date(dMin);
    const dailyData = window.currentAttEventDailyNotes || {};

    for (let i = 0; i < diffDays; i++) {
        const dStr = current.getFullYear() + '/' + (current.getMonth() + 1).toString().padStart(2, '0') + '/' + current.getDate().toString().padStart(2, '0');
        const noteVal = dailyData[dStr] || '';

        const row = document.createElement('div');
        row.style.display = 'grid';
        row.style.gridTemplateColumns = '100px 1fr';
        row.style.gap = '0.5rem';
        row.style.alignItems = 'center';

        const label = document.createElement('div');
        label.style.fontSize = '0.85rem';
        label.style.color = '#475569';
        label.textContent = dStr.split('/').slice(1).join('/') + ' (' + ['日', '月', '火', '水', '木', '金', '土'][current.getDay()] + ')';

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'input-field daily-note-input';
        input.dataset.date = dStr;
        input.value = noteVal;
        input.placeholder = 'メモ...';
        input.style.padding = '0.4rem';

        row.appendChild(label);
        row.appendChild(input);
        container.appendChild(row);

        current.setDate(current.getDate() + 1);
    }
}

function updateAttEventColorHint() {
    const select = document.getElementById('attEventCategory');
    const customArea = document.getElementById('attEventCustomLabelArea');
    const preview = document.getElementById('attEventColorPreview');

    // Update color preview circle
    const color = select.options[select.selectedIndex].dataset.color;
    if (preview && color) {
        preview.style.background = color;
    }

    if (select.value === 'その他') {
        customArea.style.display = 'block';
    } else {
        customArea.style.display = 'none';
    }
}

function saveAttendancePeriodEvent() {
    const studentName = state.currentStudent;
    if (!studentName) return;

    const id = document.getElementById('attEventId').value;
    const startInput = document.getElementById('attEventStartDate').value;
    const endInput = document.getElementById('attEventEndDate').value;
    if (!startInput || !endInput) return;

    // Normalize YYYY-MM-DD to YYYY/MM/DD
    const start = startInput.replace(/-/g, '/');
    const end = endInput.replace(/-/g, '/');
    const actualStart = start < end ? start : end;
    const actualEnd = start < end ? end : start;

    const category = document.getElementById('attEventCategory').value;
    const customLabel = document.getElementById('attEventCustomLabel').value.trim();
    const note = document.getElementById('attEventNote').value.trim();

    // Collect daily notes
    const dailyNotes = {};
    document.querySelectorAll('.daily-note-input').forEach(input => {
        if (input.value.trim()) {
            dailyNotes[input.dataset.date] = input.value.trim();
        }
    });

    if (!start || !end) return;

    const select = document.getElementById('attEventCategory');
    const color = select.options[select.selectedIndex].dataset.color || '#3b82f6';

    let text = category;
    if (category === 'その他' && customLabel) {
        text = customLabel;
    }

    if (!state.attendance.periodEvents) state.attendance.periodEvents = [];

    const eventData = {
        id: id || Date.now().toString(),
        student: studentName,
        start: actualStart,
        end: actualEnd,
        text: text,
        category: category,
        color: color,
        note: note,
        dailyNotes: dailyNotes
    };

    if (id) {
        // Edit
        // Find by ID or by object reference if ID was missing
        let idx = state.attendance.periodEvents.findIndex(ev => ev.id === id);
        if (idx === -1) {
            // Fallback for old events without IDs
            idx = state.attendance.periodEvents.findIndex(ev => ev.student === studentName && ev.start === eventData.start && ev.text === eventData.text);
        }
        if (idx !== -1) state.attendance.periodEvents[idx] = eventData;
        else state.attendance.periodEvents.push(eventData);
    } else {
        // Add
        state.attendance.periodEvents.push(eventData);
    }

    saveSessionState();
    document.getElementById('attendanceEventModal').classList.remove('open');
    renderAttendanceCalendar();
    renderClassAttendanceStats();
}

function deleteAttendancePeriodEvent() {
    const id = document.getElementById('attEventId').value;
    const start = document.getElementById('attEventStartDate').value.replace(/-/g, '/');
    const studentName = state.currentStudent;

    if (confirm('この期間予定を完全に削除しますか？')) {
        if (id) {
            state.attendance.periodEvents = state.attendance.periodEvents.filter(ev => ev.id !== id);
        } else {
            // Fallback for old events without IDs
            state.attendance.periodEvents = state.attendance.periodEvents.filter(ev =>
                !(ev.student === studentName && ev.start === start)
            );
        }
        saveSessionState();
        document.getElementById('attendanceEventModal').classList.remove('open');
        renderAttendanceCalendar();
        renderClassAttendanceStats();
    }
}

function updateAttendanceDragVisuals() {
    const cells = document.querySelectorAll('.calendar-day-cell');
    if (!attendanceDragStart || !attendanceDragEnd) {
        cells.forEach(c => c.classList.remove('dragging-range'));
        return;
    }
    const s = attendanceDragStart < attendanceDragEnd ? attendanceDragStart : attendanceDragEnd;
    const e = attendanceDragStart < attendanceDragEnd ? attendanceDragEnd : attendanceDragStart;

    cells.forEach(cell => {
        const d = cell.dataset.date;
        if (d >= s && d <= e) {
            cell.classList.add('dragging-range');
        } else {
            cell.classList.remove('dragging-range');
        }
    });
}

function updateGanttDragVisuals() {
    const cells = document.querySelectorAll('.gantt-day-cell');
    if (!ganttDragStart || !ganttDragEnd || !ganttDragStudent) {
        cells.forEach(c => c.classList.remove('dragging-range'));
        return;
    }
    const s = ganttDragStart < ganttDragEnd ? ganttDragStart : ganttDragEnd;
    const e = ganttDragStart < ganttDragEnd ? ganttDragEnd : ganttDragStart;

    cells.forEach(cell => {
        if (cell.dataset.student === ganttDragStudent) {
            const d = cell.dataset.date;
            if (d >= s && d <= e) {
                cell.classList.add('dragging-range');
            } else {
                cell.classList.remove('dragging-range');
            }
        } else {
            cell.classList.remove('dragging-range');
        }
    });
}

function toggleAttendanceBadOnlyMode() {
    const isChecked = document.getElementById('attFilterBadOnly').checked;
    const grid = document.getElementById('attendanceCalendarGrid');
    if (grid) {
        if (isChecked) {
            grid.classList.add('filter-bad-only');
        } else {
            grid.classList.remove('filter-bad-only');
        }
    }
}

function openAttendanceMemoDialog(studentName, dateStr) {
    const key = `${studentName}_${dateStr}`;
    const existing = state.attendance.memos[key] || { text: "", color: "blue" };

    const text = prompt(`${dateStr} のメモを入力してください:`, existing.text);
    if (text === null) return;

    if (text.trim() === "") {
        delete state.attendance.memos[key];
    } else {
        const color = confirm('色を赤にしますか？ (キャンセルで青)') ? 'red' : 'blue';
        state.attendance.memos[key] = { text: text, color: color };
    }

    saveSessionState();
    renderAttendanceCalendar();
    if (state.currentTab === 'class_attendance_stats') {
        renderClassAttendanceStats();
    }
}

function renderAttendanceStats() {
    const tbody = document.getElementById('attendanceStatsBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const studentName = state.currentStudent;
    if (!studentName || !state.attendance.records[studentName]) return;

    const monthStr = document.getElementById('attendanceMonthSelect').value;
    const monthNum = parseInt(monthStr.replace("月", ""));
    const records = state.attendance.records[studentName];

    // Aggregation: Subject -> { teacher, month: { abs, lat, early, total }, cumulative: { abs, lat, early, total } }
    const stats = {};

    Object.keys(records).forEach(dStr => {
        const isCurrentMonth = parseInt(dStr.split('/')[1]) === monthNum;
        records[dStr].forEach(ev => {
            if (!ev.subj) return;
            if (!stats[ev.subj]) {
                stats[ev.subj] = {
                    teacher: ev.teacher || "-",
                    month: { abs: 0, lat: 0, early: 0, total: 0 },
                    cumulative: { abs: 0, lat: 0, early: 0, total: 0 }
                };
            }

            const s = stats[ev.subj];
            if (ev.status === "欠") {
                s.cumulative.abs++;
                s.cumulative.total++;
                if (isCurrentMonth) {
                    s.month.abs++;
                    s.month.total++;
                }
            } else if (ev.status === "遅") {
                s.cumulative.lat++;
                s.cumulative.total++;
                if (isCurrentMonth) {
                    s.month.lat++;
                    s.month.total++;
                }
            } else if (ev.status === "早") {
                s.cumulative.early++;
                s.cumulative.total++;
                if (isCurrentMonth) {
                    s.month.early++;
                    s.month.total++;
                }
            }
        });
    });

    const sortedSubjects = Object.keys(stats).sort();
    sortedSubjects.forEach(s => {
        const st = stats[s];

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="font-weight: 600;">${s}</td>
            <td style="color: #64748b; font-size: 0.8rem;">${st.teacher}</td>
            <!-- Monthly -->
            <td style="text-align:center; color:#ef4444; border-left: 1px solid #e2e8f0;">${st.month.abs || ""}</td>
            <td style="text-align:center; color:#f59e0b;">${st.month.lat || ""}</td>
            <td style="text-align:center; color:#10b981;">${st.month.early || ""}</td>
            <td style="text-align:center; font-weight:700; background:#f0f9ff; color:#1e40af;">${st.month.total || ""}</td>
            <!-- Cumulative -->
            <td style="text-align:center; color:#ef4444; border-left: 2px solid #e2e8f0;">${st.cumulative.abs}</td>
            <td style="text-align:center; color:#f59e0b;">${st.cumulative.lat}</td>
            <td style="text-align:center; color:#10b981;">${st.cumulative.early}</td>
            <td style="text-align:center; font-weight:700; background:#fdfaf0; color:#92400e;">${st.cumulative.total}</td>
        `;
        tbody.appendChild(tr);
    });

    if (tbody.innerHTML === '') {
        tbody.innerHTML = '<tr><td colspan="10" style="text-align:center; padding: 2rem; color:#94a3b8;">出欠データはありません。</td></tr>';
    }
}

function renderCumulativeAttendanceChart() {
    const ctxEl = document.getElementById('cumulativeAttendanceChart');
    if (!ctxEl) return;
    const ctx = ctxEl.getContext('2d');
    if (attendanceChartInstance) attendanceChartInstance.destroy();

    const studentName = state.currentStudent;
    if (!studentName || !state.attendance.records[studentName]) {
        // Clear chart if no data
        return;
    }

    const records = state.attendance.records[studentName];
    const sortedDates = Object.keys(records).sort();

    const labels = [];
    const cumulativeAbsents = [];
    const cumulativeLates = [];

    let totalAbsents = 0;
    let totalLates = 0;

    sortedDates.forEach(dateStr => {
        labels.push(dateStr);
        let dayAbs = 0;
        let dayLat = 0;
        (records[dateStr] || []).forEach(ev => {
            if (ev.status === "欠") dayAbs++;
            else if (ev.status === "遅") dayLat++;
        });
        totalAbsents += dayAbs;
        totalLates += dayLat;
        cumulativeAbsents.push(totalAbsents);
        cumulativeLates.push(totalLates);
    });

    attendanceChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: '累積欠席 (Cumulative Absents)',
                    data: cumulativeAbsents,
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    fill: true,
                    tension: 0.2,
                    pointRadius: 2
                },
                {
                    label: '累積遅刻 (Cumulative Lates)',
                    data: cumulativeLates,
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    fill: true,
                    tension: 0.2,
                    pointRadius: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            scales: {
                x: {
                    display: true,
                    title: { display: false },
                    ticks: {
                        autoSkip: true,
                        maxRotation: 0,
                        callback: function (val, index) {
                            // Show month/day for cleaner labels
                            const d = labels[index];
                            return d.substring(5);
                        }
                    },
                    grid: { display: false }
                },
                y: {
                    beginAtZero: true,
                    suggestedMax: 15,
                    title: { display: true, text: '累積回数' },
                    ticks: { stepSize: 1 }
                }
            },
            plugins: {
                legend: { position: 'top', align: 'end' },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `${context.dataset.label}: ${context.parsed.y} 回`;
                        }
                    }
                }
            }
        }
    });
}

function renderSubjectAttendanceChart() {
    const ctxEl = document.getElementById('subjectAttendanceChart');
    if (!ctxEl) return;
    const ctx = ctxEl.getContext('2d');
    if (subjectAttendanceChartInstance) subjectAttendanceChartInstance.destroy();

    const studentName = state.currentStudent;
    const subjectName = document.getElementById('attendanceSubjectFilter')?.value;

    if (!studentName || !subjectName || !state.attendance.records[studentName]) {
        // Clear if not possible to render
        return;
    }

    const records = state.attendance.records[studentName];
    const sortedDates = Object.keys(records).sort();

    const labels = [];
    const cumulativeAbsents = [];
    const cumulativeLates = [];

    let totalAbsents = 0;
    let totalLates = 0;

    sortedDates.forEach(dateStr => {
        let dayAbs = 0;
        let dayLat = 0;
        let hasEvent = false;

        (records[dateStr] || []).forEach(ev => {
            if (ev.subj === subjectName) {
                hasEvent = true;
                if (ev.status === "欠") dayAbs++;
                else if (ev.status === "遅") dayLat++;
            }
        });

        if (hasEvent || dayAbs > 0 || dayLat > 0) {
            labels.push(dateStr);
            totalAbsents += dayAbs;
            totalLates += dayLat;
            cumulativeAbsents.push(totalAbsents);
            cumulativeLates.push(totalLates);
        }
    });

    if (labels.length === 0) return;

    subjectAttendanceChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: `累積欠席 [${subjectName}]`,
                    data: cumulativeAbsents,
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    fill: true,
                    tension: 0.2,
                    pointRadius: 3
                },
                {
                    label: `累積遅刻 [${subjectName}]`,
                    data: cumulativeLates,
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    fill: true,
                    tension: 0.2,
                    pointRadius: 3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            scales: {
                x: {
                    display: true,
                    ticks: {
                        autoSkip: true,
                        maxRotation: 0,
                        callback: function (val, index) {
                            return labels[index].substring(5); // MM/DD
                        }
                    },
                    grid: { display: false }
                },
                y: {
                    beginAtZero: true,
                    suggestedMax: 15,
                    title: { display: true, text: '累積回数' },
                    ticks: { stepSize: 1 }
                }
            },
            plugins: {
                legend: { position: 'top', align: 'end' },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `${context.dataset.label}: ${context.parsed.y} 回`;
                        }
                    }
                }
            }
        }
    });
}

function renderDayAttendanceChart() {
    const ctxEl = document.getElementById('dayAttendanceChart');
    if (!ctxEl) return;
    const ctx = ctxEl.getContext('2d');
    if (dayAttendanceChartInstance) dayAttendanceChartInstance.destroy();

    const studentName = state.currentStudent;
    const targetDay = parseInt(document.getElementById('attendanceDayFilter')?.value || "1"); // 0:Sun, 1:Mon...

    if (!studentName || !state.attendance.records[studentName]) return;

    const records = state.attendance.records[studentName];
    const sortedDates = Object.keys(records).sort();

    const labels = [];
    const cumulativeAbsents = [];
    const cumulativeLates = [];

    let totalAbsents = 0;
    let totalLates = 0;

    sortedDates.forEach(dateStr => {
        const d = new Date(dateStr);
        if (d.getDay() !== targetDay) return;

        labels.push(dateStr);
        let dayAbs = 0;
        let dayLat = 0;
        (records[dateStr] || []).forEach(ev => {
            if (ev.status === "欠") dayAbs++;
            else if (ev.status === "遅") dayLat++;
        });
        totalAbsents += dayAbs;
        totalLates += dayLat;
        cumulativeAbsents.push(totalAbsents);
        cumulativeLates.push(totalLates);
    });

    if (labels.length === 0) return;

    const dayNames = ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"];

    dayAttendanceChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: `累積欠席 [${dayNames[targetDay]}]`,
                    data: cumulativeAbsents,
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    fill: true,
                    tension: 0.2,
                    pointRadius: 3
                },
                {
                    label: `累積遅刻 [${dayNames[targetDay]}]`,
                    data: cumulativeLates,
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    fill: true,
                    tension: 0.2,
                    pointRadius: 3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            scales: {
                x: {
                    display: true,
                    ticks: {
                        autoSkip: true,
                        maxRotation: 0,
                        callback: function (val, index) {
                            return labels[index].substring(5); // MM/DD
                        }
                    },
                    grid: { display: false }
                },
                y: {
                    beginAtZero: true,
                    suggestedMax: 15,
                    title: { display: true, text: '累積回数' },
                    ticks: { stepSize: 1 }
                }
            },
            plugins: {
                legend: { position: 'top', align: 'end' },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `${context.dataset.label}: ${context.parsed.y} 回`;
                        }
                    }
                }
            }
        }
    });
}

function renderPeriodAttendanceChart() {
    const ctxEl = document.getElementById('periodAttendanceChart');
    if (!ctxEl) return;
    const ctx = ctxEl.getContext('2d');
    if (periodAttendanceChartInstance) periodAttendanceChartInstance.destroy();

    const studentName = state.currentStudent;
    const targetPeriod = parseInt(document.getElementById('attendancePeriodFilter')?.value || "1");

    if (!studentName || !state.attendance.records[studentName]) return;

    const records = state.attendance.records[studentName];
    const sortedDates = Object.keys(records).sort();

    const labels = [];
    const cumulativeAbsents = [];
    const cumulativeLates = [];

    let totalAbsents = 0;
    let totalLates = 0;

    sortedDates.forEach(dateStr => {
        const eventsForPeriod = (records[dateStr] || []).filter(ev => ev.p === targetPeriod);
        if (eventsForPeriod.length === 0) return;

        labels.push(dateStr);
        let dayAbs = 0;
        let dayLat = 0;
        eventsForPeriod.forEach(ev => {
            if (ev.status === "欠") dayAbs++;
            else if (ev.status === "遅") dayLat++;
        });
        totalAbsents += dayAbs;
        totalLates += dayLat;
        cumulativeAbsents.push(totalAbsents);
        cumulativeLates.push(totalLates);
    });

    if (labels.length === 0) return;

    periodAttendanceChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: `累積欠席 [${targetPeriod}限]`,
                    data: cumulativeAbsents,
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    fill: true,
                    tension: 0.2,
                    pointRadius: 3
                },
                {
                    label: `累積遅刻 [${targetPeriod}限]`,
                    data: cumulativeLates,
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    fill: true,
                    tension: 0.2,
                    pointRadius: 3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            scales: {
                x: {
                    display: true,
                    ticks: {
                        autoSkip: true,
                        maxRotation: 0,
                        callback: function (val, index) {
                            return labels[index].substring(5); // MM/DD
                        }
                    },
                    grid: { display: false }
                },
                y: {
                    beginAtZero: true,
                    suggestedMax: 15,
                    title: { display: true, text: '累積回数' },
                    ticks: { stepSize: 1 }
                }
            },
            plugins: {
                legend: { position: 'top', align: 'end' },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `${context.dataset.label}: ${context.parsed.y} 回`;
                        }
                    }
                }
            }
        }
    });
}

function generateClassAttendanceStats() {
    const container = document.getElementById('classAttendanceStatsContainer');
    if (!container) return;

    container.innerHTML = '<div style="padding: 2rem; text-align: center; color: #64748b;">集計中...</div>';

    setTimeout(() => {
        const studentList = getClassStudents(state.currentYear, state.currentCourse);
        const attendanceData = state.attendance.records;

        if (studentList.length === 0) {
            container.innerHTML = '<div style="padding: 2.5rem; text-align: center; color: #64748b; background: #f8fafc; border-radius: 0.5rem; border: 1px dashed #e2e8f0;">学生データが見つかりません</div>';
            return;
        }

        const stats = studentList.map(name => {
            const records = attendanceData[name] || {};
            let totalAbs = 0;
            let totalLat = 0;
            let totalEarly = 0;
            const subAbs = {};
            const subLat = {}; // { subj: { count, slots: { "Day-Period": count } } }

            Object.entries(records).forEach(([dStr, dayEvents]) => {
                const dayIdx = new Date(dStr).getDay();
                const dayLabel = ["日", "月", "火", "水", "木", "金", "土"][dayIdx];

                dayEvents.forEach(ev => {
                    if (ev.status === "欠") {
                        totalAbs++;
                        if (ev.subj) subAbs[ev.subj] = (subAbs[ev.subj] || 0) + 1;
                    }
                    else if (ev.status === "遅") {
                        totalLat++;
                        if (ev.subj) {
                            if (!subLat[ev.subj]) subLat[ev.subj] = { count: 0, slots: {} };
                            subLat[ev.subj].count++;
                            const slotKey = `${dayLabel}/${ev.p || "?"}限`;
                            subLat[ev.subj].slots[slotKey] = (subLat[ev.subj].slots[slotKey] || 0) + 1;
                        }
                    }
                    else if (ev.status === "早") totalEarly++;
                });
            });

            // Most Absent
            let maxSub = "-";
            let maxSubCount = 0;
            Object.entries(subAbs).forEach(([sub, count]) => {
                if (count > maxSubCount) {
                    maxSubCount = count;
                    maxSub = sub;
                }
            });

            // Most Late
            let maxLatSub = "-";
            let maxLatSlot = "";
            let maxLatCount = 0;
            Object.entries(subLat).forEach(([sub, data]) => {
                if (data.count > maxLatCount) {
                    maxLatCount = data.count;
                    maxLatSub = sub;
                    // Find most frequent slot for this subject
                    let topSlot = "";
                    let topSlotCount = 0;
                    Object.entries(data.slots).forEach(([slot, c]) => {
                        if (c > topSlotCount) {
                            topSlotCount = c;
                            topSlot = slot;
                        }
                    });
                    maxLatSlot = topSlot;
                }
            });

            return {
                name,
                totalAbs,
                totalLat,
                totalEarly,
                maxSub,
                maxSubCount,
                maxLatSub,
                maxLatSlot,
                maxLatCount
            };
        });

        stats.sort((a, b) => b.totalAbs - a.totalAbs);

        let minDate = null;
        let maxDate = null;
        Object.values(attendanceData).forEach(records => {
            Object.keys(records).forEach(dateStr => {
                if (!minDate || dateStr < minDate) minDate = dateStr;
                if (!maxDate || dateStr > maxDate) maxDate = dateStr;
            });
        });
        const periodStr = (minDate && maxDate) ? `${minDate} ～ ${maxDate}` : "データなし";

        let html = `
            <div style="margin-bottom: 1rem; color: #475569; font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem;">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" width="16" height="16">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                統計対象期間: ${periodStr}
            </div>
            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); overflow: hidden;">
                <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
                    <thead>
                        <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0;">
                            <th style="padding: 1rem; text-align: left; width: 180px;">氏名</th>
                            <th style="padding: 1rem; text-align: center;">合計欠席</th>
                            <th style="padding: 1rem; text-align: center;">合計遅刻</th>
                            <th style="padding: 1rem; text-align: center;">合計早退</th>
                            <th style="padding: 1rem; text-align: left;">最多欠席科目</th>
                            <th style="padding: 1rem; text-align: left;">最多遅刻科目 (曜日/時限)</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        stats.forEach((row, idx) => {
            const rowStyle = idx % 2 === 1 ? 'background: #f8fafc;' : 'background: white;';
            const absColor = row.totalAbs >= 15 ? '#ef4444' : row.totalAbs >= 10 ? '#f59e0b' : 'inherit';
            const absWeight = row.totalAbs >= 10 ? '700' : 'normal';

            html += `
                <tr style="${rowStyle} border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 0.8rem 1rem; font-weight: 600;">${getDisplayName(row.name)}</td>
                    <td style="padding: 0.8rem 1rem; text-align: center; color: ${absColor}; font-weight: ${absWeight};">${row.totalAbs}</td>
                    <td style="padding: 0.8rem 1rem; text-align: center;">${row.totalLat}</td>
                    <td style="padding: 0.8rem 1rem; text-align: center;">${row.totalEarly}</td>
                    <td style="padding: 0.8rem 1rem;">${row.maxSub} (${row.maxSubCount})</td>
                    <td style="padding: 0.8rem 1rem;">${row.maxLatSub !== "-" ? `${row.maxLatSub} (${row.maxLatSlot})` : "-"}</td>
                </tr>
            `;
        });

        html += `</tbody></table></div>`;
        container.innerHTML = html;
        if (typeof updatePrintHeader === 'function') updatePrintHeader();
    }, 10);
}

function exportClassAttendanceCsv() {
    const studentList = state.students;
    const attendanceData = state.attendance.records;

    if (studentList.length === 0) { alert('学生データがありません'); return; }

    let csvContent = "\uFEFF氏名,合計欠席,合計遅刻,合計早退,最多欠席科目,最多欠席数,最多遅刻科目,最多遅刻スロット\n";

    studentList.forEach(name => {
        const records = attendanceData[name] || {};
        let totalAbs = 0, totalLat = 0, totalEarly = 0;
        const subAbs = {}, subLat = {};

        Object.entries(records).forEach(([dStr, dayEvents]) => {
            const di = new Date(dStr).getDay();
            const dl = ["日", "月", "火", "水", "木", "金", "土"][di];
            dayEvents.forEach(ev => {
                if (ev.status === "欠") {
                    totalAbs++;
                    if (ev.subj) subAbs[ev.subj] = (subAbs[ev.subj] || 0) + 1;
                }
                else if (ev.status === "遅") {
                    totalLat++;
                    if (ev.subj) {
                        if (!subLat[ev.subj]) subLat[ev.subj] = { count: 0, slots: {} };
                        subLat[ev.subj].count++;
                        const sk = `${dl}/${ev.p || "?"}限`;
                        subLat[ev.subj].slots[sk] = (subLat[ev.subj].slots[sk] || 0) + 1;
                    }
                }
                else if (ev.status === "早") totalEarly++;
            });
        });

        let maxSub = "-", maxSubCount = 0;
        Object.entries(subAbs).forEach(([sub, count]) => { if (count > maxSubCount) { maxSubCount = count; maxSub = sub; } });

        let maxLatSub = "-", maxLatSlot = "", maxLatCount = 0;
        Object.entries(subLat).forEach(([sub, data]) => {
            if (data.count > maxLatCount) {
                maxLatCount = data.count;
                maxLatSub = sub;
                let ts = "";
                let tc = 0;
                Object.entries(data.slots).forEach(([slot, c]) => { if (c > tc) { tc = c; ts = slot; } });
                maxLatSlot = ts;
            }
        });

        csvContent += [getDisplayName(name), totalAbs, totalLat, totalEarly, maxSub, maxSubCount, maxLatSub, maxLatSlot].join(',') + "\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ClassAttendanceStats.csv`;
    link.click();
}

function updatePrintHeader() {
    const nameEl = document.getElementById('print-student-name');
    const dateEl = document.getElementById('print-date');
    const titleEl = document.getElementById('print-report-title');

    if (nameEl) nameEl.textContent = state.currentStudent ? getDisplayName(state.currentStudent) : "クラス全体";
    if (dateEl) dateEl.textContent = new Date().toLocaleDateString('ja-JP');

    if (titleEl) {
        let titleText = "成績レポート";
        switch (state.currentTab) {
            case 'stats':
            case 'stats2':
                titleText = "分析レポート (Statistics)";
                break;
            case 'attendance':
                titleText = "出欠管理レポート (Attendance)";
                break;
            case 'class_stats':
                titleText = "クラス統計レポート (Class Stats)";
                break;
            case 'seating':
                titleText = "座席配置図 (Seating Chart)";
                break;
            case 'student_summary':
                titleText = "成績のあゆみ";
                break;
        }
        titleEl.textContent = titleText;
    }

    // Add Year/Course/Class info to name line if it exists
    if (nameEl) {
        const className = getClassName();
        const studentName = state.currentStudent ? getDisplayName(state.currentStudent) : "クラス全体";
        nameEl.textContent = `${className} / ${studentName}`;
    }
}

function getClassName() {
    const year = state.currentYear;
    const course = state.currentCourse;
    const cls = state.currentClass || 1;
    if (year === 1) {
        return `${year}学年 ${cls}組（共通コース）`;
    }
    return `${year}学年 ${course ? course + 'コース' : '共通'}`;
}

function updateClassSelectVisibility() {
    const classGroup = document.getElementById('classSelectGroup');
    const classSelect = document.getElementById('classSelect');
    if (!classGroup || !classSelect) return;

    if (state.currentYear === 1 && (!state.currentCourse || state.currentCourse === "")) {
        classGroup.style.display = 'flex';
        classSelect.value = state.currentClass || '1';
    } else {
        classGroup.style.display = 'none';
    }
}

// ==================== STUDENT SUMMARY ====================

function renderStudentSummary() {
    const studentName = state.currentStudent;
    const testKey = document.getElementById('summaryTestSelect')?.value || '前期末';

    // Get year from select, fallback to current year
    const yearSelect = document.getElementById('summaryYearSelect');
    const targetYear = yearSelect ? parseInt(yearSelect.value) : state.currentYear;

    const area = document.getElementById('studentSummaryArea');
    if (!area) return;

    if (!studentName) {
        area.innerHTML = '<div style="text-align: center; padding: 5rem; color: #94a3b8;">学生を選択してください。</div>';
        return;
    }

    area.innerHTML = getStudentSummaryHtml(studentName, testKey, targetYear);
    updatePrintHeader();
}

function getStudentSummaryHtml(studentName, testKey, targetYear) {

    // A. Context from Top Menu
    const year = targetYear || state.currentYear;
    const course = state.currentCourse;
    const meta = getStudentMetadataSafe(studentName) || {};
    const studentId = getMetaValue(meta, ['学籍番号', 'id', 'OMUID', 'omuid']) || "-";
    const courseDisplay = course || "全体 (All Courses)";

    // Use student's current cohort year to find classmates for comparison
    const cohortYearStr = getMetaValue(meta, ['年', '学年', 'year', 'Grade', '年次']);
    const cohortYear = parseInt(cohortYearStr) || state.currentYear;
    const classStudents = getClassStudents(cohortYear, course);

    // Security: Ensure the viewed student is in the list for comparison even if metadata is slightly off
    if (!classStudents.includes(studentName)) {
        classStudents.push(studentName);
    }

    // B. Calculate Stats & Ranking (Class-based)
    const stats = getStudentStats(studentName, year, testKey);
    const testRankStr = calculateRank(year, testKey, studentName);
    const classOverallRankStr = calculateOverallRank(year, studentName);

    // 3. Previous Test Comparison Data
    const testCycle = ["前期中間", "前期末", "後期中間", "学年末"];
    const currentIdx = testCycle.indexOf(testKey);
    let prevStatsLine = "";
    let prevGpaLine = "";

    if (currentIdx > 0) {
        const prevTest = testCycle[currentIdx - 1];
        const prevS = getStudentStats(studentName, year, prevTest);
        const pRank = calculateRank(year, prevTest, studentName);
        const pCount = getClassStudents(year, course).length; // Total in group

        const pAvg = prevS.stats1.avg.toFixed(1);
        prevStatsLine = `<div style="font-size: 0.7rem; color: #94a3b8; margin-top: 0.1rem;">前回: ${pAvg}点 / ${pRank}/${pCount}位</div>`;
        prevGpaLine = `<span style="font-size: 0.7rem; color: #64748b; margin-left: 0.5rem; font-weight: normal;">(前回: GPA ${prevS.stats2.gpa.toFixed(2)})</span>`;
    }


    // C. Attendance Analysis (Matching At-Risk Extraction Logic)
    const records = (state.attendance && state.attendance.records) ? state.attendance.records[studentName] : {};
    let totalAbs = 0, totalLat = 0;
    const subjectAttendance = {}; // Track per subject
    const alerts = []; // For "At-Risk" items

    const datesSorted = Object.keys(records).sort((a, b) => new Date(a) - new Date(b));
    let maxStreak = 0, currentStreak = 0;
    const dowStats = {};
    const periodStats = {};

    datesSorted.forEach(dStr => {
        const dayEvents = records[dStr] || [];
        const isBadDay = dayEvents.some(ev => ev.status === "欠" || ev.status === "遅");

        if (isBadDay) currentStreak++;
        else currentStreak = 0;
        if (currentStreak > maxStreak) maxStreak = currentStreak;

        const di = new Date(dStr).getDay();
        const dl = ["日", "月", "火", "水", "木", "金", "土"][di];
        if (!dowStats[dl]) dowStats[dl] = { abs: 0, lat: 0, total: 0 };

        dayEvents.forEach(ev => {
            if (!ev.subj && !ev.subject) return;
            const subName = ev.subj || ev.subject;
            if (!subjectAttendance[subName]) subjectAttendance[subName] = { abs: 0, lat: 0, total: 0, schedule: {} };
            subjectAttendance[subName].total++;

            const pKey = ev.p || "?";
            const sk = `${dl}${pKey}限`;
            subjectAttendance[subName].schedule[sk] = (subjectAttendance[subName].schedule[sk] || 0) + 1;

            if (!periodStats[pKey]) periodStats[pKey] = { abs: 0, lat: 0, total: 0 };
            periodStats[pKey].total++;

            if (ev.status === '欠') {
                totalAbs++;
                subjectAttendance[subName].abs++;
                dowStats[dl].abs++;
                periodStats[pKey].abs++;
            } else if (ev.status === '遅') {
                totalLat++;
                subjectAttendance[subName].lat++;
                dowStats[dl].lat++;
                periodStats[pKey].lat++;
            }
            // Increment total for dow stats inside the loop to count sessions
            dowStats[dl].total++;
        });
    });

    // 1. Pattern Alert: Consecutive Days
    if (maxStreak >= 3) {
        let level = 'warning', icon = '?', label = '注意';
        if (maxStreak >= 8) { level = 'danger'; icon = '??'; label = '重度(Black)'; }
        else if (maxStreak >= 7) { level = 'danger'; icon = '??'; label = '警告(Red)'; }
        else if (maxStreak >= 5) { level = 'danger'; icon = '??'; label = '警戒(Orange)'; }
        alerts.push({ type: level, icon, msg: `行動傾向: 連続${maxStreak}日の欠席/遅刻あり (${label})` });
    }

    // 2. Pattern Alert: Day of Week Concentration
    Object.entries(dowStats).forEach(([dow, s]) => {
        const points = s.abs + s.lat * 0.5;
        const ratio = s.total > 0 ? points / s.total : 0;
        if (ratio >= 0.10) {
            alerts.push({ type: 'warning', icon: '???', msg: `行動傾向: ${dow}曜日に欠席/遅刻が集中 (欠席率: ${(ratio * 100).toFixed(0)}%)` });
        }
    });

    // 3. Pattern Alert: Period Concentration
    Object.entries(periodStats).forEach(([p, s]) => {
        const points = s.abs + s.lat * 0.5;
        const ratio = s.total > 0 ? points / s.total : 0;
        if (ratio >= 0.10) {
            let lv = 'warning', lab = '注意(10%超)', colorLevel = 'yellow';
            if (ratio >= 1 / 3) { lv = 'danger'; lab = '黒(1/3超)'; colorLevel = 'black'; }
            else if (ratio >= 0.30) { lv = 'danger'; lab = '赤(30%超)'; colorLevel = 'red'; }
            else if (ratio >= 0.20) { lv = 'danger'; lab = '橙(20%超)'; colorLevel = 'orange'; }
            alerts.push({ type: lv, colorLevel, icon: '??', msg: `行動傾向: ${p}限目の欠席/遅刻密度高 (${lab}: 欠席率 ${(ratio * 100).toFixed(0)}%)` });
        }
    });

    // D. Build UI
    let html = `
    <div class="summary-report" style="font-family: 'Inter', system-ui, sans-serif; color: #1e293b; max-width: 800px; margin: 0 auto; line-height: 1.3;">
        <!-- Header Info -->
        <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 2px solid #334155; padding-bottom: 0.1rem; margin-bottom: 0.4rem;">
            <div>
                <div style="display: flex; align-items: center; gap: 0.8rem;">
                    <h2 style="margin: 0; font-size: 1.2rem; font-weight: 800; color: #0f172a;">${getDisplayName(studentName)} <span style="font-size: 0.8rem; color: #64748b; font-weight: 400;">様</span></h2>
                    <div style="display: flex; gap: 0.4rem; padding-top: 2px;" class="no-print">
                        <a href="https://teams.microsoft.com/l/chat/0/0?users=${encodeURIComponent(getStudentEmail(studentName))}" target="_blank" title="Teamsチャットで連絡" style="display:flex; padding: 4px; background: #eef2ff; border-radius: 4px; border: 1px solid #c7d2fe;">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#4338ca" stroke-width="2" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        </a>
                        <a href="mailto:${getStudentEmail(studentName)}" title="メールを送信" style="display:flex; padding: 4px; background: #ecfeff; border-radius: 4px; border: 1px solid #a5f3fc;">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#0891b2" stroke-width="2" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        </a>
                    </div>
                </div>
                <div style="display: flex; gap: 1rem; margin-top: 0.2rem; font-size: 0.8rem; color: #475569;">
                    <span>学籍番号: <strong>${studentId}</strong></span>
                    <span>年次: <strong>${year}年</strong></span>
                    <span>所属: <strong>${courseDisplay}</strong></span>
                </div>
            </div>
            <div style="text-align: right; font-size: 0.75rem; color: #94a3b8;">
                作成日: ${new Date().toLocaleDateString('ja-JP')}
            </div>
        </div>

        <div class="student-summary-grid">
            <!-- Card 1: Scores -->
            <div style="background: #f8fafc; padding: 0.4rem; border-radius: 0.5rem; border: 1px solid #e2e8f0; text-align: center;">
                <div style="font-size: 0.65rem; color: #64748b; margin-bottom: 0px; font-weight: 600;">${testKey} 平均点</div>
                <div style="font-size: 1.4rem; font-weight: 800; color: #2563eb;">${stats.stats1.avg.toFixed(1)}<span style="font-size: 0.75rem; font-weight: 400; color: #64748b; margin-left: 0.1rem;">点</span></div>
                <div style="font-size: 0.7rem; color: #475569; margin-top: 0px;">順位: ${testRankStr}</div>
                ${prevStatsLine}
            </div>
            <!-- Card 2: Credits -->
            <div style="background: #f0fdf4; padding: 0.4rem; border-radius: 0.5rem; border: 1px solid #dcfce7; text-align: center;">
                <div style="font-size: 0.65rem; color: #166534; margin-bottom: 0px; font-weight: 600;">累積修得単位数</div>
                <div style="font-size: 1.4rem; font-weight: 800; color: #16a34a;">${stats.stats2.credits}<span style="font-size: 0.75rem; font-weight: 400; color: #166534; margin-left: 0.1rem;">単位</span></div>
                <div style="font-size: 0.7rem; color: #166534; margin-top: 0px;">GPA:${stats.stats2.gpa.toFixed(2)} ${prevGpaLine}</div>
                <div style="font-size: 0.65rem; color: #166534;">(年間: ${classOverallRankStr})</div>
            </div>
            <!-- Card 3: Attendance -->
            <div style="background: #fff7ed; padding: 0.4rem; border-radius: 0.5rem; border: 1px solid #ffedd5; text-align: center;">
                <div style="font-size: 0.65rem; color: #9a3412; margin-bottom: 0px; font-weight: 600;">欠席・遅刻状況</div>
                <div style="display: flex; justify-content: center; gap: 0.5rem; align-items: baseline; margin-top: 0.1rem;">
                    <div>
                        <span style="font-size: 1.4rem; font-weight: 800; color: #ea580c;">${totalAbs}</span>
                        <span style="font-size: 0.7rem; color: #9a3412;">欠</span>
                    </div>
                    <div style="width: 1px; height: 1rem; background: #fed7aa;"></div>
                    <div>
                        <span style="font-size: 1.4rem; font-weight: 800; color: #f59e0b;">${totalLat}</span>
                        <span style="font-size: 0.7rem; color: #9a3412;">遅</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Subject Scores Table -->
        <h3 style="font-size: 0.85rem; border-left: 4px solid #2563eb; padding-left: 0.5rem; margin-bottom: 0.3rem; margin-top: 0.3rem;">科目別成績一覧 (${testKey})</h3>
        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 0.4rem; overflow: hidden; margin-bottom: 0.5rem;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.75rem;">
                <thead>
                    <tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                        <th style="padding: 0.4rem 0.6rem; text-align: left; color: #475569;">科目名</th>
                        <th style="padding: 0.4rem 0.2rem; text-align: center; color: #475569; width: 40px;">単位</th>
                        <th style="padding: 0.4rem 0.2rem; text-align: center; color: #475569; width: 45px;">欠席</th>
                        <th style="padding: 0.4rem 0.2rem; text-align: center; color: #475569; width: 45px;">遅刻</th>
                        <th style="padding: 0.4rem 0.2rem; text-align: center; color: #475569; width: 60px;">${testKey}</th>
                        <th style="padding: 0.4rem 0.2rem; text-align: center; color: #475569; width: 60px;">クラス順位</th>
                        <th style="padding: 0.4rem 0.2rem; text-align: center; color: #475569; width: 50px;">評価</th>
                    </tr>
                </thead>
                <tbody>
`;

    // Filter subjects for the specific student and year
    // USE getTargetSubjects to ensure consistency with main view and credits calculation
    const subjects = getTargetSubjects(s => {
        // Standard year match
        if (s.year === year) return true;
        // Floater (Special Study) match
        if (s.year === 0) {
            const scoreObj = (state.scores[studentName] || {})[s.name];
            const oy = scoreObj ? scoreObj.obtainedYear : 0;
            return (oy === year || (oy === 0 && year === 1)); // Fallback to year 1 for orphans
        }
        return false;
    }).filter(s => {
        if (state.hideEmptySubjects) {
            const scoreObj = (state.scores[studentName] || {})[s.name] || {};
            const hasData = SCORE_KEYS.some(k => {
                const val = scoreObj[k];
                return val !== undefined && val !== null && val !== '';
            });
            if (!hasData) return false;
        }
        return true;
    });
    subjects.forEach(sub => {
        const score = getScore(studentName, sub.name, testKey);
        let scoreDisplay = score === null ? "-" : score;
        let evalDisplay = "-";
        let scoreStyle = "";

        if (typeof score === 'number') {
            if (score <= 59) {
                scoreStyle = "color: #ef4444; font-weight: 700;";
                evalDisplay = "D";
            } else if (score < 70) evalDisplay = "C";
            else if (score < 80) evalDisplay = "B";
            else if (score < 90) evalDisplay = "A";
            else evalDisplay = "S";
        } else if (typeof score === 'string' && score !== "") {
            evalDisplay = score; // Non-numeric pass/fail
        }

        const subAtt = subjectAttendance[sub.name] || { abs: 0, lat: 0, total: 0, schedule: {} };
        let absStyle = subAtt.abs > 0 ? "color: #ef4444; font-weight: 600;" : "color: #94a3b8;";
        let latStyle = subAtt.lat > 0 ? "color: #f59e0b; font-weight: 600;" : "color: #94a3b8;";

        // Calculate subject class rank
        const subScores = classStudents.map(s => ({
            name: s,
            val: getScore(s, sub.name, testKey)
        })).filter(x => typeof x.val === 'number');
        let subRankDisplay = "-";
        if (subScores.length > 0 && typeof score === 'number') {
            subScores.sort((a, b) => b.val - a.val);
            const sIdx = subScores.findIndex(x => x.name === studentName);
            if (sIdx !== -1) subRankDisplay = `${sIdx + 1} / ${subScores.length}`;
        }

        // Alert Logic (Matching At-Risk Criteria)
        const sched = subAtt.schedule || {};
        const typical = Object.entries(sched).sort((a, b) => b[1] - a[1])[0]?.[0] || "";
        const schedStr = typical ? ` [${typical}]` : "";

        // 1. Grades Alerts
        if (typeof score === 'number' && score <= 59.9) {
            let lv = 'warning', ic = '?', lab = '不合格';
            if (score <= 39.9) { lv = 'danger'; ic = '??'; lab = '重度不振'; }
            else if (score <= 49.9) { lv = 'danger'; ic = '??'; lab = '警戒'; }
            alerts.push({ type: lv, icon: ic, msg: `${sub.name}${schedStr}: ${score.toFixed(1)}点 (${lab})` });
        }

        // 2. Attendance Density Alerts (2 Lates = 1 Absence)
        // 2. Attendance Density Alerts (2 Lates = 1 Absence)
        const attPoints = subAtt.abs + (subAtt.lat * 0.5);
        const ratio = subAtt.total > 0 ? attPoints / subAtt.total : 0;

        if (attPoints >= 10) {
            let lv = 'warning', ic = '??', lab = '注意(10pt超)', colorLevel = 'yellow';
            if (ratio >= 1 / 3) { lv = 'danger'; lab = '黒(1/3超)'; colorLevel = 'black'; }
            else if (ratio >= 0.30) { lv = 'danger'; lab = '赤(30%超)'; colorLevel = 'red'; }
            else if (ratio >= 0.25) { lv = 'danger'; lab = '橙(25%超)'; colorLevel = 'orange'; }
            alerts.push({ type: lv, colorLevel, icon: ic, msg: `${sub.name}${schedStr}: 欠席・遅刻密度高 (${lab}: 欠席率 ${(ratio * 100).toFixed(0)}%)` });
        }
        // Removed strict 2-late warning based on user feedback (too sensitive)

        html += `
        <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 0.25rem 0.6rem; font-weight: 500;">${sub.name}</td>
            <td style="padding: 0.25rem 0.2rem; text-align: center; color: #64748b;">${sub.credits}</td>
            <td style="padding: 0.25rem 0.2rem; text-align: center; ${absStyle}">${subAtt.abs}</td>
            <td style="padding: 0.25rem 0.2rem; text-align: center; ${latStyle}">${subAtt.lat}</td>
            <td style="padding: 0.25rem 0.2rem; text-align: center; ${scoreStyle}">${scoreDisplay}</td>
            <td style="padding: 0.25rem 0.2rem; text-align: center; color: #475569;">${subRankDisplay}</td>
            <td style="padding: 0.25rem 0.2rem; text-align: center; font-weight: 600;">${evalDisplay}</td>
        </tr>
    `;
    });
    html += `
                </tbody>
            </table>
        </div>
    `;

    // E. Alerts Section (Replacing comment box)
    if (alerts.length > 0) {
        html += `
        <div style="background: #fff1f2; padding: 0.4rem 0.6rem; border-radius: 0.4rem; border: 1px solid #fecaca; margin-bottom: 0.4rem; break-inside: auto;">
            <h4 style="margin: 0 0 0.2rem 0; color: #b91c1c; font-size: 0.8rem; display: flex; align-items: center; gap: 0.3rem;">
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                要確認・注意項目 (Alerts)
            </h4>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.2rem;">
        `;
        alerts.forEach(a => {
            // Default Yellow
            let bg = '#fef3c7', tc = '#92400e', bd = '#fef08a';

            // Override based on colorLevel
            if (a.colorLevel === 'black') { bg = '#000000'; tc = '#ffffff'; bd = '#000000'; }
            else if (a.colorLevel === 'red') { bg = '#fee2e2'; tc = '#b91c1c'; bd = '#fecaca'; }
            else if (a.colorLevel === 'orange') { bg = '#ffedd5'; tc = '#c2410c'; bd = '#fed7aa'; }
            // Legacy/Fallback check
            else if (a.type === 'danger' && !a.colorLevel) { bg = '#fee2e2'; tc = '#b91c1c'; bd = '#fecaca'; }

            html += `
                <div style="display: flex; align-items: center; gap: 0.3rem; padding: 0.1rem 0.4rem; background: ${bg}; border-radius: 0.25rem; font-size: 0.65rem; color: ${tc}; font-weight: 500; border: 0.5px solid ${bd}; line-height: 1.1;">
                    <span style="font-size: 0.75rem;">${a.icon}</span> ${a.msg}
                </div>
            `;
        });
        html += `</div></div>`;
    } else {
        html += `
        <div style="background: #f0fdf4; padding: 0.5rem; border-radius: 0.4rem; border: 1px solid #dcfce7; margin-bottom: 0.6rem; text-align: center; color: #166534; font-size: 0.75rem;">
            ? 現在、要注意項目は認められません。
        </div>
        `;
    }

    html += `
        <div class="no-print" style="margin-top: 0.8rem; text-align: center; color: #94a3b8; font-size: 0.7rem;">
            ※ 本データはシステム上の登録状況を表示したものです。面談等で活用してください。
        </div>
    </div>
    `;

    return html;
}

function printAllStudentSummaries() {
    const testKey = document.getElementById('summaryTestSelect')?.value || '前期末';
    const year = state.currentYear;
    const course = state.currentCourse;

    const classStudents = state.students.filter(s => {
        const m = state.studentMetadata[s] || {};
        if (parseInt(m['年'] || m['year'] || 1) !== year) return false;
        const stCourse = (m['コース'] || m['course'] || "").trim();
        if (!course || course === "") return true;
        return stCourse === course || course.includes(stCourse) || stCourse.includes(course);
    });

    if (classStudents.length === 0) {
        alert("現在の抽出条件（学年・学科）に一致する学生がいません。");
        return;
    }

    const confirmPrint = confirm(`${classStudents.length}名分のサマリーを一括生成します。よろしいですか？\n(生成後に印刷ダイアログが開きます)`);
    if (!confirmPrint) return;

    const area = document.getElementById('studentSummaryArea');
    const originalContent = area.innerHTML;
    const originalStudent = state.currentStudent;

    let totalHtml = "";
    classStudents.forEach((student, index) => {
        // Build individual summary
        const studentHtml = getStudentSummaryHtml(student, testKey);

        // Add wrapper with page break
        totalHtml += `
            <div class="multi-print-wrapper" style="${index > 0 ? 'break-before: page; margin-top: 1rem;' : ''}">
                ${studentHtml}
            </div>
        `;
    });

    // Temporarily swap content
    area.innerHTML = totalHtml;
    updatePrintHeader();

    // Trigger print
    setTimeout(() => {
        window.print();
        // Restore
        const restore = confirm("印刷が完了しましたか？画面を元の表示に戻します。");
        if (restore) {
            state.currentStudent = originalStudent;
            renderStudentSummary();
        }
    }, 500);
}


// ==================== CLASS OFFICERS ====================



function initOfficerRoles() {
    const year = state.currentYear;

    // Migration/Normalization: Handle old array format
    if (Array.isArray(state.officerRoles)) {
        const globalRoles = state.officerRoles;
        state.officerRoles = {};
        // Duplicate global roles to typical years to prevent data loss
        [1, 2, 3, 4, 5].forEach(y => {
            state.officerRoles[y] = JSON.parse(JSON.stringify(globalRoles));
        });
    }

    if (!state.officerRoles) state.officerRoles = {};

    // Initialize current year if missing
    if (!state.officerRoles[year]) {
        // Find nearest existing year to copy from, or fallback to defaults
        const existingYears = Object.keys(state.officerRoles).map(Number).sort((a, b) => b - a);
        const sourceYear = existingYears.find(y => y < year) || existingYears[0];

        if (sourceYear) {
            state.officerRoles[year] = JSON.parse(JSON.stringify(state.officerRoles[sourceYear]));
        } else {
            state.officerRoles[year] = JSON.parse(JSON.stringify(DEFAULT_OFFICER_ROLES));
        }
    }

    const currentRoles = state.officerRoles[year];

    // Migration: Rename old category if exists
    const oldCat = currentRoles.find(c => c.category === "学生会・公的委員 (Student Council)" || c.category === "学生会・公的委員");
    if (oldCat) {
        oldCat.category = "学友会関連 (Student Association)";
    }

    return currentRoles;
}

function renderClassOfficers() {
    initOfficerRoles();
    const grid = document.getElementById('officerCategoriesGrid');
    const studentList = document.getElementById('officerStudentList');
    if (!grid || !studentList) return;

    grid.innerHTML = '';
    studentList.innerHTML = '';

    const year = state.currentYear;
    const yearOfficers = state.officers[year] || {};

    // Pre-calculate assignment counts for marks
    const assignedCounts = {};
    Object.values(yearOfficers).forEach(names => {
        if (!Array.isArray(names)) return;
        names.forEach(name => {
            assignedCounts[name] = (assignedCounts[name] || 0) + 1;
        });
    });

    // Render Student List (Draggable) - Use Sorted Roster matching current filters
    const yearStudents = getClassStudents(year, state.currentCourse);
    const rosterStudents = sortStudentsByRoster(yearStudents);
    rosterStudents.forEach(name => {
        const count = assignedCounts[name] || 0;
        const checkMark = '<span style="color: #10b981; font-weight: bold; margin-left: auto;">' + '✔'.repeat(count) + '</span>';

        const item = document.createElement('div');
        item.className = 'badge';
        item.style.cssText = 'background: white; border: 1px solid #e2e8f0; padding: 0.5rem; cursor: grab; display: flex; align-items: center; gap: 0.5rem; user-select: none;';
        item.draggable = true;
        item.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" width="14" height="14" style="color:#94a3b8;"><path stroke-linecap="round" stroke-linejoin="round" d="M4 8h16M4 16h16" /></svg>
            <span style="flex-grow:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${name}</span>
            ${count > 0 ? checkMark : ''}
        `;
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', name);
            item.style.opacity = '0.5';
        });
        item.addEventListener('dragend', () => item.style.opacity = '1');
        studentList.appendChild(item);
    });

    // Render Roles
    const currentRoles = initOfficerRoles();
    currentRoles.forEach((cat, catIdx) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.background = 'white';

        let rolesHtml = '';
        cat.roles.forEach((role, roleIdx) => {
            const assigned = yearOfficers[role.id] || [];

            rolesHtml += `
            <div id="role_target_${role.id}" class="role-drop-zone" style="padding: 1rem; border-bottom: 1px solid #f1f5f9; transition: background 0.2s;">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 0.5rem;">
                    <div style="flex-grow: 1;">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <div style="font-weight: 700; color: #1e293b; font-size: 0.95rem;">${role.name}</div>
                            <div style="display: flex; gap: 0.3rem;">
                                <span onclick="editOfficerRole(${catIdx}, ${roleIdx})" style="cursor:pointer; color: #cbd5e1; font-size: 0.8rem;" title="定義を編集">✏️</span>
                                <span onclick="deleteOfficerRole(${catIdx}, ${roleIdx})" style="cursor:pointer; color: #cbd5e1; font-size: 0.8rem;" title="役割を削除">🗑️</span>
                            </div>
                        </div>
                        <div style="font-size: 0.75rem; color: #64748b; line-height: 1.2;">${role.desc}</div>
                    </div>
                    <div style="font-size: 0.7rem; background: #f1f5f9; padding: 2px 6px; border-radius: 4px; color: #475569; white-space: nowrap;">
                        ${role.limit === 0 ? '複数名' : role.limit + '名'}
                    </div>
                </div>
                
                <div class="role-assignment-container" style="display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center; min-height: 32px; border: 1px dashed transparent; border-radius: 0.4rem;" 
                     ondragover="event.preventDefault(); this.style.borderColor='#3b82f6'; this.style.background='rgba(59, 130, 246, 0.05)';" 
                     ondragleave="this.style.borderColor='transparent'; this.style.background='transparent';"
                     ondrop="handleOfficerDrop(event, '${role.id}')">
                    ${assigned.map((name, idx2) => `
                        <div class="badge" style="background: #eef2ff; color: #4f46e5; border: 1px solid #c7d2fe; display: flex; align-items:center; gap: 0.4rem; padding: 0.3rem 0.6rem;">
                            ${name}
                            <span onclick="removeOfficer('${role.id}', ${idx2})" style="cursor:pointer; font-weight:bold; color: #94a3b8;">×</span>
                        </div>
                    `).join('')}
                    ${assigned.length === 0 ? '<div style="font-size: 0.75rem; color: #cbd5e1;">ドラッグして割り当て</div>' : ''}
                </div>
            </div>`;
        });

        card.innerHTML = `
            <div class="card-header" style="background: #f8fafc; display: flex; justify-content: space-between; align-items: center;">
                <h3 class="card-title" style="font-size: 1rem; color: #334155;">${cat.category}</h3>
            </div>
            <div style="display: flex; flex-direction: column;">
                ${rolesHtml}
            </div>
        `;
        grid.appendChild(card);
    });
}

function handleOfficerDrop(e, roleId) {
    e.preventDefault();
    const studentName = e.dataTransfer.getData('text/plain');
    if (studentName) addOfficer(roleId, studentName);

    // Reset visual state
    const target = e.currentTarget;
    if (target) {
        target.style.borderColor = 'transparent';
        target.style.background = 'transparent';
    }
}

function addOfficer(roleId, studentName) {
    if (!studentName) return;
    const year = state.currentYear;
    if (!state.officers[year]) state.officers[year] = {};
    if (!state.officers[year][roleId]) state.officers[year][roleId] = [];

    // Find role limit
    let limit = 0;
    const currentRoles = initOfficerRoles();
    currentRoles.some(c => {
        const found = c.roles.find(r => r.id === roleId);
        if (found) { limit = found.limit; return true; }
    });

    if (limit === 1) {
        state.officers[year][roleId] = [studentName];
    } else {
        if (!state.officers[year][roleId].includes(studentName)) {
            state.officers[year][roleId].push(studentName);
        }
    }

    saveSessionState();
    renderClassOfficers();
}

function removeOfficer(roleId, index) {
    const year = state.currentYear;
    if (state.officers[year] && state.officers[year][roleId]) {
        state.officers[year][roleId].splice(index, 1);
        saveSessionState();
        renderClassOfficers();
    }
}

function showAddOfficerRoleModal() {
    document.getElementById('officerRoleModalTitle').textContent = '新規役職・係の定義';
    document.getElementById('saveOfficerRoleBtn').textContent = '追加定義する';
    document.getElementById('editOfficerCatIdx').value = '-1';
    document.getElementById('editOfficerRoleIdx').value = '-1';
    document.getElementById('newRoleName').value = '';
    document.getElementById('newRoleDesc').value = '';
    document.getElementById('newRoleLimit').value = '1';
    document.getElementById('addOfficerRoleModal').classList.add('open');
}

function editOfficerRole(catIdx, roleIdx) {
    const currentRoles = initOfficerRoles();
    const role = currentRoles[catIdx].roles[roleIdx];
    document.getElementById('officerRoleModalTitle').textContent = '役職・係の定義を編集';
    document.getElementById('saveOfficerRoleBtn').textContent = '変更を保存する';
    document.getElementById('editOfficerCatIdx').value = catIdx;
    document.getElementById('editOfficerRoleIdx').value = roleIdx;
    document.getElementById('newRoleCategory').value = currentRoles[catIdx].category;
    document.getElementById('newRoleName').value = role.name;
    document.getElementById('newRoleLimit').value = role.limit;
    document.getElementById('newRoleDesc').value = role.desc;
    document.getElementById('addOfficerRoleModal').classList.add('open');
}

function saveNewOfficerRole() {
    const catIdx = parseInt(document.getElementById('editOfficerCatIdx').value);
    const roleIdx = parseInt(document.getElementById('editOfficerRoleIdx').value);

    const categoryName = document.getElementById('newRoleCategory').value;
    const roleName = document.getElementById('newRoleName').value.trim();
    const limit = parseInt(document.getElementById('newRoleLimit').value) || 0;
    const desc = document.getElementById('newRoleDesc').value.trim();

    if (!roleName) {
        alert('役職・係名を入力してください。');
        return;
    }

    initOfficerRoles();
    const year = state.currentYear;
    const currentRoles = state.officerRoles[year];

    if (catIdx >= 0 && roleIdx >= 0) {
        // Edit existing
        const oldCat = currentRoles[catIdx];
        const role = oldCat.roles[roleIdx];

        role.name = roleName;
        role.limit = limit;
        role.desc = desc;

        // If category changed, move it
        if (oldCat.category !== categoryName) {
            oldCat.roles.splice(roleIdx, 1);
            if (oldCat.roles.length === 0) {
                currentRoles.splice(catIdx, 1);
            }

            let newCat = currentRoles.find(c => c.category === categoryName);
            if (!newCat) {
                newCat = { category: categoryName, roles: [] };
                currentRoles.push(newCat);
            }
            newCat.roles.push(role);
        }
    } else {
        // Create new
        const currentRoles = state.officerRoles[state.currentYear];
        let cat = currentRoles.find(c => c.category === categoryName);
        if (!cat) {
            cat = { category: categoryName, roles: [] };
            currentRoles.push(cat);
        }

        const newId = 'custom_' + Date.now();
        cat.roles.push({
            id: newId,
            name: roleName,
            limit: limit,
            desc: desc
        });
    }

    saveSessionState();
    document.getElementById('addOfficerRoleModal').classList.remove('open');
    renderClassOfficers();
}

function resetOfficerRolesToDefault() {
    if (confirm('現在の学年（' + state.currentYear + '年）の役職・係の定義を初期状態に戻しますか？\n（追加したカスタム係や編集内容は失われます。割り当て済みの学生データは維持されますが、定義から消えた係は表示されなくなります）')) {
        state.officerRoles[state.currentYear] = JSON.parse(JSON.stringify(DEFAULT_OFFICER_ROLES));
        saveSessionState();
        renderClassOfficers();
    }
}

function deleteOfficerRole(catIdx, roleIdx) {
    if (confirm('この役職・係の定義を削除しますか？\n（割り当てられていた学生の記録も表示されなくなります）')) {
        const currentRoles = state.officerRoles[state.currentYear];
        currentRoles[catIdx].roles.splice(roleIdx, 1);
        if (currentRoles[catIdx].roles.length === 0) {
            currentRoles.splice(catIdx, 1);
        }
        saveSessionState();
        renderClassOfficers();
    }
}

function exportClassOfficersPdf() {
    const year = state.currentYear;
    const yearOfficers = state.officers[year] || {};
    const className = getClassName();

    const currentRoles = initOfficerRoles();

    // Header Area - High Premium Style
    const headerHtml = `
        <div style="margin-bottom: 25px; text-align: center;">
            <h1 style="margin: 0 0 10px 0; font-size: 20pt; font-weight: 800; background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: -0.01em;">${className} クラス役員・係名簿</h1>
            <div style="font-size: 13pt; color: #64748b; font-weight: 500;">${year}年度 クラス組織・役員係名簿</div>
            <div style="font-size: 9pt; color: #94a3b8; margin-top: 8px;">出力日: ${new Date().toLocaleDateString('ja-JP')}</div>
        </div>
    `;

    let contentHtml = '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">';
    currentRoles.forEach((cat, idx) => {
        contentHtml += `
            <div style="break-inside: avoid; margin-bottom: 15px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; background: #f5f3ff; padding: 6px 10px; border-radius: 6px; border-left: 5px solid #4f46e5; -webkit-print-color-adjust: exact; print-color-adjust: exact;">
                    <h2 style="margin: 0; font-size: 10.5pt; font-weight: 800; color: #4338ca;">${cat.category}</h2>
                </div>
                <table style="width: 100%; border-collapse: collapse; border: 1.5pt solid #4f46e5; font-size: 8.5pt; border-radius: 4px; overflow: hidden;">
                    <thead>
                        <tr style="background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%); color: white; -webkit-print-color-adjust: exact; print-color-adjust: exact;">
                            <th style="padding: 6px 8px; text-align: left; border: 0.5pt solid rgba(255,255,255,0.2); width: 25%;">役割</th>
                            <th style="padding: 6px 8px; text-align: left; border: 0.5pt solid rgba(255,255,255,0.2); width: 45%;">説明</th>
                            <th style="padding: 6px 8px; text-align: left; border: 0.5pt solid rgba(255,255,255,0.2); width: 30%;">氏名</th>
                        </tr>
                    </thead>
                    <tbody>`;

        cat.roles.forEach((role, rIdx) => {
            const assigned = yearOfficers[role.id] || [];
            contentHtml += `
                        <tr style="border-bottom: 0.5pt solid #ddd6fe;">
                            <td style="padding: 6px 8px; border-right: 0.5pt solid #ddd6fe; font-weight: 700; color: #1e1b4b; background: #fdfcff; vertical-align: top; line-height: 1.3;">${role.name}</td>
                            <td style="padding: 6px 8px; border-right: 0.5pt solid #ddd6fe; color: #64748b; font-size: 7.5pt; vertical-align: top; line-height: 1.2;">${role.desc || ''}</td>
                            <td style="padding: 6px 8px; vertical-align: middle; line-height: 1.3; background: #ffffff;">
                                <div style="font-weight: 700; color: #312e81; font-size: 9pt;">
                                    ${assigned.length > 0 ? assigned.join('<br>') : '<span style="color:#cbd5e1">-</span>'}
                                </div>
                            </td>
                        </tr>`;
        });

        contentHtml += `</tbody></table></div>`;
    });
    contentHtml += '</div>';

    const footerHtml = `
        <div style="margin-top: 40px; display: flex; justify-content: space-between; align-items: center; padding-top: 10px; border-top: 1pt solid #4f46e5; font-size: 8pt; color: #94a3b8; font-weight: 500;">
            <div style="display: flex; align-items: center; gap: 5px;">
                <span style="background: #4f46e5; color: white; padding: 1px 4px; border-radius: 3px; font-size: 7pt; font-weight: 800;">GENE</span>
                Grade Manager Professional
            </div>
            <div style="letter-spacing: 0.05em; text-transform: uppercase;">クラス組織管理・編成記録</div>
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
            <title>${className} 役員名簿</title>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet">
            <style>
                body {
                    margin: 0; padding: 15mm 12mm;
                    font-family: 'Inter', 'Noto Sans JP', sans-serif;
                    color: #1e293b; background: white;
                }
                @media print {
                    @page { margin: 0; }
                    body { padding: 15mm 12mm; }
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
            </style>
        </head>
        <body onload="setTimeout(() => { window.print(); window.close(); }, 800)">
            ${headerHtml}
            ${contentHtml}
            ${footerHtml}
        </body>
        </html>
    `);
    printWindow.document.close();
}

function exportOfficerAssignmentsCsv() {
    const BOM = '\uFEFF';
    let csvContent = '学年,カテゴリ,役割名,氏名\n';

    // Get all years currently in state.officers
    const years = Object.keys(state.officers).sort((a, b) => parseInt(a) - parseInt(b));

    years.forEach(year => {
        const yearOfficers = state.officers[year];
        if (!yearOfficers) return;

        const currentRoles = state.officerRoles[year] || [];
        currentRoles.forEach(cat => {
            cat.roles.forEach(role => {
                const assigned = yearOfficers[role.id] || [];
                assigned.forEach(name => {
                    csvContent += `${year},"${cat.category.replace(/"/g, '""')}","${role.name.replace(/"/g, '""')}","${name.replace(/"/g, '""')}"\n`;
                });
            });
        });
    });

    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `class_officers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function importOfficerAssignmentsCsv(event) {
    const file = event.target.files[0];
    if (!file) return;

    readFileText(file).then(text => {
        const lines = text.split(/\r?\n/);
        if (lines.length < 2) return;

        const newOfficers = {}; // key: year, value: { roleId: [names] }

        // Skip header
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            // Handle quoted CSV values
            const parts = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
            if (!parts || parts.length < 4) continue;

            const year = parts[0].replace(/"/g, '');
            const categoryName = parts[1].replace(/"/g, '');
            const roleName = parts[2].replace(/"/g, '');
            const studentName = parts[3].replace(/"/g, '');

            // Find matching role ID in officerRoles for THIS year
            let foundRoleId = null;
            const yearRoles = state.officerRoles[year] || [];
            yearRoles.forEach(cat => {
                const role = cat.roles.find(r => r.name === roleName && cat.category === categoryName);
                if (role) foundRoleId = role.id;
            });

            if (foundRoleId) {
                if (!newOfficers[year]) newOfficers[year] = {};
                if (!newOfficers[year][foundRoleId]) newOfficers[year][foundRoleId] = [];
                if (!newOfficers[year][foundRoleId].includes(studentName)) {
                    newOfficers[year][foundRoleId].push(studentName);
                }
            }
        }

        if (Object.keys(newOfficers).length === 0) {
            alert('有効なデータが見つかりませんでした。');
            event.target.value = '';
            return;
        }

        if (confirm('割当データを上書きしますか？\n（CSVに含まれる学年・役割の既存データのみが対象です）')) {
            // Partial merge or full? Full within the year might be safer if we want to "load"
            Object.keys(newOfficers).forEach(year => {
                // Ensure year object exists in state
                if (!state.officers[year]) state.officers[year] = {};

                // Merge/Overwrite for specific roles found in CSV
                Object.keys(newOfficers[year]).forEach(roleId => {
                    state.officers[year][roleId] = newOfficers[year][roleId];
                });
            });
            saveSessionState();
            renderClassOfficers();
            alert('CSVの読み込みが完了しました。');
        }
    }).catch(err => {
        console.error('CSV import error:', err);
        alert('CSVファイルの読み込みに失敗しました:\n' + err.message);
    }).finally(() => {
        event.target.value = ''; // Reset input
    });
}

// ==================== MOBILE LONG PRESS SUPPORT ====================
function addLongPressTrigger(target) {
    let timer = null;
    const longPressDuration = 500; // 0.5s

    const start = (e) => {
        if (e.touches && e.touches.length > 1) return;
        if (timer) clearTimeout(timer); // Clear any existing

        // Need to capture touch coordinates from the start event
        const touch = e.touches[0];
        const clientX = touch.clientX;
        const clientY = touch.clientY;

        timer = setTimeout(() => {
            timer = null;
            // Create and dispatch
            const event = new MouseEvent('contextmenu', {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: clientX,
                clientY: clientY,
                button: 2,
                buttons: 2
            });
            target.dispatchEvent(event);
        }, longPressDuration);
    };

    const cancel = () => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
    };

    target.addEventListener('touchstart', start, { passive: true });
    target.addEventListener('touchmove', cancel, { passive: true });
    target.addEventListener('touchend', cancel, { passive: true });
    target.addEventListener('touchcancel', cancel, { passive: true });
}

// ==================== APP INITIALIZATION ====================
// init() is called via DOMContentLoaded listener at line 5421.


// ==================== CUSTOM CONTEXT MENU HELPERS ====================

function createCustomContextMenu() {
    let menu = document.getElementById('customContextMenu');
    if (!menu) {
        menu = document.createElement('div');
        menu.id = 'customContextMenu';
        menu.className = 'card'; // Use card style for consistency
        Object.assign(menu.style, {
            position: 'fixed',
            zIndex: '100000',
            background: 'white',
            border: '1px solid #cbd5e1',
            borderRadius: '0.5rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            padding: '0.5rem 0',
            minWidth: '180px',
            fontFamily: '"Inter", system-ui, sans-serif',
            fontSize: '0.9rem',
            userSelect: 'none',
            display: 'none',
            color: '#334155'
        });

        document.body.appendChild(menu);

        // Global click to close
        const closeMenu = () => {
            if (menu.style.display === 'block') {
                menu.style.display = 'none';
            }
        };
        // Use capture phase to ensure it runs before others if needed, but standard bubble is fine usually.
        // Actually, we want to close if clicking outside.
        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target)) {
                closeMenu();
            }
        });

        // Prevent context menu on the menu itself
        menu.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
    return menu;
}

function showCustomContextMenu(e, items) {
    if (!items || items.length === 0) return;

    // Create menu if needed
    const menu = createCustomContextMenu();
    menu.innerHTML = '';

    items.forEach(item => {
        if (item.label === '---') {
            const hr = document.createElement('div');
            hr.style.height = '1px';
            hr.style.background = '#e2e8f0';
            hr.style.margin = '0.4rem 0';
            menu.appendChild(hr);
            return;
        }

        const div = document.createElement('div');
        div.textContent = item.label;
        div.style.padding = '0.75rem 1rem';
        div.style.cursor = 'pointer';
        div.style.display = 'flex';
        div.style.alignItems = 'center';
        div.style.gap = '0.5rem';
        div.style.transition = 'background 0.1s';

        if (item.danger) {
            div.style.color = '#ef4444';
        } else {
            div.style.color = item.color || '#334155';
        }

        // Hover effect
        div.onmouseenter = () => { div.style.background = '#f1f5f9'; };
        div.onmouseleave = () => { div.style.background = 'transparent'; };

        // Click action
        div.onclick = (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            menu.style.display = 'none';
            if (typeof item.action === 'function') {
                setTimeout(() => {
                    item.action();
                }, 10);
            }
        };

        // For touch devices
        div.ontouchend = (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            menu.style.display = 'none';
            if (typeof item.action === 'function') {
                setTimeout(() => {
                    item.action();
                }, 10);
            }
        };

        menu.appendChild(div);
    });

    // Position logic
    const menuWidth = 180;
    // Estimate height
    const menuHeight = items.length * 45 + 20;

    let x = e.clientX;
    let y = e.clientY;

    // Adjust if off screen
    if (x + menuWidth > window.innerWidth) x = window.innerWidth - menuWidth - 10;
    if (y + menuHeight > window.innerHeight) y = window.innerHeight - menuHeight - 10;

    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;
    menu.style.display = 'block';
}

function confirmAndDeletePeriodEvent(pev) {
    if (!pev) return;
    // Simple confirm
    if (confirm(`本当に「${pev.text}」を削除しますか？`)) {
        if (pev.id) {
            state.attendance.periodEvents = state.attendance.periodEvents.filter(ev => ev.id !== pev.id);
        } else {
            // Fallback match
            state.attendance.periodEvents = state.attendance.periodEvents.filter(ev => ev !== pev);
        }
        saveSessionState();
        renderAttendanceCalendar();
        renderClassAttendanceStats();
    }
}





