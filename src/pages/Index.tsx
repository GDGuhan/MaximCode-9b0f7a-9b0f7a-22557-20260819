import { Link } from 'react-router-dom';
import heroBanner from '@/assets/hero-banner.jpg';
import DocumentForm from '@/components/forms/DocumentForm';
import { Award, FileText, QrCode, Download, Shield, Zap, Users } from 'lucide-react';

const features = [
  { icon: Award, label: 'Completion Certificate', desc: 'A4 Landscape, MSME-style corporate design' },
  { icon: FileText, label: 'Offer Letter', desc: 'A4 Portrait, single-page professional format' },
  { icon: QrCode, label: 'QR Verification', desc: 'Unique certificate ID with scan-to-verify' },
  { icon: Download, label: 'Multi-Format Export', desc: 'PDF, PNG, JPG download + Print support' },
  { icon: Shield, label: 'MSME Branded', desc: 'Government-registered enterprise branding' },
  { icon: Zap, label: 'Instant Generation', desc: 'Auto-fill skills, responsibilities & description' },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Hero Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroBanner}
            alt="Document Generator"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(215,62%,22%)] via-[hsl(215,50%,18%)] to-[hsl(215,70%,12%)]" style={{ opacity: 0.92 }} />
        </div>

        <div className="relative z-10 max-w-screen-xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left — Text */}
            <div>
              <div className="inline-flex items-center gap-2 bg-[hsl(43,71%,47%,0.15)] border border-[hsl(43,71%,47%,0.4)] rounded-full px-4 py-1.5 mb-6">
                <Zap className="w-3.5 h-3.5 text-[hsl(43,71%,55%)]" />
                <span className="text-[hsl(43,71%,65%)] text-xs font-semibold tracking-wider uppercase">AI-Powered Document System</span>
              </div>

              <h1
                className="text-5xl lg:text-6xl font-black text-white leading-tight mb-4"
                style={{ fontFamily: 'Cinzel, serif', letterSpacing: '2px' }}
              >
                MAXIM CODE
                <span className="block text-3xl lg:text-4xl mt-1" style={{ color: 'hsl(43,71%,55%)' }}>
                  Document Generator
                </span>
              </h1>

              <p className="text-[hsl(215,30%,78%)] text-lg leading-relaxed mb-8 max-w-lg">
                Generate professional <strong className="text-white">Internship Completion Certificates</strong> and{' '}
                <strong className="text-white">Offer Letters</strong> instantly — MSME-branded, QR-verified, and ready to download.
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-2 mb-8">
                {['Certificate + Offer Letter', 'PDF / PNG / JPG', 'QR Verification', 'Print Ready'].map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs text-white/80 font-medium">
                    ✓ {tag}
                  </span>
                ))}
              </div>

              {/* Bulk Generate CTA */}
              <div className="mb-6">
                <Link
                  to="/bulk"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/30 hover:border-[hsl(43,71%,55%)] rounded-xl text-white text-sm font-semibold transition-all"
                >
                  <Users className="w-4 h-4 text-[hsl(43,71%,55%)]" />
                  Bulk Generate — Multiple Interns via CSV
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8">
                {[
                  { value: '2', label: 'Documents Generated' },
                  { value: '10+', label: 'Domain Support' },
                  { value: '4', label: 'Export Formats' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-3xl font-black text-[hsl(43,71%,55%)]" style={{ fontFamily: 'Cinzel, serif' }}>{stat.value}</div>
                    <div className="text-xs text-[hsl(215,20%,60%)] font-medium mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Form */}
            <div>
              <DocumentForm />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-[hsl(215,62%,22%)] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              Everything You Need
            </h2>
            <p className="text-[hsl(215,20%,50%)] text-sm">Corporate-grade documents generated in seconds</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {features.map((f) => (
              <div
                key={f.label}
                className="p-5 rounded-xl border border-[hsl(215,20%,90%)] hover:border-[hsl(43,71%,60%)] hover:shadow-md transition-all group bg-white"
              >
                <div className="w-10 h-10 rounded-lg bg-[hsl(215,62%,22%)] flex items-center justify-center mb-3 group-hover:bg-[hsl(43,71%,47%)] transition-colors">
                  <f.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-[hsl(215,50%,20%)] text-sm mb-1">{f.label}</h3>
                <p className="text-[hsl(215,15%,55%)] text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[hsl(215,62%,22%)] text-[hsl(215,30%,70%)] py-8">
        <div className="max-w-screen-xl mx-auto px-6 text-center">
          <div className="text-[hsl(43,71%,55%)] font-black text-lg tracking-widest mb-1" style={{ fontFamily: 'Cinzel, serif' }}>
            MAXIM CODE
          </div>
          <p className="text-xs tracking-widest uppercase mb-3 text-[hsl(215,20%,55%)]">Building Future Innovators</p>
          <p className="text-xs text-[hsl(215,20%,50%)]">© {new Date().getFullYear()} Maxim Code. All rights reserved. | S. Prashant, Maxim Code</p>
        </div>
      </footer>
    </div>
  );
}
