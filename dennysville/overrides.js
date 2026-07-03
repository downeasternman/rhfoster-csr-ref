// Dennysville branch overrides
// Edit this file to add branch-specific routing, contacts, and local cards.
// See .cursorrules for data structure documentation.
// core.js guards all three of these - safe to leave empty.

window.BRANCH_OVERRIDES    = {};
window.BRANCH_LOCAL_CARDS  = [
  {
    id: "dennysville-delivery-area",
    department: "delivery",
    cardType: "area",
    branchId: "dennysville",
    category: "Service Area",
    title: "Dennysville Delivery Area & Schedule",
    desc: "Delivery zones and cold season schedules for the Dennysville area.",
    urgency: null,
    urgencyLabel: null,
    mapImage: "Eastern_Washington_County_Zones.svg",
    coverageSummary: "Delivery zones and cold season schedules for the Dennysville area. Note: Any town not listed is not covered.",
    questions: [
      "Confirm Customer Name",
      "Confirm Physical Address",
      "Confirm Fuel Type and Quantity",
      "Confirm Payment Method"
    ],
    scheduleTable: [
      { zone: "Zone 1", zoneColor: "#1f77b4", towns: "Whiting, Trescott Twp, Lubec", offroadDays: [], heatingDays: [], propaneDays: [] },
      { zone: "Zone 2", zoneColor: "#2ca02c", towns: "Edmunds Twp, Dennysville, Pembroke, Marion Twp", offroadDays: [], heatingDays: [], propaneDays: [] },
      { zone: "Zone 3", zoneColor: "#ff7f0e", towns: "Perry, Pleasant Point, Eastport", offroadDays: [], heatingDays: [], propaneDays: [] },
      { zone: "Zone 4", zoneColor: "#d62728", towns: "Robbinston, Calais, Baring Plt, Meddybemps, Cooper, Alexander, Princeton, Baileyville, Cathance Twp, Charlotte", offroadDays: [], heatingDays: [], propaneDays: [] }
    ],
    workflowSteps: [
      {
        type: "routine",
        label: "Routine delivery request",
        body: "Create a delivery ticket in Ignite with the customer's zone from the table above. Note any access or gate instructions in the ticket."
      },
      {
        type: "nonRoutine",
        label: "Non-routine request",
        body: "Create a delivery ticket in Ignite. Include the requested date, special access needs, or any reason this is outside a normal run in the ticket notes. Then email delivery dispatch so they can review and schedule."
      },
      {
        type: "emergency",
        label: "Emergency - customer out of fuel",
        body: "Create a delivery ticket in Ignite with address and fuel type confirmed. Call delivery dispatch immediately, then send a follow-up email with the ticket details. Do not promise a delivery time until dispatch confirms."
      }
    ],
    priorityNote: "",
    script: ""
  }
];
window.BRANCH_SUPPRESS     = ["delivery-placeholder"];
