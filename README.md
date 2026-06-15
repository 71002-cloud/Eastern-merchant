# Eastern Merchant

A system that monitors cell expiration times and sends alerts via Discord. Consists of a Java addon, Express backend API, Discord bot, and React frontend.

## Project Structure

```
Addon/                 - Java addon for Minecraft/game integration
backend/
  worker/             - Express REST API server
  bot/                - Discord bot for alerts
frontend/
  em-ui/              - React + Vite UI dashboard
```

## Pipeline

The system follows this data flow:

1. **Addon** → Sends cell expiration data to the **Server** API
2. **Server** → Stores data in **Supabase** and serves it to the **Frontend**
3. **Supabase** → Provides data to the **Discord Bot** and **Server**
4. **Discord Bot** → Polls Supabase every 5 minutes and sends alerts to Discord
5. **Frontend** → Displays current cell status from the Server

## Components Status

### Discord Bot (backend/bot)
- Fully working and running
- Polls Supabase every 5 minutes
- Sends alerts at 3-hour and 1-hour thresholds
- Pings Discord roles correctly

### Express Worker (backend/worker)
- Running and serving REST API
- Receives cell data from addon
- Writes to Supabase `ce_info` table

### Java Addon (Addon/)
- Functional
- **Needs**: Update API endpoint from localhost to production server

### React UI (frontend/em-ui)
- Functional
- **Needs**: Update API endpoint from localhost to production server

## What's Needed

1. **Production Deployment**: Change API endpoints from `localhost` to production server address
   - Update in addon configuration
   - Update in frontend API calls
2. **Deployment**: Deploy all services to production environment

## Quick Start

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

**Start Addon:**
```bash
cd Addon/addon-eastern-merchant
./gradlew client_v1.21.8
```
