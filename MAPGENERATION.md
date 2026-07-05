# Map Generation Guide

To ensure high-quality, geographically accurate territory maps for CSR reference cards, we generate maps programmatically using Python and official State of Maine GIS data.

This prevents the loss of coastal details (like islands) and ensures that all town sizes, borders, and spatial relationships are mathematically precise.

## Prerequisites

To generate or edit a map, you will need Python installed on your machine along with a few data science libraries.

Run the following command in your terminal to install the dependencies:

```bash
pip install geopandas matplotlib shapely
```

## Obtaining the Data

We use the official Maine Town and Townships Boundary Polygons shapefile.

1. Visit the Maine GeoLibrary Data Catalog.
2. Download the dataset as a Shapefile (.zip).
3. Extract the contents into your working directory alongside `des_map_generator.py`. The script requires the `.shp`, `.shx`, and `.dbf` files to run.

## How the Script Works

`des_map_generator.py` operates in a few distinct phases:

### 1. Configuration and Zoning

You define a dictionary of `ZONE_COLORS` (using hex codes) and a `zones` dictionary that maps explicit town names to specific zones. Any towns you want to display for context (but aren't in a delivery zone) can be assigned to a `Border` or background category.

### 2. Two-Pass Rendering Concept (Crucial for Coastlines)

Maine's shapefile draws separate polygons for every single coastal island. If you try to label the raw data, the script will put a label on every single island, creating an unreadable mess.

To solve this, the script uses a two-pass approach:

- The Drawing Pass: it plots the raw, unaltered map data. This ensures the jagged coastlines, peninsulas, and disconnected islands (like Beals) render beautifully and accurately.
- The Labeling Pass: behind the scenes, the script uses the `dissolve()` function to mathematically merge all islands and mainland pieces of a town into a single shape. It then calculates the center of that unified shape to place exactly one clean label per town.

### 3. Data Cleanup

Government shapefiles often contain hidden whitespace. The script includes a cleanup step (`gdf['TOWN'].str.strip()`) to remove trailing spaces. It also includes a missing town detector that will warn you in the terminal if you've misspelled a town or if it's named differently in the shapefile (for example, `Indian Twp Res` versus `Indian Township`).

## Adding a New Branch

If you need to create a map for a completely new branch (e.g., Ellsworth or Bangor):

1. Duplicate `des_map_generator.py`.
2. Update the `zones` dictionary with the towns covered by that specific branch, categorized into whatever delivery zones make sense for that territory.
3. Update the `Border` list to include a ring of surrounding towns to provide geographic context.
4. Adjust `figsize` in the script if the territory is significantly wider or taller than the previous map.
5. Run the script and output the SVG into the `shared/maps/` directory.
