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
      return {
        id: extractedData.id,
        owner: extractedData.owner,
        time_remaining: time,
        blok,
        type,
        last_addon_updated: timestamp
      };
      } else {
        console.warn(`Unknown cell ID: ${extractedData.id}`);
      }
}

function extractDataBaseData(data) {
  return {
    id: data.id,
    owner: data.owner,
    time_remaining: data.time_remaining,
    blok: data.blok,
    type: data.type,
    last_addon_updated: data.last_addon_updated
  };
}

function makeDatabaseResponseReady(data) {
  const dataToFrontend = extractDataBaseData(data);

  const myTime = new Date();
  const lastUpdated = new Date(dataToFrontend.last_addon_updated);
  const expiresAt = new Date(lastUpdated.getTime() + dataToFrontend.time_remaining * 60000);
  const timeRemaining = Math.max(0, Math.round((expiresAt - myTime) / 60000));

  dataToFrontend.time_remaining = timeRemaining;
  return dataToFrontend;
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
  const { blok, type } = req.query;
  
  let query = supabase
    .from("ce_info")
    .select("*");

  if (blok) {
    query = query.eq("blok", blok);
  }
  if (type) {
    query = query.eq("type", type);
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