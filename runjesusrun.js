// Run Jesus Run game
document.addEventListener('DOMContentLoaded', function() {
    const jesus = document.getElementById('jesus');
    const chasers = document.querySelectorAll('.jewish-person');
    
    if (!jesus) return;
    
    let jesusX = window.innerWidth / 2;
    let jesusY = window.innerHeight / 2;
    const moveSpeed = 3;
    const chaserSpeed = 1;
    let gameOver = false;
    
    // Initialize chasers at random positions with wander direction
    const chaserPositions = [];
    chasers.forEach((chaser, index) => {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        chaserPositions.push({ 
            x, 
            y,
            wanderAngle: Math.random() * Math.PI * 2, // Random starting angle
            wanderSpeed: 0.05 // How quickly they change direction
        });
        chaser.style.left = x + 'px';
        chaser.style.top = y + 'px';
    });
    
    const keys = {
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false
    };
    
    jesus.style.left = jesusX + 'px';
    jesus.style.top = jesusY + 'px';
    
    document.addEventListener('keydown', function(e) {
        if(keys.hasOwnProperty(e.key)) {
            e.preventDefault();
            keys[e.key] = true;
        }
    });
    
    document.addEventListener('keyup', function(e) {
        if(keys.hasOwnProperty(e.key)) {
            keys[e.key] = false;
        }
    });
    
    // Check collision between Jesus and a chaser
    function checkCollision(chaserPos) {
        const distance = Math.sqrt(
            Math.pow(jesusX - chaserPos.x, 2) + 
            Math.pow(jesusY - chaserPos.y, 2)
        );
        return distance < 40;
    }
    
    // Create falling crosses
    function createCrossRain() {
        gameOver = true;
        
        const crosses = [];
        for(let i = 0; i < 200; i++) {
            const cross = document.createElement('img');
            cross.src = 'cross.png';
            cross.className = 'falling-cross';
            cross.style.position = 'fixed';
            cross.style.width = '100px';
            cross.style.height = 'auto';
            cross.style.left = (Math.random() * (window.innerWidth + 200)) - 100 + 'px';
            cross.style.top = '-200px';
            cross.style.zIndex = '1000';
            cross.style.imageRendering = 'pixelated';
            document.body.appendChild(cross);
            
            crosses.push({
                element: cross,
                x: parseFloat(cross.style.left),
                y: -200,
                speed: 2 + Math.random() * 4
            });
        }
        
        function animateCrosses() {
            let allFallen = true;
            
            crosses.forEach(cross => {
                cross.y += cross.speed;
                cross.element.style.top = cross.y + 'px';
                
                if(cross.y < window.innerHeight) {
                    allFallen = false;
                }
            });
            
            if(!allFallen) {
                requestAnimationFrame(animateCrosses);
            } else {
                setTimeout(() => {
                    crosses.forEach(cross => cross.element.remove());
                    resetGame();
                }, 500);
            }
        }
        
        animateCrosses();
    }
    
    // Reset the game
    function resetGame() {
        gameOver = false;
        jesusX = window.innerWidth / 2;
        jesusY = window.innerHeight / 2;
        jesus.style.left = jesusX + 'px';
        jesus.style.top = jesusY + 'px';
        
        chasers.forEach((chaser, index) => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            chaserPositions[index] = { 
                x, 
                y,
                wanderAngle: Math.random() * Math.PI * 2,
                wanderSpeed: 0.05
            };
            chaser.style.left = x + 'px';
            chaser.style.top = y + 'px';
        });
        
        updatePosition();
    }
    
    // Game loop
    function updatePosition() {
        if(gameOver) return;
        
        // Move Jesus based on key presses
        if(keys.ArrowUp) {
            jesusY -= moveSpeed;
        }
        if(keys.ArrowDown) {
            jesusY += moveSpeed;
        }
        if(keys.ArrowLeft) {
            jesusX -= moveSpeed;
        }
        if(keys.ArrowRight) {
            jesusX += moveSpeed;
        }
        
        // Keep Jesus within viewport bounds
        jesusX = Math.max(0, Math.min(jesusX, window.innerWidth - 50));
        jesusY = Math.max(0, Math.min(jesusY, window.innerHeight - 80));
        
        // Update Jesus position
        jesus.style.left = jesusX + 'px';
        jesus.style.top = jesusY + 'px';
        
        // Move chasers toward Jesus with smooth wandering
        chasers.forEach((chaser, index) => {
            const pos = chaserPositions[index];
            
            // Calculate direction to Jesus
            const dx = jesusX - pos.x;
            const dy = jesusY - pos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Move toward Jesus if not already touching
            if(distance > 5) {
                // Gradually change wander angle for smooth movement
                pos.wanderAngle += (Math.random() - 0.5) * pos.wanderSpeed;
                
                // Calculate wander offset using smooth angle
                const wanderStrength = 0.5; // Reduced from 3
                const wanderX = Math.cos(pos.wanderAngle) * wanderStrength;
                const wanderY = Math.sin(pos.wanderAngle) * wanderStrength;
                
                // Combine chasing direction with smooth wandering
                pos.x += (dx / distance) * chaserSpeed + wanderX;
                pos.y += (dy / distance) * chaserSpeed + wanderY;
                
                // Keep chasers within viewport bounds
                pos.x = Math.max(0, Math.min(pos.x, window.innerWidth - 50));
                pos.y = Math.max(0, Math.min(pos.y, window.innerHeight - 80));
                
                // Update chaser position
                chaser.style.left = pos.x + 'px';
                chaser.style.top = pos.y + 'px';
            }
            
            // Check for collision
            if(checkCollision(pos)) {
                createCrossRain();
                return;
            }
        });
        
        requestAnimationFrame(updatePosition);
    }
    
    // Start the game loop
    updatePosition();
});