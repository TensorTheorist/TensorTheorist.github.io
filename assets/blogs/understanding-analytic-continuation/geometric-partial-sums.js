// Interactive companion to scripts/blog/understanding-analytic-continuation/partial_sums.py
// Plots the partial sum S_N(x) = sum_{k=0}^{N} x^k overlaid on 1/(1-x)
// across a wide x range so the reader can see the partial sum tracking the
// analytic continuation inside (-1, 1) and diverging outside it.

(function () {
    const container = document.querySelector('[data-interactive="geometric-partial-sums"]');
    if (!container || container.dataset.hydrated) return;
    container.dataset.hydrated = '1';

    container.innerHTML = `
        <div class="interactive-embed">
            <div class="interactive-header">
                <span class="interactive-title">Partial sums S<sub>N</sub>(x) vs 1/(1 − x)</span>
                <a class="interactive-source"
                   href="https://github.com/TensorTheorist/TensorTheorist.github.io/blob/main/scripts/blog/understanding-analytic-continuation/partial_sums.py"
                   target="_blank" rel="noopener">View Python source →</a>
            </div>
            <div class="interactive-controls">
                <label>Number of terms N: <strong data-role="value">10</strong></label>
                <input type="range" min="1" max="500" step="1" value="10" data-role="slider">
            </div>
            <canvas data-role="canvas" width="640" height="420"></canvas>
            <div class="interactive-legend">
                <span><i style="background:#7c3aed"></i> convergence interval (-1, 1)</span>
                <span><i style="background:#2563eb"></i> 1 / (1 − x)</span>
                <span><i style="background:#f59e0b"></i> S<sub>N</sub>(x)</span>
            </div>
        </div>
    `;

    const canvas = container.querySelector('[data-role="canvas"]');
    const slider = container.querySelector('[data-role="slider"]');
    const valueEl = container.querySelector('[data-role="value"]');

    const PALETTE = {
        bg: '#f5f1ff', grid: '#e5deff', axis: '#8b7ac0',
        muted: '#6b5b95',
        exact: '#2563eb', partial: '#f59e0b',
        asymptote: '#e11d48', band: '#efe6ff'
    };

    // Wide plot window; ticks land only on even integers.
    const X_MIN = -10, X_MAX = 10;
    const Y_MIN = -10, Y_MAX = 10;
    const SAMPLES = 1200;

    // Skip a small slice around x = 1 (the pole of 1/(1-x)).
    const POLE_EPS = 0.04;
    // Break the partial-sum polyline when adjacent samples differ by more
    // than this in y — otherwise floating-point spikes near x = ±1 draw
    // spurious near-vertical connectors.
    const Y_JUMP = 3.5;

    function partialSum(x, N) {
        let term = 1, total = 0;
        for (let k = 0; k <= N; k++) {
            total += term;
            term *= x;
            if (!isFinite(total)) return total;
        }
        return total;
    }

    function computeSeries(N) {
        const xs = [], sN = [], exact = [];
        for (let i = 0; i <= SAMPLES; i++) {
            const x = X_MIN + (X_MAX - X_MIN) * i / SAMPLES;
            if (Math.abs(x - 1) < POLE_EPS) continue;
            xs.push(x);
            sN.push(partialSum(x, N));
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

        const X = x => L + (x - X_MIN) / (X_MAX - X_MIN) * (R - L);
        const Y = y => B - (y - Y_MIN) / (Y_MAX - Y_MIN) * (B - T);

        // Convergence-band shading
        ctx.fillStyle = PALETTE.band;
        ctx.fillRect(X(-1), T, X(1) - X(-1), B - T);

        // Gridlines at every even integer (-10, -8, ..., 8, 10)
        ctx.strokeStyle = PALETTE.grid; ctx.lineWidth = 0.6;
        for (let xg = X_MIN; xg <= X_MAX; xg += 2) {
            ctx.beginPath(); ctx.moveTo(X(xg), T); ctx.lineTo(X(xg), B); ctx.stroke();
        }
        for (let yg = Y_MIN; yg <= Y_MAX; yg += 2) {
            ctx.beginPath(); ctx.moveTo(L, Y(yg)); ctx.lineTo(R, Y(yg)); ctx.stroke();
        }

        // Axes through 0
        ctx.strokeStyle = PALETTE.axis; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(L, Y(0)); ctx.lineTo(R, Y(0)); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(X(0), T); ctx.lineTo(X(0), B); ctx.stroke();

        // Pole at x = 1
        ctx.strokeStyle = PALETTE.asymptote; ctx.lineWidth = 1.3;
        ctx.setLineDash([5, 4]);
        ctx.beginPath(); ctx.moveTo(X(1), T); ctx.lineTo(X(1), B); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = PALETTE.asymptote;
        ctx.font = '11px JetBrains Mono, monospace';
        ctx.textAlign = 'left';
        ctx.fillText('x = 1', X(1) + 6, T + 12);

        // Tick labels — even integers only
        ctx.fillStyle = PALETTE.muted;
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        for (let xg = X_MIN; xg <= X_MAX; xg += 2) {
            ctx.fillText(xg.toString(), X(xg), B + 14);
        }
        ctx.textAlign = 'right';
        for (let yg = Y_MIN; yg <= Y_MAX; yg += 2) {
            if (yg === 0) continue;
            ctx.fillText(yg.toString(), L - 6, Y(yg) + 3);
        }

        function plot(arr, color, dashed) {
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.setLineDash(dashed ? [4, 3] : []);
            ctx.beginPath();
            let started = false;
            let lastY = null;
            let lastX = null;
            for (let i = 0; i < data.xs.length; i++) {
                const y = arr[i];
                // Off-canvas — break the segment.
                if (!isFinite(y) || y < Y_MIN || y > Y_MAX) {
                    started = false; lastY = null; lastX = null;
                    continue;
                }
                // Sample gap (pole neighbourhood) — break.
                if (lastX !== null && Math.abs(data.xs[i] - lastX) > 0.1) {
                    started = false; lastY = null;
                }
                // Sudden y-jump between adjacent samples — floating-point
                // spike at |x| = 1 boundary of the partial-sum. Break.
                if (started && lastY !== null && Math.abs(y - lastY) > Y_JUMP) {
                    started = false;
                }
                const px = X(data.xs[i]);
                const py = Y(y);
                if (!started) { ctx.moveTo(px, py); started = true; }
                else ctx.lineTo(px, py);
                lastY = y; lastX = data.xs[i];
            }
            ctx.stroke();
            ctx.setLineDash([]);
        }

        plot(data.exact, PALETTE.exact, false);
        plot(data.sN, PALETTE.partial, false);

        // Annotations
        ctx.fillStyle = PALETTE.muted;
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('|x| < 1: S_N → 1/(1−x)', X(0), B - 8);
        ctx.textAlign = 'left';
        ctx.fillText('outside (-1, 1): S_N diverges', X(2), B - 8);
    }

    let handle = null;
    slider.addEventListener('input', () => {
        valueEl.textContent = slider.value;
        if (handle) cancelAnimationFrame(handle);
        handle = requestAnimationFrame(() => draw(parseInt(slider.value, 10)));
    });
    draw(parseInt(slider.value, 10));
})();
