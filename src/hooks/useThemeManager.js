import { useState, useEffect } from 'react';

export const useThemeManager = () => {
	const [isDarkMode, setIsDarkMode] = useState(() => {
		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem('darkMode');
			if (saved !== null) {
				return JSON.parse(saved);
			}
			return window.matchMedia('(prefers-color-scheme: dark)').matches;
		}
		return false;
	});

	const [themeColor, setThemeColor] = useState(() => {
		if (typeof window !== 'undefined') {
			return localStorage.getItem('themeColor') || 'blue';
		}
		return 'blue';
	});

	useEffect(() => {
		localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
		if (isDarkMode) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}, [isDarkMode]);

	useEffect(() => {
		localStorage.setItem('themeColor', themeColor);
		// Update CSS custom properties for theme color
		const root = document.documentElement;
		const colorMap = {
			blue: { primary: '59 130 246', secondary: '147 197 253' },
			indigo: { primary: '99 102 241', secondary: '165 180 252' },
			purple: { primary: '147 51 234', secondary: '196 181 253' },
			pink: { primary: '236 72 153', secondary: '251 207 232' },
			red: { primary: '239 68 68', secondary: '252 165 165' },
			orange: { primary: '249 115 22', secondary: '253 186 116' },
			yellow: { primary: '245 158 11', secondary: '254 240 138' },
			green: { primary: '34 197 94', secondary: '134 239 172' },
			teal: { primary: '20 184 166', secondary: '153 246 228' },
			cyan: { primary: '6 182 212', secondary: '165 243 252' },
		};
		
		if (colorMap[themeColor]) {
			root.style.setProperty('--theme-primary', colorMap[themeColor].primary);
			root.style.setProperty('--theme-secondary', colorMap[themeColor].secondary);
		}
	}, [themeColor]);

	return {
		isDarkMode,
		setIsDarkMode,
		themeColor,
		setThemeColor
	};
};
