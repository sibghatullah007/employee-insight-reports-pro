
import React from 'react';
import { Employee } from '../../types/Shop';

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

interface RoleBasedReportProps {
  employee: any;
  index: number;
  shop: any;
}

const RoleBasedReportGenerator: React.FC<RoleBasedReportProps> = ({ employee, index, shop }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const renderTechnicianHourlyProficiencyReport = () => (
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
          <div className="text-center">{employee.week1?.workedHours?.toFixed(2) || '0.00'}</div>
          <div className="text-center">$30.00</div>
          <div className="text-center">{formatCurrency(employee.week1?.workedPay || 0)}</div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <div>WEEK 1 OVERTIME</div>
          <div className="text-center">{employee.week1?.overtime?.toFixed(2) || '0.00'}</div>
          <div className="text-center">$45.00</div>
          <div className="text-center">{formatCurrency(employee.week1?.overtimePay || 0)}</div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <div>WEEK 1 BILLED HOURS</div>
          <div className="text-center">{employee.week1?.billedHours?.toFixed(2) || '0.00'}</div>
          <div className="text-center">-</div>
          <div className="text-center">-</div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <div>WEEK 1 PROFICIENCY</div>
          <div className="text-center">{employee.week1?.proficiency?.toFixed(2) || '0.00'}%</div>
          <div className="text-center">-</div>
          <div className="text-center">-</div>
        </div>
      </div>

      {/* Week 2 */}
      <div className="space-y-1 mb-2">
        <div className="grid grid-cols-4 gap-2">
          <div>WEEK 2 WORKED HOURS</div>
          <div className="text-center">{employee.week2?.workedHours?.toFixed(2) || '0.00'}</div>
          <div className="text-center">$30.00</div>
          <div className="text-center">{formatCurrency(employee.week2?.workedPay || 0)}</div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <div>WEEK 2 OVERTIME</div>
          <div className="text-center">{employee.week2?.overtime?.toFixed(2) || '0.00'}</div>
          <div className="text-center">$45.00</div>
          <div className="text-center">{formatCurrency(employee.week2?.overtimePay || 0)}</div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <div>WEEK 2 BILLED HOURS</div>
          <div className="text-center">{employee.week2?.billedHours?.toFixed(2) || '0.00'}</div>
          <div className="text-center">-</div>
          <div className="text-center">-</div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <div>WEEK 2 PROFICIENCY</div>
          <div className="text-center">{employee.week2?.proficiency?.toFixed(2) || '0.00'}%</div>
          <div className="text-center">-</div>
          <div className="text-center">-</div>
        </div>
      </div>

      {/* PTO and Holiday */}
      <div className="space-y-1 mb-2">
        <div className="grid grid-cols-4 gap-2">
          <div>PTO</div>
          <div className="text-center">{employee.pto?.toFixed(2) || '0.00'}</div>
          <div className="text-center">$30.00</div>
          <div className="text-center">{formatCurrency((employee.pto || 0) * 30)}</div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <div>HOLIDAY</div>
          <div className="text-center">{employee.holiday?.toFixed(2) || '0.00'}</div>
          <div className="text-center">$0.00</div>
          <div className="text-center">{formatCurrency(0)}</div>
        </div>
      </div>

      {/* Incentives */}
      <div className="space-y-1 mb-4">
        <div className="grid grid-cols-4 gap-2">
          <div>INCENTIVE WEEK 1</div>
          <div className="text-center">{employee.week1?.billedHours?.toFixed(2) || '0.00'}</div>
          <div className="text-center">$7.50</div>
          <div className="text-center">{formatCurrency(employee.week1?.incentive || 0)}</div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <div>INCENTIVE WEEK 2</div>
          <div className="text-center">{employee.week2?.billedHours?.toFixed(2) || '0.00'}</div>
          <div className="text-center">$0.00</div>
          <div className="text-center">{formatCurrency(employee.week2?.incentive || 0)}</div>
        </div>
      </div>

      {/* Total */}
      <div className="border-t pt-2">
        <div className="grid grid-cols-4 gap-2 font-bold">
          <div>TOTAL GROSS WAGES</div>
          <div className="text-center">-</div>
          <div className="text-center">-</div>
          <div className="text-center">{formatCurrency(employee.totalGross || 0)}</div>
        </div>
      </div>
    </div>
  );

  const renderTechnicianHourlyReport = () => (
    <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
      <div className="grid grid-cols-4 gap-2 font-bold border-b pb-2 mb-2">
        <div>DESCRIPTION</div>
        <div className="text-center">HOURS</div>
        <div className="text-center">RATE</div>
        <div className="text-center">TOTAL</div>
      </div>

      <div className="space-y-1 mb-2">
        <div className="grid grid-cols-4 gap-2">
          <div>WEEK 1 WORKED HOURS</div>
          <div className="text-center">{employee.week1?.workedHours?.toFixed(2) || '0.00'}</div>
          <div className="text-center">$30.00</div>
          <div className="text-center">{formatCurrency(employee.week1?.workedPay || 0)}</div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <div>WEEK 1 OVERTIME</div>
          <div className="text-center">{employee.week1?.overtime?.toFixed(2) || '0.00'}</div>
          <div className="text-center">$45.00</div>
          <div className="text-center">{formatCurrency(employee.week1?.overtimePay || 0)}</div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <div>WEEK 2 WORKED HOURS</div>
          <div className="text-center">{employee.week2?.workedHours?.toFixed(2) || '0.00'}</div>
          <div className="text-center">$30.00</div>
          <div className="text-center">{formatCurrency(employee.week2?.workedPay || 0)}</div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <div>WEEK 2 OVERTIME</div>
          <div className="text-center">{employee.week2?.overtime?.toFixed(2) || '0.00'}</div>
          <div className="text-center">$45.00</div>
          <div className="text-center">{formatCurrency(employee.week2?.overtimePay || 0)}</div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <div>PTO</div>
          <div className="text-center">{employee.pto?.toFixed(2) || '0.00'}</div>
          <div className="text-center">$30.00</div>
          <div className="text-center">{formatCurrency((employee.pto || 0) * 30)}</div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <div>HOLIDAY</div>
          <div className="text-center">{employee.holiday?.toFixed(2) || '0.00'}</div>
          <div className="text-center">$0.00</div>
          <div className="text-center">{formatCurrency(0)}</div>
        </div>
      </div>

      <div className="border-t pt-2">
        <div className="grid grid-cols-4 gap-2 font-bold">
          <div>TOTAL GROSS WAGES</div>
          <div className="text-center">-</div>
          <div className="text-center">-</div>
          <div className="text-center">{formatCurrency(employee.totalGross || 0)}</div>
        </div>
      </div>
    </div>
  );

  const renderServiceAdvisorSalaryCommissionReport = () => (
    <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
      <div className="grid grid-cols-4 gap-2 font-bold border-b pb-2 mb-2">
        <div>DESCRIPTION</div>
        <div className="text-center">AMOUNT</div>
        <div className="text-center">RATE</div>
        <div className="text-center">TOTAL</div>
      </div>

      <div className="space-y-1 mb-2">
        <div className="grid grid-cols-4 gap-2">
          <div>SALARY</div>
          <div className="text-center">-</div>
          <div className="text-center">-</div>
          <div className="text-center">{formatCurrency((employee.salaryAmount || 0) / 26)}</div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <div>GROSS PROFIT</div>
          <div className="text-center">{formatCurrency(employee.grossProfit || 0)}</div>
          <div className="text-center">{(employee.commissionRate || 0)}%</div>
          <div className="text-center">{formatCurrency((employee.grossProfit || 0) * (employee.commissionRate || 0) / 100)}</div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <div>PTO</div>
          <div className="text-center">{employee.pto?.toFixed(2) || '0.00'}</div>
          <div className="text-center">-</div>
          <div className="text-center">{formatCurrency(0)}</div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <div>HOLIDAY</div>
          <div className="text-center">{employee.holiday?.toFixed(2) || '0.00'}</div>
          <div className="text-center">-</div>
          <div className="text-center">{formatCurrency(0)}</div>
        </div>
      </div>

      <div className="border-t pt-2">
        <div className="grid grid-cols-4 gap-2 font-bold">
          <div>TOTAL GROSS WAGES</div>
          <div className="text-center">-</div>
          <div className="text-center">-</div>
          <div className="text-center">{formatCurrency(employee.totalGross || 0)}</div>
        </div>
      </div>
    </div>
  );

  const renderPartTimeHourlyReport = () => (
    <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
      <div className="grid grid-cols-4 gap-2 font-bold border-b pb-2 mb-2">
        <div>DESCRIPTION</div>
        <div className="text-center">HOURS</div>
        <div className="text-center">RATE</div>
        <div className="text-center">TOTAL</div>
      </div>

      <div className="space-y-1 mb-2">
        <div className="grid grid-cols-4 gap-2">
          <div>WEEK 1 WORKED HOURS</div>
          <div className="text-center">{employee.week1?.workedHours?.toFixed(2) || '0.00'}</div>
          <div className="text-center">${employee.hourlyRate?.toFixed(2) || '15.00'}</div>
          <div className="text-center">{formatCurrency(employee.week1?.workedPay || 0)}</div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <div>WEEK 2 WORKED HOURS</div>
          <div className="text-center">{employee.week2?.workedHours?.toFixed(2) || '0.00'}</div>
          <div className="text-center">${employee.hourlyRate?.toFixed(2) || '15.00'}</div>
          <div className="text-center">{formatCurrency(employee.week2?.workedPay || 0)}</div>
        </div>
      </div>

      <div className="border-t pt-2">
        <div className="grid grid-cols-4 gap-2 font-bold">
          <div>TOTAL GROSS WAGES</div>
          <div className="text-center">-</div>
          <div className="text-center">-</div>
          <div className="text-center">{formatCurrency(employee.totalGross || 0)}</div>
        </div>
      </div>
    </div>
  );

  const getReportByRole = () => {
    const role = employee.role?.toLowerCase() || '';
    const payType = employee.payType?.toLowerCase() || '';

    if (role.includes('technician')) {
      if (payType.includes('hourly + proficiency')) {
        return renderTechnicianHourlyProficiencyReport();
      } else if (payType.includes('hourly')) {
        return renderTechnicianHourlyReport();
      } else if (payType.includes('flat rate')) {
        return renderTechnicianHourlyProficiencyReport(); // Similar format with different calculations
      } else if (payType.includes('salary')) {
        return renderServiceAdvisorSalaryCommissionReport(); // Salary format
      }
    } else if (role.includes('service advisor')) {
      return renderServiceAdvisorSalaryCommissionReport();
    } else if (role.includes('manager') || role.includes('admin')) {
      return renderServiceAdvisorSalaryCommissionReport();
    } else if (role.includes('part time')) {
      return renderPartTimeHourlyReport();
    }

    // Default fallback
    return renderTechnicianHourlyReport();
  };

  return (
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
        <div><strong>Name:</strong> {employee.name}</div>
        <div><strong>Role:</strong> {employee.role}</div>
      </div>

      {/* Role-based Report */}
      {getReportByRole()}
    </div>
  );
};

export default RoleBasedReportGenerator;
