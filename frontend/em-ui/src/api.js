const API_URL = "http://localhost:3000/api/front";

export async function getCellInfo() {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data;
}