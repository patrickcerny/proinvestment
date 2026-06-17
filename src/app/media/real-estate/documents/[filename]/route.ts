import { existsSync } from "fs";
import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

const documentsDir = path.join(process.cwd(), "uploads", "real-estate", "documents");
const legacyDocumentsDir = path.join(process.cwd(), "public", "uploads", "real-estate", "documents");

function contentTypeFor(filename: string) {
  const extension = path.extname(filename).toLowerCase();
  switch (extension) {
    case ".pdf": return "application/pdf";
    case ".doc": return "application/msword";
    case ".docx": return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    default: return "application/octet-stream";
  }
}

function resolveDocumentPath(filename: string) {
  const safeFilename = path.basename(filename);
  if (!safeFilename || safeFilename !== filename) return null;

  const primaryPath = path.join(documentsDir, safeFilename);
  if (existsSync(primaryPath)) return primaryPath;

  const legacyPath = path.join(legacyDocumentsDir, safeFilename);
  if (existsSync(legacyPath)) return legacyPath;

  return null;
}

export async function GET(_: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params;
  const documentPath = resolveDocumentPath(filename);

  if (!documentPath) {
    return new NextResponse("Not found", { status: 404 });
  }

  const buffer = await readFile(documentPath);

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": contentTypeFor(filename),
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
