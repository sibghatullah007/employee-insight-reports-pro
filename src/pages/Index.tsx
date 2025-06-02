
import React, { useState } from 'react';
import { FileText, Users } from 'lucide-react';
import FileUpload from '../components/FileUpload';
import ReportViewer from '../components/ReportViewer';
import { Employee } from '../types/Employee';

const Index = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  const handleDataParsed = (parsedEmployees: Employee[]) => {
    setEmployees(parsedEmployees);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Employee Report Generator
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your employee CSV file to generate professional performance reports with downloadable PDFs
          </p>
        </div>

        {/* Main Content */}
        {employees.length === 0 ? (
          <div className="max-w-4xl mx-auto">
            <FileUpload onDataParsed={handleDataParsed} />
            
            {/* Features Section */}
            <div className="mt-16 grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">CSV Upload</h3>
                <p className="text-gray-600">Simply drag and drop your employee data CSV file to get started</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Auto Processing</h3>
                <p className="text-gray-600">Automatically parse and generate individual reports for each employee</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">PDF Export</h3>
                <p className="text-gray-600">Download professional PDF reports for each employee instantly</p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-center mb-8">
              <button
                onClick={() => setEmployees([])}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <FileText className="h-4 w-4" />
                <span>Upload New File</span>
              </button>
            </div>
            <ReportViewer employees={employees} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
