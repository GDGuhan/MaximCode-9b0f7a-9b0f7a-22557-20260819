import { QRCodeSVG } from 'qrcode.react';
import { formatDate, generateCertificateDescription } from '@/lib/utils';
import { COMPANY, FOUNDER } from '@/constants';
import msmeLogoPath from '@/assets/msme-logo.png';
import type { GeneratedDocumentData } from '@/types';

interface CertificateDocumentProps {
  data: GeneratedDocumentData;
  printRef?: React.RefObject<HTMLDivElement>;
}

export default function CertificateDocument({ data, printRef }: CertificateDocumentProps) {
  const description = generateCertificateDescription(data);

  return (
    <div
      ref={printRef}
      id="certificate-document"
      style={{
        width: '1122px',
        minHeight: '794px',
        background: '#ffffff',
        position: 'relative',
        fontFamily: "'Inter', sans-serif",
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Outer Border - Navy */}
      <div style={{
        position: 'absolute',
        inset: '10px',
        border: '4px solid hsl(215,62%,22%)',
        borderRadius: '8px',
        pointerEvents: 'none',
        zIndex: 10,
      }} />
      {/* Inner Border - Gold */}
      <div style={{
        position: 'absolute',
        inset: '18px',
        border: '1.5px solid hsl(43,71%,47%)',
        borderRadius: '4px',
        pointerEvents: 'none',
        zIndex: 10,
      }} />

      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(26,58,92,0.03) 0%, transparent 60%), radial-gradient(circle at 80% 50%, rgba(201,162,39,0.04) 0%, transparent 60%)',
        zIndex: 1,
      }} />

      {/* Corner Decorations */}
      {[
        { top: '24px', left: '24px' },
        { top: '24px', right: '24px' },
        { bottom: '24px', left: '24px' },
        { bottom: '24px', right: '24px' },
      ].map((pos, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: '32px',
          height: '32px',
          ...pos,
          zIndex: 11,
        }}>
          <svg width="32" height="32" viewBox="0 0 32 32">
            <path
              d={i === 0 ? 'M2,16 L2,2 L16,2' : i === 1 ? 'M16,2 L30,2 L30,16' : i === 2 ? 'M2,16 L2,30 L16,30' : 'M16,30 L30,30 L30,16'}
              fill="none"
              stroke="hsl(43,71%,47%)"
              strokeWidth="2.5"
            />
          </svg>
        </div>
      ))}

      {/* Main Content */}
      <div style={{ position: 'relative', zIndex: 5, padding: '36px 60px 28px' }}>
        {/* Header Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          {/* Company Logo Left */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Logo Mark */}
              <div style={{
                width: '56px',
                height: '56px',
                background: 'linear-gradient(135deg, hsl(215,62%,22%) 0%, hsl(215,50%,35%) 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(26,58,92,0.3)',
              }}>
                <span style={{ color: 'hsl(43,71%,47%)', fontSize: '22px', fontWeight: '900', fontFamily: 'Cinzel, serif', letterSpacing: '-1px' }}>MC</span>
              </div>
              <div>
                <div style={{ fontSize: '20px', fontWeight: '800', color: 'hsl(215,62%,22%)', fontFamily: 'Cinzel, serif', letterSpacing: '2px' }}>MAXIM CODE</div>
                <div style={{ fontSize: '10px', color: 'hsl(43,71%,47%)', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase' }}>Building Future Innovators</div>
                <div style={{ fontSize: '9px', color: 'hsl(215,20%,50%)', marginTop: '2px', letterSpacing: '0.5px' }}>codemaxim82@gmail.com</div>
              </div>
            </div>
          </div>

          {/* QR Code Right */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div style={{
              padding: '6px',
              border: '1.5px solid hsl(43,71%,47%)',
              borderRadius: '8px',
              background: 'white',
            }}>
              <QRCodeSVG
                value={data.verificationUrl}
                size={72}
                bgColor="#ffffff"
                fgColor="hsl(215,62%,22%)"
                level="M"
              />
            </div>
            <span style={{ fontSize: '8px', color: 'hsl(215,20%,45%)', letterSpacing: '0.5px', textAlign: 'center' }}>SCAN TO VERIFY</span>
            <span style={{ fontSize: '7px', color: 'hsl(43,60%,40%)', fontWeight: '600', textAlign: 'center' }}>{data.certificateId}</span>
          </div>
        </div>

        {/* Gold Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ flex: 1, height: '1px', background: 'hsl(43,71%,47%)' }} />
          <div style={{ width: '8px', height: '8px', background: 'hsl(43,71%,47%)', transform: 'rotate(45deg)' }} />
          <div style={{ flex: 1, height: '1px', background: 'hsl(43,71%,47%)' }} />
        </div>

        {/* Certificate Title */}
        <div style={{ textAlign: 'center', marginBottom: '12px' }}>
          <div style={{ fontSize: '11px', letterSpacing: '6px', color: 'hsl(43,71%,47%)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>
            ✦ MAXIM CODE PRESENTS ✦
          </div>
          <h1 style={{
            fontSize: '38px',
            fontFamily: 'Cinzel, serif',
            fontWeight: '700',
            color: 'hsl(215,62%,22%)',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            lineHeight: 1.1,
            margin: 0,
          }}>
            Certificate of Completion
          </h1>
          <div style={{ fontSize: '11px', letterSpacing: '4px', color: 'hsl(215,20%,55%)', textTransform: 'uppercase', marginTop: '6px' }}>
            This Certificate Is Proudly Presented To
          </div>
        </div>

        {/* Candidate Name */}
        <div style={{ textAlign: 'center', marginBottom: '14px' }}>
          <div style={{
            fontSize: '42px',
            fontFamily: 'Playfair Display, serif',
            fontWeight: '700',
            color: 'hsl(215,62%,22%)',
            letterSpacing: '2px',
            lineHeight: 1.2,
            textTransform: 'uppercase',
          }}>
            {data.name}
          </div>
          {/* Name underline */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4px' }}>
            <div style={{ width: '300px', height: '2px', background: 'linear-gradient(90deg, transparent, hsl(43,71%,47%), transparent)' }} />
          </div>
        </div>

        {/* Description */}
        <div style={{
          textAlign: 'center',
          maxWidth: '820px',
          margin: '0 auto 16px',
          fontSize: '12px',
          lineHeight: 1.7,
          color: 'hsl(215,20%,35%)',
          fontStyle: 'italic',
        }}>
          {description}
        </div>

        {/* Skills Section */}
        <div style={{ marginBottom: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '9px', letterSpacing: '3px', color: 'hsl(43,60%,40%)', textTransform: 'uppercase', fontWeight: '700', marginBottom: '8px' }}>
            Skills & Competencies Acquired
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center' }}>
            {data.skills.map((skill, i) => (
              <span key={i} style={{
                padding: '3px 12px',
                border: '1px solid hsl(43,71%,60%)',
                borderRadius: '20px',
                fontSize: '10px',
                fontWeight: '600',
                color: 'hsl(215,62%,22%)',
                background: 'hsl(43,100%,96%)',
                letterSpacing: '0.5px',
              }}>
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '8px' }}>
          {/* Signature Left */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            {/* Stylized Signature */}
            <div style={{
              fontSize: '26px',
              fontFamily: 'Brush Script MT, cursive',
              color: 'hsl(215,62%,22%)',
              letterSpacing: '2px',
              lineHeight: 1,
              marginBottom: '4px',
              borderBottom: '1px solid hsl(215,30%,70%)',
              paddingBottom: '4px',
              minWidth: '160px',
            }}>
              S. Prashant
            </div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'hsl(215,62%,22%)', letterSpacing: '1px' }}>{FOUNDER.name}</div>
            <div style={{ fontSize: '10px', color: 'hsl(215,20%,50%)', letterSpacing: '0.5px' }}>{FOUNDER.title}</div>
            <div style={{ fontSize: '10px', color: 'hsl(43,71%,40%)', letterSpacing: '0.5px', fontWeight: '600' }}>{FOUNDER.company}</div>
          </div>

          {/* Center — Issue Date + ID */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              padding: '10px 20px',
              border: '1px solid hsl(215,30%,80%)',
              borderRadius: '8px',
              background: 'hsl(215,30%,97%)',
            }}>
              <div style={{ fontSize: '9px', letterSpacing: '2px', color: 'hsl(215,20%,50%)', textTransform: 'uppercase', marginBottom: '3px' }}>Date of Issue</div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'hsl(215,62%,22%)' }}>{data.issueDate}</div>
              <div style={{ fontSize: '9px', color: 'hsl(43,60%,40%)', marginTop: '4px', letterSpacing: '1px', fontWeight: '600' }}>{data.certificateId}</div>
            </div>
          </div>

          {/* MSME Right */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <img
              src={msmeLogoPath}
              alt="MSME"
              style={{ width: '80px', height: '80px', objectFit: 'contain' }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <span style={{ fontSize: '8px', color: 'hsl(215,20%,55%)', letterSpacing: '1px' }}>MSME REGISTERED</span>
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div style={{
        position: 'absolute',
        bottom: '5px',
        left: '28px',
        right: '28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 6,
      }}>
        <span style={{ fontSize: '8px', color: 'hsl(215,20%,55%)', letterSpacing: '0.5px' }}>codemaxim82@gmail.com</span>
        <span style={{ fontSize: '8px', color: 'hsl(215,20%,55%)', letterSpacing: '0.5px' }}>maximcode.app</span>
      </div>
      {/* Bottom gold bar */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '5px',
        background: 'linear-gradient(90deg, hsl(215,62%,22%) 0%, hsl(43,71%,47%) 50%, hsl(215,62%,22%) 100%)',
      }} />
    </div>
  );
}
