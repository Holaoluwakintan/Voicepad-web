import { Check, Sparkles, X, Zap } from 'lucide-react';

type Props = {
  onClose: () => void;
  used: number;
  limit: number;
};

export default function SubscriptionDialog({ onClose, used, limit }: Props) {
  return (
    <div className="auth-overlay" role="dialog" aria-modal="true" aria-labelledby="sub-title">
      <div className="auth-dialog" style={{ maxWidth: 520 }}>
        <button className="auth-close" onClick={onClose} aria-label="Close">
          <X size={17} />
        </button>
        <div className="auth-kicker">
          <span><Sparkles size={13} /></span> Free Trial Complete
        </div>
        <h2 id="sub-title" style={{ fontSize: 32, marginBottom: 8 }}>
          Unlock <em>unlimited</em><br />VoicePad.
        </h2>
        <p className="auth-intro" style={{ maxWidth: 440 }}>
          You’ve used all <strong>{used}/{limit}</strong> of your free trial notes. Upgrade to VoicePad Focus for unlimited voice notes, deep summaries, and priority AI transcription.
        </p>

        <div style={{
          background: '#f6ede4',
          border: '1px solid #ebd9c9',
          borderRadius: 10,
          padding: '16px 18px',
          marginTop: 18,
          marginBottom: 20
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
            <div>
              <strong style={{ fontSize: 16, color: 'var(--ink)' }}>VoicePad Focus</strong>
              <div style={{ fontSize: 11, color: '#887d74', fontFamily: 'var(--mono)' }}>FOR EVERYDAY POWER USERS</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <strong style={{ fontSize: 24, letterSpacing: '-0.05em' }}>$9</strong>
              <span style={{ fontSize: 11, color: '#887d74' }}>/month</span>
            </div>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--ink)' }}>
              <span style={{ color: 'var(--coral)', display: 'flex' }}><Check size={14} /></span> Unlimited voice recordings & uploads
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--ink)' }}>
              <span style={{ color: 'var(--coral)', display: 'flex' }}><Check size={14} /></span> Fast Whisper v3 & Deepgram Nova-2 priority
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--ink)' }}>
              <span style={{ color: 'var(--coral)', display: 'flex' }}><Check size={14} /></span> Instant AI executive summaries & action items
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--ink)' }}>
              <span style={{ color: 'var(--coral)', display: 'flex' }}><Check size={14} /></span> Multi-device sync & full note export
            </li>
          </ul>
        </div>

        <button
          className="button button-coral"
          style={{ width: '100%', padding: '14px', fontSize: 13 }}
          onClick={() => {
            alert('Subscription checkout is being prepared. Thank you for your interest in VoicePad Focus!');
            onClose();
          }}
        >
          <Zap size={16} /> Upgrade to VoicePad Focus ($9/mo)
        </button>

        <p style={{ textAlign: 'center', fontSize: 10, color: '#9d948c', marginTop: 12, marginBottom: 0 }}>
          Cancel anytime · 7-day money-back guarantee · Secure payment
        </p>
      </div>
    </div>
  );
}
