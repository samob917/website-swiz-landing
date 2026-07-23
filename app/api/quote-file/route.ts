import { issueSignedToken, presignUrl } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

// Streams a quote attachment from the private Blob store. The pathnames
// carry an unguessable random suffix (added at upload), so possession of a
// link from the quote email is what grants access, like a private share link.
//
// Uses issueSignedToken + presignUrl instead of get(): the delegation expiry
// is validated by Vercel's clock, so a skewed server clock can't produce
// links that are expired on arrival.
export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.searchParams.get("pathname")

  if (!pathname || !pathname.startsWith("quote-uploads/")) {
    return NextResponse.json({ error: "Invalid pathname" }, { status: 400 })
  }

  try {
    const signed = await issueSignedToken({
      pathname,
      operations: ["get"],
      validUntil: Date.now() + 6 * 60 * 60 * 1000,
      // Prefer the read-write token over OIDC so local dev (where OIDC is
      // not enabled) behaves the same as production.
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })
    // The runtime builds the host from `access` but the SDK types omit the
    // field, hence the cast; without it the hostname contains "undefined".
    const { presignedUrl } = await presignUrl(signed, {
      operation: "get",
      pathname,
      access: "private",
    } as Parameters<typeof presignUrl>[1])

    const upstream = await fetch(presignedUrl)
    if (upstream.status === 404) {
      return new NextResponse("Not found", { status: 404 })
    }
    if (!upstream.ok || !upstream.body) {
      return new NextResponse("File temporarily unavailable", { status: 502 })
    }

    const filename = pathname.split("/").pop() ?? "attachment"
    return new NextResponse(upstream.body, {
      headers: {
        "Content-Type":
          upstream.headers.get("content-type") || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${filename.replace(/"/g, "")}"`,
        "X-Content-Type-Options": "nosniff",
      },
    })
  } catch (error) {
    console.error("quote-file error:", error)
    return new NextResponse("Not found", { status: 404 })
  }
}
