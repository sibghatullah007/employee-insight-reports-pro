
export interface WeekHoursData {
  employee: string;
  role: string;
  clockedTime: string;
  breakTime: string;
  totalTime: number;
}

export interface BilledHoursData {
  technician: string;
  jobTotals: number;
  billedHours: number;
  actualHours: number;
  efficiency: number;
  laborSales: number;
}

export interface EmployeeReport {
  name: string;
  role: string;
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
  totalGross: number;
}
