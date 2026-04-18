import { NextResponse } from "next/server";

// Threat types we want to check against
const THREAT_TYPES = [
  "MALWARE",
  "SOCIAL_ENGINEERING",
  "UNWANTED_SOFTWARE",
  "POTENTIALLY_HARMFUL_APPLICATION",
];

export async function POST(request) {
  try {
    const { url } = await request.json();

    // Basic validation — dev-facing error, not shown to child
    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { safe: false, reason: "Invalid URL provided" },
        { status: 400 }
      );
    }

    const apiKey = process.env.SAFE_BROWSING_API_KEY;

    // If no API key is configured, allow all traffic
    // and log a warning for the developer
    if (!apiKey) {
      console.warn(
        "[KidBrowse] SAFE_BROWSING_API_KEY not set — skipping check and allowing URL."
      );
      return NextResponse.json({ safe: true, reason: "API key not configured" });
    }

    // Call the Google Safe Browsing v4 API
    const safeBrowsingRes = await fetch(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client: { clientId: "kidbrowse", clientVersion: "1.0.0" },
          threatInfo: {
            threatTypes: THREAT_TYPES,
            platformTypes: ["ANY_PLATFORM"],
            threatEntryTypes: ["URL"],
            threatEntries: [{ url }],
          },
        }),
      }
    );

    if (!safeBrowsingRes.ok) {
      // API error — fail open (allow) to avoid blocking legitimate sites when API is down
      console.error("[KidBrowse] Safe Browsing API error:", safeBrowsingRes.status);
      return NextResponse.json({ safe: true, reason: "Safety check temporarily unavailable" });
    }

    const data = await safeBrowsingRes.json();

    // If 'matches' array is present and non-empty, the URL is flagged
    if (data.matches && data.matches.length > 0) {
      const threat = data.matches[0].threatType;
      return NextResponse.json({
        safe: false,
        reason: `This site was flagged as unsafe (${threat}).`,
      });
    }

    // No matches — URL is safe
    return NextResponse.json({ safe: true });
  } catch (err) {
    // Dev-facing log, user-facing generic message
    console.error("[KidBrowse] check-url error:", err);
    return NextResponse.json(
      { safe: false, reason: "Could not verify this site. Please try again." },
      { status: 500 }
    );
  }
}
