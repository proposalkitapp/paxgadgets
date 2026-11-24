import { NextRequest, NextResponse } from "next/server";
import { products } from "@/data/products";

export interface RecommendationItem {
  productId: string;
  matchScore: number;
  matchReason: string;
  highlightFeature: string;
}

export interface RecommendationResponse {
  headline: string;
  explanation: string;
  recommendations: RecommendationItem[];
  suggestedFollowUps: string[];
  source: "ai-gateway" | "fallback-catalog-matcher";
  modelUsed?: string;
}

// System prompt catalog definition
const CATALOG_SUMMARY = products.map((p) => ({
  id: p.id,
  name: p.name,
  category: p.category,
  price: p.price,
  availabilityStatus: p.availabilityStatus,
  shortDescription: p.shortDescription,
  features: p.features,
  specifications: p.specifications,
}));

/**
 * Intelligent local semantic & attribute matching engine (used if AI Gateway key is absent or unreachable)
 */
function localCatalogMatcher(query: string): RecommendationResponse {
  const q = query.toLowerCase();

  const scored = products.map((product) => {
    let score = 20; // baseline
    const reasons: string[] = [];

    const textToMatch = [
      product.name,
      product.category,
      product.shortDescription,
      product.description,
      ...product.features,
      ...product.specifications.map((s) => `${s.label} ${s.value}`),
    ]
      .join(" ")
      .toLowerCase();

    // Query terms
    const tokens = q.split(/\s+/).filter((t) => t.length > 2);
    for (const token of tokens) {
      if (textToMatch.includes(token)) {
        score += 15;
      }
    }

    // Heuristics by domain
    // 1. Power & Charging
    if (
      (q.includes("charge") || q.includes("power") || q.includes("travel") || q.includes("battery") || q.includes("flight") || q.includes("gan") || q.includes("wireless") || q.includes("station")) &&
      product.categorySlug === "power-charging"
    ) {
      score += 35;
      if (q.includes("powerbank") || q.includes("portable") || q.includes("flight") || q.includes("aviation")) {
        if (product.id === "prod-powerbank-01") {
          score += 30;
          reasons.push("Aviation-certified high-density power cell with 10-layer thermal protection");
        }
      } else if (q.includes("gan") || q.includes("desktop") || q.includes("laptop") || q.includes("140w") || q.includes("macbook")) {
        if (product.id === "prod-gan-charger-02") {
          score += 35;
          reasons.push("140W GaN III fast charger capable of fueling a 16-inch MacBook Pro to 50% in 28 minutes");
        }
      } else if (q.includes("wireless") || q.includes("magnetic") || q.includes("3-in-1") || q.includes("magcharge") || q.includes("stand")) {
        if (product.id === "prod-magcharge-hub-03") {
          score += 35;
          reasons.push("Official Qi2 15W magnetic rapid wireless floating dock for phone, watch, and earpods");
        }
      }
    }

    // 2. Audio & Earpods
    if (
      (q.includes("audio") || q.includes("music") || q.includes("listen") || q.includes("sound") || q.includes("headphone") || q.includes("earbud") || q.includes("earpod") || q.includes("anc") || q.includes("bone")) &&
      product.categorySlug === "audio"
    ) {
      score += 30;
      if (q.includes("earpod") || q.includes("touchscreen") || q.includes("screen") || q.includes("oled") || q.includes("spatial")) {
        if (product.id === "prod-earbuds-pro-05") {
          score += 40;
          reasons.push("Flagship 48dB hybrid ANC earpods with interactive OLED touchscreen smart case and lossless LDAC");
        }
      } else if (q.includes("studio") || q.includes("over-ear") || q.includes("mix") || q.includes("creator")) {
        if (product.id === "prod-anc-headphones-03") {
          score += 35;
          reasons.push("45mm custom titanium drivers and lossless transmission engineered for creators and audio monitors");
        }
      } else if (q.includes("bone") || q.includes("sport") || q.includes("run") || q.includes("cycl") || q.includes("open-ear")) {
        if (product.id === "prod-openear-08") {
          score += 40;
          reasons.push("Bone-conduction open-ear transducers with IP68 submersible build for athletic safety");
        }
      } else if (q.includes("water") || q.includes("outdoor") || q.includes("speaker") || q.includes("party")) {
        if (product.id === "prod-bt-speaker-04") {
          score += 30;
          reasons.push("IPX7 submersion-proof chassis with 360-degree dual sub-bass radiators");
        }
      } else if (product.id === "prod-earbuds-02") {
        score += 20;
        reasons.push("Compact beryllium dynamic driver earbuds with 42dB hybrid active noise cancellation");
      }
    }

    // 3. Cameras & Imaging
    if (
      (q.includes("camera") || q.includes("action") || q.includes("4k") || q.includes("video") || q.includes("photo") || q.includes("360") || q.includes("dashcam") || q.includes("car") || q.includes("lens") || q.includes("vlog")) &&
      product.categorySlug === "cameras"
    ) {
      score += 40;
      if (q.includes("action") || q.includes("waterproof") || q.includes("swim") || q.includes("diving") || q.includes("vlog") || q.includes("dual screen")) {
        if (product.id === "prod-actioncam-09") {
          score += 35;
          reasons.push("Sony 1/1.3-inch sensor with 4K/60fps HDR, 16m native waterproofing, and dual touchscreens");
        }
      } else if (q.includes("360") || q.includes("panoramic") || q.includes("vr") || q.includes("invisible")) {
        if (product.id === "prod-pocket360-10") {
          score += 40;
          reasons.push("5.7K active HDR 360-degree capture with invisible selfie stick automated drone angles");
        }
      } else if (q.includes("dashcam") || q.includes("car") || q.includes("drive") || q.includes("parking") || q.includes("security")) {
        if (product.id === "prod-dashcam-11") {
          score += 40;
          reasons.push("Sony STARVIS 2 4K night vision vehicular camera with 24/7 radar parking guardian");
        }
      }
    }

    // 4. Gimbals & Stabilization
    if (
      (q.includes("gimbal") || q.includes("stabiliz") || q.includes("shake") || q.includes("smooth") || q.includes("tracking") || q.includes("motor") || q.includes("cinema") || q.includes("rig")) &&
      product.categorySlug === "gimbals"
    ) {
      score += 40;
      if (q.includes("phone") || q.includes("smart") || q.includes("mobile") || q.includes("tiktok") || q.includes("selfie")) {
        if (product.id === "prod-gimbal-mobile-12") {
          score += 35;
          reasons.push("Magnetic AI vision sensor tracks face/body autonomously with built-in 215mm telescopic extension rod");
        }
      } else if (q.includes("cinema") || q.includes("pro") || q.includes("dslr") || q.includes("mirrorless") || q.includes("heavy") || q.includes("payload")) {
        if (product.id === "prod-gimbal-pro-13") {
          score += 40;
          reasons.push("Heavy-duty 3.2kg payload capacity with unibody carbon fiber arms and automated axis locks");
        }
      }
    }

    // 5. Wearables & Smart Tech
    if (
      (q.includes("watch") || q.includes("wearable") || q.includes("smartwatch") || q.includes("ecg") || q.includes("titanium") || q.includes("health") || q.includes("fitness") || q.includes("heart")) &&
      product.categorySlug === "wearables"
    ) {
      score += 40;
      if (product.id === "prod-smartwatch-14") {
        score += 35;
        reasons.push("Grade 5 titanium chassis with sapphire glass, medical-grade ECG biometrics, and 14-day battery");
      }
    }

    if (
      (q.includes("dap") || q.includes("hi-res") || q.includes("lossless") || q.includes("offline") || q.includes("audiophile") || q.includes("dsd") || q.includes("flac")) &&
      product.id === "prod-mp3-player-06"
    ) {
      score += 45;
      reasons.push("Dedicated dual 32-bit ESS Sabre DACs with balanced 4.4mm output for pure offline listening");
    }

    if (
      (q.includes("phone") || q.includes("mobile") || q.includes("minimalist") || q.includes("privacy") || q.includes("clean")) &&
      product.id === "prod-smartphone-05"
    ) {
      score += 40;
      reasons.push("Distraction-free pure OS with hardware privacy kill-switches and 4nm computing");
    }

    // 6. Gear & Accessories
    if (
      (q.includes("hub") || q.includes("dock") || q.includes("hdmi") || q.includes("port") || q.includes("monitor") || q.includes("ethernet") || q.includes("display")) &&
      product.id === "prod-dock-15"
    ) {
      score += 45;
      reasons.push("CNC aluminum 10-in-1 workstation hub with dual 4K/60Hz HDMI and 100W Power Delivery");
    }

    if (
      (q.includes("stand") || q.includes("mount") || q.includes("desk") || q.includes("holder") || q.includes("magnetic stand")) &&
      product.id === "prod-stand-16"
    ) {
      score += 45;
      reasons.push("CNC aerospace alloy and titanium dampers with 360-degree ball joint articulation");
    }

    if (
      (q.includes("cable") || q.includes("cord") || q.includes("durable") || q.includes("tough") || q.includes("break") || q.includes("fast charge")) &&
      product.id === "prod-cable-07"
    ) {
      score += 40;
      reasons.push("Ballistic Kevlar-reinforced 100W PD cabling with 30,000+ bend tolerance");
    }

    // Availability weight
    if (product.availabilityStatus === "Available") {
      score += 10;
    }

    const normalizedScore = Math.min(99, Math.max(50, score));
    const defaultReason =
      reasons[0] ||
      product.features[0] ||
      product.shortDescription;

    return {
      product,
      score: normalizedScore,
      matchReason: defaultReason,
      highlightFeature: product.features[0] || "Engineered for high daily endurance",
    };
  });

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);
  const topMatches = scored.slice(0, 3);

  const matchedItems: RecommendationItem[] = topMatches.map((m) => ({
    productId: m.product.id,
    matchScore: m.score,
    matchReason: m.matchReason,
    highlightFeature: m.highlightFeature,
  }));

  const primaryCategory = topMatches[0]?.product.category || "Hardware";

  return {
    headline: `Engineered Recommendation for "${query.slice(0, 40)}"`,
    explanation: `We analyzed our catalog against your requirements. These ${topMatches.length} hardware units in ${primaryCategory} align with your performance, thermal endurance, and portability priorities.`,
    recommendations: matchedItems,
    suggestedFollowUps: [
      "Looking for high-speed action cameras or phone gimbals?",
      "Need spatial ANC earpods with smart touchscreen case?",
      "Interested in aerospace titanium smartwatches with ECG?",
    ],
    source: "fallback-catalog-matcher",
  };
}

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Query parameter must be a non-empty string" },
        { status: 400 }
      );
    }

    const apiKey = process.env.AI_GATEWAY_API_KEY || process.env.OPENAI_API_KEY;

    // If an external AI gateway is available, we query it; otherwise we use our zero-latency semantic matcher
    if (apiKey) {
      try {
        const systemPrompt = `You are the lead hardware engineer and product concierge for Brand (Nigeria), a boutique maker of high-end industrial tech gadgets: high-density power banks, GaN chargers, spatial ANC earpods, 4K action cameras, 3-axis motorized gimbals, titanium smartwatches, and CNC accessories.
Below is our current live hardware catalogue:
${JSON.stringify(CATALOG_SUMMARY, null, 2)}

Given the user's requirements, select 1 to 3 best matching products. Return ONLY a valid JSON object matching this schema:
{
  "headline": string (concise punchy recommendation summary),
  "explanation": string (1-2 sentences on why these suit their use-case),
  "recommendations": [
    {
      "productId": string (must match an exact id in catalog),
      "matchScore": number (between 75 and 99),
      "matchReason": string (1 crisp sentence explaining why),
      "highlightFeature": string (the single most relevant feature)
    }
  ],
  "suggestedFollowUps": [string, string, string]
}`;

        const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: query },
            ],
            response_format: { type: "json_object" },
            temperature: 0.2,
          }),
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          const parsed = JSON.parse(aiData.choices[0].message.content);
          return NextResponse.json({
            ...parsed,
            source: "ai-gateway",
            modelUsed: "gpt-4o-mini",
          });
        }
      } catch (err) {
        console.warn("[Recommendations] AI Gateway error, falling back to local catalog matcher:", err);
      }
    }

    // High-performance deterministic fallback matcher
    const result = localCatalogMatcher(query);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[Recommendations] Handler error:", error);
    return NextResponse.json(
      { error: "Internal server error analyzing catalog recommendations" },
      { status: 500 }
    );
  }
}
