
import Papa from 'papaparse';
import { Employee } from '../types/Employee';

export const parseCSV = (file: File): Promise<Employee[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const employees: Employee[] = results.data.map((row: any) => ({
            name: row.Name || row.name || '',
            department: row.Department || row.department || '',
            designation: row.Designation || row.designation || '',
            salary: parseFloat(row.Salary || row.salary || 0),
            attendance: parseFloat(row['Attendance (%)'] || row.attendance || 0),
            performance: parseFloat(row['Performance (1-10)'] || row.performance || 0)
          }));
          resolve(employees.filter(emp => emp.name)); // Filter out empty entries
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
