
import React, { useState } from 'react';
import { Shop, Employee } from '../../types/Shop';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Upload, FileText, Download, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';
import { generateEmployeePDF } from '../../utils/generatePdf';

interface PayrollSubmissionProps {
  shop: Shop;
  employees: Employee[];
}

interface PayrollData {
  employeeName: string;
  department: string;
  designation: string;
  role: string;
  week1WorkedHours: number;
  week1Overtime: number;
  week1BilledHours: number;
  week1Proficiency: number;
  week2WorkedHours: number;
  week2Overtime: number;
  week2BilledHours: number;
  week2Proficiency: number;
  pto: number;
  holiday: number;
  salary?: number;
  grossProfit?: number;
  commission?: number;
  totalProfit?: number;
}

const PayrollSubmission: React.FC<PayrollSubmissionProps> = ({ shop, employees }) => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [payrollData, setPayrollData] = useState<PayrollData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Please upload a CSV file only');
      return;
    }

    setCsvFile(file);
    setError('');
  };

  const processCSV = async () => {
    if (!csvFile) {
      setError('Please select a CSV file first');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      Papa.parse(csvFile, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            const processedData: PayrollData[] = results.data.map((row: any) => ({
              employeeName: row['Employee Name'] || row.employeeName || '',
              department: row['Department'] || row.department || '',
              designation: row['Designation'] || row.designation || '',
              role: row['Role'] || row.role || '',
              week1WorkedHours: parseFloat(row['Week 1 Worked Hours'] || row.week1WorkedHours || 0),
              week1Overtime: parseFloat(row['Week 1 Overtime'] || row.week1Overtime || 0),
              week1BilledHours: parseFloat(row['Week 1 Billed Hours'] || row.week1BilledHours || 0),
              week1Proficiency: parseFloat(row['Week 1 Proficiency'] || row.week1Proficiency || 0),
              week2WorkedHours: parseFloat(row['Week 2 Worked Hours'] || row.week2WorkedHours || 0),
              week2Overtime: parseFloat(row['Week 2 Overtime'] || row.week2Overtime || 0),
              week2BilledHours: parseFloat(row['Week 2 Billed Hours'] || row.week2BilledHours || 0),
              week2Proficiency: parseFloat(row['Week 2 Proficiency'] || row.week2Proficiency || 0),
              pto: parseFloat(row['PTO'] || row.pto || 0),
              holiday: parseFloat(row['Holiday'] || row.holiday || 0),
              salary: parseFloat(row['Salary'] || row.salary || 0) || undefined,
              grossProfit: parseFloat(row['Gross Profit'] || row.grossProfit || 0) || undefined,
              commission: parseFloat(row['Commission'] || row.commission || 0) || undefined,
              totalProfit: parseFloat(row['Total Profit'] || row.totalProfit || 0) || undefined,
            }));

            setPayrollData(processedData.filter(emp => emp.employeeName.trim() !== ''));
            setIsProcessing(false);
          } catch (error) {
            setError('Error processing CSV data. Please check the format.');
            setIsProcessing(false);
          }
        },
        error: (error) => {
          setError('Error parsing CSV file: ' + error.message);
          setIsProcessing(false);
        }
      });
    } catch (error) {
      setError('Error reading file');
      setIsProcessing(false);
    }
  };

  const generatePDF = async (employee: PayrollData, index: number) => {
    const elementId = `payroll-report-${index}`;
    await generateEmployeePDF(employee as any, elementId);
  };

  const getPayCalculations = (employee: PayrollData) => {
    const employeeRecord = employees.find(emp => emp.name === employee.employeeName);
    const hourlyRate = employeeRecord?.hourlyRate || 30;
    const overtimeRate = hourlyRate * 1.5;

    const week1Pay = employee.week1WorkedHours * hourlyRate;
    const week1OvertimePay = employee.week1Overtime * overtimeRate;
    const week2Pay = employee.week2WorkedHours * hourlyRate;
    const week2OvertimePay = employee.week2Overtime * overtimeRate;
    const ptoPay = employee.pto * hourlyRate;
    const holidayPay = employee.holiday * hourlyRate;

    let incentive = 0;
    if (employeeRecord?.payType === 'Hourly + Proficiency') {
      incentive = employee.week1BilledHours * 7.5; // $7.50 per billed hour
    }

    const totalGross = week1Pay + week1OvertimePay + week2Pay + week2OvertimePay + ptoPay + holidayPay + incentive + (employee.commission || 0);

    return {
      week1Pay,
      week1OvertimePay,
      week2Pay,
      week2OvertimePay,
      ptoPay,
      holidayPay,
      incentive,
      totalGross,
      hourlyRate,
      overtimeRate
    };
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>New Payroll Submission</CardTitle>
          <CardDescription>
            Upload a CSV file to process employee payroll data and generate reports
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              id="csv-upload"
            />
            <label htmlFor="csv-upload" className="cursor-pointer">
              <div className="flex flex-col items-center space-y-2">
                {csvFile ? (
                  <FileText className="h-12 w-12 text-green-600" />
                ) : (
                  <Upload className="h-12 w-12 text-gray-400" />
                )}
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    {csvFile ? csvFile.name : 'Upload CSV File'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Drag and drop or click to select a payroll CSV file
                  </p>
                </div>
              </div>
            </label>
          </div>

          <Button
            onClick={processCSV}
            disabled={!csvFile || isProcessing}
            className="w-full"
          >
            {isProcessing ? 'Processing...' : 'Process Payroll Data'}
          </Button>

          {error && (
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {payrollData.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Payroll Reports ({payrollData.length} employees)</h3>
          
          {payrollData.map((employee, index) => {
            const calculations = getPayCalculations(employee);
            
            return (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div
                    id={`payroll-report-${index}`}
                    className="space-y-4"
                  >
                    {/* Header */}
                    <div className="text-center border-b pb-4">
                      <h2 className="text-2xl font-bold">{shop.name}</h2>
                      <h3 className="text-lg">Employee Performance Report</h3>
                    </div>

                    {/* Employee Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><strong>Name:</strong> {employee.employeeName}</div>
                      <div><strong>Department:</strong> {employee.department}</div>
                      <div><strong>Designation:</strong> {employee.designation}</div>
                      <div><strong>Role:</strong> {employee.role}</div>
                    </div>

                    {/* Payroll Table */}
                    <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
                      <div className="grid grid-cols-4 gap-2 font-bold border-b pb-2 mb-2">
                        <div>DESCRIPTION</div>
                        <div className="text-center">HOURS</div>
                        <div className="text-center">RATE</div>
                        <div className="text-center">TOTAL</div>
                      </div>

                      {/* Week 1 */}
                      <div className="space-y-1 mb-2">
                        <div className="grid grid-cols-4 gap-2">
                          <div>WEEK 1 WORKED HOURS</div>
                          <div className="text-center">{employee.week1WorkedHours.toFixed(2)}</div>
                          <div className="text-center">${calculations.hourlyRate.toFixed(2)}</div>
                          <div className="text-center">${calculations.week1Pay.toFixed(2)}</div>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          <div>WEEK 1 OVERTIME</div>
                          <div className="text-center">{employee.week1Overtime.toFixed(2)}</div>
                          <div className="text-center">${calculations.overtimeRate.toFixed(2)}</div>
                          <div className="text-center">${calculations.week1OvertimePay.toFixed(2)}</div>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          <div>WEEK 1 BILLED HOURS</div>
                          <div className="text-center">{employee.week1BilledHours.toFixed(2)}</div>
                          <div className="text-center">-</div>
                          <div className="text-center">-</div>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          <div>WEEK 1 PROFICIENCY</div>
                          <div className="text-center">{employee.week1Proficiency.toFixed(2)}%</div>
                          <div className="text-center">-</div>
                          <div className="text-center">-</div>
                        </div>
                      </div>

                      {/* Week 2 */}
                      <div className="space-y-1 mb-2">
                        <div className="grid grid-cols-4 gap-2">
                          <div>WEEK 2 WORKED HOURS</div>
                          <div className="text-center">{employee.week2WorkedHours.toFixed(2)}</div>
                          <div className="text-center">${calculations.hourlyRate.toFixed(2)}</div>
                          <div className="text-center">${calculations.week2Pay.toFixed(2)}</div>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          <div>WEEK 2 OVERTIME</div>
                          <div className="text-center">{employee.week2Overtime.toFixed(2)}</div>
                          <div className="text-center">${calculations.overtimeRate.toFixed(2)}</div>
                          <div className="text-center">${calculations.week2OvertimePay.toFixed(2)}</div>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          <div>WEEK 2 BILLED HOURS</div>
                          <div className="text-center">{employee.week2BilledHours.toFixed(2)}</div>
                          <div className="text-center">-</div>
                          <div className="text-center">-</div>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          <div>WEEK 2 PROFICIENCY</div>
                          <div className="text-center">{employee.week2Proficiency.toFixed(2)}%</div>
                          <div className="text-center">-</div>
                          <div className="text-center">-</div>
                        </div>
                      </div>

                      {/* PTO & Holiday */}
                      <div className="space-y-1 mb-2">
                        <div className="grid grid-cols-4 gap-2">
                          <div>PTO</div>
                          <div className="text-center">{employee.pto.toFixed(2)}</div>
                          <div className="text-center">${calculations.hourlyRate.toFixed(2)}</div>
                          <div className="text-center">${calculations.ptoPay.toFixed(2)}</div>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          <div>HOLIDAY</div>
                          <div className="text-center">{employee.holiday.toFixed(2)}</div>
                          <div className="text-center">${calculations.hourlyRate.toFixed(2)}</div>
                          <div className="text-center">${calculations.holidayPay.toFixed(2)}</div>
                        </div>
                      </div>

                      {/* Incentives */}
                      {calculations.incentive > 0 && (
                        <div className="space-y-1 mb-2">
                          <div className="grid grid-cols-4 gap-2">
                            <div>INCENTIVE</div>
                            <div className="text-center">{employee.week1BilledHours.toFixed(2)}</div>
                            <div className="text-center">$7.50</div>
                            <div className="text-center">${calculations.incentive.toFixed(2)}</div>
                          </div>
                        </div>
                      )}

                      {/* Commission */}
                      {employee.commission && employee.commission > 0 && (
                        <div className="space-y-1 mb-2">
                          <div className="grid grid-cols-4 gap-2">
                            <div>COMMISSION</div>
                            <div className="text-center">-</div>
                            <div className="text-center">-</div>
                            <div className="text-center">${employee.commission.toFixed(2)}</div>
                          </div>
                        </div>
                      )}

                      {/* Total */}
                      <div className="border-t pt-2">
                        <div className="grid grid-cols-4 gap-2 font-bold">
                          <div>TOTAL GROSS WAGES</div>
                          <div className="text-center">-</div>
                          <div className="text-center">-</div>
                          <div className="text-center">${calculations.totalGross.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  </div>

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
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PayrollSubmission;
