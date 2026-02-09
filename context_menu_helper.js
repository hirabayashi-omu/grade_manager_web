
// ==================== CUSTOM CONTEXT MENU ====================

function createCustomContextMenu() {
    let menu = document.getElementById('customContextMenu');
    if (!menu) {
        menu = document.createElement('div');
        menu.id = 'customContextMenu';
        menu.style.position = 'fixed';
        menu.style.zIndex = '100000';
        menu.style.background = 'white';
        menu.style.border = '1px solid #cbd5e1';
        menu.style.borderRadius = '0.5rem';
        menu.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
        menu.style.padding = '0.5rem 0';
        menu.style.minWidth = '180px';
        menu.style.fontFamily = "Inter, system-ui, sans-serif";
        menu.style.fontSize = "0.9rem";
        menu.style.userSelect = 'none';
        menu.style.display = 'none';

        document.body.appendChild(menu);

        // Global click to close
        document.addEventListener('click', (e) => {
            if (menu.style.display === 'block') {
                menu.style.display = 'none';
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
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    const menu = createCustomContextMenu();
    menu.innerHTML = '';

    if (!items || items.length === 0) return;

    items.forEach(item => {
        const div = document.createElement('div');
        div.textContent = item.label;
        div.style.padding = '0.6rem 1rem';
        div.style.cursor = 'pointer';
        div.style.color = item.color || '#334155';
        div.style.transition = 'background 0.1s';

        if (item.danger) {
            div.style.color = '#ef4444';
        }

        div.addEventListener('mouseenter', () => {
            div.style.background = '#f1f5f9';
        });
        div.addEventListener('mouseleave', () => {
            div.style.background = 'transparent';
        });

        div.onclick = () => {
            menu.style.display = 'none';
            if (item.action) item.action();
        };

        menu.appendChild(div);
    });

    // Position logic
    let x = e.clientX;
    let y = e.clientY;

    // Adjust if off screen (simplified)
    if (x + 180 > window.innerWidth) x = window.innerWidth - 190;
    if (y + 100 > window.innerHeight) y = window.innerHeight - 110;

    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;
    menu.style.display = 'block';
}

function confirmAndDeletePeriodEvent(pev) {
    if (!pev) return;
    if (confirm(`「${pev.text}」を削除しますか？`)) {
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
