import React, { useEffect, useState } from 'react'

const PARTICLES = {
    snow: '❄',
    rain: '💧',
    hearts: '❤',
    leaves: '🍃',
    stars: '✨',
    nebula: '☄'
}

export default function WeatherEffect({ mood = 'neutral' }) {
    const [elements, setElements] = useState([])

    useEffect(() => {
        const type = getParticleType(mood);
        const count = type === 'rain' ? 50 : 30;

        const arr = Array.from({ length: count }).map((_, i) => ({
            id: `${mood}-${i}`,
            left: Math.random() * 100,
            size: type === 'rain' ? (1 + Math.random() * 2) : (10 + Math.random() * 15),
            delay: Math.random() * 5,
            duration: type === 'rain' ? (0.5 + Math.random() * 0.5) : (8 + Math.random() * 10),
            opacity: 0.3 + Math.random() * 0.5,
            symbol: PARTICLES[type] || PARTICLES.snow
        }))
        setElements(arr)
    }, [mood])

    function getParticleType(mood) {
        const m = mood.toLowerCase();
        if (m === 'romantic') return 'hearts';
        if (m === 'sad') return 'rain';
        if (m === 'nature') return 'leaves';
        if (m === 'hope') return 'stars';
        if (m === 'mysterious') return 'nebula';
        return 'snow';
    }

    return (
        <div className="pointer-events-none fixed inset-0 -z-5 overflow-hidden">
            {elements.map(e => (
                <div
                    key={e.id}
                    className={`weather-particle ${mood === 'sad' ? 'rain-drop' : 'floating'}`}
                    style={{
                        left: `${e.left}vw`,
                        fontSize: `${e.size}px`,
                        animationDuration: `${e.duration}s`,
                        animationDelay: `${e.delay}s`,
                        opacity: e.opacity,
                        position: 'absolute',
                        top: '-20px'
                    }}
                >
                    {e.symbol}
                </div>
            ))}
        </div>
    )
}
