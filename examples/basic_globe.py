"""
Basic AlphaEarth Globe Visualization

This script demonstrates how to create an interactive 3D globe
with the AlphaEarth satellite embeddings GUI.

Usage:
    python basic_globe.py

The output will be saved as an HTML file that can be opened in any browser.

The AlphaEarth Foundations Satellite Embedding dataset is produced by
Google and Google DeepMind.
"""

import ee
import leafmap.maplibregl as leafmap


def main():
    """Create and save a basic AlphaEarth globe visualization."""

    # Authenticate with Earth Engine (run once, follow browser prompts)
    # ee.Authenticate()

    # Initialize Earth Engine with your project ID
    # Replace 'YOUR_PROJECT_ID' with your actual Google Cloud project ID
    # ee.Initialize(project="YOUR_PROJECT_ID")

    print("Creating AlphaEarth globe visualization...")

    # Create interactive 3D globe with sidebar controls
    m = leafmap.Map(projection="globe", sidebar_visible=True)

    # Add USGS satellite imagery as the basemap
    m.add_basemap("USGS.Imagery")

    # Add the AlphaEarth interactive GUI panel
    # This adds controls for:
    # - Year selection (2017-2024)
    # - Band combination selection
    # - Visualization adjustments
    m.add_alphaearth_gui()

    # Save to HTML file
    output_file = "alphaearth_globe.html"
    m.to_html(output_file)
    print(f"Map saved to {output_file}")
    print("Open the HTML file in a web browser to view the interactive globe.")

    return m


if __name__ == "__main__":
    main()
