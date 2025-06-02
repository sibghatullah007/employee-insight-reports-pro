
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Employee } from '../types/Employee';

export const generateEmployeePDF = async (employee: Employee, elementId: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found for PDF generation');
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: false
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${employee.name.replace(/\s+/g, '_')}_Performance_Report.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};
