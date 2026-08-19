import { formatDate, getCurrentDate } from '@/lib/utils';
import { COMPANY, OFFER_SIGNER, getResponsibilitiesForDomain } from '@/constants';
import msmeLogoPath from '@/assets/msme-logo.png';
import maximCodeLogoPath from '@/assets/maxim-code-logo.png';
import type { GeneratedDocumentData } from '@/types';

interface OfferLetterDocumentProps {
  data: GeneratedDocumentData;
  printRef?: React.RefObject<HTMLDivElement>;
}

export default function OfferLetterDocument({ data, printRef }: OfferLetterDocumentProps) {
  const responsibilities = getResponsibilitiesForDomain(data.domain, data.role);
  const currentDate = getCurrentDate();

  return (
    <div
      ref={printRef}
      id="offer-letter-document"
      style={{
        width: '794px',
        minHeight: '1123px',
        background: '#ffffff',
        position: 'relative',
        fontFamily: "'Inter', sans-serif",
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* Top Navy Bar */}
      <div style={{
        background: 'hsl(215,62%,22%)',
        padding: '18px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src={maximCodeLogoPath}
            alt="Maxim Code"
            style={{ height: '52px', width: 'auto', objectFit: 'contain', borderRadius: '8px' }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: 'white', fontFamily: 'Cinzel, serif', letterSpacing: '3px' }}>MAXIM CODE</div>
            <div style={{ fontSize: '10px', color: 'hsl(43,71%,65%)', letterSpacing: '2px', textTransform: 'uppercase' }}>Building Future Innovators</div>
          </div>
        </div>
        {/* Contact Info */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '11px', color: 'hsl(215,30%,75%)', lineHeight: 1.8 }}>
            <div>https://maximcode.app</div>
            <div>codemaxim82@gmail.com</div>
            <div>Tamil Nadu, India</div>
          </div>
        </div>
      </div>

      {/* Gold accent line */}
      <div style={{ height: '3px', background: 'linear-gradient(90deg, hsl(43,71%,47%), hsl(43,90%,65%), hsl(43,71%,47%))' }} />

      {/* Content */}
      <div style={{ padding: '28px 44px' }}>
        {/* Document Label */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            display: 'inline-block',
            padding: '6px 24px',
            background: 'hsl(215,62%,22%)',
            color: 'white',
            fontSize: '13px',
            fontWeight: '700',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            borderRadius: '4px',
            fontFamily: 'Cinzel, serif',
          }}>
            Internship Offer Letter
          </div>
        </div>

        {/* Date & Ref */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <span style={{ fontSize: '11px', color: 'hsl(215,20%,50%)', fontWeight: '600' }}>Date: </span>
            <span style={{ fontSize: '11px', color: 'hsl(215,50%,20%)', fontWeight: '700' }}>{currentDate}</span>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'hsl(215,20%,50%)', fontWeight: '600' }}>Ref: </span>
            <span style={{ fontSize: '11px', color: 'hsl(43,60%,38%)', fontWeight: '700' }}>{data.certificateId}-OL</span>
          </div>
        </div>

        {/* Recipient */}
        <div style={{
          marginBottom: '18px',
          padding: '14px 16px',
          borderLeft: '4px solid hsl(43,71%,47%)',
          background: 'hsl(215,30%,98%)',
          borderRadius: '0 6px 6px 0',
        }}>
          <div style={{ fontSize: '14px', fontWeight: '700', color: 'hsl(215,62%,22%)' }}>To,</div>
          <div style={{ fontSize: '15px', fontWeight: '800', color: 'hsl(215,62%,18%)', fontFamily: 'Playfair Display, serif', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2px' }}>{data.name}</div>
          <div style={{ fontSize: '11px', color: 'hsl(215,20%,50%)', marginTop: '2px' }}>Intern Candidate</div>
        </div>

        {/* Subject */}
        <div style={{ marginBottom: '16px' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'hsl(215,50%,20%)', textDecoration: 'underline' }}>Subject: </span>
          <span style={{ fontSize: '12px', fontWeight: '600', color: 'hsl(215,50%,25%)' }}>
            Internship Offer for the Role of {data.role} — {data.domain}
          </span>
        </div>

        {/* Opening */}
        <div style={{ marginBottom: '14px' }}>
          <p style={{ fontSize: '12px', lineHeight: 1.8, color: 'hsl(215,20%,30%)', margin: '0 0 10px' }}>Dear <strong>{data.name}</strong>,</p>
          <p style={{ fontSize: '12px', lineHeight: 1.8, color: 'hsl(215,20%,30%)', margin: 0 }}>
            <strong>Greetings from Maxim Code!</strong>
          </p>
          <p style={{ fontSize: '12px', lineHeight: 1.8, color: 'hsl(215,20%,30%)', margin: '6px 0 0' }}>
            We are pleased to offer you the position of <strong>{data.role}</strong> in the domain of <strong>{data.domain}</strong> at Maxim Code. 
            After reviewing your profile, we are confident that you will be a valuable contributor to our internship program.
          </p>
        </div>

        {/* Details Table */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'hsl(215,62%,22%)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px', borderBottom: '2px solid hsl(43,71%,47%)', paddingBottom: '4px', display: 'inline-block' }}>
            Internship Details
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
            {[
              ['Role / Designation', data.role],
              ['Domain / Department', data.domain],
              ['Internship Program', data.internship],
              ['Commencement Date', formatDate(data.startDate)],
              ['Completion Date', formatDate(data.endDate)],
              ['Duration', data.duration],
              ['Work Mode', 'Remote / Hybrid'],
            ].map(([label, value], i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? 'hsl(215,30%,98%)' : 'white' }}>
                <td style={{ padding: '6px 12px', fontWeight: '600', color: 'hsl(215,20%,40%)', width: '40%', border: '1px solid hsl(215,20%,90%)' }}>{label}</td>
                <td style={{ padding: '6px 12px', color: 'hsl(215,50%,20%)', fontWeight: '700', border: '1px solid hsl(215,20%,90%)' }}>{value}</td>
              </tr>
            ))}
          </table>
        </div>

        {/* Responsibilities */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'hsl(215,62%,22%)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px', borderBottom: '2px solid hsl(43,71%,47%)', paddingBottom: '4px', display: 'inline-block' }}>
            Key Responsibilities
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
            {responsibilities.slice(0, 6).map((resp, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '10.5px', lineHeight: 1.6, color: 'hsl(215,20%,35%)' }}>
                <span style={{ color: 'hsl(43,71%,47%)', fontWeight: '900', marginTop: '1px', flexShrink: 0 }}>◆</span>
                <span>{resp}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Benefits */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'hsl(215,62%,22%)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px', borderBottom: '2px solid hsl(43,71%,47%)', paddingBottom: '4px', display: 'inline-block' }}>
            Internship Benefits
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {[
              'Internship Completion Certificate',
              'Live Project Exposure',
              'Expert Mentorship',
              'Skill Development',
              'Career Growth Opportunities',
              'Letter of Recommendation',
            ].map((benefit, i) => (
              <span key={i} style={{
                padding: '3px 10px',
                background: 'hsl(43,100%,94%)',
                border: '1px solid hsl(43,71%,65%)',
                borderRadius: '20px',
                fontSize: '10px',
                fontWeight: '600',
                color: 'hsl(43,60%,30%)',
              }}>
                ✓ {benefit}
              </span>
            ))}
          </div>
        </div>

        {/* Closing */}
        <p style={{ fontSize: '11.5px', lineHeight: 1.8, color: 'hsl(215,20%,35%)', marginBottom: '16px' }}>
          We welcome you to the <strong>Maxim Code Internship Program</strong> and look forward to your valuable contributions. 
          We wish you a productive learning experience and professional growth throughout your internship journey. 
          Please confirm your acceptance by reporting on the scheduled start date.
        </p>

        {/* Signature */}
        <div style={{ marginBottom: '10px' }}>
          <div style={{ fontSize: '11px', color: 'hsl(215,20%,40%)', marginBottom: '4px' }}>Yours sincerely,</div>
          <div style={{
            fontSize: '28px',
            fontFamily: 'Brush Script MT, cursive',
            color: 'hsl(215,62%,22%)',
            lineHeight: 1,
            marginBottom: '4px',
            borderBottom: '1px solid hsl(215,30%,70%)',
            paddingBottom: '4px',
            display: 'inline-block',
            minWidth: '140px',
          }}>
            S. Rahul
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'hsl(215,62%,22%)' }}>{OFFER_SIGNER.name}</div>
            <div style={{ fontSize: '11px', color: 'hsl(215,20%,50%)', fontWeight: '600' }}>{OFFER_SIGNER.title}</div>
            <div style={{ fontSize: '11px', color: 'hsl(43,71%,40%)', fontWeight: '600' }}>{OFFER_SIGNER.company}</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        background: 'hsl(215,62%,22%)',
        padding: '10px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 'auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img
            src={msmeLogoPath}
            alt="MSME"
            style={{ width: '30px', height: '30px', objectFit: 'contain', filter: 'brightness(10)' }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <span style={{ fontSize: '9px', color: 'hsl(215,30%,65%)', letterSpacing: '1px' }}>MSME REGISTERED ENTERPRISE</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '9px', color: 'hsl(215,30%,65%)', letterSpacing: '1px' }}>maximcode.app | codemaxim82@gmail.com</div>
        </div>
        <div style={{ fontSize: '9px', color: 'hsl(215,30%,65%)', letterSpacing: '1px' }}>Ref: {data.certificateId}-OL</div>
      </div>

      {/* Bottom accent */}
      <div style={{ height: '4px', background: 'linear-gradient(90deg, hsl(43,71%,47%), hsl(43,90%,65%), hsl(43,71%,47%))' }} />
    </div>
  );
}
