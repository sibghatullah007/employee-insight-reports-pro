
import React, { useState } from 'react';
import { Shop, Employee } from '../../types/Shop';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, Trash2, Edit } from 'lucide-react';

interface EmployeeManagementProps {
  shop: Shop;
  employees: Employee[];
  onEmployeesUpdate: (employees: Employee[]) => void;
}

const EmployeeManagement: React.FC<EmployeeManagementProps> = ({ shop, employees, onEmployeesUpdate }) => {
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    role: 'Technician' as Employee['role'],
    payType: 'Hourly + Proficiency' as Employee['payType'],
    hourlyRate: 0,
    salaryAmount: 0,
    commissionRate: 0,
    commissionType: 'GP Percentage' as Employee['commissionType'],
  });

  const resetForm = () => {
    setFormData({
      name: '',
      startDate: '',
      role: 'Technician',
      payType: 'Hourly + Proficiency',
      hourlyRate: 0,
      salaryAmount: 0,
      commissionRate: 0,
      commissionType: 'GP Percentage',
    });
    setIsAddingEmployee(false);
    setEditingEmployee(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingEmployee) {
      const updatedEmployees = employees.map(emp => 
        emp.id === editingEmployee.id 
          ? { ...emp, ...formData, updatedAt: new Date().toISOString() }
          : emp
      );
      onEmployeesUpdate(updatedEmployees);
    } else {
      const newEmployee: Employee = {
        ...formData,
        id: Date.now().toString(),
        shopId: shop.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      onEmployeesUpdate([...employees, newEmployee]);
    }
    
    resetForm();
  };

  const handleEdit = (employee: Employee) => {
    setFormData({
      name: employee.name,
      startDate: employee.startDate,
      role: employee.role,
      payType: employee.payType,
      hourlyRate: employee.hourlyRate || 0,
      salaryAmount: employee.salaryAmount || 0,
      commissionRate: employee.commissionRate || 0,
      commissionType: employee.commissionType || 'GP Percentage',
    });
    setEditingEmployee(employee);
    setIsAddingEmployee(true);
  };

  const handleDelete = (employeeId: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      onEmployeesUpdate(employees.filter(emp => emp.id !== employeeId));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Employee Management</h2>
        <Button onClick={() => setIsAddingEmployee(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
      </div>

      {isAddingEmployee && (
        <Card>
          <CardHeader>
            <CardTitle>{editingEmployee ? 'Edit Employee' : 'Add New Employee'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Employee Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={formData.role} onValueChange={(value: Employee['role']) => setFormData(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technician">Technician</SelectItem>
                      <SelectItem value="Service Advisor">Service Advisor</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Owner">Owner</SelectItem>
                      <SelectItem value="Part Time Hourly">Part Time Hourly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="payType">Pay Type</Label>
                  <Select value={formData.payType} onValueChange={(value: Employee['payType']) => setFormData(prev => ({ ...prev, payType: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hourly + Proficiency">Hourly + Proficiency</SelectItem>
                      <SelectItem value="Flat Rate">Flat Rate</SelectItem>
                      <SelectItem value="Hourly">Hourly</SelectItem>
                      <SelectItem value="Salary">Salary</SelectItem>
                      <SelectItem value="Salary + Commission">Salary + Commission</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {(formData.payType === 'Hourly' || formData.payType === 'Hourly + Proficiency' || formData.payType === 'Flat Rate') && (
                <div>
                  <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    step="0.01"
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData(prev => ({ ...prev, hourlyRate: parseFloat(e.target.value) }))}
                  />
                </div>
              )}

              {(formData.payType === 'Salary' || formData.payType === 'Salary + Commission') && (
                <div>
                  <Label htmlFor="salaryAmount">Annual Salary ($)</Label>
                  <Input
                    id="salaryAmount"
                    type="number"
                    value={formData.salaryAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, salaryAmount: parseFloat(e.target.value) }))}
                  />
                </div>
              )}

              {formData.payType === 'Salary + Commission' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                    <Input
                      id="commissionRate"
                      type="number"
                      step="0.01"
                      value={formData.commissionRate}
                      onChange={(e) => setFormData(prev => ({ ...prev, commissionRate: parseFloat(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="commissionType">Commission Type</Label>
                    <Select value={formData.commissionType} onValueChange={(value: Employee['commissionType']) => setFormData(prev => ({ ...prev, commissionType: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GP Percentage">GP Percentage</SelectItem>
                        <SelectItem value="Profit Dollars">Profit Dollars</SelectItem>
                        <SelectItem value="Tiered GP">Tiered GP</SelectItem>
                        <SelectItem value="Tiered Commission">Tiered Commission</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <Button type="submit">
                  {editingEmployee ? 'Update Employee' : 'Add Employee'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {employees.map((employee) => (
          <Card key={employee.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{employee.name}</h3>
                  <p className="text-gray-600">{employee.role}</p>
                  <p className="text-sm text-gray-500">Start Date: {employee.startDate}</p>
                  <p className="text-sm text-gray-500">Pay Type: {employee.payType}</p>
                  {employee.hourlyRate && <p className="text-sm text-gray-500">Hourly Rate: ${employee.hourlyRate}/hr</p>}
                  {employee.salaryAmount && <p className="text-sm text-gray-500">Salary: ${employee.salaryAmount}/year</p>}
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(employee)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(employee.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {employees.length === 0 && !isAddingEmployee && (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-gray-500">No employees added yet. Click "Add Employee" to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EmployeeManagement;
