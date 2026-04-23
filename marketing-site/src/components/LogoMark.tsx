import { useId } from 'react'

export default function LogoMark({ size = 36 }: { size?: number }) {
  const uid = useId().replace(/:/g, '')
  const grad = `g${uid}`
  const glow = `glow${uid}`
  const inner = `inner${uid}`

  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <defs>
        <linearGradient id={grad} x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0EA5E9" />
          <stop offset="45%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        {/* Subtle inner glow overlay */}
        <linearGradient id={glow} x1="0" y1="0" x2="0" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="white" stopOpacity="0.15" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        {/* Clip to rounded rect */}
        <clipPath id={inner}>
          <rect width="36" height="36" rx="10" />
        </clipPath>
      </defs>

      {/* Background */}
      <rect width="36" height="36" rx="10" fill={`url(#${grad})`} />
      {/* Top-gloss sheen */}
      <rect width="36" height="36" rx="10" fill={`url(#${glow})`} />

      <g clipPath={`url(#${inner})`}>
        {/* Subtle area fill below the trend line */}
        <path
          d="M5 29 C9 29 12 22 17 17 C22 12 26 9 31 6 L31 34 L5 34 Z"
          fill="white"
          fillOpacity="0.07"
        />

        {/* Main smooth trend line */}
        <path
          d="M5 29 C9 29 12 22 17 17 C22 12 26 9 31 6"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Three data-point nodes */}
        <circle cx="5"  cy="29" r="2.8" fill="white" fillOpacity="0.45" />
        <circle cx="17" cy="17" r="2.8" fill="white" fillOpacity="0.75" />
        <circle cx="31" cy="6"  r="2.8" fill="white" />

        {/* Inner dot highlights */}
        <circle cx="5"  cy="29" r="1.2" fill="white" fillOpacity="0.3" />
        <circle cx="17" cy="17" r="1.2" fill="white" fillOpacity="0.5" />
        <circle cx="31" cy="6"  r="1.2" fill="white" fillOpacity="0.8" />
      </g>
    </svg>
  )
}
