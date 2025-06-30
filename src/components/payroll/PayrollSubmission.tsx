import React, { useState } from 'react';
import { Shop, Employee } from '../../types/Shop';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Upload, FileText, Download, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';
import { generateEmployeePDF } from '../../utils/generatePdf';
import RoleBasedReportGenerator from './RoleBasedReportGenerator';
import EmployeeRatesTable from './EmployeeRatesTable';

interface PayrollSubmissionProps {
  shop: Shop;
  employees: Employee[];
}

interface WeekHoursData {
  employee: string;
  role: string;
  clockedTime: string;
  breakTime: string;
  totalTime: string;
  totalHours: number;
}

interface BilledHoursData {
  technician: string;
  jobTotals: number;
  billedHours: number;
  actualHours: number;
  efficiency: string;
  laborSales: number;
}

interface ProcessedEmployeeData {
  name: string;
  role: string;
  payType: string;
  hourlyRate: number;
  salaryAmount: number;
  commissionRate: number;
  incentiveRate: number;
  week1: {
    workedHours: number;
    overtime: number;
    billedHours: number;
    proficiency: number;
    workedPay: number;
    overtimePay: number;
    incentive: number;
  };
  week2: {
    workedHours: number;
    overtime: number;
    billedHours: number;
    proficiency: number;
    workedPay: number;
    overtimePay: number;
    incentive: number;
  };
  pto: number;
  holiday: number;
  grossProfit: number;
  totalGross: number;
}

const PayrollSubmission: React.FC<PayrollSubmissionProps> = ({ shop, employees }) => {
  const [weekHoursFile, setWeekHoursFile] = useState<File | null>(null);
  const [billedHoursFile, setBilledHoursFile] = useState<File | null>(null);
  const [processedData, setProcessedData] = useState<ProcessedEmployeeData[]>([]);
  const [parsedWeekHours, setParsedWeekHours] = useState<WeekHoursData[]>([]);
  const [parsedBilledHours, setParsedBilledHours] = useState<BilledHoursData[]>([]);
  const [showRatesTable, setShowRatesTable] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFileUpload = (file: File, type: 'weekHours' | 'billedHours') => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Please upload CSV files only');
      return;
    }

    if (type === 'weekHours') {
      setWeekHoursFile(file);
    } else {
      setBilledHoursFile(file);
    }
    setError('');
  };

  const parseWeekHours = (file: File): Promise<WeekHoursData[]> => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            const weekHours: WeekHoursData[] = results.data.map((row: any) => {
              const totalTimeStr = row['Total Time'] || '';
              const hoursMatch = totalTimeStr.match(/\(([0-9.]+)\s*hrs?\)/);
              const totalHours = hoursMatch ? parseFloat(hoursMatch[1]) : 0;

              return {
                employee: row.Employee || '',
                role: row.Role || '',
                clockedTime: row['Clocked Time'] || '',
                breakTime: row['Break Time'] || '',
                totalTime: totalTimeStr,
                totalHours
              };
            });
            resolve(weekHours.filter(emp => emp.employee.trim() !== ''));
          } catch (error) {
            reject(error);
          }
        },
        error: reject
      });
    });
  };

  const parseBilledHours = (file: File): Promise<BilledHoursData[]> => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            const billedHours: BilledHoursData[] = results.data.map((row: any) => ({
              technician: row.Technician || '',
              jobTotals: parseInt(row['Job Totals'] || 0),
              billedHours: parseFloat(row['Billed Hours'] || 0),
              actualHours: parseFloat(row['Actual Hours'] || 0),
              efficiency: row.Efficiency || '0%',
              laborSales: parseFloat(row['Labor Sales'] || 0)
            }));
            resolve(billedHours.filter(emp => emp.technician.trim() !== ''));
          } catch (error) {
            reject(error);
          }
        },
        error: reject
      });
    });
  };

  const processEmployeeDataWithRates = (
    weekHours: WeekHoursData[], 
    billedHours: BilledHoursData[],
    employeeRates: { [employeeName: string]: any }
  ): ProcessedEmployeeData[] => {
    const processedEmployees: ProcessedEmployeeData[] = [];

    weekHours.forEach(weekData => {
      const billedData = billedHours.find(billed => billed.technician === weekData.employee);
      const rateData = employeeRates[weekData.employee];
      
      if (!rateData) return;
      
      const hourlyRate = rateData.hourlyRate || 0;
      const overtimeRate = rateData.overtimeRate || (hourlyRate * 1.5);
      const incentiveRate = rateData.incentiveRate || 0;
      
      const regularHours = Math.min(weekData.totalHours, 40);
      const overtimeHours = Math.max(weekData.totalHours - 40, 0);
      
      const regularPay = regularHours * hourlyRate;
      const overtimePay = overtimeHours * overtimeRate;
      
      let incentive = 0;
      let proficiency = 0;
      
      if (billedData && rateData.payType === 'Hourly + Proficiency') {
        incentive = billedData.billedHours * incentiveRate;
        const efficiencyStr = billedData.efficiency.replace('%', '');
        proficiency = parseFloat(efficiencyStr) || 0;
      }
      
      // Calculate gross profit for commission roles
      const grossProfit = billedData?.laborSales || 0;
      const commissionAmount = rateData.payType?.includes('Commission') 
        ? (grossProfit * (rateData.commissionRate || 0) / 100) 
        : 0;
      
      // Calculate salary portion for salary-based roles
      const salaryPortion = rateData.payType?.includes('Salary') 
        ? (rateData.salaryAmount || 0) / 26 // Bi-weekly
        : 0;
      
      const totalGross = rateData.payType?.includes('Salary') 
        ? salaryPortion + commissionAmount
        : regularPay + overtimePay + incentive;

      processedEmployees.push({
        name: weekData.employee,
        role: rateData.role || weekData.role,
        payType: rateData.payType || 'Hourly',
        hourlyRate,
        salaryAmount: rateData.salaryAmount || 0,
        commissionRate: rateData.commissionRate || 0,
        incentiveRate,
        week1: {
          workedHours: regularHours,
          overtime: overtimeHours,
          billedHours: billedData?.billedHours || 0,
          proficiency,
          workedPay: regularPay,
          overtimePay,
          incentive
        },
        week2: {
          workedHours: 0,
          overtime: 0,
          billedHours: 0,
          proficiency: 0,
          workedPay: 0,
          overtimePay: 0,
          incentive: 0
        },
        pto: 0,
        holiday: 0,
        grossProfit,
        totalGross
      });
    });

    return processedEmployees;
  };

  const processFiles = async () => {
    if (!weekHoursFile || !billedHoursFile) {
      setError('Please upload both Week Hours and Billed Hours CSV files');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const [weekHours, billedHours] = await Promise.all([
        parseWeekHours(weekHoursFile),
        parseBilledHours(billedHoursFile)
      ]);

      if (weekHours.length === 0) {
        setError('No valid employee data found in the CSV files');
      } else {
        setParsedWeekHours(weekHours);
        setParsedBilledHours(billedHours);
        setShowRatesTable(true);
      }
    } catch (err) {
      setError('Error processing CSV files. Please check the format.');
      console.error('CSV processing error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRatesConfirmed = (employeeRates: { [employeeName: string]: any }) => {
    const processed = processEmployeeDataWithRates(parsedWeekHours, parsedBilledHours, employeeRates);
    setProcessedData(processed);
    setShowRatesTable(false);
  };

  const generatePDF = async (employee: ProcessedEmployeeData, index: number) => {
    const elementId = `payroll-report-${index}`;
    await generateEmployeePDF(employee as any, elementId);
  };

  const FileUploadBox = ({ 
    title, 
    file, 
    onFileChange, 
    description,
    example 
  }: { 
    title: string; 
    file: File | null; 
    onFileChange: (file: File) => void;
    description: string;
    example: string;
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
            <p className="text-xs text-gray-400 mt-1">{example}</p>
            {file && (
              <p className="text-xs text-green-600 mt-1">✓ {file.name}</p>
            )}
          </div>
        </div>
      </label>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>New Payroll Submission</CardTitle>
          <CardDescription>
            Upload both Week Hours and Billed Hours CSV files to process employee payroll data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileUploadBox
              title="Week Hours CSV"
              file={weekHoursFile}
              onFileChange={(file) => handleFileUpload(file, 'weekHours')}
              description="Employee hours and time data"
              example="Employee, Role, Clocked Time, Break Time, Total Time"
            />
            
            <FileUploadBox
              title="Billed Hours CSV"
              file={billedHoursFile}
              onFileChange={(file) => handleFileUpload(file, 'billedHours')}
              description="Technician billing and efficiency data"
              example="Technician, Job Totals, Billed Hours, Actual Hours, Efficiency, Labor Sales"
            />
          </div>

          <Button
            onClick={processFiles}
            disabled={!weekHoursFile || !billedHoursFile || isProcessing}
            className="w-full"
          >
            {isProcessing ? 'Processing Files...' : 'Process Payroll Data'}
          </Button>

          {error && (
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {showRatesTable && (
        <EmployeeRatesTable
          employees={parsedWeekHours.map(emp => emp.employee)}
          roles={Object.fromEntries(parsedWeekHours.map(emp => [emp.employee, emp.role]))}
          onRatesConfirmed={handleRatesConfirmed}
        />
      )}

      {processedData.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Employee Payroll Reports ({processedData.length} employees)</h3>
          
          {processedData.map((employee, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <RoleBasedReportGenerator 
                  employee={employee}
                  index={index}
                  shop={shop}
                />

                <div className="mt-4">
                  <Button
                    onClick={() => generatePDF(employee, index)}
                    className="w-full flex items-center justify-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download PDF Report</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PayrollSubmission;
