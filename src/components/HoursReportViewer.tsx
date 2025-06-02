
import React from 'react';
import { User, DollarSign, Clock, TrendingUp } from 'lucide-react';
import { EmployeeReport } from '../types/Employee';
import PdfDownloader from './PdfDownloader';

interface HoursReportViewerProps {
  reports: EmployeeReport[];
}

const HoursReportViewer: React.FC<HoursReportViewerProps> = ({ reports }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatHours = (hours: number) => {
    return hours.toFixed(2);
  };

  if (reports.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Employee Hours Reports
        </h2>
        <p className="text-gray-600">
          {reports.length} employee{reports.length !== 1 ? 's' : ''} processed
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {reports.map((report, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <div
              id={`employee-hours-report-${index}`}
              className="p-6"
            >
              {/* Header */}
              <div className="text-center mb-6 border-b pb-4">
                <h3 className="text-xl font-bold text-gray-900">{report.name}</h3>
                <p className="text-sm text-gray-600">{report.role}</p>
              </div>

              {/* Report Table */}
              <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
                <div className="mb-4">
                  <div className="font-bold text-lg mb-2">{report.name.toUpperCase()}</div>
                  <div className="grid grid-cols-4 gap-2 font-bold border-b pb-2">
                    <div></div>
                    <div className="text-center">HOURS</div>
                    <div className="text-center">RATE</div>
                    <div className="text-center">TOTAL</div>
                  </div>
                </div>

                {/* Week 1 */}
                <div className="space-y-1 mb-2">
                  <div className="grid grid-cols-4 gap-2">
                    <div>WEEK 1 WORKED HOURS</div>
                    <div className="text-center">{formatHours(report.week1.workedHours)}</div>
                    <div className="text-center">$30.00</div>
                    <div className="text-center">{formatCurrency(report.week1.workedPay)}</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div>WEEK 1 OVERTIME</div>
                    <div className="text-center">{formatHours(report.week1.overtime)}</div>
                    <div className="text-center">$45.00</div>
                    <div className="text-center">{formatCurrency(report.week1.overtimePay)}</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div>WEEK 1 BILLED HOURS</div>
                    <div className="text-center">{formatHours(report.week1.billedHours)}</div>
                    <div className="text-center"></div>
                    <div className="text-center"></div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div>WEEK 1 PROFICIENCY</div>
                    <div className="text-center">{report.week1.proficiency.toFixed(2)}%</div>
                    <div className="text-center"></div>
                    <div className="text-center"></div>
                  </div>
                </div>

                {/* Week 2 */}
                <div className="space-y-1 mb-2">
                  <div className="grid grid-cols-4 gap-2">
                    <div>WEEK 2 WORKED HOURS</div>
                    <div className="text-center">{formatHours(report.week2.workedHours)}</div>
                    <div className="text-center">$30.00</div>
                    <div className="text-center">{formatCurrency(report.week2.workedPay)}</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div>WEEK 2 OVERTIME</div>
                    <div className="text-center">{formatHours(report.week2.overtime)}</div>
                    <div className="text-center">$45.00</div>
                    <div className="text-center">{formatCurrency(report.week2.overtimePay)}</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div>WEEK 2 BILLED HOURS</div>
                    <div className="text-center">{formatHours(report.week2.billedHours)}</div>
                    <div className="text-center"></div>
                    <div className="text-center"></div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div>WEEK 2 PROFICIENCY</div>
                    <div className="text-center">{report.week2.proficiency.toFixed(2)}%</div>
                    <div className="text-center"></div>
                    <div className="text-center"></div>
                  </div>
                </div>

                {/* PTO and Holiday */}
                <div className="space-y-1 mb-2">
                  <div className="grid grid-cols-4 gap-2">
                    <div>PTO</div>
                    <div className="text-center">{formatHours(report.pto)}</div>
                    <div className="text-center">$30.00</div>
                    <div className="text-center">{formatCurrency(report.pto * 30)}</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div>HOLIDAY</div>
                    <div className="text-center">{formatHours(report.holiday)}</div>
                    <div className="text-center">$0.00</div>
                    <div className="text-center">{formatCurrency(report.holiday * 0)}</div>
                  </div>
                </div>

                {/* Incentives */}
                <div className="space-y-1 mb-4">
                  <div className="grid grid-cols-4 gap-2">
                    <div>INCENTIVE WEEK 1</div>
                    <div className="text-center">{formatHours(report.week1.billedHours)}</div>
                    <div className="text-center">$7.50</div>
                    <div className="text-center">{formatCurrency(report.week1.incentive)}</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div>INCENTIVE WEEK 2</div>
                    <div className="text-center">{formatHours(report.week2.billedHours)}</div>
                    <div className="text-center">$0.00</div>
                    <div className="text-center">{formatCurrency(report.week2.incentive)}</div>
                  </div>
                </div>

                {/* Total */}
                <div className="border-t pt-2">
                  <div className="grid grid-cols-4 gap-2 font-bold">
                    <div>TOTAL GROSS WAGES</div>
                    <div className="text-center"></div>
                    <div className="text-center"></div>
                    <div className="text-center">{formatCurrency(report.totalGross)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Download Button */}
            <div className="px-6 pb-4">
              <PdfDownloader
                employee={{ name: report.name } as any}
                elementId={`employee-hours-report-${index}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HoursReportViewer;
