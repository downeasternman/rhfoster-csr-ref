window.FAQ_DELIVERY = [
  {
    id: "auto-delivery-overview",
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
    id: "oil-gauge-reading",
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
    id: "propane-gauge-reading",
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
    script: "Propane tanks have a gauge on the tank, usually under the lid, that reads in percent from 0 to 100. Propane tanks are only filled to about 80 percent of the nameplate size to allow for expansion. Use the chart below with their tank size to estimate how many gallons are left. If they have multiple tanks tied together, use the combined tank size for the estimate and read the gauge on the tank we fill. If tanks run separate appliances, each tank has its own gauge and size. I'd schedule a delivery before the gauge drops below about 25 percent. If they're out of propane or have no heat, follow the emergency steps on the delivery area card.",
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
    id: "driveway-access",
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
    id: "will-call-delivery",
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
    script: "I'll look up your town on this branch's Delivery Area and Schedule card to make sure we serve your address. I'll create a delivery ticket in Ignite with your fuel type and quantity. If you need delivery by a specific date or have an access issue, I'll flag that for dispatch. If you're out of fuel or have no heat, I'll follow the emergency steps on the delivery area card. If the address falls outside this branch's delivery area, the delivery area card will show which branch to route them to.",
    tags: ["will-call", "schedule", "delivery", "oil", "propane"]
  }
];
