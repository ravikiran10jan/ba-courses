"use client";

import { useRef } from "react";
import { Printer, Download } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { generateCertificateHTML } from "@/lib/utils/certificate";
import { getDashboardComponents } from "@/lib/content";

const cm = getDashboardComponents().certificateModal;

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  courseName: string;
  completionDate: string;
  certificateId: string;
}

export default function CertificateModal({
  isOpen,
  onClose,
  studentName,
  courseName,
  completionDate,
  certificateId,
}: CertificateModalProps) {
  const certificateRef = useRef<HTMLDivElement>(null);

  const certificateHTML = generateCertificateHTML(
    studentName,
    courseName,
    completionDate,
    certificateId
  );

  function handlePrint() {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Certificate - ${studentName}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;900&display=swap');
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              background: #000000;
              font-family: 'Montserrat', system-ui, sans-serif;
            }
            @media print {
              body { background: #000000; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>${certificateHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();

    // Wait for fonts to load before printing
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-4xl">
      <div className="space-y-6">
        {/* Certificate preview */}
        <div
          ref={certificateRef}
          className="overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: certificateHTML }}
        />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handlePrint}
            className="inline-flex items-center gap-2"
          >
            <Printer size={16} />
            {cm.printCertificate}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handlePrint}
            className="inline-flex items-center gap-2"
          >
            <Download size={16} />
            {cm.downloadPdf}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
