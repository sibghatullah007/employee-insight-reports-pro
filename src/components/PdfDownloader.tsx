
import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { Employee } from '../types/Employee';
import { generateEmployeePDF } from '../utils/generatePdf';

interface PdfDownloaderProps {
  employee: Employee;
  elementId: string;
}

const PdfDownloader: React.FC<PdfDownloaderProps> = ({ employee, elementId }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      await generateEmployeePDF(employee, elementId);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating}
      className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isGenerating ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>Generating...</span>
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          <span>Download PDF</span>
        </>
      )}
    </button>
  );
};

export default PdfDownloader;
