// =============================================
// Chrome Dino-style Runner Game
// Destination-themed: characters, obstacles, backgrounds
// Trigger: type "game" on destination page
// =============================================
(function () {
    'use strict';

    const THEMES = {
        italy: {
            name: 'Italy',
            sky1: '#5BA3D9', sky2: '#C8E6FF',
            ground: '#9B8B6E', groundLine: '#7A6E5A', grass: '#6B8E23',
            char: { body: '#8B0000', hat: '#FFD700', skin: '#F0C8A0', label: 'Gladiator', crest: '#FF0000' },
            obstacles: [
                { label: 'Column', w: 30, h: 70, color: '#D4C5A9', accent: '#BEB099' },
                { label: 'Vespa', w: 50, h: 36, color: '#2E8B57', accent: '#1E6B37' },
                { label: 'Wine Bottle', w: 20, h: 55, color: '#722F37', accent: '#5A1F27' }
            ],
            buildings: [
                { type: 'dome', c1: '#C8B898', c2: '#A89878' },
                { type: 'tower', c1: '#D4C5A9', c2: '#BEB099' },
                { type: 'cypress', c1: '#2D5A27', c2: '#1D4A17' }
            ],
            cloud: 'rgba(255,255,255,0.8)', groundTex: '#786A52'
        },
        greece: {
            name: 'Greece',
            sky1: '#1E90FF', sky2: '#87CEEB',
            ground: '#E8DCC8', groundLine: '#D0C4B0', grass: '#9BC89B',
            char: { body: '#FFFFFF', hat: '#1E90FF', skin: '#E8C8A0', label: 'Philosopher', crest: '#228B22' },
            obstacles: [
                { label: 'Amphora', w: 28, h: 50, color: '#CD853F', accent: '#A0682F' },
                { label: 'Column', w: 26, h: 72, color: '#FFFFFF', accent: '#E0E0E0' },
                { label: 'Olive Tree', w: 45, h: 60, color: '#556B2F', accent: '#6B8E23' }
            ],
            buildings: [
                { type: 'parthenon', c1: '#FFFFFF', c2: '#E0E0E0' },
                { type: 'windmill', c1: '#FFFFFF', c2: '#4A90D9' },
                { type: 'dome', c1: '#4A90D9', c2: '#FFFFFF' }
            ],
            cloud: 'rgba(255,255,255,0.9)', groundTex: '#C4B8A0'
        },
        portugal: {
            name: 'Portugal',
            sky1: '#4A90D9', sky2: '#FFE4B5',
            ground: '#B8A080', groundLine: '#9A8868', grass: '#7CCD7C',
            char: { body: '#1B1B1B', hat: '#8B0000', skin: '#E0B888', label: 'Fado Singer', crest: '#FFD700' },
            obstacles: [
                { label: 'Tram', w: 55, h: 44, color: '#FFD700', accent: '#DAA520' },
                { label: 'Sardine', w: 40, h: 22, color: '#4682B4', accent: '#36648B' },
                { label: 'Rooster', w: 30, h: 48, color: '#1B1B1B', accent: '#FF0000' }
            ],
            buildings: [
                { type: 'tower', c1: '#F5DEB3', c2: '#1E90FF' },
                { type: 'house', c1: '#4A90D9', c2: '#FFD700' },
                { type: 'house', c1: '#FF6347', c2: '#FFFFFF' }
            ],
            cloud: 'rgba(255,255,255,0.8)', groundTex: '#8A7A5E'
        },
        spain: {
            name: 'Spain',
            sky1: '#FF8C00', sky2: '#87CEEB',
            ground: '#C4A86E', groundLine: '#A48A50', grass: '#8DB87C',
            char: { body: '#8B0000', hat: '#1B1B1B', skin: '#E0B888', label: 'Matador', crest: '#FF0000' },
            obstacles: [
                { label: 'Bull', w: 52, h: 40, color: '#2F1B14', accent: '#4A2F20' },
                { label: 'Tomato', w: 28, h: 28, color: '#FF0000', accent: '#CC0000' },
                { label: 'Fan', w: 34, h: 50, color: '#FF6347', accent: '#8B0000' }
            ],
            buildings: [
                { type: 'cathedral', c1: '#DAA520', c2: '#B8860B' },
                { type: 'windmill', c1: '#FFFFFF', c2: '#8B4513' },
                { type: 'house', c1: '#FFF8DC', c2: '#FF6347' }
            ],
            cloud: 'rgba(255,240,220,0.7)', groundTex: '#9A8448'
        },
        france: {
            name: 'France',
            sky1: '#6495ED', sky2: '#F5F0E8',
            ground: '#A0A0A0', groundLine: '#888888', grass: '#7CCD7C',
            char: { body: '#191970', hat: '#1B1B1B', skin: '#F0C8A0', label: 'Artist', crest: '#FF0000' },
            obstacles: [
                { label: 'Baguette', w: 22, h: 60, color: '#DAA520', accent: '#C19A20' },
                { label: 'Eiffel Mini', w: 30, h: 70, color: '#696969', accent: '#555555' },
                { label: 'Snail', w: 36, h: 30, color: '#8B7355', accent: '#6B5335' }
            ],
            buildings: [
                { type: 'eiffel', c1: '#696969', c2: '#555555' },
                { type: 'house', c1: '#F5F0E8', c2: '#6495ED' },
                { type: 'dome', c1: '#E8E0D0', c2: '#A0A0A0' }
            ],
            cloud: 'rgba(255,255,255,0.85)', groundTex: '#787878'
        },
        bali: {
            name: 'Bali',
            sky1: '#1E90FF', sky2: '#90EE90',
            ground: '#6B8E23', groundLine: '#556B2F', grass: '#32CD32',
            char: { body: '#DAA520', hat: '#8B4513', skin: '#C8A060', label: 'Dancer', crest: '#FF1493' },
            obstacles: [
                { label: 'Monkey', w: 34, h: 40, color: '#8B7355', accent: '#6B5335' },
                { label: 'Temple Gate', w: 40, h: 65, color: '#8B4513', accent: '#A0522D' },
                { label: 'Gecko', w: 38, h: 20, color: '#32CD32', accent: '#228B22' }
            ],
            buildings: [
                { type: 'temple', c1: '#8B4513', c2: '#A0522D' },
                { type: 'palm', c1: '#228B22', c2: '#006400' },
                { type: 'temple', c1: '#A0522D', c2: '#6B3410' }
            ],
            cloud: 'rgba(255,255,255,0.6)', groundTex: '#4A6E1A'
        },
        japan: {
            name: 'Japan',
            sky1: '#FFB7C5', sky2: '#E8D5E0',
            ground: '#8B7355', groundLine: '#6B5335', grass: '#7CCD7C',
            char: { body: '#191970', hat: '#8B0000', skin: '#F0D0A0', label: 'Samurai', crest: '#FFD700' },
            obstacles: [
                { label: 'Torii Gate', w: 44, h: 62, color: '#FF0000', accent: '#CC0000' },
                { label: 'Lantern', w: 24, h: 48, color: '#FF4500', accent: '#CC3500' },
                { label: 'Lucky Cat', w: 30, h: 40, color: '#FFFFFF', accent: '#FFD700' }
            ],
            buildings: [
                { type: 'pagoda', c1: '#8B0000', c2: '#FFD700' },
                { type: 'fuji', c1: '#E8E8F0', c2: '#B0B0C0' },
                { type: 'cherry', c1: '#FFB7C5', c2: '#FF69B4' }
            ],
            cloud: 'rgba(255,200,210,0.5)', groundTex: '#5A4430'
        },
        thailand: {
            name: 'Thailand',
            sky1: '#FFD700', sky2: '#87CEEB',
            ground: '#C2B280', groundLine: '#A29260', grass: '#8DB87C',
            char: { body: '#FFD700', hat: '#DAA520', skin: '#D2A870', label: 'Muay Thai', crest: '#FF0000' },
            obstacles: [
                { label: 'Naga', w: 44, h: 52, color: '#228B22', accent: '#006400' },
                { label: 'Stupa', w: 32, h: 60, color: '#FFD700', accent: '#FFA500' },
                { label: 'Tuk Tuk', w: 48, h: 36, color: '#FF69B4', accent: '#FF1493' }
            ],
            buildings: [
                { type: 'temple', c1: '#FFD700', c2: '#DAA520' },
                { type: 'palm', c1: '#228B22', c2: '#006400' },
                { type: 'dome', c1: '#FFD700', c2: '#FFA500' }
            ],
            cloud: 'rgba(255,248,220,0.6)', groundTex: '#9A8A60'
        },
        mexico: {
            name: 'Mexico',
            sky1: '#FF6347', sky2: '#87CEEB',
            ground: '#C19A6B', groundLine: '#A07A4B', grass: '#6B8E23',
            char: { body: '#FFFFFF', hat: '#8B4513', skin: '#D2A870', label: 'Mariachi', crest: '#FF0000' },
            obstacles: [
                { label: 'Cactus', w: 28, h: 60, color: '#228B22', accent: '#006400' },
                { label: 'Piñata', w: 36, h: 36, color: '#FF69B4', accent: '#FFD700' },
                { label: 'Skull', w: 30, h: 34, color: '#FFFFFF', accent: '#1B1B1B' }
            ],
            buildings: [
                { type: 'pyramid', c1: '#C19A6B', c2: '#A07A4B' },
                { type: 'cactus', c1: '#228B22', c2: '#006400' },
                { type: 'house', c1: '#FFF8DC', c2: '#FF6347' }
            ],
            cloud: 'rgba(255,220,200,0.6)', groundTex: '#8A6A42'
        },
        iceland: {
            name: 'Iceland',
            sky1: '#4682B4', sky2: '#B0C4DE',
            ground: '#2F4F4F', groundLine: '#1C3C3C', grass: '#4A7A4A',
            char: { body: '#8B4513', hat: '#808080', skin: '#F0D0B0', label: 'Viking', crest: '#87CEEB' },
            obstacles: [
                { label: 'Geyser', w: 34, h: 58, color: '#87CEEB', accent: '#FFFFFF' },
                { label: 'Ice Block', w: 40, h: 38, color: '#B0E0E6', accent: '#E0F0FF' },
                { label: 'Puffin', w: 28, h: 34, color: '#1B1B1B', accent: '#FF6347' }
            ],
            buildings: [
                { type: 'mountain', c1: '#696969', c2: '#FFFFFF' },
                { type: 'geyser', c1: '#87CEEB', c2: '#FFFFFF' },
                { type: 'mountain', c1: '#808080', c2: '#E0E0E0' }
            ],
            cloud: 'rgba(200,210,220,0.7)', groundTex: '#1A3636'
        }
    };

    // ── State ──
    let canvas, ctx, W, H;
    let theme, gameActive = false, gameRunning = false, gameOver = false;
    let score, highScore, speed, baseSpeed, frameCount;
    let groundY, obstacles, bgBuildings, clouds, particles;

    const player = { x: 0, y: 0, w: 36, h: 48, vy: 0, grounded: true, ducking: false, runFrame: 0 };
    const GRAVITY = 0.65;
    const JUMP = -13.5;
    const DUCK_H = 28;
    const STAND_H = 48;

    // ── Typing trigger ──
    let buf = '', bufTimer;
    function initTrigger() {
        document.addEventListener('keydown', function (e) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
            if (e.ctrlKey || e.metaKey || e.altKey) return;
            const k = e.key.toLowerCase();
            if (k.length === 1 && /[a-z]/.test(k)) {
                buf += k;
                clearTimeout(bufTimer);
                bufTimer = setTimeout(() => buf = '', 2000);
                if (buf.includes('game')) {
                    buf = '';
                    if (!gameActive) launch();
                }
            }
        });
    }

    // ── Launch / Close ──
    function launch() {
        const slug = new URLSearchParams(window.location.search).get('d') || 'italy';
        theme = THEMES[slug] || THEMES.italy;
        highScore = parseInt(localStorage.getItem('dino_hs_' + slug) || '0');

        document.getElementById('gameOverlay').classList.add('active');
        document.body.style.overflow = 'hidden';
        canvas = document.getElementById('gameCanvas');
        ctx = canvas.getContext('2d');
        resize();
        gameActive = true;
        gameRunning = false;
        gameOver = false;
        drawStart();
        window.addEventListener('resize', resize);
        document.addEventListener('keydown', onKey);
        document.addEventListener('keyup', onKeyUp);
        canvas.addEventListener('click', onClick);
        canvas.addEventListener('touchstart', onClick);
    }

    function close() {
        gameActive = false;
        gameRunning = false;
        document.getElementById('gameOverlay').classList.remove('active');
        document.body.style.overflow = '';
        document.removeEventListener('keydown', onKey);
        document.removeEventListener('keyup', onKeyUp);
        canvas.removeEventListener('click', onClick);
        canvas.removeEventListener('touchstart', onClick);
        window.removeEventListener('resize', resize);
        cancelAnimationFrame(raf);
    }

    function resize() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        W = canvas.width;
        H = canvas.height;
        groundY = H - 80;
    }

    // ── Input ──
    const keys = {};
    function onKey(e) {
        if (!gameActive) return;
        if (e.key === 'Escape') { close(); return; }
        keys[e.key] = true;
        if ((e.key === ' ' || e.key === 'ArrowUp') && !gameRunning) { e.preventDefault(); startGame(); return; }
        if ((e.key === ' ' || e.key === 'ArrowUp') && gameOver) { e.preventDefault(); startGame(); return; }
        if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown') e.preventDefault();
    }
    function onKeyUp(e) { keys[e.key] = false; }
    function onClick() {
        if (!gameRunning && !gameOver) { startGame(); return; }
        if (gameOver) { startGame(); return; }
        if (player.grounded) { player.vy = JUMP; player.grounded = false; }
    }

    // ── Start ──
    function startGame() {
        score = 0; speed = 6; baseSpeed = 6; frameCount = 0;
        gameRunning = true; gameOver = false;
        obstacles = []; particles = [];
        bgBuildings = []; clouds = [];
        player.y = groundY - STAND_H; player.h = STAND_H;
        player.vy = 0; player.grounded = true; player.ducking = false; player.runFrame = 0;
        player.x = 80;
        // seed bg
        for (let i = 0; i < 6; i++) {
            bgBuildings.push({ x: i * 260 + Math.random() * 100, templ: theme.buildings[i % theme.buildings.length], h: 60 + Math.random() * 60, w: 50 + Math.random() * 40 });
        }
        for (let i = 0; i < 5; i++) {
            clouds.push({ x: i * 300 + Math.random() * 150, y: 30 + Math.random() * 100, w: 60 + Math.random() * 50 });
        }
        loop();
    }

    // ── Loop ──
    let raf;
    function loop() {
        if (!gameRunning) return;
        update();
        draw();
        raf = requestAnimationFrame(loop);
    }

    // ── Update ──
    function update() {
        frameCount++;
        speed = baseSpeed + score * 0.0008;

        // Jump
        if ((keys['ArrowUp'] || keys[' '] || keys['w']) && player.grounded && !player.ducking) {
            player.vy = JUMP;
            player.grounded = false;
        }

        // Duck
        if ((keys['ArrowDown'] || keys['s']) && player.grounded) {
            if (!player.ducking) { player.ducking = true; player.h = DUCK_H; player.y = groundY - DUCK_H; }
        } else {
            if (player.ducking) { player.ducking = false; player.h = STAND_H; player.y = groundY - STAND_H; }
        }

        // Gravity
        if (!player.grounded) {
            player.vy += GRAVITY;
            player.y += player.vy;
            if (player.y >= groundY - player.h) {
                player.y = groundY - player.h;
                player.vy = 0;
                player.grounded = true;
            }
        }

        player.runFrame += speed * 0.04;

        // Obstacles
        spawnObstacles();
        for (let i = obstacles.length - 1; i >= 0; i--) {
            obstacles[i].x -= speed;
            if (obstacles[i].x + obstacles[i].w < -50) { obstacles.splice(i, 1); continue; }
            if (collides(player, obstacles[i])) { die(); return; }
        }

        // Bg scroll
        bgBuildings.forEach(b => { b.x -= speed * 0.3; if (b.x + b.w < -60) { b.x = W + Math.random() * 200; b.templ = theme.buildings[Math.floor(Math.random() * theme.buildings.length)]; b.h = 60 + Math.random() * 60; b.w = 50 + Math.random() * 40; } });
        clouds.forEach(c => { c.x -= speed * 0.15; if (c.x + c.w < -80) { c.x = W + Math.random() * 200; c.y = 30 + Math.random() * 100; c.w = 60 + Math.random() * 50; } });

        // Particles
        particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.life--; });
        particles = particles.filter(p => p.life > 0);

        score++;
    }

    let lastSpawn = 0;
    function spawnObstacles() {
        const gap = Math.max(90, 260 - score * 0.08);
        if (frameCount - lastSpawn < gap / speed) return;
        const tmpl = theme.obstacles[Math.floor(Math.random() * theme.obstacles.length)];
        const isFlying = Math.random() < 0.2 && score > 300;
        const h = tmpl.h * (0.8 + Math.random() * 0.4);
        const w = tmpl.w * (0.8 + Math.random() * 0.3);
        const y = isFlying ? groundY - h - 20 - Math.random() * 40 : groundY - h;
        obstacles.push({ x: W + 20, y, w, h, color: tmpl.color, accent: tmpl.accent, label: tmpl.label, flying: isFlying });
        lastSpawn = frameCount;
    }

    function collides(a, b) {
        const pad = 6;
        return a.x + pad < b.x + b.w - pad && a.x + a.w - pad > b.x + pad && a.y + pad < b.y + b.h - pad && a.y + a.h - pad > b.y + pad;
    }

    function die() {
        gameRunning = false;
        gameOver = true;
        cancelAnimationFrame(raf);
        if (score > highScore) {
            highScore = score;
            const slug = new URLSearchParams(window.location.search).get('d') || 'italy';
            localStorage.setItem('dino_hs_' + slug, highScore.toString());
        }
        // death particles
        for (let i = 0; i < 12; i++) {
            particles.push({ x: player.x + player.w / 2, y: player.y + player.h / 2, vx: (Math.random() - 0.5) * 6, vy: -2 - Math.random() * 5, life: 40, color: theme.char.body });
        }
        drawFrame();
        drawOverlay();
    }

    // ══════════════ DRAW ══════════════

    function draw() { drawFrame(); }

    function drawFrame() {
        // Sky
        const g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, theme.sky1);
        g.addColorStop(1, theme.sky2);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);

        // Clouds
        ctx.fillStyle = theme.cloud;
        clouds.forEach(c => {
            ctx.beginPath();
            ctx.ellipse(c.x + c.w * 0.3, c.y + 12, c.w * 0.28, 10, 0, 0, Math.PI * 2);
            ctx.ellipse(c.x + c.w * 0.55, c.y + 6, c.w * 0.22, 9, 0, 0, Math.PI * 2);
            ctx.ellipse(c.x + c.w * 0.75, c.y + 11, c.w * 0.18, 8, 0, 0, Math.PI * 2);
            ctx.fill();
        });

        // Bg buildings
        ctx.globalAlpha = 0.3;
        bgBuildings.forEach(b => drawBuilding(b));
        ctx.globalAlpha = 1;

        // Ground
        ctx.fillStyle = theme.grass;
        ctx.fillRect(0, groundY, W, 4);
        ctx.fillStyle = theme.ground;
        ctx.fillRect(0, groundY + 4, W, H - groundY - 4);
        ctx.fillStyle = theme.groundTex;
        for (let gx = (frameCount * -speed * 0.5) % 40; gx < W; gx += 40) {
            ctx.fillRect(gx, groundY + 18, 14, 3);
            ctx.fillRect(gx + 20, groundY + 32, 10, 2);
        }

        // Obstacles
        obstacles.forEach(o => drawObstacle(o));

        // Player
        drawPlayer();

        // Particles
        particles.forEach(p => {
            ctx.globalAlpha = Math.min(1, p.life / 15);
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x - 4, p.y - 4, 8, 8);
        });
        ctx.globalAlpha = 1;

        // HUD
        drawHUD();
    }

    // ── Draw Player ──
    function drawPlayer() {
        const ch = theme.char;
        const px = player.x, py = player.y;

        if (player.ducking) {
            // Ducking pose: body horizontal
            ctx.fillStyle = ch.body;
            rr(px, py + 4, player.w + 8, player.h - 8, 6); ctx.fill();
            // Head
            ctx.fillStyle = ch.skin;
            ctx.beginPath(); ctx.arc(px + player.w + 4, py + player.h / 2, 9, 0, Math.PI * 2); ctx.fill();
            // Eyes
            ctx.fillStyle = '#1a1a1a';
            ctx.beginPath(); ctx.arc(px + player.w + 8, py + player.h / 2 - 2, 2, 0, Math.PI * 2); ctx.fill();
            // Hat
            ctx.fillStyle = ch.hat;
            ctx.fillRect(px + player.w - 2, py + player.h / 2 - 13, 16, 5);
            // Legs
            ctx.fillStyle = '#4169E1';
            ctx.fillRect(px + 4, py + player.h - 6, 8, 6);
            ctx.fillRect(px + 16, py + player.h - 6, 8, 6);
            return;
        }

        // Legs
        ctx.fillStyle = '#4169E1';
        const legOff = player.grounded ? Math.sin(player.runFrame * 1.8) * 4 : 4;
        ctx.fillRect(px + 8, py + player.h - 14 + legOff, 7, 14 - legOff);
        ctx.fillRect(px + player.w - 15, py + player.h - 14 - legOff + 4, 7, 14 - 4 + legOff);

        // Shoes
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(px + 6, py + player.h - 4, 10, 4);
        ctx.fillRect(px + player.w - 16, py + player.h - 4, 10, 4);

        // Body
        ctx.fillStyle = ch.body;
        rr(px + 5, py + 14, player.w - 10, player.h - 26, 4); ctx.fill();

        // Arms
        ctx.fillStyle = ch.skin;
        const armSwing = player.grounded ? Math.sin(player.runFrame * 1.8) * 5 : -6;
        ctx.fillRect(px, py + 18 + armSwing, 5, 14);
        ctx.fillRect(px + player.w - 5, py + 18 - armSwing, 5, 14);

        // Head
        ctx.fillStyle = ch.skin;
        ctx.beginPath(); ctx.arc(px + player.w / 2, py + 11, 10, 0, Math.PI * 2); ctx.fill();

        // Eyes
        ctx.fillStyle = '#1a1a1a';
        ctx.beginPath();
        ctx.arc(px + player.w / 2 + 3, py + 10, 1.8, 0, Math.PI * 2);
        ctx.arc(px + player.w / 2 + 9, py + 10, 1.8, 0, Math.PI * 2);
        ctx.fill();

        // Hat
        drawHat(px, py, ch);
    }

    function drawHat(px, py, ch) {
        ctx.fillStyle = ch.hat;
        switch (ch.label) {
            case 'Samurai':
                ctx.beginPath(); ctx.arc(px + 18, py + 4, 10, Math.PI, 0); ctx.fill();
                ctx.fillRect(px + 15, py - 4, 6, 8);
                break;
            case 'Viking':
                ctx.beginPath(); ctx.arc(px + 18, py + 6, 12, Math.PI, 0); ctx.fill();
                ctx.fillStyle = '#D2B48C';
                ctx.beginPath(); ctx.moveTo(px + 5, py + 4); ctx.lineTo(px - 2, py - 8); ctx.lineTo(px + 11, py + 2); ctx.fill();
                ctx.beginPath(); ctx.moveTo(px + 31, py + 4); ctx.lineTo(px + 38, py - 8); ctx.lineTo(px + 25, py + 2); ctx.fill();
                break;
            case 'Mariachi':
                ctx.beginPath(); ctx.ellipse(px + 18, py + 3, 20, 5, 0, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(px + 18, py + 1, 10, Math.PI, 0); ctx.fill();
                break;
            case 'Artist':
                ctx.beginPath(); ctx.ellipse(px + 20, py + 2, 14, 5, 0.2, 0, Math.PI * 2); ctx.fill();
                break;
            case 'Matador':
                ctx.beginPath(); ctx.ellipse(px + 18, py + 3, 14, 4, 0, 0, Math.PI * 2); ctx.fill();
                ctx.fillRect(px + 10, py - 3, 16, 7);
                break;
            case 'Dancer':
                ctx.fillStyle = '#FFD700';
                ctx.beginPath(); ctx.moveTo(px + 10, py + 4); ctx.lineTo(px + 18, py - 8); ctx.lineTo(px + 26, py + 4); ctx.fill();
                ctx.fillStyle = '#FF1493';
                ctx.beginPath(); ctx.arc(px + 18, py - 1, 3, 0, Math.PI * 2); ctx.fill();
                break;
            case 'Muay Thai':
                ctx.strokeStyle = ch.hat; ctx.lineWidth = 3;
                ctx.beginPath(); ctx.arc(px + 18, py + 6, 11, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
                break;
            case 'Gladiator':
                ctx.beginPath(); ctx.arc(px + 18, py + 6, 11, Math.PI, 0); ctx.fill();
                ctx.fillStyle = ch.crest;
                ctx.fillRect(px + 16, py - 6, 4, 12);
                break;
            case 'Philosopher':
                ctx.strokeStyle = ch.crest; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.arc(px + 18, py + 6, 11, Math.PI * 1.2, Math.PI * 1.8); ctx.stroke();
                ctx.fillStyle = ch.crest;
                for (let l = 0; l < 5; l++) {
                    const a = Math.PI * 1.25 + l * 0.12;
                    ctx.beginPath(); ctx.ellipse(px + 18 + Math.cos(a) * 11, py + 6 + Math.sin(a) * 11, 3, 4, a, 0, Math.PI * 2); ctx.fill();
                }
                break;
            case 'Fado Singer':
                ctx.fillStyle = '#8B0000';
                ctx.beginPath();
                ctx.moveTo(px + 5, py + 14);
                ctx.lineTo(px + 18, py + 18);
                ctx.lineTo(px + 31, py + 14);
                ctx.lineTo(px + 27, py + 24);
                ctx.lineTo(px + 9, py + 24);
                ctx.fill();
                break;
        }
    }

    // ── Draw Obstacle ──
    function drawObstacle(o) {
        ctx.fillStyle = o.color;
        rr(o.x, o.y, o.w, o.h, 4); ctx.fill();
        // Accent details
        ctx.fillStyle = o.accent;
        ctx.fillRect(o.x + 3, o.y + 3, o.w - 6, 4);
        ctx.fillRect(o.x + 3, o.y + o.h - 7, o.w - 6, 4);
        // Label
        if (o.h > 30) {
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.font = '500 9px "Montserrat", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(o.label, o.x + o.w / 2, o.y + o.h / 2 + 3);
            ctx.textAlign = 'left';
        }
        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.beginPath(); ctx.ellipse(o.x + o.w / 2, groundY, o.w * 0.5, 4, 0, 0, Math.PI * 2); ctx.fill();
    }

    // ── Draw Building ──
    function drawBuilding(b) {
        const t = b.templ;
        ctx.fillStyle = t.c1;
        switch (t.type) {
            case 'dome':
                ctx.fillRect(b.x, groundY - b.h * 0.6, b.w, b.h * 0.6);
                ctx.beginPath(); ctx.ellipse(b.x + b.w / 2, groundY - b.h * 0.6, b.w / 2, b.h * 0.45, 0, Math.PI, 0); ctx.fill();
                break;
            case 'tower': case 'cathedral':
                ctx.fillRect(b.x + b.w * 0.2, groundY - b.h, b.w * 0.6, b.h);
                ctx.fillStyle = t.c2;
                ctx.beginPath(); ctx.moveTo(b.x + b.w * 0.3, groundY - b.h); ctx.lineTo(b.x + b.w / 2, groundY - b.h - 20); ctx.lineTo(b.x + b.w * 0.7, groundY - b.h); ctx.fill();
                break;
            case 'house':
                ctx.fillRect(b.x, groundY - b.h * 0.65, b.w, b.h * 0.65);
                ctx.fillStyle = t.c2;
                ctx.beginPath(); ctx.moveTo(b.x - 5, groundY - b.h * 0.65); ctx.lineTo(b.x + b.w / 2, groundY - b.h); ctx.lineTo(b.x + b.w + 5, groundY - b.h * 0.65); ctx.fill();
                break;
            case 'parthenon':
                ctx.fillRect(b.x, groundY - b.h, b.w, b.h);
                ctx.fillStyle = t.c2;
                for (let c = 0; c < 4; c++) ctx.fillRect(b.x + 4 + c * (b.w / 4), groundY - b.h, 4, b.h);
                ctx.beginPath(); ctx.moveTo(b.x - 4, groundY - b.h); ctx.lineTo(b.x + b.w / 2, groundY - b.h - 15); ctx.lineTo(b.x + b.w + 4, groundY - b.h); ctx.fill();
                break;
            case 'windmill':
                ctx.fillRect(b.x + b.w * 0.3, groundY - b.h, b.w * 0.4, b.h);
                break;
            case 'eiffel':
                ctx.beginPath(); ctx.moveTo(b.x + b.w * 0.3, groundY); ctx.lineTo(b.x + b.w * 0.45, groundY - b.h); ctx.lineTo(b.x + b.w * 0.55, groundY - b.h); ctx.lineTo(b.x + b.w * 0.7, groundY); ctx.fill();
                break;
            case 'pagoda':
                for (let i = 0; i < 3; i++) {
                    const tw = b.w - i * 10;
                    ctx.fillRect(b.x + (b.w - tw) / 2, groundY - b.h + i * (b.h / 3), tw, b.h / 3);
                }
                break;
            case 'fuji':
                ctx.beginPath(); ctx.moveTo(b.x, groundY); ctx.lineTo(b.x + b.w / 2, groundY - b.h); ctx.lineTo(b.x + b.w, groundY); ctx.fill();
                ctx.fillStyle = t.c2;
                ctx.beginPath(); ctx.moveTo(b.x + b.w * 0.3, groundY - b.h * 0.7); ctx.lineTo(b.x + b.w / 2, groundY - b.h); ctx.lineTo(b.x + b.w * 0.7, groundY - b.h * 0.7); ctx.fill();
                break;
            case 'cherry':
                ctx.fillStyle = '#8B4513'; ctx.fillRect(b.x + b.w / 2 - 3, groundY - b.h * 0.6, 6, b.h * 0.6);
                ctx.fillStyle = t.c1; ctx.beginPath(); ctx.arc(b.x + b.w / 2, groundY - b.h * 0.65, b.w * 0.35, 0, Math.PI * 2); ctx.fill();
                break;
            case 'temple':
                ctx.fillRect(b.x, groundY - b.h * 0.65, b.w, b.h * 0.65);
                ctx.fillStyle = t.c2;
                ctx.beginPath(); ctx.moveTo(b.x - 4, groundY - b.h * 0.65); ctx.lineTo(b.x + b.w / 2, groundY - b.h); ctx.lineTo(b.x + b.w + 4, groundY - b.h * 0.65); ctx.fill();
                break;
            case 'palm':
                ctx.fillStyle = '#8B6914'; ctx.fillRect(b.x + b.w / 2 - 3, groundY - b.h * 0.7, 6, b.h * 0.7);
                ctx.fillStyle = t.c1;
                for (let a = 0; a < 5; a++) {
                    ctx.beginPath(); ctx.ellipse(b.x + b.w / 2 + Math.cos(-0.8 + a * 0.4) * 18, groundY - b.h * 0.72, 22, 6, -0.8 + a * 0.4, 0, Math.PI * 2); ctx.fill();
                }
                break;
            case 'pyramid':
                ctx.beginPath(); ctx.moveTo(b.x, groundY); ctx.lineTo(b.x + b.w / 2, groundY - b.h); ctx.lineTo(b.x + b.w, groundY); ctx.fill();
                break;
            case 'cactus':
                ctx.fillRect(b.x + b.w / 2 - 4, groundY - b.h, 8, b.h);
                ctx.fillRect(b.x + b.w / 2 - 14, groundY - b.h * 0.65, 10, 6);
                ctx.fillRect(b.x + b.w / 2 + 4, groundY - b.h * 0.45, 12, 6);
                break;
            case 'mountain':
                ctx.beginPath(); ctx.moveTo(b.x - 15, groundY); ctx.lineTo(b.x + b.w / 2, groundY - b.h); ctx.lineTo(b.x + b.w + 15, groundY); ctx.fill();
                ctx.fillStyle = t.c2;
                ctx.beginPath(); ctx.moveTo(b.x + b.w * 0.3, groundY - b.h * 0.75); ctx.lineTo(b.x + b.w / 2, groundY - b.h); ctx.lineTo(b.x + b.w * 0.7, groundY - b.h * 0.75); ctx.fill();
                break;
            case 'geyser':
                ctx.fillStyle = t.c2;
                ctx.beginPath(); ctx.moveTo(b.x + b.w * 0.35, groundY); ctx.quadraticCurveTo(b.x + b.w * 0.3, groundY - b.h, b.x + b.w * 0.5, groundY - b.h - 10);
                ctx.quadraticCurveTo(b.x + b.w * 0.7, groundY - b.h, b.x + b.w * 0.65, groundY); ctx.fill();
                break;
            default:
                ctx.fillRect(b.x, groundY - b.h, b.w, b.h);
        }
    }

    // ── HUD ──
    function drawHUD() {
        ctx.fillStyle = 'rgba(0,0,0,0.45)';
        rr(10, 10, W - 20, 40, 10); ctx.fill();
        ctx.font = '600 15px "Montserrat", sans-serif';
        ctx.fillStyle = '#FFF';
        ctx.textAlign = 'left';
        ctx.fillText(theme.char.label, 24, 36);
        ctx.textAlign = 'center';
        ctx.fillText('SCORE: ' + String(Math.floor(score / 5)).padStart(5, '0'), W / 2, 36);
        ctx.textAlign = 'right';
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        ctx.font = '500 13px "Montserrat", sans-serif';
        ctx.fillText('HI: ' + Math.floor(highScore / 5), W - 24, 36);
        ctx.textAlign = 'left';
    }

    // ── Screens ──
    function drawStart() {
        resize();
        const g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, theme.sky1); g.addColorStop(1, theme.sky2);
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = theme.grass; ctx.fillRect(0, groundY, W, 4);
        ctx.fillStyle = theme.ground; ctx.fillRect(0, groundY + 4, W, H - groundY);

        ctx.fillStyle = 'rgba(0,0,0,0.55)';
        rr(W / 2 - 220, H / 2 - 120, 440, 240, 18); ctx.fill();

        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFD700'; ctx.font = '700 40px "Cormorant Garamond", serif';
        ctx.fillText(theme.name + ' Runner', W / 2, H / 2 - 55);
        ctx.fillStyle = '#FFF'; ctx.font = '400 16px "Montserrat", sans-serif';
        ctx.fillText('Play as the ' + theme.char.label, W / 2, H / 2 - 15);
        ctx.fillStyle = '#FFD700'; ctx.font = '500 17px "Montserrat", sans-serif';
        ctx.fillText('Press SPACE or Click to Start', W / 2, H / 2 + 25);
        ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '400 13px "Montserrat", sans-serif';
        ctx.fillText('SPACE/↑ Jump  •  ↓ Duck  •  ESC Exit', W / 2, H / 2 + 58);
        if (highScore > 0) {
            ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.font = '500 14px "Montserrat", sans-serif';
            ctx.fillText('High Score: ' + Math.floor(highScore / 5), W / 2, H / 2 + 95);
        }
        ctx.textAlign = 'left';
    }

    function drawOverlay() {
        ctx.fillStyle = 'rgba(0,0,0,0.45)';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        rr(W / 2 - 190, H / 2 - 90, 380, 180, 14); ctx.fill();

        ctx.textAlign = 'center';
        ctx.font = '700 32px "Cormorant Garamond", serif';
        ctx.fillStyle = '#FF6666'; ctx.fillText('Game Over', W / 2, H / 2 - 40);
        ctx.font = '600 22px "Montserrat", sans-serif';
        ctx.fillStyle = '#FFD700'; ctx.fillText('Score: ' + Math.floor(score / 5), W / 2, H / 2 + 2);
        if (score >= highScore && score > 0) {
            ctx.fillStyle = '#4CAF50'; ctx.font = '500 14px "Montserrat", sans-serif';
            ctx.fillText('New High Score!', W / 2, H / 2 + 30);
        }
        ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font = '400 14px "Montserrat", sans-serif';
        ctx.fillText('Press SPACE or Click to Retry', W / 2, H / 2 + 65);
        ctx.textAlign = 'left';
    }

    // ── Util ──
    function rr(x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }

    // ── Init ──
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initTrigger);
    else initTrigger();
})();
