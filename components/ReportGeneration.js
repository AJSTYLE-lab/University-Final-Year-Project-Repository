// ReportGeneration.js
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const ReportGeneration = () => {
  const generateReport = async (detectionData, userQuestion, geminiResponse) => {
    const doc = new jsPDF();

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    const title = "Mosquito Surveillance Report";
    const pageWidth = doc.internal.pageSize.getWidth();
    const titleWidth = doc.getTextWidth(title);
    const titleX = (pageWidth - titleWidth) / 2;
    doc.text(title, titleX, 20);
    doc.setLineWidth(0.5);
    doc.line(titleX, 22, titleX + titleWidth, 22);

    // Generated on
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    const currentDate = new Date().toLocaleString();
    doc.text(`Generated on: ${currentDate}`, 10, 30);

    let startY = 40;

    // Detection Details
    doc.setFontSize(14);
    doc.text("Detection Details", 10, startY);
    startY += 10;

    doc.setFontSize(12);
    doc.text(`Area: ${detectionData.area}`, 10, startY);
    startY += 10;
    doc.text(`Date: ${detectionData.date}`, 10, startY);
    startY += 10;

    // Weather Info
    if (detectionData.weatherInfo) {
      const weather = detectionData.weatherInfo;
      doc.text(`Temperature: ${weather.temperature} °C`, 10, startY);
      startY += 8;
      doc.text(`Humidity: ${weather.humidity} %`, 10, startY);
      startY += 8;
      doc.text(`Precipitation: ${weather.precipitation} mm`, 10, startY);
      startY += 8;
      doc.text(`Water Index: ${weather.waterIndex} %`, 10, startY);
      startY += 10;
    }

    // Input Image
    if (detectionData.inputImage) {
      doc.text("Input Image:", 10, startY);
      startY += 5;
      doc.addImage(detectionData.inputImage, "PNG", 10, startY, 90, 60);
      startY += 65;
    } else {
      doc.text("No input image available.", 10, startY);
      startY += 10;
    }

    // Output Image
    if (detectionData.outputImage) {
      doc.text("Output Image:", 10, startY);
      startY += 5;
      doc.addImage(detectionData.outputImage, "PNG", 10, startY, 90, 60);
      startY += 65;
    } else {
      doc.text("No output image available.", 10, startY);
      startY += 10;
    }

    // Gemini Q&A Section
    if (userQuestion && geminiResponse) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Gemini Q&A", 10, startY);
      startY += 10;

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("User Question:", 10, startY);
      startY += 6;
      const splitQuestion = doc.splitTextToSize(userQuestion, 180);
      doc.text(splitQuestion, 10, startY);
      startY += splitQuestion.length * 6;

      doc.text("System Response:", 10, startY);
      startY += 6;
      const splitResponse = doc.splitTextToSize(geminiResponse, 180);
      doc.text(splitResponse, 10, startY);
      startY += splitResponse.length * 6;
    }

    doc.save("Mosquito_Surveillance_Report.pdf");
  };

  return { generateReport };
};

export default ReportGeneration;
