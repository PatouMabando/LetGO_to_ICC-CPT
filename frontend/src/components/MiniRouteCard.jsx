// src/components/MiniRouteCardSnake.jsx
import { Paper, Box } from "@mui/material";

// tiny helper: parse "6s" / "1200ms" => seconds number
function parseDurToSeconds(d) {
  if (typeof d !== "string") return 6;
  const ms = d.endsWith("ms");
  const n = parseFloat(d);
  if (Number.isNaN(n)) return 6;
  return ms ? n / 1000 : n; // default assume 's'
}

export default function MiniRouteCardSnake({
  // colors & assets
  accentColor = "#e53935",        // member (middle) marker (red)
  driverColor = "#2e7d32",        // driver (start) marker (green)
  lineColor = "#1976d2",
  iccLogoUrl = "/ICC.png",

  // labels
  memberLabel = "I'm here",
  destinationLabel = "ICC",

  // animation options
  animateCar = true,
  carSpeed = "6s",               // "6s", "8s", "1200ms"...
  personDropAt = 0.5,            // fraction of the trip (0..1) when person drops in
  dropDuration = "0.6s",

  // misc
  showHalo = false,
  carColor = "#424242",
  wheelColor = "#111",
  personColor = "#4a4a4a",
  personAccent = "#1976d2",
}) {
  const W = 600;
  const H = 160;
  const pad = 24;
  const yMid = H / 2;
  const rStart = 8;
  const rEnd = 14;

  const xStart = pad;
  const xEnd = W - pad;

  // serpentine (S)
  const x1 = xStart;
  const x2 = xStart + (xEnd - xStart) * 0.33;
  const x3 = xStart + (xEnd - xStart) * 0.66;
  const x4 = xEnd;
  const amp = 40;

  const dPath = [
    `M ${x1} ${yMid}`,
    `C ${x1 + 40} ${yMid - amp}, ${x2 - 40} ${yMid - amp}, ${x2} ${yMid}`,
    `C ${x2 + 40} ${yMid + amp}, ${x3 - 40} ${yMid + amp}, ${x3} ${yMid}`,
    `C ${x3 + 40} ${yMid - amp}, ${x4 - 40} ${yMid - amp}, ${x4} ${yMid}`,
  ].join(" ");

  // middle stop roughly between x2 and x3
  const xMiddle = (x2 + x3) / 2;

  // compute when to trigger the drop (seconds string like "3s")
  const durSecs = parseDurToSeconds(carSpeed);
  const midOffset = Math.max(0, Math.min(1, personDropAt)) * durSecs;
  const midOffsetStr = `${midOffset}s`;

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Box sx={{ width: "100%", overflow: "hidden" }}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="auto" aria-label="Route preview">
          <defs>
            {/* Route path and tiny car */}
            <path id="routePath" d={dPath} />
            <g id="carIcon">
              <rect x="-10" y="-6" width="20" height="12" rx="2" fill={carColor} />
              <rect x="-6" y="-10" width="12" height="6" rx="2" fill={carColor} />
              <circle cx="-6" cy="7" r="3" fill={wheelColor} />
              <circle cx="6" cy="7" r="3" fill={wheelColor} />
              <rect x="1" y="-3" width="5" height="2" fill="white" opacity="0.6" />
            </g>
            {/* Simple person icon (head + body) */}
            <g id="personIcon">
              <circle cx="0" cy="-10" r="5" fill={personColor} />
              <rect x="-3" y="-6" width="6" height="14" rx="2" fill={personColor} />
              {/* a small accent bag/marker */}
              <circle cx="6" cy="2" r="3" fill={personAccent} />
            </g>
          </defs>

          {/* Path */}
          <use
            href="#routePath"
            fill="none"
            stroke={lineColor}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Start marker: DRIVER */}
          <circle cx={xStart} cy={yMid} r={rStart} fill={driverColor} />
          {showHalo && (
            <circle
              cx={xStart}
              cy={yMid}
              r={rStart + 6}
              fill="none"
              stroke={driverColor}
              strokeOpacity="0.25"
              strokeWidth="2"
            />
          )}

          {/* Animated car along the route */}
          {animateCar ? (
            <use href="#carIcon">
              <animateMotion id="carAnim" dur={carSpeed} repeatCount="indefinite" rotate="auto">
                <mpath xlinkHref="#routePath" />
              </animateMotion>
            </use>
          ) : (
            <g transform={`translate(${xMiddle}, ${yMid})`}>
              <use href="#carIcon" />
            </g>
          )}

          {/* Destination: ICC */}
          <image
            href={iccLogoUrl}
            x={xEnd - rEnd - 14}
            y={yMid - rEnd - 14}
            width={rEnd * 2 + 28}
            height={rEnd * 2 + 28}
            preserveAspectRatio="xMidYMid slice"
            style={{ filter: "drop-shadow(0 1px 1px rgba(0,0,0,.2))" }}
          />
          
        </svg>
      </Box>
    </Paper>
  );
}
