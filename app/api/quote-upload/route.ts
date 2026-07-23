import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"
import { NextResponse } from "next/server"

// Issues short-lived client tokens so the browser uploads quote attachments
// directly to Vercel Blob (no request-body size limit on our server).
// Requires BLOB_READ_WRITE_TOKEN in the environment (create a Blob store in
// the Vercel dashboard; local dev needs it in .env.local).
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        maximumSizeInBytes: 100 * 1024 * 1024,
        addRandomSuffix: true,
      }),
      // Blob calls this from their infra after the upload lands. Nothing to
      // do here: the client puts the resulting URLs into the quote email.
      onUploadCompleted: async () => {},
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 400 },
    )
  }
}
