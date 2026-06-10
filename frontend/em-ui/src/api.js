const API_URL = "http://localhost:3000/api/front";

export async function getCellInfo(blok, type) {
    const params = new URLSearchParams();
    if (blok) params.append("blok", blok);
    if (type) params.append("type", type);

    const url = `${API_URL}?${params.toString()}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}