// Enhanced canvas backgrounds for enterprise feel
const canvas = {
    ctx: null,
    canvas: null,
    animationId: null,
    particles: [],

    // Initialize canvas
    init() {
        this.canvas = document.getElementById('backgroundCanvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        this.setupEventListeners();
        this.animate();
    },

    // Resize canvas to window size
    resizeCanvas() {
        if (!this.canvas) return;

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.createParticles();
    },

    // Setup event listeners
    setupEventListeners() {
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Add interaction on department selection
        document.addEventListener('departmentSelected', (event) => {
            this.changeTheme(event.detail.departmentId);
        });
    },

    // Change theme based on department
    changeTheme(departmentId) {
        const department = departments[departmentId];
        if (!department) return;

        // Update particle colors based on department
        this.createParticles();
    },

    // Create particles for background
    createParticles() {
        this.particles = [];
        const particleCount = Math.min(Math.floor((this.canvas.width * this.canvas.height) / 10000), 150);

        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                color: this.getParticleColor(),
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    },

    // Get particle color based on current department
    getParticleColor() {
        const departmentId = state.getCurrentDepartment();
        const department = departments[departmentId];
        
        if (department) {
            return department.color;
        }
        
        // Default colors
        const colors = ['#2e7d32', '#1565c0', '#ff6f00', '#7b1fa2'];
        return colors[Math.floor(Math.random() * colors.length)];
    },

    // Animation loop
    animate() {
        if (!this.ctx || !this.canvas) return;

        // Clear canvas with slight fade effect for trailing
        this.ctx.fillStyle = 'rgba(18, 18, 18, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw network grid
        this.drawNetworkGrid();

        // Update and draw particles
        this.updateParticles();
        this.drawParticles();

        // Draw department-specific elements
        this.drawDepartmentElements();

        this.animationId = requestAnimationFrame(() => this.animate());
    },

    // Draw network grid
    drawNetworkGrid() {
        const gridSize = 80;
        const offsetX = (Date.now() * 0.01) % gridSize;
        const offsetY = (Date.now() * 0.005) % gridSize;

        this.ctx.strokeStyle = 'rgba(46, 125, 50, 0.1)';
        this.ctx.lineWidth = 1;

        // Vertical lines
        for (let x = offsetX; x < this.canvas.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }

        // Horizontal lines
        for (let y = offsetY; y < this.canvas.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }

        // Draw connections between random points
        this.ctx.strokeStyle = 'rgba(46, 125, 50, 0.15)';
        for (let i = 0; i < 10; i++) {
            const x1 = Math.random() * this.canvas.width;
            const y1 = Math.random() * this.canvas.height;
            const x2 = Math.random() * this.canvas.width;
            const y2 = Math.random() * this.canvas.height;

            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
        }
    },

    // Update particle positions
    updateParticles() {
        this.particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Bounce off edges
            if (particle.x <= 0 || particle.x >= this.canvas.width) {
                particle.speedX *= -1;
            }
            if (particle.y <= 0 || particle.y >= this.canvas.height) {
                particle.speedY *= -1;
            }

            // Keep particles within bounds
            particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
        });
    },

    // Draw particles
    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color + Math.floor(particle.opacity * 255).toString(16).padStart(2, '0');
            this.ctx.fill();

            // Draw connections between nearby particles
            this.particles.forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.strokeStyle = particle.color + Math.floor((0.2 - distance / 500) * 255).toString(16).padStart(2, '0');
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            });
        });
    },

    // Draw department-specific elements
    drawDepartmentElements() {
        const departmentId = state.getCurrentDepartment();
        if (!departmentId) return;

        const department = departments[departmentId];
        const time = Date.now() * 0.001;

        switch (departmentId) {
            case 'nms':
                this.drawNetworkElements(time);
                break;
            case 'hr':
                this.drawDataProtectionElements(time);
                break;
            case 'it':
                this.drawSecurityElements(time);
                break;
        }
    },

    // Draw network elements for NMS
    drawNetworkElements(time) {
        // Draw network nodes
        const nodes = 8;
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(this.canvas.width, this.canvas.height) * 0.3;

        for (let i = 0; i < nodes; i++) {
            const angle = (i / nodes) * Math.PI * 2 + time * 0.5;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;

            // Draw node
            this.ctx.beginPath();
            this.ctx.arc(x, y, 8, 0, Math.PI * 2);
            this.ctx.fillStyle = '#2196f3';
            this.ctx.fill();

            // Draw connections to center
            this.ctx.beginPath();
            this.ctx.moveTo(centerX, centerY);
            this.ctx.lineTo(x, y);
            this.ctx.strokeStyle = 'rgba(33, 150, 243, 0.3)';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        }
    },

    // Draw data protection elements for HR
    drawDataProtectionElements(time) {
        // Draw shield patterns
        const shields = 6;
        for (let i = 0; i < shields; i++) {
            const x = (this.canvas.width / (shields + 1)) * (i + 1);
            const y = this.canvas.height / 2 + Math.sin(time + i) * 20;
            const size = 30 + Math.sin(time * 2 + i) * 10;

            this.drawShield(x, y, size, '#9c27b0');
        }
    },

    // Draw security elements for IT
    drawSecurityElements(time) {
        // Draw scanning lines
        const scanY = (this.canvas.height / 2 + Math.sin(time) * 100) % this.canvas.height;

        this.ctx.strokeStyle = 'rgba(244, 67, 54, 0.3)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, scanY);
        this.ctx.lineTo(this.canvas.width, scanY);
        this.ctx.stroke();

        // Draw security icons
        const icons = ['🔒', '🔑', '🛡️', '⚠️'];
        for (let i = 0; i < 4; i++) {
            const x = (this.canvas.width / 5) * (i + 1);
            const y = this.canvas.height / 3 + Math.sin(time + i) * 50;

            this.ctx.font = '30px Arial';
            this.ctx.fillStyle = 'rgba(244, 67, 54, 0.7)';
            this.ctx.fillText(icons[i], x, y);
        }
    },

    // Draw shield symbol
    drawShield(x, y, size, color) {
        this.ctx.fillStyle = color + '40';
        this.ctx.strokeStyle = color + '80';
        this.ctx.lineWidth = 2;

        this.ctx.beginPath();
        this.ctx.moveTo(x, y - size / 2);
        this.ctx.lineTo(x + size / 2, y + size / 2);
        this.ctx.lineTo(x - size / 2, y + size / 2);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
    },

    // Clean up
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
};
