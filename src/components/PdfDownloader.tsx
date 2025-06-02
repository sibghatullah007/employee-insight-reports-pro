
import React from 'react';
import { Download } from 'lucide-react';
import { generateEmployeePDF } from '../utils/generatePdf';
import { EmployeeReport } from '../types/Employee';

interface PdfDownloaderProps {
  employee: EmployeeReport;
  elementId: string;
}

const PdfDownloader: React.FC<PdfDownloaderProps> = ({ employee, elementId }) => {
  const handleDownload = () => {
    generateEmployeePDF(employee, elementId);
  };

  return (
    <button
      onClick={handleDownload}
      className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      <Download className="h-4 w-4" />
      <span>Download PDF Report</span>
    </button>
  );
};

export default PdfDownloader;
