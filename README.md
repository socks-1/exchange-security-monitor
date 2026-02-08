# 🛡️ Crypto Exchange Security Monitor

**Real-time security tracking and trust scoring for top cryptocurrency exchanges**

A comprehensive monitoring tool that aggregates security data from multiple sources to provide transparency into exchange security and trustworthiness.

## 🌟 Features

- **Multi-Source Data Aggregation**: Combines data from CPW Security Tracker and CoinGecko API
- **Trust Score Monitoring**: Tracks trust scores and rankings for 10+ major exchanges
- **Security Incident Tracking**: Monitors and reports security incidents over the last 7 days
- **Real-Time Dashboard**: Beautiful, responsive web interface with auto-refresh
- **Automated Updates**: GitHub Actions workflow fetches fresh data weekly
- **GitHub Pages Deployment**: Accessible via web at all times

## 🏗️ How It Works

The system fetches and aggregates security data from two primary sources:

1. **CPW Security Tracker API**: Monitors catastrophic events and security incidents affecting cryptocurrency exchanges
2. **CoinGecko API**: Provides trust scores, volume data, and exchange metadata

Data is automatically updated weekly via GitHub Actions and stored in JSON format. The web dashboard reads this data and presents it in an intuitive, visual format.

## 🚀 Setup

### Prerequisites

- GitHub account
- [RapidAPI account](https://rapidapi.com/) (free tier)
- CPW Tracker API subscription (100 free requests/month)

### Installation

1. **Use this template**: Click "Use this template" button
2. **Subscribe to API**:
   - Go to [CPW Tracker API](https://rapidapi.com/CPWatch/api/cpw-tracker)
   - Subscribe to `Basic` plan (free)
3. **Add API key**:
   - Go to Settings → Secrets and variables → Actions
   - Add repository secret: `RAPIDAPI_KEY` with your API key
4. **Enable GitHub Pages**:
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main` / `root`
5. **Enable Actions**:
   - Go to Actions tab
   - Enable workflows if prompted

### Local Development

```bash
# Install dependencies (optional - script uses Node.js built-ins)
npm install

# Fetch data manually
RAPIDAPI_KEY=your_key_here node scripts/api-call.js

# Serve locally
python3 -m http.server 8000
# Visit http://localhost:8000
```

## 📊 Data Sources

### Monitored Exchanges
- Binance
- Coinbase
- Kraken
- OKX
- Bybit
- Bitfinex
- Bitstamp
- Gemini
- KuCoin
- Huobi

### Data Structure

The system generates three JSON files:

1. **`data/security-data.json`**: Complete aggregated dataset
2. **`data/trust-scores.json`**: Exchange trust scores and metadata
3. **`data/incidents.json`**: Security incidents from the last 7 days

## 🔧 Customization

### Modify Monitored Exchanges

Edit `scripts/api-call.js`:

```javascript
const MONITORED_EXCHANGES = [
  "binance", "coinbase-exchange", "kraken"
  // Add more exchange IDs from CoinGecko
]
```

### Adjust Update Frequency

Edit `.github/workflows/deploy.yml`:

```yaml
schedule:
  - cron: '0 12 * * 0'  # Weekly on Sunday at 12:00 UTC
  # Change to: '0 */12 * * *' for twice daily
```

### Customize Data Range

Edit `scripts/api-call.js`:

```javascript
startTime.setDate(startTime.getDate() - 7) // Last 7 days
// Change to: -14 for 14 days, etc.
```

## 🎨 Web Interface Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-Time Stats**: Exchanges monitored, incidents detected, last update time
- **Trust Score Cards**: Visual trust score badges (high/medium/low)
- **Exchange Details**: Volume, rank, country, establishment year
- **Incident Timeline**: Chronological list of security events
- **Auto-Refresh**: Dashboard refreshes every 5 minutes

## 📈 Use Cases

- **Traders**: Monitor exchange security before choosing where to trade
- **Researchers**: Track security trends across the crypto ecosystem
- **Compliance Teams**: Monitor exchanges for security incidents
- **Journalists**: Source data for crypto security reporting
- **Developers**: Build on top of aggregated exchange security data

## 🔐 Security & Privacy

- No user data collected
- All data sourced from public APIs
- API keys stored as GitHub secrets
- No third-party analytics or tracking

## 📝 License

MIT License - Feel free to use, modify, and distribute

## 🙏 Acknowledgments

- Data provided by [CoinGecko](https://www.coingecko.com/) and [CPW Tracker](https://rapidapi.com/CPWatch/api/cpw-tracker)
- Built for the [DN Institute Challenge Program](https://github.com/1712n/dn-institute/issues/489)
- Inspired by [CyberWatch](https://1712n.github.io/cyberwatch/)

## 🚧 Roadmap

- [ ] Add email notifications for critical incidents
- [ ] Implement social media posting (Twitter/Telegram)
- [ ] Historical trend analysis
- [ ] Exchange security scoring algorithm
- [ ] API endpoint for programmatic access
- [ ] Mobile app version

---

**Built with ❤️ for the crypto community**

[View Live Dashboard](#) | [Report Issue](../../issues) | [Contribute](../../pulls)
