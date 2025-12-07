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

    // OAuth Client ID for Google Cloud Project
    OAUTH_CLIENT_ID: '37656881675-ldkap3udu8p3b6f34u0i5a9s2sj19l5f.apps.googleusercontent.com',

    // Google Cloud Project ID
    PROJECT_ID: 'uae-imagery',

    /**
     * Check if Earth Engine API is loaded
     * @returns {boolean}
     */
    isApiLoaded() {
        return typeof ee !== 'undefined' && ee !== null && typeof ee.data !== 'undefined';
    },

    /**
     * Initialize Earth Engine with OAuth authentication
     * @returns {Promise<void>}
     */
    async initialize() {
        return new Promise((resolve, reject) => {
            // Check if there was a script load error
            if (window.eeLoadError) {
                reject(new Error('Earth Engine API failed to load. The script could not be downloaded. Please check your internet connection and try refreshing the page.'));
                return;
            }

            // Check if EE API is loaded
            if (!this.isApiLoaded()) {
                console.error('Earth Engine API check failed:');
                console.error('  typeof ee:', typeof ee);
                console.error('  ee value:', typeof ee !== 'undefined' ? ee : 'undefined');
                reject(new Error('Earth Engine API not loaded. Please refresh the page and try again.'));
                return;
            }

            console.log('Earth Engine API detected successfully');
            console.log('Starting Earth Engine authentication...');
            console.log('Using OAuth Client ID:', this.OAUTH_CLIENT_ID);
            console.log('Using Project ID:', this.PROJECT_ID);

            // Use OAuth authentication with client ID
            try {
                ee.data.authenticateViaOauth(
                    this.OAUTH_CLIENT_ID,
                    () => {
                        console.log('OAuth authentication completed, initializing with project:', this.PROJECT_ID);
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
                            },
                            null,
                            this.PROJECT_ID
                        );
                    },
                    (error) => {
                        console.error('OAuth authentication failed:', error);
                        reject(new Error('Authentication failed. Please ensure you have Earth Engine access and allow popups.'));
                    },
                    null,
                    () => {
                        // Fallback to popup if needed
                        console.log('Trying popup authentication...');
                        ee.data.authenticateViaPopup(
                            () => {
                                ee.initialize(
                                    null,
                                    null,
                                    () => {
                                        this.initialized = true;
                                        console.log('Earth Engine initialized via popup');
                                        resolve();
                                    },
                                    (error) => {
                                        reject(new Error('Failed to initialize: ' + error));
                                    },
                                    null,
                                    this.PROJECT_ID
                                );
                            },
                            (error) => {
                                reject(new Error('Popup authentication failed: ' + error));
                            }
                        );
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
                console.log('Loading embeddings for year:', year, 'bands:', bands);

                // Filter by date range and mosaic all tiles for the year
                const startDate = year + '-01-01';
                const endDate = (year + 1) + '-01-01';

                const image = ee.ImageCollection(this.DATASET_ID)
                    .filterDate(startDate, endDate)
                    .mosaic()
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
     * @returns {string[]} Array of band names A00-A63
     */
    getAllBandNames() {
        const bands = [];
        for (let i = 0; i <= 63; i++) {
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
                const bandNames = this.getAllBandNames();

                // Get images for both years using filterDate and mosaic
                const image1 = ee.ImageCollection(this.DATASET_ID)
                    .filterDate(year1 + '-01-01', (year1 + 1) + '-01-01')
                    .mosaic()
                    .select(bandNames);

                const image2 = ee.ImageCollection(this.DATASET_ID)
                    .filterDate(year2 + '-01-01', (year2 + 1) + '-01-01')
                    .mosaic()
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
    },

    /**
     * Get clustering visualization using k-means on embeddings
     * @param {number} year - Year to analyze
     * @param {string[]} bands - Bands to use for clustering
     * @param {number} numClusters - Number of clusters (default 8)
     * @returns {Promise<string>} Tile URL for clustering layer
     */
    async getClusteringUrl(year, bands, numClusters = 8) {
        if (!this.initialized) {
            throw new Error('Earth Engine not initialized');
        }

        return new Promise((resolve, reject) => {
            try {
                // Get image for the year
                const startDate = year + '-01-01';
                const endDate = (year + 1) + '-01-01';

                const image = ee.ImageCollection(this.DATASET_ID)
                    .filterDate(startDate, endDate)
                    .mosaic()
                    .select(bands);

                // Sample the image for training
                const training = image.sample({
                    region: ee.Geometry.Rectangle([-180, -60, 180, 75]),
                    scale: 10000,
                    numPixels: 5000
                });

                // Train k-means clusterer
                const clusterer = ee.Clusterer.wekaKMeans(numClusters).train(training);

                // Apply clusterer to image
                const clustered = image.cluster(clusterer);

                // Visualization with distinct colors
                const visParams = {
                    min: 0,
                    max: numClusters - 1,
                    palette: [
                        '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728',
                        '#9467bd', '#8c564b', '#e377c2', '#7f7f7f'
                    ].slice(0, numClusters)
                };

                clustered.getMap(visParams, (mapInfo, error) => {
                    if (error) {
                        reject(new Error('Failed to generate clustering: ' + error));
                    } else {
                        resolve(mapInfo.urlFormat);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }
};

// Export for use in other modules
window.EarthEngineManager = EarthEngineManager;
