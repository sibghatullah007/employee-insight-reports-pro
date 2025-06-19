import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { SignupData } from '../../types/Auth';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { AlertCircle } from 'lucide-react';

interface SignupFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSuccess, onSwitchToLogin }) => {
  const { signup } = useAuth();
  const [formData, setFormData] = useState<SignupData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [sameBilling, setSameBilling] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: keyof SignupData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    const signupData = { ...formData };
    if (!sameBilling) {
      // Keep billing address fields from formData
    } else {
      // Copy address to billing
      signupData.billingAddress = formData.address;
      signupData.billingCity = formData.city;
      signupData.billingState = formData.state;
      signupData.billingZipCode = formData.zipCode;
    }

    const success = await signup(signupData);
    setIsLoading(false);

    if (success) {
      onSuccess();
    } else {
      setError('Email already exists or signup failed');
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create Your Account</CardTitle>
        <CardDescription>
          Set up your payroll management account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="login">Login Info</TabsTrigger>
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="billing">Billing Info</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </TabsContent>
            
            <TabsContent value="personal" className="space-y-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  required
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    required
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="billing" className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="sameBilling"
                  checked={sameBilling}
                  onChange={(e) => setSameBilling(e.target.checked)}
                />
                <Label htmlFor="sameBilling">Same as address above</Label>
              </div>
              
              {!sameBilling && (
                <>
                  <div>
                    <Label htmlFor="billingAddress">Billing Address</Label>
                    <Input
                      id="billingAddress"
                      value={formData.billingAddress || ''}
                      onChange={(e) => handleInputChange('billingAddress', e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="billingCity">City</Label>
                      <Input
                        id="billingCity"
                        value={formData.billingCity || ''}
                        onChange={(e) => handleInputChange('billingCity', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="billingState">State</Label>
                      <Input
                        id="billingState"
                        value={formData.billingState || ''}
                        onChange={(e) => handleInputChange('billingState', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="billingZipCode">ZIP Code</Label>
                      <Input
                        id="billingZipCode"
                        value={formData.billingZipCode || ''}
                        onChange={(e) => handleInputChange('billingZipCode', e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>

          {error && (
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onSwitchToLogin}>
              Already have an account? Login
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SignupForm;
