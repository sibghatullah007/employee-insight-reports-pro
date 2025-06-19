
import React, { useState } from 'react';
import { Shop } from '../../types/Shop';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface ShopSetupProps {
  shop: Shop | null;
  onShopSetup: (shopData: Omit<Shop, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
}

const ShopSetup: React.FC<ShopSetupProps> = ({ shop, onShopSetup }) => {
  const [formData, setFormData] = useState({
    name: shop?.name || '',
    numberOfEmployees: shop?.numberOfEmployees || 1,
    specialty: shop?.specialty || 'General Auto Repair' as const,
    payrollType: shop?.payrollType || 'Bi-weekly' as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onShopSetup(formData);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Shop/Business Information</CardTitle>
        <CardDescription>
          {shop ? 'Update your shop information' : 'Set up your shop information to get started'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Shop/Business Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="employees">Number of Employees</Label>
            <Input
              id="employees"
              type="number"
              min="1"
              value={formData.numberOfEmployees}
              onChange={(e) => handleInputChange('numberOfEmployees', parseInt(e.target.value))}
              required
            />
          </div>

          <div>
            <Label htmlFor="specialty">Shop Specialty</Label>
            <Select value={formData.specialty} onValueChange={(value) => handleInputChange('specialty', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select specialty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="General Auto Repair">General Auto Repair</SelectItem>
                <SelectItem value="Auto Body/Collision Repair">Auto Body/Collision Repair</SelectItem>
                <SelectItem value="Restoration">Restoration</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="payrollType">Payroll Type</Label>
            <Select value={formData.payrollType} onValueChange={(value) => handleInputChange('payrollType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select payroll type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Weekly">Weekly</SelectItem>
                <SelectItem value="Bi-weekly">Bi-weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full">
            {shop ? 'Update Shop Information' : 'Save Shop Information'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ShopSetup;
