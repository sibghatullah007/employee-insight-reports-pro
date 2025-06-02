
import React, { useState } from 'react';
import { FileText, Clock } from 'lucide-react';
import DualFileUpload from '../components/DualFileUpload';
import HoursReportViewer from '../components/HoursReportViewer';
import { EmployeeReport } from '../types/Employee';

const Index = () => {
  const [reports, setReports] = useState<EmployeeReport[]>([]);

  const handleDataProcessed = (processedReports: EmployeeReport[]) => {
    setReports(processedReports);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <Clock className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Employee Hours Report Generator
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your employee hours and billing CSV files to generate comprehensive payroll reports
          </p>
        </div>

        {/* Main Content */}
        {reports.length === 0 ? (
          <div className="max-w-4xl mx-auto">
            <DualFileUpload onDataProcessed={handleDataProcessed} />
            
            {/* Features Section */}
            <div className="mt-16 grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Dual CSV Upload</h3>
                <p className="text-gray-600">Upload week hours and billed hours CSV files for comprehensive reporting</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Auto Calculations</h3>
                <p className="text-gray-600">Automatically calculate worked hours, overtime, efficiency, and incentives</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">PDF Reports</h3>
                <p className="text-gray-600">Generate professional payroll reports with detailed breakdowns</p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-center mb-8">
              <button
                onClick={() => setReports([])}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <FileText className="h-4 w-4" />
                <span>Upload New Files</span>
              </button>
            </div>
            <HoursReportViewer reports={reports} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
