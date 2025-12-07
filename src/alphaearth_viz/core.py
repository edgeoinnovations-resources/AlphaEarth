"""
Core visualization functions for AlphaEarth satellite embeddings.

This module provides functions for creating interactive maps and visualizations
of Google DeepMind's AlphaEarth satellite embedding dataset.

The AlphaEarth Foundations Satellite Embedding dataset is produced by
Google and Google DeepMind.
"""

from typing import List, Optional, Tuple

import ee
import leafmap.maplibregl as leafmap

from .utils import (
    format_band_names,
    get_vis_params,
    get_similarity_vis,
    validate_year,
    get_dataset,
)


def create_globe_map(sidebar_visible: bool = True) -> leafmap.Map:
    """
    Create a basic 3D globe map with USGS imagery basemap.

    Args:
        sidebar_visible: Whether to show the sidebar controls. Defaults to True.

    Returns:
        A leafmap Map object configured as a 3D globe.

    Example:
        >>> m = create_globe_map()
        >>> m
    """
    m = leafmap.Map(projection="globe", sidebar_visible=sidebar_visible)
    m.add_basemap("USGS.Imagery")
    return m


def add_alphaearth_gui(map_object: leafmap.Map) -> None:
    """
    Add the AlphaEarth interactive GUI panel to a map.

    The GUI provides controls for:
    - Selecting year (2017-2024)
    - Choosing band combinations
    - Adjusting visualization parameters

    Args:
        map_object: A leafmap Map object to add the GUI to.

    Example:
        >>> m = create_globe_map()
        >>> add_alphaearth_gui(m)
        >>> m
    """
    map_object.add_alphaearth_gui()


def load_embeddings(lon: float, lat: float, year: int) -> ee.Image:
    """
    Load AlphaEarth embeddings for a specific location and year.

    Args:
        lon: Longitude of the location (degrees, -180 to 180).
        lat: Latitude of the location (degrees, -90 to 90).
        year: Year to load embeddings for (2017-2024).

    Returns:
        An ee.Image object containing the 64-band embeddings.

    Raises:
        ValueError: If year is not between 2017 and 2024.

    Example:
        >>> image = load_embeddings(lon=-122.4, lat=37.8, year=2024)
    """
    validate_year(year)

    dataset = get_dataset()
    image = dataset.filter(ee.Filter.eq("year", year)).first()

    return image


def compare_years(
    lon: float,
    lat: float,
    year1: int,
    year2: int,
    bands: Optional[List[str]] = None,
    zoom: int = 12,
) -> leafmap.Map:
    """
    Create a map comparing AlphaEarth embeddings from two years.

    Args:
        lon: Longitude of the center location (degrees).
        lat: Latitude of the center location (degrees).
        year1: First year to compare (2017-2024).
        year2: Second year to compare (2017-2024).
        bands: List of band names to visualize (e.g., ["A01", "A16", "A09"]).
               Defaults to ["A01", "A16", "A09"].
        zoom: Initial zoom level. Defaults to 12.

    Returns:
        A leafmap Map object with both years as layers.

    Example:
        >>> m = compare_years(lon=-122.4, lat=37.8, year1=2017, year2=2024)
        >>> m
    """
    validate_year(year1)
    validate_year(year2)

    if bands is None:
        bands = ["A01", "A16", "A09"]

    # Create map centered on location
    m = leafmap.Map(center=[lat, lon], zoom=zoom)
    m.add_basemap("USGS.Imagery")

    # Load images for both years
    dataset = get_dataset()
    image1 = dataset.filter(ee.Filter.eq("year", year1)).first()
    image2 = dataset.filter(ee.Filter.eq("year", year2)).first()

    # Visualization parameters
    vis_params = get_vis_params(bands)

    # Add layers
    m.add_ee_layer(image1, vis_params, f"AlphaEarth {year1}")
    m.add_ee_layer(image2, vis_params, f"AlphaEarth {year2}")

    m.add_layer_control()

    return m


def calculate_change(image1: ee.Image, image2: ee.Image) -> ee.Image:
    """
    Calculate similarity/change between two embedding images using dot product.

    The dot product measures similarity between embeddings:
    - Values closer to 1 indicate high similarity (stable areas)
    - Values closer to 0 indicate low similarity (changed areas)

    Args:
        image1: First ee.Image with AlphaEarth embeddings.
        image2: Second ee.Image with AlphaEarth embeddings.

    Returns:
        An ee.Image with similarity values (0-1, higher = more similar).

    Example:
        >>> img1 = load_embeddings(-122.4, 37.8, 2017)
        >>> img2 = load_embeddings(-122.4, 37.8, 2024)
        >>> change = calculate_change(img1, img2)
    """
    # Get all band names (A01-A64)
    band_names = [f"A{str(i).zfill(2)}" for i in range(1, 65)]

    # Select embedding bands
    emb1 = image1.select(band_names)
    emb2 = image2.select(band_names)

    # Calculate dot product (sum of element-wise multiplication)
    dot_product = emb1.multiply(emb2).reduce(ee.Reducer.sum())

    # Normalize to 0-1 range (embeddings are typically normalized)
    # Clamp to handle any edge cases
    similarity = dot_product.clamp(0, 1)

    return similarity.rename("similarity")


def analyze_location(
    lon: float,
    lat: float,
    year1: int = 2017,
    year2: int = 2024,
    zoom: int = 12,
) -> leafmap.Map:
    """
    Perform full analysis with embeddings and change detection for a location.

    Creates a map with:
    - AlphaEarth embeddings for year1
    - AlphaEarth embeddings for year2
    - Change detection layer (white = stable, black = changed)

    Args:
        lon: Longitude of the center location (degrees).
        lat: Latitude of the center location (degrees).
        year1: First year for comparison. Defaults to 2017.
        year2: Second year for comparison. Defaults to 2024.
        zoom: Initial zoom level. Defaults to 12.

    Returns:
        A leafmap Map object with embeddings and change detection layers.

    Example:
        >>> m = analyze_location(lon=-122.4, lat=37.8, year1=2017, year2=2024)
        >>> m
    """
    validate_year(year1)
    validate_year(year2)

    # Create map centered on location
    m = leafmap.Map(center=[lat, lon], zoom=zoom)
    m.add_basemap("USGS.Imagery")

    # Load images for both years
    dataset = get_dataset()
    image1 = dataset.filter(ee.Filter.eq("year", year1)).first()
    image2 = dataset.filter(ee.Filter.eq("year", year2)).first()

    # Default band visualization
    bands = ["A01", "A16", "A09"]
    vis_params = get_vis_params(bands)

    # Add embedding layers
    m.add_ee_layer(image1, vis_params, f"AlphaEarth {year1}")
    m.add_ee_layer(image2, vis_params, f"AlphaEarth {year2}")

    # Calculate and add change detection layer
    change = calculate_change(image1, image2)
    change_vis = get_similarity_vis()
    m.add_ee_layer(change, change_vis, "Change Detection")

    m.add_layer_control()

    return m


def explore_bands(
    lon: float,
    lat: float,
    year: int = 2024,
    band_combo: Optional[List[int]] = None,
    zoom: int = 12,
) -> leafmap.Map:
    """
    Visualize custom band combinations from AlphaEarth embeddings.

    The 64 embedding bands capture different semantic features of the Earth's
    surface. Different combinations can highlight different aspects.

    Args:
        lon: Longitude of the center location (degrees).
        lat: Latitude of the center location (degrees).
        year: Year to visualize. Defaults to 2024.
        band_combo: List of 3 band numbers (1-64) to use as RGB.
                   Defaults to [1, 16, 9].
        zoom: Initial zoom level. Defaults to 12.

    Returns:
        A leafmap Map object with the custom band visualization.

    Example:
        >>> m = explore_bands(lon=-122.4, lat=37.8, year=2024, band_combo=[1, 16, 9])
        >>> m
    """
    validate_year(year)

    if band_combo is None:
        band_combo = [1, 16, 9]

    if len(band_combo) != 3:
        raise ValueError("band_combo must contain exactly 3 band numbers")

    for band in band_combo:
        if not 1 <= band <= 64:
            raise ValueError(f"Band number {band} must be between 1 and 64")

    # Create map centered on location
    m = leafmap.Map(center=[lat, lon], zoom=zoom)
    m.add_basemap("USGS.Imagery")

    # Load image
    dataset = get_dataset()
    image = dataset.filter(ee.Filter.eq("year", year)).first()

    # Format band names and create visualization
    bands = format_band_names(band_combo)
    vis_params = get_vis_params(bands)

    # Add layer
    band_str = ", ".join([str(b) for b in band_combo])
    m.add_ee_layer(image, vis_params, f"Bands [{band_str}]")

    m.add_layer_control()

    return m
