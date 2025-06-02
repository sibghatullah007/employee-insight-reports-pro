
import React, { useState } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { parseWeekHoursCSV, parseBilledHoursCSV, processEmployeeData } from '../utils/csvParser';
import { WeekHoursData, BilledHoursData, EmployeeReport } from '../types/Employee';

interface DualFileUploadProps {
  onDataProcessed: (reports: EmployeeReport[]) => void;
}

const DualFileUpload: React.FC<DualFileUploadProps> = ({ onDataProcessed }) => {
  const [week1HoursFile, setWeek1HoursFile] = useState<File | null>(null);
  const [week2HoursFile, setWeek2HoursFile] = useState<File | null>(null);
  const [week1BilledFile, setWeek1BilledFile] = useState<File | null>(null);
  const [week2BilledFile, setWeek2BilledFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFileUpload = (file: File, type: 'week1Hours' | 'week2Hours' | 'week1Billed' | 'week2Billed') => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Please upload CSV files only');
      return;
    }

    switch (type) {
      case 'week1Hours':
        setWeek1HoursFile(file);
        break;
      case 'week2Hours':
        setWeek2HoursFile(file);
        break;
      case 'week1Billed':
        setWeek1BilledFile(file);
        break;
      case 'week2Billed':
        setWeek2BilledFile(file);
        break;
    }
    setError('');
  };

  const processFiles = async () => {
    if (!week1HoursFile || !week2HoursFile || !week1BilledFile || !week2BilledFile) {
      setError('Please upload all four CSV files before processing');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const [week1Hours, week2Hours, week1Billed, week2Billed] = await Promise.all([
        parseWeekHoursCSV(week1HoursFile),
        parseWeekHoursCSV(week2HoursFile),
        parseBilledHoursCSV(week1BilledFile),
        parseBilledHoursCSV(week2BilledFile)
      ]);

      const reports = processEmployeeData(week1Hours, week2Hours, week1Billed, week2Billed);
      
      if (reports.length === 0) {
        setError('No valid employee data found in the CSV files');
      } else {
        onDataProcessed(reports);
      }
    } catch (err) {
      setError('Error processing CSV files. Please check the format.');
      console.error('CSV processing error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const FileUploadBox = ({ 
    title, 
    file, 
    onFileChange, 
    description 
  }: { 
    title: string; 
    file: File | null; 
    onFileChange: (file: File) => void;
    description: string;
  }) => (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
      <input
        type="file"
        accept=".csv"
        onChange={(e) => {
          const selectedFile = e.target.files?.[0];
          if (selectedFile) onFileChange(selectedFile);
        }}
        className="hidden"
        id={title.replace(/\s+/g, '-').toLowerCase()}
      />
      <label htmlFor={title.replace(/\s+/g, '-').toLowerCase()} className="cursor-pointer">
        <div className="flex flex-col items-center space-y-2">
          {file ? (
            <FileText className="h-8 w-8 text-green-600" />
          ) : (
            <Upload className="h-8 w-8 text-gray-400" />
          )}
          <div>
            <p className="text-sm font-medium text-gray-900">{title}</p>
            <p className="text-xs text-gray-500">{description}</p>
            {file && (
              <p className="text-xs text-green-600 mt-1">✓ {file.name}</p>
            )}
          </div>
        </div>
      </label>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Employee Data Files</h2>
        <p className="text-gray-600">Please upload all four CSV files to generate employee reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Week Hours Data</h3>
          <div className="space-y-4">
            <FileUploadBox
              title="Week 1 Hours"
              file={week1HoursFile}
              onFileChange={(file) => handleFileUpload(file, 'week1Hours')}
              description="Employee, Role, Clocked Time, Break Time, Total Time"
            />
            <FileUploadBox
              title="Week 2 Hours"
              file={week2HoursFile}
              onFileChange={(file) => handleFileUpload(file, 'week2Hours')}
              description="Employee, Role, Clocked Time, Break Time, Total Time"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Billed Hours Data</h3>
          <div className="space-y-4">
            <FileUploadBox
              title="Week 1 Billed Hours"
              file={week1BilledFile}
              onFileChange={(file) => handleFileUpload(file, 'week1Billed')}
              description="Technician, Job Totals, Billed Hours, Actual Hours, Efficiency, Labor Sales"
            />
            <FileUploadBox
              title="Week 2 Billed Hours"
              file={week2BilledFile}
              onFileChange={(file) => handleFileUpload(file, 'week2Billed')}
              description="Technician, Job Totals, Billed Hours, Actual Hours, Efficiency, Labor Sales"
            />
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={processFiles}
          disabled={isProcessing || !week1HoursFile || !week2HoursFile || !week1BilledFile || !week2BilledFile}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Processing Files...</span>
            </>
          ) : (
            <>
              <FileText className="h-4 w-4" />
              <span>Process Files & Generate Reports</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <p className="text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
};

export default DualFileUpload;
