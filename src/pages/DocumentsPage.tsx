import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Award, FileText, ArrowLeft, CheckCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CertificateDocument from '@/components/features/CertificateDocument';
import OfferLetterDocument from '@/components/features/OfferLetterDocument';
import DownloadButtons from '@/components/features/DownloadButtons';
import type { GeneratedDocumentData } from '@/types';

type Tab = 'certificate' | 'offer-letter';

export default function DocumentsPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<GeneratedDocumentData | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('certificate');
  const certRef = useRef<HTMLDivElement>(null);
  const offerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('maximcode_doc_data');
    if (!stored) {
      toast.error('No document data found. Please fill the form first.');
      navigate('/');
      return;
    }
    setData(JSON.parse(stored));
  }, [navigate]);

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[hsl(215,62%,22%)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[hsl(215,20%,50%)]">Loading documents...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[hsl(210,20%,97%)]">
      {/* Page Header */}
      <div className="bg-white border-b border-border shadow-sm">
        <div className="max-w-screen-xl mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/')}
                className="border-[hsl(215,30%,80%)] text-[hsl(215,50%,30%)] hover:bg-[hsl(215,30%,96%)]"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                New Document
              </Button>
              <div>
                <h1 className="font-bold text-[hsl(215,62%,22%)] text-lg" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Generated Documents
                </h1>
                <p className="text-[hsl(215,20%,50%)] text-xs">
                  For <span className="font-semibold text-[hsl(215,50%,25%)]">{data.name}</span>
                  {' '} · <span className="text-[hsl(43,60%,38%)] font-semibold">{data.certificateId}</span>
                </p>
              </div>
            </div>

            {/* Verification badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-green-700 text-xs font-semibold">Verification Ready</span>
              <a
                href={data.verificationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-800 ml-1"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4">
            <button
              onClick={() => setActiveTab('certificate')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'certificate'
                  ? 'bg-[hsl(215,62%,22%)] text-white shadow-sm'
                  : 'text-[hsl(215,20%,50%)] hover:bg-[hsl(215,20%,94%)]'
              }`}
            >
              <Award className="w-4 h-4" />
              Completion Certificate
            </button>
            <button
              onClick={() => setActiveTab('offer-letter')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'offer-letter'
                  ? 'bg-[hsl(215,62%,22%)] text-white shadow-sm'
                  : 'text-[hsl(215,20%,50%)] hover:bg-[hsl(215,20%,94%)]'
              }`}
            >
              <FileText className="w-4 h-4" />
              Offer Letter
            </button>
          </div>
        </div>
      </div>

      {/* Document View */}
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        {activeTab === 'certificate' && (
          <div>
            {/* Download Bar */}
            <div className="bg-white rounded-xl border border-border shadow-sm px-5 py-3 mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-2 mr-2">
                <Award className="w-4 h-4 text-[hsl(43,71%,47%)]" />
                <span className="font-semibold text-[hsl(215,50%,20%)] text-sm">Certificate Export:</span>
              </div>
              <DownloadButtons
                documentId="certificate-document"
                documentName={`MaximCode-Certificate-${data.name.replace(/\s/g, '-')}`}
                verificationUrl={data.verificationUrl}
              />
            </div>

            {/* Certificate Preview */}
            <div className="overflow-x-auto">
              <div className="document-shadow rounded-lg overflow-hidden inline-block min-w-full" style={{ maxWidth: '100%' }}>
                <div style={{ transform: 'scale(1)', transformOrigin: 'top left' }}>
                  <CertificateDocument data={data} printRef={certRef} />
                </div>
              </div>
            </div>

            {/* Verification Info */}
            <div className="mt-6 bg-white rounded-xl border border-[hsl(43,71%,75%)] p-4">
              <p className="text-xs font-semibold text-[hsl(43,60%,35%)] mb-1 uppercase tracking-wide">Verification URL</p>
              <code className="text-sm text-[hsl(215,50%,30%)] bg-[hsl(215,30%,97%)] px-3 py-1.5 rounded-lg block break-all">
                {data.verificationUrl}
              </code>
            </div>
          </div>
        )}

        {activeTab === 'offer-letter' && (
          <div>
            {/* Download Bar */}
            <div className="bg-white rounded-xl border border-border shadow-sm px-5 py-3 mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-2 mr-2">
                <FileText className="w-4 h-4 text-[hsl(215,62%,35%)]" />
                <span className="font-semibold text-[hsl(215,50%,20%)] text-sm">Offer Letter Export:</span>
              </div>
              <DownloadButtons
                documentId="offer-letter-document"
                documentName={`MaximCode-OfferLetter-${data.name.replace(/\s/g, '-')}`}
              />
            </div>

            {/* Offer Letter Preview */}
            <div className="flex justify-center">
              <div className="document-shadow rounded-lg overflow-hidden inline-block">
                <OfferLetterDocument data={data} printRef={offerRef} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
