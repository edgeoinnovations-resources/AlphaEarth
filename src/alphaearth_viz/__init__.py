"""
AlphaEarth Visualization Toolkit

A Python toolkit for visualizing Google DeepMind's AlphaEarth satellite embeddings
using LeafMap and Google Earth Engine.

The AlphaEarth Foundations Satellite Embedding dataset is produced by
Google and Google DeepMind.
"""

from .core import (
    create_globe_map,
    add_alphaearth_gui,
    load_embeddings,
    compare_years,
    calculate_change,
    analyze_location,
    explore_bands,
)

from .utils import (
    format_band_names,
    get_vis_params,
    get_similarity_vis,
    validate_year,
    get_dataset,
)

__version__ = "0.1.0"
__author__ = "EdGeoInnovations"

__all__ = [
    "create_globe_map",
    "add_alphaearth_gui",
    "load_embeddings",
    "compare_years",
    "calculate_change",
    "analyze_location",
    "explore_bands",
    "format_band_names",
    "get_vis_params",
    "get_similarity_vis",
    "validate_year",
    "get_dataset",
]
