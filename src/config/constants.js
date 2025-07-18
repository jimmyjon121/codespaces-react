// User Roles & Permissions
export const USER_ROLES = ['Clinical Coach', 'Admin 1', 'Admin 2', 'Admin 3'];
export const OUTREACH_SCHEDULING_ROLES = ['Clinical Coach', 'Admin 1', 'Admin 2', 'Admin 3'];

// Program Status Options
export const SHORTLIST_STATUSES = [
	'Vetting', 
	'Presented to Family', 
	'Application Submitted', 
	'Confirmed', 
	'Declined', 
	'Waitlisted'
];

// Referent Information
export const REFERENT_TYPES = [
	'Educational Consultant', 
	'Therapist', 
	'Psychiatrist', 
	'Probation Officer', 
	'Family Friend', 
	'Other'
];

export const REFERENT_ROLES = [
	'Leading Aftercare', 
	'Handling Options', 
	'Both', 
	'Observing'
];

// Development Configuration
export const DEV_MODE = true; // SET TO false TO ENABLE REAL LOGIN

// Theme Colors
export const THEME_COLORS = [
	'blue', 'indigo', 'purple', 'pink', 'red', 'orange', 
	'yellow', 'green', 'teal', 'cyan'
];

// Default Application Settings
export const DEFAULT_SETTINGS = {
	theme: 'blue',
	darkMode: false,
	notifications: true,
	autoSave: true,
	mapDefaultZoom: 8,
	itemsPerPage: 10
};
