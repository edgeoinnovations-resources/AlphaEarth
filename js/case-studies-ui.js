/**
 * Case Studies UI Controller
 * Handles the case studies panel interface
 */

const CaseStudiesUI = {
    elements: {},
    currentCategory: 'all',
    currentScenario: null,

    /**
     * Initialize the case studies UI
     */
    init() {
        this.cacheElements();
        this.renderCategoryFilter();
        this.renderScenarios();
        this.bindEvents();
    },

    /**
     * Cache DOM element references
     */
    cacheElements() {
        this.elements = {
            panel: document.getElementById('case-studies-panel'),
            toggle: document.getElementById('case-studies-toggle'),
            content: document.getElementById('case-studies-content'),
            categoryFilter: document.getElementById('category-filter'),
            searchInput: document.getElementById('scenario-search'),
            scenarioList: document.getElementById('scenario-list'),
            scenarioDetail: document.getElementById('scenario-detail'),
            detailContent: document.getElementById('detail-content'),
            btnExplore: document.getElementById('btn-explore'),
            btnBack: document.getElementById('btn-back'),
            modeIndicator: document.getElementById('mode-indicator'),
            explainerBox: document.getElementById('explainer-box'),
            explainerText: document.getElementById('explainer-text'),
            showExplainerBtn: document.getElementById('show-explainer-btn')
        };
    },

    /**
     * Render category filter dropdown
     */
    renderCategoryFilter() {
        if (!this.elements.categoryFilter) return;

        let html = '<option value="all">All Categories</option>';
        CaseStudies.categories.forEach(cat => {
            html += `<option value="${cat.id}">${cat.icon} ${cat.name}</option>`;
        });
        this.elements.categoryFilter.innerHTML = html;
    },

    /**
     * Render scenario list
     * @param {Array} scenarios - Optional filtered scenarios
     */
    renderScenarios(scenarios = null) {
        if (!this.elements.scenarioList) return;

        const items = scenarios || this.getFilteredScenarios();

        if (items.length === 0) {
            this.elements.scenarioList.innerHTML = '<div class="no-results">No scenarios found</div>';
            return;
        }

        let html = '';
        items.forEach(scenario => {
            const modeClass = scenario.mode === 'change' ? 'mode-change' :
                              scenario.mode === 'clustering' ? 'mode-clustering' : 'mode-embeddings';
            const modeLabel = scenario.mode === 'change' ? 'Change' :
                              scenario.mode === 'clustering' ? 'Cluster' : 'View';

            html += `
                <div class="scenario-item" data-id="${scenario.id}">
                    <div class="scenario-header">
                        <span class="scenario-icon">${scenario.categoryIcon || '📍'}</span>
                        <span class="scenario-name">${scenario.name}</span>
                        <span class="scenario-mode ${modeClass}">${modeLabel}</span>
                    </div>
                    <p class="scenario-desc">${scenario.description.substring(0, 80)}...</p>
                </div>
            `;
        });

        this.elements.scenarioList.innerHTML = html;
    },

    /**
     * Get filtered scenarios based on current filters
     * @returns {Array} Filtered scenarios
     */
    getFilteredScenarios() {
        let scenarios = CaseStudies.getAllScenarios();

        // Filter by category
        if (this.currentCategory !== 'all') {
            scenarios = scenarios.filter(s => s.category === this.currentCategory);
        }

        // Filter by search
        const searchTerm = this.elements.searchInput?.value?.toLowerCase() || '';
        if (searchTerm) {
            scenarios = scenarios.filter(s =>
                s.name.toLowerCase().includes(searchTerm) ||
                s.description.toLowerCase().includes(searchTerm)
            );
        }

        return scenarios;
    },

    /**
     * Show scenario detail view
     * @param {number} id - Scenario ID
     */
    showDetail(id) {
        const scenario = CaseStudies.getById(id);
        if (!scenario) return;

        this.currentScenario = scenario;

        // Build detail HTML
        const modeText = scenario.mode === 'change' ? 'Change Detection' :
                         scenario.mode === 'clustering' ? 'Clustering' : 'Embeddings View';
        const yearText = scenario.mode === 'change' ?
            `${scenario.year1} vs ${scenario.year2}` : `${scenario.year1}`;

        const detailHtml = `
            <div class="detail-header">
                <span class="detail-icon">${scenario.categoryIcon}</span>
                <h3>${scenario.name}</h3>
            </div>
            <p class="detail-description">${scenario.description}</p>
            <div class="detail-meta">
                <div class="meta-row">
                    <span class="meta-label">Category:</span>
                    <span class="meta-value">${scenario.categoryName}</span>
                </div>
                <div class="meta-row">
                    <span class="meta-label">Mode:</span>
                    <span class="meta-value">${modeText}</span>
                </div>
                <div class="meta-row">
                    <span class="meta-label">Year(s):</span>
                    <span class="meta-value">${yearText}</span>
                </div>
                <div class="meta-row">
                    <span class="meta-label">Location:</span>
                    <span class="meta-value">${scenario.lat.toFixed(2)}, ${scenario.lon.toFixed(2)}</span>
                </div>
                <div class="meta-row">
                    <span class="meta-label">Bands:</span>
                    <span class="meta-value">${scenario.bands.join(', ')}</span>
                </div>
            </div>
        `;

        this.elements.detailContent.innerHTML = detailHtml;

        // Show detail, hide list
        this.elements.scenarioList.style.display = 'none';
        this.elements.scenarioDetail.style.display = 'block';

        // Update mode indicator
        if (this.elements.modeIndicator) {
            this.elements.modeIndicator.textContent = modeText;
            this.elements.modeIndicator.className = 'mode-indicator ' +
                (scenario.mode === 'change' ? 'mode-change' :
                 scenario.mode === 'clustering' ? 'mode-clustering' : 'mode-embeddings');
        }
    },

    /**
     * Hide detail and show list
     */
    hideDetail() {
        this.currentScenario = null;
        this.elements.scenarioList.style.display = 'block';
        this.elements.scenarioDetail.style.display = 'none';
    },

    /**
     * Explore the current scenario
     */
    async exploreScenario() {
        if (!this.currentScenario) return;

        const scenario = this.currentScenario;

        // Show loading
        UIControls.showLoading(true);

        try {
            // Fly to location
            App.flyTo(scenario.lon, scenario.lat, scenario.zoom);

            // Wait for fly animation
            await new Promise(resolve => setTimeout(resolve, 2500));

            // Update UI controls to match scenario
            if (UIControls.elements.yearSlider) {
                UIControls.elements.yearSlider.value = scenario.year1;
                UIControls.elements.yearValue.textContent = scenario.year1;
            }

            if (UIControls.elements.bandRed) {
                UIControls.elements.bandRed.value = scenario.bands[0];
                UIControls.elements.bandGreen.value = scenario.bands[1];
                UIControls.elements.bandBlue.value = scenario.bands[2];
            }

            UIControls.updateLayerName();

            // Load appropriate visualization
            if (scenario.mode === 'change') {
                await App.addChangeDetectionLayer(scenario.year1, scenario.year2);
            } else if (scenario.mode === 'clustering') {
                await App.addClusteringLayer(scenario.year1, scenario.bands);
            } else {
                // Standard embeddings
                const params = UIControls.getParams();
                params.year = scenario.year1;
                params.bands = scenario.bands;
                await App.loadEmbeddings(params);
            }

            // Update layer name
            const layerName = `${scenario.name} (${scenario.year1}${scenario.mode === 'change' ? '-' + scenario.year2 : ''})`;
            UIControls.elements.layerName.value = layerName;
            UIControls.elements.embeddingsLayerName.textContent = layerName;

            // Display the explainer for this scenario
            this.displayExplainer(scenario);

        } catch (error) {
            console.error('Error exploring scenario:', error);
            alert('Error loading scenario: ' + error.message);
        } finally {
            UIControls.showLoading(false);
        }
    },

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Panel toggle
        if (this.elements.toggle) {
            this.elements.toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.elements.content.classList.toggle('collapsed');
                this.elements.toggle.classList.toggle('collapsed');
            });
        }

        // Category filter
        if (this.elements.categoryFilter) {
            this.elements.categoryFilter.addEventListener('change', (e) => {
                this.currentCategory = e.target.value;
                this.renderScenarios();
            });
        }

        // Search input
        if (this.elements.searchInput) {
            this.elements.searchInput.addEventListener('input', () => {
                this.renderScenarios();
            });
        }

        // Scenario item clicks
        if (this.elements.scenarioList) {
            this.elements.scenarioList.addEventListener('click', (e) => {
                const item = e.target.closest('.scenario-item');
                if (item) {
                    const id = parseInt(item.dataset.id);
                    this.showDetail(id);
                }
            });
        }

        // Back button
        if (this.elements.btnBack) {
            this.elements.btnBack.addEventListener('click', () => {
                this.hideDetail();
            });
        }

        // Explore button
        if (this.elements.btnExplore) {
            this.elements.btnExplore.addEventListener('click', () => {
                this.exploreScenario();
            });
        }
    },

    /**
     * Toggle panel visibility
     */
    togglePanel() {
        if (this.elements.content) {
            this.elements.content.classList.toggle('collapsed');
        }
        if (this.elements.toggle) {
            this.elements.toggle.classList.toggle('collapsed');
        }
    },

    /**
     * Show explainer box with current scenario's explanation
     */
    showExplainer() {
        if (!this.currentScenario || !this.currentScenario.explainer) return;

        if (this.elements.explainerText) {
            this.elements.explainerText.textContent = this.currentScenario.explainer;
        }
        if (this.elements.explainerBox) {
            this.elements.explainerBox.classList.remove('hidden');
        }
        if (this.elements.showExplainerBtn) {
            this.elements.showExplainerBtn.classList.add('hidden');
        }
    },

    /**
     * Hide explainer box and show the button
     */
    hideExplainer() {
        if (this.elements.explainerBox) {
            this.elements.explainerBox.classList.add('hidden');
        }
        if (this.elements.showExplainerBtn && this.currentScenario && this.currentScenario.explainer) {
            this.elements.showExplainerBtn.classList.remove('hidden');
        }
    },

    /**
     * Display explainer when a scenario is explored
     * @param {Object} scenario - The scenario being explored
     */
    displayExplainer(scenario) {
        if (!scenario || !scenario.explainer) {
            // Hide both if no explainer
            if (this.elements.explainerBox) {
                this.elements.explainerBox.classList.add('hidden');
            }
            if (this.elements.showExplainerBtn) {
                this.elements.showExplainerBtn.classList.add('hidden');
            }
            return;
        }

        // Set the text and show the explainer box
        if (this.elements.explainerText) {
            this.elements.explainerText.textContent = scenario.explainer;
        }
        if (this.elements.explainerBox) {
            this.elements.explainerBox.classList.remove('hidden');
        }
        if (this.elements.showExplainerBtn) {
            this.elements.showExplainerBtn.classList.add('hidden');
        }
    }
};

// Export
window.CaseStudiesUI = CaseStudiesUI;
