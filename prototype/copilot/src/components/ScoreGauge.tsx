import React from 'react';
import { theme, scoreColor } from '../styles/theme';

interface ScoreGaugeProps {
  score: number;
  label: string;
  size?: number;
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, label, size = 80 }) => {
  const color = scoreColor(score);
  const strokeWidth = 5;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const center = size / 2;

  return (
    <div style={styles.container}>
      <div
        style={{
          ...styles.gaugeWrapper,
          width: size,
          height: size,
          filter: `drop-shadow(0 0 6px ${color}40)`,
        }}
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background ring */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={theme.colors.elevated}
            strokeWidth={strokeWidth}
          />
          {/* Progress ring */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            transform={`rotate(-90 ${center} ${center})`}
            style={{
              transition: `stroke-dashoffset ${theme.transition.slow}`,
              filter: `drop-shadow(0 0 3px ${color}80)`,
            }}
          />
          {/* Glow overlay */}
          <circle
            cx={center}
            cy={center}
            r={radius - 2}
            fill="none"
            stroke={color}
            strokeWidth={1}
            opacity={0.15}
          />
        </svg>
        {/* Score number in center */}
        <div
          style={{
            ...styles.scoreText,
            color: color,
            fontSize: size > 60 ? theme.fontSize.xl : theme.fontSize.lg,
            textShadow: `0 0 8px ${color}60`,
          }}
        >
          {score}
        </div>
      </div>
      <span style={styles.label}>{label}</span>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  gaugeWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    position: 'absolute',
    fontFamily: theme.fonts.mono,
    fontWeight: 700,
    letterSpacing: '-0.5px',
  },
  label: {
    fontFamily: theme.fonts.sans,
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    fontWeight: 500,
  },
};

export default ScoreGauge;
