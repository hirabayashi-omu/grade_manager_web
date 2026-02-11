function getExamPeriods(chartLabels) {
    if (!state.annualEvents || chartLabels.length === 0) return [];

    const examKeywords = ["前期中間試験", "前期末試験", "後期中間試験", "学年末試験"];
    const events = [];

    // 1. Flatten events
    Object.keys(state.annualEvents).forEach(acadYear => {
        const yearData = state.annualEvents[acadYear];
        if (!yearData) return;
        Object.keys(yearData).forEach(monthStr => {
            const m = parseInt(monthStr);
            const calYear = (m >= 4) ? parseInt(acadYear) : parseInt(acadYear) + 1;
            yearData[monthStr].forEach(ev => {
                if (!ev.event) return;
                const hit = examKeywords.find(k => ev.event.includes(k));
                if (hit) {
                    const dateStr = `${calYear}/${m.toString().padStart(2, '0')}/${ev.day.toString().padStart(2, '0')}`;
                    events.push({ date: dateStr, name: hit });
                }
            });
        });
    });

    events.sort((a, b) => a.date.localeCompare(b.date));

    // 2. Cluster into periods
    const periods = [];
    if (events.length > 0) {
        let current = { name: events[0].name, start: events[0].date, end: events[0].date, lastDate: events[0].date };
        for (let i = 1; i < events.length; i++) {
            const ev = events[i];
            const d1 = new Date(current.lastDate.replace(/\//g, '-'));
            const d2 = new Date(ev.date.replace(/\//g, '-'));
            const diffDays = (d2 - d1) / (1000 * 60 * 60 * 24);

            if (ev.name === current.name && diffDays < 15 && diffDays >= 0) {
                current.end = ev.date;
                current.lastDate = ev.date;
            } else {
                periods.push(current);
                current = { name: ev.name, start: ev.date, end: ev.date, lastDate: ev.date };
            }
        }
        periods.push(current);
    }
    return periods;
}

function createExamPeriodPlugin(chartLabels) {
    const periods = getExamPeriods(chartLabels);
    return {
        id: 'examPeriodAnnotations',
        beforeDraw: (chart) => {
            if (periods.length === 0) return;
            const { ctx, chartArea: { top, bottom }, scales: { x } } = chart;

            ctx.save();
            periods.forEach(p => {
                // Find start/end indices in chartLabels
                let startIdx = chartLabels.indexOf(p.start);
                let endIdx = chartLabels.indexOf(p.end);

                if (startIdx === -1) startIdx = chartLabels.findIndex(l => l >= p.start);
                // If still -1, check if period is completely out of range
                if (startIdx === -1) {
                    if (p.start > chartLabels[chartLabels.length - 1]) return;
                }

                if (endIdx === -1) {
                    for (let i = 0; i < chartLabels.length; i++) {
                        if (chartLabels[i] <= p.end) endIdx = i;
                        else break;
                    }
                }

                if (startIdx === -1) startIdx = 0;
                if (endIdx === -1) endIdx = chartLabels.length - 1;

                if (startIdx > endIdx) return;

                // Bounds check
                if (p.end < chartLabels[0] || p.start > chartLabels[chartLabels.length - 1]) return;

                const startX = x.getPixelForValue(chartLabels[startIdx]);
                const endX = x.getPixelForValue(chartLabels[endIdx]);

                if (startX === undefined || endX === undefined) return;

                const width = endX - startX;

                // Draw Box
                ctx.fillStyle = 'rgba(203, 213, 225, 0.4)';
                // Add slight padding to cover the ticks nicely
                const rectX = startX - (width === 0 ? 10 : 0);
                const rectW = width + (width === 0 ? 20 : 0);

                ctx.fillRect(rectX, top, rectW, bottom - top);

                // Draw Label
                ctx.fillStyle = '#64748b';
                ctx.font = 'bold 11px sans-serif';
                ctx.textAlign = 'left';
                ctx.fillText(p.name, rectX, top + 15);
            });
            ctx.restore();
        }
    };
}
