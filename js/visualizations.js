class GradientDescentViz {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight || 400;
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        this.learningRate = 0.1;
        this.currentFunction = 'quadratic';
        this.position = { x: 0.8, y: 0.8 };
        this.path = [];
        this.isRunning = false;
        this.animationId = null;
        
        this.functions = {
            quadratic: {
                f: (x, y) => x * x + y * y,
                grad: (x, y) => ({ dx: 2 * x, dy: 2 * y }),
                name: 'f(x,y) = x² + y²'
            },
            rosenbrock: {
                f: (x, y) => Math.pow(1 - x, 2) + 100 * Math.pow(y - x * x, 2),
                grad: (x, y) => ({
                    dx: -2 * (1 - x) - 400 * x * (y - x * x),
                    dy: 200 * (y - x * x)
                }),
                name: 'Rosenbrock'
            },
            beale: {
                f: (x, y) => Math.pow(1.5 - x + x * y, 2) + Math.pow(2.25 - x + x * y * y, 2),
                grad: (x, y) => ({
                    dx: 2 * (1.5 - x + x * y) * (-1 + y) + 2 * (2.25 - x + x * y * y) * (-1 + y * y),
                    dy: 2 * (1.5 - x + x * y) * x + 2 * (2.25 - x + x * y * y) * 2 * x * y
                }),
                name: 'Beale'
            }
        };
        
        this.render();
        this.setupControls();
    }

    setupControls() {
        const learningRateInput = document.getElementById('learningRate');
        const learningRateValue = document.getElementById('learningRateValue');
        const functionSelect = document.getElementById('functionSelect');
        const startBtn = document.getElementById('startGradient');
        const resetBtn = document.getElementById('resetGradient');
        
        if (learningRateInput) {
            learningRateInput.addEventListener('input', (e) => {
                this.learningRate = parseFloat(e.target.value);
                if (learningRateValue) learningRateValue.textContent = this.learningRate.toFixed(2);
            });
        }
        
        if (functionSelect) {
            functionSelect.addEventListener('change', (e) => {
                this.currentFunction = e.target.value;
                this.reset();
            });
        }
        
        if (startBtn) {
            startBtn.addEventListener('click', () => this.start());
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.reset());
        }
    }

    render() {
        this.ctx.fillStyle = '#0f1117';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        const func = this.functions[this.currentFunction];
        const imageData = this.ctx.createImageData(this.width, this.height);
        
        let minVal = Infinity, maxVal = -Infinity;
        const values = [];
        
        for (let py = 0; py < this.height; py++) {
            values[py] = [];
            for (let px = 0; px < this.width; px++) {
                const x = (px / this.width) * 4 - 2;
                const y = (py / this.height) * 4 - 2;
                const val = Math.log(func.f(x, y) + 1);
                values[py][px] = val;
                minVal = Math.min(minVal, val);
                maxVal = Math.max(maxVal, val);
            }
        }
        
        for (let py = 0; py < this.height; py++) {
            for (let px = 0; px < this.width; px++) {
                const normalized = (values[py][px] - minVal) / (maxVal - minVal);
                const idx = (py * this.width + px) * 4;
                
                const r = Math.floor(15 + normalized * 30);
                const g = Math.floor(17 + normalized * 80);
                const b = Math.floor(23 + normalized * 100);
                
                imageData.data[idx] = r;
                imageData.data[idx + 1] = g;
                imageData.data[idx + 2] = b;
                imageData.data[idx + 3] = 255;
            }
        }
        
        this.ctx.putImageData(imageData, 0, 0);
        this.drawContours();
        this.drawPath();
        this.drawCurrentPosition();
        this.drawInfo();
    }

    drawContours() {
        const func = this.functions[this.currentFunction];
        const levels = 20;
        
        this.ctx.strokeStyle = 'rgba(88, 166, 255, 0.3)';
        this.ctx.lineWidth = 1;
        
        for (let level = 0; level < levels; level++) {
            const targetValue = Math.exp(level * 0.5) - 1;
            this.ctx.beginPath();
            
            for (let angle = 0; angle < Math.PI * 2; angle += 0.05) {
                for (let r = 0.01; r < 3; r += 0.1) {
                    const x = r * Math.cos(angle);
                    const y = r * Math.sin(angle);
                    const val = func.f(x, y);
                    
                    if (Math.abs(val - targetValue) < 0.5) {
                        const px = ((x + 2) / 4) * this.width;
                        const py = ((y + 2) / 4) * this.height;
                        this.ctx.lineTo(px, py);
                    }
                }
            }
            
            this.ctx.stroke();
        }
    }

    drawPath() {
        if (this.path.length < 2) return;
        
        this.ctx.beginPath();
        this.ctx.strokeStyle = '#7ee787';
        this.ctx.lineWidth = 2;
        
        const firstPoint = this.path[0];
        this.ctx.moveTo(
            ((firstPoint.x + 2) / 4) * this.width,
            ((firstPoint.y + 2) / 4) * this.height
        );
        
        for (let i = 1; i < this.path.length; i++) {
            const point = this.path[i];
            this.ctx.lineTo(
                ((point.x + 2) / 4) * this.width,
                ((point.y + 2) / 4) * this.height
            );
        }
        
        this.ctx.stroke();
        
        this.path.forEach((point, i) => {
            const px = ((point.x + 2) / 4) * this.width;
            const py = ((point.y + 2) / 4) * this.height;
            const alpha = 0.3 + (i / this.path.length) * 0.7;
            
            this.ctx.fillStyle = `rgba(126, 231, 135, ${alpha})`;
            this.ctx.beginPath();
            this.ctx.arc(px, py, 3, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    drawCurrentPosition() {
        const px = ((this.position.x + 2) / 4) * this.width;
        const py = ((this.position.y + 2) / 4) * this.height;
        
        const gradient = this.ctx.createRadialGradient(px, py, 0, px, py, 20);
        gradient.addColorStop(0, 'rgba(88, 166, 255, 0.8)');
        gradient.addColorStop(1, 'rgba(88, 166, 255, 0)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(px, py, 20, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.fillStyle = '#58a6ff';
        this.ctx.beginPath();
        this.ctx.arc(px, py, 6, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawInfo() {
        const func = this.functions[this.currentFunction];
        const currentValue = func.f(this.position.x, this.position.y);
        
        this.ctx.fillStyle = 'rgba(15, 17, 23, 0.8)';
        this.ctx.fillRect(10, 10, 200, 80);
        
        this.ctx.fillStyle = '#e6edf3';
        this.ctx.font = '12px JetBrains Mono';
        this.ctx.fillText(`Function: ${func.name}`, 20, 30);
        this.ctx.fillText(`Position: (${this.position.x.toFixed(3)}, ${this.position.y.toFixed(3)})`, 20, 50);
        this.ctx.fillText(`Value: ${currentValue.toFixed(6)}`, 20, 70);
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.step();
    }

    step() {
        if (!this.isRunning) return;
        
        const func = this.functions[this.currentFunction];
        const grad = func.grad(this.position.x, this.position.y);
        
        const gradMagnitude = Math.sqrt(grad.dx * grad.dx + grad.dy * grad.dy);
        if (gradMagnitude > 10) {
            grad.dx = (grad.dx / gradMagnitude) * 10;
            grad.dy = (grad.dy / gradMagnitude) * 10;
        }
        
        this.path.push({ x: this.position.x, y: this.position.y });
        
        this.position.x -= this.learningRate * grad.dx;
        this.position.y -= this.learningRate * grad.dy;
        
        this.position.x = Math.max(-2, Math.min(2, this.position.x));
        this.position.y = Math.max(-2, Math.min(2, this.position.y));
        
        this.render();
        
        if (gradMagnitude < 0.0001 || this.path.length > 500) {
            this.isRunning = false;
            return;
        }
        
        this.animationId = setTimeout(() => this.step(), 50);
    }

    reset() {
        this.isRunning = false;
        if (this.animationId) clearTimeout(this.animationId);
        this.position = { x: 0.8, y: 0.8 };
        this.path = [];
        this.render();
    }
}

class NeuralNetworkViz {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight || 400;
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        this.hiddenLayers = 2;
        this.currentDataset = 'xor';
        this.isTraining = false;
        this.epoch = 0;
        
        this.datasets = {
            xor: this.generateXOR.bind(this),
            circle: this.generateCircle.bind(this),
            spiral: this.generateSpiral.bind(this)
        };
        
        this.data = this.datasets[this.currentDataset]();
        this.network = null;
        
        this.render();
        this.setupControls();
    }

    generateXOR() {
        const data = [];
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * 2 - 1;
            const y = Math.random() * 2 - 1;
            const label = (x > 0) !== (y > 0) ? 1 : 0;
            data.push({ x, y, label });
        }
        return data;
    }

    generateCircle() {
        const data = [];
        for (let i = 0; i < 100; i++) {
            const angle = Math.random() * Math.PI * 2;
            const r = Math.random() < 0.5 ? Math.random() * 0.4 : 0.6 + Math.random() * 0.4;
            const x = r * Math.cos(angle);
            const y = r * Math.sin(angle);
            const label = r < 0.5 ? 0 : 1;
            data.push({ x, y, label });
        }
        return data;
    }

    generateSpiral() {
        const data = [];
        for (let i = 0; i < 50; i++) {
            const t = i / 50 * Math.PI * 2;
            const r = t / (Math.PI * 2) * 0.8;
            data.push({ x: r * Math.cos(t), y: r * Math.sin(t), label: 0 });
            data.push({ x: -r * Math.cos(t), y: -r * Math.sin(t), label: 1 });
        }
        return data;
    }

    setupControls() {
        const hiddenLayersInput = document.getElementById('hiddenLayers');
        const hiddenLayersValue = document.getElementById('hiddenLayersValue');
        const datasetSelect = document.getElementById('datasetSelect');
        const trainBtn = document.getElementById('trainNetwork');
        const resetBtn = document.getElementById('resetNetwork');
        
        if (hiddenLayersInput) {
            hiddenLayersInput.addEventListener('input', (e) => {
                this.hiddenLayers = parseInt(e.target.value);
                if (hiddenLayersValue) hiddenLayersValue.textContent = this.hiddenLayers;
                this.reset();
            });
        }
        
        if (datasetSelect) {
            datasetSelect.addEventListener('change', (e) => {
                this.currentDataset = e.target.value;
                this.data = this.datasets[this.currentDataset]();
                this.reset();
            });
        }
        
        if (trainBtn) {
            trainBtn.addEventListener('click', () => this.train());
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.reset());
        }
    }

    initNetwork() {
        const layers = [2];
        for (let i = 0; i < this.hiddenLayers; i++) {
            layers.push(8);
        }
        layers.push(1);
        
        this.weights = [];
        this.biases = [];
        
        for (let i = 0; i < layers.length - 1; i++) {
            const w = [];
            const b = [];
            for (let j = 0; j < layers[i + 1]; j++) {
                const row = [];
                for (let k = 0; k < layers[i]; k++) {
                    row.push((Math.random() - 0.5) * 2);
                }
                w.push(row);
                b.push((Math.random() - 0.5) * 0.5);
            }
            this.weights.push(w);
            this.biases.push(b);
        }
        
        this.layers = layers;
    }

    sigmoid(x) {
        return 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, x))));
    }

    forward(x, y) {
        let activation = [x, y];
        
        for (let l = 0; l < this.weights.length; l++) {
            const newActivation = [];
            for (let j = 0; j < this.weights[l].length; j++) {
                let sum = this.biases[l][j];
                for (let k = 0; k < activation.length; k++) {
                    sum += this.weights[l][j][k] * activation[k];
                }
                newActivation.push(this.sigmoid(sum));
            }
            activation = newActivation;
        }
        
        return activation[0];
    }

    train() {
        if (!this.weights) this.initNetwork();
        
        this.isTraining = true;
        this.trainStep();
    }

    trainStep() {
        if (!this.isTraining) return;
        
        const lr = 0.5;
        
        for (let e = 0; e < 10; e++) {
            this.data.forEach(point => {
                const activations = [[point.x, point.y]];
                
                for (let l = 0; l < this.weights.length; l++) {
                    const newActivation = [];
                    for (let j = 0; j < this.weights[l].length; j++) {
                        let sum = this.biases[l][j];
                        for (let k = 0; k < activations[l].length; k++) {
                            sum += this.weights[l][j][k] * activations[l][k];
                        }
                        newActivation.push(this.sigmoid(sum));
                    }
                    activations.push(newActivation);
                }
                
                const output = activations[activations.length - 1][0];
                let delta = [(output - point.label) * output * (1 - output)];
                
                for (let l = this.weights.length - 1; l >= 0; l--) {
                    const newDelta = [];
                    
                    for (let j = 0; j < this.weights[l].length; j++) {
                        for (let k = 0; k < activations[l].length; k++) {
                            this.weights[l][j][k] -= lr * delta[j] * activations[l][k];
                        }
                        this.biases[l][j] -= lr * delta[j];
                    }
                    
                    if (l > 0) {
                        for (let k = 0; k < activations[l].length; k++) {
                            let sum = 0;
                            for (let j = 0; j < delta.length; j++) {
                                sum += delta[j] * this.weights[l][j][k];
                            }
                            newDelta.push(sum * activations[l][k] * (1 - activations[l][k]));
                        }
                        delta = newDelta;
                    }
                }
            });
        }
        
        this.epoch += 10;
        this.render();
        
        if (this.epoch < 500) {
            requestAnimationFrame(() => this.trainStep());
        } else {
            this.isTraining = false;
        }
    }

    render() {
        this.ctx.fillStyle = '#0f1117';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        if (this.weights) {
            this.drawDecisionBoundary();
        }
        
        this.drawData();
        this.drawNetworkDiagram();
        this.drawInfo();
    }

    drawDecisionBoundary() {
        const resolution = 4;
        
        for (let px = 0; px < this.width * 0.6; px += resolution) {
            for (let py = 0; py < this.height; py += resolution) {
                const x = (px / (this.width * 0.6)) * 2 - 1;
                const y = (py / this.height) * 2 - 1;
                const output = this.forward(x, y);
                
                const r = Math.floor(output * 88);
                const g = Math.floor(output * 166);
                const b = Math.floor(255 - output * 128);
                
                this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.3)`;
                this.ctx.fillRect(px, py, resolution, resolution);
            }
        }
    }

    drawData() {
        this.data.forEach(point => {
            const px = ((point.x + 1) / 2) * (this.width * 0.6);
            const py = ((point.y + 1) / 2) * this.height;
            
            this.ctx.beginPath();
            this.ctx.arc(px, py, 5, 0, Math.PI * 2);
            
            if (point.label === 0) {
                this.ctx.fillStyle = '#58a6ff';
            } else {
                this.ctx.fillStyle = '#7ee787';
            }
            this.ctx.fill();
            
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        });
    }

    drawNetworkDiagram() {
        const startX = this.width * 0.65;
        const netWidth = this.width * 0.3;
        const netHeight = this.height * 0.8;
        const offsetY = this.height * 0.1;
        
        if (!this.layers) return;
        
        const layerSpacing = netWidth / (this.layers.length - 1);
        
        for (let l = 0; l < this.layers.length - 1; l++) {
            const x1 = startX + l * layerSpacing;
            const x2 = startX + (l + 1) * layerSpacing;
            
            for (let i = 0; i < this.layers[l]; i++) {
                const y1 = offsetY + (i + 0.5) * (netHeight / this.layers[l]);
                
                for (let j = 0; j < this.layers[l + 1]; j++) {
                    const y2 = offsetY + (j + 0.5) * (netHeight / this.layers[l + 1]);
                    
                    let weight = 0;
                    if (this.weights && this.weights[l]) {
                        weight = this.weights[l][j][i] || 0;
                    }
                    
                    const alpha = Math.min(Math.abs(weight) * 0.5, 1);
                    const color = weight > 0 ? `rgba(126, 231, 135, ${alpha})` : `rgba(247, 129, 102, ${alpha})`;
                    
                    this.ctx.strokeStyle = color;
                    this.ctx.lineWidth = Math.abs(weight) * 2;
                    this.ctx.beginPath();
                    this.ctx.moveTo(x1, y1);
                    this.ctx.lineTo(x2, y2);
                    this.ctx.stroke();
                }
            }
        }
        
        for (let l = 0; l < this.layers.length; l++) {
            const x = startX + l * layerSpacing;
            
            for (let i = 0; i < this.layers[l]; i++) {
                const y = offsetY + (i + 0.5) * (netHeight / this.layers[l]);
                
                this.ctx.fillStyle = '#58a6ff';
                this.ctx.beginPath();
                this.ctx.arc(x, y, 8, 0, Math.PI * 2);
                this.ctx.fill();
                
                this.ctx.strokeStyle = '#e6edf3';
                this.ctx.lineWidth = 1;
                this.ctx.stroke();
            }
        }
    }

    drawInfo() {
        this.ctx.fillStyle = 'rgba(15, 17, 23, 0.8)';
        this.ctx.fillRect(10, 10, 150, 60);
        
        this.ctx.fillStyle = '#e6edf3';
        this.ctx.font = '12px JetBrains Mono';
        this.ctx.fillText(`Dataset: ${this.currentDataset}`, 20, 30);
        this.ctx.fillText(`Epoch: ${this.epoch}`, 20, 50);
    }

    reset() {
        this.isTraining = false;
        this.epoch = 0;
        this.weights = null;
        this.biases = null;
        this.initNetwork();
        this.render();
    }
}

class EmbeddingViz {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight || 400;
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        this.perplexity = 30;
        this.points = this.generateHighDimData();
        this.projectedPoints = null;
        
        this.render();
        this.setupControls();
    }

    generateHighDimData() {
        const clusters = [
            { center: [1, 1, 1, 1, 1], label: 'ML', color: '#58a6ff' },
            { center: [-1, -1, 1, 1, 1], label: 'DL', color: '#7ee787' },
            { center: [1, -1, -1, 1, 1], label: 'NLP', color: '#a371f7' },
            { center: [-1, 1, -1, -1, 1], label: 'CV', color: '#f78166' },
            { center: [1, 1, -1, -1, -1], label: 'RL', color: '#f0883e' }
        ];
        
        const points = [];
        clusters.forEach(cluster => {
            for (let i = 0; i < 15; i++) {
                const point = cluster.center.map(c => c + (Math.random() - 0.5) * 0.5);
                points.push({
                    highDim: point,
                    label: cluster.label,
                    color: cluster.color,
                    x: Math.random() * 2 - 1,
                    y: Math.random() * 2 - 1
                });
            }
        });
        
        return points;
    }

    setupControls() {
        const perplexityInput = document.getElementById('perplexity');
        const perplexityValue = document.getElementById('perplexityValue');
        const runBtn = document.getElementById('runTsne');
        
        if (perplexityInput) {
            perplexityInput.addEventListener('input', (e) => {
                this.perplexity = parseInt(e.target.value);
                if (perplexityValue) perplexityValue.textContent = this.perplexity;
            });
        }
        
        if (runBtn) {
            runBtn.addEventListener('click', () => this.runTSNE());
        }
    }

    distance(a, b) {
        let sum = 0;
        for (let i = 0; i < a.length; i++) {
            sum += (a[i] - b[i]) ** 2;
        }
        return Math.sqrt(sum);
    }

    runTSNE() {
        const n = this.points.length;
        const lr = 10;
        const iterations = 200;
        
        const distances = [];
        for (let i = 0; i < n; i++) {
            distances[i] = [];
            for (let j = 0; j < n; j++) {
                distances[i][j] = this.distance(this.points[i].highDim, this.points[j].highDim);
            }
        }
        
        const P = [];
        for (let i = 0; i < n; i++) {
            P[i] = [];
            const sorted = distances[i].map((d, j) => ({ d, j }))
                .filter(x => x.j !== i)
                .sort((a, b) => a.d - b.d);
            
            const sigma = sorted[Math.min(this.perplexity, sorted.length - 1)].d || 1;
            
            let sum = 0;
            for (let j = 0; j < n; j++) {
                if (i !== j) {
                    P[i][j] = Math.exp(-distances[i][j] ** 2 / (2 * sigma ** 2));
                    sum += P[i][j];
                } else {
                    P[i][j] = 0;
                }
            }
            
            for (let j = 0; j < n; j++) {
                P[i][j] /= sum || 1;
            }
        }
        
        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                const pij = (P[i][j] + P[j][i]) / (2 * n);
                P[i][j] = pij;
                P[j][i] = pij;
            }
        }
        
        let step = 0;
        const animate = () => {
            if (step >= iterations) return;
            
            const Q = [];
            let qSum = 0;
            for (let i = 0; i < n; i++) {
                Q[i] = [];
                for (let j = 0; j < n; j++) {
                    if (i !== j) {
                        const dx = this.points[i].x - this.points[j].x;
                        const dy = this.points[i].y - this.points[j].y;
                        Q[i][j] = 1 / (1 + dx * dx + dy * dy);
                        qSum += Q[i][j];
                    } else {
                        Q[i][j] = 0;
                    }
                }
            }
            
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                    Q[i][j] /= qSum || 1;
                }
            }
            
            for (let i = 0; i < n; i++) {
                let gradX = 0, gradY = 0;
                
                for (let j = 0; j < n; j++) {
                    if (i !== j) {
                        const dx = this.points[i].x - this.points[j].x;
                        const dy = this.points[i].y - this.points[j].y;
                        const mult = 4 * (P[i][j] - Q[i][j]) * Q[i][j] * (1 + dx * dx + dy * dy);
                        gradX += mult * dx;
                        gradY += mult * dy;
                    }
                }
                
                this.points[i].x -= lr * gradX;
                this.points[i].y -= lr * gradY;
            }
            
            let minX = Infinity, maxX = -Infinity;
            let minY = Infinity, maxY = -Infinity;
            this.points.forEach(p => {
                minX = Math.min(minX, p.x);
                maxX = Math.max(maxX, p.x);
                minY = Math.min(minY, p.y);
                maxY = Math.max(maxY, p.y);
            });
            
            this.points.forEach(p => {
                p.x = ((p.x - minX) / (maxX - minX || 1)) * 2 - 1;
                p.y = ((p.y - minY) / (maxY - minY || 1)) * 2 - 1;
            });
            
            this.render();
            step++;
            
            if (step < iterations) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }

    render() {
        this.ctx.fillStyle = '#0f1117';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        this.ctx.strokeStyle = 'rgba(48, 54, 61, 0.5)';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i <= 10; i++) {
            const x = (i / 10) * this.width;
            const y = (i / 10) * this.height;
            
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.height);
            this.ctx.stroke();
            
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
            this.ctx.stroke();
        }
        
        this.points.forEach(point => {
            const px = ((point.x + 1) / 2) * (this.width - 40) + 20;
            const py = ((point.y + 1) / 2) * (this.height - 40) + 20;
            
            const gradient = this.ctx.createRadialGradient(px, py, 0, px, py, 15);
            gradient.addColorStop(0, point.color);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(px, py, 15, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.fillStyle = point.color;
            this.ctx.beginPath();
            this.ctx.arc(px, py, 6, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.fillStyle = '#e6edf3';
            this.ctx.font = '10px Inter';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(point.label, px, py + 20);
        });
        
        this.drawLegend();
    }

    drawLegend() {
        const labels = ['ML', 'DL', 'NLP', 'CV', 'RL'];
        const colors = ['#58a6ff', '#7ee787', '#a371f7', '#f78166', '#f0883e'];
        
        this.ctx.fillStyle = 'rgba(15, 17, 23, 0.8)';
        this.ctx.fillRect(10, 10, 80, labels.length * 20 + 10);
        
        labels.forEach((label, i) => {
            this.ctx.fillStyle = colors[i];
            this.ctx.beginPath();
            this.ctx.arc(25, 25 + i * 20, 5, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.fillStyle = '#e6edf3';
            this.ctx.font = '11px Inter';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(label, 40, 29 + i * 20);
        });
    }
}

class OptimizationViz {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight || 400;
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        this.algorithm = 'genetic';
        this.isRunning = false;
        this.particles = [];
        this.bestPosition = null;
        this.bestValue = Infinity;
        this.generation = 0;
        
        this.render();
        this.setupControls();
    }

    setupControls() {
        const algorithmSelect = document.getElementById('algorithmSelect');
        const runBtn = document.getElementById('runOptimization');
        const resetBtn = document.getElementById('resetOptimization');
        
        if (algorithmSelect) {
            algorithmSelect.addEventListener('change', (e) => {
                this.algorithm = e.target.value;
                this.reset();
            });
        }
        
        if (runBtn) {
            runBtn.addEventListener('click', () => this.run());
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.reset());
        }
    }

    fitness(x, y) {
        return Math.sin(x * 3) * Math.cos(y * 3) + Math.sin(x + y) - 
               (x * x + y * y) * 0.1;
    }

    initParticles() {
        this.particles = [];
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * 2 - 1,
                y: Math.random() * 2 - 1,
                vx: (Math.random() - 0.5) * 0.1,
                vy: (Math.random() - 0.5) * 0.1,
                bestX: 0,
                bestY: 0,
                bestValue: -Infinity
            });
        }
        this.bestPosition = null;
        this.bestValue = -Infinity;
        this.generation = 0;
    }

    run() {
        if (this.isRunning) return;
        
        if (this.particles.length === 0) {
            this.initParticles();
        }
        
        this.isRunning = true;
        this.step();
    }

    step() {
        if (!this.isRunning) return;
        
        if (this.algorithm === 'genetic') {
            this.geneticStep();
        } else if (this.algorithm === 'pso') {
            this.psoStep();
        } else if (this.algorithm === 'annealing') {
            this.annealingStep();
        }
        
        this.generation++;
        this.render();
        
        if (this.generation < 200) {
            setTimeout(() => this.step(), 50);
        } else {
            this.isRunning = false;
        }
    }

    geneticStep() {
        this.particles.forEach(p => {
            p.fitness = this.fitness(p.x, p.y);
            if (p.fitness > this.bestValue) {
                this.bestValue = p.fitness;
                this.bestPosition = { x: p.x, y: p.y };
            }
        });
        
        this.particles.sort((a, b) => b.fitness - a.fitness);
        
        const survivors = this.particles.slice(0, 25);
        const newParticles = [...survivors];
        
        while (newParticles.length < 50) {
            const p1 = survivors[Math.floor(Math.random() * survivors.length)];
            const p2 = survivors[Math.floor(Math.random() * survivors.length)];
            
            const child = {
                x: (p1.x + p2.x) / 2 + (Math.random() - 0.5) * 0.2,
                y: (p1.y + p2.y) / 2 + (Math.random() - 0.5) * 0.2,
                vx: 0,
                vy: 0,
                bestX: 0,
                bestY: 0,
                bestValue: -Infinity
            };
            
            child.x = Math.max(-1, Math.min(1, child.x));
            child.y = Math.max(-1, Math.min(1, child.y));
            
            newParticles.push(child);
        }
        
        this.particles = newParticles;
    }

    psoStep() {
        const w = 0.7;
        const c1 = 1.5;
        const c2 = 1.5;
        
        this.particles.forEach(p => {
            const fitness = this.fitness(p.x, p.y);
            
            if (fitness > p.bestValue) {
                p.bestValue = fitness;
                p.bestX = p.x;
                p.bestY = p.y;
            }
            
            if (fitness > this.bestValue) {
                this.bestValue = fitness;
                this.bestPosition = { x: p.x, y: p.y };
            }
        });
        
        this.particles.forEach(p => {
            const r1 = Math.random();
            const r2 = Math.random();
            
            p.vx = w * p.vx + 
                   c1 * r1 * (p.bestX - p.x) + 
                   c2 * r2 * ((this.bestPosition?.x || 0) - p.x);
            p.vy = w * p.vy + 
                   c1 * r1 * (p.bestY - p.y) + 
                   c2 * r2 * ((this.bestPosition?.y || 0) - p.y);
            
            p.x += p.vx;
            p.y += p.vy;
            
            p.x = Math.max(-1, Math.min(1, p.x));
            p.y = Math.max(-1, Math.min(1, p.y));
        });
    }

    annealingStep() {
        const temp = 1 - this.generation / 200;
        
        this.particles.forEach(p => {
            const currentFitness = this.fitness(p.x, p.y);
            
            const newX = p.x + (Math.random() - 0.5) * temp * 0.5;
            const newY = p.y + (Math.random() - 0.5) * temp * 0.5;
            
            const clampedX = Math.max(-1, Math.min(1, newX));
            const clampedY = Math.max(-1, Math.min(1, newY));
            const newFitness = this.fitness(clampedX, clampedY);
            
            if (newFitness > currentFitness || Math.random() < Math.exp((newFitness - currentFitness) / temp)) {
                p.x = clampedX;
                p.y = clampedY;
            }
            
            if (this.fitness(p.x, p.y) > this.bestValue) {
                this.bestValue = this.fitness(p.x, p.y);
                this.bestPosition = { x: p.x, y: p.y };
            }
        });
    }

    render() {
        this.ctx.fillStyle = '#0f1117';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        this.drawFitnessLandscape();
        this.drawParticles();
        this.drawBest();
        this.drawInfo();
    }

    drawFitnessLandscape() {
        const resolution = 4;
        
        for (let px = 0; px < this.width; px += resolution) {
            for (let py = 0; py < this.height; py += resolution) {
                const x = (px / this.width) * 2 - 1;
                const y = (py / this.height) * 2 - 1;
                const val = this.fitness(x, y);
                
                const normalized = (val + 2) / 4;
                const r = Math.floor(15 + normalized * 60);
                const g = Math.floor(17 + normalized * 100);
                const b = Math.floor(23 + normalized * 80);
                
                this.ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                this.ctx.fillRect(px, py, resolution, resolution);
            }
        }
    }

    drawParticles() {
        this.particles.forEach(p => {
            const px = ((p.x + 1) / 2) * this.width;
            const py = ((p.y + 1) / 2) * this.height;
            
            this.ctx.fillStyle = '#58a6ff';
            this.ctx.beginPath();
            this.ctx.arc(px, py, 4, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    drawBest() {
        if (!this.bestPosition) return;
        
        const px = ((this.bestPosition.x + 1) / 2) * this.width;
        const py = ((this.bestPosition.y + 1) / 2) * this.height;
        
        const gradient = this.ctx.createRadialGradient(px, py, 0, px, py, 20);
        gradient.addColorStop(0, 'rgba(126, 231, 135, 0.8)');
        gradient.addColorStop(1, 'rgba(126, 231, 135, 0)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(px, py, 20, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.fillStyle = '#7ee787';
        this.ctx.beginPath();
        this.ctx.arc(px, py, 6, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawInfo() {
        const names = {
            'genetic': 'Genetic Algorithm',
            'pso': 'Particle Swarm',
            'annealing': 'Simulated Annealing'
        };
        
        this.ctx.fillStyle = 'rgba(15, 17, 23, 0.8)';
        this.ctx.fillRect(10, 10, 200, 80);
        
        this.ctx.fillStyle = '#e6edf3';
        this.ctx.font = '12px JetBrains Mono';
        this.ctx.fillText(`Algorithm: ${names[this.algorithm]}`, 20, 30);
        this.ctx.fillText(`Generation: ${this.generation}`, 20, 50);
        this.ctx.fillText(`Best: ${this.bestValue.toFixed(4)}`, 20, 70);
    }

    reset() {
        this.isRunning = false;
        this.particles = [];
        this.bestPosition = null;
        this.bestValue = -Infinity;
        this.generation = 0;
        this.initParticles();
        this.render();
    }
}

let gradientViz, neuralViz, embeddingViz, optimizationViz;

function initVisualizations() {
    const gradientCanvas = document.getElementById('gradientCanvas');
    const neuralCanvas = document.getElementById('neuralCanvas');
    const embeddingCanvas = document.getElementById('embeddingCanvas');
    const optimizationCanvas = document.getElementById('optimizationCanvas');
    
    if (gradientCanvas) {
        gradientViz = new GradientDescentViz('gradientCanvas');
    }
    if (neuralCanvas) {
        neuralViz = new NeuralNetworkViz('neuralCanvas');
    }
    if (embeddingCanvas) {
        embeddingViz = new EmbeddingViz('embeddingCanvas');
    }
    if (optimizationCanvas) {
        optimizationViz = new OptimizationViz('optimizationCanvas');
    }
}

document.addEventListener('DOMContentLoaded', initVisualizations);
