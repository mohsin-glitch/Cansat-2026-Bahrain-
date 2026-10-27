// =====================================================================
// CANSAT 2026 - EDIT YOUR WEEKLY LOGS HERE!
// Whenever you want to update a week, just change the text below,
// save the file, and commit/upload to your host.
// =====================================================================

const CANSAT_POSTS = [
  {
    id: 1,
    weekNumber: 1,
    dateRange: "Oct 25 – Oct 31, 2026",
    status: "published", // Options: "published", "in-progress", "upcoming"
    title: "Mission Architecture, Sensor Selection & Power Budget",
    summary: "Kickoff week! Finalized our microcontroller choice, calibrated our environmental sensors, and calculated battery life for descent.",
    milestones: [
      "Selected ESP32-S3 as main flight computer for dual-core processing",
      "Bench-tested BMP388 barometric altimeter (±0.1m precision)",
      "Created initial power budget: 450mAh LiPo gives 3.2 hours standby",
      "Designed primary system block diagram"
    ],
    fullReport: `
      <h4>Mission Overview</h4>
      <p>This week marked our official kickoff for the CanSat 2026 campaign! We reviewed the competition rulebook, payload envelope dimensions (66mm diameter x 115mm height), and 350g maximum mass limit.</p>
      
      <div class="telemetry-box">
        <div class="telemetry-item"><span>PRIMARY MCU</span><strong>ESP32-S3 (240MHz)</strong></div>
        <div class="telemetry-item"><span>BAROMETER</span><strong>BMP388 Precision</strong></div>
        <div class="telemetry-item"><span>BATTERY</span><strong>1S 3.7V 450mAh LiPo</strong></div>
        <div class="telemetry-item"><span>TARGET MASS</span><strong>310g / 350g max</strong></div>
      </div>

      <h4>Engineering Challenges Solved</h4>
      <p>Our initial test with the cheaper BMP280 showed excessive noise during fast pressure drops. We upgraded to the BMP388 with built-in hardware IIR filtering, cutting altitude jitter down to under 15 centimeters.</p>

      <h4>Next Week's Goal</h4>
      <p>RF Telemetry link testing over 1km line-of-sight using 433MHz LoRa module and directional Yagi antenna.</p>
    `
  },
  {
    id: 2,
    weekNumber: 2,
    dateRange: "Nov 01 – Nov 07, 2026",
    status: "in-progress", // Change to "published" once ready!
    title: "Radio Telemetry (LoRa) & Ground Station Dashboard",
    summary: "Developing the ground station UI, packet structure, and real-time antenna link testing.",
    milestones: [
      "SX1278 LoRa transceiver packet format locked (1 Hz update rate)",
      "WebSerial API ground station telemetry dashboard prototype",
      "Antenna matching and range testing scheduled"
    ],
    fullReport: `
      <h4>Mission Focus</h4>
      <p>Establishing rock-solid communications is vital. If our ground station drops packets during the 400m apogee descent, we lose critical flight score points.</p>
      <p>We are currently formatting telemetry packets with checksums, GPS coordinates, pitch/roll, barometric altitude, and battery voltage.</p>
    `
  },
  {
    id: 3,
    weekNumber: 3,
    dateRange: "Nov 08 – Nov 14, 2026",
    status: "upcoming",
    title: "Mechanical Chassis CAD & 3D Printing Iteration 1",
    summary: "Designing the internal tiered stack to withstand 20G launch shock and impact landing.",
    milestones: [
      "SolidWorks / Fusion 360 chassis modeling",
      "Filament testing: PETG vs lightweight Polycarbonate",
      "Component placement and center-of-gravity optimization"
    ],
    fullReport: `<p>Log will be posted once mechanical CAD models and print prototypes are complete.</p>`
  },
  {
    id: 4,
    weekNumber: 4,
    dateRange: "Nov 15 – Nov 21, 2026",
    status: "upcoming",
    title: "Parachute Aerodynamics & Deployment Mechanism",
    summary: "Calculating terminal velocity and testing servo / nichrome wire release system.",
    milestones: [
      "Target descent velocity: 8 - 11 m/s calculation",
      "Hemispherical vs cruciform canopy wind-tunnel drop tests",
      "Deployment mechanism bench triggers"
    ],
    fullReport: `<p>Log will be posted upon completion of aerodynamic drop tests.</p>`
  },
  {
    id: 5,
    weekNumber: 5,
    dateRange: "Nov 22 – Nov 28, 2026",
    status: "upcoming",
    title: "Sensor Fusion, Flight State Machine & SD Logging",
    summary: "Implementing Kalman filter for altitude estimation and fail-safe flight state software.",
    milestones: [
      "Flight states: IDLE -> ASCENT -> APOGEE -> DESCENT -> LANDED",
      "Dual SPI bus isolation for Flash + MicroSD backup",
      "Accelerometer shock detection threshold tuning"
    ],
    fullReport: `<p>Log will be posted during software integration phase.</p>`
  },
  {
    id: 6,
    weekNumber: 6,
    dateRange: "Nov 29 – Dec 05, 2026",
    status: "upcoming",
    title: "High-Altitude Drop Testing & Stress Analysis",
    summary: "Field test dropping the CanSat from a drone at 150m to verify full telemetry and recovery.",
    milestones: [
      "Real-world drone release test",
      "Ground station packet capture validation",
      "Recovery buzzer and beacon visual verification"
    ],
    fullReport: `<p>Log will be published alongside high-speed drop test footage and telemetry logs.</p>`
  },
  {
    id: 7,
    weekNumber: 7,
    dateRange: "Dec 06 – Dec 12, 2026",
    status: "upcoming",
    title: "Final Integration, Critical Design Review & Readiness",
    summary: "Final weigh-in, hardware freeze, and final competition submission dossier.",
    milestones: [
      "Final Mass and Volume certification checklist",
      "Battery endurance dry run (4-hour continuous broadcast)",
      "Pre-flight readiness review sign-off"
    ],
    fullReport: `<p>Final mission recap and launch day countdown.</p>`
  }
];
