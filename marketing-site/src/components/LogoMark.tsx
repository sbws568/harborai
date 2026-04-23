import { useId } from 'react'

interface LogoMarkProps {
  size?: number
}

export default function LogoMark({ size = 36 }: LogoMarkProps) {
  const uid    = useId().replace(/:/g, '')
  const gradId = `g${uid}`
  const clipId = `cl${uid}`

  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <defs>
        {/* Cyan → indigo, diagonal across the mark */}
        <linearGradient id={gradId} x1="6" y1="6" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#22D3EE" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>
        <clipPath id={clipId}>
          <rect width="36" height="36" rx="9" />
        </clipPath>
      </defs>

      {/* Dark background */}
      <rect width="36" height="36" rx="9" fill="#0F172A" />

      <g clipPath={`url(#${clipId})`} stroke={`url(#${gradId})`} strokeLinecap="round" strokeLinejoin="round">
        {/* Vertical spine */}
        <line x1="9"  y1="8"  x2="9"  y2="28" strokeWidth="3.5" />
        {/* Top bar — full width */}
        <line x1="9"  y1="8"  x2="27" y2="8"  strokeWidth="3.5" />
        {/* Middle bar — slightly shorter */}
        <line x1="9"  y1="18" x2="22" y2="18" strokeWidth="3.5" />
        {/* Bottom bar — full width */}
        <line x1="9"  y1="28" x2="27" y2="28" strokeWidth="3.5" />
      </g>
    </svg>
  )
}
