// Interactive companion to scripts/blog/understanding-analytic-continuation/partial_sums.py
// Plots the partial sum S_N(x) = sum_{k=0}^{N} x^k overlaid on 1/(1-x)
// for x in (-1 + 1e-5, 1 - 1e-5). Slider controls N.

(function () {
    const container = document.querySelector('[data-interactive="geometric-partial-sums"]');
    if (!container || container.dataset.hydrated) return;
    container.dataset.hydrated = '1';

    container.innerHTML = `
        <div class="interactive-embed">
            <div class="interactive-header">
                <span class="interactive-title">Partial sums S_N(x) vs 1/(1 − x) on (-1+10⁻⁵, 1-10⁻⁵)</span>
                <a class="interactive-source"
                   href="https://github.com/TensorTheorist/TensorTheorist.github.io/blob/main/scripts/blog/understanding-analytic-continuation/partial_sums.py"
                   target="_blank" rel="noopener">View Python source →</a>
            </div>
            <div class="interactive-controls">
                <label>Number of terms N: <strong data-role="value">10</strong></label>
                <input type="range" min="1" max="500" step="1" value="10" data-role="slider">
            </div>
            <canvas data-role="canvas" width="640" height="360"></canvas>
            <div class="interactive-legend">
                <span><i style="background:#2563eb"></i> 1 / (1 − x)</span>
                <span><i style="background:#f59e0b"></i> S_N(x) = Σ x<sup>k</sup>, k = 0..N</span>
            </div>
        </div>
    `;

    const canvas = container.querySelector('[data-role="canvas"]');
    const slider = container.querySelector('[data-role="slider"]');
    const valueEl = container.querySelector('[data-role="value"]');

    const PALETTE = {
        bg: '#f5f1ff', grid: '#e5deff', axis: '#8b7ac0',
        muted: '#6b5b95',
        exact: '#2563eb', partial: '#f59e0b', asymptote: '#e11d48'
    };

    const EPS = 1e-5;
    const SAMPLES = 400;

    function computeSeries(N) {
        const xs = [], sN = [], exact = [];
        const lo = -1 + EPS, hi = 1 - EPS;
        for (let i = 0; i <= SAMPLES; i++) {
            const x = lo + (hi - lo) * i / SAMPLES;
            let term = 1, total = 0;
            for (let k = 0; k <= N; k++) {
                total += term;
                term *= x;
            }
            xs.push(x);
            sN.push(total);
            exact.push(1 / (1 - x));
        }
        return { xs, sN, exact };
    }

    function draw(N) {
        const data = computeSeries(N);
        const ctx = canvas.getContext('2d');
        const W = canvas.width, H = canvas.height;
        ctx.fillStyle = PALETTE.bg;
        ctx.fillRect(0, 0, W, H);
        const L = 55, R = W - 25, T = 25, B = H - 40;

        const xMin = -1, xMax = 1;
        const yMin = -3, yMax = 8;

        const X = x => L + (x - xMin) / (xMax - xMin) * (R - L);
        const Y = y => B - (y - yMin) / (yMax - yMin) * (B - T);

        // Gridlines
        ctx.strokeStyle = PALETTE.grid; ctx.lineWidth = 0.6;
        for (let xg = -1; xg <= 1; xg += 0.5) {
            ctx.beginPath(); ctx.moveTo(X(xg), T); ctx.lineTo(X(xg), B); ctx.stroke();
        }
        for (let yg = yMin; yg <= yMax; yg++) {
            ctx.beginPath(); ctx.moveTo(L, Y(yg)); ctx.lineTo(R, Y(yg)); ctx.stroke();
        }

        // Axes through 0
        ctx.strokeStyle = PALETTE.axis; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(L, Y(0)); ctx.lineTo(R, Y(0)); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(X(0), T); ctx.lineTo(X(0), B); ctx.stroke();

        // Right edge boundary hint (x → 1)
        ctx.strokeStyle = PALETTE.asymptote; ctx.lineWidth = 1.2;
        ctx.setLineDash([5, 4]);
        ctx.beginPath(); ctx.moveTo(X(1), T); ctx.lineTo(X(1), B); ctx.stroke();
        ctx.setLineDash([]);

        // Tick labels
        ctx.fillStyle = PALETTE.muted;
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        for (let xg = -1; xg <= 1; xg += 0.5) {
            ctx.fillText(xg.toString(), X(xg), B + 14);
        }
        ctx.textAlign = 'right';
        for (let yg = yMin; yg <= yMax; yg++) {
            if (yg === 0) continue;
            ctx.fillText(yg.toString(), L - 6, Y(yg) + 3);
        }

        function plot(arr, color, dashed) {
            ctx.strokeStyle = color;
            ctx.lineWidth = 1.9;
            ctx.setLineDash(dashed ? [4, 3] : []);
            ctx.beginPath();
            let started = false;
            for (let i = 0; i < data.xs.length; i++) {
                const y = arr[i];
                if (!isFinite(y) || y < yMin || y > yMax) {
                    started = false;
                    continue;
                }
                const px = X(data.xs[i]);
                const py = Y(y);
                if (!started) { ctx.moveTo(px, py); started = true; }
                else ctx.lineTo(px, py);
            }
            ctx.stroke();
            ctx.setLineDash([]);
        }

        plot(data.exact, PALETTE.exact, false);
        plot(data.sN, PALETTE.partial, false);
    }

    let handle = null;
    slider.addEventListener('input', () => {
        valueEl.textContent = slider.value;
        if (handle) cancelAnimationFrame(handle);
        handle = requestAnimationFrame(() => draw(parseInt(slider.value, 10)));
    });
    draw(parseInt(slider.value, 10));
})();
