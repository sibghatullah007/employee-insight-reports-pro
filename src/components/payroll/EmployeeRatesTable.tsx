
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

interface EmployeeRateData {
  name: string;
  role: string;
  payType: string;
  hourlyRate: number;
  overtimeRate: number;
  salaryAmount: number;
  commissionRate: number;
  incentiveRate: number;
}

interface EmployeeRatesTableProps {
  employees: string[];
  roles: { [key: string]: string };
  onRatesConfirmed: (rates: { [employeeName: string]: EmployeeRateData }) => void;
}

const EmployeeRatesTable: React.FC<EmployeeRatesTableProps> = ({ 
  employees, 
  roles, 
  onRatesConfirmed 
}) => {
  const [employeeRates, setEmployeeRates] = useState<{ [key: string]: EmployeeRateData }>(() => {
    const initialRates: { [key: string]: EmployeeRateData } = {};
    employees.forEach(employee => {
      initialRates[employee] = {
        name: employee,
        role: roles[employee] || 'Technician',
        payType: 'Hourly',
        hourlyRate: 30,
        overtimeRate: 45,
        salaryAmount: 0,
        commissionRate: 0,
        incentiveRate: 7.5
      };
    });
    return initialRates;
  });

  const updateEmployeeRate = (employeeName: string, field: keyof EmployeeRateData, value: string | number) => {
    setEmployeeRates(prev => ({
      ...prev,
      [employeeName]: {
        ...prev[employeeName],
        [field]: typeof value === 'string' ? value : Number(value)
      }
    }));
  };

  const handleConfirmRates = () => {
    onRatesConfirmed(employeeRates);
  };

  const payTypeOptions = [
    'Hourly',
    'Hourly + Proficiency',
    'Flat Rate',
    'Salary',
    'Salary + Commission',
    'Salary + Tiered GP Commission'
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Employee Pay Rates Configuration</CardTitle>
        <CardDescription>
          Set the pay rates and compensation structure for each employee before generating reports
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Pay Type</TableHead>
                <TableHead>Hourly Rate ($)</TableHead>
                <TableHead>Overtime Rate ($)</TableHead>
                <TableHead>Salary Amount ($)</TableHead>
                <TableHead>Commission Rate (%)</TableHead>
                <TableHead>Incentive Rate ($)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee}>
                  <TableCell className="font-medium">{employee}</TableCell>
                  <TableCell>
                    <Input
                      value={employeeRates[employee]?.role || ''}
                      onChange={(e) => updateEmployeeRate(employee, 'role', e.target.value)}
                      className="w-32"
                    />
                  </TableCell>
                  <TableCell>
                    <select
                      value={employeeRates[employee]?.payType || 'Hourly'}
                      onChange={(e) => updateEmployeeRate(employee, 'payType', e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      {payTypeOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={employeeRates[employee]?.hourlyRate || 0}
                      onChange={(e) => updateEmployeeRate(employee, 'hourlyRate', parseFloat(e.target.value) || 0)}
                      className="w-24"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={employeeRates[employee]?.overtimeRate || 0}
                      onChange={(e) => updateEmployeeRate(employee, 'overtimeRate', parseFloat(e.target.value) || 0)}
                      className="w-24"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={employeeRates[employee]?.salaryAmount || 0}
                      onChange={(e) => updateEmployeeRate(employee, 'salaryAmount', parseFloat(e.target.value) || 0)}
                      className="w-32"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={employeeRates[employee]?.commissionRate || 0}
                      onChange={(e) => updateEmployeeRate(employee, 'commissionRate', parseFloat(e.target.value) || 0)}
                      className="w-24"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={employeeRates[employee]?.incentiveRate || 0}
                      onChange={(e) => updateEmployeeRate(employee, 'incentiveRate', parseFloat(e.target.value) || 0)}
                      className="w-24"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-6 text-center">
          <Button onClick={handleConfirmRates} className="px-8 py-2">
            Confirm Rates & Generate Reports
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeRatesTable;
