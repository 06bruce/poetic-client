import React, { useState, useEffect } from 'react';

/**
 * Typewriter component that reveals text line-by-line.
 * @param {string[]} lines - Array of strings to be typed.
 * @param {number} lineDelay - Delay between starting each line in ms.
 * @param {number} charDelay - Delay between each character in ms.
 * @param {function} onComplete - Callback when typing is done.
 */
export default function Typewriter({ lines, lineDelay = 500, charDelay = 30, onComplete }) {
    const [visibleLines, setVisibleLines] = useState(lines.map(() => ''));
    const [currentLineIndex, setCurrentLineIndex] = useState(0);

    useEffect(() => {
        if (currentLineIndex >= lines.length) {
            if (onComplete) onComplete();
            return;
        }

        let currentCharIndex = 0;
        const line = lines[currentLineIndex];

        const interval = setInterval(() => {
            if (currentCharIndex < line.length) {
                setVisibleLines(prev => {
                    const next = [...prev];
                    next[currentLineIndex] = line.substring(0, currentCharIndex + 1);
                    return next;
                });
                currentCharIndex++;
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    setCurrentLineIndex(prev => prev + 1);
                }, lineDelay);
            }
        }, charDelay);

        return () => clearInterval(interval);
    }, [currentLineIndex, lines, lineDelay, charDelay, onComplete]);

    return (
        <div className="space-y-1">
            {visibleLines.map((line, idx) => (
                <p
                    key={idx}
                    className={`min-h-[1.5em] ${idx === currentLineIndex ? 'border-r-2 border-indigo-500 animate-pulse' : ''}`}
                >
                    {line}
                </p>
            ))}
        </div>
    );
}
