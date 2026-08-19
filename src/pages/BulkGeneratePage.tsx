import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { toPng, toJpeg } from 'html-to-image';
import jsPDF from 'jspdf';
import JSZip from 'jszip';
import {
  ArrowLeft, Upload, Users, FileText, Award, Download,
  Loader2, CheckCircle, XCircle, Trash2, Plus, AlertCircle, FileDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import CertificateDocument from '@/components/features/CertificateDocument';
import OfferLetterDocument from '@/components/features/OfferLetterDocument';
import { generateDocumentData } from '@/lib/utils';
import { DOMAINS } from '@/constants';
import type { InternshipFormData, GeneratedDocumentData } from '@/types';

interface BulkRow extends InternshipFormData {
  id: string;
  status: 'pending' | 'processing' | 'done' | 'error';
  error?: string;
  docData?: GeneratedDocumentData;
}

const SAMPLE_CSV = `Name,Domain,Role,Internship,Start Date,End Date
Arjun Sharma,Web Development,Frontend Developer Intern,Full Stack Web Development,2024-01-15,2024-04-15
Priya Nair,AI/ML,ML Engineer Intern,Machine Learning Fundamentals,2024-02-01,2024-05-01
Rahul Verma,App Development,Flutter Developer Intern,Mobile App Development,2024-03-01,2024-06-01
Sneha Patel,Digital Marketing,Digital Marketing Intern,Social Media & SEO Campaign,2024-01-10,2024-04-10`;

function parseCSV(raw: string): { rows: Omit<BulkRow, 'id' | 'status'>[]; errors: string[] } {
  const lines = raw.trim().split('\n').filter(l => l.trim());
  const errors: string[] = [];
  const rows: Omit<BulkRow, 'id' | 'status'>[] = [];

  if (lines.length < 2) {
    errors.push('CSV must have a header row and at least one data row.');
    return { rows, errors };
  }

  const header = lines[0].split(',').map(h => h.trim().toLowerCase());
  const nameIdx = header.findIndex(h => h.includes('name'));
  const domainIdx = header.findIndex(h => h.includes('domain'));
  const roleIdx = header.findIndex(h => h.includes('role'));
  const internshipIdx = header.findIndex(h => h.includes('internship') || h.includes('program') || h.includes('course'));
  const startIdx = header.findIndex(h => h.includes('start'));
  const endIdx = header.findIndex(h => h.includes('end'));

  if ([nameIdx, domainIdx, roleIdx, internshipIdx, startIdx, endIdx].includes(-1)) {
    errors.push('Missing required columns. Expected: Name, Domain, Role, Internship, Start Date, End Date');
    return { rows, errors };
  }

  lines.slice(1).forEach((line, i) => {
    const cols = line.split(',').map(c => c.trim());
    const name = cols[nameIdx] || '';
    const domain = cols[domainIdx] || '';
    const role = cols[roleIdx] || '';
    const internship = cols[internshipIdx] || '';
    const startDate = cols[startIdx] || '';
    const endDate = cols[endIdx] || '';

    if (!name || !domain || !role || !internship || !startDate || !endDate) {
      errors.push(`Row ${i + 2}: Missing required fields.`);
      return;
    }

    rows.push({ name, domain, role, internship, startDate, endDate });
  });

  return { rows, errors };
}

export default function BulkGeneratePage() {
  const navigate = useNavigate();
  const [csvText, setCsvText] = useState('');
  const [rows, setRows] = useState<BulkRow[]>([]);
  const [isParsed, setIsParsed] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [activePreview, setActivePreview] = useState<{ row: BulkRow; type: 'certificate' | 'offer-letter' } | null>(null);
  const hiddenCertRef = useRef<HTMLDivElement>(null);
  const hiddenOfferRef = useRef<HTMLDivElement>(null);

  const handleLoadSample = () => {
    setCsvText(SAMPLE_CSV);
    toast.success('Sample CSV loaded!');
  };

  const handleParse = () => {
    const { rows: parsed, errors } = parseCSV(csvText);
    setParseErrors(errors);
    if (errors.length > 0 && parsed.length === 0) {
      toast.error('CSV parsing failed. Check errors below.');
      return;
    }
    const bulkRows: BulkRow[] = parsed.map((r, i) => ({
      ...r,
      id: `bulk-${Date.now()}-${i}`,
      status: 'pending',
    }));
    setRows(bulkRows);
    setIsParsed(true);
    toast.success(`${bulkRows.length} intern records loaded!`);
  };

  const handleRemoveRow = (id: string) => {
    setRows(prev => prev.filter(r => r.id !== id));
  };

  const handleGenerateAll = async () => {
    setIsGenerating(true);
    const updated = [...rows];
    for (let i = 0; i < updated.length; i++) {
      updated[i] = { ...updated[i], status: 'processing' };
      setRows([...updated]);
      await new Promise(r => setTimeout(r, 300));
      const docData = generateDocumentData({
        name: updated[i].name,
        domain: updated[i].domain,
        role: updated[i].role,
        internship: updated[i].internship,
        startDate: updated[i].startDate,
        endDate: updated[i].endDate,
      });
      updated[i] = { ...updated[i], status: 'done', docData };
      setRows([...updated]);
    }
    setIsGenerating(false);
    toast.success(`All ${updated.length} documents generated!`);
  };

  const generatedRows = rows.filter(r => r.status === 'done' && r.docData);

  const captureElement = async (el: HTMLElement, pixelRatio = 2): Promise<string> => {
    return toPng(el, { quality: 1, pixelRatio });
  };

  const handleDownloadAllZip = async (format: 'pdf' | 'png' | 'jpg') => {
    if (!generatedRows.length) return;
    setIsZipping(true);
    const zip = new JSZip();
    const certFolder = zip.folder('certificates')!;
    const offerFolder = zip.folder('offer-letters')!;

    for (const row of generatedRows) {
      if (!row.docData) continue;

      // Render cert hidden
      const certId = `bulk-cert-${row.id}`;
      const offerId = `bulk-offer-${row.id}`;

      // Wait for DOM to update
      await new Promise(r => setTimeout(r, 200));

      const certEl = document.getElementById(certId);
      const offerEl = document.getElementById(offerId);

      if (certEl && offerEl) {
        const safeName = row.name.replace(/\s+/g, '-');

        if (format === 'pdf') {
          const certPng = await captureElement(certEl);
          const pdf1 = new jsPDF({ orientation: 'l', unit: 'mm', format: 'a4' });
          pdf1.addImage(certPng, 'PNG', 0, 0, pdf1.internal.pageSize.getWidth(), pdf1.internal.pageSize.getHeight());
          certFolder.file(`${safeName}-Certificate.pdf`, pdf1.output('blob'));

          const offerPng = await captureElement(offerEl);
          const pdf2 = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
          pdf2.addImage(offerPng, 'PNG', 0, 0, pdf2.internal.pageSize.getWidth(), pdf2.internal.pageSize.getHeight());
          offerFolder.file(`${safeName}-OfferLetter.pdf`, pdf2.output('blob'));
        } else if (format === 'png') {
          const certPng = await captureElement(certEl);
          certFolder.file(`${safeName}-Certificate.png`, certPng.split(',')[1], { base64: true });
          const offerPng = await captureElement(offerEl);
          offerFolder.file(`${safeName}-OfferLetter.png`, offerPng.split(',')[1], { base64: true });
        } else {
          const certJpg = await toJpeg(certEl, { quality: 0.95, pixelRatio: 2 });
          certFolder.file(`${safeName}-Certificate.jpg`, certJpg.split(',')[1], { base64: true });
          const offerJpg = await toJpeg(offerEl, { quality: 0.95, pixelRatio: 2 });
          offerFolder.file(`${safeName}-OfferLetter.jpg`, offerJpg.split(',')[1], { base64: true });
        }
      }
    }

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MaximCode-BulkDocuments-${format.toUpperCase()}.zip`;
    a.click();
    URL.revokeObjectURL(url);
    setIsZipping(false);
    toast.success(`ZIP with all ${format.toUpperCase()} documents downloaded!`);
  };

  return (
    <div className="min-h-screen bg-[hsl(210,20%,97%)]">
      {/* Page Header */}
      <div className="bg-[hsl(215,62%,22%)] text-white">
        <div className="max-w-screen-xl mx-auto px-6 py-5">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-[hsl(215,30%,75%)] hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[hsl(43,71%,55%)]" />
                <h1 className="text-xl font-black tracking-widest" style={{ fontFamily: 'Cinzel, serif' }}>
                  BULK DOCUMENT GENERATOR
                </h1>
              </div>
              <p className="text-[hsl(215,20%,60%)] text-xs mt-0.5">
                Paste CSV data → Generate all certificates & offer letters → Download as ZIP
              </p>
            </div>
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-[hsl(215,62%,22%)] via-[hsl(43,71%,47%)] to-[hsl(215,62%,22%)]" />
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-8">
        {/* Step 1: CSV Input */}
        {!isParsed && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border bg-[hsl(215,30%,98%)]">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-[hsl(215,62%,22%)] text-lg flex items-center gap-2">
                      <Upload className="w-5 h-5 text-[hsl(43,71%,47%)]" />
                      Step 1: Paste CSV Data
                    </h2>
                    <p className="text-[hsl(215,20%,50%)] text-sm mt-1">
                      Required columns: <span className="font-mono text-xs bg-[hsl(215,20%,93%)] px-1 rounded">Name, Domain, Role, Internship, Start Date, End Date</span>
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLoadSample}
                    className="border-[hsl(43,71%,60%)] text-[hsl(43,60%,35%)] hover:bg-[hsl(43,100%,95%)]"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Load Sample
                  </Button>
                </div>
              </div>

              <div className="p-6">
                <Textarea
                  value={csvText}
                  onChange={e => setCsvText(e.target.value)}
                  placeholder={`Name,Domain,Role,Internship,Start Date,End Date\nArjun Sharma,Web Development,Frontend Developer Intern,Full Stack Web Development,2024-01-15,2024-04-15\n...`}
                  className="font-mono text-sm min-h-[220px] border-[hsl(215,20%,85%)] focus-visible:ring-[hsl(215,62%,22%)] resize-none"
                />

                {parseErrors.length > 0 && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    {parseErrors.map((e, i) => (
                      <div key={i} className="flex items-start gap-2 text-red-700 text-xs">
                        <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                        {e}
                      </div>
                    ))}
                  </div>
                )}

                {/* Domain hint */}
                <div className="mt-3 p-3 bg-[hsl(215,30%,97%)] border border-[hsl(215,20%,88%)] rounded-lg">
                  <p className="text-xs font-semibold text-[hsl(215,50%,30%)] mb-1">Supported Domains:</p>
                  <div className="flex flex-wrap gap-1">
                    {DOMAINS.map(d => (
                      <span key={d} className="text-xs bg-white border border-[hsl(215,20%,85%)] text-[hsl(215,30%,45%)] px-2 py-0.5 rounded">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleParse}
                  disabled={!csvText.trim()}
                  className="mt-4 w-full bg-[hsl(215,62%,22%)] hover:bg-[hsl(215,70%,18%)] text-white font-semibold py-5"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Parse & Load Interns
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Review & Generate */}
        {isParsed && (
          <div>
            {/* Action Bar */}
            <div className="bg-white rounded-xl border border-border shadow-sm px-5 py-3 mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[hsl(43,71%,47%)]" />
                  <span className="font-bold text-[hsl(215,50%,20%)]">{rows.length} Interns</span>
                </div>
                <span className="text-[hsl(215,20%,60%)] text-sm">·</span>
                <span className="text-[hsl(215,20%,50%)] text-sm">
                  {generatedRows.length} / {rows.length} generated
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setIsParsed(false); setRows([]); setParseErrors([]); }}
                  className="text-[hsl(215,20%,50%)] hover:text-red-600 text-xs"
                >
                  ← Edit CSV
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {generatedRows.length === 0 ? (
                  <Button
                    onClick={handleGenerateAll}
                    disabled={isGenerating || rows.length === 0}
                    className="bg-[hsl(215,62%,22%)] hover:bg-[hsl(215,70%,18%)] text-white font-semibold"
                  >
                    {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Award className="w-4 h-4 mr-2" />}
                    {isGenerating ? 'Generating...' : `Generate All ${rows.length} Documents`}
                  </Button>
                ) : (
                  <>
                    <span className="text-xs font-semibold text-green-700 flex items-center gap-1 mr-1">
                      <CheckCircle className="w-4 h-4" /> Ready to Download
                    </span>
                    <Button
                      onClick={() => handleDownloadAllZip('pdf')}
                      disabled={isZipping}
                      className="bg-[hsl(215,62%,22%)] hover:bg-[hsl(215,70%,18%)] text-white font-semibold text-sm"
                      size="sm"
                    >
                      {isZipping ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <FileDown className="w-4 h-4 mr-1" />}
                      ZIP (PDF)
                    </Button>
                    <Button
                      onClick={() => handleDownloadAllZip('png')}
                      disabled={isZipping}
                      className="bg-[hsl(43,71%,47%)] hover:bg-[hsl(43,71%,40%)] text-white font-semibold text-sm"
                      size="sm"
                    >
                      {isZipping ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Download className="w-4 h-4 mr-1" />}
                      ZIP (PNG)
                    </Button>
                    <Button
                      onClick={() => handleDownloadAllZip('jpg')}
                      disabled={isZipping}
                      variant="outline"
                      className="border-[hsl(215,30%,75%)] text-[hsl(215,50%,25%)] text-sm"
                      size="sm"
                    >
                      ZIP (JPG)
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Interns Table */}
            <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[hsl(215,30%,97%)] border-b border-border">
                    <th className="text-left px-4 py-3 font-semibold text-[hsl(215,50%,25%)] text-xs uppercase tracking-wide">#</th>
                    <th className="text-left px-4 py-3 font-semibold text-[hsl(215,50%,25%)] text-xs uppercase tracking-wide">Name</th>
                    <th className="text-left px-4 py-3 font-semibold text-[hsl(215,50%,25%)] text-xs uppercase tracking-wide">Domain</th>
                    <th className="text-left px-4 py-3 font-semibold text-[hsl(215,50%,25%)] text-xs uppercase tracking-wide">Role</th>
                    <th className="text-left px-4 py-3 font-semibold text-[hsl(215,50%,25%)] text-xs uppercase tracking-wide">Duration</th>
                    <th className="text-left px-4 py-3 font-semibold text-[hsl(215,50%,25%)] text-xs uppercase tracking-wide">Status</th>
                    <th className="text-left px-4 py-3 font-semibold text-[hsl(215,50%,25%)] text-xs uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={row.id} className="border-b border-[hsl(215,20%,93%)] hover:bg-[hsl(215,30%,98%)] transition-colors">
                      <td className="px-4 py-3 text-[hsl(215,20%,55%)] text-xs">{i + 1}</td>
                      <td className="px-4 py-3 font-semibold text-[hsl(215,50%,20%)]">{row.name}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 bg-[hsl(215,30%,96%)] border border-[hsl(215,20%,85%)] rounded text-xs text-[hsl(215,40%,35%)] font-medium">
                          {row.domain}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[hsl(215,20%,45%)] text-xs">{row.role}</td>
                      <td className="px-4 py-3 text-[hsl(215,20%,45%)] text-xs">
                        {row.startDate} → {row.endDate}
                      </td>
                      <td className="px-4 py-3">
                        {row.status === 'pending' && (
                          <span className="px-2 py-0.5 bg-[hsl(215,20%,94%)] text-[hsl(215,20%,50%)] rounded-full text-xs font-medium">Pending</span>
                        )}
                        {row.status === 'processing' && (
                          <span className="flex items-center gap-1 text-blue-600 text-xs font-medium">
                            <Loader2 className="w-3 h-3 animate-spin" /> Generating...
                          </span>
                        )}
                        {row.status === 'done' && (
                          <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
                            <CheckCircle className="w-3.5 h-3.5" /> Done
                          </span>
                        )}
                        {row.status === 'error' && (
                          <span className="flex items-center gap-1 text-red-600 text-xs font-medium">
                            <XCircle className="w-3.5 h-3.5" /> Error
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {row.status === 'done' && row.docData && (
                            <>
                              <button
                                onClick={() => setActivePreview({ row, type: 'certificate' })}
                                className="px-2 py-1 text-xs font-medium text-[hsl(215,50%,30%)] hover:bg-[hsl(215,30%,94%)] rounded flex items-center gap-1"
                              >
                                <Award className="w-3 h-3" /> Cert
                              </button>
                              <button
                                onClick={() => setActivePreview({ row, type: 'offer-letter' })}
                                className="px-2 py-1 text-xs font-medium text-[hsl(215,50%,30%)] hover:bg-[hsl(215,30%,94%)] rounded flex items-center gap-1"
                              >
                                <FileText className="w-3 h-3" /> Offer
                              </button>
                            </>
                          )}
                          {row.status !== 'processing' && (
                            <button
                              onClick={() => handleRemoveRow(row.id)}
                              className="p-1 text-[hsl(215,20%,65%)] hover:text-red-500 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Hidden render area for bulk export */}
            <div style={{ position: 'absolute', left: '-9999px', top: 0, pointerEvents: 'none', opacity: 0 }}>
              {generatedRows.map(row => row.docData && (
                <div key={row.id}>
                  <div id={`bulk-cert-${row.id}`}>
                    <CertificateDocument data={row.docData} />
                  </div>
                  <div id={`bulk-offer-${row.id}`}>
                    <OfferLetterDocument data={row.docData} />
                  </div>
                </div>
              ))}
            </div>

            {/* Individual Preview Modal */}
            {activePreview && activePreview.row.docData && (
              <div
                className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-auto"
                onClick={() => setActivePreview(null)}
              >
                <div
                  className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-[95vw]"
                  onClick={e => e.stopPropagation()}
                >
                  {/* Modal Header */}
                  <div className="bg-[hsl(215,62%,22%)] px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[hsl(43,71%,55%)] font-bold text-sm" style={{ fontFamily: 'Cinzel, serif' }}>
                        {activePreview.type === 'certificate' ? 'Certificate' : 'Offer Letter'} — {activePreview.row.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActivePreview(prev => prev ? { ...prev, type: 'certificate' } : null)}
                        className={`px-3 py-1 rounded text-xs font-semibold transition-all ${activePreview.type === 'certificate' ? 'bg-[hsl(43,71%,47%)] text-white' : 'text-[hsl(215,20%,70%)] hover:text-white'}`}
                      >
                        Certificate
                      </button>
                      <button
                        onClick={() => setActivePreview(prev => prev ? { ...prev, type: 'offer-letter' } : null)}
                        className={`px-3 py-1 rounded text-xs font-semibold transition-all ${activePreview.type === 'offer-letter' ? 'bg-[hsl(43,71%,47%)] text-white' : 'text-[hsl(215,20%,70%)] hover:text-white'}`}
                      >
                        Offer Letter
                      </button>
                      <button
                        onClick={() => setActivePreview(null)}
                        className="text-[hsl(215,20%,70%)] hover:text-white ml-2 text-lg leading-none"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* Document Preview */}
                  <div className="overflow-auto max-h-[80vh] p-4 bg-[hsl(210,20%,96%)]">
                    <div className="document-shadow rounded-lg overflow-hidden inline-block" style={{ transform: activePreview.type === 'certificate' ? 'scale(0.75)' : 'scale(0.85)', transformOrigin: 'top left' }}>
                      {activePreview.type === 'certificate'
                        ? <CertificateDocument data={activePreview.row.docData!} />
                        : <OfferLetterDocument data={activePreview.row.docData!} />
                      }
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
