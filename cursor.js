// Custom Cursor with Color Change Based on Background
document.addEventListener('DOMContentLoaded', function() {
    const cursor = document.getElementById('customCursor');
    if (!cursor) return;
    
    // Show cursor
    cursor.style.display = 'block';

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    // Update mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth cursor movement
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Function to get background color of element
    function getBackgroundColor(element) {
        if (!element) return null;
        
        let bgColor = window.getComputedStyle(element).backgroundColor;
        
        // If transparent or rgba(0,0,0,0), check parent
        if (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') {
            if (element.parentElement && element.parentElement !== document.body) {
                return getBackgroundColor(element.parentElement);
            }
            return null;
        }
        
        return bgColor;
    }

    // Function to convert rgb/rgba to hex
    function rgbToHex(rgb) {
        if (!rgb || rgb === 'transparent') return null;
        
        // Handle rgb and rgba
        const match = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (match) {
            const r = parseInt(match[1]);
            const g = parseInt(match[2]);
            const b = parseInt(match[3]);
            const hex = '#' + [r, g, b].map(x => {
                const hex = x.toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            }).join('');
            return hex.toUpperCase();
        }
        
        return null;
    }

    // Function to check if color matches target (with tolerance for slight variations)
    function colorMatches(color, target) {
        if (!color || !target) return false;
        return color.toLowerCase() === target.toLowerCase();
    }

    // Check color and update cursor
    function updateCursorColor() {
        const elementBelow = document.elementFromPoint(mouseX, mouseY);
        if (!elementBelow) return;

        const bgColor = getBackgroundColor(elementBelow);
        const hexColor = rgbToHex(bgColor);

        if (hexColor) {
            // Check if background is #f5f5f5 (light gray) - rgb(245, 245, 245)
            if (colorMatches(hexColor, '#f5f5f5')) {
                cursor.style.backgroundColor = '#0B019E';
                cursor.style.mixBlendMode = 'normal';
            }
            // Check if background is #0B019E (dark blue) - rgb(11, 1, 158)
            else if (colorMatches(hexColor, '#0b019e')) {
                cursor.style.backgroundColor = '#f5f5f5';
                cursor.style.mixBlendMode = 'normal';
            }
            // Default cursor color
            else {
                cursor.style.backgroundColor = '#f5f5f5';
                cursor.style.mixBlendMode = 'difference';
            }
        } else {
            // Default if can't detect color
            cursor.style.backgroundColor = '#f5f5f5';
            cursor.style.mixBlendMode = 'difference';
        }
    }

    // Update cursor color on mouse move
    document.addEventListener('mousemove', updateCursorColor);
});

