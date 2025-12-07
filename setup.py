"""Setup script for alphaearth-viz package."""

from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

with open("requirements.txt", "r", encoding="utf-8") as fh:
    requirements = [line.strip() for line in fh if line.strip() and not line.startswith("#")]

setup(
    name="alphaearth-viz",
    version="0.1.0",
    author="EdGeoInnovations",
    author_email="",
    description="Visualization tools for AlphaEarth satellite embeddings",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/edgeoinnovations-resources/AlphaEarth",
    project_urls={
        "Bug Tracker": "https://github.com/edgeoinnovations-resources/AlphaEarth/issues",
    },
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Science/Research",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Topic :: Scientific/Engineering :: GIS",
    ],
    package_dir={"": "src"},
    packages=find_packages(where="src"),
    python_requires=">=3.8",
    install_requires=requirements,
)
