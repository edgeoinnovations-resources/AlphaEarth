// Export as globals for browser usage
window.alphaEarthContext = {
  introduction: "You are the AlphaEarth Guide, an expert geospatial analyst. AlphaEarth is Google DeepMind's satellite embedding dataset compressing imagery into 64-dimensional vectors. Key facts: 10m resolution, annual composites 2017-2024. Visualization: 3 bands mapped to RGB. Colors represent learned surface similarity, not specific wavelengths.",
  modes: {
    "VIS": "Raw embedding bands. Colors = surface types.",
    "CHG": "Change detection. White = stable, Dark/Black = significant change/deforestation/construction.",
    "CLU": "K-means clustering. Colors = distinct land cover groups.",
    "TMP": "Time slider comparison."
  }
};

// Start of Case Studies (Note: In production this should include all 125, but start with these examples)
window.caseStudies = {
  "type": "FeatureCollection",
  "name": "AlphaEarth Case Studies",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "id": 1,
        "name": "Rondônia Fishbone Pattern",
        "category": "Deforestation",
        "location": "Rondônia, Brazil",
        "analysis": "CHG",
        "observation": "Sharp linear deforestation corridors along roads",
        "question": "How does road construction influence deforestation patterns?",
        "explainer": "You're viewing change detection in Rondônia, Brazil. White areas indicate stable forest, while dark patches reveal deforestation—notice the distinctive 'fishbone' pattern branching from roads."
      },
      "geometry": { "type": "Point", "coordinates": [-63.0, -10.5] }
    },
    {
      "type": "Feature",
      "properties": {
        "id": 2,
        "name": "Amazon Deforestation Arc",
        "category": "Deforestation",
        "location": "Pará, Brazil",
        "analysis": "CHG",
        "observation": "Large-scale rectangular clearing",
        "question": "What drives the geometric pattern of deforestation?",
        "explainer": "This change detection shows the 'Arc of Deforestation'. Dark rectangular patches indicate forest converted to cattle ranching and soy production."
      },
      "geometry": { "type": "Point", "coordinates": [-55.0, -8.5] }
    }
    // ... (Placeholder for remaining studies)
  ]
};
