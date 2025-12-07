"""
AlphaEarth Change Detection Analysis

This script demonstrates how to perform change detection using
AlphaEarth satellite embeddings by calculating the dot product
similarity between two years.

The dot product measures semantic similarity:
- High similarity (white, ~1.0): Stable areas with little change
- Low similarity (black, ~0.0): Changed areas (urban development,
  deforestation, agricultural changes, etc.)

Usage:
    python change_detection.py

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


def calculate_similarity(image1: ee.Image, image2: ee.Image) -> ee.Image:
    """
    Calculate similarity between two AlphaEarth embedding images.

    Uses dot product to measure semantic similarity.

    Args:
        image1: First AlphaEarth embedding image.
        image2: Second AlphaEarth embedding image.

    Returns:
        ee.Image with similarity values (0-1).
    """
    # Get all 64 embedding band names
    band_names = [f"A{str(i).zfill(2)}" for i in range(1, 65)]

    # Select embedding bands from both images
    emb1 = image1.select(band_names)
    emb2 = image2.select(band_names)

    # Calculate dot product (element-wise multiply then sum)
    dot_product = emb1.multiply(emb2).reduce(ee.Reducer.sum())

    # Clamp to valid range
    similarity = dot_product.clamp(0, 1)

    return similarity.rename("similarity")


def main():
    """Perform change detection analysis using AlphaEarth embeddings."""

    # Initialize Earth Engine
    # Uncomment and configure these lines before running:
    # ee.Authenticate()
    # ee.Initialize(project="YOUR_PROJECT_ID")

    print(f"Performing change detection at {LOCATION['name']}")
    print(f"Comparing: {YEAR1} to {YEAR2}")

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

    # Visualization parameters for embeddings
    emb_vis = {
        "bands": ["A01", "A16", "A09"],
        "min": -0.3,
        "max": 0.3,
    }

    # Add embedding layers
    m.add_ee_layer(image1, emb_vis, f"Embeddings {YEAR1}")
    m.add_ee_layer(image2, emb_vis, f"Embeddings {YEAR2}")

    # Calculate change detection
    similarity = calculate_similarity(image1, image2)

    # Visualization for change detection
    # White = stable (high similarity), Black = changed (low similarity)
    change_vis = {
        "min": 0,
        "max": 1,
        "palette": ["white", "black"],
    }

    # Add change detection layer
    m.add_ee_layer(similarity, change_vis, "Change Detection")

    # Add layer control
    m.add_layer_control()

    # Save to HTML
    output_file = f"change_detection_{YEAR1}_to_{YEAR2}.html"
    m.to_html(output_file)

    print(f"Map saved to {output_file}")
    print("Open the HTML file to view the analysis.")
    print()
    print("Interpretation:")
    print("  - White areas: Stable (similar embeddings between years)")
    print("  - Black areas: Changed (different embeddings between years)")
    print()
    print("Look for changes in:")
    print("  - Urban development (new buildings, roads)")
    print("  - Agricultural changes (crop rotation, deforestation)")
    print("  - Environmental changes (water levels, vegetation)")

    return m


if __name__ == "__main__":
    main()
