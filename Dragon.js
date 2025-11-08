// ============================================
// INTERACTIVE CURSOR DRAGON
// ============================================

// Dragon configuration
const config = {
    trailLength: 10,        // Number of body segments
    followSpeed: 0.15,      // How fast dragon follows cursor (0-1)
    segmentSize: 40,        // Starting size of body segments
    segmentShrink: 4,       // How much each segment shrinks
    minSegmentSize: 10      // Minimum segment size
};

// Get dragon elements
const dragon = document.getElementById('dragon');
const dragonTrail = document.getElementById('dragon-trail');

// Mouse position
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

// Dragon head position
let dragonX = mouseX;
let dragonY = mouseY;

// Trail segments array to store positions
let trailSegments = [];
let trailElements = [];

// ============================================
// INITIALIZE TRAIL SEGMENTS
// ============================================
function initTrail() {
    // Create trail segment elements
    for (let i = 0; i < config.trailLength; i++) {
        const segment = document.createElement('div');
        segment.className = 'trail-segment';
        
        // Calculate size (gets smaller towards the tail)
        const size = Math.max(
            config.segmentSize - (i * config.segmentShrink),
            config.minSegmentSize
        );
        
        segment.style.width = size + 'px';
        segment.style.height = size + 'px';
        
        dragonTrail.appendChild(segment);
        trailElements.push(segment);
        
        // Initialize positions
        trailSegments.push({
            x: mouseX,
            y: mouseY
        });
    }
}

// ============================================
// TRACK MOUSE MOVEMENT
// ============================================
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// ============================================
// UPDATE DRAGON POSITION
// ============================================
function updateDragon() {
    // Smoothly move dragon head towards mouse
    dragonX += (mouseX - dragonX) * config.followSpeed;
    dragonY += (mouseY - dragonY) * config.followSpeed;
    
    // Calculate angle to rotate dragon towards cursor
    const angle = Math.atan2(mouseY - dragonY, mouseX - dragonX);
    const degrees = angle * (180 / Math.PI);
    
    // Update dragon head position and rotation
    dragon.style.left = dragonX - 30 + 'px'; // Offset to center
    dragon.style.top = dragonY - 30 + 'px';
    dragon.style.transform = `rotate(${degrees + 90}deg)`; // +90 to align properly
    
    // Update trail segments
    updateTrail();
    
    // Continue animation
    requestAnimationFrame(updateDragon);
}

// ============================================
// UPDATE TRAIL SEGMENTS
// ============================================
function updateTrail() {
    // First segment follows the head
    trailSegments[0].x += (dragonX - trailSegments[0].x) * 0.3;
    trailSegments[0].y += (dragonY - trailSegments[0].y) * 0.3;
    
    // Each segment follows the previous one
    for (let i = 1; i < trailSegments.length; i++) {
        trailSegments[i].x += (trailSegments[i - 1].x - trailSegments[i].x) * 0.3;
        trailSegments[i].y += (trailSegments[i - 1].y - trailSegments[i].y) * 0.3;
    }
    
    // Update visual position of trail elements
    trailElements.forEach((element, index) => {
        const size = Math.max(
            config.segmentSize - (index * config.segmentShrink),
            config.minSegmentSize
        );
        
        element.style.left = (trailSegments[index].x - size / 2) + 'px';
        element.style.top = (trailSegments[index].y - size / 2) + 'px';
        
        // Add opacity fade effect
        element.style.opacity = 1 - (index / config.trailLength);
    });
}

// ============================================
// FLAME EFFECT ON MOUSE CLICK
// ============================================
document.addEventListener('mousedown', () => {
    const flame = dragon.querySelector('.flame');
    flame.style.animation = 'flame 0.3s ease-in-out 3';
    
    // Create fire particles
    createFireParticles(dragonX, dragonY);
});

// ============================================
// CREATE FIRE PARTICLES
// ============================================
function createFireParticles(x, y) {
    const particleCount = 15;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.width = '8px';
        particle.style.height = '8px';
        particle.style.borderRadius = '50%';
        particle.style.background = i % 2 === 0 ? '#ff9800' : '#ffeb3b';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '999';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        
        document.body.appendChild(particle);
        
        // Random direction
        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = 2 + Math.random() * 3;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        animateParticle(particle, vx, vy);
    }
}

// ============================================
// ANIMATE FIRE PARTICLE
// ============================================
function animateParticle(particle, vx, vy) {
    let life = 30;
    let px = parseFloat(particle.style.left);
    let py = parseFloat(particle.style.top);
    
    function update() {
        life--;
        px += vx;
        py += vy;
        
        particle.style.left = px + 'px';
        particle.style.top = py + 'px';
        particle.style.opacity = life / 30;
        
        if (life > 0) {
            requestAnimationFrame(update);
        } else {
            particle.remove();
        }
    }
    
    update();
}

// ============================================
// INITIALIZE AND START
// ============================================
window.addEventListener('load', () => {
    initTrail();
    updateDragon();
});

// ============================================
// CUSTOMIZATION TIPS
// ============================================
/*
EASY CUSTOMIZATIONS:

1. Change dragon color:
   - Edit the gradient in .dragon-head (CSS)
   - Example: background: linear-gradient(135deg, #6b5bff 0%, #5a4eee 100%);

2. Adjust trail length:
   - Change config.trailLength (line 7)
   - More segments = longer dragon

3. Change follow speed:
   - Adjust config.followSpeed (line 8)
   - Lower = smoother, slower
   - Higher = more responsive

4. Modify segment sizes:
   - Change config.segmentSize (line 9)
   - Change config.segmentShrink (line 10)

5. Add sound effects:
   - Add audio elements in HTML
   - Play sounds in click handler

6. Change background:
   - Modify body gradient in CSS
   - Or add a background image

Try experimenting with these values!
*/