import { type NextRequest, NextResponse } from "next/server"

// Simulated vector search results
const sampleResults = [
  {
    id: 1,
    title: "INSAT-3D Atmospheric Temperature Data",
    content:
      "INSAT-3D provides high-resolution atmospheric temperature profiles for weather forecasting and climate monitoring applications. The data includes vertical temperature soundings with high temporal resolution.",
    score: 0.94,
    source: "mosdac.gov.in/insat3d",
    metadata: { type: "product", category: "atmospheric", satellite: "INSAT-3D" },
  },
  {
    id: 2,
    title: "Satellite Data API Documentation",
    content:
      "Complete guide to accessing meteorological satellite data through MOSDAC REST API endpoints with authentication, rate limiting, and data format specifications.",
    score: 0.87,
    source: "mosdac.gov.in/api/docs",
    metadata: { type: "documentation", category: "api", service: "REST API" },
  },
  {
    id: 3,
    title: "Weather Forecasting Applications",
    content:
      "Applications of satellite-derived atmospheric data in numerical weather prediction models, climate research studies, and operational meteorology.",
    score: 0.82,
    source: "mosdac.gov.in/applications",
    metadata: { type: "application", category: "weather", domain: "meteorology" },
  },
  {
    id: 4,
    title: "Real-time Ocean Color Data",
    content:
      "Ocean color data from OCEANSAT series satellites for marine productivity studies, chlorophyll monitoring, and coastal zone management applications.",
    score: 0.79,
    source: "mosdac.gov.in/oceansat",
    metadata: { type: "product", category: "ocean", satellite: "OCEANSAT" },
  },
  {
    id: 5,
    title: "SCATSAT-1 Wind Vector Data",
    content:
      "High-resolution wind vector measurements from SCATSAT-1 scatterometer for weather prediction, cyclone tracking, and marine weather services.",
    score: 0.76,
    source: "mosdac.gov.in/scatsat",
    metadata: { type: "product", category: "wind", satellite: "SCATSAT-1" },
  },
]

export async function POST(req: NextRequest) {
  try {
    const { query, filters = {}, limit = 10 } = await req.json()

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    // Simulate vector search with keyword matching
    const searchTerms = query.toLowerCase().split(" ")

    let results = sampleResults.map((result) => {
      // Calculate relevance score based on keyword matches
      const titleMatches = searchTerms.filter((term) => result.title.toLowerCase().includes(term)).length

      const contentMatches = searchTerms.filter((term) => result.content.toLowerCase().includes(term)).length

      const metadataMatches = searchTerms.filter((term) =>
        JSON.stringify(result.metadata).toLowerCase().includes(term),
      ).length

      // Boost score based on matches
      const boostedScore = result.score + titleMatches * 0.1 + contentMatches * 0.05 + metadataMatches * 0.03

      return {
        ...result,
        score: Math.min(boostedScore, 1.0), // Cap at 1.0
        matches: {
          title: titleMatches,
          content: contentMatches,
          metadata: metadataMatches,
        },
      }
    })

    // Apply filters
    if (filters.type) {
      results = results.filter((r) => r.metadata.type === filters.type)
    }
    if (filters.category) {
      results = results.filter((r) => r.metadata.category === filters.category)
    }
    if (filters.satellite) {
      results = results.filter((r) => r.metadata.satellite === filters.satellite)
    }

    // Sort by relevance score and limit results
    results = results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .filter((r) => r.score > 0.5) // Only return reasonably relevant results

    return NextResponse.json({
      query,
      results,
      total: results.length,
      filters: filters,
      processing_time: Math.random() * 100 + 50, // Simulated processing time
    })
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
