import geopandas as gpd
import matplotlib.pyplot as plt
import matplotlib.patheffects as pe

# --- 1. CONFIGURATION ---
SHAPEFILE_NAME = 'Maine_Town_and_Townships_Boundary_Polygons_Feature.shp'

ZONE_COLORS = {
    'Zone 1': '#1f77b4', 
    'Zone 2': '#2ca02c', 
    'Zone 3': '#ff7f0e', 
    'Zone 4': '#d62728', 
    'Zone 5': '#d7bde2', 
    'Border': '#ffffff'  # Changed to pure white to perfectly match the reference image background
}

zones = {
    'Zone 1': ['Whiting', 'Trescott Twp', 'Lubec'],
    'Zone 2': ['Edmunds Twp', 'Dennysville', 'Pembroke', 'Marion Twp'],
    'Zone 3': ['Perry', 'Pleasant Point', 'Eastport'],
    'Zone 4': ['Robbinston', 'Calais', 'Baring Plt', 'Meddybemps', 'Cooper', 
               'Alexander', 'Princeton', 'Baileyville', 'Cathance Twp', 'Charlotte'],
    'Zone 5': [
        'Big Lake Twp', 'Greenlaw Chopping Twp', 'T43 MD BPP', 'T42 MD BPP', 
        'T37 MD BPP', 'T36 MD BPP', 'T26 ED BPP', 'Crawford', 'Day Block Twp', 
        'T30 MD BPP', 'Wesley', 'T19 ED BPP', 'T25 MD BPP', 'T24 MD BPP', 
        'Northfield', 'Berry Twp', 'T19 MD BPP', 'T18 MD BPP', 'Centerville Twp', 
        'Columbia', 'Columbia Falls', 'Jonesboro', 'Machias', 'East Machias', 
        'Marshfield', 'Whitneyville', # Added missing towns
        'Roque Bluffs', 'Machiasport', 'Cutler', 'Addison', 'Jonesport', 'Beals',
        'Harrington', 'Milbridge', 'Steuben', 'Cherryfield', 'Beddington', 'Deblois'
    ],
    'Border': ['Talmadge', 'Waite', 'Fowler Twp', 'Grand Lake Stream Plt', 'Indian Twp Res']
}

# --- 2. LOAD & PREPARE DATA ---
print("Loading shapefile data...")
gdf = gpd.read_file(SHAPEFILE_NAME)

# Clean shapefile text (removes trailing spaces that often break matches)
gdf['TOWN'] = gdf['TOWN'].astype(str).str.strip()

all_display_towns = [town for town_list in zones.values() for town in town_list]

# Missing Town Detector
found_towns = set(gdf['TOWN'].values)
missing_towns = [t for t in all_display_towns if t not in found_towns]
if missing_towns:
    print("\n⚠️ WARNING: The following towns were NOT found in the shapefile:")
    for m in missing_towns:
        print(f"  - Missing: '{m}'")
        # Try to find close matches to help the user
        close_matches = gdf[gdf['TOWN'].str.contains(m.split()[0], case=False, na=False)]['TOWN'].unique()
        if len(close_matches) > 0:
            print(f"    Did you mean: {', '.join(close_matches)}?")
    print("\n")

# DO NOT dissolve the main map_gdf so all coastal boundaries and islands plot perfectly
map_gdf = gdf[gdf['TOWN'].isin(all_display_towns)].copy()

def get_zone(town_name):
    for zone, towns in zones.items():
        if town_name in towns:
            return zone
    return 'Border'

map_gdf['Zone'] = map_gdf['TOWN'].apply(get_zone)

# --- 3. PLOT THE MAP ---
print("Drawing the map...")
fig, ax = plt.subplots(1, 1, figsize=(16, 20))

fig.patch.set_facecolor('#ffffff')
ax.set_facecolor('#ffffff')
ax.axis('off') 

for zone_name, color in ZONE_COLORS.items():
    zone_gdf = map_gdf[map_gdf['Zone'] == zone_name]
    if not zone_gdf.empty:
        zone_gdf.plot(
            ax=ax, 
            color=color, 
            edgecolor='#333333', 
            linewidth=0.5
        )

# --- 4. ADD LABELS ---
print("Calculating label placements...")
# Dissolve ONLY for labels so we get exactly one label per town without destroying drawn coastlines
label_gdf = map_gdf.dissolve(by='TOWN', as_index=False)

for idx, row in label_gdf.iterrows():
    point = row.geometry.representative_point()
    town_name = row['TOWN']
    
    if town_name == 'Indian Twp Res':
        display_name = 'Indian Township'
    else:
        display_name = town_name.replace(' Twp', '').replace(' Plt', '').replace(' Res', '')
    
    if row['Zone'] == 'Border':
        text_color = '#333333' # Dark grey for the northern border towns
        font_weight = 'normal'
        font_size = 8
        outline = [] # No white outline for border towns to match reference image cleanly
    else:
        text_color = '#000000'
        font_weight = 'bold'
        font_size = 9
        outline = [pe.withStroke(linewidth=2, foreground='white')]

    ax.text(point.x, point.y, display_name, 
            horizontalalignment='center', 
            verticalalignment='center',
            fontsize=font_size, 
            fontweight=font_weight,
            color=text_color,
            path_effects=outline)

# --- 5. EXPORT ---
plt.tight_layout()

output_filename = 'Eastern_Washington_County_Zones_Final.svg'
plt.savefig(output_filename, format='svg', bbox_inches='tight', facecolor='#ffffff')
print(f"Successfully generated {output_filename}")