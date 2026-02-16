document.addEventListener('DOMContentLoaded', function() {
    const dresserLeft = document.getElementById('dresserLeft');
    const dresserRight = document.getElementById('dresserRight');
    const clothingArea = document.getElementById('clothingArea');
    const jesusBody = document.querySelector('.jesus-body');
    
    let currentStyle = 'gorp-core';
    let highestZIndex = 10;
    let draggedItem = null;
    let offsetX = 0;
    let offsetY = 0;
    let sourceContainer = null; // Track where item came from
    
    // Clothing type sizes (in pixels)
    const clothingSizes = {
        'short_jacket': 120,
        'long_jacket': 160,
        'shirt': 100,
        'pants': 140,
        'vest': 110,
        'boots': 80,
        'shoes': 70
    };
    
    // Clothing catalog
    const clothingCatalog = {
        'gorp-core': [
            { file: 'jacket6.png', type: 'short_jacket' },
            { file: 'jacket 7.png', type: 'long_jacket' },
            { file: 'blue jacket.png', type: 'long_jacket' },
            { file: 'blue jacket 2.png', type: 'long_jacket' },
            { file: 'blue and green jacket.png', type: 'long_jacket' },
            { file: 'pale jacket.png', type: 'long_jacket' },
            { file: 'puffer vest.png', type: 'vest' },
            { file: 'hunting vest.png', type: 'vest' },
            { file: 'pale pants.png', type: 'pants' },
            { file: 'pale pants 2.png', type: 'pants' },
            { file: 'tactical pants.png', type: 'pants' },
            { file: 'salomon1.png', type: 'shoes' },
            { file: 'salomon2.png', type: 'shoes' },
            { file: 'salomon3.png', type: 'shoes' }
        ],
        'e-girl': [
            { file: 'e-girl shirt 1.png', type: 'shirt' },
            { file: 'e-girl shirt 2.png', type: 'shirt' },
            { file: 'e-girl shirt 3.png', type: 'shirt' },
            { file: 'e-girl shirt 4.png', type: 'shirt' },
            { file: 'e-girl sweatshirt 1.png', type: 'long_jacket' },
            { file: 'e-girl pants 2.png', type: 'pants' },
            { file: 'e-girl pants 3.png', type: 'pants' },
            { file: 'e-girl pants 4.png', type: 'pants' },
            { file: 'e-girl pants 5.png', type: 'pants' },
            { file: 'e-girl boots 1.png', type: 'boots' },
            { file: 'e-girl shoes 1.png', type: 'shoes' },
            { file: 'e-girl shoes 2.png', type: 'shoes' }
        ],
        'polish': [
            { file: 'polish shirt 1.png', type: 'shirt' },
            { file: 'polish shirt 2.png', type: 'shirt' },
            { file: 'polish dress 1.png', type: 'long_jacket' },
            { file: 'polish dress 2.png', type: 'long_jacket' },
            { file: 'polish dress 3.png', type: 'long_jacket' },
            { file: 'polish dress 4.png', type: 'long_jacket' },
            { file: 'polish dress 5.png', type: 'long_jacket' }
        ]
    };
    
    // Style switching
    const styleButtons = document.querySelectorAll('.style-btn');
    styleButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            styleButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentStyle = this.dataset.style;
            clearClothing();
            loadClothing(currentStyle);
        });
    });
    
    function clearClothing() {
        dresserLeft.innerHTML = '';
        dresserRight.innerHTML = '';
        clothingArea.innerHTML = '';
    }
    
    function loadClothing(style) {
        const items = clothingCatalog[style] || [];
        
        items.forEach((item, index) => {
            const thumbnail = document.createElement('img');
            thumbnail.src = `dress-up-assets/${item.file}`;
            thumbnail.className = 'clothing-thumbnail';
            thumbnail.dataset.file = item.file;
            thumbnail.dataset.type = item.type;
            thumbnail.dataset.scale = '1';
            thumbnail.dataset.inDresser = 'true';
            
            const targetHeight = clothingSizes[item.type];
            thumbnail.style.height = targetHeight + 'px';
            thumbnail.style.width = 'auto';
            
            // Alternate between left and right dresser
            if (index % 2 === 0) {
                dresserLeft.appendChild(thumbnail);
            } else {
                dresserRight.appendChild(thumbnail);
            }
            
            // Add drag listeners
            thumbnail.addEventListener('mousedown', handleItemClick);
            thumbnail.addEventListener('touchstart', startDragItem);
        });
    }
    
    function handleItemClick(e) {
        // Check for modifier keys
        if (e.shiftKey) {
            // Shift-click enlarges
            e.preventDefault();
            enlargeItem(e.target);
        } else if (e.ctrlKey || e.metaKey) {
            // Ctrl-click (or Cmd-click on Mac) shrinks
            e.preventDefault();
            shrinkItem(e.target);
        } else {
            // Normal click starts drag
            startDragItem(e);
        }
    }
    
    function startDragItem(e) {
        e.preventDefault();
        e.stopPropagation();
        
        draggedItem = e.target;
        const inDresser = draggedItem.dataset.inDresser === 'true';
        
        // Track source container
        sourceContainer = draggedItem.parentElement;
        
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        
        // CAPTURE POSITION BEFORE ANY DOM CHANGES
        const itemRect = draggedItem.getBoundingClientRect();
        const areaRect = clothingArea.getBoundingClientRect();
        
        // If in dresser, convert to clothing-item and move to clothing area
        if (inDresser) {
            draggedItem.dataset.inDresser = 'false';
            draggedItem.classList.remove('clothing-thumbnail');
            draggedItem.classList.add('clothing-item');
            
            // Calculate position in clothing area coordinates BEFORE moving
            const x = itemRect.left - areaRect.left;
            const y = itemRect.top - areaRect.top;
            
            // Set position properties BEFORE appending to new parent
            draggedItem.style.position = 'absolute';
            draggedItem.style.left = x + 'px';
            draggedItem.style.top = y + 'px';
            draggedItem.style.transform = 'none';
            
            // NOW move to clothing area - it should appear in the same spot
            clothingArea.appendChild(draggedItem);
        }
        
        // Bring to front
        draggedItem.style.zIndex = ++highestZIndex;
        
        // Calculate offset based on where mouse clicked relative to item
        offsetX = clientX - itemRect.left;
        offsetY = clientY - itemRect.top;
        
        draggedItem.classList.add('dragging');
        
        document.addEventListener('mousemove', dragItem);
        document.addEventListener('mouseup', stopDragItem);
        document.addEventListener('touchmove', dragItem);
        document.addEventListener('touchend', stopDragItem);
    }
    
    function dragItem(e) {
        if (!draggedItem) return;
        e.preventDefault();
        
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        
        const areaRect = clothingArea.getBoundingClientRect();
        const x = clientX - areaRect.left - offsetX;
        const y = clientY - areaRect.top - offsetY;
        
        draggedItem.style.left = x + 'px';
        draggedItem.style.top = y + 'px';
    }
    
    function stopDragItem() {
        if (draggedItem) {
            draggedItem.classList.remove('dragging');
            draggedItem = null;
        }
        
        sourceContainer = null;
        
        document.removeEventListener('mousemove', dragItem);
        document.removeEventListener('mouseup', stopDragItem);
        document.removeEventListener('touchmove', dragItem);
        document.removeEventListener('touchend', stopDragItem);
    }
    
    function enlargeItem(item) {
        let scale = parseFloat(item.dataset.scale) || 1;
        scale += 0.1;
        item.dataset.scale = scale;
        
        const baseHeight = clothingSizes[item.dataset.type];
        item.style.height = (baseHeight * scale) + 'px';
    }
    
    function shrinkItem(item) {
        let scale = parseFloat(item.dataset.scale) || 1;
        scale = Math.max(0.5, scale - 0.1);
        item.dataset.scale = scale;
        
        const baseHeight = clothingSizes[item.dataset.type];
        item.style.height = (baseHeight * scale) + 'px';
    }
    
    // Load initial clothing
    loadClothing(currentStyle);
});