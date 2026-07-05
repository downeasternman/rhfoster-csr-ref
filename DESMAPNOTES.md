# Dennysville Delivery Map Notes

This document outlines the specific configuration, geographic quirks, and territory rules used to generate the static delivery map (`Eastern_Washington_County_Zones_Final.svg`) for the Dennysville branch.

This map serves as a quick-reference centerpiece for CSRs to easily identify which delivery zone a customer falls into based on their town.

## Territory Configuration

The map is divided into four primary Dennysville delivery zones, plus a fifth contextual zone indicating the adjacent Machias delivery territory.

- Zone 1 (Blue, `#1f77b4`): Whiting, Trescott, Lubec
- Zone 2 (Green, `#2ca02c`): Edmunds, Dennysville, Pembroke, Marion
- Zone 3 (Orange, `#ff7f0e`): Perry, Pleasant Point, Eastport
- Zone 4 (Red, `#d62728`): Robbinston, Calais, Baring, Meddybemps, Cooper, Alexander, Princeton, Baileyville, Cathance, Charlotte
- Zone 5 (Pale Purple, `#d7bde2`): Machias Territory (Big Lake down to Columbia and across to Cutler, explicitly including Marshfield, Whitneyville, Beals, and Jonesport)

Context Towns: Talmadge, Waite, Fowler, Grand Lake Stream, and Indian Township are included as unassigned border towns to provide visual context at the northern edge of the map.

## GIS Data and Rendering Quirks

When regenerating or modifying this map using the Maine GeoLibrary shapefiles, several specific rendering quirks must be respected to maintain the visual quality:

### 1. Coastlines vs. Label Clutter (The Two-Pass Method)

The official Maine shapefile renders every single island off the coast as an independent polygon. If labels are applied directly to the raw data, the map becomes illegible with hundreds of duplicate labels.

The fix: the map must be drawn using a two-pass method. The background zones are plotted using the raw, un-dissolved data to preserve the beautiful, jagged coastlines and isolated islands (like Beals). The text labels are applied using a hidden dissolved dataframe that mathematically merges the islands into the mainland, ensuring exactly one centered label per town.

### 2. Ocean Bounds and Background Blending

Maine township boundaries technically extend straight out into the ocean and rivers to meet international and state borders. If the ocean is left transparent or colored blue, these blocky, unnatural water borders become visible.

The fix: both the canvas background (`facecolor`) and the unassigned context towns (`Border` zone) are set to pure white (`#ffffff`). This allows the unassigned towns and the ocean to visually merge, erasing the blocky water borders while allowing the colored delivery zones to clearly define the actual physical coastline.

### 3. Shapefile Text Cleaning

The government shapefile data contains hidden trailing whitespace in certain town names (specifically `Beals ` and `Jonesport `).

The fix: `des_map_generator.py` runs `.str.strip()` on the `TOWN` column before attempting to match the territory arrays, or those coastal towns will silently fail to render.

### 4. Label Overrides

`Indian Twp Res` is strictly overridden in the rendering loop to display as `Indian Township`.

Standard suffixes (` Twp`, ` Plt`, ` Res`) are stripped from all other towns to maximize legibility on the final CSR reference card.
