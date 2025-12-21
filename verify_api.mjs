import { fetchPoem } from './src/utils/api.js';

async function verify() {
    console.log('Testing poem fetching length constraints...');
    for (let i = 0; i < 5; i++) {
        try {
            const poem = await fetchPoem();
            const lineCount = poem.lines.length;
            console.log(`Poem ${i + 1}: "${poem.title}" by ${poem.source} - Lines: ${lineCount}`);
            if (lineCount < 4 || lineCount > 25) {
                console.error(`FAILED: Line count ${lineCount} is out of bounds (4-25)`);
            } else {
                console.log('PASSED');
            }
        } catch (err) {
            console.error('Fetch error:', err.message);
        }
    }
}

verify();
