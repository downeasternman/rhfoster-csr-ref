# RH Foster CSR Reference

This project is a static browser-based CSR reference tool for R. H. Foster Energy. It helps customer service representatives triage service, delivery, and general customer questions across multiple branches using plain HTML, CSS, and JavaScript only. There is no framework, build step, package manager, server, database, tracking, or runtime API dependency.

## File Structure

```text
rhfoster-csr-ref/
├── index.html
├── shared/
│   ├── core.css
│   ├── core.js
│   ├── data-service.js
│   ├── data-delivery.js
│   ├── data-general.js
│   ├── branches.js
│   ├── maps/
│   └── vendor/
│       └── fuse.min.js
├── penobscot/
│   ├── index.html
│   └── overrides.js
├── lincoln/
│   ├── index.html
│   └── overrides.js
├── dennysville/
│   ├── index.html
│   └── overrides.js
├── machias/
│   ├── index.html
│   └── overrides.js
├── ellsworth/
│   ├── index.html
│   └── overrides.js
├── hampden/
│   ├── index.html
│   └── overrides.js
├── beals/
│   ├── index.html
│   └── overrides.js
├── CHANGELOG.md
├── MAPGENERATION.md
├── SEARCH.md
└── README.md
```

## Editing FAQ Content

Service FAQ content lives in `shared/data-service.js`. Delivery FAQ content lives in `shared/data-delivery.js`. General FAQ content lives in `shared/data-general.js`.

To edit an FAQ card, update the appropriate data file, review the changed card in a browser, commit the change, and push it to GitHub. Do not put logic in data files. Do not move cards between data files unless the department is changing and the related branch behavior has been reviewed.

## Search

Branch pages use Fuse.js fuzzy search with aliases, typo suggestions, department filters, and `?search=` deep links. For how search works and how to improve results when editing content, see the [Search Guide](SEARCH.md).

## Adding a New FAQ Entry

Copy an existing card from the correct department data file and update the fields. Required fields are:

- `id`
- `department`
- `category`
- `title`
- `desc`
- `urgency`
- `urgencyLabel`
- `stopCondition`
- `stopUntil`
- `questions`
- `script`
- `tags`

Use lowercase hyphenated IDs. Keep questions clear and operational. Keep scripts concise and appropriate for a CSR to read or paraphrase.

## Updating Branch Contacts

Branch contact and email data lives in `shared/branches.js`. Each branch has `service`, `delivery`, and `general` department objects. Update the correct department email or contacts array, then test at least one branch page that uses the data.

## Updating Branch-Specific Overrides

Branch-specific routing, contacts, local cards, and suppressions live in each branch `overrides.js` file. Use `window.BRANCH_OVERRIDES` for per-card routing changes, `window.BRANCH_LOCAL_CARDS` for branch-only cards, and `window.BRANCH_SUPPRESS` for cards that should not appear for that branch.

## Updating Delivery Schedule Data

Delivery area and schedule cards are branch-specific local cards. Add or update the area card in the branch `overrides.js` file using the delivery area card structure from `.cursorrules`. Keep `branchId` matched to the branch key and keep the map filename matched to the image file in `shared/maps/`.

## Updating Area Maps

Area maps are static image files in `shared/maps/`. Replace the image with the same filename when updating a map. If the filename changes, update the matching `mapImage` value in the branch area card.

To maintain accurate geographic boundaries, correct relative sizes, and jagged coastlines, delivery maps are generated programmatically using Python, Geopandas, and official state GIS shapefiles. Do not hand-draw or manually colorize flat images.

For instructions on regenerating existing maps or creating new territory maps for other branches, see the [Map Generation Guide](MAPGENERATION.md).

## Branch Manager Change Requests

Review each request for safety impact, branch scope, and department ownership. Log the change in `CHANGELOG.md`, implement the smallest necessary data or routing change, test the affected branch page, and confirm the result with the requester.

## Commit Message Convention

Use this format:

```text
[scope] [action] description
```

Examples:

```text
[shared] edit service water heater card
[penobscot] add delivery area override
[all] fix branch selector copy
```

Allowed scopes are `shared`, `root`, `penobscot`, `lincoln`, `dennysville`, `machias`, `ellsworth`, `hampden`, `beals`, and `all`.

Allowed actions are `add`, `edit`, `fix`, `remove`, and `refactor`.

## Content Review Cadence

Review all FAQ, routing, contact, and delivery content every 6 months. Review immediately after safety incidents, policy changes, contact changes, dispatch process changes, branch service changes, or customer-facing complaints about incorrect guidance.

## Beals/Carver Special Case

Beals/Carver is a single-CSR stub office. `beals/index.html` intentionally loads `../machias/overrides.js` instead of `beals/overrides.js`. The Beals override file exists only as an empty stub for file structure consistency. Edit Machias overrides when Beals should inherit the same routing behavior.

## Header And Footer Duplication

There is no shared template system. Header and footer HTML are duplicated in every branch page. When changing header or footer markup, update root and every branch `index.html` manually and identically unless a branch-specific title is required.

## Safety Content Rule

Never remove or soften a stop banner without explicit approval. Never lower an emergency urgency level without explicit approval. Do not edit gas leak, carbon monoxide alarm, burst pipe, or scalding water scripts without explicit instruction.

## GitHub Pages Deployment

1. Commit the tested changes.
2. Push the branch to GitHub.
3. Merge through the normal review process.
4. Confirm GitHub Pages is publishing from the configured branch and folder.
5. Open the published root page and at least one branch page.
6. Confirm search, filters, accordion behavior, and print controls still work.

## Backup Policy

The Git repository is the backup. Commit history is the version history. Do not maintain separate manual copies as the source of truth.
