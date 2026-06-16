# Eastern Merchant

A system that monitors cell expiration times and sends alerts via Discord. Consists of a LabyMod Java addon, Express backend API, Discord bot, and React frontend.

## Project Structure

```
Addon/                 - LabyMod Java addon (Minecraft integration)
backend/
  worker/             - Express REST API server
  bot/                - Discord bot for alerts
frontend/
  em-ui/              - React + Vite UI dashboard
.github/
  workflows/          - GitHub Actions (build + release)
```

## Pipeline

The system follows this data flow:

1. **Addon** → Sends cell expiration data to the **Worker API**
2. **Worker API** → Stores data in **Supabase** and serves it to the **Frontend**
3. **Supabase** → Provides data to the **Discord Bot** and **Worker API**
4. **Discord Bot** → Polls Supabase every 5 minutes and sends alerts to Discord
5. **Frontend** → Displays current cell status from the Worker API

## Deployment

| Component   | Platform                        | Notes                                      |
|-------------|---------------------------------|--------------------------------------------|
| Worker API  | cPanel (school) — aspitcloud.dk | Node.js App, runs Express on port 3000     |
| Discord Bot | Render — Background Worker      | Free tier, runs 24/7, no HTTP needed       |
| Frontend    | Netlify                         | Static, env var `VITE_API_URL` for API URL |
| Database    | Supabase                        | Table: `ce_info`                           |
| Addon JAR   | GitHub Releases                 | Built and published via GitHub Actions     |

### Releasing a new addon version

```bash
git tag v1.0.0
git push origin main --tags
```

GitHub Actions will build the JAR and attach it to a GitHub Release automatically.

## Components

### Discord Bot (`backend/bot`)
- Polls Supabase every 5 minutes
- Sends alerts at 3-hour and 1-hour thresholds
- Pings Discord roles based on cell type and blok
- Deployed on Render as a Background Worker

### Express Worker (`backend/worker`)
- Receives cell data from the addon via `POST /api/addon-msg`
- Serves cell data to the frontend via `GET /api/front`
- Writes to Supabase `ce_info` table
- Deployed on cPanel at `https://71002.aspitcloud.dk`

### LabyMod Addon (`Addon/`)
- Captures cell expiry info from in-game chat on `mc.freakyville.dk` / `mc.freakyville.net`
- POSTs data to the Worker API
- API endpoint is compiled into the JAR — must rebuild after changing

### React UI (`frontend/em-ui`)
- Displays live cell status with time remaining
- Reads `VITE_API_URL` env var for the Worker API URL
- Deployed on Netlify

## Local Development

**Start Discord Bot:**
```bash
cd backend/bot
npm install
npm start
```

**Start Worker API:**
```bash
cd backend/worker
npm install
npm start
```

**Start Frontend:**
```bash
cd frontend/em-ui
npm install
npm run dev
```

**Run Addon (Minecraft client):**
```bash
cd Addon/addon-eastern-merchant
./gradlew client_v1.21.8
```
