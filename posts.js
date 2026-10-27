// ==========================================
// SKYLINK - CanSat 2026 Weekly Blog Data
// Oct 25 to Dec 12, 2026
// ==========================================

const SKYLINK_POSTS = [
  {
    week: 1,
    dates: "Oct 25 – Oct 31, 2026",
    title: "Mission Architecture & Component Selection",
    status: "published",
    content: "Welcome to Skylink's CanSat 2026 blog! This week we finalized our system architecture, selected our flight microcontroller (ESP32-S3), calibrated the BMP388 altimeter sensor, and set up our primary power budget (450mAh LiPo for 3+ hours runtime)."
  },
  {
    week: 2,
    dates: "Nov 01 – Nov 07, 2026",
    title: "Radio Telemetry & Ground Station Link",
    status: "in-progress",
    content: "Developing our 433MHz LoRa radio telemetry system and ground station antenna. Writing the communication packet structure to transmit live altitude, acceleration, temperature, and GPS coordinates down to our laptop dashboard."
  },
  {
    week: 3,
    dates: "Nov 08 – Nov 14, 2026",
    title: "Mechanical Chassis CAD & 3D Printing",
    status: "upcoming",
    content: "Log will be updated during Week 3: Designing the internal 3D-printed chassis to hold the circuit boards, battery, and camera inside the 66mm x 115mm CanSat cylindrical envelope."
  },
  {
    week: 4,
    dates: "Nov 15 – Nov 21, 2026",
    title: "Parachute Aerodynamics & Deployment Mechanism",
    status: "upcoming",
    content: "Log will be updated during Week 4: Calculating descent speed (target 8-11 m/s), cutting our hemispherical parachute, and testing the servo ejection release mechanism."
  },
  {
    week: 5,
    dates: "Nov 22 – Nov 28, 2026",
    title: "Flight Software, Sensor Fusion & SD Backup",
    status: "upcoming",
    content: "Log will be updated during Week 5: Programming our flight state machine (IDLE -> LAUNCH -> APOGEE -> DESCENT -> LANDED) with Kalman filtering and flash memory logging."
  },
  {
    week: 6,
    dates: "Nov 29 – Dec 05, 2026",
    title: "Drone Drop Testing & Vibration Stress Tests",
    status: "upcoming",
    content: "Log will be updated during Week 6: High-altitude drop test from 150m using a drone to test radio range, parachute deployment shock, and recovery buzzer."
  },
  {
    week: 7,
    dates: "Dec 06 – Dec 12, 2026",
    title: "Final Integration, CDR & Launch Readiness",
    status: "upcoming",
    content: "Log will be updated during Week 7: Final weigh-in (under 350g limit), Critical Design Review (CDR) submission, and packing for the launch competition!"
  }
];
