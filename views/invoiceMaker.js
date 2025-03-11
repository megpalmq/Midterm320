const express = require("express");
const { jsPDF } = require("jspdf");
const mime = require("mime-types");
const path = require("path");

const app = express();
const port = 3000;

class GeneratePdf {
  pdfDoc;
  position = { y: 20, x: 10 };
  margin = { y: 20, x: 10 };
  pageCounter = 1;

  constructor() {
    this.pdfDoc = new jsPDF();
    this.pdfDoc.setFontSize(11);
  }

  addHeader(text, color = "black") {
    this.pdfDoc.setFontSize(16);
    this.pdfDoc.setTextColor(color);
    this.pdfDoc.text(text, this.position.x, this.position.y);
    this.position.y += 8;
    this.pdfDoc.setTextColor("black");
    this.pdfDoc.setFontSize(11);
  }

  addText(text, color = "black") {
    this.pdfDoc.setTextColor(color);
    this.pdfDoc.text(text, this.position.x, this.position.y);
    this.position.y += 5.5;
  }

  downloadPdf() {
    this.pdfDoc.save("This file.pdf");
  }

  getPdfBlob() {
    return this.pdfDoc.output("blob");
  }
}

app.get("/generate-pdf", (req, res) => {
  const pdf = new GeneratePdf();

  pdf.addHeader("Generated PDF Example", "blue");
  pdf.addText("This is a test PDF with some text content!");

  const pdfBlob = pdf.getPdfBlob();

  res.setHeader("Content-Type", mime.lookup(".pdf"));
  res.setHeader("Content-Disposition", "attachment; filename=generated.pdf");

  res.send(pdfBlob);
});

app.use(express.static(path.join(__dirname, "public")));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
