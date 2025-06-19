import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Shop, Employee, PayrollSubmission as PayrollSubmissionType } from '../types/Shop';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Building2, Users, FileText, Plus, LogOut } from 'lucide-react';
import ShopSetup from '../components/shop/ShopSetup';
import EmployeeManagement from '../components/shop/EmployeeManagement';
import PayrollHistory from '../components/payroll/PayrollHistory';
import PayrollSubmission from '../components/payroll/PayrollSubmission';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [shop, setShop] = useState<Shop | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [payrollHistory, setPayrollHistory] = useState<PayrollSubmissionType[]>([]);
  const [activeTab, setActiveTab] = useState<'setup' | 'employees' | 'payroll' | 'history'>('setup');

  useEffect(() => {
    if (user) {
      // Load shop data
      const savedShop = localStorage.getItem(`shop_${user.id}`);
      if (savedShop) {
        setShop(JSON.parse(savedShop));
        setActiveTab('employees');
      }

      // Load employees
      const savedEmployees = localStorage.getItem(`employees_${user.id}`);
      if (savedEmployees) {
        setEmployees(JSON.parse(savedEmployees));
      }

      // Load payroll history
      const savedPayroll = localStorage.getItem(`payroll_${user.id}`);
      if (savedPayroll) {
        setPayrollHistory(JSON.parse(savedPayroll));
      }
    }
  }, [user]);

  const handleShopSetup = (shopData: Omit<Shop, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (user) {
      const newShop: Shop = {
        ...shopData,
        id: Date.now().toString(),
        userId: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setShop(newShop);
      localStorage.setItem(`shop_${user.id}`, JSON.stringify(newShop));
      setActiveTab('employees');
    }
  };

  const handleEmployeeUpdate = (updatedEmployees: Employee[]) => {
    setEmployees(updatedEmployees);
    if (user) {
      localStorage.setItem(`employees_${user.id}`, JSON.stringify(updatedEmployees));
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, {user.firstName} {user.lastName}
            </h1>
            <p className="text-gray-600">
              {shop ? `${shop.name} Dashboard` : 'Complete your setup to get started'}
            </p>
          </div>
          <Button onClick={logout} variant="outline">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex space-x-4 mb-8">
          <Button
            variant={activeTab === 'setup' ? 'default' : 'outline'}
            onClick={() => setActiveTab('setup')}
            className="flex items-center space-x-2"
          >
            <Building2 className="h-4 w-4" />
            <span>Shop Setup</span>
          </Button>
          
          <Button
            variant={activeTab === 'employees' ? 'default' : 'outline'}
            onClick={() => setActiveTab('employees')}
            disabled={!shop}
            className="flex items-center space-x-2"
          >
            <Users className="h-4 w-4" />
            <span>Employees</span>
          </Button>
          
          <Button
            variant={activeTab === 'payroll' ? 'default' : 'outline'}
            onClick={() => setActiveTab('payroll')}
            disabled={!shop}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>New Payroll</span>
          </Button>
          
          <Button
            variant={activeTab === 'history' ? 'default' : 'outline'}
            onClick={() => setActiveTab('history')}
            disabled={!shop}
            className="flex items-center space-x-2"
          >
            <FileText className="h-4 w-4" />
            <span>Payroll History</span>
          </Button>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto">
          {activeTab === 'setup' && (
            <ShopSetup shop={shop} onShopSetup={handleShopSetup} />
          )}
          
          {activeTab === 'employees' && shop && (
            <EmployeeManagement
              shop={shop}
              employees={employees}
              onEmployeesUpdate={handleEmployeeUpdate}
            />
          )}
          
          {activeTab === 'payroll' && shop && (
            <PayrollSubmission
              shop={shop}
              employees={employees}
            />
          )}
          
          {activeTab === 'history' && (
            <PayrollHistory history={payrollHistory} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
