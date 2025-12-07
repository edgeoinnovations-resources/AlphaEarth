# AlphaEarth Satellite Embeddings Visualization

[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Python toolkit for visualizing Google DeepMind's AlphaEarth satellite embeddings using LeafMap and Google Earth Engine.

## About AlphaEarth

AlphaEarth is Google DeepMind's foundation model for satellite imagery that produces rich semantic embeddings from Sentinel-2 imagery. Key features:

- **64 embedding bands** capturing semantic features of Earth's surface
- **10m spatial resolution** for detailed analysis
- **Annual composites from 2017-2024** enabling change detection
- **Global coverage** for worldwide analysis

## Features

- **3D Globe Visualization**: Interactive 3D globe with AlphaEarth GUI controls
- **Change Detection**: Calculate similarity between years using dot product analysis
- **Band Exploration**: Visualize custom combinations of the 64 embedding bands
- **Year Comparison**: Side-by-side comparison of any two years (2017-2024)

## Installation

```bash
# Clone the repository
git clone https://github.com/edgeoinnovations-resources/AlphaEarth.git
cd AlphaEarth

# Install dependencies
pip install -r requirements.txt
```

## Prerequisites

### Google Earth Engine Account

You need a Google Earth Engine account to access the AlphaEarth dataset:

1. Sign up at [Google Earth Engine](https://earthengine.google.com/)
2. Create a Google Cloud project with Earth Engine API enabled
3. Authenticate using `ee.Authenticate()` in Python

## Quick Start

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

## Usage Examples

### Basic Globe with Interactive GUI

```python
from alphaearth_viz import create_globe_map, add_alphaearth_gui

m = create_globe_map()
add_alphaearth_gui(m)
m
```

### Compare Two Years

```python
from alphaearth_viz import compare_years

# Compare 2017 and 2024 at a specific location
m = compare_years(lon=-122.4, lat=37.8, year1=2017, year2=2024)
m
```

### Change Detection Analysis

```python
from alphaearth_viz import analyze_location

# Full analysis with change detection
m = analyze_location(lon=-122.4, lat=37.8, year1=2017, year2=2024)
m
```

### Explore Custom Band Combinations

```python
from alphaearth_viz import explore_bands

# Visualize bands 1, 16, and 9 as RGB
m = explore_bands(lon=-122.4, lat=37.8, year=2024, band_combo=[1, 16, 9])
m
```

## Project Structure

```
AlphaEarth/
├── README.md
├── requirements.txt
├── setup.py
├── .gitignore
├── LICENSE
├── notebooks/
│   ├── 01_quickstart.ipynb
│   ├── 02_change_detection.ipynb
│   └── 03_advanced_analysis.ipynb
├── src/
│   └── alphaearth_viz/
│       ├── __init__.py
│       ├── core.py
│       └── utils.py
└── examples/
    ├── basic_globe.py
    ├── compare_years.py
    └── change_detection.py
```

## Screenshots

*Coming soon: Interactive globe visualization and change detection examples*

## Official Resources

- **News Release**: [AlphaEarth Foundations helps map our planet in unprecedented detail](https://deepmind.google/blog/alphaearth-foundations-helps-map-our-planet-in-unprecedented-detail/)
- **Dataset Catalog**: [Google Satellite Embedding V1 Annual](https://developers.google.com/earth-engine/datasets/catalog/GOOGLE_SATELLITE_EMBEDDING_V1_ANNUAL)
- **Research Paper**: [arXiv:2507.22291](https://arxiv.org/abs/2507.22291)
- **Tutorials**: [Satellite Embedding Introduction](https://developers.google.com/earth-engine/tutorials/community/satellite-embedding-01-introduction)
- **LeafMap Documentation**: [LeafMap AlphaEarth](https://leafmap.org/maplibre/AlphaEarth/)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Attribution

The AlphaEarth Foundations Satellite Embedding dataset is produced by Google and Google DeepMind.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue on the [GitHub repository](https://github.com/edgeoinnovations-resources/AlphaEarth/issues).
