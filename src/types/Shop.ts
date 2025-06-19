
export interface Shop {
  id: string;
  userId: string;
  name: string;
  numberOfEmployees: number;
  specialty: 'General Auto Repair' | 'Auto Body/Collision Repair' | 'Restoration';
  payrollType: 'Weekly' | 'Bi-weekly';
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: string;
  shopId: string;
  name: string;
  startDate: string;
  role: 'Technician' | 'Service Advisor' | 'Manager' | 'Owner' | 'Part Time Hourly';
  payType: 'Hourly + Proficiency' | 'Flat Rate' | 'Hourly' | 'Salary' | 'Salary + Commission';
  hourlyRate?: number;
  salaryAmount?: number;
  commissionRate?: number;
  commissionType?: 'GP Percentage' | 'Profit Dollars' | 'Tiered GP' | 'Tiered Commission';
  createdAt: string;
  updatedAt: string;
}

export interface PayrollSubmission {
  id: string;
  shopId: string;
  submissionDate: string;
  payPeriodStart: string;
  payPeriodEnd: string;
  status: 'Draft' | 'Submitted' | 'Processed';
  employeeData: any[];
  totalAmount: number;
  createdAt: string;
}
