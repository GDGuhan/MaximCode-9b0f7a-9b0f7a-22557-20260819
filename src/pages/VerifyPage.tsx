import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  CheckCircle, XCircle, Award, Calendar, Briefcase,
  Tag, Clock, Globe, Mail, ArrowLeft, Loader2, QrCode,
  Shield, MapPin, BookOpen, Star, ListChecks, User2,
  Building2, BadgeCheck, Hash, Layers
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { formatDate, generateCertificateDescription } from '@/lib/utils';
import { getResponsibilitiesForDomain, COMPANY, FOUNDER } from '@/constants';
import msmeLogoPath from '@/assets/msme-logo.png';
import type { GeneratedDocumentData } from '@/types';

export default function VerifyPage() {
  const { certificateId } = useParams<{ certificateId: string }>();
  const [data, setData] = useState<GeneratedDocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [found, setFound] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const keyed = localStorage.getItem(`mc_cert_${certificateId}`);
      if (keyed) {
        setData(JSON.parse(keyed));
        setFound(true);
        setLoading(false);
        return;
      }
      const main = localStorage.getItem('maximcode_doc_data');
      if (main) {
        const parsed: GeneratedDocumentData = JSON.parse(main);
        if (parsed.certificateId === certificateId) {
          setData(parsed);
          setFound(true);
          setLoading(false);
          return;
        }
      }
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('mc_cert_')) {
          try {
            const val: GeneratedDocumentData = JSON.parse(localStorage.getItem(key)!);
            if (val.certificateId === certificateId) {
              setData(val);
              setFound(true);
              setLoading(false);
              return;
            }
          } catch { /* skip */ }
        }
      }
      setFound(false);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [certificateId]);

  // ─── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[hsl(215,62%,22%)] via-[hsl(215,50%,18%)] to-[hsl(215,70%,12%)] flex items-center justify-center">
        <div className="text-center max-w-sm px-6">
          <div className="w-20 h-20 rounded-full bg-white/10 border-2 border-[hsl(43,71%,55%)] flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Shield className="w-9 h-9 text-[hsl(43,71%,55%)] animate-pulse" />
          </div>
          <div className="flex items-center justify-center gap-2 text-white/80 mb-3">
            <Loader2 className="w-4 h-4 animate-spin text-[hsl(43,71%,55%)]" />
            <span className="text-sm font-semibold tracking-wide">Verifying Certificate…</span>
          </div>
          <p className="text-white/40 text-xs mb-4">Checking Maxim Code records</p>
          <code className="text-xs text-[hsl(43,71%,60%)] bg-white/10 px-4 py-2 rounded-full font-mono border border-white/20">
            {certificateId}
          </code>
        </div>
      </div>
    );
  }

  // ─── Not Found ────────────────────────────────────────────────────────────
  if (!found || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[hsl(215,62%,22%)] via-[hsl(215,50%,18%)] to-[hsl(215,70%,12%)] flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-red-700 to-red-600 px-8 py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-white/15 flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-9 h-9 text-white" />
              </div>
              <h1 className="text-white font-black text-xl tracking-widest mb-2" style={{ fontFamily: 'Cinzel, serif' }}>
                NOT VERIFIED
              </h1>
              <p className="text-red-200 text-sm">Certificate not found in our records</p>
            </div>
            <div className="px-8 py-7 text-center">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5">
                <p className="text-red-800 text-xs font-bold uppercase tracking-wide mb-2">Certificate ID Checked</p>
                <code className="text-red-700 text-sm font-mono bg-red-100 px-3 py-1.5 rounded-lg block">{certificateId}</code>
                <p className="text-red-500 text-xs mt-2">This ID does not match any issued certificate.</p>
              </div>
              <p className="text-[hsl(215,15%,50%)] text-xs leading-relaxed mb-6">
                If you believe this is an error, please contact Maxim Code at{' '}
                <a href="mailto:codemaxim82@gmail.com" className="text-[hsl(215,62%,35%)] font-semibold hover:underline">
                  codemaxim82@gmail.com
                </a>
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[hsl(215,62%,22%)] text-white rounded-xl text-sm font-semibold hover:bg-[hsl(215,70%,18%)] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Maxim Code
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Verified ─────────────────────────────────────────────────────────────
  const description = generateCertificateDescription(data);
  const responsibilities = getResponsibilitiesForDomain(data.domain, data.role);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(215,62%,22%)] via-[hsl(215,50%,18%)] to-[hsl(215,70%,12%)]">
      {/* Top nav bar */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[hsl(43,71%,47%)] flex items-center justify-center">
              <span className="text-[hsl(215,62%,22%)] text-xs font-black" style={{ fontFamily: 'Cinzel, serif' }}>MC</span>
            </div>
            <span className="text-white font-bold text-sm tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>MAXIM CODE</span>
          </div>
          <div className="flex items-center gap-1.5 bg-green-500/20 border border-green-400/30 rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-300 text-xs font-bold tracking-wider">VERIFIED</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 pb-16">

        {/* ── Hero Verified Card ─────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-5">
          {/* Gold top bar */}
          <div className="h-1.5 bg-gradient-to-r from-[hsl(43,71%,47%)] via-[hsl(43,90%,65%)] to-[hsl(43,71%,47%)]" />

          {/* Banner */}
          <div
            className="relative px-8 py-8 text-center overflow-hidden"
            style={{ background: 'linear-gradient(135deg, hsl(215,62%,22%) 0%, hsl(215,45%,32%) 100%)' }}
          >
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: 'repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)',
                backgroundSize: '12px 12px',
              }}
            />
            <div className="relative z-10 flex flex-col items-center">
              {/* Big verified icon */}
              <div className="w-20 h-20 rounded-full bg-green-500 shadow-xl ring-4 ring-green-400/40 flex items-center justify-center mb-4">
                <BadgeCheck className="w-11 h-11 text-white" strokeWidth={2} />
              </div>
              <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-400/40 rounded-full px-5 py-1.5 mb-4">
                <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                <span className="text-green-300 text-xs font-black tracking-widest uppercase">Certificate Authenticity Confirmed</span>
              </div>
              <h1 className="text-4xl font-black text-white tracking-wide mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                {data.name}
              </h1>
              <p className="text-[hsl(43,71%,65%)] text-sm font-semibold tracking-widest uppercase">{data.role}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-white/80 text-xs font-medium">
                  {data.domain}
                </span>
                <span className="px-3 py-1 bg-[hsl(43,71%,47%,0.2)] border border-[hsl(43,71%,55%,0.4)] rounded-full text-[hsl(43,71%,65%)] text-xs font-bold font-mono">
                  {data.certificateId}
                </span>
              </div>
            </div>
          </div>

          {/* Issue Date + Duration strip */}
          <div className="grid grid-cols-3 divide-x divide-[hsl(215,20%,90%)] border-b border-[hsl(215,20%,90%)]">
            {[
              { label: 'Issue Date', value: data.issueDate },
              { label: 'Duration', value: data.duration },
              { label: 'Work Mode', value: 'Remote / Hybrid' },
            ].map(({ label, value }) => (
              <div key={label} className="py-3 text-center">
                <p className="text-[9px] font-bold text-[hsl(215,20%,55%)] uppercase tracking-widest mb-0.5">{label}</p>
                <p className="text-xs font-bold text-[hsl(215,50%,20%)]">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Full Details Grid ──────────────────────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-5 mb-5">

          {/* Intern Profile Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="px-5 py-3 border-b border-[hsl(215,20%,92%)] flex items-center gap-2 bg-[hsl(215,30%,98%)]">
              <User2 className="w-4 h-4 text-[hsl(215,62%,22%)]" />
              <h3 className="font-bold text-[hsl(215,62%,22%)] text-sm uppercase tracking-wide">Intern Profile</h3>
            </div>
            <div className="p-5 space-y-3">
              {[
                { icon: User2, label: 'Full Name', value: data.name },
                { icon: Briefcase, label: 'Role / Designation', value: data.role },
                { icon: Tag, label: 'Domain', value: data.domain },
                { icon: BookOpen, label: 'Program / Course', value: data.internship },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[hsl(215,30%,95%)] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-3.5 h-3.5 text-[hsl(43,71%,47%)]" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-[hsl(215,20%,55%)] uppercase tracking-wider">{label}</p>
                    <p className="text-sm font-semibold text-[hsl(215,50%,20%)] leading-snug">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Internship Timeline Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="px-5 py-3 border-b border-[hsl(215,20%,92%)] flex items-center gap-2 bg-[hsl(215,30%,98%)]">
              <Calendar className="w-4 h-4 text-[hsl(215,62%,22%)]" />
              <h3 className="font-bold text-[hsl(215,62%,22%)] text-sm uppercase tracking-wide">Internship Timeline</h3>
            </div>
            <div className="p-5">
              {/* Timeline visual */}
              <div className="flex items-center gap-2 mb-5">
                <div className="flex-1 text-center">
                  <div className="w-10 h-10 rounded-full bg-[hsl(215,62%,22%)] flex items-center justify-center mx-auto mb-1 shadow-md">
                    <Calendar className="w-4 h-4 text-[hsl(43,71%,55%)]" />
                  </div>
                  <p className="text-[9px] font-bold text-[hsl(215,20%,50%)] uppercase tracking-wide">Start Date</p>
                  <p className="text-xs font-bold text-[hsl(215,50%,20%)] mt-0.5">{formatDate(data.startDate)}</p>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-full h-0.5 bg-gradient-to-r from-[hsl(215,62%,22%)] to-[hsl(43,71%,47%)] mb-1" />
                  <span className="text-[10px] font-bold text-[hsl(43,60%,40%)] bg-[hsl(43,100%,95%)] border border-[hsl(43,71%,70%)] rounded-full px-2 py-0.5">
                    {data.duration}
                  </span>
                </div>
                <div className="flex-1 text-center">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-1 shadow-md">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-[9px] font-bold text-[hsl(215,20%,50%)] uppercase tracking-wide">End Date</p>
                  <p className="text-xs font-bold text-[hsl(215,50%,20%)] mt-0.5">{formatDate(data.endDate)}</p>
                </div>
              </div>

              <div className="space-y-2.5 mt-4">
                {[
                  { icon: Hash, label: 'Certificate ID', value: data.certificateId, mono: true, gold: true },
                  { icon: Calendar, label: 'Issue Date', value: data.issueDate, mono: false, gold: false },
                  { icon: Clock, label: 'Work Mode', value: 'Remote / Hybrid', mono: false, gold: false },
                  { icon: Building2, label: 'Organisation', value: 'Maxim Code', mono: false, gold: false },
                  { icon: MapPin, label: 'Location', value: 'Tamil Nadu, India', mono: false, gold: false },
                ].map(({ icon: Icon, label, value, mono, gold }) => (
                  <div key={label} className="flex items-center justify-between py-1.5 border-b border-[hsl(215,20%,93%)] last:border-0">
                    <div className="flex items-center gap-2">
                      <Icon className="w-3 h-3 text-[hsl(43,71%,47%)]" />
                      <span className="text-[10px] font-semibold text-[hsl(215,20%,50%)]">{label}</span>
                    </div>
                    <span className={`text-xs font-bold ${gold ? 'text-[hsl(43,60%,38%)]' : 'text-[hsl(215,50%,20%)]'} ${mono ? 'font-mono' : ''}`}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Certificate Description ────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-5">
          <div className="px-5 py-3 border-b border-[hsl(215,20%,92%)] flex items-center gap-2 bg-[hsl(215,30%,98%)]">
            <Award className="w-4 h-4 text-[hsl(43,71%,47%)]" />
            <h3 className="font-bold text-[hsl(215,62%,22%)] text-sm uppercase tracking-wide">Certificate Description</h3>
          </div>
          <div className="p-5">
            <div className="bg-[hsl(215,30%,98%)] border-l-4 border-[hsl(43,71%,47%)] rounded-r-xl p-4">
              <p className="text-sm text-[hsl(215,20%,30%)] leading-relaxed italic">
                "{description}"
              </p>
            </div>
          </div>
        </div>

        {/* ── Skills Acquired ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-5">
          <div className="px-5 py-3 border-b border-[hsl(215,20%,92%)] flex items-center gap-2 bg-[hsl(215,30%,98%)]">
            <Star className="w-4 h-4 text-[hsl(43,71%,47%)]" />
            <h3 className="font-bold text-[hsl(215,62%,22%)] text-sm uppercase tracking-wide">Skills & Competencies Acquired</h3>
          </div>
          <div className="p-5">
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, i) => (
                <span
                  key={skill}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[hsl(43,100%,96%)] border border-[hsl(43,71%,70%)] rounded-full text-xs font-semibold text-[hsl(215,62%,22%)]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[hsl(43,71%,47%)]" />
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Responsibilities ────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-5">
          <div className="px-5 py-3 border-b border-[hsl(215,20%,92%)] flex items-center gap-2 bg-[hsl(215,30%,98%)]">
            <ListChecks className="w-4 h-4 text-[hsl(215,62%,22%)]" />
            <h3 className="font-bold text-[hsl(215,62%,22%)] text-sm uppercase tracking-wide">Key Responsibilities Handled</h3>
          </div>
          <div className="p-5">
            <div className="grid sm:grid-cols-2 gap-2.5">
              {responsibilities.map((resp, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 bg-[hsl(215,30%,98%)] rounded-xl border border-[hsl(215,20%,92%)]">
                  <div className="w-5 h-5 rounded-full bg-[hsl(215,62%,22%)] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[hsl(43,71%,55%)] text-[8px] font-black">{i + 1}</span>
                  </div>
                  <p className="text-xs text-[hsl(215,20%,35%)] leading-relaxed">{resp}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Verification + QR ───────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-5">
          <div className="px-5 py-3 border-b border-[hsl(215,20%,92%)] flex items-center gap-2 bg-[hsl(215,30%,98%)]">
            <QrCode className="w-4 h-4 text-[hsl(215,62%,22%)]" />
            <h3 className="font-bold text-[hsl(215,62%,22%)] text-sm uppercase tracking-wide">Verification Details</h3>
          </div>
          <div className="p-5">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* QR Code */}
              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <div className="p-3 bg-white border-2 border-[hsl(43,71%,60%)] rounded-xl shadow-md">
                  <QRCodeSVG
                    value={data.verificationUrl}
                    size={120}
                    bgColor="#ffffff"
                    fgColor="hsl(215,62%,22%)"
                    level="H"
                  />
                </div>
                <span className="text-[9px] font-bold text-[hsl(215,20%,50%)] uppercase tracking-wider">Scan to Verify</span>
              </div>

              {/* Info */}
              <div className="flex-1 space-y-3">
                <div>
                  <p className="text-[9px] font-bold text-[hsl(215,20%,50%)] uppercase tracking-wider mb-1">Certificate ID</p>
                  <code className="text-base font-black text-[hsl(43,60%,38%)] font-mono bg-[hsl(43,100%,95%)] px-3 py-1 rounded-lg border border-[hsl(43,71%,70%)] inline-block">
                    {data.certificateId}
                  </code>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-[hsl(215,20%,50%)] uppercase tracking-wider mb-1">Verification URL</p>
                  <code className="text-[10px] text-[hsl(215,50%,30%)] bg-[hsl(215,30%,97%)] px-3 py-2 rounded-lg border border-[hsl(215,20%,88%)] block break-all font-mono leading-relaxed">
                    {data.verificationUrl}
                  </code>
                </div>
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-green-800 text-xs font-bold">Authenticity Verified</p>
                    <p className="text-green-600 text-[10px]">This certificate is genuine and issued by Maxim Code.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Issued By / Organization ────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-5">
          <div className="px-5 py-3 border-b border-[hsl(215,20%,92%)] flex items-center gap-2 bg-[hsl(215,30%,98%)]">
            <Layers className="w-4 h-4 text-[hsl(215,62%,22%)]" />
            <h3 className="font-bold text-[hsl(215,62%,22%)] text-sm uppercase tracking-wide">Issued By</h3>
          </div>
          <div className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[hsl(215,62%,22%)] to-[hsl(215,50%,35%)] flex items-center justify-center shadow-md flex-shrink-0">
                  <span className="text-[hsl(43,71%,47%)] text-xl font-black" style={{ fontFamily: 'Cinzel, serif' }}>MC</span>
                </div>
                <div>
                  <p className="font-black text-[hsl(215,62%,22%)] text-base tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>MAXIM CODE</p>
                  <p className="text-[hsl(43,60%,40%)] text-xs font-semibold tracking-wide">Building Future Innovators</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3 h-3 text-[hsl(215,20%,55%)]" />
                    <span className="text-[10px] text-[hsl(215,20%,55%)]">Tamil Nadu, India · MSME Registered</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 sm:items-end">
                <div className="flex items-center gap-1.5">
                  <Globe className="w-3 h-3 text-[hsl(215,20%,55%)]" />
                  <a href="https://maximcode.app" target="_blank" rel="noopener noreferrer" className="text-xs text-[hsl(215,62%,35%)] font-semibold hover:underline">
                    maximcode.app
                  </a>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-[hsl(215,20%,55%)]" />
                  <a href="mailto:codemaxim82@gmail.com" className="text-xs text-[hsl(215,62%,35%)] font-semibold hover:underline">
                    codemaxim82@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <img
                    src={msmeLogoPath}
                    alt="MSME"
                    className="w-6 h-6 object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <span className="text-[9px] text-[hsl(215,20%,55%)] font-semibold uppercase tracking-wider">MSME Registered Enterprise</span>
                </div>
              </div>
            </div>

            {/* Authorized Signatory */}
            <div className="mt-5 pt-4 border-t border-[hsl(215,20%,92%)] flex items-end gap-4">
              <div>
                <p className="text-[9px] font-bold text-[hsl(215,20%,50%)] uppercase tracking-wider mb-1">Authorized Signatory</p>
                <p className="text-lg font-black text-[hsl(215,62%,22%)]" style={{ fontFamily: 'Brush Script MT, cursive', fontSize: '24px' }}>
                  {FOUNDER.name}
                </p>
                <p className="text-xs font-bold text-[hsl(215,62%,22%)]">{FOUNDER.name}</p>
                <p className="text-[10px] text-[hsl(215,20%,50%)]">{FOUNDER.title}</p>
              </div>
              <div className="ml-auto text-right">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-xl">
                  <Shield className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-green-700 text-[10px] font-bold">Digitally Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-2">
          <p className="text-white/40 text-[10px] mb-3">
            © {new Date().getFullYear()} Maxim Code · All Rights Reserved · Tamil Nadu, India
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Maxim Code Document Generator
          </Link>
        </div>
      </div>
    </div>
  );
}
