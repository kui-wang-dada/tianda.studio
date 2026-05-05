import { ImageResponse } from 'next/og'

export const dynamic = 'force-static'
export const alt = 'Tianda Studio · 添达工作室'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#faf8f4',
          backgroundImage:
            'radial-gradient(ellipse at top, rgba(196,127,58,0.12), transparent 60%)',
          padding: '64px 72px',
          fontFamily: 'serif',
          color: '#1a1a1a',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: 'linear-gradient(135deg,#c47f3a,#a8632a)',
              color: '#faf8f4',
              fontSize: 32,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            添
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1, gap: 4 }}>
            <span style={{ fontSize: 22, fontWeight: 600 }}>Tianda Studio</span>
            <span style={{ fontSize: 14, color: '#8a7d62', letterSpacing: 4 }}>添达工作室</span>
          </div>
        </div>

        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ display: 'flex', fontSize: 56, fontWeight: 700, lineHeight: 1.1 }}>
            添达 · Kevin
          </div>
          <div style={{ display: 'flex', marginTop: 18, fontSize: 24, color: '#5a5040' }}>
            Full-Stack · AI Apps · Web3 NFT — 10+ years, one-person studio.
          </div>
          <div
            style={{
              marginTop: 24,
              display: 'flex',
              gap: 12,
              fontSize: 16,
              fontFamily: 'monospace',
              color: '#c47f3a',
            }}
          >
            <span>tianda.studio</span>
            <span>·</span>
            <span>Available on Upwork · 100% JS</span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
