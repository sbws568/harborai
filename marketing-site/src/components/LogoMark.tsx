import { useId } from 'react'

interface LogoMarkProps {
  size?: number
}

// Gradient square with a bold two-stroke "ef" ligature:
//   – a thick upward-right slash (the financial rise)
//   – crossed by a shorter horizontal bar (the "ease" crossbar)
// Reads as abstract fintech mark at any size; resolves to "ef" up close.
export default function LogoMark({ size = 36 }: LogoMarkProps) {
  const uid    = useId().replace(/:/g, '')
  const gradId = `g${uid}`
  const glowId = `gl${uid}`
  const clipId = `cl${uid}`

  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#0EA5E9" />
          <stop offset="50%"  stopColor="#6366F1" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        <linearGradient id={glowId} x1="0" y1="0" x2="0" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="white" stopOpacity="0.20" />
          <stop offset="60%"  stopColor="white" stopOpacity="0"    />
        </linearGradient>
        <clipPath id={clipId}>
          <rect width="36" height="36" rx="10" />
        </clipPath>
      </defs>

      {/* Background */}
      <rect width="36" height="36" rx="10" fill={`url(#${gradId})`} />
      {/* Top-gloss sheen */}
      <rect width="36" height="36" rx="10" fill={`url(#${glowId})`} />

      <g clipPath={`url(#${clipId})`}>
        {/* Primary stroke — bold rising diagonal (bottom-left → top-right) */}
        <line
          x1="10" y1="27"
          x2="26" y2="9"
          stroke="white" strokeWidth="4.5" strokeLinecap="round"
        />
        {/* Secondary stroke — horizontal crossbar, offset right for the "f" feel */}
        <line
          x1="13" y1="19"
          x2="27" y2="19"
          stroke="white" strokeWidth="3" strokeLinecap="round"
          strokeOpacity="0.75"
        />
        {/* Terminal dot at the top of the rise */}
        <circle cx="26" cy="9" r="2.8" fill="white" />
      </g>
    </svg>
  )
}
