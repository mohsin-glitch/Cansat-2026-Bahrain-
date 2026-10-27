// ==========================================
// SKYLINK - CanSat 2026 Official Mission Data
// October 25 – December 12, 2026
// ==========================================

const SKYLINK_POSTS = [
  {
    id: 1,
    weekNumber: 1,
    dateRange: "Oct 25 – Oct 31, 2026",
    status: "published",
    title: "Mission Architecture, MCU Selection & Power Budget",
    summary: "Official campaign kickoff! Finalized system architecture, benchmarked ESP32-S3 microcontroller, and calibrated our primary BMP388 barometric altimeter.",
    image: "", // Base64 data or image URL can be added via Admin Dashboard
    milestones: [
      "Selected ESP32-S3 dual-core MCU (240MHz) for avionics & sensor fusion",
      "Bench-tested BMP388 altimeter: achieve ±0.1m relative altitude accuracy",
      "Calculated power budget: 450mAh 1S LiPo provides 3.4 hours active telemetry",
      "Drafted primary hardware block diagram inside 66mm diameter constraint"
    ],
    telemetry: {
      mcu: "ESP32-S3 (Dual-Core 240MHz)",
      altimeter: "BMP388 Precision Barometer",
      battery: "1S 3.7V 450mAh LiPo",
      targetMass: "315g / 350g max"
    },
    fullReport: `
      <h4>Kickoff & System Architecture</h4>
      <p>This week marked our official kickoff for the CanSat 2026 competition! We thoroughly analyzed the competition envelope constraints (66mm diameter x 115mm height) and 350g maximum mass.</p>
      
      <h4>Avionics Bench Testing</h4>
      <p>We tested our flight computer candidate, the ESP32-S3. Initial testing showed stable sensor reading intervals at 20Hz. We upgraded from the noisy BMP280 to the BMP388 barometric sensor with internal hardware IIR filtering, cutting altitude jitter down to under 12 centimeters.</p>

      <h4>Next Week's Objective</h4>
      <p>LoRa RF radio telemetry range test over 1km line-of-sight and ground station packet parser implementation.</p>
    `
  },
  {
    id: 2,
    weekNumber: 2,
    dateRange: "Nov 01 – Nov 07, 2026",
    status: "in-progress",
    title: "LoRa Radio Telemetry & Ground Station Link",
    summary: "Developing our 433MHz LoRa communication link, packet format with error checksums, and real-time laptop telemetry dashboard.",
    image: "",
    milestones: [
      "SX1278 433MHz LoRa packet structure locked (1 Hz update rate)",
      "WebSerial API ground station telemetry UI prototype",
      "Directional Yagi antenna range testing scheduled"
    ],
    telemetry: {
      mcu: "ESP32-S3",
      radio: "SX1278 LoRa 433MHz",
      groundStation: "WebSerial Dashboard",
      packetRate: "1 Hz Telemetry"
    },
    fullReport: `
      <h4>RF Communications Progress</h4>
      <p>Reliable radio telemetry is critical for our mission score. We are encoding GPS coordinates, pitch/roll, barometric altitude, and battery voltage into lightweight binary packets with CRC checks.</p>
    `
  },
  {
    id: 3,
    weekNumber: 3,
    dateRange: "Nov 08 – Nov 14, 2026",
    status: "upcoming",
    title: "Mechanical Chassis CAD & 3D Printing Iteration 1",
    summary: "Modeling the internal tiered mounting structure in CAD to withstand 20G launch shock and impact landing.",
    image: "",
    milestones: [
      "SolidWorks / Fusion 360 internal chassis model",
      "PETG vs Polycarbonate filament stress testing",
      "Center-of-gravity and payload balance verification"
    ],
    telemetry: {
      chassis: "3D Printed PETG Stack",
      diameter: "66 mm cylinder",
      height: "115 mm",
      shockRating: "20G Impact Tolerance"
    },
    fullReport: `<p>Log will be posted once CAD models and 3D print prototypes are evaluated.</p>`
  },
  {
    id: 4,
    weekNumber: 4,
    dateRange: "Nov 15 – Nov 21, 2026",
    status: "upcoming",
    title: "Parachute Aerodynamics & Deployment Mechanism",
    summary: "Calculating terminal velocity (8-11 m/s target) and building the servo / nichrome wire release system.",
    image: "",
    milestones: [
      "Canopy sizing calculations for 9.5 m/s terminal descent",
      "Ripstop nylon cruciform parachute fabrication",
      "Bench testing ejection deployment trigger"
    ],
    telemetry: {
      canopy: "Cruciform Ripstop Nylon",
      targetDescent: "9.5 m/s",
      deployment: "Servo / Spring Ejector",
      lines: "Braided Kevlar Suspension"
    },
    fullReport: `<p>Log will be updated following aerodynamic drop tests.</p>`
  },
  {
    id: 5,
    weekNumber: 5,
    dateRange: "Nov 22 – Nov 28, 2026",
    status: "upcoming",
    title: "Sensor Fusion, Flight State Machine & SD Logging",
    summary: "Implementing Kalman filtering for apogee detection and autonomous recovery state transitions.",
    image: "",
    milestones: [
      "Flight state logic: IDLE -> LAUNCH -> APOGEE -> DESCENT -> LANDED",
      "Dual SPI bus isolation for Flash + MicroSD card logging",
      "IMU accelerometer launch threshold calibration"
    ],
    telemetry: {
      filter: "1D Kalman Filter (Altitude)",
      storage: "MicroSD FAT32 + Onboard Flash",
      imu: "MPU6050 6-DOF Accelerometer",
      stateRate: "50 Hz Update Loop"
    },
    fullReport: `<p>Log will be posted during software integration phase.</p>`
  },
  {
    id: 6,
    weekNumber: 6,
    dateRange: "Nov 29 – Dec 05, 2026",
    status: "upcoming",
    title: "High-Altitude Drop Testing & Stress Analysis",
    summary: "Field drop test from a drone at 150m to verify parachute deployment shock, live radio link, and recovery buzzer.",
    image: "",
    milestones: [
      "Real-world drone release test at 150m AGL",
      "Ground station packet capture and signal strength verification",
      "Acoustic recovery buzzer audible range test"
    ],
    telemetry: {
      testAlt: "150m Drop Height",
      buzzer: "95dB Piezo Beacon",
      rfMargin: "> 25 dB RSSI",
      recoveryTime: "< 2 Minutes"
    },
    fullReport: `<p>Log will be published alongside high-altitude drop test footage and telemetry logs.</p>`
  },
  {
    id: 7,
    weekNumber: 7,
    dateRange: "Dec 06 – Dec 12, 2026",
    status: "upcoming",
    title: "Final Integration, Critical Design Review & Launch Readiness",
    summary: "Final weigh-in, hardware freeze, Critical Design Review (CDR) sign-off, and competition mission dossier.",
    image: "",
    milestones: [
      "Final mass & volume compliance sign-off (315g / 350g limit)",
      "4-hour continuous broadcast battery dry run",
      "Mission readiness review checklist signed"
    ],
    telemetry: {
      finalMass: "315 g",
      status: "FLIGHT READY",
      cdrScore: "Pending Review",
      countdown: "T-0 to Launch"
    },
    fullReport: `<p>Final mission recap and launch day countdown.</p>`
  }
];
