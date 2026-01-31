// Dress up Jesus functionality
document.addEventListener('DOMContentLoaded', function() {
    const jesusBody = document.getElementById('jesus-body');
    const clothingRackLeft = document.getElementById('clothingRackLeft');
    const clothingRackRight = document.getElementById('clothingRackRight');
    const clothingLayers = document.getElementById('clothing-layers');
    
    if (!jesusBody) return;
    
    // Define target heights for each clothing type (in pixels)
    const clothingSizes = {
        short_jacket: 150,
        long_jacket: 200,
        shirt: 150,
        pants: 200,
        hat: 50,
        shoes: 40
    };
    
    // List all your clothing items here
    const clothingItems = [
        { file: 'jacket1.png', type: 'short_jacket' },
        { file: 'jacket4.png', type: 'long_jacket' },
        { file: 'jacket3.png', type: 'short_jacket' },
        { file: 'shirt1.png', type: 'shirt' },
        { file: 'pants1.png', type: 'pants' },
        { file: 'pants2.png', type: 'pants' }
    ];
    
    let draggedElement = null;
    let offsetX = 0;
    let offsetY = 0;
    
    // Load clothing thumbnails - split between left and right
    clothingItems.forEach((item, index) => {
        const thumbnail = document.createElement('img');
        thumbnail.src = `dress-up-assets/${item.file}`;
        thumbnail.className = 'clothing-item';
        thumbnail.alt = item.file;
        thumbnail.dataset.clothing = item.file;
        thumbnail.dataset.type = item.type;
        thumbnail.draggable = false;
        
        // Get target size
        const targetHeight = clothingSizes[item.type];
        
        // Set size immediately (before image loads)
        if (targetHeight) {
            thumbnail.style.height = targetHeight + 'px';
            thumbnail.style.width = 'auto';
            thumbnail.style.display = 'block';
        }
        
        // Scale image when it loads to confirm size
        thumbnail.onload = function() {
            if (targetHeight) {
                this.style.height = targetHeight + 'px';
                this.style.width = 'auto';
                console.log(`Loaded ${item.file}: natural size ${this.naturalWidth}x${this.naturalHeight}, scaled to height ${targetHeight}px, actual display height: ${this.offsetHeight}px`);
            }
        };
        
        // Add to left or right rack alternating
        if (index % 2 === 0) {
            clothingRackLeft.appendChild(thumbnail);
        } else {
            clothingRackRight.appendChild(thumbnail);
        }
        
        // Add drag functionality
        thumbnail.addEventListener('mousedown', startDrag);
    });
    
    function startDrag(e) {
        draggedElement = e.target;
        
        // Calculate offset from mouse to element's top-left
        const rect = draggedElement.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        
        // Store current size before making it fixed position
        const currentHeight = draggedElement.offsetHeight;
        const currentWidth = draggedElement.offsetWidth;
        
        // Make it draggable
        draggedElement.classList.add('dragging');
        draggedElement.style.position = 'fixed';
        draggedElement.style.height = currentHeight + 'px';  // Preserve height
        draggedElement.style.width = currentWidth + 'px';    // Preserve width
        draggedElement.style.left = (e.clientX - offsetX) + 'px';
        draggedElement.style.top = (e.clientY - offsetY) + 'px';
        
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