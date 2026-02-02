// Dress up Jesus functionality
document.addEventListener('DOMContentLoaded', function() {
    const jesusBody = document.getElementById('jesus-body');
    const clothingRackLeft = document.getElementById('clothingRackLeft');
    const clothingRackRight = document.getElementById('clothingRackRight');
    const clothingLayers = document.getElementById('clothing-layers');
    
    if (!jesusBody) return;
    
    let draggedElement = null;
    let offsetX = 0;
    let offsetY = 0;
    let highestZIndex = 1000;
    let currentStyle = 'gorp-core';
    
    // Define target heights for each clothing type (in pixels)
    const clothingSizes = {
        short_jacket: 150,
        long_jacket: 200,
        shirt: 150,
        pants: 200,
        hat: 50,
        shoes: 100
    };
    
    // Style switching functionality
    const styleButtons = document.querySelectorAll('.style-btn');
    styleButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            styleButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            // Update current style
            currentStyle = this.dataset.style;
            // Clear all clothing
            clearAllClothing();
            // Load new clothing for this style
            loadClothingForStyle(currentStyle);
        });
    });
    
    function clearAllClothing() {
        clothingRackLeft.innerHTML = '';
        clothingRackRight.innerHTML = '';
    }
    
    function loadClothingForStyle(style) {
        let items = [];
        
        if (style === 'gorp-core') {
            items = [
                { file: 'jacket1.png', type: 'short_jacket' },
                { file: 'jacket4.png', type: 'long_jacket' },
                { file: 'jacket3.png', type: 'short_jacket' },
                { file: 'shirt1.png', type: 'shirt' },
                { file: 'pants1.png', type: 'pants' },
                { file: 'pants2.png', type: 'pants' },
                { file: 'salomon1.png', type: 'shoes' },
                { file: 'salomon2.png', type: 'shoes' },
                { file: 'salomon3.png', type: 'shoes' }
            ];
        } else if (style === 'e-girl') {
            items = [
                // Add your e-girl clothing items here
                // { file: 'egirl-item1.png', type: 'shirt' },
            ];
        } else if (style === 'polish') {
            items = [
                // Add your 17th century polish clothing items here
                // { file: 'polish-item1.png', type: 'jacket' },
            ];
        }
        
        // Load the items
        items.forEach((item, index) => {
            const thumbnail = document.createElement('img');
            thumbnail.src = `dress-up-assets/${item.file}`;
            thumbnail.className = 'clothing-item';
            thumbnail.alt = item.file;
            thumbnail.dataset.clothing = item.file;
            thumbnail.dataset.type = item.type;
            thumbnail.draggable = false;
            
            const targetHeight = clothingSizes[item.type];
            
            if (targetHeight) {
                thumbnail.style.height = targetHeight + 'px';
                thumbnail.style.width = 'auto';
                thumbnail.style.display = 'block';
            }
            
            thumbnail.onload = function() {
                if (targetHeight) {
                    this.style.height = targetHeight + 'px';
                    this.style.width = 'auto';
                    console.log(`Loaded ${item.file}: natural size ${this.naturalWidth}x${this.naturalHeight}, scaled to height ${targetHeight}px, actual display height: ${this.offsetHeight}px`);
                }
            };
            
            if (index % 2 === 0) {
                clothingRackLeft.appendChild(thumbnail);
            } else {
                clothingRackRight.appendChild(thumbnail);
            }
            
            thumbnail.addEventListener('mousedown', startDrag);
        });
    }
    
    // Load initial clothing (gorp-core by default)
    loadClothingForStyle(currentStyle);
    
    function startDrag(e) {
        draggedElement = e.target;
        
        // Calculate offset from mouse to element's top-left
        const rect = draggedElement.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        
        // Store current size before making it fixed position
        const currentHeight = draggedElement.offsetHeight;
        const currentWidth = draggedElement.offsetWidth;
        
        // Increment z-index to bring to front
        highestZIndex++;
        
        // Make it draggable
        draggedElement.classList.add('dragging');
        draggedElement.style.position = 'fixed';
        draggedElement.style.height = currentHeight + 'px';
        draggedElement.style.width = currentWidth + 'px';
        draggedElement.style.left = (e.clientX - offsetX) + 'px';
        draggedElement.style.top = (e.clientY - offsetY) + 'px';
        draggedElement.style.zIndex = highestZIndex;
        
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
    }
    
    function drag(e) {
        if (!draggedElement) return;
        
        draggedElement.style.left = (e.clientX - offsetX) + 'px';
        draggedElement.style.top = (e.clientY - offsetY) + 'px';
    }
    
    function stopDrag(e) {
        if (!draggedElement) return;
        
        draggedElement.classList.remove('dragging');
        draggedElement.style.opacity = '1';
        
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stopDrag);
        
        draggedElement = null;
    }
});