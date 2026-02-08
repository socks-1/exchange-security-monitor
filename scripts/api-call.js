import { writeFile, mkdir } from "fs/promises"

// API configuration
const CPW_API_URL = "https://cpw-tracker.p.rapidapi.com/"
const CPW_API_KEY = process.env.RAPIDAPI_KEY
const COINGECKO_API_URL = "https://api.coingecko.com/api/v3"

/**
 * Top crypto exchanges to monitor
 */
const MONITORED_EXCHANGES = [
  "binance", "coinbase-exchange", "kraken", "okx", "bybit",
  "bitfinex", "bitstamp", "gemini", "kucoin", "huobi"
]

/**
 * Get date range for API calls (last 7 days)
 */
function getDateRange() {
  const now = new Date()
  const endTime = now
  const startTime = new Date(now)
  startTime.setDate(startTime.getDate() - 7) // Last 7 days
  return {
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString()
  }
}

/**
 * Fetch security incidents from CPW API
 */
async function fetchSecurityIncidents() {
  if (!CPW_API_KEY) {
    console.warn("Warning: RAPIDAPI_KEY not set, skipping CPW API")
    return []
  }

  const { startTime, endTime } = getDateRange()

  console.log("Fetching security incidents from CPW API...")

  try {
    const response = await fetch(CPW_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-host": "cpw-tracker.p.rapidapi.com",
        "x-rapidapi-key": CPW_API_KEY,
      },
      body: JSON.stringify({
        entities: "cryptocurrency exchanges",
        topic: "security incident",
        startTime,
        endTime
      }),
    })

    if (!response.ok) {
      throw new Error(`CPW API request failed: ${response.status}`)
    }

    const data = await response.json()
    const results = Array.isArray(data) ? data : []
    console.log(`Found ${results.length} security incidents`)
    return results.map(item => ({
      ...item,
      source: "cpw",
      category: "security_incident"
    }))
  } catch (error) {
    console.error("CPW API error:", error.message)
    return []
  }
}

/**
 * Fetch exchange trust scores from CoinGecko
 */
async function fetchExchangeTrustScores() {
  console.log("Fetching exchange trust scores from CoinGecko...")

  const results = []

  for (const exchangeId of MONITORED_EXCHANGES) {
    try {
      const response = await fetch(`${COINGECKO_API_URL}/exchanges/${exchangeId}`)

      if (!response.ok) {
        console.warn(`CoinGecko API failed for ${exchangeId}: ${response.status}`)
        continue
      }

      const data = await response.json()

      results.push({
        timestamp: new Date().toISOString(),
        exchange: data.name,
        exchange_id: data.id,
        trust_score: data.trust_score,
        trust_score_rank: data.trust_score_rank,
        trade_volume_24h_btc: data.trade_volume_24h_btc,
        year_established: data.year_established,
        country: data.country,
        url: data.url,
        source: "coingecko",
        category: "trust_score"
      })

      // Rate limiting - CoinGecko free tier allows 10-30 calls/minute
      await new Promise(resolve => setTimeout(resolve, 2000))
    } catch (error) {
      console.error(`Error fetching ${exchangeId}:`, error.message)
    }
  }

  console.log(`Fetched trust scores for ${results.length} exchanges`)
  return results
}

/**
 * Aggregate all data sources
 */
async function aggregateData() {
  console.log("Starting data aggregation from multiple sources...")

  const [incidents, trustScores] = await Promise.all([
    fetchSecurityIncidents(),
    fetchExchangeTrustScores()
  ])

  return {
    last_updated: new Date().toISOString(),
    summary: {
      total_incidents: incidents.length,
      exchanges_monitored: trustScores.length,
      time_range_days: 7
    },
    incidents: incidents,
    trust_scores: trustScores
  }
}

/**
 * Save aggregated data to JSON
 */
async function saveData(data) {
  await mkdir("data", { recursive: true })
  await writeFile("data/security-data.json", JSON.stringify(data, null, 2))
  console.log(`Saved data to security-data.json`)

  // Also save individual components for easier access
  await writeFile("data/incidents.json", JSON.stringify(data.incidents, null, 2))
  await writeFile("data/trust-scores.json", JSON.stringify(data.trust_scores, null, 2))
  console.log("Saved component data files")
}

/**
 * Main execution
 */
async function main() {
  try {
    const data = await aggregateData()
    await saveData(data)

    console.log("\n✅ Data update completed successfully")
    console.log(`   - Security incidents: ${data.incidents.length}`)
    console.log(`   - Trust scores: ${data.trust_scores.length}`)
    console.log(`   - Last updated: ${data.last_updated}`)
  } catch (error) {
    console.error("❌ Update failed:", error.message)
    process.exit(1)
  }
}

main()
