"""
Utility functions for AlphaEarth visualization.

This module provides helper functions for working with AlphaEarth satellite
embeddings, including band formatting, visualization parameters, and validation.

The AlphaEarth Foundations Satellite Embedding dataset is produced by
Google and Google DeepMind.
"""

from typing import Dict, List, Any

import ee


# AlphaEarth dataset constants
ALPHAEARTH_DATASET_ID = "GOOGLE/SATELLITE_EMBEDDING/V1/ANNUAL"
MIN_YEAR = 2017
MAX_YEAR = 2024
NUM_BANDS = 64


def format_band_names(band_numbers: List[int]) -> List[str]:
    """
    Convert band numbers to AlphaEarth band name format.

    Args:
        band_numbers: List of band numbers (1-64).

    Returns:
        List of formatted band names (e.g., ["A01", "A16", "A09"]).

    Raises:
        ValueError: If any band number is not between 1 and 64.

    Example:
        >>> format_band_names([1, 16, 9])
        ['A01', 'A16', 'A09']
    """
    result = []
    for num in band_numbers:
        if not 1 <= num <= NUM_BANDS:
            raise ValueError(f"Band number {num} must be between 1 and {NUM_BANDS}")
        result.append(f"A{str(num).zfill(2)}")
    return result


def get_vis_params(
    bands: List[str],
    min_val: float = -0.3,
    max_val: float = 0.3,
) -> Dict[str, Any]:
    """
    Get visualization parameters for AlphaEarth embeddings.

    Args:
        bands: List of band names (e.g., ["A01", "A16", "A09"]).
        min_val: Minimum value for visualization. Defaults to -0.3.
        max_val: Maximum value for visualization. Defaults to 0.3.

    Returns:
        Dictionary of visualization parameters for Earth Engine.

    Example:
        >>> get_vis_params(["A01", "A16", "A09"])
        {'bands': ['A01', 'A16', 'A09'], 'min': -0.3, 'max': 0.3}
    """
    return {
        "bands": bands,
        "min": min_val,
        "max": max_val,
    }


def get_similarity_vis(
    palette: List[str] = None,
) -> Dict[str, Any]:
    """
    Get visualization parameters for change detection similarity layer.

    The similarity layer shows:
    - White (1.0): High similarity / stable areas
    - Black (0.0): Low similarity / changed areas

    Args:
        palette: Color palette for visualization. Defaults to ["white", "black"].

    Returns:
        Dictionary of visualization parameters for Earth Engine.

    Example:
        >>> get_similarity_vis()
        {'min': 0, 'max': 1, 'palette': ['white', 'black']}
    """
    if palette is None:
        palette = ["white", "black"]

    return {
        "min": 0,
        "max": 1,
        "palette": palette,
    }


def validate_year(year: int) -> None:
    """
    Validate that a year is within the AlphaEarth dataset range.

    Args:
        year: Year to validate.

    Raises:
        ValueError: If year is not between 2017 and 2024.

    Example:
        >>> validate_year(2020)  # No error
        >>> validate_year(2015)  # Raises ValueError
    """
    if not MIN_YEAR <= year <= MAX_YEAR:
        raise ValueError(
            f"Year {year} is not valid. AlphaEarth data is available from "
            f"{MIN_YEAR} to {MAX_YEAR}."
        )


def get_dataset() -> ee.ImageCollection:
    """
    Get the AlphaEarth ImageCollection from Earth Engine.

    Returns:
        The AlphaEarth annual satellite embedding ImageCollection.

    Example:
        >>> dataset = get_dataset()
        >>> print(dataset.size().getInfo())  # Number of images in collection
    """
    return ee.ImageCollection(ALPHAEARTH_DATASET_ID)


def get_all_band_names() -> List[str]:
    """
    Get all 64 AlphaEarth band names.

    Returns:
        List of all band names from A01 to A64.

    Example:
        >>> bands = get_all_band_names()
        >>> len(bands)
        64
    """
    return [f"A{str(i).zfill(2)}" for i in range(1, NUM_BANDS + 1)]


def get_available_years() -> List[int]:
    """
    Get list of years with available AlphaEarth data.

    Returns:
        List of years from 2017 to 2024.

    Example:
        >>> get_available_years()
        [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024]
    """
    return list(range(MIN_YEAR, MAX_YEAR + 1))
