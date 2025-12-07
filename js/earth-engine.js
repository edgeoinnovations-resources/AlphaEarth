/**
 * Earth Engine Integration for AlphaEarth Visualization
 * Handles authentication and data loading from Google Earth Engine
 *
 * The AlphaEarth Foundations Satellite Embedding dataset is produced by
 * Google and Google DeepMind.
 */

const EarthEngineManager = {
    initialized: false,
    currentTileUrl: null,

    // Earth Engine dataset ID
    DATASET_ID: 'GOOGLE/SATELLITE_EMBEDDING/V1/ANNUAL',

    /**
     * Initialize Earth Engine with OAuth authentication
     * @returns {Promise<void>}
     */
    async initialize() {
        return new Promise((resolve, reject) => {
            // Check if EE API is loaded
            if (typeof ee === 'undefined') {
                reject(new Error('Earth Engine API not loaded. Please check your internet connection.'));
                return;
            }

            console.log('Starting Earth Engine authentication...');

            // Try popup authentication directly
            try {
                ee.data.authenticateViaPopup(
                    () => {
                        console.log('OAuth popup completed, initializing...');
                        ee.initialize(
                            null,
                            null,
                            () => {
                                this.initialized = true;
                                console.log('Earth Engine initialized successfully');
                                resolve();
                            },
                            (error) => {
                                console.error('EE initialization failed:', error);
                                reject(new Error('Failed to initialize Earth Engine: ' + error));
                            }
                        );
                    },
                    (error) => {
                        console.error('OAuth popup failed:', error);
                        reject(new Error('Authentication failed. Please ensure you have Earth Engine access and allow popups.'));
                    }
                );
            } catch (error) {
                console.error('Authentication error:', error);
                reject(error);
            }
        });
    },

    /**
     * Get AlphaEarth embeddings as a tile URL for MapLibre
     * @param {number} year - Year (2017-2024)
     * @param {string[]} bands - Array of 3 band names ['A01', 'A02', 'A03']
     * @param {number} min - Minimum visualization value
     * @param {number} max - Maximum visualization value
     * @returns {Promise<string>} Tile URL template
     */
    async getEmbeddingsTileUrl(year, bands, min, max) {
        if (!this.initialized) {
            throw new Error('Earth Engine not initialized. Please authenticate first.');
        }

        return new Promise((resolve, reject) => {
            try {
                // Load the dataset
                const dataset = ee.ImageCollection(this.DATASET_ID);

                // Filter by year using the 'year' property
                const image = dataset
                    .filter(ee.Filter.eq('year', year))
                    .first()
                    .select(bands);

                // Visualization parameters
                const visParams = {
                    bands: bands,
                    min: min,
                    max: max
                };

                // Get the map ID for tile serving
                image.getMap(visParams, (mapInfo, error) => {
                    if (error) {
                        console.error('Error getting map tiles:', error);
                        reject(new Error('Failed to load embeddings: ' + error));
                    } else {
                        // Construct tile URL
                        const tileUrl = mapInfo.urlFormat;
                        this.currentTileUrl = tileUrl;
                        console.log('Got tile URL for year', year);
                        resolve(tileUrl);
                    }
                });
            } catch (error) {
                console.error('Error in getEmbeddingsTileUrl:', error);
                reject(error);
            }
        });
    },

    /**
     * Get available years in the dataset
     * @returns {number[]} Array of available years
     */
    getAvailableYears() {
        return [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];
    },

    /**
     * Get all band names
     * @returns {string[]} Array of band names A01-A64
     */
    getAllBandNames() {
        const bands = [];
        for (let i = 1; i <= 64; i++) {
            bands.push(`A${i.toString().padStart(2, '0')}`);
        }
        return bands;
    },

    /**
     * Calculate change detection between two years
     * @param {number} year1 - First year
     * @param {number} year2 - Second year
     * @returns {Promise<string>} Tile URL for similarity layer
     */
    async getChangeDetectionUrl(year1, year2) {
        if (!this.initialized) {
            throw new Error('Earth Engine not initialized');
        }

        return new Promise((resolve, reject) => {
            try {
                const dataset = ee.ImageCollection(this.DATASET_ID);
                const bandNames = this.getAllBandNames();

                const image1 = dataset
                    .filter(ee.Filter.eq('year', year1))
                    .first()
                    .select(bandNames);

                const image2 = dataset
                    .filter(ee.Filter.eq('year', year2))
                    .first()
                    .select(bandNames);

                // Calculate dot product (similarity)
                const dotProduct = image1.multiply(image2).reduce(ee.Reducer.sum());
                const similarity = dotProduct.clamp(0, 1);

                const visParams = {
                    min: 0,
                    max: 1,
                    palette: ['black', 'white']
                };

                similarity.getMap(visParams, (mapInfo, error) => {
                    if (error) {
                        reject(new Error('Failed to calculate change detection: ' + error));
                    } else {
                        resolve(mapInfo.urlFormat);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    /**
     * Check if Earth Engine is ready
     * @returns {boolean}
     */
    isReady() {
        return this.initialized;
    }
};

// Export for use in other modules
window.EarthEngineManager = EarthEngineManager;
