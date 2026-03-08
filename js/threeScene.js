class ParticleField {
    constructor() {
        this.container = document.getElementById('particleCanvas');
        if (!this.container) return;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.container,
            antialias: true,
            alpha: true 
        });
        
        this.particles = null;
        this.particleCount = 2000;
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetMouseX = 0;
        this.targetMouseY = 0;
        this.windowHalfX = window.innerWidth / 2;
        this.windowHalfY = window.innerHeight / 2;
        
        this.clock = new THREE.Clock();
        this.connections = [];
        this.connectionMaterial = null;
        
        this.init();
        this.createParticles();
        this.createConnections();
        this.addEventListeners();
        this.animate();
    }

    init() {
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x0f1117, 1);
        
        this.camera.position.z = 300;
    }

    createParticles() {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.particleCount * 3);
        const colors = new Float32Array(this.particleCount * 3);
        const sizes = new Float32Array(this.particleCount);
        const velocities = new Float32Array(this.particleCount * 3);
        
        const color1 = new THREE.Color(0x58a6ff);
        const color2 = new THREE.Color(0x7ee787);
        const color3 = new THREE.Color(0xa371f7);
        
        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            
            positions[i3] = (Math.random() - 0.5) * 800;
            positions[i3 + 1] = (Math.random() - 0.5) * 800;
            positions[i3 + 2] = (Math.random() - 0.5) * 400;
            
            velocities[i3] = (Math.random() - 0.5) * 0.5;
            velocities[i3 + 1] = (Math.random() - 0.5) * 0.5;
            velocities[i3 + 2] = (Math.random() - 0.5) * 0.5;
            
            const colorChoice = Math.random();
            let color;
            if (colorChoice < 0.5) {
                color = color1;
            } else if (colorChoice < 0.8) {
                color = color2;
            } else {
                color = color3;
            }
            
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
            
            sizes[i] = Math.random() * 3 + 1;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        this.velocities = velocities;

        const vertexShader = `
            attribute float size;
            varying vec3 vColor;
            
            void main() {
                vColor = color;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `;
        
        const fragmentShader = `
            varying vec3 vColor;
            
            void main() {
                float distanceFromCenter = length(gl_PointCoord - vec2(0.5));
                if (distanceFromCenter > 0.5) discard;
                
                float alpha = 1.0 - (distanceFromCenter * 2.0);
                alpha = pow(alpha, 1.5);
                
                vec3 glowColor = vColor * 1.5;
                gl_FragColor = vec4(glowColor, alpha * 0.8);
            }
        `;
        
        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            transparent: true,
            vertexColors: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });
        
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    createConnections() {
        const connectionGeometry = new THREE.BufferGeometry();
        const connectionPositions = new Float32Array(this.particleCount * 6);
        connectionGeometry.setAttribute('position', new THREE.BufferAttribute(connectionPositions, 3));
        
        this.connectionMaterial = new THREE.LineBasicMaterial({
            color: 0x58a6ff,
            transparent: true,
            opacity: 0.15,
            blending: THREE.AdditiveBlending
        });
        
        this.connectionLines = new THREE.LineSegments(connectionGeometry, this.connectionMaterial);
        this.scene.add(this.connectionLines);
    }

    updateConnections() {
        const positions = this.particles.geometry.attributes.position.array;
        const connectionPositions = this.connectionLines.geometry.attributes.position.array;
        const maxDistance = 60;
        const maxConnections = 300;
        
        let connectionIndex = 0;
        
        for (let i = 0; i < this.particleCount && connectionIndex < maxConnections; i++) {
            const i3 = i * 3;
            const x1 = positions[i3];
            const y1 = positions[i3 + 1];
            const z1 = positions[i3 + 2];
            
            for (let j = i + 1; j < this.particleCount && connectionIndex < maxConnections; j++) {
                const j3 = j * 3;
                const x2 = positions[j3];
                const y2 = positions[j3 + 1];
                const z2 = positions[j3 + 2];
                
                const dx = x1 - x2;
                const dy = y1 - y2;
                const dz = z1 - z2;
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
                
                if (distance < maxDistance) {
                    const ci = connectionIndex * 6;
                    connectionPositions[ci] = x1;
                    connectionPositions[ci + 1] = y1;
                    connectionPositions[ci + 2] = z1;
                    connectionPositions[ci + 3] = x2;
                    connectionPositions[ci + 4] = y2;
                    connectionPositions[ci + 5] = z2;
                    connectionIndex++;
                }
            }
        }
        
        for (let i = connectionIndex * 6; i < connectionPositions.length; i++) {
            connectionPositions[i] = 0;
        }
        
        this.connectionLines.geometry.attributes.position.needsUpdate = true;
    }

    addEventListeners() {
        window.addEventListener('resize', this.onWindowResize.bind(this));
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        document.addEventListener('touchmove', this.onTouchMove.bind(this));
    }

    onWindowResize() {
        this.windowHalfX = window.innerWidth / 2;
        this.windowHalfY = window.innerHeight / 2;
        
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onMouseMove(event) {
        this.targetMouseX = (event.clientX - this.windowHalfX) * 0.5;
        this.targetMouseY = (event.clientY - this.windowHalfY) * 0.5;
    }

    onTouchMove(event) {
        if (event.touches.length > 0) {
            this.targetMouseX = (event.touches[0].clientX - this.windowHalfX) * 0.5;
            this.targetMouseY = (event.touches[0].clientY - this.windowHalfY) * 0.5;
        }
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        const delta = this.clock.getDelta();
        const time = this.clock.getElapsedTime();
        
        this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
        this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;
        
        this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.02;
        this.camera.position.y += (-this.mouseY - this.camera.position.y) * 0.02;
        this.camera.lookAt(this.scene.position);
        
        const positions = this.particles.geometry.attributes.position.array;
        
        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            
            positions[i3] += this.velocities[i3] + Math.sin(time * 0.5 + i * 0.01) * 0.1;
            positions[i3 + 1] += this.velocities[i3 + 1] + Math.cos(time * 0.3 + i * 0.01) * 0.1;
            positions[i3 + 2] += this.velocities[i3 + 2];
            
            const mouseInfluenceX = (this.mouseX - positions[i3]) * 0.00005;
            const mouseInfluenceY = (-this.mouseY - positions[i3 + 1]) * 0.00005;
            
            positions[i3] += mouseInfluenceX;
            positions[i3 + 1] += mouseInfluenceY;
            
            if (positions[i3] > 400) positions[i3] = -400;
            if (positions[i3] < -400) positions[i3] = 400;
            if (positions[i3 + 1] > 400) positions[i3 + 1] = -400;
            if (positions[i3 + 1] < -400) positions[i3 + 1] = 400;
            if (positions[i3 + 2] > 200) positions[i3 + 2] = -200;
            if (positions[i3 + 2] < -200) positions[i3 + 2] = 200;
        }
        
        this.particles.geometry.attributes.position.needsUpdate = true;
        
        if (Math.floor(time * 10) % 3 === 0) {
            this.updateConnections();
        }
        
        this.particles.rotation.y = time * 0.02;
        
        this.renderer.render(this.scene, this.camera);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('particleCanvas')) {
        new ParticleField();
    }
});
