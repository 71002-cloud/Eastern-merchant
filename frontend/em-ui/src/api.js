const API_URL = import.meta.env.VITE_API_URL;

export async function getCellInfo() {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data;
}