/**
 * UI Controls for AlphaEarth Visualization
 * Handles all user interface interactions
 */

const UIControls = {
    elements: {},

    /**
     * Initialize all UI elements and event listeners
     */
    init() {
        this.cacheElements();
        this.populateBandSelectors();
        this.bindEvents();
        this.updateDisplayValues();
    },

    /**
     * Cache DOM element references
     */
    cacheElements() {
        this.elements = {
            // Sliders and values
            yearSlider: document.getElementById('year-slider'),
            yearValue: document.getElementById('year-value'),
            minSlider: document.getElementById('min-slider'),
            maxSlider: document.getElementById('max-slider'),
            minmaxValue: document.getElementById('minmax-value'),
            terrainSlider: document.getElementById('terrain-slider'),
            terrainValue: document.getElementById('terrain-value'),

            // Band selectors
            bandRed: document.getElementById('band-red'),
            bandGreen: document.getElementById('band-green'),
            bandBlue: document.getElementById('band-blue'),

            // Toggles
            labelsToggle: document.getElementById('labels-toggle'),
            toggleAll: document.getElementById('toggle-all'),
            layerBackground: document.getElementById('layer-background'),
            layerImagery: document.getElementById('layer-imagery'),
            layerEmbeddings: document.getElementById('layer-embeddings'),

            // Opacity sliders
            opacityBackground: document.getElementById('opacity-background'),
            opacityImagery: document.getElementById('opacity-imagery'),
            opacityEmbeddings: document.getElementById('opacity-embeddings'),

            // Layer name
            layerName: document.getElementById('layer-name'),
            embeddingsLayerName: document.getElementById('embeddings-layer-name'),

            // Buttons
            btnApply: document.getElementById('btn-apply'),
            btnReset: document.getElementById('btn-reset'),
            btnClose: document.getElementById('btn-close'),
            btnAuthenticate: document.getElementById('btn-authenticate'),

            // Panel toggles
            layersToggle: document.getElementById('layers-toggle'),
            alphaEarthToggle: document.getElementById('alphaearth-toggle'),
            layersContent: document.getElementById('layers-content'),
            alphaEarthContent: document.getElementById('alphaearth-content'),

            // Modal and loading
            authModal: document.getElementById('auth-modal'),
            loading: document.getElementById('loading'),
            controlPanel: document.getElementById('control-panel')
        };
    },

    /**
     * Populate band selector dropdowns with A00-A63
     */
    populateBandSelectors() {
        const bands = EarthEngineManager.getAllBandNames();

        // Default selections
        const defaults = { red: 'A00', green: 'A15', blue: 'A08' };

        [this.elements.bandRed, this.elements.bandGreen, this.elements.bandBlue].forEach((select, index) => {
            select.innerHTML = '';
            bands.forEach(band => {
                const option = document.createElement('option');
                option.value = band;
                option.textContent = band;
                select.appendChild(option);
            });

            // Set default value
            const key = ['red', 'green', 'blue'][index];
            select.value = defaults[key];
        });
    },

    /**
     * Bind event listeners to UI elements
     */
    bindEvents() {
        // Year slider
        this.elements.yearSlider.addEventListener('input', () => {
            this.elements.yearValue.textContent = this.elements.yearSlider.value;
            this.updateLayerName();
        });

        // Min/Max sliders
        this.elements.minSlider.addEventListener('input', () => this.updateMinMaxDisplay());
        this.elements.maxSlider.addEventListener('input', () => this.updateMinMaxDisplay());

        // Terrain slider
        this.elements.terrainSlider.addEventListener('input', () => {
            const value = parseFloat(this.elements.terrainSlider.value).toFixed(2);
            this.elements.terrainValue.textContent = value;
            if (window.App && window.App.updateTerrain) {
                window.App.updateTerrain(parseFloat(value));
            }
        });

        // Layer name input
        this.elements.layerName.addEventListener('input', () => {
            this.elements.embeddingsLayerName.textContent = this.elements.layerName.value;
        });

        // Action buttons
        this.elements.btnApply.addEventListener('click', () => this.onApply());
        this.elements.btnReset.addEventListener('click', () => this.onReset());
        this.elements.btnClose.addEventListener('click', () => this.onClose());
        this.elements.btnAuthenticate.addEventListener('click', () => this.onAuthenticate());

        // Panel toggles
        this.elements.layersToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.togglePanel('layers');
        });
        this.elements.alphaEarthToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.togglePanel('alphaearth');
        });

        // Layer visibility toggles
        this.elements.toggleAll.addEventListener('change', (e) => this.toggleAllLayers(e.target.checked));
        this.elements.layerBackground.addEventListener('change', (e) => {
            if (window.App) window.App.toggleLayer('background', e.target.checked);
        });
        this.elements.layerImagery.addEventListener('change', (e) => {
            if (window.App) window.App.toggleLayer('imagery', e.target.checked);
        });
        this.elements.layerEmbeddings.addEventListener('change', (e) => {
            if (window.App) window.App.toggleLayer('embeddings', e.target.checked);
        });

        // Opacity sliders
        this.elements.opacityBackground.addEventListener('input', (e) => {
            if (window.App) window.App.setLayerOpacity('background', e.target.value / 100);
        });
        this.elements.opacityImagery.addEventListener('input', (e) => {
            if (window.App) window.App.setLayerOpacity('imagery', e.target.value / 100);
        });
        this.elements.opacityEmbeddings.addEventListener('input', (e) => {
            if (window.App) window.App.setLayerOpacity('embeddings', e.target.value / 100);
        });

        // Labels toggle
        this.elements.labelsToggle.addEventListener('change', (e) => {
            if (window.App) window.App.toggleLabels(e.target.checked);
        });
    },

    /**
     * Toggle panel visibility
     */
    togglePanel(panel) {
        if (panel === 'layers') {
            this.elements.layersContent.classList.toggle('collapsed');
            this.elements.layersToggle.classList.toggle('collapsed');
        } else if (panel === 'alphaearth') {
            this.elements.alphaEarthContent.classList.toggle('collapsed');
            this.elements.alphaEarthToggle.classList.toggle('collapsed');
        }
    },

    /**
     * Update layer name based on year
     */
    updateLayerName() {
        const year = this.elements.yearSlider.value;
        const name = `Embeddings ${year}`;
        this.elements.layerName.value = name;
        this.elements.embeddingsLayerName.textContent = name;
    },

    /**
     * Update min/max display
     */
    updateMinMaxDisplay() {
        const min = parseFloat(this.elements.minSlider.value).toFixed(2);
        const max = parseFloat(this.elements.maxSlider.value).toFixed(2);
        this.elements.minmaxValue.textContent = `${min} to ${max}`;
    },

    /**
     * Update all display values
     */
    updateDisplayValues() {
        this.elements.yearValue.textContent = this.elements.yearSlider.value;
        this.updateMinMaxDisplay();
        this.elements.terrainValue.textContent = parseFloat(this.elements.terrainSlider.value).toFixed(2);
        this.updateLayerName();
    },

    /**
     * Get current visualization parameters
     * @returns {Object} Current parameters
     */
    getParams() {
        return {
            year: parseInt(this.elements.yearSlider.value),
            bands: [
                this.elements.bandRed.value,
                this.elements.bandGreen.value,
                this.elements.bandBlue.value
            ],
            min: parseFloat(this.elements.minSlider.value),
            max: parseFloat(this.elements.maxSlider.value),
            terrainExaggeration: parseFloat(this.elements.terrainSlider.value),
            showLabels: this.elements.labelsToggle.checked,
            layerName: this.elements.layerName.value
        };
    },

    /**
     * Apply button handler
     */
    async onApply() {
        const params = this.getParams();
        this.showLoading(true);

        try {
            if (window.App) {
                await window.App.loadEmbeddings(params);
            }
        } catch (error) {
            console.error('Error applying settings:', error);
            alert('Error loading embeddings: ' + error.message);
        } finally {
            this.showLoading(false);
        }
    },

    /**
     * Reset button handler
     */
    onReset() {
        this.elements.yearSlider.value = 2020;
        this.elements.bandRed.value = 'A00';
        this.elements.bandGreen.value = 'A15';
        this.elements.bandBlue.value = 'A08';
        this.elements.minSlider.value = -0.3;
        this.elements.maxSlider.value = 0.3;
        this.elements.terrainSlider.value = 2;
        this.elements.labelsToggle.checked = true;
        this.updateDisplayValues();

        // Reset opacity sliders
        this.elements.opacityBackground.value = 100;
        this.elements.opacityImagery.value = 100;
        this.elements.opacityEmbeddings.value = 100;

        // Reset layer checkboxes
        this.elements.toggleAll.checked = true;
        this.elements.layerBackground.checked = true;
        this.elements.layerImagery.checked = true;
        this.elements.layerEmbeddings.checked = true;
    },

    /**
     * Close button handler
     */
    onClose() {
        this.elements.controlPanel.style.display = 'none';
    },

    /**
     * Show control panel
     */
    showControlPanel() {
        this.elements.controlPanel.style.display = 'block';
    },

    /**
     * Authentication button handler
     */
    async onAuthenticate() {
        this.showLoading(true);
        this.hideAuthModal();

        try {
            await EarthEngineManager.initialize();
            if (window.App) {
                await window.App.onAuthenticated();
            }
        } catch (error) {
            console.error('Authentication failed:', error);
            this.showLoading(false);
            this.showAuthModal();
            alert('Authentication failed: ' + error.message);
        }
    },

    /**
     * Toggle all layers
     */
    toggleAllLayers(visible) {
        this.elements.layerBackground.checked = visible;
        this.elements.layerImagery.checked = visible;
        this.elements.layerEmbeddings.checked = visible;

        if (window.App) {
            window.App.toggleLayer('background', visible);
            window.App.toggleLayer('imagery', visible);
            window.App.toggleLayer('embeddings', visible);
        }
    },

    /**
     * Show/hide loading indicator
     */
    showLoading(show) {
        if (show) {
            this.elements.loading.classList.remove('hidden');
        } else {
            this.elements.loading.classList.add('hidden');
        }
    },

    /**
     * Show authentication modal
     */
    showAuthModal() {
        this.elements.authModal.classList.remove('hidden');
    },

    /**
     * Hide authentication modal
     */
    hideAuthModal() {
        this.elements.authModal.classList.add('hidden');
    }
};

// Export
window.UIControls = UIControls;
