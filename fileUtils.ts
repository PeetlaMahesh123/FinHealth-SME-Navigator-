
import * as pdfjsLib from "pdfjs-dist";
import * as XLSX from "xlsx";

// Setup worker using a CDN to ensure it works in browser environments
const PDFJS_VERSION = '4.0.379';
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.mjs`;

export const fileToText = async (file: File): Promise<string> => {
  const ext = file.name.split(".").pop()?.toLowerCase();

  // 1. Plain Text or CSV (Simple parsing)
  if (ext === "txt" || ext === "csv") {
    return await file.text();
  }

  // 2. Excel (.xls, .xlsx)
  if (ext === "xls" || ext === "xlsx") {
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      let text = "";
      
      workbook.SheetNames.forEach(sheetName => {
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        rows.forEach((row: any) => {
          if (Array.isArray(row)) {
            text += row.filter(cell => cell !== null && cell !== undefined).join(" | ") + "\n";
          }
        });
      });
      return text;
    } catch (err) {
      console.error("Excel parsing error:", err);
      throw new Error("Failed to read Excel file. Ensure it is not password protected.");
    }
  }

  // 3. PDF Parsing
  if (ext === "pdf") {
    try {
      const buffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: buffer });
      const pdf = await loadingTask.promise;

      let text = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items
          .map((item: any) => item.str || "")
          .join(" ");
        text += strings + "\n";
      }
      return text;
    } catch (err) {
      console.error("PDF parsing error:", err);
      throw new Error("Failed to read PDF. Ensure it is a text-based PDF and not a scanned image.");
    }
  }

  throw new Error("Unsupported format. Use CSV, Excel, PDF, or TXT.");
};
