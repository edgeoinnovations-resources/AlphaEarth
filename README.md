# AlphaEarth Satellite Embeddings Visualization

[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Pages](https://img.shields.io/badge/demo-GitHub%20Pages-blue)](https://edgeoinnovations-resources.github.io/AlphaEarth/)

Interactive visualization tools for Google DeepMind's AlphaEarth satellite embeddings using LeafMap, MapLibre GL JS, and Google Earth Engine.

## Live Demo

**Try it now:** [https://edgeoinnovations-resources.github.io/AlphaEarth/](https://edgeoinnovations-resources.github.io/AlphaEarth/)

## About AlphaEarth

AlphaEarth is Google DeepMind's foundation model for satellite imagery that produces rich semantic embeddings from Sentinel-2 imagery. Key features:

- **64 embedding bands** capturing semantic features of Earth's surface
- **10m spatial resolution** for detailed analysis
- **Annual composites from 2017-2024** enabling change detection
- **Global coverage** for worldwide analysis

## Features

- **3D Globe Visualization**: Interactive 3D globe with full rotation, zoom, and tilt
- **Year Selection**: View embeddings from any year between 2017-2024
- **Band Combinations**: Choose any 3 of 64 embedding bands for RGB visualization
- **Terrain Exaggeration**: Adjust 3D terrain height for topographic analysis
- **Change Detection**: Calculate similarity between years using dot product analysis
- **Layer Controls**: Toggle layers and adjust opacity

## Web Visualization

The web-based viewer runs entirely in your browser and connects directly to Google Earth Engine.

### Quick Start (Web)

1. Visit [the live demo](https://edgeoinnovations-resources.github.io/AlphaEarth/)
2. Click "Authenticate with Google"
3. Log in with a Google account that has Earth Engine access
4. Use the control panel to adjust visualization settings
5. Click "Apply" to load embeddings

### Local Development

```bash
# Clone the repository
git clone https://github.com/edgeoinnovations-resources/AlphaEarth.git
cd AlphaEarth

# Serve locally (Python 3)
python -m http.server 8000

# Open in browser
open http://localhost:8000
```

## Python Toolkit

For programmatic access and Jupyter notebook integration, use the Python toolkit.

### Installation

```bash
# Clone the repository
git clone https://github.com/edgeoinnovations-resources/AlphaEarth.git
cd AlphaEarth

# Install dependencies
pip install -r requirements.txt
```

### Quick Start (Python)

```python
import ee
import leafmap.maplibregl as leafmap

# Authenticate (run once)
ee.Authenticate()
ee.Initialize(project="YOUR_PROJECT_ID")

# Create interactive 3D globe with AlphaEarth GUI
m = leafmap.Map(projection="globe", sidebar_visible=True)
m.add_basemap("USGS.Imagery")
m.add_alphaearth_gui()
m
```

### Python Examples

#### Compare Two Years

```python
from alphaearth_viz import compare_years

# Compare 2017 and 2024 at a specific location
m = compare_years(lon=-122.4, lat=37.8, year1=2017, year2=2024)
m
```

#### Change Detection Analysis

```python
from alphaearth_viz import analyze_location

# Full analysis with change detection
m = analyze_location(lon=-122.4, lat=37.8, year1=2017, year2=2024)
m
```

#### Explore Custom Band Combinations

```python
from alphaearth_viz import explore_bands

# Visualize bands 1, 16, and 9 as RGB
m = explore_bands(lon=-122.4, lat=37.8, year=2024, band_combo=[1, 16, 9])
m
```

## Prerequisites

### Google Earth Engine Account

You need a Google Earth Engine account to access the AlphaEarth dataset:

1. Sign up at [Google Earth Engine](https://earthengine.google.com/)
2. Create a Google Cloud project with Earth Engine API enabled
3. For Python: Authenticate using `ee.Authenticate()`
4. For Web: Allow popups and authenticate via the browser

## Project Structure

```
AlphaEarth/
├── index.html              # Web visualization entry point
├── css/
│   └── style.css           # UI styles
├── js/
│   ├── app.js              # Main application
│   ├── earth-engine.js     # Earth Engine integration
│   └── ui-controls.js      # Control panel
├── notebooks/
│   ├── 01_quickstart.ipynb
│   ├── 02_change_detection.ipynb
│   └── 03_advanced_analysis.ipynb
├── src/
│   └── alphaearth_viz/
│       ├── __init__.py
│       ├── core.py
│       └── utils.py
├── examples/
│   ├── basic_globe.py
│   ├── compare_years.py
│   └── change_detection.py
├── requirements.txt
├── setup.py
├── LICENSE
└── README.md
```

## Official Resources

- **News Release**: [AlphaEarth Foundations helps map our planet in unprecedented detail](https://deepmind.google/blog/alphaearth-foundations-helps-map-our-planet-in-unprecedented-detail/)
- **Dataset Catalog**: [Google Satellite Embedding V1 Annual](https://developers.google.com/earth-engine/datasets/catalog/GOOGLE_SATELLITE_EMBEDDING_V1_ANNUAL)
- **Research Paper**: [arXiv:2507.22291](https://arxiv.org/abs/2507.22291)
- **Tutorials**: [Satellite Embedding Introduction](https://developers.google.com/earth-engine/tutorials/community/satellite-embedding-01-introduction)
- **LeafMap Documentation**: [LeafMap AlphaEarth](https://leafmap.org/maplibre/AlphaEarth/)

## Built With

- [MapLibre GL JS](https://maplibre.org/) - 3D map rendering for web
- [Google Earth Engine](https://earthengine.google.com/) - Satellite data platform
- [LeafMap](https://leafmap.org/) - Python geospatial visualization
- [geemap](https://geemap.org/) - Earth Engine Python API

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Attribution

The AlphaEarth Foundations Satellite Embedding dataset is produced by Google and Google DeepMind.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue on the [GitHub repository](https://github.com/edgeoinnovations-resources/AlphaEarth/issues).

---

**Created by [EdGeoInnovations](https://github.com/edgeoinnovations-resources)**
