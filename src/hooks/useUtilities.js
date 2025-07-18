import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
	const [storedValue, setStoredValue] = useState(() => {
		try {
			if (typeof window !== 'undefined') {
				const item = window.localStorage.getItem(key);
				return item ? JSON.parse(item) : initialValue;
			}
			return initialValue;
		} catch (error) {
			console.warn(`Error reading localStorage key "${key}":`, error);
			return initialValue;
		}
	});

	const setValue = (value) => {
		try {
			const valueToStore = value instanceof Function ? value(storedValue) : value;
			setStoredValue(valueToStore);
			if (typeof window !== 'undefined') {
				window.localStorage.setItem(key, JSON.stringify(valueToStore));
			}
		} catch (error) {
			console.warn(`Error setting localStorage key "${key}":`, error);
		}
	};

	return [storedValue, setValue];
};

export const useDebounce = (value, delay) => {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
};

export const useAsync = (asyncFunction, immediate = true) => {
	const [status, setStatus] = useState('idle');
	const [value, setValue] = useState(null);
	const [error, setError] = useState(null);

	const execute = async (...params) => {
		setStatus('pending');
		setValue(null);
		setError(null);

		try {
			const response = await asyncFunction(...params);
			setValue(response);
			setStatus('success');
			return response;
		} catch (error) {
			setError(error);
			setStatus('error');
			throw error;
		}
	};

	useEffect(() => {
		if (immediate) {
			execute();
		}
	}, [immediate]);

	return {
		execute,
		status,
		value,
		error,
		isPending: status === 'pending',
		isSuccess: status === 'success',
		isError: status === 'error'
	};
};
