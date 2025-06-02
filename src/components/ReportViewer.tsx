
import React from 'react';
import { Building, User, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { Employee } from '../types/Employee';
import PdfDownloader from './PdfDownloader';

interface ReportViewerProps {
  employees: Employee[];
}

const ReportViewer: React.FC<ReportViewerProps> = ({ employees }) => {
  const getPerformanceColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-100';
    if (score >= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 90) return 'bg-green-500';
    if (attendance >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(salary);
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (employees.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Employee Performance Reports
        </h2>
        <p className="text-gray-600">
          {employees.length} employee{employees.length !== 1 ? 's' : ''} found
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {employees.map((employee, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div
              id={`employee-report-${index}`}
              className="p-6"
            >
              {/* Header for PDF */}
              <div className="text-center mb-6 border-b pb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  TechCorp Solutions
                </h3>
                <p className="text-sm text-gray-600">Employee Performance Report</p>
              </div>

              {/* Employee Info */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-900">{employee.name}</p>
                    <p className="text-sm text-gray-600">{employee.designation}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Building className="h-5 w-5 text-blue-600" />
                  <p className="text-gray-700">{employee.department}</p>
                </div>

                <div className="flex items-center space-x-3">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  <p className="text-gray-700 font-medium">{formatSalary(employee.salary)}</p>
                </div>

                {/* Attendance Progress */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">Attendance: {employee.attendance}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getAttendanceColor(employee.attendance)}`}
                      style={{ width: `${Math.min(employee.attendance, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Performance Score */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">Performance Score</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-blue-600"
                        style={{ width: `${(employee.performance / 10) * 100}%` }}
                      ></div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${getPerformanceColor(employee.performance)}`}>
                      {employee.performance}/10
                    </span>
                  </div>
                </div>

                {/* Report Footer */}
                <div className="pt-4 border-t text-center">
                  <p className="text-xs text-gray-500">
                    Date Generated: {formatDate()}
                  </p>
                </div>
              </div>
            </div>

            {/* Download Button - Outside the PDF area */}
            <div className="px-6 pb-4">
              <PdfDownloader
                employee={employee}
                elementId={`employee-report-${index}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportViewer;
