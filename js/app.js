/**
 * Main Application - AlphaEarth Visualization
 * Integrates MapLibre GL JS with Earth Engine data
 *
 * The AlphaEarth Foundations Satellite Embedding dataset is produced by
 * Google and Google DeepMind.
 */

const App = {
    map: null,
    draw: null,
    currentMode: 'embeddings', // Track current visualization mode: 'embeddings', 'change', 'clustering'
    changeYears: { year1: 2017, year2: 2024 }, // Store change detection years
    embeddingsLayerId: 'embeddings-layer',
    labelsLayerId: 'labels-layer',
    changeLayerId: 'change-layer',
    clusteringLayerId: 'clustering-layer',

    /**
     * Initialize the application
     */
    async init() {
        console.log('Initializing AlphaEarth Visualization...');

        // Initialize UI controls
        UIControls.init();

        // Initialize Case Studies UI
        if (typeof CaseStudiesUI !== 'undefined') {
            CaseStudiesUI.init();
        }

        // Initialize MapLibre map with globe projection
        this.initMap();

        // Show authentication modal
        UIControls.showAuthModal();
    },

    /**
     * Initialize MapLibre GL JS map with 3D globe
     */
    initMap() {
        this.map = new maplibregl.Map({
            container: 'map',
            style: {
                version: 8,
                name: 'AlphaEarth Globe',
                sources: {
                    // USGS Imagery basemap
                    'usgs-imagery': {
                        type: 'raster',
                        tiles: [
                            'https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}'
                        ],
                        tileSize: 256,
                        attribution: 'USGS',
                        maxzoom: 16
                    },
                    // Terrain source for 3D elevation
                    'terrain': {
                        type: 'raster-dem',
                        tiles: [
                            'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'
                        ],
                        tileSize: 256,
                        encoding: 'terrarium',
                        maxzoom: 14
                    },
                    // Labels source (CartoDB Dark Matter)
                    'labels': {
                        type: 'raster',
                        tiles: [
                            'https://basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png'
                        ],
                        tileSize: 256,
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    }
                },
                layers: [
                    {
                        id: 'background',
                        type: 'background',
                        paint: {
                            'background-color': '#000814'
                        }
                    },
                    {
                        id: 'usgs-imagery-layer',
                        type: 'raster',
                        source: 'usgs-imagery',
                        paint: {
                            'raster-opacity': 1
                        }
                    }
                ],
                terrain: {
                    source: 'terrain',
                    exaggeration: 2
                }
            },
            center: [-30, 25],
            zoom: 1.8,
            pitch: 0,
            bearing: 0,
            projection: 'globe',
            maxPitch: 85
        });

        // Add navigation controls
        this.map.addControl(new maplibregl.NavigationControl({
            visualizePitch: true
        }), 'top-left');

        this.map.addControl(new maplibregl.FullscreenControl(), 'top-left');

        // Define updateArea function for calculating change
        // Initialize drawing tool using DrawManager deferred to map load
        // const drawInitialized = DrawManager.init(this.map, handlePolygonComplete);
        // if (drawInitialized) {
        //     this.map.addControl(new MeasureAreaControl(), 'top-left');
        // }


        // Handler for completed polygons
        function handlePolygonComplete(polygon) {
            console.log('Polygon received for analysis:', polygon);

            // Check if we're in change detection mode
            if (App.currentMode !== 'change') {
                showMeasureError('Please switch to Change Detection mode to measure area changes.');
                return;
            }

            // Show loading indicator
            showMeasureLoading();

            // Get year settings
            const year1 = App.changeYears?.year1 || 2017;
            const year2 = App.changeYears?.year2 || 2024;
            const threshold = 0.7;

            // Call Earth Engine calculation
            if (typeof EarthEngineManager !== 'undefined' && EarthEngineManager.calculateChangeArea) {
                EarthEngineManager.calculateChangeArea(polygon.geometry, year1, year2, threshold)
                    .then(result => {
                        hideMeasureLoading();
                        showMeasureResult(result, year1, year2);
                    })
                    .catch(error => {
                        hideMeasureLoading();
                        console.error('Area calculation failed:', error);
                        showMeasureError('Unable to calculate area. Please try again.');
                    });
            } else {
                hideMeasureLoading();
                showMeasureError('Earth Engine Manager not loaded.');
            }
        }

        // UI Helpers for measure results
        function showMeasureLoading() {
            const overlay = document.createElement('div');
            overlay.id = 'measure-loading';
            overlay.className = 'measure-modal-overlay';
            overlay.innerHTML = `
                <div class="measure-result-modal">
                    <h3>Calculating...</h3>
                    <p>Analyzing land cover change with Earth Engine</p>
                </div>
            `;
            document.body.appendChild(overlay);
        }

        function hideMeasureLoading() {
            const loading = document.getElementById('measure-loading');
            if (loading) loading.remove();
        }

        function showMeasureResult(areaKm2, year1, year2) {
            const overlay = document.createElement('div');
            overlay.className = 'measure-modal-overlay';
            overlay.onclick = () => overlay.remove();

            const modal = document.createElement('div');
            modal.className = 'measure-result-modal';
            modal.innerHTML = `
                <h3>Area of Significant Change</h3>
                <p>${year1} → ${year2}</p>
                <div class="result-value">${areaKm2.toFixed(2)}</div>
                <div class="result-unit">km²</div>
                <p style="color: #666; font-size: 12px; margin-top: 16px;">
                    Areas where embedding similarity &lt; 0.7
                </p>
                <button onclick="this.closest('.measure-modal-overlay').remove()">
                    Close
                </button>
            `;
            modal.onclick = (e) => e.stopPropagation();

            overlay.appendChild(modal);
            document.body.appendChild(overlay);
        }

        function showMeasureError(message) {
            const overlay = document.createElement('div');
            overlay.className = 'measure-modal-overlay';
            overlay.onclick = () => overlay.remove();

            const modal = document.createElement('div');
            modal.className = 'measure-result-modal';
            modal.innerHTML = `
                <h3>⚠️ Unable to Measure</h3>
                <p>${message}</p>
                <button onclick="this.closest('.measure-modal-overlay').remove()">
                    OK
                </button>
            `;
            modal.onclick = (e) => e.stopPropagation();

            overlay.appendChild(modal);
            document.body.appendChild(overlay);
        }

        this.map.on('load', () => {
            console.log('Map loaded');

            // Add atmosphere/fog effect for globe (wrapped to prevent crash on unsupported devices)
            try {
                if (this.map.setFog) {
                    this.map.setFog({
                        color: 'rgb(5, 5, 25)',
                        'high-color': 'rgb(20, 20, 60)',
                        'horizon-blend': 0.03,
                        'space-color': 'rgb(5, 5, 15)',
                        'star-intensity': 0.6
                    });
                }
            } catch (e) {
                console.warn('Failed to set fog:', e);
            }

            // Initialize Terra Draw (DrawManager)
            console.log('Attempting to initialize DrawManager...');
            try {
                if (typeof DrawManager !== 'undefined') {
                    const drawInitialized = DrawManager.init(this.map, handlePolygonComplete);
                    if (drawInitialized) {
                        this.map.addControl(new MeasureAreaControl(), 'top-left');
                        console.log('MeasureAreaControl added to map.');
                    } else {
                        console.error('DrawManager.init returned false. Check Terra Draw globals.');
                    }
                } else {
                    console.error('DrawManager global is not defined. check draw-manager.js loading.');
                }
            } catch (e) {
                console.error('CRITICAL: Error initializing DrawManager:', e);
            }
        });

        // Handle map errors
        this.map.on('error', (e) => {
            console.error('Map error:', e);
        });
    },

    /**
     * Called after successful Earth Engine authentication
     */
    async onAuthenticated() {
        console.log('Authentication successful, loading initial embeddings...');

        // Load initial embeddings with default parameters
        const params = UIControls.getParams();
        await this.loadEmbeddings(params);

        UIControls.showLoading(false);
    },

    /**
     * Load AlphaEarth embeddings onto the map
     * @param {Object} params - Visualization parameters
     */
    async loadEmbeddings(params) {
        try {
            console.log('Loading embeddings:', params);

            // Set mode to embeddings
            this.setMode('embeddings');

            // Get tile URL from Earth Engine
            const tileUrl = await EarthEngineManager.getEmbeddingsTileUrl(
                params.year,
                params.bands,
                params.min,
                params.max
            );

            // Remove existing embeddings layer if present
            if (this.map.getLayer(this.embeddingsLayerId)) {
                this.map.removeLayer(this.embeddingsLayerId);
            }
            if (this.map.getSource('embeddings')) {
                this.map.removeSource('embeddings');
            }

            // Add new source
            this.map.addSource('embeddings', {
                type: 'raster',
                tiles: [tileUrl],
                tileSize: 256
            });

            // Add layer (before labels if they exist)
            const beforeLayer = this.map.getLayer(this.labelsLayerId) ? this.labelsLayerId : undefined;

            this.map.addLayer({
                id: this.embeddingsLayerId,
                type: 'raster',
                source: 'embeddings',
                paint: {
                    'raster-opacity': 1
                }
            }, beforeLayer);

            // Update terrain exaggeration
            this.updateTerrain(params.terrainExaggeration);

            // Toggle labels based on setting
            this.toggleLabels(params.showLabels);

            console.log(`Loaded ${params.layerName}`);

        } catch (error) {
            console.error('Error loading embeddings:', error);
            throw error;
        }
    },

    /**
     * Update terrain exaggeration
     * @param {number} exaggeration - Terrain exaggeration value (0-5)
     */
    updateTerrain(exaggeration) {
        if (this.map.getTerrain()) {
            this.map.setTerrain({
                source: 'terrain',
                exaggeration: exaggeration
            });
        }
    },

    /**
     * Toggle layer visibility
     * @param {string} layerId - Layer identifier ('background', 'imagery', 'embeddings')
     * @param {boolean} visible - Visibility state
     */
    toggleLayer(layerId, visible) {
        const layerMap = {
            'background': 'background',
            'imagery': 'usgs-imagery-layer',
            'embeddings': this.embeddingsLayerId
        };

        const mapLayerId = layerMap[layerId];
        if (mapLayerId && this.map.getLayer(mapLayerId)) {
            this.map.setLayoutProperty(
                mapLayerId,
                'visibility',
                visible ? 'visible' : 'none'
            );
        }
    },

    /**
     * Set layer opacity
     * @param {string} layerId - Layer identifier
     * @param {number} opacity - Opacity value (0-1)
     */
    setLayerOpacity(layerId, opacity) {
        const layerMap = {
            'background': 'background',
            'imagery': 'usgs-imagery-layer',
            'embeddings': this.embeddingsLayerId
        };

        const mapLayerId = layerMap[layerId];
        if (mapLayerId && this.map.getLayer(mapLayerId)) {
            const layer = this.map.getLayer(mapLayerId);
            if (layer.type === 'raster') {
                this.map.setPaintProperty(mapLayerId, 'raster-opacity', opacity);
            } else if (layer.type === 'background') {
                // For background, we adjust the color alpha
                const currentColor = this.map.getPaintProperty(mapLayerId, 'background-color');
                this.map.setPaintProperty(
                    mapLayerId,
                    'background-opacity',
                    opacity
                );
            }
        }
    },

    /**
     * Toggle label layer
     * @param {boolean} visible - Visibility state
     */
    toggleLabels(visible) {
        if (this.map.getLayer(this.labelsLayerId)) {
            // Layer exists, just toggle visibility
            this.map.setLayoutProperty(
                this.labelsLayerId,
                'visibility',
                visible ? 'visible' : 'none'
            );
        } else if (visible) {
            // Add labels layer if it doesn't exist
            this.map.addLayer({
                id: this.labelsLayerId,
                type: 'raster',
                source: 'labels',
                paint: {
                    'raster-opacity': 0.85
                }
            });
        }
    },

    /**
     * Fly to a location
     * @param {number} lon - Longitude
     * @param {number} lat - Latitude
     * @param {number} zoom - Zoom level
     */
    flyTo(lon, lat, zoom = 10) {
        this.map.flyTo({
            center: [lon, lat],
            zoom: zoom,
            duration: 2000
        });
    },

    /**
     * Reset map view to default
     */
    resetView() {
        this.map.flyTo({
            center: [-30, 25],
            zoom: 1.8,
            pitch: 0,
            bearing: 0,
            duration: 1500
        });
    },

    /**
     * Handle polygon creation event
     * @param {Object} e - Draw event
     */
    async handleDrawCreate(e) {
        await this.processDrawnPolygon(e.features[0]);
    },

    /**
     * Handle polygon update event
     * @param {Object} e - Draw event
     */
    async handleDrawUpdate(e) {
        await this.processDrawnPolygon(e.features[0]);
    },

    /**
     * Process a drawn polygon to calculate change area
     * @param {Object} feature - GeoJSON feature
     */
    async processDrawnPolygon(feature) {
        // Get all drawn features
        const data = this.draw ? this.draw.getAll() : null;
        if (!data || data.features.length === 0) {
            console.warn('No features to process');
            return;
        }

        // Get geometry from the feature
        const geometry = feature ? feature.geometry : data.features[0].geometry;

        // Check if we're in change detection mode
        if (this.currentMode !== 'change') {
            alert("⚠️ Mode Mismatch\n\nPlease switch the visualization mode to 'Change Detection' before measuring.\n\nUse the Case Studies panel to select a change detection scenario.");
            if (this.draw) {
                this.draw.deleteAll();
            }
            return;
        }

        // Visual feedback: Change button color to indicate processing
        const btn = document.querySelector('.mapbox-gl-draw_polygon');
        if (btn) btn.style.backgroundColor = '#ffeb3b';

        console.log("Starting change area calculation...", geometry);

        try {
            // Get years from current state
            const year1 = this.changeYears.year1 || 2017;
            const year2 = this.changeYears.year2 || 2024;
            const threshold = 0.7;

            // Verify EarthEngineManager is available and has the method
            if (typeof EarthEngineManager === 'undefined' || !EarthEngineManager.calculateChangeArea) {
                throw new Error('EarthEngineManager.calculateChangeArea is not available');
            }

            // Calculate change area using Earth Engine
            const areaKm2 = await EarthEngineManager.calculateChangeArea(
                geometry,
                year1,
                year2,
                threshold
            );

            // Display result
            alert(`📉 CHANGE ANALYSIS\n\nArea of significant change: ${areaKm2} km²\n\nPeriod: ${year1} to ${year2}\nThreshold: ${threshold * 100}% similarity`);
            console.log(`Change area result: ${areaKm2} km²`);

        } catch (error) {
            console.error('Calculation failed:', error);
            alert('Error calculating area: ' + (error.message || 'Unknown error. Check console for details.'));
        } finally {
            // Reset UI
            if (btn) btn.style.backgroundColor = '';
            // Clear shape for next measurement
            if (this.draw) {
                this.draw.deleteAll();
            }
        }
    },

    /**
     * Set the current visualization mode
     * @param {string} mode - 'embeddings', 'change', or 'clustering'
     * @param {Object} options - Additional options (e.g., years for change detection)
     */
    setMode(mode, options = {}) {
        this.currentMode = mode;
        if (mode === 'change' && options.year1 && options.year2) {
            this.changeYears = { year1: options.year1, year2: options.year2 };
        }
        console.log(`Mode set to: ${mode}`, options);
    },

    /**
     * Add change detection layer comparing two years
     * @param {number} year1 - First year
     * @param {number} year2 - Second year
     */
    async addChangeDetectionLayer(year1, year2) {
        try {
            console.log(`Loading change detection: ${year1} vs ${year2}`);

            // Set mode to change detection
            this.setMode('change', { year1, year2 });

            // Get change detection tile URL
            const tileUrl = await EarthEngineManager.getChangeDetectionUrl(year1, year2);

            // Remove existing change layer if present
            if (this.map.getLayer(this.changeLayerId)) {
                this.map.removeLayer(this.changeLayerId);
            }
            if (this.map.getSource('change-detection')) {
                this.map.removeSource('change-detection');
            }

            // Remove embeddings layer to show change layer
            if (this.map.getLayer(this.embeddingsLayerId)) {
                this.map.removeLayer(this.embeddingsLayerId);
            }
            if (this.map.getSource('embeddings')) {
                this.map.removeSource('embeddings');
            }

            // Add new source
            this.map.addSource('change-detection', {
                type: 'raster',
                tiles: [tileUrl],
                tileSize: 256
            });

            // Add layer
            const beforeLayer = this.map.getLayer(this.labelsLayerId) ? this.labelsLayerId : undefined;

            this.map.addLayer({
                id: this.changeLayerId,
                type: 'raster',
                source: 'change-detection',
                paint: {
                    'raster-opacity': 1
                }
            }, beforeLayer);

            console.log(`Loaded change detection: ${year1} vs ${year2}`);

        } catch (error) {
            console.error('Error loading change detection:', error);
            throw error;
        }
    },

    /**
     * Add clustering layer
     * @param {number} year - Year to analyze
     * @param {string[]} bands - Bands to use for clustering
     */
    async addClusteringLayer(year, bands) {
        try {
            console.log(`Loading clustering for year ${year} with bands:`, bands);

            // Set mode to clustering
            this.setMode('clustering');

            // Get clustering tile URL
            const tileUrl = await EarthEngineManager.getClusteringUrl(year, bands);

            // Remove existing clustering layer if present
            if (this.map.getLayer(this.clusteringLayerId)) {
                this.map.removeLayer(this.clusteringLayerId);
            }
            if (this.map.getSource('clustering')) {
                this.map.removeSource('clustering');
            }

            // Remove embeddings layer to show clustering layer
            if (this.map.getLayer(this.embeddingsLayerId)) {
                this.map.removeLayer(this.embeddingsLayerId);
            }
            if (this.map.getSource('embeddings')) {
                this.map.removeSource('embeddings');
            }

            // Add new source
            this.map.addSource('clustering', {
                type: 'raster',
                tiles: [tileUrl],
                tileSize: 256
            });

            // Add layer
            const beforeLayer = this.map.getLayer(this.labelsLayerId) ? this.labelsLayerId : undefined;

            this.map.addLayer({
                id: this.clusteringLayerId,
                type: 'raster',
                source: 'clustering',
                paint: {
                    'raster-opacity': 1
                }
            }, beforeLayer);

            console.log(`Loaded clustering for year ${year}`);

        } catch (error) {
            console.error('Error loading clustering:', error);
            throw error;
        }
    },

    /**
     * Remove additional layers (change detection, clustering)
     */
    removeAdditionalLayers() {
        // Remove change layer
        if (this.map.getLayer(this.changeLayerId)) {
            this.map.removeLayer(this.changeLayerId);
        }
        if (this.map.getSource('change-detection')) {
            this.map.removeSource('change-detection');
        }

        // Remove clustering layer
        if (this.map.getLayer(this.clusteringLayerId)) {
            this.map.removeLayer(this.clusteringLayerId);
        }
        if (this.map.getSource('clustering')) {
            this.map.removeSource('clustering');
        }
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Export for global access
window.App = App;
// Also expose map directly for chatbot integration
Object.defineProperty(window, 'map', {
    get: function () { return App.map; }
});
