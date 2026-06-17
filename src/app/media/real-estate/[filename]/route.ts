import { existsSync } from "fs";
import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

const uploadsDir = path.join(process.cwd(), "uploads", "real-estate");
const legacyPublicUploadsDir = path.join(process.cwd(), "public", "uploads", "real-estate");

function contentTypeFor(filename: string) {
  const extension = path.extname(filename).toLowerCase();

  switch (extension) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    case ".avif":
      return "image/avif";
    default:
      return "application/octet-stream";
  }
}

function resolveImagePath(filename: string) {
  const safeFilename = path.basename(filename);
  if (!safeFilename || safeFilename !== filename) return null;

  const primaryPath = path.join(uploadsDir, safeFilename);
  if (existsSync(primaryPath)) return primaryPath;

  const legacyPath = path.join(legacyPublicUploadsDir, safeFilename);
  if (existsSync(legacyPath)) return legacyPath;

  return null;
}

export async function GET(_: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params;
  const imagePath = resolveImagePath(filename);

  if (!imagePath) {
    return new NextResponse("Not found", { status: 404 });
  }

  const buffer = await readFile(imagePath);

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": contentTypeFor(filename),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
