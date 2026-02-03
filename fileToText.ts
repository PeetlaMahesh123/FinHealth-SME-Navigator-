import * as pdfjsLib from "pdfjs-dist";
import * as XLSX from "xlsx";
// Use dynamic import for Tesseract to lazy-load and keep initial bundle small

// PDF worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.js",
  import.meta.url
).toString();

const ocrWorkerCreate = async () => {
  const tesseract: any = await import('tesseract.js');
  const worker = tesseract.createWorker({
    // optional logger: m => console.log(m)
  });
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  return worker;
};

export const fileToText = async (file: File): Promise<string> => {
  const ext = file.name.split(".").pop()?.toLowerCase();

  // ✅ TXT / CSV
  if (ext === "txt" || ext === "csv") {
    return await file.text();
  }

  // ✅ EXCEL (.xls, .xlsx)
  if (ext === "xls" || ext === "xlsx") {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });

    let text = "";
    workbook.SheetNames.forEach((sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      rows.forEach((row: any) => {
        text += row.join(" , ") + "\n";
      });
    });

    return text;
  }

  // ✅ PDF (try text extraction first, then OCR fallback)
  if (ext === "pdf") {
    const buffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item: any) => ("str" in item ? item.str : ""))
        .join(" ")
        .trim();
      text += pageText + "\n";
    }

    if (text.trim().length > 0) return text;

    // Fallback to OCR when no selectable text found
    const worker = await ocrWorkerCreate();
    try {
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d')!;
        await page.render({ canvasContext: ctx, viewport }).promise;
        const { data } = await worker.recognize(canvas);
        text += (data?.text || '') + "\n";
      }
    } finally {
      await worker.terminate();
    }

    return text;
  }

  // ✅ Image files (png, jpg, jpeg, bmp, tiff)
  if (ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'bmp' || ext === 'tiff') {
    const worker = await ocrWorkerCreate();
    try {
      // use createImageBitmap for browser
      const bitmap = await createImageBitmap(file);
      const canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(bitmap, 0, 0);
      const { data } = await worker.recognize(canvas);
      return (data?.text || '').trim();
    } finally {
      await worker.terminate();
    }
  }

  throw new Error("Unsupported file format");
};
