import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { toPng, toJpeg } from 'html-to-image';
import jsPDF from 'jspdf';
import { Button } from '@/components/ui/button';
import { Download, Image, FileImage, Printer, Share2, Link, FileDown, Loader2 } from 'lucide-react';

interface DownloadButtonsProps {
  documentId: string;
  documentName: string;
  verificationUrl?: string;
}

export default function DownloadButtons({ documentId, documentName, verificationUrl }: DownloadButtonsProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const getElement = () => document.getElementById(documentId);

  const handleDownloadPNG = async () => {
    setLoading('png');
    const el = getElement();
    if (!el) { toast.error('Document not found'); setLoading(null); return; }
    try {
      const dataUrl = await toPng(el, { quality: 1, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `${documentName}.png`;
      link.href = dataUrl;
      link.click();
      toast.success('PNG downloaded!');
    } catch {
      toast.error('Failed to download PNG. Please try again.');
    }
    setLoading(null);
  };

  const handleDownloadJPG = async () => {
    setLoading('jpg');
    const el = getElement();
    if (!el) { toast.error('Document not found'); setLoading(null); return; }
    try {
      const dataUrl = await toJpeg(el, { quality: 0.95, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `${documentName}.jpg`;
      link.href = dataUrl;
      link.click();
      toast.success('JPG downloaded!');
    } catch {
      toast.error('Failed to download JPG. Please try again.');
    }
    setLoading(null);
  };

  const handleDownloadPDF = async () => {
    setLoading('pdf');
    const el = getElement();
    if (!el) { toast.error('Document not found'); setLoading(null); return; }
    try {
      const dataUrl = await toPng(el, { quality: 1, pixelRatio: 2 });
      const isCertificate = documentId === 'certificate-document';
      const orientation = isCertificate ? 'l' : 'p';
      const pdf = new jsPDF({ orientation, unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${documentName}.pdf`);
      toast.success('PDF downloaded!');
    } catch {
      toast.error('Failed to download PDF. Please try again.');
    }
    setLoading(null);
  };

  const handlePrint = () => {
    const el = getElement();
    if (!el) { toast.error('Document not found'); return; }
    const printWindow = window.open('', '_blank');
    if (!printWindow) { toast.error('Popup blocked. Please allow popups.'); return; }
    printWindow.document.write(`
      <html>
        <head>
          <title>${documentName}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&family=Cinzel:wght@400;600;700&display=swap');
            body { margin: 0; padding: 0; }
            @page { margin: 0; }
          </style>
        </head>
        <body>${el.outerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 800);
    toast.success('Print dialog opened!');
  };

  const handleCopyLink = () => {
    if (!verificationUrl) return;
    navigator.clipboard.writeText(verificationUrl);
    toast.success('Verification link copied to clipboard!');
  };

  const handleShare = async () => {
    if (!verificationUrl) return;
    if (navigator.share) {
      await navigator.share({ title: documentName, url: verificationUrl });
    } else {
      navigator.clipboard.writeText(verificationUrl);
      toast.success('Link copied — share it anywhere!');
    }
  };

  const btnBase = "flex items-center gap-2 font-semibold text-sm h-9 px-4 rounded-lg transition-all";

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <Button
        onClick={handleDownloadPDF}
        disabled={!!loading}
        className={`${btnBase} bg-[hsl(215,62%,22%)] hover:bg-[hsl(215,70%,18%)] text-white`}
        size="sm"
      >
        {loading === 'pdf' ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
        PDF
      </Button>

      <Button
        onClick={handleDownloadPNG}
        disabled={!!loading}
        className={`${btnBase} bg-[hsl(43,71%,47%)] hover:bg-[hsl(43,71%,40%)] text-white`}
        size="sm"
      >
        {loading === 'png' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Image className="w-4 h-4" />}
        PNG
      </Button>

      <Button
        onClick={handleDownloadJPG}
        disabled={!!loading}
        variant="outline"
        className={`${btnBase} border-[hsl(215,30%,75%)] text-[hsl(215,50%,25%)] hover:bg-[hsl(215,30%,96%)]`}
        size="sm"
      >
        {loading === 'jpg' ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileImage className="w-4 h-4" />}
        JPG
      </Button>

      <Button
        onClick={handlePrint}
        disabled={!!loading}
        variant="outline"
        className={`${btnBase} border-[hsl(215,30%,75%)] text-[hsl(215,50%,25%)] hover:bg-[hsl(215,30%,96%)]`}
        size="sm"
      >
        <Printer className="w-4 h-4" />
        Print
      </Button>

      {verificationUrl && (
        <>
          <Button
            onClick={handleCopyLink}
            variant="outline"
            className={`${btnBase} border-[hsl(43,71%,60%)] text-[hsl(43,60%,35%)] hover:bg-[hsl(43,100%,95%)]`}
            size="sm"
          >
            <Link className="w-4 h-4" />
            Copy Link
          </Button>

          <Button
            onClick={handleShare}
            variant="outline"
            className={`${btnBase} border-[hsl(215,30%,75%)] text-[hsl(215,50%,25%)] hover:bg-[hsl(215,30%,96%)]`}
            size="sm"
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </>
      )}
    </div>
  );
}
