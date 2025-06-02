
import React, { useCallback, useState } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { parseCSV } from '../utils/csvParser';
import { Employee } from '../types/Employee';

interface FileUploadProps {
  onDataParsed: (employees: Employee[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onDataParsed }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Please upload a CSV file only');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const employees = await parseCSV(file);
      if (employees.length === 0) {
        setError('No valid employee data found in the CSV file');
      } else {
        onDataParsed(employees);
      }
    } catch (err) {
      setError('Error parsing CSV file. Please check the format.');
      console.error('CSV parsing error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [onDataParsed]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          isDragOver
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isLoading}
        />
        
        <div className="flex flex-col items-center space-y-4">
          {isLoading ? (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          ) : (
            <Upload className="h-12 w-12 text-gray-400" />
          )}
          
          <div>
            <p className="text-lg font-medium text-gray-900">
              {isLoading ? 'Processing CSV...' : 'Upload Employee Data CSV'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Drag and drop your CSV file here, or click to browse
            </p>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <FileText className="h-4 w-4" />
            <span>Supported format: .csv</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="mt-6 text-sm text-gray-600">
        <p className="font-medium mb-2">Expected CSV format:</p>
        <div className="bg-gray-50 p-3 rounded border">
          <code className="text-xs">
            Name, Department, Designation, Salary, Attendance (%), Performance (1-10)
          </code>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
