// Interactive companion to scripts/blog/riemann-hypothesis-intro/prime_counting.py
// Same algorithm — Sieve of Eratosthenes for pi(x) and trapezoidal Li(x) —
// so the browser plot and the Python reference agree exactly.

(function () {
    const container = document.querySelector('[data-interactive="prime-counting"]');
    if (!container || container.dataset.hydrated) return;
    container.dataset.hydrated = '1';

    container.innerHTML = `
        <div class="interactive-embed">
            <div class="interactive-header">
                <span class="interactive-title">π(x) vs x⁄log x and Li(x)</span>
                <a class="interactive-source" href="https://github.com/TensorTheorist/TensorTheorist.github.io/blob/main/scripts/blog/riemann-hypothesis-intro/prime_counting.py" target="_blank" rel="noopener">View Python source →</a>
            </div>
            <div class="interactive-controls">
                <label>Upper bound: <strong data-role="value">1000</strong></label>
                <input type="range" min="100" max="10000" step="100" value="1000" data-role="slider">
            </div>
            <canvas data-role="canvas" width="640" height="360"></canvas>
            <div class="interactive-legend">
                <span><i style="background:#f59e0b"></i> π(x)</span>
                <span><i style="background:#2563eb"></i> x / log x</span>
                <span><i style="background:#e11d48"></i> Li(x)</span>
            </div>
        </div>
    `;

    const canvas = container.querySelector('[data-role="canvas"]');
    const slider = container.querySelector('[data-role="slider"]');
    const valueEl = container.querySelector('[data-role="value"]');

    function sieve(n) {
        const p = new Uint8Array(n + 1); p.fill(1); p[0] = 0; p[1] = 0;
        for (let i = 2; i * i <= n; i++) {
            if (p[i]) for (let j = i * i; j <= n; j += i) p[j] = 0;
        }
        return p;
    }

    function li(x, steps = 400) {
        if (x <= 2) return 0;
        const dx = (x - 2) / steps;
        let s = 0;
        for (let k = 0; k < steps; k++) {
            const a = 2 + k * dx, b = a + dx;
            s += 0.5 * (1 / Math.log(a) + 1 / Math.log(b)) * dx;
        }
        return s;
    }

    function compute(N) {
        const step = Math.max(1, Math.floor(N / 200));
        const isP = sieve(N);
        const xs = [], pi = [], xlog = [], liv = [];
        let running = 0;
        for (let x = 2; x <= N; x++) {
            if (isP[x]) running++;
            if (x % step === 0 || x === N) {
                xs.push(x);
                pi.push(running);
                xlog.push(x / Math.log(x));
                liv.push(li(x));
            }
        }
        return { xs, pi, xlog, liv };
    }

    const PALETTE = {
        bg: '#f5f1ff', grid: '#e5deff', axis: '#8b7ac0',
        muted: '#6b5b95',
        series1: '#f59e0b', series2: '#2563eb', series3: '#e11d48'
    };

    function draw(N) {
        const data = compute(N);
        const ctx = canvas.getContext('2d');
        const W = canvas.width, H = canvas.height;
        ctx.fillStyle = PALETTE.bg;
        ctx.fillRect(0, 0, W, H);
        const L = 60, R = W - 30, T = 25, B = H - 40;
        const xmax = N;
        const ymax = Math.max(...data.liv, ...data.pi, ...data.xlog) * 1.05 || 1;
        const X = x => L + (x / xmax) * (R - L);
        const Y = y => B - (y / ymax) * (B - T);

        ctx.strokeStyle = PALETTE.grid; ctx.lineWidth = 0.6;
        for (let k = 1; k <= 5; k++) {
            const x = (xmax * k) / 5;
            ctx.beginPath(); ctx.moveTo(X(x), T); ctx.lineTo(X(x), B); ctx.stroke();
        }
        for (let k = 1; k <= 4; k++) {
            const y = (ymax * k) / 4;
            ctx.beginPath(); ctx.moveTo(L, Y(y)); ctx.lineTo(R, Y(y)); ctx.stroke();
        }

        ctx.strokeStyle = PALETTE.axis; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(L, T); ctx.lineTo(L, B); ctx.lineTo(R, B); ctx.stroke();

        ctx.fillStyle = PALETTE.muted; ctx.font = '10px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        for (let k = 0; k <= 5; k++) {
            const x = (xmax * k) / 5;
            ctx.beginPath(); ctx.moveTo(X(x), B); ctx.lineTo(X(x), B + 4); ctx.stroke();
            ctx.fillText(Math.round(x), X(x), B + 15);
        }
        ctx.textAlign = 'right';
        for (let k = 0; k <= 4; k++) {
            const y = (ymax * k) / 4;
            ctx.beginPath(); ctx.moveTo(L - 4, Y(y)); ctx.lineTo(L, Y(y)); ctx.stroke();
            ctx.fillText(Math.round(y), L - 6, Y(y) + 3);
        }

        function plot(arr, color, dashed) {
            ctx.strokeStyle = color; ctx.lineWidth = 1.75;
            ctx.setLineDash(dashed ? [5, 4] : []);
            ctx.beginPath();
            for (let i = 0; i < data.xs.length; i++) {
                const px = X(data.xs[i]), py = Y(arr[i]);
                if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.stroke();
        }
        plot(data.pi, PALETTE.series1, false);
        plot(data.xlog, PALETTE.series2, false);
        plot(data.liv, PALETTE.series3, true);
        ctx.setLineDash([]);
    }

    let handle = null;
    slider.addEventListener('input', () => {
        valueEl.textContent = slider.value;
        if (handle) cancelAnimationFrame(handle);
        handle = requestAnimationFrame(() => draw(parseInt(slider.value, 10)));
    });
    draw(parseInt(slider.value, 10));
})();
