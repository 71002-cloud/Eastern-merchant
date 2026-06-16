require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const { sendStringToChannel, getRoleIdMap } = require("./discord-bot");

// Shcematic === {id: {hasSend3hour: bool, hasSend1hour: bool}}

let hasSend = {

}

async function getDataFromSupabase() {
    const { data, error } =  await supabase
        .from('ce_info')
        .select('id, owner, expires_at, type, blok')
    if (error) {
        throw new Error(`Error fetching data from Supabase: ${error.message}`);
    }
    return data;
}

function makeTimeMinutes(timeStr) {
    const now = new Date();
    const expiresAt = new Date(timeStr);
    const diffMs = expiresAt - now;
    return Math.max(0, Math.floor(diffMs / 60000)); // Return minutes, never negative
}

function extratData(data) {
    const result = [];
    const cellsToTrack = new Set();

    for (const item of data) {
        const time = makeTimeMinutes(item.expires_at);

        if (time <= 180 && time > 0) {
            cellsToTrack.add(item.id);
            if (!hasSend[item.id]) {
                hasSend[item.id] = { hasSend3hour: false, hasSend1hour: false };
            }

            result.push({
                id: item.id,
                owner: item.owner,
                expires_in_minutes: time,
                type: item.type,
                blok: item.blok,
                hasSend3hour: hasSend[item.id].hasSend3hour,
                hasSend1hour: hasSend[item.id].hasSend1hour
            });
        }
    }

    // Clean up hasSend entries for cells no longer in alert window
    for (const cellId of Object.keys(hasSend)) {
        if (!cellsToTrack.has(cellId)) {
            delete hasSend[cellId];
        }
    }

    return result;
}

function buildAlertMessage(item, thresholdMinutes, thresholdName) {
    let roleName;
    
    if (item.type === "t") {
        roleName = "Tpre";
    } else if (item.type === "pre") {
        if (item.blok === "c") {
            roleName = "Unimportant";
        } else {
            roleName = `${item.blok.toUpperCase()}pre`;
        }
    } else {
        // type === "n"
        roleName = item.blok === "c" ? "Unimportant" : item.blok.toUpperCase();
    }
    
    const roleIdMap = getRoleIdMap();
    const roleId = roleIdMap[roleName];
    const mention = roleId ? `<@&${roleId}>` : `@${roleName}`;
    
    return `⚠️ ${mention} ID: ${item.id}, Owner: ${item.owner}, Expires in: ca. ${thresholdName}`;
}

function makeMessage(data) {
    const messages = [];

    for (const item of data) {
        if (item.expires_in_minutes > 60 && !item.hasSend3hour) {
            hasSend[item.id].hasSend3hour = true;
            messages.push(buildAlertMessage(item, 180, "3 hours"));
        }

        if (item.expires_in_minutes <= 60 && !item.hasSend1hour) {
            hasSend[item.id].hasSend1hour = true;
            messages.push(buildAlertMessage(item, 60, "1 hour"));
        }
    }

    return messages.join('\n');
}

async function runner() {
    let data = await getDataFromSupabase();
    data = extratData(data);
    
    if (data.length === 0) return;
    
    const message = makeMessage(data);
    if (!message || message.trim().length === 0) return;
    
    await sendBotMessage(message);
}

async function sendBotMessage(text) {
    await sendStringToChannel(text);
}

module.exports = {
    sendBotMessage,
    runner
};