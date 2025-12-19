const TOPICS = ['love', 'patience', 'wait', 'crush', 'relationship', 'longing', 'heart'];

/**
 * Fetches a random poem quickly by combining search criteria (lively fetch).
 * @returns {Promise<Object>} - A normalized poem object
 */
export async function fetchPoem() {
    const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
    const preferredCount = Math.floor(Math.random() * 12) + 8; // Random count between 8 and 20

    try {
        // Optimized: request exactly what we need (topic + linecount)
        // This is extremely fast because it returns very little data
        const url = `https://poetrydb.org/lines,linecount/${topic};${preferredCount}`;

        const res = await fetch(url);
        if (!res.ok) return fetchRandomPoem();

        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
            // Pick a random one from the exact matches
            const selectedPoem = data[Math.floor(Math.random() * data.length)];
            return normalizePoem(selectedPoem, topic);
        }

        // Fallback 1: If no exact count match for topic, try just the topic
        // (This is what the old version did, but we only do it if the fast way fails)
        console.warn(`No poems with ${preferredCount} lines for topic ${topic}, trying broad topic search...`);
        const fallbackRes = await fetch(`https://poetrydb.org/lines/${topic}`);
        if (!fallbackRes.ok) return fetchRandomPoem();

        const fallbackData = await fallbackRes.json();
        if (Array.isArray(fallbackData) && fallbackData.length > 0) {
            const selectedPoem = fallbackData[Math.floor(Math.random() * fallbackData.length)];
            return normalizePoem(selectedPoem, topic);
        }

        // Fallback 2: Complete random
        return fetchRandomPoem();

    } catch (err) {
        console.error('API Fetch Error:', err);
        return fetchRandomPoem(); // Always try to return something
    }
}

async function fetchRandomPoem() {
    const res = await fetch('https://poetrydb.org/random');
    if (!res.ok) throw new Error('Failed to fetch random poem');
    const data = await res.json();
    return normalizePoem(data[0], 'random');
}

function normalizePoem(poemData, topic) {
    return {
        id: `api-${topic}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        title: poemData.title,
        source: poemData.author,
        lines: poemData.lines,
        mood: 'romantic',
        theme: topic
    };
}
