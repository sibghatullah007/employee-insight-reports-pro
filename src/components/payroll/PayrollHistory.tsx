
import React from 'react';
import { PayrollSubmission } from '../../types/Shop';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { FileText, Calendar, DollarSign } from 'lucide-react';

interface PayrollHistoryProps {
  history: PayrollSubmission[];
}

const PayrollHistory: React.FC<PayrollHistoryProps> = ({ history }) => {
  const getStatusColor = (status: PayrollSubmission['status']) => {
    switch (status) {
      case 'Draft':
        return 'bg-gray-100 text-gray-800';
      case 'Submitted':
        return 'bg-blue-100 text-blue-800';
      case 'Processed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <FileText className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Payroll History</h2>
      </div>

      {history.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No payroll submissions yet.</p>
            <p className="text-sm text-gray-400">Your payroll submissions will appear here once you start processing payroll.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {history.map((submission) => (
            <Card key={submission.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      Payroll #{submission.id}
                    </CardTitle>
                    <CardDescription>
                      Pay Period: {formatDate(submission.payPeriodStart)} - {formatDate(submission.payPeriodEnd)}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(submission.status)}>
                    {submission.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="font-medium">Submitted</p>
                      <p className="text-gray-600">{formatDate(submission.submissionDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="font-medium">Total Amount</p>
                      <p className="text-gray-600">{formatCurrency(submission.totalAmount)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="font-medium">Employees</p>
                      <p className="text-gray-600">{submission.employeeData.length} employees</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PayrollHistory;
