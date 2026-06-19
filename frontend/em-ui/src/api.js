const API_URL = "/api/front"

export async function getCellInfo() {
    const response = await fetch(API_URL);
    let data;

    try {
        data = await response.json();
    } catch {
        throw new Error("Worker API did not return JSON");
    }

    if (!response.ok) {
        const message = data?.error || `Worker API request failed (${response.status})`;
        throw new Error(message);
    }

    if (!Array.isArray(data)) {
        throw new Error("Worker API returned unexpected payload");
    }

    return data;
}