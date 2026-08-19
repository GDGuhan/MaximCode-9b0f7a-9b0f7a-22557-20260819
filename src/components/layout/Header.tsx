import { Link, useLocation } from 'react-router-dom';
import { Award, FileText, Home } from 'lucide-react';

export default function Header() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-[hsl(215,62%,22%)] shadow-lg">
      <div className="max-w-screen-xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-[hsl(43,71%,47%)] rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <span className="text-white font-black text-base" style={{ fontFamily: 'Cinzel, serif' }}>MC</span>
          </div>
          <div>
            <div className="text-white font-black text-lg tracking-widest" style={{ fontFamily: 'Cinzel, serif' }}>MAXIM CODE</div>
            <div className="text-[hsl(43,71%,65%)] text-[10px] tracking-widest uppercase font-semibold">Building Future Innovators</div>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          <Link
            to="/"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              location.pathname === '/'
                ? 'bg-[hsl(43,71%,47%)] text-white'
                : 'text-[hsl(215,30%,75%)] hover:text-white hover:bg-[hsl(215,50%,30%)]'
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:block">Generator</span>
          </Link>

          {location.pathname === '/documents' && (
            <>
              <Link
                to="/documents"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-[hsl(215,50%,30%)] text-[hsl(215,30%,85%)] hover:bg-[hsl(215,50%,35%)] transition-all"
              >
                <Award className="w-4 h-4 text-[hsl(43,71%,60%)]" />
                <span className="hidden sm:block">Certificate</span>
              </Link>
              <Link
                to="/documents"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-[hsl(215,30%,75%)] hover:text-white hover:bg-[hsl(215,50%,30%)] transition-all"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:block">Offer Letter</span>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
