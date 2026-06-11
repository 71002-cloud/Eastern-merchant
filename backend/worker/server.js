require("dotenv").config();
const { createClient} = require("@supabase/supabase-js");

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

const cellTypes = {
  a:   { blok: "a", type: "n" },
  b:   { blok: "b", type: "n" },
  c:   { blok: "c", type: "n" },

  apre:  { blok: "a", type: "pre" },
  bpre:  { blok: "b", type: "pre" },
  cpre:  { blok: "c", type: "pre" },

  tpre:  { blok: "a", type: "t" },
  tbpre: { blok: "b", type: "t" },
  tcpre: { blok: "c", type: "t" },

  fc:    { blok: "a", type: "fc" },
  fcb:   { blok: "b", type: "fc" }
};


function extratData(data) {
    const id = data.match(/-={ \s*(\w+) /)?.[1];
    const owner = data.match(/Ejer:\s*(.+)/)?.[1];
    const time = data.match(/Tid: \s*(.+)/)?.[1];
    if (!id || !owner || !time) {
      return null;
    }
    return {id, owner, time};
}
//  {int} dage, {int} timer, {int} minutter
function makeTimeMinutes(timeStr) {
  const days = parseInt(timeStr.match(/(\d+) dage/)?.[1] || "0");
  const hours = parseInt(timeStr.match(/(\d+) timer/)?.[1] || "0");
  const minutes = parseInt(timeStr.match(/(\d+) minutter/)?.[1] || "0");
  return days * 24 * 60 + hours * 60 + minutes;
}

function processData(data, timestamp) {
    const extractedData = extratData(data);
    if (!extractedData) return;
    const time = makeTimeMinutes(extractedData.time);
    const cleanId = extractedData.id.replace(/\d+$/, "");
    const { blok, type } = cellTypes[cleanId] || {};
    if (blok && type) {
      const expires_at = new Date(new Date(timestamp).getTime() + time * 60000).toISOString();
      return {
        id: extractedData.id,
        owner: extractedData.owner,
        expires_at,
        blok,
        type,
        last_addon_updated: timestamp
      };
      } else {
        console.warn(`Unknown cell ID: ${extractedData.id}`);
      }
}

function makeDatabaseResponseReady(data) {
  const timeRemaining = Math.max(0, Math.round((new Date(data.expires_at) - new Date()) / 60000));
  return {
    id: data.id,
    owner: data.owner,
    time_remaining: timeRemaining,
    blok: data.blok,
    type: data.type
  };
}

app.post("/api/addon-msg", async (req, res) => {
    const cellData = req.body.cell;
    const last_addon_updated = req.body.timestamp;
    const processDataResult = processData(cellData, last_addon_updated);

  if (!processDataResult) {
    console.warn("Failed to process data, skipping database insert");
    return res.status(400).json({ error: "Invalid data format" });
  }

  const { data, error } = await supabase
    .from("ce_info")
    .upsert(processDataResult, { onConflict: "id" });

    return res.json({ success: !error, error });
});

// API endpoint
app.get("/api/front", async (req, res) => {
  const { decision } = req.query;

  let query = supabase
    .from("ce_info")
    .select("*");

  if (decision === "true") {
    const now = new Date().toISOString();
    const in24h = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    query = query.gte("expires_at", now).lte("expires_at", in24h);
  }

  const { data, error } = await query;

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const responseData = data.map(makeDatabaseResponseReady);

  return res.json(responseData);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});