const API_URL = "http://localhost:3000/api/front";

export async function getCellInfo(decision) {
    const params = new URLSearchParams();
    params.append("decision", decision);

    const url = `${API_URL}?${params.toString()}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}