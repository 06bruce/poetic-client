import { useMemo } from 'react';

// Import mood assets
import romanticImg from '../assets/moods/romantic.png';
import sadImg from '../assets/moods/sad.png';
import natureImg from '../assets/moods/nature.png';
import hopeImg from '../assets/moods/hope.png';
import mysteriousImg from '../assets/moods/mysterious.png';

const MOOD_CONFIGS = {
    romantic: {
        bg: romanticImg,
        weather: 'hearts',
        colors: {
            primary: 'text-pink-200',
            accent: 'bg-pink-600',
            border: 'border-pink-500/30',
            glass: 'bg-pink-900/20'
        }
    },
    sad: {
        bg: sadImg,
        weather: 'rain',
        colors: {
            primary: 'text-blue-200',
            accent: 'bg-blue-600',
            border: 'border-blue-500/30',
            glass: 'bg-blue-900/20'
        }
    },
    nature: {
        bg: natureImg,
        weather: 'leaves',
        colors: {
            primary: 'text-green-200',
            accent: 'bg-green-600',
            border: 'border-green-500/30',
            glass: 'bg-green-900/20'
        }
    },
    hope: {
        bg: hopeImg,
        weather: 'stars',
        colors: {
            primary: 'text-amber-100',
            accent: 'bg-amber-600',
            border: 'border-amber-500/30',
            glass: 'bg-amber-900/20'
        }
    },
    mysterious: {
        bg: mysteriousImg,
        weather: 'nebula',
        colors: {
            primary: 'text-indigo-200',
            accent: 'bg-indigo-600',
            border: 'border-indigo-500/30',
            glass: 'bg-indigo-900/20'
        }
    },
    neutral: {
        bg: null,
        weather: 'snow',
        colors: {
            primary: 'text-gray-200',
            accent: 'bg-indigo-600',
            border: 'border-gray-700',
            glass: 'glass'
        }
    }
};

export function useMoodTheme(mood = 'neutral') {
    const config = useMemo(() => {
        const normalizedMood = mood.toLowerCase();
        return MOOD_CONFIGS[normalizedMood] || MOOD_CONFIGS.neutral;
    }, [mood]);

    return config;
}
