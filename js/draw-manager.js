/**
 * DrawManager - Terra Draw integration for AlphaEarth
 * Handles polygon drawing for area measurement
 */

const DrawManager = (function () {
    let draw = null;
    let measureControl = null;
    let isActive = false;
    let onPolygonComplete = null;

    /**
     * Initialize Terra Draw on a MapLibre map
     * @param {maplibregl.Map} map - The MapLibre map instance
     * @param {Function} callback - Called with GeoJSON feature when polygon completes
     */
    function init(map, callback) {
        // Verify libraries loaded
        if (typeof terraDraw === 'undefined') {
            console.error('❌ terraDraw global not found. Check terra-draw script tag.');
            return false;
        }
        if (typeof terraDrawMaplibreGlAdapter === 'undefined') {
            console.error('❌ terraDrawMaplibreGlAdapter global not found. Check adapter script tag.');
            return false;
        }

        onPolygonComplete = callback;

        // Destructure classes from UMD globals
        const { TerraDraw, TerraDrawPolygonMode, TerraDrawRenderMode } = terraDraw;
        const { TerraDrawMapLibreGLAdapter } = terraDrawMaplibreGlAdapter;

        try {
            // Create Terra Draw instance
            draw = new TerraDraw({
                adapter: new TerraDrawMapLibreGLAdapter({
                    map: map,
                    lib: maplibregl  // REQUIRED for browser/UMD usage
                }),
                modes: [
                    new TerraDrawPolygonMode({
                        allowSelfIntersections: false,
                        pointerDistance: 30,
                        styles: {
                            fillColor: '#4A90D9',
                            fillOpacity: 0.2,
                            outlineColor: '#4A90D9',
                            outlineWidth: 2,
                            closingPointColor: '#4A90D9',
                            closingPointWidth: 6,
                            closingPointOutlineColor: '#FFFFFF',
                            closingPointOutlineWidth: 2
                        }
                    }),
                    new TerraDrawRenderMode({ modeName: 'static' })
                ]
            });

            // Start the drawing engine after a short delay to ensure style is loaded
            setTimeout(() => {
                if (draw) {
                    draw.start();
                    // Handle polygon completion
                    draw.on('finish', handleFinish);
                }
            }, 200);

            // Log ready state
            draw.on('ready', () => {
                console.log('✅ Terra Draw ready for polygon drawing');
            });

            console.log('✅ DrawManager initialized successfully');
            return true;

        } catch (error) {
            console.error('❌ Terra Draw initialization failed:', error);
            return false;
        }
    }

    function handleFinish(id, context) {
        if (context.action === 'draw' && context.mode === 'polygon') {
            const features = draw.getSnapshot();
            const polygon = features.find(f => f.id === id);

            if (polygon && polygon.geometry && polygon.geometry.coordinates.length > 0) {
                console.log('✅ Polygon completed:', polygon);

                // Call the callback with the completed polygon
                if (typeof onPolygonComplete === 'function') {
                    onPolygonComplete(polygon);
                }

                // Reset after a short delay
                setTimeout(() => {
                    clear();
                    setActive(false);
                }, 200);
            }
        }
    }

    function startDrawing() {
        if (!draw) {
            console.error('DrawManager not initialized');
            return;
        }
        draw.setMode('polygon');
        isActive = true;
        updateButtonState(true);
        console.log('📐 Polygon drawing mode activated');
    }

    function stopDrawing() {
        if (!draw) return;
        draw.setMode('static');
        isActive = false;
        updateButtonState(false);
    }

    function clear() {
        if (draw) {
            draw.clear();
        }
    }

    function toggle() {
        if (isActive) {
            stopDrawing();
            clear();
        } else {
            startDrawing();
        }
    }

    function setActive(active) {
        isActive = active;
        updateButtonState(active);
        if (!active && draw) {
            draw.setMode('static');
        }
    }

    function updateButtonState(active) {
        const btn = document.querySelector('.measure-area-btn');
        if (btn) {
            if (active) {
                btn.classList.add('active');
                btn.title = 'Click map to draw polygon vertices. Click first point to close.';
            } else {
                btn.classList.remove('active');
                btn.title = 'Measure Area of Change';
            }
        }
    }

    function isDrawing() {
        return isActive;
    }

    // Public API
    return {
        init,
        startDrawing,
        stopDrawing,
        toggle,
        clear,
        isDrawing,
        setActive
    };
})();

/**
 * MapLibre GL Control for Measure Button
 */
class MeasureAreaControl {
    onAdd(map) {
        this._map = map;
        this._container = document.createElement('div');
        this._container.className = 'maplibregl-ctrl maplibregl-ctrl-group';

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'measure-area-btn';
        button.innerHTML = '📐';
        button.title = 'Measure Area of Change';
        button.setAttribute('aria-label', 'Measure area of land cover change');

        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            DrawManager.toggle();
        });

        this._container.appendChild(button);
        return this._container;
    }

    onRemove() {
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
    }
}

// Make available globally
window.DrawManager = DrawManager;
window.MeasureAreaControl = MeasureAreaControl;
