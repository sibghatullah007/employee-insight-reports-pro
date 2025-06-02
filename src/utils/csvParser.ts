
import Papa from 'papaparse';
import { WeekHoursData, BilledHoursData, EmployeeReport } from '../types/Employee';

export const parseWeekHoursCSV = (file: File): Promise<WeekHoursData[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const weekHours: WeekHoursData[] = results.data.map((row: any) => ({
            employee: row.Employee || row.employee || '',
            role: row.Role || row.role || '',
            clockedTime: row['Clocked Time'] || row.clockedTime || '',
            breakTime: row['Break Time'] || row.breakTime || '',
            totalTime: parseFloat(row['Total Time'] || row.totalTime || 0)
          }));
          resolve(weekHours.filter(emp => emp.employee)); // Filter out empty entries
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

export const parseBilledHoursCSV = (file: File): Promise<BilledHoursData[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const billedHours: BilledHoursData[] = results.data.map((row: any) => ({
            technician: row.Technician || row.technician || '',
            jobTotals: parseInt(row['Job Totals'] || row.jobTotals || 0),
            billedHours: parseFloat(row['Billed Hours'] || row.billedHours || 0),
            actualHours: parseFloat(row['Actual Hours'] || row.actualHours || 0),
            efficiency: parseFloat(row.Efficiency || row.efficiency || 0),
            laborSales: parseFloat(row['Labor Sales'] || row.laborSales || 0)
          }));
          resolve(billedHours.filter(emp => emp.technician)); // Filter out empty entries
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

export const processEmployeeData = (
  week1Hours: WeekHoursData[],
  week2Hours: WeekHoursData[],
  week1Billed: BilledHoursData[],
  week2Billed: BilledHoursData[]
): EmployeeReport[] => {
  const employees = new Map<string, EmployeeReport>();

  // Process week 1 data
  week1Hours.forEach(hours => {
    const billedData = week1Billed.find(b => b.technician === hours.employee);
    const workedHours = Math.min(hours.totalTime, 40);
    const overtime = Math.max(hours.totalTime - 40, 0);
    
    employees.set(hours.employee, {
      name: hours.employee,
      role: hours.role,
      week1: {
        workedHours,
        overtime,
        billedHours: billedData?.billedHours || 0,
        proficiency: billedData?.efficiency || 0,
        workedPay: workedHours * 30,
        overtimePay: overtime * 45,
        incentive: (billedData?.billedHours || 0) * 7.50
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
      totalGross: 0
    });
  });

  // Process week 2 data
  week2Hours.forEach(hours => {
    const billedData = week2Billed.find(b => b.technician === hours.employee);
    const workedHours = Math.min(hours.totalTime, 40);
    const overtime = Math.max(hours.totalTime - 40, 0);
    
    const employee = employees.get(hours.employee);
    if (employee) {
      employee.week2 = {
        workedHours,
        overtime,
        billedHours: billedData?.billedHours || 0,
        proficiency: billedData?.efficiency || 0,
        workedPay: workedHours * 30,
        overtimePay: overtime * 45,
        incentive: 0 // Only week 1 gets incentive in the example
      };
    }
  });

  // Calculate total gross for each employee
  employees.forEach(employee => {
    employee.totalGross = 
      employee.week1.workedPay + 
      employee.week1.overtimePay + 
      employee.week2.workedPay + 
      employee.week2.overtimePay + 
      employee.week1.incentive + 
      employee.week2.incentive +
      (employee.pto * 30) +
      (employee.holiday * 0);
  });

  return Array.from(employees.values());
};
