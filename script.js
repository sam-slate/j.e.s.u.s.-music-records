// Kitschy early web JavaScript
// Welcome alert (classic 90s style)
window.addEventListener('load', function() {
    console.log('J.E.S.U.S. Music Records site loaded!');
});
if (window.innerWidth <= 768) {
    window.addEventListener('load', function() {
        alert('We here at J.E.S.U.S. Music Records believe in mobile-last development. You might want to use a desktop computer, ideally an iMac G4.');
    });
}
// Add some retro interactivity
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for navigation links
    const links = document.querySelectorAll('nav a');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href').substring(1);
            const element = document.getElementById(target);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    // Pop-up ads functionality
    const images = ['image1.png', 'image2.jpeg', 'image3.png', 'image4.jpeg', 'image5.jpg'];
    let popupCount = 0;
    const maxPopups = images.length;
    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        element.onmousedown = dragMouseDown;
        function dragMouseDown(e) {
            // Don't drag if clicking the close button
            if (e.target.classList.contains('close-btn')) {
                return;
            }
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
            element.style.cursor = 'grabbing';
        }
        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }
        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
            element.style.cursor = 'grab';
        }
    }
    function createPopup() {
        if (popupCount >= maxPopups) {
            return;
        }
        const popup = document.createElement('div');
        popup.className = 'popup-ad';
        // Random position
        const maxX = window.innerWidth - 350;
        const maxY = window.innerHeight - 300;
        const randomX = Math.max(50, Math.random() * maxX);
        const randomY = Math.max(100, Math.random() * maxY);
        popup.style.left = randomX + 'px';
        popup.style.top = randomY + 'px';
        // Get random image
        const randomImage = images[Math.floor(Math.random() * images.length)];
        popup.innerHTML = `
            <button class="close-btn">×</button>
            <img src="${randomImage}" alt="Pop-up ad">
        `;
        document.body.appendChild(popup);
        // Close button functionality
        popup.querySelector('.close-btn').addEventListener('click', function() {
            popup.remove();
        });
        // Make draggable
        makeDraggable(popup);
        // Animate in
        setTimeout(() => {
            popup.classList.add('show');
        }, 10);
        popupCount++;
    }
    // Show first popup after 10 seconds, then every 10 seconds
    let popupInterval;
    setTimeout(function() {
        createPopup();
        popupInterval = setInterval(function() {
            if (popupCount >= maxPopups) {
                clearInterval(popupInterval);
            } else {
                createPopup();
            }
        }, 10000);
    }, 10000);
});