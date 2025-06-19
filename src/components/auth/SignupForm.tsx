
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { SignupData } from '../../types/Auth';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { AlertCircle, CheckCircle } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState('login');

  const handleInputChange = (field: keyof SignupData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  // Validation functions for each tab
  const validateLoginInfo = () => {
    return formData.firstName.trim() !== '' &&
           formData.lastName.trim() !== '' &&
           formData.email.trim() !== '' &&
           formData.password.length >= 6 &&
           confirmPassword === formData.password;
  };

  const validatePersonalInfo = () => {
    return formData.phone.trim() !== '' &&
           formData.address.trim() !== '' &&
           formData.city.trim() !== '' &&
           formData.state.trim() !== '' &&
           formData.zipCode.trim() !== '';
  };

  const validateBillingInfo = () => {
    if (sameBilling) return true;
    return (formData.billingAddress || '').trim() !== '' &&
           (formData.billingCity || '').trim() !== '' &&
           (formData.billingState || '').trim() !== '' &&
           (formData.billingZipCode || '').trim() !== '';
  };

  const isTabComplete = (tab: string) => {
    switch (tab) {
      case 'login': return validateLoginInfo();
      case 'personal': return validatePersonalInfo();
      case 'billing': return validateBillingInfo();
      default: return false;
    }
  };

  const handleTabChange = (newTab: string) => {
    // Allow switching to any tab, but show validation status
    setActiveTab(newTab);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate all tabs before submission
    if (!validateLoginInfo()) {
      setError('Please complete all Login Info fields correctly');
      setActiveTab('login');
      setIsLoading(false);
      return;
    }

    if (!validatePersonalInfo()) {
      setError('Please complete all Personal Info fields');
      setActiveTab('personal');
      setIsLoading(false);
      return;
    }

    if (!validateBillingInfo()) {
      setError('Please complete all Billing Info fields');
      setActiveTab('billing');
      setIsLoading(false);
      return;
    }

    if (formData.password !== confirmPassword) {
      setError('Passwords do not match');
      setActiveTab('login');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setActiveTab('login');
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
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="login" className="flex items-center space-x-2">
                {isTabComplete('login') && <CheckCircle className="h-4 w-4 text-green-600" />}
                <span>Login Info</span>
              </TabsTrigger>
              <TabsTrigger value="personal" className="flex items-center space-x-2">
                {isTabComplete('personal') && <CheckCircle className="h-4 w-4 text-green-600" />}
                <span>Personal Info</span>
              </TabsTrigger>
              <TabsTrigger value="billing" className="flex items-center space-x-2">
                {isTabComplete('billing') && <CheckCircle className="h-4 w-4 text-green-600" />}
                <span>Billing Info</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                    className={formData.firstName.trim() === '' ? 'border-red-300' : ''}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    required
                    className={formData.lastName.trim() === '' ? 'border-red-300' : ''}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  className={formData.email.trim() === '' ? 'border-red-300' : ''}
                />
              </div>
              
              <div>
                <Label htmlFor="password">Password * (min 6 characters)</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                  className={formData.password.length < 6 ? 'border-red-300' : ''}
                />
              </div>
              
              <div>
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={confirmPassword !== formData.password ? 'border-red-300' : ''}
                />
                {confirmPassword && confirmPassword !== formData.password && (
                  <p className="text-sm text-red-600 mt-1">Passwords do not match</p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="personal" className="space-y-4">
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                  className={formData.phone.trim() === '' ? 'border-red-300' : ''}
                />
              </div>
              
              <div>
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  required
                  className={formData.address.trim() === '' ? 'border-red-300' : ''}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    required
                    className={formData.city.trim() === '' ? 'border-red-300' : ''}
                  />
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    required
                    className={formData.state.trim() === '' ? 'border-red-300' : ''}
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code *</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    required
                    className={formData.zipCode.trim() === '' ? 'border-red-300' : ''}
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
                    <Label htmlFor="billingAddress">Billing Address *</Label>
                    <Input
                      id="billingAddress"
                      value={formData.billingAddress || ''}
                      onChange={(e) => handleInputChange('billingAddress', e.target.value)}
                      required
                      className={(formData.billingAddress || '').trim() === '' ? 'border-red-300' : ''}
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="billingCity">City *</Label>
                      <Input
                        id="billingCity"
                        value={formData.billingCity || ''}
                        onChange={(e) => handleInputChange('billingCity', e.target.value)}
                        required
                        className={(formData.billingCity || '').trim() === '' ? 'border-red-300' : ''}
                      />
                    </div>
                    <div>
                      <Label htmlFor="billingState">State *</Label>
                      <Input
                        id="billingState"
                        value={formData.billingState || ''}
                        onChange={(e) => handleInputChange('billingState', e.target.value)}
                        required
                        className={(formData.billingState || '').trim() === '' ? 'border-red-300' : ''}
                      />
                    </div>
                    <div>
                      <Label htmlFor="billingZipCode">ZIP Code *</Label>
                      <Input
                        id="billingZipCode"
                        value={formData.billingZipCode || ''}
                        onChange={(e) => handleInputChange('billingZipCode', e.target.value)}
                        required
                        className={(formData.billingZipCode || '').trim() === '' ? 'border-red-300' : ''}
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
            <Button 
              type="submit" 
              disabled={isLoading || !validateLoginInfo() || !validatePersonalInfo() || !validateBillingInfo()}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SignupForm;
