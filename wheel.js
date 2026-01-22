/**
 * Work Wheel / Donut Component
 * - 7 slices total: 3 large (visible in top half) + 4 small (hidden in bottom half)
 * - SVG-based donut with image patterns
 * - Scroll to rotate and cycle through items
 * - Responsive and smooth animations
 */

// ============================================
// DATA & CONFIGURATION
// ============================================

const wheelConfig = {
    outerRadius: 280,      // Outer radius of donut (SVG units)
    innerRadius: 90,       // Inner radius (hole)
    separatorStroke: 6,    // White separator line between slices
    colors: {
        separator: '#ffffff',
        hole: '#f5f5f5',
        background: '#f5f5f5'
    }
};

// Work items - updated with correct asset paths
const wheelItems = [
    {
        id: 1,
        title: 'Digital Video A1',
        category: 'VFX',
        imgUrl: 'assets a2/work/thumbnail/a1 vid.svg',
        videoUrl: 'https://www.youtube.com/embed/M8E5E3hvDLc?si=xJmJHjkp7ZAYDWKk',
        description: 'My first VFX animation which created primarily in Blender and edited in DaVinci Resolve. I have got explored a lot of effects and try to match it with the chosen music. Overall, it\'s a very passionate project that shaped my visual vision.',
        offsetX: -120,
        offsetY: -150,
        scale: 1,
        projectLink: '#'
    },
    {
        id: 2,
        title: 'Digital Video A3',
        category: 'VFX',
        imgUrl: 'assets a2/work/thumbnail/a3 vid.svg',
        videoUrl: 'https://www.youtube.com/embed/aeRcqvsRZ7I?si=19l2RMNuDJQwmrwp',
        description: 'A combination of both filming and post-editing. I have got to play with color-lighting and cool VFXs like Zoe-trope effects using both Blender and Davinci Resolve program. I am very much enjoyed this assignment ! ',
        offsetX: -120,
        offsetY: -130,
        scale: 0.55,
        projectLink: '#'
    },
    {
        id: 3,
        title: 'EEAAO',
        category: 'VFX',
        imgUrl: 'assets a2/work/thumbnail/title sequence.svg',
        videoUrl: 'https://www.youtube.com/embed/OAKEJ7WeQzY?si=WUlIS4c1GURule2',
        description: 'My first animation project from foundation course. I have got to learn about storyboarding, planing on visual and music to match the theme of the film',
        offsetX: -80,
        offsetY: -120,
        scale: 0.55,
        projectLink: '#'
    },
    {
        id: 4,
        title: 'Now what ?',
        category: 'VFX',
        imgUrl: 'assets a2/work/thumbnail/now what.svg',
        videoUrl: 'https://www.youtube.com/embed/Oi5JssnkP_0?si=IScY3krIA-d8nqXr',
        description: 'My first collaborative film from foundation course, experimenting with a slasher-style horror. Color lighting and sound effects are key highlights here. While it could have gone further, it remains one of my most favorite projects.',
        offsetX: 0,
        offsetY: 0,
        scale: 1,
        projectLink: '#'
    },
    {
        id: 5,
        title: 'The Recurring Dream',
        category: 'VFX',
        imgUrl: 'assets a2/work/thumbnail/the recurring dream.svg',
        videoUrl: 'https://www.youtube.com/embed/d4hR5Dd5Tzg?si=jUNzeUR-N40ypo0p',
        description: 'My first self-directed short film from foundation course, where I explored themes, wrote the plot, experimented with professional shooting on a Samsung Galaxy S22 Ultra (with gimbal), and learned Adobe Premiere. Everything for the first time, very much appreciate it!',
        offsetX: 0,
        offsetY: 0,
        scale: 1,
        projectLink: '#'
    },
    {
        id: 6,
        title: 'Storyboarding',
        category: 'VFX',
        imgUrl: 'assets a2/work/thumbnail/mouse thumbnail.svg',
        pdfUrl: 'assets a2/work/mouse.pdf',
        description: 'My first storyboarding project from Foundation course. I have got to try explore and calculates the sequences, as well as illustrates it out detaily from what I have in my head.',
        offsetX: 0,
        offsetY: 0,
        scale: 1,
        projectLink: '#'
    },
    {
        id: 7,
        title: 'Tam Phuong Ky Boi',
        category: 'VFX',
        imgUrl: 'assets a2/work/thumbnail/web vid.svg',
        videoUrl: 'https://www.youtube.com/embed/S9oFVOTKwOM?si=DzCaLsKFfjRe7v3d',
        description: 'A collaborative, passion-driven responsive website( Desktop and Mobile versions) created in Figma and Illustrator, capturing and traslating the culture of Hát Bội, its philosophy, choreography, colors, and symbols,... into a digital experience with care and respect.',
        offsetX: 0,
        offsetY: 0,
        scale: 1,
        projectLink: '#'
    },
    {
        id: 8,
        title: 'How to save a choking person',
        category: 'VFX',
        imgUrl: 'assets a2/work/thumbnail/infographic vid.svg',
        videoUrl: 'https://www.youtube.com/embed/ErVdh3LijBM?si=FD_Kw4ctP6YidjwO',
        description: 'An interactive infographic project I have done with my team using Figma and Adobe Illustrators for assets. We have got to dive in and analyse deeply about the art style- to then transfering them all into our project.',
        offsetX: 0,
        offsetY: 0,
        scale: 1,
        projectLink: '#',
    }
];

// ============================================
// SLICE ANGLES CONFIGURATION
// ============================================
// Total: 8 slices covering 360°
// Each slice: 360° / 8 = 45° (equal size)
// 4 visible slices (0, 1, 2, 3) at top half
// 4 hidden slices (4, 5, 6, 7) at bottom half

const sliceAngles = [
    { startAngle: 0, endAngle: 45, size: 'equal' },        // Slice 0
    { startAngle: 45, endAngle: 90, size: 'equal' },       // Slice 1
    { startAngle: 90, endAngle: 135, size: 'equal' },      // Slice 2
    { startAngle: 135, endAngle: 180, size: 'equal' },     // Slice 3
    { startAngle: 180, endAngle: 225, size: 'equal' },     // Slice 4
    { startAngle: 225, endAngle: 270, size: 'equal' },     // Slice 5
    { startAngle: 270, endAngle: 315, size: 'equal' },     // Slice 6
    { startAngle: 315, endAngle: 360, size: 'equal' }      // Slice 7
];

// ============================================
// STATE MANAGEMENT
// ============================================

let wheelState = {
    activeIndices: [0, 1, 2, 3],  // Indices of visible slices (top half - 4 slices)
    hiddenIndices: [4, 5, 6, 7],  // Indices of hidden slices (bottom half - 4 slices)
    centerIndex: 1,               // Index of item currently in center position (start with slice id 1)
    isAnimating: false,
    scrollTimeout: null,
    rotationAngle: -123  // Start with -123° rotation to position slice 1 at top (-78 - 45 = -123)
};

// ============================================
// UTILITY: CONVERT DEGREES TO RADIANS
// ============================================

function degreesToRadians(degrees) {
    return (degrees * Math.PI) / 180;
}

// ============================================
// SVG ARC PATH GENERATION
// ============================================

/**
 * Creates SVG path for a donut slice (wedge)
 * @param {number} startAngle - Start angle in degrees
 * @param {number} endAngle - End angle in degrees
 * @param {number} outerRadius - Outer radius
 * @param {number} innerRadius - Inner radius
 * @returns {string} SVG path data
 */
function createSlicePath(startAngle, endAngle, outerRadius, innerRadius) {
    const startRad = degreesToRadians(startAngle);
    const endRad = degreesToRadians(endAngle);
    
    // Outer arc points
    const x1 = outerRadius * Math.cos(startRad);
    const y1 = outerRadius * Math.sin(startRad);
    const x2 = outerRadius * Math.cos(endRad);
    const y2 = outerRadius * Math.sin(endRad);
    
    // Inner arc points
    const x3 = innerRadius * Math.cos(endRad);
    const y3 = innerRadius * Math.sin(endRad);
    const x4 = innerRadius * Math.cos(startRad);
    const y4 = innerRadius * Math.sin(startRad);
    
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    
    // SVG path: M = move, L = line, A = arc, Z = close
    const pathData = [
        `M ${x1} ${y1}`,
        `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2}`,
        `L ${x3} ${y3}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`,
        'Z'
    ].join(' ');
    
    return pathData;
}

// ============================================
// RENDER WHEEL
// ============================================

function renderWheel() {
    const svg = document.getElementById('wheelSvg');
    const patternsContainer = document.getElementById('patterns-container');
    const slicesContainer = document.getElementById('slices-container');
    
    if (!svg || !patternsContainer || !slicesContainer) {
        console.error('Wheel SVG elements not found');
        return;
    }
    
    // Clear existing patterns and slices
    patternsContainer.innerHTML = '';
    slicesContainer.innerHTML = '';
    
    // Ensure inner circle exists (check by position and radius, not fill attribute)
    let innerCircle = Array.from(svg.querySelectorAll('circle')).find(circle => {
        return circle.getAttribute('cx') === '200' && 
               circle.getAttribute('cy') === '200' && 
               circle.getAttribute('r') === wheelConfig.innerRadius.toString() &&
               circle.getAttribute('class') !== 'wheel-frame-circle';
    });
    
    if (!innerCircle) {
        innerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        innerCircle.setAttribute('cx', '200');
        innerCircle.setAttribute('cy', '200');
        innerCircle.setAttribute('r', wheelConfig.innerRadius.toString());
        innerCircle.setAttribute('fill', '#f5f5f5');
        // Insert before slices container
        const slicesContainerParent = slicesContainer.parentNode;
        slicesContainerParent.insertBefore(innerCircle, slicesContainer);
    }
    
    // Create patterns and paths for all 8 slices
    sliceAngles.forEach((slice, index) => {
        // Slice index directly maps to array index (items are in order with sequential ids)
        const item = wheelItems[index];
        const patternId = `pattern-slice-${index}`;
        
        // Create solid fill pattern with background image
        const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
        pattern.setAttribute('id', patternId);
        pattern.setAttribute('patternUnits', 'objectBoundingBox');
        pattern.setAttribute('width', '1');
        pattern.setAttribute('height', '1');
        pattern.setAttribute('preserveAspectRatio', 'xMidYMid slice');
        
        const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
        image.setAttribute('href', item.imgUrl);
        
        // Apply custom positioning & scale
        const baseSize = 500; // Increased from 400 to scale up images
        let scaledSize = baseSize * (item.scale || 1);
        let offsetX = item.offsetX || 0;
        let offsetY = item.offsetY || 0;
        
        // For slice 1: zoom thêm lớn hơn và move xuống dưới
        if (index === 1) {
            scaledSize = scaledSize * 1.5; // Zoom thêm 50% (từ 10% lên 50%)
            offsetY = offsetY + 30; // Move xuống dưới 30px
        }
        
        // For slice 2: scale up hình lớn hơn nhiều
        if (index === 2) {
            scaledSize = scaledSize * 2.5; // Zoom thêm 150% (lớn hơn nhiều)
        }
        
        // For slice 3: move hình ra tâm, lên trên 23% và qua trái 30%
        if (index === 3) {
            offsetX = -baseSize * 0.3; // Move qua trái 30% của baseSize (âm vì trái là âm)
            offsetY = -baseSize * 0.23; // Move lên trên 23% của baseSize (âm vì Y tăng xuống dưới)
        }
        
        // For slice 4: move hình lên trên 20%, qua trái 20% và rotate 100 độ
        if (index === 4) {
            offsetX = offsetX - baseSize * 0.2; // Move qua trái 20% của baseSize (âm vì trái là âm)
            offsetY = offsetY - baseSize * 0.2; // Move lên trên 20% của baseSize (âm vì Y tăng xuống dưới)
        }
        
        // For slice 5: scale up hình lớn hơn
        if (index === 5) {
            scaledSize = scaledSize * 2.0; // Zoom thêm 100% cho slice 5
        }
        
        // For slice 6, 7: scale up hình
        if (index === 6 || index === 7) {
            scaledSize = scaledSize * 1.5; // Zoom thêm 50%
        }
        
        // For slice 5: move hình lên trên 5%
        if (index === 5) {
            offsetY = offsetY - baseSize * 0.05; // Move lên trên 5% của baseSize (âm vì Y tăng xuống dưới)
        }
        
        // For slice 6: move hình lên trên 10%
        if (index === 6) {
            offsetY = offsetY - baseSize * 0.1; // Move lên trên 10% của baseSize (âm vì Y tăng xuống dưới)
        }
        
        image.setAttribute('width', scaledSize);
        image.setAttribute('height', scaledSize);
        image.setAttribute('x', (baseSize - scaledSize) / 2 + offsetX);
        image.setAttribute('y', (baseSize - scaledSize) / 2 + offsetY);
        image.setAttribute('preserveAspectRatio', 'xMidYMid slice');
        
        // Flip slice 1 (index 1) vertically, rotate -5 độ, và zoom thêm 10%
        if (index === 1) {
            // Flip vertically: translate to center, scale Y by -1, translate back
            const centerX = (baseSize - scaledSize) / 2 + offsetX + scaledSize / 2;
            const centerY = (baseSize - scaledSize) / 2 + offsetY + scaledSize / 2;
            // Combine flip, rotation 95 độ, và zoom
            image.setAttribute('transform', `translate(${centerX}, ${centerY}) scale(1, -1) rotate(95) translate(${-centerX}, ${-centerY})`);
        }
        
        // Flip slice 3 (index 3) horizontally và rotate 100 độ
        if (index === 3) {
            const centerX = (baseSize - scaledSize) / 2 + offsetX + scaledSize / 2;
            const centerY = (baseSize - scaledSize) / 2 + offsetY + scaledSize / 2;
            // Flip horizontally và rotate 100 độ
            image.setAttribute('transform', `translate(${centerX}, ${centerY}) scale(-1, 1) rotate(100) translate(${-centerX}, ${-centerY})`);
        }
        
        // Rotate slice 4 (index 4) 100 độ và flip
        if (index === 4) {
            const centerX = (baseSize - scaledSize) / 2 + offsetX + scaledSize / 2;
            const centerY = (baseSize - scaledSize) / 2 + offsetY + scaledSize / 2;
            // Rotate 100 độ và flip horizontally
            image.setAttribute('transform', `translate(${centerX}, ${centerY}) scale(-1, 1) rotate(100) translate(${-centerX}, ${-centerY})`);
        }
        
        pattern.appendChild(image);
        patternsContainer.appendChild(pattern);
        
        // Create slice path
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', createSlicePath(
            slice.startAngle,
            slice.endAngle,
            wheelConfig.outerRadius,
            wheelConfig.innerRadius
        ));
        path.setAttribute('fill', `url(#${patternId})`);
        path.setAttribute('stroke', wheelConfig.colors.separator);
        path.setAttribute('stroke-width', wheelConfig.separatorStroke);
        path.setAttribute('stroke-linejoin', 'round');
        path.setAttribute('class', `wheel-slice wheel-slice-${index}`);
        path.setAttribute('data-index', index);
        path.setAttribute('data-item-id', item.id);
        
        // Add hover and click events
        path.addEventListener('click', () => handleSliceClick(index, item));
        path.addEventListener('mouseenter', () => updateWheelTitle(item.title));
        
        slicesContainer.appendChild(path);
    });
    
    // Rotate SVG so slice 0 is at top (-90° rotation)
    slicesContainer.setAttribute('transform', `translate(200, 200) rotate(${wheelState.rotationAngle})`);
    
    // Add outer circle frame (render after slices so it appears on top)
    // Remove existing frame if it exists
    const existingFrame = svg.querySelector('.wheel-frame-circle');
    if (existingFrame) {
        existingFrame.remove();
    }
    
    // Create new frame circle
    // Account for stroke width in viewBox - outer radius 280 + stroke 8/2 = 4, so we need padding
    const frameCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    frameCircle.setAttribute('class', 'wheel-frame-circle');
    frameCircle.setAttribute('cx', '200');
    frameCircle.setAttribute('cy', '200');
    frameCircle.setAttribute('r', wheelConfig.outerRadius.toString());
    frameCircle.setAttribute('fill', 'none');
    frameCircle.setAttribute('stroke', '#0B019E');
    frameCircle.setAttribute('stroke-width', '8');
    svg.appendChild(frameCircle);
    
    // Calculate center index based on initial rotation angle
    // Starting at -123° to position slice 1 at center
    const normalizedAngle = ((wheelState.rotationAngle % 360) + 360) % 360;
    const centerSliceIndex = Math.round(normalizedAngle / 45) % 8;
    // Force slice 1 to be center on initial load
    wheelState.centerIndex = 1;
    
    // Update display with Digital Video A1 (index 0) as initial title, even though slice 1 is at center
    const initialItem = wheelItems[0]; // Digital Video A1
    updateWheelTitle(initialItem.title);
    updateWheelCenter(initialItem);
    
    // Initialize skill categories
    updateSkillCategories();
}

// ============================================
// EVENT HANDLERS
// ============================================

function handleSliceClick(index, item) {
    console.log(`Clicked slice ${index}:`, item);
    
    // Use new WorkModal from work-modal.js if available
    if (typeof openWorkDetailModal === 'function') {
        openWorkDetailModal(item);
    } else {
        // Fallback to old modal for backward compatibility
        showModal(item);
    }
    
    updateWheelTitle(item.title);
    updateWheelCenter(item);
}

// ============================================
// MODAL MANAGEMENT
// ============================================

function showModal(item) {
    // Check if modal already exists
    let modal = document.getElementById('itemModal');
    
    if (!modal) {
        // Create modal if it doesn't exist
        modal = document.createElement('div');
        modal.id = 'itemModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <div class="modal-inner">
                    <div id="modalMedia" class="modal-media"></div>
                    <div class="modal-text">
                        <h2 id="modalTitle" class="modal-title"></h2>
                        <p id="modalDescription" class="modal-description"></p>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Add close button event listener
        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        modal.querySelector('.modal-overlay').addEventListener('click', closeModal);
    }
    
    // Update modal content
    const mediaContainer = document.getElementById('modalMedia');
    mediaContainer.innerHTML = '';
    
    // Check if item has video URL
    if (item.videoUrl) {
        const iframe = document.createElement('iframe');
        iframe.className = 'modal-video';
        iframe.src = item.videoUrl;
        iframe.title = item.title;
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        mediaContainer.appendChild(iframe);
    } else {
        // Fallback to image if no video URL
        const img = document.createElement('img');
        img.className = 'modal-image';
        img.src = item.imgUrl;
        img.alt = item.title;
        mediaContainer.appendChild(img);
    }
    
    document.getElementById('modalTitle').textContent = item.title;
    document.getElementById('modalDescription').textContent = item.description;
    
    // Show modal with animation
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('itemModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function updateWheelTitle(title) {
    const titleEl = document.getElementById('wheelTitle');
    if (titleEl) {
        titleEl.textContent = title;
    }
}

function updateWheelCenter(item) {
    // Update title in the center circle
    const titleEl = document.getElementById('wheelTitle');
    if (titleEl && item) {
        titleEl.textContent = item.title;
    } else if (titleEl) {
        titleEl.textContent = 'Select a project';
    }
}

/**
 * Update skill categories carousel based on center slice
 * Slice 0-2: UX/UI active
 * Slice 3-5: VFX active
 * Slice 6-7: Filming active
 */
function updateSkillCategories() {
    const categories = document.querySelectorAll('.skill-category');
    if (categories.length !== 3) return;
    
    const uxui = categories[0];
    const vfx = categories[1];
    const filming = categories[2];
    
    // Remove all active/inactive classes
    [uxui, vfx, filming].forEach(cat => {
        cat.classList.remove('active', 'inactive');
    });
    
    // Remove center class from skill-categories container
    const categoriesContainer = document.querySelector('.skill-categories');
    if (categoriesContainer) {
        categoriesContainer.classList.remove('filming-center');
    }
    
    // Determine which category should be active based on centerIndex
    // Slice 0-2: VFX active (sáng lên)
    // Slice 3-5: Filming active (sáng lên)
    // Slice 6-7: UX/UI active (sáng lên)
    let activeCategory;
    
    if (wheelState.centerIndex >= 0 && wheelState.centerIndex <= 2) {
        // VFX active (slice 0-2)
        activeCategory = vfx;
    } else if (wheelState.centerIndex >= 3 && wheelState.centerIndex <= 5) {
        // Filming active (slice 3-5)
        activeCategory = filming;
    } else {
        // UX/UI active (slice 6-7)
        activeCategory = uxui;
    }
    
    // Apply classes - active sáng lên, inactive mờ đi
    activeCategory.classList.add('active');
    [uxui, vfx, filming].forEach(cat => {
        if (cat !== activeCategory) {
            cat.classList.add('inactive');
        }
    });
}

/**
 * Rotate wheel to next position
 * Circular shift: first item moves to end
 */
function rotateWheelNext() {
    if (wheelState.isAnimating) return;
    
    wheelState.isAnimating = true;
    
    // Circular shift: take first active item and move to hidden
    const firstActive = wheelState.activeIndices.shift();
    const firstHidden = wheelState.hiddenIndices.shift();
    
    wheelState.activeIndices.push(firstHidden);
    wheelState.hiddenIndices.push(firstActive);
    
    // Update rotation angle (360 / 8 = 45° per slice)
    wheelState.rotationAngle += 45;
    applyWheelRotation();
    
    // Calculate center index based on rotation angle (reversed order)
    // Starting at -78°, slice 0 is at center. Each 45° rotation moves to next slice
    // Reverse the calculation to read names in opposite order, and offset by 1 to fix timing
    const adjustedAngle = wheelState.rotationAngle + 78; // Offset to account for initial rotation
    const normalizedAngle = ((adjustedAngle % 360) + 360) % 360;
    const centerSliceIndex = (8 - Math.round(normalizedAngle / 45) - 1) % 8; // Reverse the order and offset by 1
    wheelState.centerIndex = centerSliceIndex;
    
    // Animate slice transitions
    animateSliceTransition();
    
    // Update center display
    const centerItem = wheelItems[wheelState.centerIndex];
    updateWheelTitle(centerItem.title);
    updateWheelCenter(centerItem);
    
    // Update skill categories carousel
    updateSkillCategories();
    
    setTimeout(() => {
        wheelState.isAnimating = false;
    }, 400);
}

/**
 * Rotate wheel to previous position
 * Reverse circular shift: last item moves to beginning
 */
function rotateWheelPrev() {
    if (wheelState.isAnimating) return;
    
    wheelState.isAnimating = true;
    
    // Circular shift reverse: take last hidden item and move to active
    const lastActive = wheelState.activeIndices.pop();
    const lastHidden = wheelState.hiddenIndices.pop();
    
    wheelState.activeIndices.unshift(lastHidden);
    wheelState.hiddenIndices.unshift(lastActive);
    
    // Update rotation angle (360 / 8 = 45° per slice)
    wheelState.rotationAngle -= 45;
    applyWheelRotation();
    
    // Calculate center index based on rotation angle (reversed order)
    // Starting at -78°, slice 0 is at center. Each 45° rotation moves to next slice
    // Reverse the calculation to read names in opposite order, and offset by 1 to fix timing
    const adjustedAngle = wheelState.rotationAngle + 78; // Offset to account for initial rotation
    const normalizedAngle = ((adjustedAngle % 360) + 360) % 360;
    const centerSliceIndex = (8 - Math.round(normalizedAngle / 45) - 1) % 8; // Reverse the order and offset by 1
    wheelState.centerIndex = centerSliceIndex;
    
    // Animate slice transitions
    animateSliceTransition();
    
    // Update center display
    const centerItem = wheelItems[wheelState.centerIndex];
    updateWheelTitle(centerItem.title);
    updateWheelCenter(centerItem);
    
    // Update skill categories carousel
    updateSkillCategories();
    
    setTimeout(() => {
        wheelState.isAnimating = false;
    }, 400);
}

/**
 * Apply rotation to SVG container with smooth animation
 */
function applyWheelRotation() {
    const slicesContainer = document.getElementById('slices-container');
    if (slicesContainer) {
        slicesContainer.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        slicesContainer.setAttribute('transform', `translate(200, 200) rotate(${wheelState.rotationAngle})`);
    }
}

/**
 * Trigger animation on slice elements
 */
function animateSliceTransition() {
    const slices = document.querySelectorAll('.wheel-slice');
    slices.forEach(slice => {
        slice.classList.remove('is-transitioning');
        // Force reflow to restart animation
        void slice.offsetWidth;
        slice.classList.add('is-transitioning');
    });
}

// ============================================
// SCROLL / WHEEL EVENT LISTENER
// ============================================

function setupWheelScrollListener() {
    const wheelViewport = document.querySelector('.wheel-viewport');
    if (!wheelViewport) return;
    
    wheelViewport.addEventListener('wheel', (e) => {
        // Only prevent default if cursor is over wheel
        e.preventDefault();
        
        // Throttle scroll events
        if (wheelState.scrollTimeout) return;
        
        wheelState.scrollTimeout = setTimeout(() => {
            wheelState.scrollTimeout = null;
        }, 250);
        
        // Determine direction and rotate
        if (e.deltaY > 0) {
            rotateWheelNext();  // Scroll down = next
        } else {
            rotateWheelPrev();  // Scroll up = prev
        }
    }, { passive: false });
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing wheel...');
    console.log('Wheel items:', wheelItems);
    console.log('Wheel config:', wheelConfig);
    
    try {
        renderWheel();
        setupWheelScrollListener();
        
        console.log('✓ Wheel initialized successfully');
        console.log('Active indices:', wheelState.activeIndices);
        console.log('Hidden indices:', wheelState.hiddenIndices);
    } catch (error) {
        console.error('Error initializing wheel:', error);
    }
});
