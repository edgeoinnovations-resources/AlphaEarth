"""
Compare AlphaEarth Embeddings Between Years

This script demonstrates how to compare AlphaEarth satellite embeddings
from different years at a specific location.

Usage:
    python compare_years.py

The output will be saved as an HTML file that can be opened in any browser.

The AlphaEarth Foundations Satellite Embedding dataset is produced by
Google and Google DeepMind.
"""

import ee
import leafmap.maplibregl as leafmap


# Configuration - Modify these values for your analysis
LOCATION = {
    "name": "San Francisco Bay Area",
    "lon": -122.4,
    "lat": 37.8,
}
YEAR1 = 2017
YEAR2 = 2024
ZOOM = 12
BANDS = ["A01", "A16", "A09"]  # RGB band combination


def main():
    """Compare AlphaEarth embeddings from two different years."""

    # Initialize Earth Engine
    # Uncomment and configure these lines before running:
    # ee.Authenticate()
    # ee.Initialize(project="YOUR_PROJECT_ID")

    print(f"Comparing AlphaEarth embeddings at {LOCATION['name']}")
    print(f"Years: {YEAR1} vs {YEAR2}")

    # Create map centered on location
    m = leafmap.Map(
        center=[LOCATION["lat"], LOCATION["lon"]],
        zoom=ZOOM,
    )

    # Add basemap
    m.add_basemap("USGS.Imagery")

    # Get AlphaEarth dataset
    dataset = ee.ImageCollection("GOOGLE/SATELLITE_EMBEDDING/V1/ANNUAL")

    # Load embeddings for both years
    image1 = dataset.filter(ee.Filter.eq("year", YEAR1)).first()
    image2 = dataset.filter(ee.Filter.eq("year", YEAR2)).first()

    # Visualization parameters
    vis_params = {
        "bands": BANDS,
        "min": -0.3,
        "max": 0.3,
    }

    # Add layers for both years
    m.add_ee_layer(image1, vis_params, f"AlphaEarth {YEAR1}")
    m.add_ee_layer(image2, vis_params, f"AlphaEarth {YEAR2}")

    # Add layer control to toggle between years
    m.add_layer_control()

    # Save to HTML
    output_file = f"compare_{YEAR1}_vs_{YEAR2}.html"
    m.to_html(output_file)

    print(f"Map saved to {output_file}")
    print("Open the HTML file in a web browser to compare the years.")
    print("Use the layer control to toggle between years.")

    return m


if __name__ == "__main__":
    main()
