/**
 * Work Detail Modal
 * Handles opening/closing modal with project details
 * Integrates with wheel.js to display selected project info
 */

// ============================================
// MODAL MANAGEMENT
// ============================================

const WorkModal = {
    modal: null,
    overlay: null,

    init() {
        this.modal = document.getElementById('workModal');
        this.overlay = document.querySelector('.work-modal-overlay');
        this.setupEventListeners();
    },

    setupEventListeners() {
        // Close button
        document.getElementById('workModalClose').addEventListener('click', () => this.close());

        // Click overlay to close
        this.overlay.addEventListener('click', () => this.close());

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('is-open')) {
                this.close();
            }
        });
    },

    /**
     * Open modal with project data
     * @param {Object} projectData - Project information
     * Example: {
     *   category: 'VFX',
     *   title: 'Assignment 2',
     *   videoUrl: 'https://www.youtube.com/embed/VIDEO_ID',
     *   description: 'Project description...'
     * }
     */
    open(projectData) {
        // Validate data
        if (!projectData) {
            console.error('No project data provided');
            return;
        }

        // Update modal content
        this.updateContent(projectData);

        // Show modal with animation
        this.modal.classList.add('is-open');

        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
    },

    /**
     * Close modal
     */
    close() {
        this.modal.classList.remove('is-open');

        // Restore body scroll
        document.body.style.overflow = '';

        // Small delay for animation
        setTimeout(() => {
            // Reset iframe src to stop video playback and PDF preview
            const videoEl = document.getElementById('workModalVideo');
            const pdfEl = document.getElementById('workModalPdf');
            if (videoEl) videoEl.src = '';
            if (pdfEl) pdfEl.src = '';
        }, 200);
    },

    /**
     * Update modal content with project data
     * @param {Object} data - Project data
     */
    updateContent(data) {
        // Category
        const categoryEl = document.getElementById('workModalCategory');
        if (categoryEl) {
            categoryEl.textContent = data.category || 'PROJECT';
        }
        
        // Title (split by line if contains " - " or use as is)
        const titleEl = document.getElementById('workModalTitle');
        if (titleEl) {
            titleEl.textContent = data.title || 'Untitled';
        }

        // Video Title (for video card info)
        const videoTitleEl = document.getElementById('workModalVideoTitle');
        if (videoTitleEl) {
            videoTitleEl.textContent = data.title || 'Untitled';
        }

        // Description
        const descEl = document.getElementById('workModalDescription');
        if (descEl) {
            descEl.textContent = data.description || 'No description available.';
        }

        // Video URL (YouTube embed) or PDF preview
        const videoEl = document.getElementById('workModalVideo');
        const pdfEl = document.getElementById('workModalPdf');
        
        if (data.pdfUrl) {
            // Show PDF preview
            if (videoEl) videoEl.style.display = 'none';
            if (pdfEl) {
                pdfEl.style.display = 'block';
                pdfEl.src = data.pdfUrl + '#toolbar=0';
            }
        } else if (data.videoUrl) {
            // Show video
            if (pdfEl) pdfEl.style.display = 'none';
            if (videoEl) {
                videoEl.style.display = 'block';
                videoEl.src = data.videoUrl;
            }
        } else {
            // Hide both if no content
            if (videoEl) videoEl.style.display = 'none';
            if (pdfEl) pdfEl.style.display = 'none';
        }

        // Link (optional)
    }
};

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    WorkModal.init();
    console.log('✓ Work Modal initialized');
});

// ============================================
// INTEGRATION WITH WHEEL
// ============================================
// Override the showModal function from wheel.js to use this new WorkModal
// This will be called when a wheel slice is clicked

/**
 * Hook into wheel.js click handler
 * Call this from wheel.js instead of the old showModal()
 */
function openWorkDetailModal(item) {
    const projectData = {
        category: item.category || item.title.split(' ')[0],
        title: item.title || 'Untitled Project',
        description: item.description || 'No description available.',
        videoUrl: item.videoUrl || null,
        pdfUrl: item.pdfUrl || null,
        projectLink: item.projectLink || '#'
    };

    WorkModal.open(projectData);
}
