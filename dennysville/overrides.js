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
  },
  {
    id: "dennysville-office-hours",
    department: "general",
    category: "Branch Information",
    title: "Dennysville office hours and location",
    desc: "Office address, phone, and weekday hours for the Dennysville branch.",
    cardMode: "information",
    urgency: null,
    urgencyLabel: null,
    stopCondition: null,
    stopUntil: null,
    questions: [],
    script: "We're at 263 US Route 1 in Dennysville. Our main number is 207-726-4700. We're open Monday through Friday. Summer hours, roughly April through October, are 8 AM to 4 PM. Cold season hours, roughly November through March, are 8 AM to 5 PM. We're closed on holidays. Emergency service is available 24/7 even when the office is closed.",
    tags: ["hours", "address", "dennysville", "office", "holidays"]
  },
  {
    id: "dennysville-after-hours",
    department: "general",
    category: "Branch Information",
    title: "After hours and emergency contact",
    desc: "What to tell customers when the Dennysville office is closed.",
    cardMode: "confirm",
    urgency: null,
    urgencyLabel: null,
    stopCondition: null,
    stopUntil: null,
    questions: [
      "Is this a life-safety emergency such as a gas leak, CO alarm, or fire?"
    ],
    script: "The office is closed outside weekday business hours and on holidays. Emergency service is available 24/7, including holidays. If this is a life-safety emergency, tell them to call 911 first, then follow the appropriate Service emergency card. If they're out of fuel or have no heat, use the Delivery Area and Schedule card for the emergency workflow. For non-emergency matters after hours, take a message and let them know the office will follow up on the next business day. Do not promise same-day service after hours unless dispatch confirms.",
    tags: ["after hours", "emergency", "dennysville", "holidays"]
  },
  {
    id: "dennysville-services-offered",
    department: "general",
    category: "Branch Information",
    title: "What Dennysville offers",
    desc: "Services available from the Dennysville branch.",
    cardMode: "information",
    urgency: null,
    urgencyLabel: null,
    stopCondition: null,
    stopUntil: null,
    questions: [],
    script: "Dennysville offers HVAC service, plumbing, septic, generators, heating oil, and propane. Delivery and service area limits apply. Use the Delivery Area and Schedule card to confirm whether we serve their town. If they need something we don't offer, let them know and refer them appropriately.",
    tags: ["services", "dennysville", "propane", "oil", "hvac"]
  },
  {
    id: "dennysville-walk-in-payment",
    department: "general",
    category: "Account and Billing",
    title: "Walk-in and lockbox payment",
    desc: "How customers can pay at the Dennysville office or lockbox.",
    cardMode: "information",
    urgency: null,
    urgencyLabel: null,
    stopCondition: null,
    stopUntil: null,
    questions: [],
    script: "You can pay during office hours at 263 US Route 1 in Dennysville. There is also a payment lockbox next to the front door that you can use any time, day or night. For payment questions or to pay by phone, call 207-726-4700. I can't quote your balance or take card information on this line unless your billing process allows it.",
    tags: ["payment", "lockbox", "walk-in", "dennysville", "billing"]
  },
  {
    id: "dennysville-auto-delivery-overview",
    department: "delivery",
    category: "Delivery",
    title: "Automatic delivery - how it works",
    desc: "Explain automatic delivery to customers on the program or asking about it.",
    cardMode: "information",
    urgency: null,
    urgencyLabel: null,
    stopCondition: null,
    stopUntil: null,
    questions: [],
    script: "With automatic delivery, we schedule your deliveries based on your usage and the weather so you don't run out. You don't need to call for a routine fill when you're on automatic delivery. If you want to enroll or switch between automatic and will-call, I can start that during office hours or have someone follow up with you. I can't quote price per gallon on this call.",
    tags: ["automatic", "delivery", "will-call"]
  },
  {
    id: "dennysville-oil-gauge-reading",
    department: "delivery",
    category: "Delivery",
    title: "How to read your oil tank gauge",
    desc: "Help oil heat customers understand their tank gauge.",
    cardMode: "confirm",
    urgency: null,
    urgencyLabel: null,
    stopCondition: null,
    stopUntil: null,
    questions: [
      "Are they on oil heat, not propane?"
    ],
    script: "On most oil tanks, the gauge on top reads from F for full down to E for empty. The needle shows a percent of how full the tank is. A 275-gallon oil tank holds about 240 gallons when full. Use the chart below to estimate how many gallons are left. I'd order a delivery before the needle gets near E or below about 25 percent. Don't wait until the tank is empty. If the gauge looks stuck or broken, go ahead and schedule a delivery and we'll note the gauge issue.",
    gaugeTables: [
      {
        caption: "275-gallon oil tank - approximate gallons remaining",
        note: "A 275-gallon oil tank typically holds about 240 gallons when full. Numbers below are rounded estimates based on the gauge reading.",
        percents: [10, 25, 33, 50, 75, 100],
        tanks: [
          { label: "275 gal", capacityGal: 240 }
        ]
      }
    ],
    tags: ["oil", "gauge", "tank", "will-call"]
  },
  {
    id: "dennysville-propane-gauge-reading",
    department: "delivery",
    category: "Delivery",
    title: "How to read your propane tank gauge",
    desc: "Help propane customers understand their tank gauge and estimate gallons remaining.",
    cardMode: "confirm",
    urgency: null,
    urgencyLabel: null,
    stopCondition: null,
    stopUntil: null,
    questions: [
      "Are they on propane, not oil heat?",
      "Do they know their tank size (57, 120, 240, 320, or 500 gallon)?",
      "If they have more than one tank, are the tanks tied together on one system or running separate appliances?"
    ],
    script: "Propane tanks have a gauge on the tank, usually under the lid, that reads in percent from 0 to 100. Propane tanks are only filled to about 80 percent of the nameplate size to allow for expansion. Use the chart below with their tank size to estimate how many gallons are left. If they have multiple tanks tied together, use the combined tank size for the estimate and read the gauge on the tank we fill. If tanks run separate appliances, each tank has its own gauge and size. I'd schedule a delivery before the gauge drops below about 25 percent. If they're out of propane or have no heat, follow the emergency steps on the Delivery Area and Schedule card.",
    gaugeTables: [
      {
        caption: "Propane tank - approximate gallons remaining",
        note: "Tank sizes are nameplate gallons (120 gal includes 118-120 gallon tanks). Propane is delivered to about 80 percent of that size. Numbers below are rounded estimates based on the gauge reading. Actual capacity may vary by season. Quantities are normalized for a specific temperature, so the tank holds more in winter and less in summer.",
        percents: [10, 25, 33, 50, 75, 100],
        tanks: [
          { label: "57 gal", capacityGal: 46 },
          { label: "120 gal", capacityGal: 96 },
          { label: "240 gal", capacityGal: 192 },
          { label: "320 gal", capacityGal: 256 },
          { label: "500 gal", capacityGal: 400 }
        ]
      }
    ],
    tags: ["propane", "gauge", "tank", "will-call"]
  },
  {
    id: "dennysville-driveway-access",
    department: "delivery",
    category: "Delivery",
    title: "Driveway access for delivery",
    desc: "Guidance when driveway condition may block a delivery truck.",
    cardMode: "confirm",
    urgency: null,
    urgencyLabel: null,
    stopCondition: null,
    stopUntil: null,
    questions: [
      "Is the driveway plowed and sanded?",
      "Are there low wires or branches blocking truck access?"
    ],
    script: "Our delivery trucks need a safe path to your tank or fill pipe. If the driveway is icy, muddy, or hasn't been plowed, we may not be able to get in until it's cleared. Please keep a path wide enough for a delivery truck and keep pets inside during the delivery. If we can't reach you today, I'll note the access issue on your ticket and dispatch will reschedule.",
    tags: ["driveway", "snow", "access", "delivery"]
  },
  {
    id: "dennysville-will-call-delivery",
    department: "delivery",
    category: "Delivery",
    title: "Schedule a will-call delivery",
    desc: "Routine delivery request for customers who call to order fuel.",
    cardMode: "triage",
    urgency: null,
    urgencyLabel: null,
    stopCondition: null,
    stopUntil: null,
    questions: [
      "Customer name and account number?",
      "Delivery address and town?",
      "Fuel type and approximate quantity needed?",
      "Payment method on file or COD?",
      "Is the tank above 10 percent or critically low?"
    ],
    script: "I'll look up your town on our Delivery Area and Schedule card to make sure we serve your address. I'll create a delivery ticket in Ignite with your fuel type and quantity. If you need delivery by a specific date or have an access issue, I'll flag that for dispatch. If you're out of fuel or have no heat, I'll follow the emergency steps on the delivery area card.",
    tags: ["will-call", "schedule", "delivery", "oil", "propane"]
  }
];
window.BRANCH_SUPPRESS     = ["delivery-placeholder", "general-placeholder"];
