import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "url param required" }, { status: 400 });
  }

  try {
    // Microlink is a free, no-auth Open Graph metadata API
    const microlinkRes = await fetch(
      `https://api.microlink.io/?url=${encodeURIComponent(url)}&meta=true`,
      { next: { revalidate: 86400 } } // cache for 24 hours at the edge
    );

    if (!microlinkRes.ok) {
      return NextResponse.json({ title: null, image: null });
    }

    const data = await microlinkRes.json();

    return NextResponse.json({
      title: data?.data?.title || null,
      image: data?.data?.image?.url || null,
      description: data?.data?.description || null,
    });
  } catch (err) {
    console.error("[KidBrowse] site-meta error:", err);
    // Return nulls — the caller falls back to emoji placeholder
    return NextResponse.json({ title: null, image: null });
  }
}
