import React from 'react';

const LABELS = ['Leadership', 'Policy', 'Infrastructure', 'Capacity', 'Curriculum'];

export default function RadarChart({ scores, size = 400 }) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.22;
  const numAxes = 5;
  const levels = 5;

  const getPoint = (index, fraction) => {
    const angle = (Math.PI * 2 * index) / numAxes - Math.PI / 2;
    return {
      x: cx + Math.cos(angle) * radius * fraction,
      y: cy + Math.sin(angle) * radius * fraction,
    };
  };

  const polygonPoints = (fraction) =>
    Array.from({ length: numAxes }, (_, i) => getPoint(i, fraction))
      .map((p) => `${p.x},${p.y}`)
      .join(' ');

  const dataPoints = scores.map((s, i) => getPoint(i, s / 100));
  const dataPath = dataPoints.map((p) => `${p.x},${p.y}`).join(' ');

  const labelOffset = radius + 20;

  return (
    <svg width="100%" viewBox={`0 0 ${size} ${size}`} className="mx-auto max-w-md">
      {/* Grid levels */}
      {Array.from({ length: levels }, (_, i) => (
        <polygon
          key={i}
          points={polygonPoints((i + 1) / levels)}
          fill="none"
          stroke="#D4C5B2"
          strokeWidth="0.75"
          opacity="0.6"
        />
      ))}

      {/* Axis lines */}
      {Array.from({ length: numAxes }, (_, i) => {
        const p = getPoint(i, 1);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#D4C5B2" strokeWidth="0.75" opacity="0.6" />;
      })}

      {/* Data polygon fill */}
      <polygon points={dataPath} fill="#E07A5F" fillOpacity="0.25" stroke="#E07A5F" strokeWidth="2.5" />

      {/* Data points */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill="#E07A5F" />
      ))}

      {/* Labels */}
      {LABELS.map((label, i) => {
        const angle = (Math.PI * 2 * i) / numAxes - Math.PI / 2;
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
        const lx = cx + cosA * labelOffset;
        const ly = cy + sinA * labelOffset;

        let anchor = 'middle';
        let dx = 0;
        if (cosA < -0.1) { anchor = 'end'; dx = -4; }
        else if (cosA > 0.1) { anchor = 'start'; dx = 4; }

        let dy = 0;
        if (sinA < -0.3) dy = -4;
        else if (sinA > 0.3) dy = 8;

        return (
          <g key={label}>
            <text
              x={lx + dx}
              y={ly + dy - 6}
              textAnchor={anchor}
              fontSize="13"
              fontWeight="600"
              fill="#1B3A4B"
              fontFamily="Inter, system-ui, sans-serif"
            >
              {label}
            </text>
            <text
              x={lx + dx}
              y={ly + dy + 10}
              textAnchor={anchor}
              fontSize="13"
              fill="#6B6B6B"
              fontFamily="Inter, system-ui, sans-serif"
            >
              {scores[i]}%
            </text>
          </g>
        );
      })}
    </svg>
  );
}
