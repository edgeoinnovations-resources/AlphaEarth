/**
 * Main Application - AlphaEarth Visualization
 * Integrates MapLibre GL JS with Earth Engine data
 *
 * The AlphaEarth Foundations Satellite Embedding dataset is produced by
 * Google and Google DeepMind.
 */

const App = {
    map: null,
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

        // Set up globe atmosphere on load
        this.map.on('load', () => {
            console.log('Map loaded');

            // Add atmosphere/fog effect for globe
            this.map.setFog({
                color: 'rgb(5, 5, 25)',
                'high-color': 'rgb(20, 20, 60)',
                'horizon-blend': 0.03,
                'space-color': 'rgb(5, 5, 15)',
                'star-intensity': 0.6
            });
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
     * Add change detection layer comparing two years
     * @param {number} year1 - First year
     * @param {number} year2 - Second year
     */
    async addChangeDetectionLayer(year1, year2) {
        try {
            console.log(`Loading change detection: ${year1} vs ${year2}`);

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
    get: function() { return App.map; }
});
