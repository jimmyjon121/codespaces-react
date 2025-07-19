import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { initializeApp } from 'firebase/app';
import {
	getAuth,
	onAuthStateChanged,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut
} from 'firebase/auth';
import {
	getFirestore,
	doc,
	setDoc,
	getDoc,
	collection,
	writeBatch,
	query,
	where,
	getDocs,
	addDoc,
	Timestamp,
	updateDoc,
	arrayUnion,
	onSnapshot
} from 'firebase/firestore';
import { 
	LogIn, User, Briefcase, Database, Settings, LogOut, ChevronLeft, ChevronRight, 
	Sun, Moon, Loader, PlusCircle, Home, TestTube2, ArrowLeft, CheckCircle, Circle as CircleIcon, 
	MessageSquare, MessageCircle, ListTodo, FileText, Users, Trash2, X, Printer, FileText as FileTextIcon, 
	Info, MapPin, Search, SlidersHorizontal, List, Map as MapIcon, XCircle, ExternalLink, 
	Edit, Save, ShieldAlert, ShieldCheck, ImagePlus, ImageOff, ChevronDown, CalendarDays, 
	UserCheck, Map, Mail, Phone, Calendar, Flag, Building, AlertTriangle, Wand2, UserPlus, 
	Presentation, BarChart2, Palette, Archive, ArchiveRestore, FileClock, Check, Filter,
	RefreshCw, TrendingUp, BarChart3, Heart, Zap, Clock, CheckSquare, Plus
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, Circle } from 'react-leaflet';
import L from 'leaflet';
import { 
	BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
	PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import AdminSettings from './modules/admin/components/AdminSettings';
import { platformOwnerUser } from './modules/auth/config/roles';
import { demoUsers, demoOrganizations } from './modules/auth/config/demoUsers';
import RoleSwitcher from './components/ui/RoleSwitcher';

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
	iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
	iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
	shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom marker icon for healthcare programs
const programIcon = new L.Icon({
	iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
	iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
	shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

// Radius Search Component
const RadiusSearch = ({ center, radius, onRadiusChange, onCenterChange }) => {
	const map = useMap();

	useMapEvents({
		click: (e) => {
			onCenterChange([e.latlng.lat, e.latlng.lng]);
		},
	});

	React.useEffect(() => {
		if (center && radius > 0) {
			const circle = L.circle(center, {
				radius: radius * 1609.34, // Convert miles to meters
				fillColor: '#3b82f6',
				fillOpacity: 0.1,
				color: '#3b82f6',
				weight: 2,
				opacity: 0.6
			}).addTo(map);

			return () => {
				map.removeLayer(circle);
			};
		}
	}, [center, radius, map]);

	return null;
};


// --- Development Flag ---
// SET TO `false` TO ENABLE REAL LOGIN. SET TO `true` TO BYPASS LOGIN FOR DEVELOPMENT.
const DEV_MODE = true;

// Enhanced UI Components
const SkeletonLoader = () => (
	<div className="animate-pulse">
		<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
			{[...Array(6)].map((_, i) => (
				<div key={i} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border dark:border-slate-700 overflow-hidden">
					<div className="h-32 bg-slate-200 dark:bg-slate-700"></div>
					<div className="p-4 space-y-3">
						<div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
						<div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
						<div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
					</div>
				</div>
			))}
		</div>
	</div>
);

const EmptyState = ({ icon: Icon, title, description, action }) => (
	<div className="flex flex-col items-center justify-center py-16 px-4">
		<div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center mb-6 shadow-lg">
			<Icon className="w-10 h-10 text-slate-400 dark:text-slate-500" />
		</div>
		<h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">{title}</h3>
		<p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-md mb-6 leading-relaxed">{description}</p>
		{action}
	</div>
);

const RadialProgress = ({ value, max, size = 80, strokeWidth = 8, children }) => {
	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;
	const strokeDasharray = circumference;
	const strokeDashoffset = circumference - (value / max) * circumference;

	return (
		<div className="relative inline-flex items-center justify-center">
			<svg width={size} height={size} className="transform -rotate-90">
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					stroke="currentColor"
					strokeWidth={strokeWidth}
					fill="transparent"
					className="text-slate-200 dark:text-slate-700"
				/>
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					stroke="currentColor"
					strokeWidth={strokeWidth}
					fill="transparent"
					strokeDasharray={strokeDasharray}
					strokeDashoffset={strokeDashoffset}
					className="text-blue-600 dark:text-blue-400 transition-all duration-300 ease-in-out"
					strokeLinecap="round"
				/>
			</svg>
			<div className="absolute inset-0 flex items-center justify-center">
				{children}
			</div>
		</div>
	);
};

const MobileMenu = ({ isOpen, onClose, children }) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 md:hidden">
			<div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
			<div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 rounded-t-xl shadow-2xl max-h-[80vh] overflow-y-auto">
				<div className="sticky top-0 flex items-center justify-between p-4 border-b dark:border-slate-700 bg-white dark:bg-slate-800">
					<h3 className="font-semibold text-slate-900 dark:text-white">Menu</h3>
					<button 
						onClick={onClose}
						className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
					>
						<X className="w-5 h-5" />
					</button>
				</div>
				<div className="p-4">
					{children}
				</div>
			</div>
		</div>
	);
};

const DataFreshnessIndicator = ({ lastUpdated, isLoading }) => {
	const timeAgo = lastUpdated ? new Date(Date.now() - lastUpdated).toISOString().substr(11, 8) : null;
	
	return (
		<div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
			{isLoading ? (
				<>
					<RefreshCw className="w-3 h-3 animate-spin" />
					<span>Updating...</span>
				</>
			) : (
				<>
					<Clock className="w-3 h-3" />
					<span>Updated {timeAgo || '2m ago'}</span>
				</>
			)}
		</div>
	);
};

const HeatMapVisualization = ({ data, title }) => (
	<div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border dark:border-slate-700">
		<h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
			<TrendingUp className="w-5 h-5 text-blue-600" />
			{title}
		</h3>
		<div className="grid grid-cols-7 gap-1">
			{data?.map((item, i) => (
				<div
					key={i}
					className={`aspect-square rounded ${
						item.value > 80 ? 'bg-green-500' :
						item.value > 60 ? 'bg-yellow-500' :
						item.value > 40 ? 'bg-orange-500' :
						'bg-red-500'
					} opacity-${Math.floor(item.value / 25) * 25 || 25}`}
					title={`${item.label}: ${item.value}%`}
				/>
			)) || [...Array(35)].map((_, i) => (
				<div key={i} className="aspect-square rounded bg-slate-200 dark:bg-slate-700 opacity-50" />
			))}
		</div>
	</div>
);

// --- Firebase Configuration ---
const firebaseConfig = {
	apiKey: "AIzaSyCiJfR13nYUMj1J3hYH8MT0HWqMgMhMkT4",
	authDomain: "projecthive-994b9.firebaseapp.com",
	projectId: "projecthive-994b9",
	storageBucket: "projecthive-994b9.appspot.com",
	messagingSenderId: "678264701954",
	appId: "1:678264701954:web:b84ced74e09e83c717131b",
	measurementId: "G-R2K0KJBBKG"
};

// --- Initialize Firebase ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- User Roles & Theme ---
const USER_ROLES = ['Clinical Coach', 'Admin 1', 'Admin 2', 'Admin 3'];
const OUTREACH_SCHEDULING_ROLES = ['Clinical Coach', 'Admin 1', 'Admin 2', 'Admin 3'];
const SHORTLIST_STATUSES = ['Vetting', 'Presented to Family', 'Application Submitted', 'Confirmed', 'Declined', 'Waitlisted'];
const REFERENT_TYPES = ['Educational Consultant', 'Therapist', 'Psychiatrist', 'Probation Officer', 'Family Friend', 'Other'];
const REFERENT_ROLES = ['Leading Aftercare', 'Handling Options', 'Both', 'Observing'];


// --- RESTRUCTURED PROGRAM DATA with subPrograms ---
// --- CLINICAL STAFF DATA ---
const clinicalStaffData = {
	'cove': {
		primaryTherapists: [
			{ id: 'pt1', name: 'Dr. Sarah Johnson', license: 'LPC', phone: '555-COVE-01', email: 'sarah.johnson@familyfirst.com', caseload: 6, yearsExperience: 12, specialties: ['Trauma-Informed Care', 'Anxiety Disorders'] },
			{ id: 'pt2', name: 'Lisa Martinez', license: 'LMFT', phone: '555-COVE-02', email: 'lisa.martinez@familyfirst.com', caseload: 5, yearsExperience: 7, specialties: ['Depression Treatment', 'Family Therapy'] },
			{ id: 'pt3', name: 'David Kim', license: 'LPC', phone: '555-COVE-03', email: 'david.kim@familyfirst.com', caseload: 6, yearsExperience: 9, specialties: ['Substance Abuse', 'CBT'] }
		],
		clinicalCoaches: [
			{ id: 'cc1', name: 'Rachel Adams', title: 'Clinical Coach', phone: '555-COVE-11', email: 'rachel.adams@familyfirst.com', caseload: 8, yearsExperience: 6, specialties: ['Aftercare Planning'] },
			{ id: 'cc2', name: 'James Wilson', title: 'Aftercare Planner', phone: '555-COVE-12', email: 'james.wilson@familyfirst.com', caseload: 7, yearsExperience: 5, specialties: ['Transition Support'] }
		],
		coordinators: {
			programCoordinator: { id: 'pc1', name: 'Jessica Chen', title: 'Program Coordinator', phone: '555-COVE-20', email: 'jessica.chen@familyfirst.com', yearsExperience: 8 },
			assistantCoordinator: { id: 'apc1', name: 'Mike Rodriguez', title: 'Assistant Program Coordinator', phone: '555-COVE-21', email: 'mike.rodriguez@familyfirst.com', yearsExperience: 4 }
		}
	},
	'hedge': {
		primaryTherapists: [
			{ id: 'pt4', name: 'Dr. Emily Davis', license: 'LCPC', phone: '555-HEDGE-01', email: 'emily.davis@familyfirst.com', caseload: 5, yearsExperience: 15, specialties: ['PTSD Specialist', 'DBT Certified'] },
			{ id: 'pt5', name: 'Robert Chen', license: 'LPC', phone: '555-HEDGE-02', email: 'robert.chen@familyfirst.com', caseload: 6, yearsExperience: 8, specialties: ['Addiction Recovery', 'Group Facilitation'] },
			{ id: 'pt6', name: 'Maria Gonzalez', license: 'LMFT', phone: '555-HEDGE-03', email: 'maria.gonzalez@familyfirst.com', caseload: 5, yearsExperience: 11, specialties: ['Eating Disorders', 'Mindfulness-Based Therapy'] }
		],
		clinicalCoaches: [
			{ id: 'cc3', name: 'Kevin Brown', title: 'Clinical Coach', phone: '555-HEDGE-11', email: 'kevin.brown@familyfirst.com', caseload: 9, yearsExperience: 7, specialties: ['Crisis Intervention'] },
			{ id: 'cc4', name: 'Sophie Turner', title: 'Aftercare Planner', phone: '555-HEDGE-12', email: 'sophie.turner@familyfirst.com', caseload: 8, yearsExperience: 4, specialties: ['Community Resources'] }
		],
		coordinators: {
			programCoordinator: { id: 'pc2', name: 'Anna Thompson', title: 'Program Coordinator', phone: '555-HEDGE-20', email: 'anna.thompson@familyfirst.com', yearsExperience: 10 },
			assistantCoordinator: { id: 'apc2', name: 'Carlos Lopez', title: 'Assistant Program Coordinator', phone: '555-HEDGE-21', email: 'carlos.lopez@familyfirst.com', yearsExperience: 3 }
		}
	},
	'banyan': {
		primaryTherapists: [
			{ id: 'pt7', name: 'Dr. Alex Rivera', license: 'LPC', phone: '555-BANYAN-01', email: 'alex.rivera@familyfirst.com', caseload: 6, yearsExperience: 13, specialties: ['Bipolar Disorder', 'Crisis Stabilization'] },
			{ id: 'pt8', name: 'Jennifer Lee', license: 'LCSW', phone: '555-BANYAN-02', email: 'jennifer.lee@familyfirst.com', caseload: 5, yearsExperience: 9, specialties: ['Adolescent Specialist', 'EMDR Certified'] },
			{ id: 'pt9', name: 'Thomas Anderson', license: 'LPC', phone: '555-BANYAN-03', email: 'thomas.anderson@familyfirst.com', caseload: 6, yearsExperience: 10, specialties: ['Behavioral Interventions', 'Expressive Arts'] }
		],
		clinicalCoaches: [
			{ id: 'cc5', name: 'Michael Scott', title: 'Clinical Coach', phone: '555-BANYAN-11', email: 'michael.scott@familyfirst.com', caseload: 7, yearsExperience: 8, specialties: ['Peer Support'] },
			{ id: 'cc6', name: 'Amanda Clark', title: 'Aftercare Planner', phone: '555-BANYAN-12', email: 'amanda.clark@familyfirst.com', caseload: 8, yearsExperience: 6, specialties: ['Family Coordination'] }
		],
		coordinators: {
			programCoordinator: { id: 'pc3', name: 'Daniel Park', title: 'Program Coordinator', phone: '555-BANYAN-20', email: 'daniel.park@familyfirst.com', yearsExperience: 6 },
			assistantCoordinator: { id: 'apc3', name: 'Emma White', title: 'Assistant Program Coordinator', phone: '555-BANYAN-21', email: 'emma.white@familyfirst.com', yearsExperience: 2 }
		}
	},
	'nest': {
		primaryTherapists: [
			{ id: 'pt10', name: 'Dr. Patricia Williams', license: 'LPC', phone: '555-NEST-01', email: 'patricia.williams@familyfirst.com', caseload: 5, yearsExperience: 18, specialties: ['Autism Spectrum Disorders', 'Applied Behavior Analysis'] },
			{ id: 'pt11', name: 'Nathan Brooks', license: 'LMFT', phone: '555-NEST-02', email: 'nathan.brooks@familyfirst.com', caseload: 6, yearsExperience: 7, specialties: ['ADHD Treatment', 'Social Skills Training'] },
			{ id: 'pt12', name: 'Grace Taylor', license: 'LCPC', phone: '555-NEST-03', email: 'grace.taylor@familyfirst.com', caseload: 5, yearsExperience: 14, specialties: ['Learning Disabilities', 'Play Therapy Certified'] }
		],
		clinicalCoaches: [
			{ id: 'cc7', name: 'Benjamin Foster', title: 'Clinical Coach', phone: '555-NEST-11', email: 'benjamin.foster@familyfirst.com', caseload: 8, yearsExperience: 9, specialties: ['Behavioral Coaching'] },
			{ id: 'cc8', name: 'Isabella Martinez', title: 'Aftercare Planner', phone: '555-NEST-12', email: 'isabella.martinez@familyfirst.com', caseload: 7, yearsExperience: 7, specialties: ['Educational Advocacy'] }
		],
		coordinators: {
			programCoordinator: { id: 'pc4', name: 'Samantha Reed', title: 'Program Coordinator', phone: '555-NEST-20', email: 'samantha.reed@familyfirst.com', yearsExperience: 12 },
			assistantCoordinator: { id: 'apc4', name: 'Jason Moore', title: 'Assistant Program Coordinator', phone: '555-NEST-21', email: 'jason.moore@familyfirst.com', yearsExperience: 5 }
		}
	},
	'meridian': {
		primaryTherapists: [
			{ id: 'pt13', name: 'Dr. Christopher Hall', license: 'LPC', phone: '555-MERIDIAN-01', email: 'christopher.hall@familyfirst.com', caseload: 6, yearsExperience: 16, specialties: ['Dual Diagnosis', 'Motivational Interviewing'] },
			{ id: 'pt14', name: 'Melissa Garcia', license: 'LCSW', phone: '555-MERIDIAN-02', email: 'melissa.garcia@familyfirst.com', caseload: 5, yearsExperience: 10, specialties: ['Grief & Loss Counseling', 'Solution-Focused Therapy'] },
			{ id: 'pt15', name: 'Andrew Phillips', license: 'LMFT', phone: '555-MERIDIAN-03', email: 'andrew.phillips@familyfirst.com', caseload: 6, yearsExperience: 8, specialties: ['Anger Management', 'Cognitive Behavioral Therapy'] }
		],
		clinicalCoaches: [
			{ id: 'cc9', name: 'Laura Bennett', title: 'Clinical Coach', phone: '555-MERIDIAN-11', email: 'laura.bennett@familyfirst.com', caseload: 9, yearsExperience: 11, specialties: ['Relapse Prevention'] },
			{ id: 'cc10', name: 'Steven Wright', title: 'Aftercare Planner', phone: '555-MERIDIAN-12', email: 'steven.wright@familyfirst.com', caseload: 8, yearsExperience: 9, specialties: ['Discharge Planning'] }
		],
		coordinators: {
			programCoordinator: { id: 'pc5', name: 'Victoria Stone', title: 'Program Coordinator', phone: '555-MERIDIAN-20', email: 'victoria.stone@familyfirst.com', yearsExperience: 14 },
			assistantCoordinator: { id: 'apc5', name: 'Ryan Cooper', title: 'Assistant Program Coordinator', phone: '555-MERIDIAN-21', email: 'ryan.cooper@familyfirst.com', yearsExperience: 6 }
		}
	}
};

// --- CLIENT ASSIGNMENT LOGIC ---
const assignClientToClinician = (clientId, programId) => {
	const staff = clinicalStaffData[programId];
	if (!staff) return null;

	// Use a round-robin approach based on client ID to distribute evenly
	const allClinicians = [...staff.primaryTherapists, ...staff.clinicalCoaches];
	const assignedClinician = allClinicians[clientId % allClinicians.length];
	
	if (!assignedClinician) return null;

	const isTherapist = staff.primaryTherapists.includes(assignedClinician);
	
	return { 
		type: isTherapist ? 'therapist' : 'clinical_coach', 
		clinician: assignedClinician,
		canViewCase: true,
		isPrimary: true
	};
};

const providerDataSeed = [
	{
		id: 'nextstep',
		name: 'The Next Step Behavioral Health',
		location: 'Knoxville, TN',
		images: [],
		isFlagged: false,
		flaggerReason: '',
		status: 'Open',
		position: { lat: 35.9606, lng: -83.9207 },
		subPrograms: [
			{
				id: 'nextstep-iop',
				name: 'Intensive Outpatient Program (IOP)',
				type: 'Intensive Outpatient Program (IOP)',
				writeup: 'The Next Step Behavioral Health offers a variety of behavioral health services designed to help clients take control of their personal circumstances and start making positive changes in their lives. They provide comprehensive services, including individual therapy, intensive outpatient programs (IOP), and medication management.',
				ageRange: { min: 13, max: 25 },
				programLengthMonths: { min: 1, max: 6 },
				specialties: ["Anxiety", "Depression", "Trauma", "IOP", "Medication Management"],
				details: [{ title: 'Approach', content: 'Trauma-informed and person-centered' }, { title: 'Services', content: 'Individual therapy, IOP, medication management' }],
				contacts: [{ name: 'Admissions', title: 'Intake Coordinator', phone: '865-338-5384', email: 'info@thenextstepbh.com', ambassador: 'General' }],
			}
		]
	},
	{
		id: 'connections',
		name: 'Connections Relational Recovery',
		location: 'Virtual',
		images: [],
		isFlagged: false,
		flaggerReason: '',
		status: 'Open',
		position: { lat: 39.8283, lng: -98.5795 },
		subPrograms: [
			{
				id: 'connections-workshops',
				name: 'Relational Recovery Program',
				type: 'Virtual Workshops & Intensives',
				writeup: 'Connections Relational Recovery focuses on healing the relational aspects impacted by addiction, mental health issues, and trauma. The program emphasizes the importance of connection and relational recovery through various workshops and community-based practices.',
				ageRange: { min: 16, max: 65 },
				programLengthMonths: { min: 1, max: 12 },
				specialties: ["Relational Recovery", "Trauma", "Family Systems", "Addiction Recovery"],
				details: [{ title: 'Format', content: 'Virtual workshops and weekend intensives' }, { title: 'Focus', content: 'Breaking intergenerational trauma patterns' }],
				contacts: [{ name: 'Program Coordinator', title: 'Admissions', phone: 'Contact via website', email: 'info@connectionsrelationalrecovery.com', ambassador: 'General' }],
			}
		]
	},
	{
		id: 'middlepath',
		name: 'The Middle Path',
		location: 'Location varies',
		images: [],
		isFlagged: false,
		flaggerReason: '',
		status: 'Open',
		position: { lat: 39.8283, lng: -98.5795 },
		subPrograms: [
			{
				id: 'middlepath-dbt',
				name: 'DBT Program',
				type: 'Dialectical Behavior Therapy (DBT)',
				writeup: 'The Middle Path offers a unique combination of Dialectical Behavior Therapy (DBT) and comprehensive therapeutic services tailored to adolescents and adults. Their programs are designed to treat a variety of mental health conditions, including depression, anxiety, PTSD, and personality disorders.',
				ageRange: { min: 13, max: 65 },
				programLengthMonths: { min: 2, max: 12 },
				specialties: ["DBT", "Anxiety", "Depression", "PTSD", "Personality Disorders"],
				details: [{ title: 'Approach', content: 'Balanced DBT approach with skill-building' }, { title: 'Focus', content: 'Emotional regulation and coping strategies' }],
				contacts: [{ name: 'Clinical Team', title: 'Admissions', phone: 'Contact via website', email: 'info@themiddlepath.life', ambassador: 'General' }],
			}
		]
	},
	{
		id: 'galenhope',
		name: 'Galen Hope',
		location: 'Delray Beach, FL',
		images: [],
		isFlagged: false,
		flaggerReason: '',
		status: 'Open',
		position: { lat: 26.4615, lng: -80.0728 },
		subPrograms: [
			{
				id: 'galenhope-php',
				name: 'Partial Hospitalization Program (PHP)',
				type: 'Partial Hospitalization Program (PHP)',
				writeup: 'Galen Hope offers four tiers of treatment, including two partial hospitalization (PHP) with community integration options and two intensive outpatient (IOP) with community integration options for adults and teens struggling with a range of mental health disorders.',
				ageRange: { min: 13, max: 25 },
				programLengthMonths: { min: 1, max: 6 },
				specialties: ["PHP", "Neurodiversity", "ADHD", "Autism", "Mental Health", "Community Integration"],
				details: [{ title: 'Specialization', content: 'Neurodiverse-affirming treatment' }, { title: 'Approach', content: 'Customized treatment for individual needs' }],
				contacts: [{ name: 'Admissions', title: 'Intake Coordinator', phone: '866-304-1254', email: 'admissions@galenhope.com', ambassador: 'General' }],
			},
			{
				id: 'galenhope-iop',
				name: 'Intensive Outpatient Program (IOP)',
				type: 'Intensive Outpatient Program (IOP)',
				writeup: 'Intensive outpatient programs with community integration options designed for teens and adults. The intimate size enables customized treatment recognizing that not everyone fits into set diagnostic categories.',
				ageRange: { min: 13, max: 25 },
				programLengthMonths: { min: 1, max: 6 },
				specialties: ["IOP", "Neurodiversity", "ADHD", "Autism", "Mental Health", "Community Integration"],
				details: [{ title: 'Environment', content: 'Socially inclusive with sensory accommodations' }, { title: 'Approach', content: 'Strengths and interests-based' }],
				contacts: [{ name: 'Admissions', title: 'Intake Coordinator', phone: '866-304-1254', email: 'admissions@galenhope.com', ambassador: 'General' }],
			}
		]
	},
	{
		id: 'eternalstrength',
		name: 'Eternal Strength',
		location: 'Alpharetta, GA',
		images: [],
		isFlagged: false,
		flaggerReason: '',
		status: 'Open',
		position: { lat: 34.0754, lng: -84.2941 },
		subPrograms: [
			{
				id: 'eternalstrength-alt',
				name: 'Alternative Mental Health Care',
				type: 'Alternative to IOP/PHP',
				writeup: 'We are a unique alternative to IOP (Intensive Outpatient) and PHP (Partial Hospitalization) mental health care. We serve youth ages 10 to 25, and their families, struggling with a wide range of mental health challenges including anxiety, depression, self harm, suicidality, substance abuse and addiction.',
				ageRange: { min: 10, max: 25 },
				programLengthMonths: { min: 2, max: 12 },
				specialties: ["Anxiety", "Depression", "Self-Harm", "Suicidality", "Substance Abuse", "Creative Therapy"],
				details: [{ title: 'Services', content: 'Individual psychotherapy, therapeutic mentorship, family therapy' }, { title: 'Groups', content: 'Creative process groups and psycho-educational groups' }],
				contacts: [{ name: 'Admissions', title: 'Intake Coordinator', phone: '770-744-0133', email: 'info@eternalstrength.com', ambassador: 'General' }],
			}
		]
	},
	{
		id: 'purpletreatment',
		name: 'Purple Treatment',
		location: 'Lawrenceville, GA',
		images: [],
		isFlagged: false,
		flaggerReason: '',
		status: 'Open',
		position: { lat: 33.9563, lng: -83.9880 },
		subPrograms: [
			{
				id: 'purple-residential',
				name: "Men's Addiction Recovery Program",
				type: 'Residential Treatment',
				writeup: 'Purple Treatment specializes in a long-term, holistic recovery program for men facing substance use and mental health challenges. The program focuses on fostering an Active Recovery Lifestyle, encouraging personal growth and lasting sobriety through a blend of therapy, family involvement, and structured recovery activities.',
				ageRange: { min: 18, max: 35 },
				programLengthMonths: { min: 5, max: 9 },
				specialties: ["Substance Use", "Mental Health", "Men-Only", "Family Therapy", "Holistic Recovery"],
				details: [{ title: 'Duration', content: '5-9 months typically' }, { title: 'Gender', content: 'Men only' }, { title: 'Approach', content: 'Active Recovery Lifestyle model' }],
				contacts: [{ name: 'Adam', title: 'Admissions', phone: '678-203-8075', email: 'adam@purpletreatment.com', ambassador: 'Adam' }],
			}
		]
	},
	{
		id: 'coaching360',
		name: '360 Coaching Service',
		location: 'Virtual/National',
		images: [],
		isFlagged: false,
		flaggerReason: '',
		status: 'Open',
		position: { lat: 39.8283, lng: -98.5795 },
		subPrograms: [
			{
				id: 'coaching360-leadership',
				name: 'Leadership & Performance Coaching',
				type: 'Coaching Services',
				writeup: '360 Coaching Service provides personalized and comprehensive coaching solutions for individuals and organizations seeking growth and development. The coaching services focus on empowering clients to achieve their personal and professional goals, offering tailored guidance in areas such as leadership, team building, performance enhancement, and personal development.',
				ageRange: { min: 16, max: 65 },
				programLengthMonths: { min: 1, max: 24 },
				specialties: ["Leadership Coaching", "Team Building", "Performance Enhancement", "Personal Development"],
				details: [{ title: 'Format', content: 'Individual and organizational coaching' }, { title: 'Approach', content: 'Customized strategies for growth' }],
				contacts: [{ name: 'Coaching Team', title: 'Program Coordinator', phone: 'Contact via website', email: 'info@360coachingservice.com', ambassador: 'General' }],
			}
		]
	},
	{
		id: 'garrettcounseling',
		name: 'Garrett Counseling',
		location: 'Alabama',
		images: [],
		isFlagged: false,
		flaggerReason: '',
		status: 'Open',
		position: { lat: 32.7794, lng: -86.8287 },
		subPrograms: [
			{
				id: 'garrett-therapy',
				name: 'Child & Teen Therapy Services',
				type: 'Outpatient Therapy',
				writeup: 'Our Alabama counseling team uses a variety of therapeutic methods in working with children and teens including Cognitive Behavioral Therapy (CBT), Play Therapy, and Client Centered Play Therapy. Garrett Counseling is a Certified AutPlay Therapy provider, specially trained to work with neurodivergent clients and their families.',
				ageRange: { min: 3, max: 18 },
				programLengthMonths: { min: 1, max: 24 },
				specialties: ["CBT", "Play Therapy", "ADHD", "Anxiety", "Depression", "Trauma", "Autism", "Family Therapy"],
				details: [{ title: 'Specialization', content: 'Certified AutPlay Therapy for neurodivergent clients' }, { title: 'Options', content: 'Video and in-person services available' }],
				contacts: [{ name: 'Clinical Team', title: 'Intake Coordinator', phone: '256-239-5662', email: 'info@garrettcounseling.com', ambassador: 'General' }],
			}
		]
	},
	{
		id: 'ibh',
		name: 'Integrated Behavioral Health',
		location: 'Decatur, AL',
		images: [],
		isFlagged: false,
		flaggerReason: '',
		status: 'Open',
		position: { lat: 34.6059, lng: -86.9833 },
		subPrograms: [
			{
				id: 'ibh-services',
				name: 'Integrated Behavioral Health Services',
				type: 'Outpatient & Inpatient Services',
				writeup: 'At Integrated Behavioral Health (IBH), our mission is to provide high quality, patient centered behavioral health services to meet the needs of individuals and families in Alabama and Southern Tennessee. IBH offers a variety of integrated mental and behavioral health services including outpatient and inpatient services.',
				ageRange: { min: 5, max: 65 },
				programLengthMonths: { min: 1, max: 24 },
				specialties: ["Psychiatric Assessment", "Medication Management", "Individual Counseling", "Family Counseling", "Treatment Planning"],
				details: [{ title: 'Services', content: 'Outpatient and inpatient options' }, { title: 'Locations', content: 'Alabama and Southern Tennessee' }],
				contacts: [{ name: 'Admissions', title: 'Intake Coordinator', phone: '855-422-1618', email: 'info@ibhus.com', ambassador: 'General' }],
			}
		]
	},
	{
		id: 'hillside',
		name: 'Hillside Atlanta',
		location: 'Atlanta, GA',
		images: [],
		isFlagged: false,
		flaggerReason: '',
		status: 'Open',
		position: { lat: 33.7490, lng: -84.3880 },
		subPrograms: [
			{
				id: 'hillside-rtc',
				name: 'Residential Treatment Program',
				type: 'Residential Treatment Center (RTC)',
				writeup: 'Hillside is a leading mental health treatment facility that provides comprehensive care for children, teens, and their families. Designed for teens aged 13-17 who need 24/7 care. This program includes DBT, individual and family therapy, psychiatric care, experiential therapies like horticultural therapy, and educational services.',
				ageRange: { min: 13, max: 17 },
				programLengthMonths: { min: 2, max: 6 },
				specialties: ["DBT", "Self-Harm", "Suicidality", "Anxiety", "Mood Disorders", "Borderline Personality Traits"],
				details: [{ title: 'Specialization', content: 'Complex clinical cases and emotion regulation' }, { title: 'Therapies', content: 'DBT, horticultural therapy, family therapy' }],
				contacts: [{ name: 'Admissions', title: 'Intake Coordinator', phone: '678-506-7429', email: 'admissions@hside.org', ambassador: 'General' }],
			},
			{
				id: 'hillside-iop',
				name: 'Intensive Outpatient Program',
				type: 'Intensive Outpatient Program (IOP)',
				writeup: 'For teens who require less intensive care but still need significant therapeutic support to manage their symptoms. Emphasizes family therapy and parental involvement with weekly therapy sessions and Caregiver DBT groups.',
				ageRange: { min: 13, max: 17 },
				programLengthMonths: { min: 1, max: 4 },
				specialties: ["DBT", "Family Therapy", "Anxiety", "Depression", "Emotional Dysregulation"],
				details: [{ title: 'Family Focus', content: 'Weekly family therapy and caregiver DBT groups' }, { title: 'Approach', content: 'Significant therapeutic support for symptom management' }],
				contacts: [{ name: 'Admissions', title: 'Intake Coordinator', phone: '678-506-7429', email: 'admissions@hside.org', ambassador: 'General' }],
			}
		]
	},
	{
		id: 'oxbow',
		name: 'Oxbow Academy',
		location: 'Wales, UT',
		images: [],
		isFlagged: false,
		flaggerReason: '',
		status: 'Open',
		position: { lat: 39.9239, lng: -111.6373 },
		subPrograms: [
			{
				id: 'oxbow-rtc',
				name: 'Residential Treatment Program',
				type: 'Residential Treatment Center (RTC)',
				writeup: 'Oxbow Academy is a specialized residential treatment center for adolescent boys dealing with sexual behavioral issues, trauma, and mental health challenges. The program offers comprehensive therapy, including individual, group, and family counseling, along with academic support.',
				ageRange: { min: 12, max: 17 },
				programLengthMonths: { min: 6, max: 18 },
				specialties: ["Sexual Behavioral Issues", "Trauma", "Mental Health", "Boys Only", "Academic Support"],
				details: [{ title: 'Gender', content: 'Adolescent boys only' }, { title: 'Approach', content: 'Safe and structured environment for healing' }],
				contacts: [{ name: 'Admissions', title: 'Intake Coordinator', phone: '855-676-4272', email: 'admissions@oxbowacademy.org', ambassador: 'General' }],
			}
		]
	},
	{
		id: 'newport',
		name: 'Newport Academy',
		location: 'Charlotte, NC',
		images: [],
		isFlagged: false,
		flaggerReason: '',
		status: 'Open',
		position: { lat: 35.2271, lng: -80.8431 },
		subPrograms: [
			{
				id: 'newport-residential',
				name: 'Residential Treatment Program',
				type: 'Residential Treatment Center (RTC)',
				writeup: 'Newport Academy offers comprehensive, evidence-based treatment for teens aged 12-18 who are struggling with mental health challenges, substance use, and co-occurring disorders. Provides 24/7 care in a home-like setting, offering structured schedules of therapy, academic support, and experiential modalities.',
				ageRange: { min: 12, max: 18 },
				programLengthMonths: { min: 2, max: 12 },
				specialties: ["Mental Health", "Substance Use", "Trauma", "Anxiety", "Depression", "Experiential Therapy"],
				details: [{ title: 'Therapies', content: 'CBT, DBT, art, music, yoga, adventure therapy' }, { title: 'Academic', content: 'Certified teachers and tutors' }],
				contacts: [{ name: 'Admissions', title: 'Intake Coordinator', phone: '877-929-5105', email: 'admissions@newportacademy.com', ambassador: 'General' }],
			},
			{
				id: 'newport-php',
				name: 'Partial Hospitalization Program (PHP)',
				type: 'Partial Hospitalization Program (PHP)',
				writeup: 'Offers PHP (5 days/week) with clinical, psychiatric, and academic support. Provides structured care while allowing teens to live at home.',
				ageRange: { min: 12, max: 18 },
				programLengthMonths: { min: 1, max: 6 },
				specialties: ["PHP", "Family Therapy", "Academic Support", "Experiential Therapy"],
				details: [{ title: 'Schedule', content: '5 days per week' }, { title: 'Family', content: 'Weekly family therapy and parent support groups' }],
				contacts: [{ name: 'Admissions', title: 'Intake Coordinator', phone: '877-929-5105', email: 'admissions@newportacademy.com', ambassador: 'General' }],
			},
			{
				id: 'newport-iop',
				name: 'Intensive Outpatient Program (IOP)',
				type: 'Intensive Outpatient Program (IOP)',
				writeup: 'IOP (3–5 days/week) with individualized treatment including weekly individual therapy, psychiatry, family therapy, and academic support tailored to each teen\'s needs.',
				ageRange: { min: 12, max: 18 },
				programLengthMonths: { min: 1, max: 4 },
				specialties: ["IOP", "Individual Therapy", "Family Systems", "Academic Coordination"],
				details: [{ title: 'Schedule', content: '3-5 days per week' }, { title: 'Support', content: 'Academic coordination with certified teachers' }],
				contacts: [{ name: 'Admissions', title: 'Intake Coordinator', phone: '877-929-5105', email: 'admissions@newportacademy.com', ambassador: 'General' }],
			}
		]
	},
	{
		id: 'basepoint',
		name: 'BasePoint Academy',
		location: 'Arlington, TX',
		images: [],
		isFlagged: false,
		flaggerReason: '',
		status: 'Open',
		position: { lat: 32.7357, lng: -97.1081 },
		subPrograms: [
			{
				id: 'basepoint-program',
				name: 'Teen Mental Health Program',
				type: 'Partial Hospitalization Program (PHP)',
				writeup: 'BasePoint Academy provides a safe haven for teenage boys and girls grappling with mental health issues. A teen-only facility dedicated to helping teenagers work through their daily struggles with anxiety, substance abuse, behavior issues, depression, post-traumatic stress disorder, and other life challenges.',
				ageRange: { min: 11, max: 18 },
				programLengthMonths: { min: 1, max: 6 },
				specialties: ["Anxiety", "Substance Abuse", "Depression", "PTSD", "CBT", "DBT", "Family Therapy"],
				details: [{ title: 'Locations', content: 'Arlington, Forney, and McKinney TX' }, { title: 'Hours', content: '7:00 am to 7:00 pm, 7 days a week' }],
				contacts: [{ name: 'Admissions', title: 'Intake Coordinator', phone: '972-325-2633', email: 'pac@basepointacademy.com', ambassador: 'General' }],
			}
		]
	},
	{
		id: 'brooklane',
		name: 'Brook Lane Health Services',
		location: 'Hagerstown, MD',
		images: [],
		isFlagged: false,
		flaggerReason: '',
		status: 'Open',
		position: { lat: 39.6417, lng: -77.7200 },
		subPrograms: [
			{
				id: 'brooklane-inpatient',
				name: 'Inpatient Psychiatric Hospital',
				type: 'Inpatient Psychiatric Hospital',
				writeup: 'Brook Lane Health Services is Maryland\'s second-largest private psychiatric hospital and the leading nonprofit mental health provider in Western Maryland. Offers a full-spectrum, integrated continuum of care including inpatient hospitalization, residential treatment, partial hospitalization, outpatient therapy, and education-based programming.',
				ageRange: { min: 5, max: 65 },
				programLengthMonths: { min: 0.25, max: 6 },
				specialties: ["Psychiatric Stabilization", "Dual-Diagnosis", "Title I Therapeutic School", "InSTEP IOP"],
				details: [{ title: 'Continuum', content: 'All levels of care under one system' }, { title: 'Specialization', content: 'Psychiatric stabilization and dual-diagnosis care' }],
				contacts: [{ name: 'Admissions', title: 'Intake Coordinator', phone: '301-733-0330', email: 'admissions@brooklane.org', ambassador: 'General' }],
			}
		]
	},
	{
		id: 'sandstonecare',
		name: 'Sandstone Care',
		location: 'Buffalo Grove, IL',
		images: [],
		isFlagged: false,
		flaggerReason: '',
		status: 'Open',
		position: { lat: 42.1664, lng: -87.9598 },
		subPrograms: [
			{
				id: 'sandstone-day',
				name: 'Day Treatment Program',
				type: 'Day Treatment Program',
				writeup: 'We support teens struggling with substance abuse and mental health disorders who need significant structure to help support stabilization, and have either temporarily left school, are in transition between schools, or looking to finish out of school online or pursue their GED.',
				ageRange: { min: 13, max: 18 },
				programLengthMonths: { min: 1, max: 6 },
				specialties: ["Substance Abuse", "Mental Health", "Academic Support", "Family Therapy", "Structure"],
				details: [{ title: 'Academic', content: 'Support for school transitions and GED' }, { title: 'Family', content: 'Bi-weekly family therapy sessions' }],
				contacts: [{ name: 'Admissions', title: 'Intake Coordinator', phone: '847-423-6096', email: 'admissions@sandstonecare.com', ambassador: 'General' }],
			},
			{
				id: 'sandstone-residential',
				name: 'Cascade Canyon Teen Residential',
				type: 'Residential Treatment Center (RTC)',
				writeup: 'This 30-day residential program gives teens a safe and supportive environment in which they can begin to discover who they are without substances, begin confronting underlying mental health disorders and get back on track academically.',
				ageRange: { min: 13, max: 18 },
				programLengthMonths: { min: 1, max: 2 },
				specialties: ["Substance Abuse", "Mental Health", "Academic Recovery", "30-Day Program"],
				details: [{ title: 'Duration', content: '30-day program' }, { title: 'Focus', content: 'Identity discovery without substances' }],
				contacts: [{ name: 'Admissions', title: 'Intake Coordinator', phone: '847-423-6096', email: 'admissions@sandstonecare.com', ambassador: 'General' }],
			}
		]
	},
	{
		id: 'centerdiscovery',
		name: 'Center for Discovery',
		location: 'North Palm Beach, FL',
		images: [],
		isFlagged: false,
		flaggerReason: '',
		status: 'Open',
		position: { lat: 26.8156, lng: -80.0533 },
		subPrograms: [
			{
				id: 'discovery-php',
				name: 'Partial Hospitalization Program (PHP)',
				type: 'Partial Hospitalization Program (PHP)',
				writeup: 'Since 2016, Center for Discovery North Palm Beach partial hospitalization and intensive outpatient program has patients of all genders and ages who are struggling with mental health. This facility has programming for adolescent and adult patients to provide the best individualized, age-appropriate care.',
				ageRange: { min: 12, max: 65 },
				programLengthMonths: { min: 1, max: 6 },
				specialties: ["Mental Health", "Body Image", "Personal Identity", "Family Involvement", "All Genders"],
				details: [{ title: 'Experience', content: 'Over two decades of evidence-based protocols' }, { title: 'Approach', content: 'Customized, one-of-a-kind treatment paths' }],
				contacts: [{ name: 'Admissions', title: 'Intake Coordinator', phone: '888-318-8155', email: 'admissions@centerfordiscovery.com', ambassador: 'General' }],
			},
			{
				id: 'discovery-iop',
				name: 'Intensive Outpatient Program (IOP)',
				type: 'Intensive Outpatient Program (IOP)',
				writeup: 'Intensive outpatient program with all genders and ages. Staff members are grounded in body image and personal identity work with unique experience in all levels of care.',
				ageRange: { min: 12, max: 65 },
				programLengthMonths: { min: 1, max: 4 },
				specialties: ["Mental Health", "Body Image", "Personal Identity", "Family Nights", "Level of Care Transitions"],
				details: [{ title: 'Staff', content: 'Experienced in all levels of care' }, { title: 'Family', content: 'Family nights to enhance participation' }],
				contacts: [{ name: 'Admissions', title: 'Intake Coordinator', phone: '888-318-8155', email: 'admissions@centerfordiscovery.com', ambassador: 'General' }],
			}
		]
	},
	{
		id: 'alchemyhouse',
		name: 'Alchemy House Sober Living',
		location: 'Hollywood Hills, CA',
		images: [],
		isFlagged: false,
		flaggerReason: '',
		status: 'Open',
		position: { lat: 34.1341, lng: -118.3215 },
		subPrograms: [
			{
				id: 'alchemy-sober',
				name: 'Young Men Sober Living',
				type: 'Sober Living',
				writeup: 'Alchemy House Sober Living offers a structured, supportive environment for young men in early recovery. Focused on creating a balance between accountability and independence, the program helps residents develop the tools necessary for long-term sobriety and personal growth.',
				ageRange: { min: 18, max: 28 },
				programLengthMonths: { min: 3, max: 24 },
				specialties: ["Sober Living", "Men Only", "Peer Accountability", "Life Skills", "12-Step Integration"],
				details: [{ title: 'Gender', content: 'Young men only' }, { title: 'Focus', content: 'Balance between accountability and independence' }],
				contacts: [{ name: 'Dano Goldman', title: 'Program Director', phone: '310-283-0876', email: 'danogoldman81@yahoo.com', ambassador: 'Dano Goldman' }],
			}
		]
	},
	{
		id: 'sygnity',
		name: 'Sygnity Wellness',
		location: 'West Palm Beach, FL',
		images: [],
		isFlagged: false,
		flaggerReason: '',
		status: 'Open',
		position: { lat: 26.7056, lng: -80.0647 },
		subPrograms: [
			{
				id: 'sygnity-eop',
				name: 'Enhanced Outpatient Program (eOP™)',
				type: 'Enhanced Outpatient Program',
				writeup: 'The Enhanced Outpatient Program (eOP™) includes 2-hour group therapy sessions three times per week, along with individual and family therapy, offering structured support for those transitioning from higher levels of care or needing more than traditional weekly therapy.',
				ageRange: { min: 10, max: 65 },
				programLengthMonths: { min: 1, max: 6 },
				specialties: ["Virtual Therapy", "Group Therapy", "Individual Therapy", "Family Therapy", "Transitions"],
				details: [{ title: 'Format', content: 'Virtual mental health services' }, { title: 'Schedule', content: '2-hour groups, 3x per week' }],
				contacts: [{ name: 'Christopher G.', title: 'VP Admissions', phone: '561-596-9244', email: 'admissions@sygnitywellness.com', ambassador: 'Christopher G.' }],
			},
			{
				id: 'sygnity-flexop',
				name: 'Flexible Outpatient Program (FlexOP™)',
				type: 'Flexible Outpatient Program',
				writeup: 'The Flexible Outpatient Program (FlexOP™) provides adaptable scheduling, allowing clients to balance therapy with daily responsibilities. Addresses anxiety, depression, ADHD, bipolar disorders, and substance use disorders.',
				ageRange: { min: 10, max: 65 },
				programLengthMonths: { min: 1, max: 12 },
				specialties: ["Virtual Therapy", "Flexible Scheduling", "CBT", "Anxiety", "Depression", "ADHD"],
				details: [{ title: 'Flexibility', content: 'Adaptable scheduling for daily responsibilities' }, { title: 'Insurance', content: 'Accepts most insurance plans' }],
				contacts: [{ name: 'Christopher G.', title: 'VP Admissions', phone: '561-596-9244', email: 'admissions@sygnitywellness.com', ambassador: 'Christopher G.' }],
			}
		]
	},
	{
		id: 'riversbend',
		name: "River's Bend PC",
		location: 'Troy, MI',
		images: [],
		isFlagged: false,
		flaggerReason: '',
		status: 'Open',
		position: { lat: 42.6064, lng: -83.1498 },
		subPrograms: [
			{
				id: 'riversbend-iop',
				name: 'Intensive Outpatient Program (IOP)',
				type: 'Intensive Outpatient Program (IOP)',
				writeup: 'River\'s Bend PC provides innovative, evidence-based outpatient behavioral healthcare. The IOP is designed to increase knowledge of the disease/addiction model and develop appropriate skills to manage relapse prevention. Both Day and Night Programs are available.',
				ageRange: { min: 13, max: 65 },
				programLengthMonths: { min: 1, max: 6 },
				specialties: ["Substance Abuse", "Mental Health", "12-Step Program", "Relapse Prevention", "Day/Night Options"],
				details: [{ title: 'Schedule', content: 'Day and Night Programs available' }, { title: 'Sessions', content: '3-hour sessions with education and group therapy' }],
				contacts: [{ name: 'Clinical Team', title: 'Intake Coordinator', phone: '248-585-3239', email: 'info@riversbendpc.com', ambassador: 'General' }],
			}
		]
	},
	{
		id: 'meadows',
		name: 'The Meadows Outpatient',
		location: 'Scottsdale, AZ',
		images: [],
		isFlagged: false,
		flaggerReason: '',
		status: 'Open',
		position: { lat: 33.4942, lng: -111.9261 },
		subPrograms: [
			{
				id: 'meadows-adolescent',
				name: 'Adolescent Outpatient Program',
				type: 'Outpatient Program',
				writeup: 'The Adolescent Program at The Meadows Outpatient Center in Scottsdale provides life-changing outpatient treatment for teens 13-17, addressing trauma, substance use, and mental health issues. Uses peer support and a wide range of proven therapy methods including neurofeedback.',
				ageRange: { min: 13, max: 17 },
				programLengthMonths: { min: 1, max: 6 },
				specialties: ["Trauma", "Substance Use", "ADHD", "Neurofeedback", "CBT", "DBT", "Peer Support"],
				details: [{ title: 'Features', content: 'On-site psychiatrist, Brain Center, neurofeedback' }, { title: 'Amenities', content: 'Trauma-sensitive yoga, acupuncture, expressive arts' }],
				contacts: [{ name: 'Chrissy Veith', title: 'Admissions', phone: '602-290-9657', email: 'admissions@meadowsoutpatient.com', ambassador: 'Chrissy Veith' }],
			}
		]
	}
];

// --- NEW: Expanded Mock Data Generation ---
const generateMockClient = (id, status, dischargeYearsAgo = 0) => {
    const programs = ['cove', 'hedge', 'banyan', 'nest', 'meridian'];
    const selectedProgramId = programs[id % programs.length];
    
    // Assign client to appropriate clinician
    const assignment = assignClientToClinician(id, selectedProgramId);
    
    const ambassadors = ['Sarah Jones', 'John Davis', 'Carlos Ray', 'Maria Garcia'];
    const locations = ['Boston, MA', 'New York, NY', 'Miami, FL', 'Chicago, IL', 'Los Angeles, CA'];
    const referentNames = ['Dr. Emily Carter', 'Dr. Alan Grant', 'Dr. Ian Malcolm', 'Dr. Ellie Sattler'];
    const referentTypes = ['Educational Consultant', 'Therapist', 'Psychiatrist', 'Probation Officer'];

    let admissionDate;
    let estDischargeDate;

    if (status === 'Active') {
        const daysSinceAdmission = Math.floor(Math.random() * 90);
        admissionDate = new Date();
        admissionDate.setDate(admissionDate.getDate() - daysSinceAdmission);

        const extensions = Math.floor(Math.random() * 4); // 0 to 3 extensions
        const totalDays = 45 + (extensions * 15);
        estDischargeDate = new Date(admissionDate);
        estDischargeDate.setDate(estDischargeDate.getDate() + Math.min(totalDays, 90)); // Cap at 90 days
    } else { // Discharged
        admissionDate = new Date(new Date().getFullYear() - dischargeYearsAgo, Math.random() * 12, Math.random() * 28);
        estDischargeDate = new Date(admissionDate.getTime() + (45 + Math.floor(Math.random() * 3) * 15) * 24 * 60 * 60 * 1000);
    }
    
    const isCompleted = status === 'Discharged';

    const planningProgress = {
        extensionScheduled: isCompleted || Math.random() > 0.1,
        emailSent: isCompleted || Math.random() > 0.2,
        aftercareThreadLaunched: isCompleted || Math.random() > 0.3,
        initialOptionsVetted: isCompleted || Math.random() > 0.4,
        familyReviewSession: isCompleted || Math.random() > 0.5,
        connectingEmailsSent: isCompleted || Math.random() > 0.6,
        finalProgramConfirmed: isCompleted || Math.random() > 0.7,
        intakeDateSecured: isCompleted || Math.random() > 0.8,
        warmHandoffCompleted: isCompleted || Math.random() > 0.9,
        kipuUpdated: isCompleted || Math.random() > 0.95,
    };

    let shortlist = [];
    if (isCompleted) {
        const confirmedProgram = providerDataSeed[id % providerDataSeed.length];
        const confirmedSubProgram = confirmedProgram.subPrograms[id % confirmedProgram.subPrograms.length];
        shortlist = [{programId: confirmedSubProgram.id, programName: `${confirmedProgram.name} - ${confirmedSubProgram.name}`, status: 'Confirmed', notes: 'Placement confirmed and completed.'}];
    } else if (Math.random() > 0.3) { // 70% of active clients have a shortlist
        const numOptions = Math.floor(Math.random() * 3) + 1;
        for(let i=0; i<numOptions; i++) {
            const program = providerDataSeed[Math.floor(Math.random() * providerDataSeed.length)];
            const subProgram = program.subPrograms[Math.floor(Math.random() * program.subPrograms.length)];
            const statusIndex = Math.floor(Math.random() * (SHORTLIST_STATUSES.length - 2)); // Exclude 'Confirmed' and 'Declined' for active plans
            shortlist.push({
                programId: subProgram.id,
                programName: `${program.name} ${subProgram.name}`,
                status: SHORTLIST_STATUSES[statusIndex],
                notes: 'Vetting in progress...'
            });
        }
    }


    return {
        id: `demo-${id}`,
        clientId: `Client-${id}`,
        dob: `${2006 - Math.floor(Math.random() * 4)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        admissionDate: admissionDate.toISOString().split('T')[0],
        program: selectedProgramId, // Use the program ID directly
        programId: selectedProgramId,
        therapist: assignment ? assignment.clinician.name : 'Unassigned',
        therapistId: assignment ? assignment.clinician.id : null,
        therapistType: assignment ? assignment.type : null,
        therapistContact: assignment ? {
            phone: assignment.clinician.phone,
            email: assignment.clinician.email,
            license: assignment.clinician.license || assignment.clinician.title
        } : null,
        assignedCoordinator: clinicalStaffData[selectedProgramId]?.coordinators.programCoordinator || null,
        assistantCoordinator: clinicalStaffData[selectedProgramId]?.coordinators.assistantCoordinator || null,
        canViewCase: assignment ? assignment.canViewCase : false,
        isPrimaryAssignment: assignment ? assignment.isPrimary : false,
        estDischarge: estDischargeDate.toISOString().split('T')[0],
        familyLocation: locations[id % locations.length],
        familyAmbassador: ambassadors[id % ambassadors.length],
        lastUpdated: Timestamp.fromDate(new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)),
        atRisk: status === 'Active' && Math.random() < 0.15,
        status: status,
        referent: {
            name: referentNames[id % referentNames.length],
            type: referentTypes[id % referentTypes.length],
            role: 'Leading Aftercare',
            lastContactDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            nextContactDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        },
        planningProgress,
        weeklyNotes: [],
        tasks: Math.random() > 0.5 ? [{ id: 'task-1', text: 'Follow up on insurance verification.', completed: Math.random() > 0.5 }] : [],
        shortlist,
        createdAt: Timestamp.fromDate(admissionDate),
        generatedDocuments: isCompleted ? [{
            id: `doc-${id}`,
            type: 'Meeting Document',
            date: Timestamp.fromDate(new Date(estDischargeDate.getTime() - 10 * 24 * 60 * 60 * 1000)),
            programs: shortlist.map(s => s.programName)
        }] : [],
    };
};

const demoClientPlans = [
    ...Array.from({ length: 80 }, (_, i) => generateMockClient(i + 1, 'Active')), // Increased for better distribution
    ...Array.from({ length: 120 }, (_, i) => generateMockClient(i + 81, 'Discharged', Math.random() * 3)),
];


const mockTeamMeetings = [
	{ id: 'tm-1', programId: 'nextstep', programName: 'The Next Step Behavioral Health', attendees: ['mrodriguez@familyfirst.com', 'mgonzalez@familyfirst.com'], date: '2025-07-15', time: '2:00 PM', link: 'https://zoom.us/j/12345', status: 'Scheduled', notes: 'Discuss IOP program capacity and client fit.'},
	{ id: 'tm-2', programId: 'elevations', programName: 'Elevations RTC', attendees: ['admin@familyfirst.com'], date: '2025-07-18', time: '11:00 AM', link: 'https://zoom.us/j/67890', status: 'Scheduled', notes: 'Review their residential treatment approach.'},
	{ id: 'tm-3', programId: 'connections', programName: 'Connections Relational Recovery', attendees: ['jthompson@familyfirst.com'], date: '2025-07-10', time: '3:00 PM', link: 'https://zoom.us/j/54321', status: 'Completed', notes: 'Virtual program seems promising for specific cases.'},
];

// --- FAMILY FIRST TEAM DATA ---
const familyFirstTeam = [
	{
		uid: 'admin-001',
		email: 'admin@familyfirst.com',
		name: 'Sarah Mitchell',
		role: 'Admin 3',
		organizationId: 'org_family_first',
		title: 'Clinical Director',
		phone: '555-0101',
		canViewAllCases: true,
		specializations: ['Program Oversight', 'Clinical Supervision']
	},
	{
		uid: 'therapist-001',
		email: 'mrodriguez@familyfirst.com',
		name: 'Dr. Michael Rodriguez',
		role: 'Clinical Coach',
		organizationId: 'org_family_first',
		title: 'Primary Therapist',
		phone: '555-0102',
		license: 'LMFT',
		caseload: 6,
		canViewAllCases: false,
		specializations: ['Adolescent Therapy', 'Family Systems']
	},
	{
		uid: 'coach-001',
		email: 'mgonzalez@familyfirst.com',
		name: 'Maria Gonzalez',
		role: 'Clinical Coach',
		organizationId: 'org_family_first',
		title: 'Clinical Coach',
		phone: '555-0103',
		caseload: 8,
		canViewAllCases: false,
		specializations: ['Aftercare Planning', 'Care Coordination']
	},
	{
		uid: 'coach-002',
		email: 'jthompson@familyfirst.com',
		name: 'James Thompson',
		role: 'Clinical Coach',
		organizationId: 'org_family_first',
		title: 'Aftercare Planner',
		phone: '555-0104',
		caseload: 7,
		canViewAllCases: false,
		specializations: ['Transition Planning', 'Resource Coordination']
	},
	{
		uid: 'therapist-002',
		email: 'ejohnson@familyfirst.com',
		name: 'Dr. Emily Johnson',
		role: 'Clinical Coach',
		organizationId: 'org_family_first',
		title: 'Primary Therapist',
		phone: '555-0105',
		license: 'LPC',
		caseload: 5,
		canViewAllCases: false,
		specializations: ['Trauma-Informed Care', 'CBT']
	}
];

const mockUserData = {
	uid: 'admin-001',
	email: 'admin@familyfirst.com',
	name: 'Sarah Mitchell',
	organizationId: 'org_family_first',
	role: 'Admin 3',
	title: 'Clinical Director',
	canViewAllCases: true,
	team: familyFirstTeam
};

// --- UTILITY FUNCTIONS ---
// Date utilities with better error handling and memoization
const calculateAge = (dobString) => {
  try {
    if (!dobString) return null;
    
    const birthDate = new Date(dobString);
    if (isNaN(birthDate.getTime())) return null;
    
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age >= 0 ? age : null;
  } catch (error) {
    console.error('Error calculating age:', error);
    return null;
  }
};

const calculateLengthOfStay = (admissionDateString) => {
  try {
    if (!admissionDateString) return null;
    
    const admissionDate = new Date(admissionDateString);
    if (isNaN(admissionDate.getTime())) return null;
    
    const today = new Date();
    const diffTime = Math.abs(today - admissionDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  } catch (error) {
    console.error('Error calculating length of stay:', error);
    return null;
  }
};

// Format dates consistently
const formatDate = (dateString, format = 'short') => {
  try {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    const options = format === 'short' 
      ? { month: 'short', day: 'numeric', year: 'numeric' }
      : { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    
    return date.toLocaleDateString('en-US', options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

// --- HELPER COMPONENTS ---

// Enhanced Notification with animation and auto-dismiss
const Notification = React.memo(({ message, type = 'info', onDismiss, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      setIsLeaving(false);
      
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [message, duration]);

  const handleDismiss = useCallback(() => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      onDismiss?.();
    }, 300);
  }, [onDismiss]);

  if (!message || !isVisible) return null;

  const icons = {
    success: <CheckCircle className="w-5 h-5 mr-3" />,
    error: <AlertTriangle className="w-5 h-5 mr-3" />,
    info: <Info className="w-5 h-5 mr-3" />,
  };

  const baseClasses = "fixed top-5 right-5 z-[200] flex items-center p-4 rounded-lg shadow-lg text-white transition-all duration-300";
  const animationClasses = isLeaving ? "translate-x-full opacity-0" : "translate-x-0 opacity-100";
  const typeClasses = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  };

  return (
    <div 
      className={`${baseClasses} ${typeClasses[type] || 'bg-slate-800'} ${animationClasses}`}
      role="alert"
      aria-live="assertive"
    >
      {icons[type] || icons.info}
      <span className="flex-1">{message}</span>
      <button 
        onClick={handleDismiss} 
        className="ml-4 p-1 rounded-full hover:bg-black/20 transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
});

// Enhanced InputField with better accessibility and flexibility
const InputField = React.memo(({ 
  label, 
  name, 
  error, 
  helperText, 
  required = false,
  className = "",
  ...props 
}) => {
  const inputId = `input-${name}`;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  return (
    <div className={className}>
      <label 
        htmlFor={inputId} 
        className="block text-sm font-medium text-slate-700 dark:text-slate-300"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input 
        id={inputId} 
        name={name}
        aria-describedby={error ? errorId : helperText ? helperId : undefined}
        aria-invalid={error ? 'true' : 'false'}
        {...props} 
        className={`mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
          error 
            ? 'border-red-500 dark:border-red-400' 
            : 'border-slate-300 dark:border-slate-600'
        }`} 
      />
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={helperId} className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {helperText}
        </p>
      )}
    </div>
  );
});

// Simplified EditableField with better UX
const EditableField = React.memo(({ 
  label, 
  value, 
  onSave, 
  type = "text", 
  children,
  placeholder = "Click to edit",
  validator,
  formatter
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value || '');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    setCurrentValue(value || '');
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = useCallback(() => {
    if (validator) {
      const validationError = validator(currentValue);
      if (validationError) {
        setError(validationError);
        return;
      }
    }
    
    const valueToSave = formatter ? formatter(currentValue) : currentValue;
    onSave(valueToSave);
    setIsEditing(false);
    setError('');
  }, [currentValue, onSave, validator, formatter]);

  const handleCancel = useCallback(() => {
    setCurrentValue(value || '');
    setIsEditing(false);
    setError('');
  }, [value]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  }, [handleSave, handleCancel]);

  if (isEditing) {
    return (
      <div>
        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{label}</label>
        <div className="flex items-center gap-2">
          {children ? (
            React.cloneElement(children, {
              ref: inputRef,
              value: currentValue,
              onChange: (e) => setCurrentValue(e.target.value),
              onKeyDown: handleKeyDown,
              className: "flex-1 text-sm font-semibold bg-blue-50 dark:bg-slate-700 rounded-md px-2 py-1 border-2 border-blue-500"
            })
          ) : (
            <input
              ref={inputRef}
              type={type}
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 text-sm font-semibold bg-blue-50 dark:bg-slate-700 rounded-md px-2 py-1 border-2 border-blue-500"
            />
          )}
          <button
            onClick={handleSave}
            className="p-1 text-green-600 hover:bg-green-100 rounded"
            aria-label="Save"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            onClick={handleCancel}
            className="p-1 text-red-600 hover:bg-red-100 rounded"
            aria-label="Cancel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      </div>
    );
  }

  return (
    <div 
      onClick={() => setIsEditing(true)} 
      className="cursor-pointer group"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && setIsEditing(true)}
    >
      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400">{label}</label>
      <p className="text-sm font-semibold group-hover:bg-slate-100 dark:group-hover:bg-slate-700 rounded-md px-2 py-1 -mx-2 transition-colors">
        {value || <span className="text-slate-400">{placeholder}</span>}
      </p>
    </div>
  );
});

// Enhanced Confirmation Modal with Portal
const ConfirmationModal = React.memo(({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  children, 
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmButtonClass = "bg-red-600 hover:bg-red-700",
  isLoading = false
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-[200] flex justify-center items-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="modal-title" className="text-xl font-bold mb-4">{title}</h2>
        <div className="text-slate-600 dark:text-slate-300 mb-6">{children}</div>
        <div className="flex justify-end space-x-3">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 font-semibold transition-colors"
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button 
            type="button" 
            onClick={onConfirm} 
            className={`px-4 py-2 text-white rounded-md font-semibold transition-colors ${confirmButtonClass} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <Loader className="animate-spin w-4 h-4 mr-2" />
                Processing...
              </span>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
});

// Enhanced Leaflet Hook with better cleanup
const useLeaflet = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const loadLeaflet = async () => {
      try {
        if (window.L) {
          if (mounted) setIsLoaded(true);
          return;
        }

        // Check if already loading
        if (document.getElementById('leaflet-css') || document.getElementById('leaflet-js')) {
          return;
        }

        // Load CSS
        const cssLink = document.createElement('link');
        cssLink.id = 'leaflet-css';
        cssLink.rel = 'stylesheet';
        cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        cssLink.crossOrigin = 'anonymous';
        document.head.appendChild(cssLink);

        // Load JS
        const script = document.createElement('script');
        script.id = 'leaflet-js';
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.crossOrigin = 'anonymous';
        script.async = true;
        
        script.onload = () => {
          if (!mounted) return;
          
          // Configure default icons
          delete window.L.Icon.Default.prototype._getIconUrl;
          window.L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
          });
          
          setIsLoaded(true);
        };

        script.onerror = () => {
          if (mounted) setError('Failed to load Leaflet');
        };

        document.head.appendChild(script);
      } catch (err) {
        if (mounted) setError(err.message);
      }
    };

    loadLeaflet();

    return () => {
      mounted = false;
    };
  }, []);

  return { isLoaded, error };
};

// Optimized LeafletMap component
const LeafletMap = React.memo(({ 
  programs, 
  flyTo, 
  onMapMove, 
  initialCenter = [40.0, -95.0], 
  initialZoom = 4,
  height = "100%"
}) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersLayer = useRef(null);
  const { isLoaded, error } = useLeaflet();

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInstance.current) return;

    try {
      mapInstance.current = window.L.map(mapRef.current).setView(initialCenter, initialZoom);
      
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapInstance.current);
      
      markersLayer.current = window.L.layerGroup().addTo(mapInstance.current);
      
      if (onMapMove) {
        mapInstance.current.on('moveend', () => onMapMove(mapInstance.current));
      }

      // Fix size after initialization
      setTimeout(() => {
        mapInstance.current?.invalidateSize();
      }, 100);
    } catch (err) {
      console.error('Error initializing map:', err);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [isLoaded, initialCenter, initialZoom, onMapMove]);

  // Update markers
  useEffect(() => {
    if (!markersLayer.current || !isLoaded) return;

    markersLayer.current.clearLayers();
    
    programs.forEach(program => {
      if (program.position?.lat && program.position?.lng) {
        try {
          const marker = window.L.marker([program.position.lat, program.position.lng]);
          marker.bindPopup(`
            <div class="p-2">
              <div class="font-bold">${program.name}</div>
              <div class="text-sm">${program.location}</div>
            </div>
          `);
          markersLayer.current.addLayer(marker);
        } catch (err) {
          console.error('Error adding marker:', err);
        }
      }
    });
  }, [programs, isLoaded]);

  // Handle fly to location
  useEffect(() => {
    if (flyTo?.lat && flyTo?.lng && mapInstance.current) {
      mapInstance.current.flyTo([flyTo.lat, flyTo.lng], 12);
    }
  }, [flyTo]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-100 dark:bg-slate-800 rounded-lg">
        <p className="text-slate-600 dark:text-slate-400">Error loading map: {error}</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-100 dark:bg-slate-800 rounded-lg">
        <Loader className="animate-spin w-8 h-8 text-blue-500" />
      </div>
    );
  }

  return <div ref={mapRef} style={{ height, width: '100%' }} className="rounded-lg" />;
});

// Optimized ProgramCard with memoization
const ProgramCard = React.memo(({ 
  program, 
  onCardClick, 
  onToggleCompare, 
  isModalVersion = false, 
  comparisonList = [] 
}) => {
  const imageSrc = useMemo(() => 
    program.images?.length > 0 
      ? program.images[0] 
      : `https://placehold.co/600x400/e2e8f0/475569?text=${encodeURIComponent(program.name.charAt(0))}`,
    [program.images, program.name]
  );
  
  const isSelectedForCompare = useMemo(() => 
    comparisonList.some(p => p.id === program.id),
    [comparisonList, program.id]
  );

  const handleCardClick = useCallback(() => {
    onCardClick(program);
  }, [onCardClick, program]);

  const handleToggleCompare = useCallback((e) => {
    e.stopPropagation();
    onToggleCompare(program);
  }, [onToggleCompare, program]);

  return (
    <div 
      className={`relative bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border ${
        isSelectedForCompare 
          ? 'border-blue-500 ring-2 ring-blue-500' 
          : 'border-slate-200 dark:border-slate-700'
      }`}
    >
      <div onClick={handleCardClick} className="cursor-pointer">
        {program.isFlagged && (
          <div className="absolute top-0 left-0 w-full p-1 bg-red-500 text-white text-xs text-center font-bold z-10 rounded-t-lg">
            <ShieldAlert className="inline-block w-4 h-4 mr-1" /> FLAGGED
          </div>
        )}
        <div className="flex items-start space-x-4 pt-4">
          <img 
            src={imageSrc} 
            alt={program.name} 
            className="w-16 h-16 object-cover rounded-md flex-shrink-0" 
            loading="lazy" 
            onError={(e) => {
              e.target.src = `https://placehold.co/600x400/e2e8f0/475569?text=${encodeURIComponent(program.name.charAt(0))}`;
            }}
          />
          <div className="flex-grow overflow-hidden">
            <h4 className="font-bold text-slate-800 dark:text-white truncate">{program.name}</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center">
              <MapPin className="w-3 h-3 mr-1.5 flex-shrink-0" /> {program.location}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              {program.subPrograms?.length || 0} Programs Offered
            </p>
          </div>
        </div>
      </div>
      {isModalVersion && (
        <button
          onClick={handleToggleCompare}
          className={`mt-4 w-full text-sm font-semibold py-2 rounded-md transition-colors ${
            isSelectedForCompare 
              ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900/70' 
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900/70'
          }`}
        >
          {isSelectedForCompare ? 'Remove from Compare' : 'Add to Compare'}
        </button>
      )}
    </div>
  );
});

// Split ProgramDetailModal into smaller components
const ProgramSubNavigation = React.memo(({ subPrograms, activeSubProgram, onSelectSubProgram }) => (
  <nav className="w-1/3 md:w-1/4 border-r dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4 overflow-y-auto">
    <h3 className="text-sm font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-3">
      Programs Offered
    </h3>
    <ul className="space-y-1" role="list">
      {subPrograms.map(sub => (
        <li key={sub.id}>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSelectSubProgram(sub);
            }}
            className={`block p-3 rounded-md text-sm transition-colors ${
              activeSubProgram?.id === sub.id 
                ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold' 
                : 'hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
            aria-current={activeSubProgram?.id === sub.id ? 'page' : undefined}
          >
            {sub.name}
          </a>
        </li>
      ))}
    </ul>
  </nav>
));

const ProgramDetailContent = React.memo(({ subProgram, onAddToShortlist }) => {
  const mainContact = subProgram.contacts?.[0] || null;

  return (
    <div className="w-2/3 md:w-3/4 p-6 overflow-y-auto space-y-6">
      <div>
        <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">
          {subProgram.name}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {subProgram.writeup}
        </p>
      </div>

      <div>
        <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Specialties</h4>
        <div className="flex flex-wrap gap-2">
          {(subProgram.specialties || []).map(spec => (
            <span 
              key={spec} 
              className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium px-2.5 py-1 rounded-full"
            >
              {spec}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div>
          <h4 className="font-semibold text-slate-800 dark:text-white">Age Range</h4>
          <p className="text-slate-600 dark:text-slate-300">
            {subProgram.ageRange.min} - {subProgram.ageRange.max} years
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-slate-800 dark:text-white">Program Length</h4>
          <p className="text-slate-600 dark:text-slate-300">
            {subProgram.programLengthMonths.min} - {subProgram.programLengthMonths.max} months
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-slate-800 dark:text-white">Level of Care</h4>
          <p className="text-slate-600 dark:text-slate-300">{subProgram.type}</p>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-slate-700/50 p-4 rounded-lg">
        <h4 className="font-semibold text-slate-800 dark:text-white mb-3">Contact</h4>
        {mainContact ? (
          <div className="space-y-2 text-sm">
            <p className="font-semibold">
              {mainContact.name} - <span className="font-normal text-slate-600 dark:text-slate-300">{mainContact.title}</span>
            </p>
            <p className="flex items-center">
              <Phone className="w-4 h-4 mr-2 flex-shrink-0" /> 
              <a href={`tel:${mainContact.phone}`} className="hover:underline">
                {mainContact.phone}
              </a>
            </p>
            <p className="flex items-center">
              <Mail className="w-4 h-4 mr-2 flex-shrink-0" /> 
              <a href={`mailto:${mainContact.email}`} className="hover:underline">
                {mainContact.email}
              </a>
            </p>
          </div>
        ) : (
          <p className="text-sm text-slate-500">No contact information available for this program.</p>
        )}
      </div>

      <div className="pt-4 border-t dark:border-slate-700 flex justify-end">
        <button
          onClick={() => onAddToShortlist(subProgram)}
          className="flex items-center px-4 py-2 font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Add to Client Shortlist
        </button>
      </div>
    </div>
  );
});

const ProgramDetailModal = React.memo(({ program: facility, onClose, onAddToShortlist }) => {
  const [activeSubProgram, setActiveSubProgram] = useState(facility.subPrograms?.[0] || null);

  useEffect(() => {
    setActiveSubProgram(facility.subPrograms?.[0] || null);
  }, [facility]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!activeSubProgram) return null;

  return ReactDOM.createPortal(
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="program-modal-title"
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col animate-scale-in">
        <div className="flex justify-between items-center p-4 border-b dark:border-slate-700 flex-shrink-0">
          <h2 id="program-modal-title" className="text-2xl font-bold text-slate-800 dark:text-white">
            {facility.name}
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-grow flex min-h-0">
          <ProgramSubNavigation
            subPrograms={facility.subPrograms || []}
            activeSubProgram={activeSubProgram}
            onSelectSubProgram={setActiveSubProgram}
          />
          <ProgramDetailContent
            subProgram={activeSubProgram}
            onAddToShortlist={onAddToShortlist}
          />
        </div>
      </div>
    </div>,
    document.body
  );
});

// --- Authentication Component ---
const Auth = ({ onLogin }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isSignUp, setIsSignUp] = useState(false);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const handleAuthAction = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError('');
		try {
			if (isSignUp) {
				const userCredential = await createUserWithEmailAndPassword(auth, email, password);
				const user = userCredential.user;
				const userRef = doc(db, "users", user.uid);
				await setDoc(userRef, {
					uid: user.uid,
					email: user.email,
					organizationId: "org_family_first",
					role: "Clinical Coach",
					createdAt: new Date(),
				});
				onLogin(user);
			} else {
				await signInWithEmailAndPassword(auth, email, password);
			}
		} catch (err) {
			setError(err.message.replace('Firebase: ', ''));
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900">
			<div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg dark:bg-slate-800">
				<div className="text-center">
					<svg className="mx-auto h-12 w-auto text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 7L12 12L22 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 17L17 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 17L7 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
					<h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
						ClearHiveHQ
					</h2>
					<p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
						{isSignUp ? 'Create a new account' : 'Sign in to your account'}
					</p>
				</div>
				<form className="space-y-6" onSubmit={handleAuthAction}>
					<div>
						<label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
						<input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 placeholder-slate-400 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
					</div>
					<div>
						<label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
						<input id="password" name="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 placeholder-slate-400 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
					</div>
					{error && <p className="text-sm text-red-600">{error}</p>}
					<div>
						<button type="submit" disabled={loading} className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400">
							{loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
						</button>
					</div>
				</form>
				<p className="text-sm text-center text-slate-600 dark:text-slate-400">
					{isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
					<button onClick={() => setIsSignUp(!isSignUp)} className="font-medium text-blue-600 hover:text-blue-500">{isSignUp ? 'Sign In' : 'Sign Up'}</button>
				</p>
			</div>
		</div>
	);
};

// --- Custom Hooks ---
const useThemeManager = (initialDarkMode = false, initialThemeColor = '#4f46e5') => {
  const [isDarkMode, setIsDarkMode] = useState(initialDarkMode);
  const [themeColor, setThemeColor] = useState(initialThemeColor);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    document.documentElement.style.setProperty('--theme-color', themeColor);
  }, [themeColor]);

  return { isDarkMode, setIsDarkMode, themeColor, setThemeColor };
};

const useNotification = (timeout = 5000) => {
  const [notification, setNotification] = useState({ 
    message: '', 
    type: '', 
    visible: false 
  });

  useEffect(() => {
    if (notification.visible) {
      const timer = setTimeout(() => {
        setNotification({ message: '', type: '', visible: false });
      }, timeout);
      return () => clearTimeout(timer);
    }
  }, [notification.visible, timeout]);

  const showNotification = useCallback((message, type = 'info') => {
    setNotification({ message, type, visible: true });
  }, []);

  const dismissNotification = useCallback(() => {
    setNotification({ message: '', type: '', visible: false });
  }, []);

  return { notification, showNotification, dismissNotification };
};

// --- Components ---
const NavLink = ({ view, icon: Icon, text, isActive, onClick, isCollapsed }) => (
  <a
    href="#"
    onClick={(e) => {
      e.preventDefault();
      onClick(view);
    }}
    className={`flex items-center p-2 space-x-3 text-base font-medium rounded-lg transition-all duration-200 hover:scale-105 ${
      isActive 
        ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white' 
        : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
    }`}
    role="menuitem"
    aria-current={isActive ? 'page' : undefined}
  >
    <Icon className="w-6 h-6" />
    {!isCollapsed && <span>{text}</span>}
  </a>
);

const Sidebar = ({ 
  isCollapsed, 
  onToggleCollapse, 
  activeView, 
  onNavigate, 
  logoUrl, 
  themeColor,
  isHighestAdmin 
}) => {
  const mainNavItems = [
    { view: 'dashboard', icon: Briefcase, text: 'Dashboard' },
    { view: 'analytics', icon: BarChart2, text: 'Analytics' },
    { view: 'outreach', icon: Users, text: 'Program Outreach' },
    { view: 'database', icon: Database, text: 'Program Directory' },
    ...(isHighestAdmin ? [{ view: 'admin', icon: ShieldCheck, text: 'Admin Panel' }] : []),
  ];

  const bottomNavItems = [
    { view: 'settings', icon: Settings, text: 'Settings' }
  ];

  return (
    <aside 
      id="sidebar" 
      className={`bg-white dark:bg-slate-800 shadow-md transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-between h-16 p-4 border-b dark:border-slate-700">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <img src={logoUrl} alt="Company Logo" className="h-8 w-auto"/>
            <span className="text-xl font-bold" style={{color: themeColor}}>ClearHiveHQ</span>
          </div>
        )}
        <button 
          onClick={onToggleCollapse} 
          className="p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!isCollapsed}
        >
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>
      <nav className="flex flex-col justify-between h-[calc(100vh-4rem)] p-4" role="menu">
        <div className="space-y-2">
          {mainNavItems.map(item => (
            <NavLink
              key={item.view}
              {...item}
              isActive={activeView === item.view}
              onClick={onNavigate}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
        <div>
          {bottomNavItems.map(item => (
            <NavLink
              key={item.view}
              {...item}
              isActive={activeView === item.view}
              onClick={onNavigate}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
      </nav>
    </aside>
  );
};

const Header = ({ 
  activeClientPlan, 
  onClearActiveClient, 
  isDemoMode, 
  onToggleDemoMode,
  isDarkMode,
  onToggleDarkMode,
  userData,
  onLogout,
  showNotification
}) => {
  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
      showNotification('Error signing out. Please try again.', 'error');
    }
  }, [showNotification]);

  return (
    <header 
      id="header" 
      className="flex items-center justify-between h-16 px-6 bg-white dark:bg-slate-800 border-b dark:border-slate-700 flex-shrink-0"
    >
      <div className="flex items-center space-x-4">
        {activeClientPlan ? (
          <div className="flex items-center p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
            <span className="text-sm font-semibold text-blue-800 dark:text-blue-200">
              Active Client: {activeClientPlan.clientId}
            </span>
            <button 
              onClick={onClearActiveClient} 
              className="ml-2 p-1 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800"
              aria-label="Clear active client"
            >
              <X className="w-4 h-4 text-blue-600 dark:text-blue-300"/>
            </button>
          </div>
        ) : (
          <div className="flex items-center p-2 rounded-lg bg-slate-100 dark:bg-slate-700">
            <span className="text-sm font-medium text-slate-500">No active client selected</span>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <TestTube2 className="w-5 h-5 text-purple-500" />
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Demo Mode</span>
          <label htmlFor="demo-toggle" className="inline-flex relative items-center cursor-pointer">
            <input 
              type="checkbox" 
              id="demo-toggle" 
              className="sr-only peer" 
              checked={isDemoMode} 
              onChange={onToggleDemoMode}
              aria-label="Toggle demo mode"
            />
            <div className="w-11 h-6 bg-slate-300 dark:bg-slate-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-slate-200 after:border-slate-400 dark:after:border-slate-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 dark:peer-checked:bg-purple-500"></div>
          </label>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button 
          onClick={onToggleDarkMode} 
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? <Sun /> : <Moon />}
        </button>
        <button 
          onClick={() => window.open(window.location.href, '_blank')} 
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700" 
          title="Open in new tab"
          aria-label="Open in new tab"
        >
          <ExternalLink className="w-5 h-5" />
        </button>
        <div className="flex items-center">
          <User className="w-8 h-8 p-1 mr-2 bg-slate-200 dark:bg-slate-700 rounded-full" />
          <div>
            <p className="text-sm font-medium">{userData?.email}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
              {userData?.role} at {userData?.organizationId.replace('org_','').replace(/_/g,' ')}
            </p>
          </div>
        </div>
        <button 
          onClick={handleLogout} 
          className="flex items-center p-2 space-x-2 text-sm font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

// --- Main Application UI ---
const MainApp = ({ user, userData }) => {
  // State Management
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [activeClientPlan, setActiveClientPlan] = useState(null);
  const [logoUrl, setLogoUrl] = useState('https://i.imgur.com/6X5w42G.png');
  const [isMeetingMode, setIsMeetingMode] = useState(false);

  // Custom Hooks
  const { isDarkMode, setIsDarkMode, themeColor, setThemeColor } = useThemeManager();
  const { notification, showNotification, dismissNotification } = useNotification();

  // Derived State
  const isHighestAdmin = userData?.role === 'Admin 3' || userData?.role === 'Platform Administrator' || userData?.role === 'Platform Owner';

  // Callbacks
  const handleViewChange = useCallback((view) => {
    setActiveView(view);
  }, []);

  const handleClearActiveClient = useCallback(() => {
    setActiveClientPlan(null);
  }, []);

  const handleToggleDemoMode = useCallback(() => {
    setIsDemoMode(prev => !prev);
  }, []);

  const handleToggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarCollapsed(prev => !prev);
  }, []);

  // Render Views
  const renderActiveView = () => {
    const viewProps = {
      userData,
      isDemoMode,
      showNotification,
      activeClientPlan,
      setActiveClientPlan,
    };

    switch (activeView) {
      case 'dashboard':
        return (
          <DashboardView 
            {...viewProps}
            isMeetingMode={isMeetingMode} 
            setIsMeetingMode={setIsMeetingMode} 
          />
        );
      case 'analytics':
        return <AnalyticsView clientPlans={demoClientPlans} />;
      case 'outreach':
        return <ProgramOutreachView {...viewProps} />;
      case 'database':
        return <ProgramDatabaseView {...viewProps} />;
      case 'admin':
        return isHighestAdmin && (
          <AdminView 
            {...viewProps}
            onUpdateLogo={setLogoUrl} 
            currentLogo={logoUrl} 
            onUpdateTheme={setThemeColor} 
            currentTheme={themeColor} 
          />
        );
      case 'settings':
        return <SettingsView userData={userData} showNotification={showNotification} />;
      default:
        return null;
    }
  };

  return (
    <div className={`flex h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 ${isMeetingMode ? 'meeting-mode' : ''}`}>
      <style>
        {`
          :root {
            --theme-color: ${themeColor};
          }
          .meeting-mode #sidebar, .meeting-mode #header {
            display: none;
          }
        `}
      </style>
      
      <Notification
        message={notification.message}
        type={notification.type}
        onDismiss={dismissNotification}
      />
      
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
        activeView={activeView}
        onNavigate={handleViewChange}
        logoUrl={logoUrl}
        themeColor={themeColor}
        isHighestAdmin={isHighestAdmin}
      />

      <div className="flex flex-col flex-1">
        <Header
          activeClientPlan={activeClientPlan}
          onClearActiveClient={handleClearActiveClient}
          isDemoMode={isDemoMode}
          onToggleDemoMode={handleToggleDemoMode}
          isDarkMode={isDarkMode}
          onToggleDarkMode={handleToggleDarkMode}
          userData={userData}
          showNotification={showNotification}
        />

        <main key={activeView} className="flex-1 p-8 overflow-y-auto animate-fade-in">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};

// Add PropTypes for type safety (optional)
MainApp.propTypes = {
  user: PropTypes.object.isRequired,
  userData: PropTypes.shape({
    email: PropTypes.string,
    role: PropTypes.string,
    organizationId: PropTypes.string,
  }).isRequired,
};

// --- View Components ---

// --- NEW: Enhanced AnalyticsView with Charts ---
const AnalyticsView = ({ clientPlans }) => {
	const analyticsData = useMemo(() => {
		// Use enhanced analytics data for more comprehensive demo
		const totalPlacements = ANALYTICS_PROGRAMS.reduce((acc, prog) => acc + prog.placements, 0);
		const avgTimeToPlace = (ANALYTICS_PROGRAMS.reduce((acc, prog) => acc + prog.avgDays, 0) / ANALYTICS_PROGRAMS.length).toFixed(1);
		const successRate = 87.3; // Simulated success rate
		
		// Top placements from our 20 programs
		const topPlacementsChartData = ANALYTICS_PROGRAMS
			.sort((a, b) => b.placements - a.placements)
			.slice(0, 8)
			.map(prog => ({ name: prog.name, count: prog.placements }));

		// Simulate referent types distribution
		const referentTypes = {
			'Educational Consultant': 142,
			'Therapist': 89,
			'Psychiatrist': 67,
			'Probation Officer': 34,
			'School Counselor': 28,
			'Other': 15
		};

		const referentTypesChartData = Object.entries(referentTypes)
			.map(([name, value]) => ({ name, value }))
			.sort((a,b) => b.value - a.value);

		// Simulate placement trends over months
		const placementsByMonth = {
			'Jan 25': 45, 'Feb 25': 52, 'Mar 25': 48, 'Apr 25': 61, 
			'May 25': 58, 'Jun 25': 67, 'Jul 25': 34 // Current month partial
		};

		const placementsByMonthChartData = Object.entries(placementsByMonth)
		  .map(([name, Placements]) => ({ name, Placements }));

		return {
			kpis: { 
				avgTimeToPlace, 
				successRate, 
				totalActive: clientPlans.filter(p => p.status === 'Active').length, 
				totalConfirmed: totalPlacements 
			},
			charts: { 
				topPlacements: topPlacementsChartData, 
				referentTypes: referentTypesChartData, 
				placementsByMonth: placementsByMonthChartData 
			}
		};
	}, [clientPlans]);

	const KpiCard = ({ title, value, icon }) => (
		<div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md flex items-center space-x-4">
			<div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
				{icon}
			</div>
			<div>
				<p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
				<p className="text-3xl font-bold">{value}</p>
			</div>
		</div>
	);
	
	const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

	return (
		<div className="space-y-8">
			<h1 className="text-3xl font-bold">Aftercare Analytics</h1>
			
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<KpiCard title="Avg. Time to Placement" value={`${analyticsData.kpis.avgTimeToPlace} days`} icon={<CalendarDays className="w-8 h-8 text-blue-500" />} />
				<KpiCard title="Placement Success Rate" value={`${analyticsData.kpis.successRate}%`} icon={<CheckCircle className="w-8 h-8 text-blue-500" />} />
				<KpiCard title="Active Client Plans" value={analyticsData.kpis.totalActive} icon={<Users className="w-8 h-8 text-blue-500" />} />
				<KpiCard title="Total Confirmed Placements" value={analyticsData.kpis.totalConfirmed} icon={<Building className="w-8 h-8 text-blue-500" />} />
			</div>

			<div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
				<h2 className="text-xl font-semibold mb-4">Placements Over Time</h2>
				<ResponsiveContainer width="100%" height={300}>
					<LineChart data={analyticsData.charts.placementsByMonth}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="name" />
						<YAxis allowDecimals={false} />
						<Tooltip />
						<Legend />
						<Line type="monotone" dataKey="Placements" stroke="#8884d8" activeDot={{ r: 8 }} />
					</LineChart>
				</ResponsiveContainer>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
					<h2 className="text-xl font-semibold mb-4">Top Aftercare Placements</h2>
					<ResponsiveContainer width="100%" height={300}>
						<BarChart data={analyticsData.charts.topPlacements} layout="vertical" margin={{ left: 100 }}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis type="number" allowDecimals={false} />
							<YAxis dataKey="name" type="category" width={150} />
							<Tooltip />
							<Bar dataKey="count" fill="#8884d8" name="Placements" />
						</BarChart>
					</ResponsiveContainer>
				</div>
				<div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
					<h2 className="text-xl font-semibold mb-4">Referent Type Distribution</h2>
					<ResponsiveContainer width="100%" height={300}>
						<PieChart>
							<Pie data={analyticsData.charts.referentTypes} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
								{analyticsData.charts.referentTypes.map((entry, index) => (
									<Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
								))}
							</Pie>
							<Tooltip />
							<Legend />
						</PieChart>
					</ResponsiveContainer>
				</div>
			</div>
		</div>
	);
};

const ScheduleOutreachModal = ({ onClose, onMeetingScheduled, allPrograms, allUsers, userData, showNotification, isDemoMode }) => {
	const [formData, setFormData] = useState({
		programId: '',
		attendees: [],
		date: '',
		time: '',
		link: '',
		notes: '',
		status: 'Scheduled',
	});
	const [loading, setLoading] = useState(false);

	const handleAttendeeToggle = (email) => {
		setFormData(prev => {
			const newAttendees = prev.attendees.includes(email)
				? prev.attendees.filter(a => a !== email)
				: [...prev.attendees, email];
			return { ...prev, attendees: newAttendees };
		});
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.programId || !formData.date || !formData.time) {
			showNotification("Please fill out all required fields.", "error");
			return;
		}
		setLoading(true);

		const selectedProgram = allPrograms.find(p => p.id === formData.programId);
		const newMeeting = {
			...formData,
			programName: selectedProgram.name,
		};

		if (isDemoMode) {
			mockTeamMeetings.push({ id: `tm-${Date.now()}`, ...newMeeting });
			showNotification("Outreach meeting scheduled (Demo Mode).", "success");
		} else {
			try {
				const meetingsRef = collection(db, `organizations/${userData.organizationId}/teamMeetings`);
				await addDoc(meetingsRef, newMeeting);
				showNotification("Outreach meeting scheduled successfully.", "success");
			} catch (err) {
				console.error("Error scheduling meeting:", err);
				showNotification("Failed to schedule meeting.", "error");
			}
		}

		setLoading(false);
		onMeetingScheduled();
		onClose();
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 animate-fade-in">
			<div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-full overflow-y-auto animate-scale-in">
				<h2 className="text-2xl font-bold mb-4">Schedule Program Outreach</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-slate-700 dark:text-slate-300">External Program</label>
						<select name="programId" value={formData.programId} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm">
							<option value="">Select a program...</option>
							{allPrograms.filter(p => p.status === 'Open').sort((a,b) => a.name.localeCompare(b.name)).map(p => (
								<option key={p.id} value={p.id}>{p.name}</option>
							))}
						</select>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<InputField label="Date" name="date" type="date" value={formData.date} onChange={handleChange} required />
						<InputField label="Time" name="time" type="time" value={formData.time} onChange={handleChange} required />
					</div>

					<InputField label="Meeting Link (e.g., Zoom)" name="link" value={formData.link} onChange={handleChange} />

					<div>
						<label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Internal Attendees</label>
						<div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 border rounded-md dark:border-slate-600">
							{allUsers.map(user => (
								<label key={user.id} className="flex items-center space-x-2 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700">
									<input type="checkbox" checked={formData.attendees.includes(user.email)} onChange={() => handleAttendeeToggle(user.email)} className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500" />
									<span className="text-sm">{user.email}</span>
								</label>
							))}
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Notes</label>
						<textarea name="notes" value={formData.notes} onChange={handleChange} rows="3" className="mt-1 block w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600"></textarea>
					</div>

					<div className="flex justify-end space-x-3 pt-4">
						<button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500">Cancel</button>
						<button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400">
							{loading ? 'Scheduling...' : 'Schedule Meeting'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

const ProgramOutreachView = ({ userData, isDemoMode, showNotification }) => {
	const [meetings, setMeetings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [allUsers, setAllUsers] = useState([]);

	const canSchedule = userData && OUTREACH_SCHEDULING_ROLES.includes(userData.role);

	const fetchMeetingsAndUsers = useCallback(async () => {
		setLoading(true);
		// Fetch Meetings
		let allMeetings = [];
		if (isDemoMode) {
			allMeetings = mockTeamMeetings;
		} else {
			if (!userData?.organizationId) {
				setLoading(false);
				return;
			}
			try {
				const meetingsRef = collection(db, `organizations/${userData.organizationId}/teamMeetings`);
				const querySnapshot = await getDocs(query(meetingsRef));
				allMeetings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
			} catch (err) {
				console.error("Error fetching team meetings:", err);
				showNotification("Error fetching team meetings.", "error");
			}
		}
		allMeetings.sort((a, b) => new Date(b.date) - new Date(a.date));
		setMeetings(allMeetings);

		// Fetch Users for the modal
		if (canSchedule) {
			let usersData = [];
			if (isDemoMode) {
				usersData = USER_ROLES.map((role, i) => ({ id: `dev-user-${i}`, email: `${role.replace(' ','').toLowerCase()}@clearhive.dev`, role: role }));
			} else {
				try {
					const usersRef = collection(db, "users");
					const userQuery = query(usersRef, where("organizationId", "==", userData.organizationId));
					const userSnapshot = await getDocs(userQuery);
					usersData = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
				} catch (error) {
					console.error("Error fetching users:", error);
				}
			}
			setAllUsers(usersData);
		}

		setLoading(false);
	}, [userData, isDemoMode, showNotification, canSchedule]);

	useEffect(() => {
		fetchMeetingsAndUsers();
	}, [fetchMeetingsAndUsers]);

	const getStatusColor = (status) => {
		switch (status) {
			case 'Scheduled': return 'bg-blue-100 text-blue-800';
			case 'Completed': return 'bg-green-100 text-green-800';
			case 'Canceled': return 'bg-yellow-100 text-yellow-800';
			case 'No-Show': return 'bg-red-100 text-red-800';
			default: return 'bg-slate-100 text-slate-800';
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold">Program Outreach</h1>
				{canSchedule && (
					<button onClick={() => setIsModalOpen(true)} className="flex items-center px-4 py-2 font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 transition-transform duration-200 hover:scale-105">
						<PlusCircle className="w-5 h-5 mr-2" />
						Schedule Outreach
					</button>
				)}
			</div>

			{isModalOpen && <ScheduleOutreachModal allPrograms={providerDataSeed} allUsers={allUsers} onClose={() => setIsModalOpen(false)} onMeetingScheduled={fetchMeetingsAndUsers} userData={userData} showNotification={showNotification} isDemoMode={isDemoMode} />}

			<div className="bg-white dark:bg-slate-800 shadow-md rounded-lg overflow-hidden">
				<div className="p-6">
					<h2 className="text-xl font-semibold flex items-center">
						<CalendarDays className="w-6 h-6 mr-3 text-blue-500" />
						Team-to-Team Meetings
					</h2>
				</div>
				{loading ? (
					<div className="flex justify-center items-center h-48"><Loader className="w-8 h-8 animate-spin" /></div>
				) : meetings.length === 0 ? (
					<div className="text-center py-16 text-slate-500">
						<h3 className="text-xl font-semibold">No Outreach Meetings Scheduled</h3>
						<p className="mt-2">Click "Schedule Outreach" to add one.</p>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
							<thead className="bg-slate-50 dark:bg-slate-700">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">External Program</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Attendees</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Date & Time</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Status</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Actions</th>
								</tr>
							</thead>
							<tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
								{meetings.map((meeting, index) => (
									<tr key={meeting.id} className="animate-fadeInUp hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors" style={{ animationDelay: `${index * 50}ms` }}>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">{meeting.programName}</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{(meeting.attendees || []).join(', ')}</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{meeting.date} at {meeting.time}</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm">
											<span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(meeting.status)}`}>
												{meeting.status}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
											<a href={meeting.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-900">Join</a>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
};


const DashboardView = ({ userData, isDemoMode, activeClientPlan, setActiveClientPlan, showNotification, isMeetingMode, setIsMeetingMode }) => {
	const [clientPlans, setClientPlans] = useState([]);
	const [loading, setLoading] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [viewState, setViewState] = useState({ type: 'main' });
    const [searchTerm, setSearchTerm] = useState('');

	const fetchClientPlans = useCallback(async () => {
		if (isDemoMode) {
			setClientPlans(demoClientPlans);
			setLoading(false);
			return;
		}

		if (!userData?.organizationId) return;
		setLoading(true);
		try {
			const plansRef = collection(db, `organizations/${userData.organizationId}/clients`);
			const q = query(plansRef);
			const querySnapshot = await getDocs(q);
			const plansData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

			plansData.sort((a, b) => {
				const dateA = a.createdAt?.toMillis() || 0;
				const dateB = b.createdAt?.toMillis() || 0;
				return dateB - dateA;
			});

			setClientPlans(plansData);
		} catch (err) {
			console.error("Error fetching client plans:", err);
			showNotification("Error fetching client plans.", "error");
		} finally {
			setLoading(false);
		}
	}, [userData, isDemoMode, showNotification]);

	useEffect(() => {
		fetchClientPlans();
	}, [fetchClientPlans]);
	
	useEffect(() => {
		if(viewState.type === 'client_plan' && viewState.clientPlanId) {
			const plan = clientPlans.find(p => p.id === viewState.clientPlanId);
			setActiveClientPlan(plan || null);
		}
	}, [viewState, clientPlans, setActiveClientPlan]);


	const groupedData = useMemo(() => {
        const plansToDisplay = clientPlans.filter(plan => {
            if (!searchTerm) return true;
            const lowerCaseSearch = searchTerm.toLowerCase();
            return plan.clientId.toLowerCase().includes(lowerCaseSearch) || plan.therapist.toLowerCase().includes(lowerCaseSearch);
        });

		const grouped = plansToDisplay.reduce((acc, plan) => {
			const programName = plan.program || 'Unassigned';
			if (!acc[programName]) {
				acc[programName] = { clients: [], urgentPlacements: 0, stalledPlans: 0, confirmedPlacements: 0, atRiskCount: 0 };
			}
			acc[programName].clients.push(plan);
			
			if(plan.atRisk) {
				acc[programName].atRiskCount++;
			}

			const hasConfirmedPlacement = plan.shortlist?.some(s => s.status === 'Confirmed');

			if (hasConfirmedPlacement) {
				acc[programName].confirmedPlacements++;
			} else {
				if (plan.estDischarge) {
					const dischargeDate = new Date(plan.estDischarge);
					const today = new Date();
					const diffTime = dischargeDate - today;
					const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
					if (diffDays <= 14 && diffDays >= 0) {
						acc[programName].urgentPlacements++;
					}
				}
			}

			const lastUpdated = plan.lastUpdated?.toDate();
			if(lastUpdated) {
				const today = new Date();
				const diffTime = today - lastUpdated;
				const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
				if (diffDays > 7) {
					acc[programName].stalledPlans++;
				}
			}


			return acc;
		}, {});
		return grouped;
	}, [clientPlans, searchTerm]);

	console.log('DashboardView viewState:', viewState);

	if (viewState.type === 'my_cases') {
		console.log('Rendering MyCasesView');
		return <MyCasesView onBack={() => setViewState({ type: 'main' })} userData={userData} isDemoMode={isDemoMode} showNotification={showNotification} isMeetingMode={isMeetingMode} setIsMeetingMode={setIsMeetingMode} onClientSelect={(clientPlanId, programName) => setViewState({ type: 'client_plan', clientPlanId, programName })} />;
	}

	if (viewState.type === 'client_plan') {
		console.log('Rendering ClientPlanView with:', {
			clientPlanId: viewState.clientPlanId,
			programName: viewState.programName,
			userData,
			isDemoMode
		});
		return <ClientPlanView clientPlanId={viewState.clientPlanId} onBack={() => { setViewState({ type: 'program_clients', programName: viewState.programName }); setActiveClientPlan(null); }} userData={userData} isDemoMode={isDemoMode} showNotification={showNotification} isMeetingMode={isMeetingMode} setIsMeetingMode={setIsMeetingMode} />
	}

	if (viewState.type === 'program_clients') {
		console.log('Rendering ClientListView');
		return <ClientListView programName={viewState.programName} clients={groupedData[viewState.programName]?.clients || []} onBack={() => { setViewState({ type: 'main' }); setActiveClientPlan(null); }} onClientSelect={(clientPlanId, programName) => { setViewState({ type: 'client_plan', clientPlanId, programName }); }} setActiveClientPlan={setActiveClientPlan} />
	}

	return (
		<div className="space-y-8">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold">Internal Programs Dashboard</h1>
				<div className="flex items-center gap-4">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search clients..."
                            className="w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button 
                        onClick={() => setViewState({ type: 'my_cases' })} 
                        className="flex items-center px-4 py-2 font-semibold text-blue-600 border border-blue-600 rounded-md shadow-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-transform duration-200 hover:scale-105"
                    >
                        <User className="w-5 h-5 mr-2" />
                        My Cases
                    </button>
				    <button onClick={() => setIsModalOpen(true)} className="flex items-center px-4 py-2 font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 transition-transform duration-200 hover:scale-105">
					    <PlusCircle className="w-5 h-5 mr-2" />
					    Add New Client Plan
				    </button>
                </div>
			</div>

			{isModalOpen && <AddNewClientModal onClose={() => setIsModalOpen(false)} onPlanAdded={fetchClientPlans} userData={userData} showNotification={showNotification} isDemoMode={isDemoMode}/>}

			{loading ? (
				<div className="flex justify-center items-center h-64"><Loader className="w-8 h-8 animate-spin" /></div>
			) : Object.keys(groupedData).length === 0 ? (
				<div className="text-center py-16 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-lg shadow-md">
					<h3 className="text-xl font-semibold">No client plans found for your search.</h3>
					<p className="mt-2">Try a different search term or add a new client.</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{Object.keys(groupedData).sort().map((programName, index) => {
						const programData = groupedData[programName];
						const programColors = { 
							"cove": "text-orange-500", 
							"hedge": "text-purple-500", 
							"banyan": "text-green-500", 
							"nest": "text-blue-500", 
							"meridian": "text-red-500", 
							"Unassigned": "text-slate-500" 
						};
						return (
							<div key={programName} className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${programData.atRiskCount > 0 ? 'border-yellow-400' : 'border-slate-100 dark:border-slate-700'}`} style={{ animationDelay: `${index * 100}ms` }}>
								<div className="p-6">
									<div className="flex justify-between items-start">
										<div className="flex items-center space-x-4">
											<Home className={`w-10 h-10 ${programColors[programName] || 'text-slate-500'}`} />
											<h2 className="text-2xl font-bold">{PROGRAM_DISPLAY_NAMES[programName] || programName}</h2>
										</div>
										{programData.atRiskCount > 0 && (
											<div className="flex items-center gap-1 text-yellow-500 font-bold">
												<AlertTriangle className="w-5 h-5" />
												<span>{programData.atRiskCount}</span>
											</div>
										)}
									</div>
									<div className="mt-6 space-y-4">
										<div className="flex justify-between items-baseline"><span className="text-slate-500 dark:text-slate-400">Total Clients</span><span className="text-2xl font-bold">{programData.clients.length}</span></div>
										<div className="flex justify-between items-baseline">
											<span className="text-slate-500 dark:text-slate-400 flex items-center"><AlertTriangle className={`w-4 h-4 mr-1 ${programData.stalledPlans > 0 ? 'text-yellow-500' : 'text-slate-400'}`} />Stalled Plans (&gt;7d)</span>
											<span className={`text-2xl font-bold ${programData.stalledPlans > 0 ? 'text-yellow-500' : ''}`}>{programData.stalledPlans}</span>
										</div>
										<div className="flex justify-between items-baseline"><span className="text-slate-500 dark:text-slate-400">Confirmed Placements</span><span className="text-2xl font-bold text-green-500">{programData.confirmedPlacements}</span></div>
									</div>
								</div>
								<button onClick={() => setViewState({ type: 'program_clients', programName })} className="mt-2 w-full px-4 py-3 font-semibold text-white bg-blue-600 rounded-b-lg hover:bg-blue-700">
									View Program Details
								</button>
							</div>
						)
					})}
				</div>
			)}
		</div>
	);
};

// Program display names
const PROGRAM_DISPLAY_NAMES = {
	'cove': 'The Cove',
	'hedge': 'The Hedge', 
	'banyan': 'Banyan Heights',
	'nest': 'The NEST',
	'meridian': 'Meridian Point'
};

// Enhanced analytics data for 20 programs
const ANALYTICS_PROGRAMS = [
	{ name: 'The Cove', placements: 45, avgDays: 28 },
	{ name: 'The Hedge', placements: 38, avgDays: 32 },
	{ name: 'Banyan Heights', placements: 42, avgDays: 25 },
	{ name: 'The NEST', placements: 51, avgDays: 22 },
	{ name: 'Meridian Point', placements: 39, avgDays: 30 },
	{ name: 'Newport Academy', placements: 35, avgDays: 35 },
	{ name: 'Hillside Atlanta', placements: 29, avgDays: 40 },
	{ name: 'Elevations RTC', placements: 24, avgDays: 45 },
	{ name: 'Sandstone Care', placements: 33, avgDays: 28 },
	{ name: 'BasePoint Academy', placements: 27, avgDays: 33 },
	{ name: 'Oxbow Academy', placements: 18, avgDays: 52 },
	{ name: 'Purple Treatment', placements: 22, avgDays: 38 },
	{ name: 'Galen Hope', placements: 31, avgDays: 26 },
	{ name: 'Brook Lane Health', placements: 26, avgDays: 42 },
	{ name: 'Center for Discovery', placements: 28, avgDays: 35 },
	{ name: 'The Meadows', placements: 21, avgDays: 48 },
	{ name: 'Sygnity Wellness', placements: 34, avgDays: 24 },
	{ name: 'Rivers Bend PC', placements: 19, avgDays: 50 },
	{ name: 'IBH Services', placements: 25, avgDays: 36 },
	{ name: 'Eternal Strength', placements: 30, avgDays: 29 }
];

const ClientListView = ({ programName, clients, onBack, onClientSelect, setActiveClientPlan }) => {
	const [expandedTherapist, setExpandedTherapist] = useState(null);
	
	const getStatus = (plan) => {
		if (plan.status === 'Discharged') return { text: 'Discharged', color: 'bg-gray-100 text-gray-800' };
        if (plan.atRisk) return { text: 'At Risk', color: 'bg-red-100 text-red-800' };
		
		const progressValues = Object.values(plan.planningProgress || {});
		if (progressValues.every(v => v === true)) {
			return { text: 'Completed', color: 'bg-green-100 text-green-800' };
		}
		
		const confirmed = plan.shortlist?.some(s => s.status === 'Confirmed');
		if (confirmed) {
			return { text: 'Placement Confirmed', color: 'bg-blue-100 text-blue-800' };
		}

		return { text: 'In Progress', color: 'bg-yellow-100 text-yellow-800' };
	};

	// Get staff data for this program
	const programStaff = clinicalStaffData[programName?.toLowerCase()] || null;
	
	// Group clients by therapist
	const clientsByTherapist = useMemo(() => {
		const grouped = {};
		clients.forEach(client => {
			const therapistName = client.therapist || 'Unassigned';
			if (!grouped[therapistName]) {
				grouped[therapistName] = [];
			}
			grouped[therapistName].push(client);
		});
		return grouped;
	}, [clients]);

	// Get therapist details from staff data
	const getTherapistDetails = (therapistName) => {
		if (!programStaff) return null;
		return programStaff.primaryTherapists.find(t => t.name === therapistName) || 
			   programStaff.clinicalCoaches.find(c => c.name === therapistName);
	};

	// Get clinical coach for a client (round-robin assignment)
	const getClinicalCoach = (clientId) => {
		if (!programStaff?.clinicalCoaches?.length) return 'Unassigned';
		const coaches = programStaff.clinicalCoaches;
		const clientIndex = parseInt(clientId.replace(/\D/g, ''), 10) || 0;
		return coaches[clientIndex % coaches.length].name;
	};

	return (
		<div>
			<button onClick={onBack} className="flex items-center mb-6 text-sm font-semibold text-blue-600 hover:text-blue-800">
				<ArrowLeft className="w-4 h-4 mr-2" />
				Back to Dashboard
			</button>
			
			<div className="mb-6">
				<h1 className="text-3xl font-bold mb-2">{PROGRAM_DISPLAY_NAMES[programName?.toLowerCase()] || programName} Program</h1>
				<p className="text-slate-600 dark:text-slate-400">Total Clients: {clients.length}</p>
			</div>

			{/* Program Leadership */}
			{programStaff && (
				<div className="mb-6 bg-white dark:bg-slate-800 rounded-lg shadow-md p-4">
					<h2 className="text-lg font-semibold mb-3 flex items-center">
						<Users className="w-4 h-4 mr-2 text-blue-600" />
						Program Coordinators
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						<div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
							<div>
								<h3 className="font-medium text-blue-900 dark:text-blue-100">{programStaff.coordinators.programCoordinator.name}</h3>
								<p className="text-blue-600 dark:text-blue-400 text-xs">{programStaff.coordinators.programCoordinator.email}</p>
							</div>
						</div>
						<div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
							<div>
								<h3 className="font-medium">{programStaff.coordinators.assistantCoordinator.name}</h3>
								<p className="text-slate-500 dark:text-slate-400 text-xs">{programStaff.coordinators.assistantCoordinator.email}</p>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Clinical Staff and Their Cases */}
			<div className="space-y-6">
				{Object.entries(clientsByTherapist).map(([therapistName, therapistClients]) => {
					const therapistDetails = getTherapistDetails(therapistName);
					const isExpanded = expandedTherapist === therapistName;
					
					return (
						<div key={therapistName} className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
							{/* Therapist Header */}
							<div 
								className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 cursor-pointer hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 transition-colors"
								onClick={() => setExpandedTherapist(isExpanded ? null : therapistName)}
							>
								<div className="flex justify-between items-center">
									<div className="flex items-center space-x-3">
										<div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
											{therapistName.split(' ').map(n => n[0]).join('')}
										</div>
										<div>
											<h3 className="text-lg font-semibold text-slate-900 dark:text-white">{therapistName}</h3>
											{therapistDetails && (
												<div className="flex items-center gap-3 mt-1 text-sm">
													<span className="text-blue-600 dark:text-blue-400 font-medium">{therapistDetails.license || therapistDetails.title}</span>
													<span className="text-slate-600 dark:text-slate-400">
														<Phone className="w-3 h-3 inline mr-1" />
														{therapistDetails.phone}
													</span>
													<span className="text-slate-600 dark:text-slate-400">
														<Mail className="w-3 h-3 inline mr-1" />
														{therapistDetails.email}
													</span>
												</div>
											)}
										</div>
									</div>
									<div className="flex items-center space-x-3">
										<div className="text-right">
											<div className="text-xl font-bold text-blue-600">{therapistClients.length}</div>
											<div className="text-xs text-slate-500 dark:text-slate-400">
												{therapistDetails?.maxCaseload ? `of ${therapistDetails.maxCaseload}` : 'cases'}
											</div>
										</div>
										<ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
									</div>
								</div>
							</div>

							{/* Cases Table (Collapsible) */}
							{isExpanded && (
								<div>
									<div className="overflow-x-auto">
									<table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
										<thead className="bg-slate-50 dark:bg-slate-700">
											<tr>
												<th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Client ID</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Clinical Coach</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Admission Date</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Est. Discharge</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Status</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Progress</th>
												<th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
											</tr>
										</thead>
										<tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
											{therapistClients.map(plan => {
												const status = getStatus(plan);
												const progressPercent = plan.planningProgress ? 
													Math.round((Object.values(plan.planningProgress).filter(Boolean).length / Object.keys(plan.planningProgress).length) * 100) : 0;
												
												return (
													<tr key={plan.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
														<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
															{plan.clientId}
															{plan.atRisk && <AlertTriangle className="w-4 h-4 inline ml-2 text-red-500" />}
														</td>
														<td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
															{getClinicalCoach(plan.clientId)}
														</td>
														<td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
															{plan.admissionDate}
														</td>
														<td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
															{plan.estDischarge}
														</td>
														<td className="px-6 py-4 whitespace-nowrap text-sm">
															<span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.color}`}>
																{status.text}
															</span>
														</td>
														<td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
															<div className="flex items-center space-x-2">
																<div className="w-16 bg-slate-200 dark:bg-slate-600 rounded-full h-2">
																	<div 
																		className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
																		style={{ width: `${progressPercent}%` }}
																	></div>
																</div>
																<span className="text-xs">{progressPercent}%</span>
															</div>
														</td>
														<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
															<button 
																onClick={() => {
																	console.log('View Chart clicked:', { planId: plan.id, programName, plan });
																	onClientSelect(plan.id, programName);
																}} 
																className="text-blue-600 hover:text-blue-900 flex items-center"
															>
																<ExternalLink className="w-4 h-4 mr-1" />
																View Chart
															</button>
														</td>
													</tr>
												);
											})}
										</tbody>
									</table>
									</div>
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
};

const MyCasesView = ({ onBack, userData, isDemoMode, showNotification, isMeetingMode, setIsMeetingMode, onClientSelect }) => {
	const [clientPlans, setClientPlans] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');

	const fetchMyCases = useCallback(async () => {
		if (isDemoMode) {
			// Filter demo client plans to show only cases assigned to current user
			const myCases = demoClientPlans.filter(plan => {
				// Check if current user is assigned as therapist, coach, or has view access
				const userEmail = userData?.email || '';
				const userName = userData?.name || '';
				
				// Check direct assignment
				if (plan.therapist === userName || plan.coach === userName) {
					return true;
				}
				
				// Check if user has view access through clinical staff assignments
				if (plan.assignedStaff && Array.isArray(plan.assignedStaff)) {
					return plan.assignedStaff.some(staff => 
						staff.email === userEmail || staff.name === userName
					);
				}
				
				// Admin can see all cases
				if (userData?.canViewAllCases) {
					return true;
				}
				
				return false;
			});
			setClientPlans(myCases);
			setLoading(false);
			return;
		}

		if (!userData?.organizationId) return;
		setLoading(true);
		try {
			const plansRef = collection(db, `organizations/${userData.organizationId}/clients`);
			const q = query(plansRef);
			const querySnapshot = await getDocs(q);
			let plansData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

			// Filter to only show cases assigned to current user
			plansData = plansData.filter(plan => {
				const userEmail = userData?.email || '';
				const userName = userData?.name || '';
				
				if (plan.therapist === userName || plan.coach === userName) {
					return true;
				}
				
				if (plan.assignedStaff && Array.isArray(plan.assignedStaff)) {
					return plan.assignedStaff.some(staff => 
						staff.email === userEmail || staff.name === userName
					);
				}
				
				if (userData?.canViewAllCases) {
					return true;
				}
				
				return false;
			});

			plansData.sort((a, b) => {
				const dateA = a.createdAt?.toMillis() || 0;
				const dateB = b.createdAt?.toMillis() || 0;
				return dateB - dateA;
			});

			setClientPlans(plansData);
		} catch (err) {
			console.error("Error fetching my cases:", err);
			showNotification("Error fetching my cases.", "error");
		} finally {
			setLoading(false);
		}
	}, [userData, isDemoMode, showNotification]);

	useEffect(() => {
		fetchMyCases();
	}, [fetchMyCases]);

	const getStatus = (plan) => {
		if (plan.status === 'Discharged') return { text: 'Discharged', color: 'bg-gray-100 text-gray-800' };
        if (plan.atRisk) return { text: 'At Risk', color: 'bg-red-100 text-red-800' };
		
		const progressValues = Object.values(plan.planningProgress || {});
		if (progressValues.every(v => v === true)) {
			return { text: 'Completed', color: 'bg-green-100 text-green-800' };
		}
		
		const confirmed = plan.shortlist?.some(s => s.status === 'Confirmed');
		if (confirmed) {
			return { text: 'Placement Confirmed', color: 'bg-blue-100 text-blue-800' };
		}

		return { text: 'In Progress', color: 'bg-yellow-100 text-yellow-800' };
	};

	const filteredCases = clientPlans.filter(plan => {
		if (!searchTerm) return true;
		const lowerCaseSearch = searchTerm.toLowerCase();
		return plan.clientId.toLowerCase().includes(lowerCaseSearch) || 
			   plan.therapist.toLowerCase().includes(lowerCaseSearch) ||
			   plan.program.toLowerCase().includes(lowerCaseSearch);
	});

	return (
		<div>
			<button onClick={onBack} className="flex items-center mb-6 text-sm font-semibold text-blue-600 hover:text-blue-800">
				<ArrowLeft className="w-4 h-4 mr-2" />
				Back to Dashboard
			</button>
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">My Cases</h1>
				<div className="relative w-full md:w-64">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
					<input
						type="text"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						placeholder="Search my cases..."
						className="w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
			</div>

			{loading ? (
				<div className="flex justify-center items-center h-64">
					<Loader className="w-8 h-8 animate-spin" />
				</div>
			) : filteredCases.length === 0 ? (
				<div className="text-center py-16 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-lg shadow-md">
					<h3 className="text-xl font-semibold">No cases assigned to you.</h3>
					<p className="mt-2">Cases will appear here when they are assigned to you as a therapist or coach.</p>
				</div>
			) : (
				<div className="bg-white dark:bg-slate-800 shadow-md rounded-lg overflow-x-auto">
					<table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
						<thead className="bg-slate-50 dark:bg-slate-700">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Client</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Program</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">My Role</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Est. Discharge</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Status</th>
								<th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
							</tr>
						</thead>
						<tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
							{filteredCases.map(plan => {
								const status = getStatus(plan);
								const userName = userData?.name || '';
								const userEmail = userData?.email || '';
								let myRole = 'Viewer';
								
								if (plan.therapist === userName) {
									myRole = 'Primary Therapist';
								} else if (plan.coach === userName) {
									myRole = 'Clinical Coach';
								} else if (plan.assignedStaff && Array.isArray(plan.assignedStaff)) {
									const staffRole = plan.assignedStaff.find(staff => 
										staff.email === userEmail || staff.name === userName
									);
									if (staffRole) {
										myRole = staffRole.role || 'Staff';
									}
								}
								
								return (
									<tr key={plan.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">{plan.clientId}</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{plan.program}</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{myRole}</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{plan.estDischarge}</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm">
											<span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.color}`}>
												{status.text}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
											<button 
												onClick={() => onClientSelect(plan.id, plan.program)} 
												className="text-blue-600 hover:text-blue-900"
											>
												View Chart
											</button>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}

const ClientPlanView = ({ clientPlanId, onBack, userData, isDemoMode, showNotification, isMeetingMode, setIsMeetingMode }) => {
	const [clientPlan, setClientPlan] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
	const [isMeetingDocOpen, setIsMeetingDocOpen] = useState(false);
	const [allPrograms, setAllPrograms] = useState([]);

	useEffect(() => {
		if (!clientPlanId) return;

		let unsubscribe;
		if (isDemoMode) {
			const plan = demoClientPlans.find(p => p.id === clientPlanId);
			setClientPlan(plan);
			setLoading(false);
		} else {
			const planRef = doc(db, `organizations/${userData.organizationId}/clients`, clientPlanId);
			unsubscribe = onSnapshot(planRef, (doc) => {
				if (doc.exists()) {
					setClientPlan({ id: doc.id, ...doc.data() });
				} else {
					showNotification("Could not find client plan.", "error");
				}
				setLoading(false);
			}, (error) => {
				console.error("Error listening to client plan:", error);
				showNotification("Error loading client data.", "error");
				setLoading(false);
			});
		}

		return () => unsubscribe && unsubscribe();
	}, [clientPlanId, isDemoMode, userData, showNotification]);

	useEffect(() => {
		const fetchPrograms = async () => {
			if (isDemoMode) {
				setAllPrograms(providerDataSeed);
				return;
			}
			if (!userData?.organizationId) return;
			try {
				const programsRef = collection(db, `organizations/${userData.organizationId}/programs`);
				const querySnapshot = await getDocs(programsRef);
				const programsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
				setAllPrograms(programsData);
			} catch (err) {
				console.error("Error fetching programs:", err);
			}
		};
		fetchPrograms();
	}, [userData, isDemoMode]);

	const handleUpdate = async (updateData) => {
		const updatedPlan = { ...clientPlan, ...updateData, lastUpdated: Timestamp.now() };
		setClientPlan(updatedPlan); // Optimistic update

		if (isDemoMode) {
			const planIndex = demoClientPlans.findIndex(p => p.id === clientPlan.id);
			if(planIndex !== -1) {
				demoClientPlans[planIndex] = updatedPlan;
			}
			// No notification here to avoid spamming on every keystroke
			return;
		}

		const planRef = doc(db, `organizations/${userData.organizationId}/clients`, clientPlan.id);
		try {
			await updateDoc(planRef, { ...updateData, lastUpdated: Timestamp.now() });
		} catch (err) {
			console.error("Error updating plan:", err);
			showNotification("Error saving update.", "error");
			// Revert optimistic update on error
			// Note: A more robust solution might refetch the doc
			setClientPlan(clientPlan);
		}
	};

	const handleAddToShortlist = (subProgramsToAdd) => {
		const currentShortlist = clientPlan.shortlist || [];
		
		const newItems = subProgramsToAdd
			.filter(subProg => !currentShortlist.some(p => p.programId === subProg.id))
			.map(subProg => {
				let facilityName = 'Unknown Facility';
				// Find the parent facility for the current sub-program
				for (const facility of allPrograms) {
					if (facility.subPrograms && facility.subPrograms.some(sp => sp.id === subProg.id)) {
						facilityName = facility.name;
						break;
					}
				}

				return {
					programId: subProg.id,
					// FIX: Construct the full program name including the facility
					programName: `${facilityName} - ${subProg.name}`,
					status: 'Vetting',
					notes: ''
				};
			});

		if (newItems.length > 0) {
			handleUpdate({ shortlist: [...currentShortlist, ...newItems] });
			showNotification(`${newItems.length} program(s) added to shortlist!`, "success");
		} else {
			showNotification("Selected programs are already on the shortlist.", "info");
		}
	};

    const handleGenerateMeetingDoc = () => {
        const newDoc = {
            id: `doc-${Date.now()}`,
            type: 'Meeting Document',
            date: Timestamp.now(),
            programs: (clientPlan.shortlist || []).map(p => p.programName)
        };
        const currentDocs = clientPlan.generatedDocuments || [];
        handleUpdate({ generatedDocuments: [...currentDocs, newDoc] });
        setIsMeetingDocOpen(true);
    };

	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<Loader className="w-8 h-8 animate-spin" />
				<span className="ml-2">Loading client plan...</span>
			</div>
		);
	}

	if (!clientPlan) {
		return (
			<div className="flex flex-col justify-center items-center h-64 space-y-4">
				<div className="text-slate-600 text-center">
					<h3 className="text-lg font-semibold">No Client Plan Found</h3>
					<p>Client plan ID: {clientPlanId}</p>
				</div>
				<button onClick={onBack} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
					Go Back
				</button>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex justify-between items-center">
				<button onClick={onBack} className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800">
					<ArrowLeft className="w-4 h-4 mr-2" />
					Back to {clientPlan.program || 'Dashboard'} Caseload
				</button>
			</div>

			{/* Page Header */}
			<header className="pb-4 border-b dark:border-slate-700">
				<div className="flex items-center gap-4">
					<h1 className="text-4xl font-bold">{clientPlan.clientId}</h1>
					<span className={`px-3 py-1 text-sm font-semibold rounded-full ${clientPlan.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
						{clientPlan.status}
					</span>
				</div>
				<p className="mt-1 text-lg text-slate-500">
					Discharge Plan for <span className="font-semibold">{clientPlan.program}</span>
				</p>
			</header>

			{/* Main Content Grid */}
			<div className="grid grid-cols-1 xl:grid-cols-2 lg:grid-cols-2 gap-4">
				{/* Left Column - Client Info & Checklist */}
				<div className="space-y-4">
					<ClientInfoCard clientPlan={clientPlan} onUpdate={handleUpdate} />
					<ReferentInfoCard referent={clientPlan.referent || {}} onUpdate={(updatedReferent) => handleUpdate({ referent: updatedReferent })} />
					<PlanningChecklist 
						progress={clientPlan.planningProgress || {}} 
						onUpdate={(updatedProgress) => handleUpdate({ planningProgress: updatedProgress })}
						clientPlan={clientPlan}
						isMeetingMode={isMeetingMode}
					/>
				</div>

				{/* Right Column - Tasks, Enhanced Aftercare Workspace with Documents & Notes */}
				<div className="space-y-4">
					<TasksCard tasks={clientPlan.tasks || []} onUpdate={(newTasks) => handleUpdate({ tasks: newTasks })} />
					{isMeetingMode && (
						<WeeklyUpdatesCard 
							clientPlan={clientPlan} 
							onUpdate={handleUpdate} 
							isMeetingMode={isMeetingMode} 
						/>
					)}
					<EnhancedAftercareWorkspace
						clientPlan={clientPlan}
						onOpenProgramFinder={() => setIsProgramModalOpen(true)}
						onGenerateMeetingDoc={handleGenerateMeetingDoc}
						onUpdateShortlist={(newShortlist) => handleUpdate({ shortlist: newShortlist })}
						documents={clientPlan.generatedDocuments || []}
						notes={clientPlan.notes || []}
						onNotesUpdate={(newNotes) => handleUpdate({ notes: newNotes })}
					/>
				</div>
			</div>

			{/* Modals */}
			{isProgramModalOpen && (
				<ProgramFinderModal
					onClose={() => setIsProgramModalOpen(false)}
					onAddToShortlist={handleAddToShortlist}
					allPrograms={allPrograms}
					showNotification={showNotification}
					activeClientPlan={clientPlan}
					isDemoMode={isDemoMode}
					userData={userData}
				/>
			)}

			{isMeetingDocOpen && (
				<MeetingDocModal
					clientPlan={clientPlan}
					onClose={() => setIsMeetingDocOpen(false)}
					onScheduleMeeting={(data) => console.log('Schedule meeting:', data)}
				/>
			)}
		</div>
	);
};

// --- Combined Documents & Notes Card ---
const CombinedDocumentsNotesCard = ({ documents, notes, onNotesUpdate }) => {
	const [newNote, setNewNote] = useState('');
	const [activeTab, setActiveTab] = useState('documents');

	const handleAddNote = () => {
		if (newNote.trim()) {
			const note = {
				id: `note-${Date.now()}`,
				note: newNote,
				user: 'Current User',
				date: new Date().toISOString()
			};
			onNotesUpdate([...notes, note]);
			setNewNote('');
		}
	};

	return (
		<div className="bg-white dark:bg-slate-800 rounded-lg shadow-md h-full flex flex-col">
			{/* Tab Headers */}
			<div className="flex border-b border-slate-200 dark:border-slate-600">
				<button
					onClick={() => setActiveTab('documents')}
					className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center space-x-2 transition-colors ${
						activeTab === 'documents'
							? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
							: 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
					}`}
				>
					<FileClock className="w-4 h-4" />
					<span>Documents</span>
					<span className="bg-slate-200 dark:bg-slate-700 text-xs px-2 py-0.5 rounded-full">
						{documents.length}
					</span>
				</button>
				<button
					onClick={() => setActiveTab('notes')}
					className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center space-x-2 transition-colors ${
						activeTab === 'notes'
							? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
							: 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
					}`}
				>
					<MessageCircle className="w-4 h-4" />
					<span>Notes</span>
					<span className="bg-slate-200 dark:bg-slate-700 text-xs px-2 py-0.5 rounded-full">
						{notes.length}
					</span>
				</button>
			</div>

			{/* Content Area */}
			<div className="flex-1 p-4">
				{activeTab === 'documents' ? (
					<div className="h-full">
						<div className="space-y-3 max-h-96 overflow-y-auto">
							{documents.length > 0 ? documents.map(doc => (
								<div key={doc.id} className="group border border-slate-200 dark:border-slate-600 rounded-lg p-3 bg-slate-50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all duration-200">
									<div className="flex items-start justify-between">
										<div className="flex-1 min-w-0">
											<div className="flex items-center space-x-2 mb-1">
												<FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
												<h4 className="text-sm font-medium text-slate-900 dark:text-white truncate">
													{doc.type}
												</h4>
											</div>
											<p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
												Created: {doc.date.toDate().toLocaleDateString()}
											</p>
											<div className="flex items-center space-x-2">
												<button className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
													<ExternalLink className="w-3 h-3 inline mr-1" />
													View
												</button>
												<button className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2 py-1 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
													<Printer className="w-3 h-3 inline mr-1" />
													Print
												</button>
											</div>
										</div>
									</div>
								</div>
							)) : (
								<div className="flex flex-col items-center justify-center h-32 text-center">
									<FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
									<p className="text-sm text-slate-500 dark:text-slate-400 mb-1">No documents generated yet</p>
									<p className="text-xs text-slate-400 dark:text-slate-500">Documents will appear here when created</p>
								</div>
							)}
						</div>
					</div>
				) : (
					<div className="h-full flex flex-col">
						{/* Add Note Section */}
						<div className="mb-4 p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg border border-slate-200 dark:border-slate-600">
							<textarea
								value={newNote}
								onChange={(e) => setNewNote(e.target.value)}
								placeholder="Add a note about this client..."
								className="w-full text-sm px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								rows="3"
							/>
							<div className="flex justify-end mt-2">
								<button 
									onClick={handleAddNote} 
									disabled={!newNote.trim()}
									className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
								>
									<Plus className="w-3 h-3 inline mr-1" />
									Add Note
								</button>
							</div>
						</div>

						{/* Notes List */}
						<div className="flex-1 space-y-3 max-h-64 overflow-y-auto">
							{notes.length > 0 ? notes.map(note => (
								<div key={note.id} className="p-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800/50">
									<p className="text-sm text-slate-700 dark:text-slate-300 mb-2 leading-relaxed">
										{note.note}
									</p>
									<div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
										<span className="font-medium">{note.user}</span>
										<span>{new Date(note.date).toLocaleDateString()}</span>
									</div>
								</div>
							)) : (
								<div className="flex flex-col items-center justify-center h-32 text-center">
									<MessageCircle className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
									<p className="text-sm text-slate-500 dark:text-slate-400 mb-1">No notes yet</p>
									<p className="text-xs text-slate-400 dark:text-slate-500">Add notes to track important information</p>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

// --- NEW: Generated Documents Card ---
const DocumentsCard = ({ documents }) => {
    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md h-full">
            <h3 className="font-bold text-lg mb-3 flex items-center"><FileClock className="w-5 h-5 mr-2 text-blue-500" /> Documents</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
                {(documents || []).length > 0 ? documents.map(doc => (
                    <div key={doc.id} className="border border-slate-200 dark:border-slate-600 rounded p-2 bg-slate-50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                        <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-medium text-slate-900 dark:text-white truncate">{doc.type}</h4>
                            <button className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
                                View
                            </button>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                            {doc.date.toDate().toLocaleDateString()}
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-4">
                        <FileText className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                        <p className="text-sm text-slate-500 dark:text-slate-400">No documents yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Notes Card Component ---
const NotesCard = ({ notes, onUpdate }) => {
	const [newNote, setNewNote] = useState('');

	const handleAddNote = () => {
		if (newNote.trim()) {
			const note = {
				id: `note-${Date.now()}`,
				note: newNote,
				user: 'Current User', // Would normally get from userData
				date: new Date().toISOString()
			};
			onUpdate([...notes, note]);
			setNewNote('');
		}
	};

	return (
		<div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md h-full">
			<h3 className="font-bold text-lg mb-3 flex items-center"><MessageCircle className="w-5 h-5 mr-2 text-blue-500" /> Notes</h3>
			<div className="space-y-2 mb-3">
				<textarea
					value={newNote}
					onChange={(e) => setNewNote(e.target.value)}
					placeholder="Add a note..."
					className="w-full text-sm px-2 py-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md min-h-[40px]"
				/>
				<button onClick={handleAddNote} className="px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
					Add Note
				</button>
			</div>
			<div className="space-y-2 max-h-32 overflow-y-auto">
				{notes.map(note => (
					<div key={note.id} className="p-2 border border-slate-200 dark:border-slate-600 rounded bg-slate-50 dark:bg-slate-700/30">
						<p className="text-sm text-slate-700 dark:text-slate-300">{note.note}</p>
						<p className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-right">
							<strong>{note.user}</strong> - {new Date(note.date).toLocaleDateString()}
						</p>
					</div>
				))}
				{notes.length === 0 && <p className="text-sm text-slate-500 text-center py-2">No notes yet.</p>}
			</div>
		</div>
	);
};

// --- Meeting Document Modal Component ---
const MeetingDocModal = ({ clientPlan, onClose, onScheduleMeeting }) => {
	return (
		<div className="fixed inset-0 bg-black bg-opacity-60 z-[100] flex justify-center items-center p-4">
			<div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
				<div className="flex justify-between items-center p-6 border-b dark:border-slate-700">
					<h2 className="text-xl font-bold">Meeting Document for {clientPlan.clientId}</h2>
					<button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
						<X size={24} />
					</button>
				</div>
				<div className="p-6">
					<div className="space-y-6">
						<div>
							<h3 className="text-lg font-semibold mb-3">Programs on Shortlist:</h3>
							<ul className="space-y-2">
								{(clientPlan.shortlist || []).map((item, index) => (
									<li key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
										<span className="font-medium">{item.programName}</span>
										<span className={`px-2 py-1 text-xs rounded-full ${
											item.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
											item.status === 'Vetting' ? 'bg-yellow-100 text-yellow-800' :
											'bg-slate-100 text-slate-800'
										}`}>
											{item.status}
										</span>
									</li>
								))}
							</ul>
						</div>
						<div>
							<h3 className="text-lg font-semibold mb-3">Meeting Summary:</h3>
							<div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
								<p className="text-sm text-slate-600 dark:text-slate-400">
									Meeting document generated on {new Date().toLocaleDateString()} for {clientPlan.clientId}.
									This document includes current program shortlist status and recommendations for next steps.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};


// --- FACESHEET SUB-COMPONENTS ---

const ClientInfoCard = ({ clientPlan, onUpdate }) => {
	const age = useMemo(() => calculateAge(clientPlan.dob), [clientPlan.dob]);
	const los = useMemo(() => calculateLengthOfStay(clientPlan.admissionDate), [clientPlan.admissionDate]);

	return (
		<div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-md">
			<h3 className="font-bold text-base mb-2 flex items-center"><User className="w-4 h-4 mr-2 text-blue-500" /> Client Info</h3>
			<div className="space-y-1.5">
				<EditableField label="Client ID" value={clientPlan.clientId} onSave={(val) => onUpdate({ clientId: val })} />
				<div className="grid grid-cols-2 gap-2">
					<EditableField label="Date of Birth" value={clientPlan.dob} type="date" onSave={(val) => onUpdate({ dob: val })} />
					<div>
						<label className="block text-xs font-medium text-slate-500">Current Age</label>
						<p className="text-sm font-semibold py-1">{age ? `${age} years old` : 'N/A'}</p>
					</div>
				</div>
				<div className="grid grid-cols-2 gap-2">
					<EditableField label="Admission Date" value={clientPlan.admissionDate} type="date" onSave={(val) => onUpdate({ admissionDate: val })} />
					<div>
						<label className="block text-xs font-medium text-slate-500">Length of Stay</label>
						<p className="text-sm font-semibold py-1">{los ? `${los} days` : 'N/A'}</p>
					</div>
				</div>
				<div className="grid grid-cols-2 gap-2">
					<EditableField label="Est. Discharge" value={clientPlan.estDischarge} type="date" onSave={(val) => onUpdate({ estDischarge: val })} />
					<EditableField label="Family Ambassador" value={clientPlan.familyAmbassador} onSave={(val) => onUpdate({ familyAmbassador: val })} />
				</div>
				<EditableField label="Family Location" value={clientPlan.familyLocation} onSave={(val) => onUpdate({ familyLocation: val })} />
			</div>
		</div>
	);
};

const ReferentInfoCard = ({ referent, onUpdate }) => {
	const handleFieldSave = (field, value) => {
		onUpdate({ ...referent, [field]: value });
	};

	return (
		<div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-md">
			<h3 className="font-bold text-base mb-2 flex items-center"><UserCheck className="w-4 h-4 mr-2 text-blue-500" /> Referent Info</h3>
			<div className="space-y-1.5">
				<EditableField label="Referent Name" value={referent.name} onSave={(val) => handleFieldSave('name', val)} />
				<EditableField label="Referent Type" value={referent.type} onSave={(val) => handleFieldSave('type', val)}>
					<select>
						{REFERENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
					</select>
				</EditableField>
				<EditableField label="Role in Aftercare" value={referent.role} onSave={(val) => handleFieldSave('role', val)}>
					<select>
						{REFERENT_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
					</select>
				</EditableField>
				<div className="grid grid-cols-2 gap-2">
					<EditableField label="Last Contact" value={referent.lastContactDate} type="date" onSave={(val) => handleFieldSave('lastContactDate', val)} />
					<EditableField label="Next Contact" value={referent.nextContactDate} type="date" onSave={(val) => handleFieldSave('nextContactDate', val)} />
				</div>
			</div>
		</div>
	);
};

const PlanningChecklist = ({ progress, onUpdate, clientPlan, isMeetingMode }) => {
	// Calculate days since admission for due date logic
	const daysSinceAdmission = clientPlan?.admissionDate 
		? Math.floor((new Date() - new Date(clientPlan.admissionDate)) / (1000 * 60 * 60 * 24))
		: 0;

	const checklistItems = [
		{ 
			key: 'extensionScheduled', 
			label: 'Extension Call Scheduled',
			dueAfterDays: 14,
			requiresWeeklyUpdate: true,
			priority: 'high'
		},
		{ 
			key: 'emailSent', 
			label: 'Extension Email Sent',
			dueAfterDays: 15,
			dependsOn: 'extensionScheduled',
			requiresWeeklyUpdate: true,
			priority: 'high'
		},
		{ 
			key: 'aftercareThreadLaunched', 
			label: 'Aftercare Thread Launched',
			dueAfterDays: 16,
			dependsOn: 'emailSent',
			requiresWeeklyUpdate: true,
			priority: 'high'
		},
		{ 
			key: 'initialOptionsVetted', 
			label: 'Initial Options Vetted',
			dueAfterDays: 21,
			dependsOn: 'aftercareThreadLaunched',
			requiresWeeklyUpdate: true,
			priority: 'medium'
		},
		{ 
			key: 'familyReviewSession', 
			label: 'Family Review Session',
			dueAfterDays: 28,
			dependsOn: 'initialOptionsVetted',
			requiresWeeklyUpdate: true,
			priority: 'high'
		},
		{ 
			key: 'connectingEmailsSent', 
			label: 'Connecting Emails Sent',
			dueAfterDays: 30,
			dependsOn: 'familyReviewSession',
			priority: 'medium'
		},
		{ 
			key: 'finalProgramConfirmed', 
			label: 'Final Program Confirmed',
			dueAfterDays: 35,
			dependsOn: 'connectingEmailsSent',
			requiresWeeklyUpdate: true,
			priority: 'high'
		},
		{ 
			key: 'intakeDateSecured', 
			label: 'Intake Date Secured',
			dueAfterDays: 37,
			dependsOn: 'finalProgramConfirmed',
			priority: 'high'
		},
		{ 
			key: 'warmHandoffCompleted', 
			label: 'Warm Handoff Completed',
			dueAfterDays: 42,
			dependsOn: 'intakeDateSecured',
			priority: 'high'
		},
		{ 
			key: 'kipuUpdated', 
			label: 'Kipu Updated',
			dueAfterDays: 43,
			dependsOn: 'warmHandoffCompleted',
			priority: 'medium'
		},
	];

	const completedCount = Object.values(progress).filter(Boolean).length;
	const totalCount = checklistItems.length;
	const percentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

	const getItemStatus = (item) => {
		const isCompleted = !!progress[item.key];
		const isOverdue = daysSinceAdmission > item.dueAfterDays && !isCompleted;
		const isDueSoon = daysSinceAdmission > (item.dueAfterDays - 3) && !isCompleted;
		const isBlocked = item.dependsOn && !progress[item.dependsOn];
		const needsWeeklyAttention = isMeetingMode && item.requiresWeeklyUpdate && !isCompleted;

		return {
			isCompleted,
			isOverdue,
			isDueSoon,
			isBlocked,
			needsWeeklyAttention,
			daysLeft: item.dueAfterDays - daysSinceAdmission
		};
	};

	const getItemClasses = (item, status) => {
		let classes = "flex items-center space-x-3 cursor-pointer p-2 rounded-md transition-all ";
		
		if (status.isCompleted) {
			classes += "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 ";
		} else if (status.isBlocked) {
			classes += "bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 opacity-60 cursor-not-allowed ";
		} else if (status.isOverdue) {
			classes += "bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 animate-pulse ";
		} else if (status.needsWeeklyAttention) {
			classes += "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 ring-2 ring-yellow-400 ";
		} else if (status.isDueSoon) {
			classes += "bg-orange-50 dark:bg-orange-900/20 border border-orange-300 dark:border-orange-700 ";
		} else {
			classes += "hover:bg-slate-50 dark:hover:bg-slate-700 border border-transparent ";
		}

		return classes;
	};

	const handleToggle = (item) => {
		const status = getItemStatus(item);
		if (status.isBlocked) return; // Don't allow toggling blocked items
		
		onUpdate({ ...progress, [item.key]: !progress[item.key] });
	};

	return (
		<div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md h-full">
			<div className="flex items-center justify-between mb-3">
				<h3 className="font-bold text-lg flex items-center">
					<Flag className="w-5 h-5 mr-2 text-blue-500" /> 
					Planning Checklist
				</h3>
				{isMeetingMode && (
					<span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
						Meeting Mode
					</span>
				)}
			</div>
			
			<div className="w-full bg-slate-200 rounded-full h-2.5 dark:bg-slate-700 mb-4">
				<div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${percentage}%` }}></div>
			</div>
			
			<div className="space-y-2 max-h-64 overflow-y-auto">
				{checklistItems.map(item => {
					const status = getItemStatus(item);
					return (
						<label key={item.key} className={getItemClasses(item, status)}>
							<div className="flex items-center space-x-2">
								<input
									type="checkbox"
									checked={status.isCompleted}
									onChange={() => handleToggle(item)}
									disabled={status.isBlocked}
									className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 disabled:opacity-50"
								/>
								{status.isOverdue && <AlertTriangle className="w-4 h-4 text-red-500" />}
								{status.needsWeeklyAttention && <Zap className="w-4 h-4 text-yellow-500" />}
								{status.isBlocked && <Clock className="w-4 h-4 text-slate-400" />}
							</div>
							<div className="flex-1">
								<span className={`text-sm ${status.isCompleted ? 'line-through text-slate-500' : status.isBlocked ? 'text-slate-400' : ''}`}>
									{item.label}
								</span>
								{!status.isCompleted && !status.isBlocked && (
									<div className="text-xs text-slate-500 mt-1">
										{status.isOverdue ? (
											<span className="text-red-600 font-medium">Overdue by {Math.abs(status.daysLeft)} days</span>
										) : status.isDueSoon ? (
											<span className="text-orange-600 font-medium">Due in {status.daysLeft} days</span>
										) : (
											<span>Due in {status.daysLeft} days</span>
										)}
									</div>
								)}
								{status.isBlocked && item.dependsOn && (
									<div className="text-xs text-slate-400 mt-1">
										Waiting for: {checklistItems.find(i => i.key === item.dependsOn)?.label}
									</div>
								)}
							</div>
						</label>
					);
				})}
			</div>
			
			{isMeetingMode && (
				<div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
					<h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">Weekly Review Needed:</h4>
					<div className="text-xs text-blue-700 dark:text-blue-300">
						Items with ⚡ require weekly updates during discharge meetings
					</div>
				</div>
			)}
		</div>
	);
};

// --- Weekly Updates Component for Meeting Mode ---
const WeeklyUpdatesCard = ({ clientPlan, onUpdate, isMeetingMode }) => {
	if (!isMeetingMode) return null;

	const weeklyFields = [
		{
			key: 'weeklyProgress',
			label: 'This Week\'s Progress',
			value: clientPlan.weeklyProgress || '',
			placeholder: 'What progress was made this week?',
			required: true
		},
		{
			key: 'weeklyObstacles',
			label: 'Current Obstacles',
			value: clientPlan.weeklyObstacles || '',
			placeholder: 'Any challenges or roadblocks?',
			required: true
		},
		{
			key: 'nextWeekPlan',
			label: 'Next Week\'s Plan',
			value: clientPlan.nextWeekPlan || '',
			placeholder: 'What are the goals for next week?',
			required: true
		},
		{
			key: 'familyUpdates',
			label: 'Family Communication',
			value: clientPlan.familyUpdates || '',
			placeholder: 'Any family discussions or updates?',
			required: false
		}
	];

	const handleFieldUpdate = (key, value) => {
		onUpdate({ [key]: value });
	};

	const getFieldAlert = (field) => {
		if (!field.required) return false;
		const lastUpdate = clientPlan[`${field.key}LastUpdated`];
		if (!lastUpdate) return true; // Never updated
		
		const daysSinceUpdate = Math.floor((new Date() - new Date(lastUpdate)) / (1000 * 60 * 60 * 24));
		return daysSinceUpdate >= 7; // Needs update if more than 7 days
	};

	return (
		<div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 rounded-lg shadow-md border-l-4 border-yellow-400">
			<h3 className="font-bold text-lg mb-3 flex items-center">
				<Zap className="w-5 h-5 mr-2 text-yellow-500" /> 
				Weekly Meeting Updates
				<span className="ml-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">
					Required
				</span>
			</h3>
			
			<div className="space-y-4">
				{weeklyFields.map(field => {
					const needsAttention = getFieldAlert(field);
					return (
						<div key={field.key} className={`relative ${needsAttention ? 'ring-2 ring-red-400 ring-opacity-50 rounded-lg p-2 bg-red-50 dark:bg-red-900/20' : ''}`}>
							<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
								{field.label}
								{field.required && <span className="text-red-500 ml-1">*</span>}
								{needsAttention && (
									<AlertTriangle className="inline-block w-4 h-4 text-red-500 ml-2" />
								)}
							</label>
							<textarea
								value={field.value}
								onChange={(e) => {
									handleFieldUpdate(field.key, e.target.value);
									// Update timestamp
									handleFieldUpdate(`${field.key}LastUpdated`, new Date().toISOString());
								}}
								placeholder={field.placeholder}
								className={`w-full text-sm p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 min-h-[60px] transition-all ${
									needsAttention ? 'border-red-400 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
								}`}
								rows={2}
							/>
							{needsAttention && (
								<p className="text-xs text-red-600 mt-1 font-medium">
									This field requires weekly updates during meetings
								</p>
							)}
						</div>
					);
				})}
			</div>
			
			<div className="mt-4 p-3 bg-white dark:bg-slate-800 rounded border border-yellow-300 dark:border-yellow-700">
				<p className="text-xs text-slate-600 dark:text-slate-400">
					<strong>Meeting Mode:</strong> These fields should be updated during each weekly discharge planning meeting to track progress and maintain momentum.
				</p>
			</div>
		</div>
	);
};

const WeeklyNotes = ({ notes, onAddNote }) => {
	const [newNote, setNewNote] = useState('');

	const handleAddNote = () => {
		if (newNote.trim()) {
			onAddNote(newNote);
			setNewNote('');
		}
	};
	
	return (
		<div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
			<h3 className="font-bold text-xl mb-4 flex items-center"><MessageSquare className="w-6 h-6 mr-2 text-blue-500" /> Weekly Discharge Notes</h3>
			<div className="space-y-2 mb-4">
				<textarea
					value={newNote}
					onChange={(e) => setNewNote(e.target.value)}
					placeholder="Add a new note for the team..."
					className="w-full text-sm p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 min-h-[60px]"
				/>
				<div className="flex justify-end">
					<button onClick={handleAddNote} className="px-3 py-1.5 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">Add Note</button>
				</div>
			</div>
			<div className="space-y-4 max-h-96 overflow-y-auto pr-2">
				{notes.map((note, index) => (
					<div key={index} className="p-3 rounded-md bg-slate-50 dark:bg-slate-700/50">
						<p className="text-sm text-slate-700 dark:text-slate-300">{note.note}</p>
						<p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-right">
							<strong>{note.user}</strong> - {new Date(note.date).toLocaleString()}
						</p>
					</div>
				))}
				{notes.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No notes yet.</p>}
			</div>
		</div>
	);
}

// --- Standalone Tasks Card Component ---
const TasksCard = ({ tasks, onUpdate }) => {
	const [newTask, setNewTask] = useState('');

	const addTask = () => {
		if (newTask.trim()) {
			const updatedTasks = [...tasks, { 
				id: Date.now(), 
				text: newTask, 
				completed: false,
				priority: 'medium',
				dueDate: null
			}];
			onUpdate(updatedTasks);
			setNewTask('');
		}
	};

	const toggleTask = (taskId) => {
		const updatedTasks = tasks.map(task => 
			task.id === taskId ? { ...task, completed: !task.completed } : task
		);
		onUpdate(updatedTasks);
	};

	const deleteTask = (taskId) => {
		const updatedTasks = tasks.filter(task => task.id !== taskId);
		onUpdate(updatedTasks);
	};

	return (
		<div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md">
			<div className="flex items-center justify-between mb-3">
				<h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
					<CheckSquare className="w-5 h-5 mr-2 text-green-500" />
					Follow-up Tasks
				</h3>
				<span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
					{tasks.filter(task => !task.completed).length} pending
				</span>
			</div>

			{/* Add new task */}
			<div className="flex gap-2 mb-4">
				<input
					type="text"
					value={newTask}
					onChange={(e) => setNewTask(e.target.value)}
					onKeyPress={(e) => e.key === 'Enter' && addTask()}
					placeholder="Add follow-up task..."
					className="flex-1 text-sm px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
				/>
				<button
					onClick={addTask}
					className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
				>
					<Plus className="w-4 h-4" />
				</button>
			</div>

			{/* Task list */}
			<div className="space-y-2 max-h-48 overflow-y-auto">
				{tasks.length === 0 ? (
					<div className="text-center py-8">
						<CheckSquare className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
						<p className="text-sm text-slate-500 dark:text-slate-400 mb-1">No follow-up tasks yet</p>
						<p className="text-xs text-slate-400 dark:text-slate-500">Add tasks to track important follow-ups</p>
					</div>
				) : (
					tasks.map(task => (
						<div key={task.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700/70 transition-colors">
							<input
								type="checkbox"
								checked={task.completed}
								onChange={() => toggleTask(task.id)}
								className="h-4 w-4 text-green-600 focus:ring-green-500 border-slate-300 dark:border-slate-500 rounded"
							/>
							<span className={`flex-1 text-sm ${task.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-300'}`}>
								{task.text}
							</span>
							<button
								onClick={() => deleteTask(task.id)}
								className="text-red-400 hover:text-red-600 transition-colors p-1"
							>
								<X className="w-4 h-4" />
							</button>
						</div>
					))
				)}
			</div>
		</div>
	);
};

// --- Enhanced Aftercare Workspace with Integrated Documents & Notes ---
const EnhancedAftercareWorkspace = ({ 
	clientPlan, 
	onOpenProgramFinder, 
	onGenerateMeetingDoc, 
	onUpdateShortlist,
	documents,
	notes,
	onNotesUpdate 
}) => {
	const [newNote, setNewNote] = useState('');
	const [activeTab, setActiveTab] = useState('aftercare');

	const handleAddNote = () => {
		if (newNote.trim()) {
			const note = {
				id: `note-${Date.now()}`,
				note: newNote,
				user: 'Current User',
				date: new Date().toISOString()
			};
			onNotesUpdate([...notes, note]);
			setNewNote('');
		}
	};

	const handleRemoveFromShortlist = (indexToRemove) => {
		const updatedShortlist = (clientPlan.shortlist || []).filter((_, index) => index !== indexToRemove);
		onUpdateShortlist(updatedShortlist);
	};

	const handleStatusChange = (index, newStatus) => {
		const updatedShortlist = (clientPlan.shortlist || []).map((item, i) => 
			i === index ? { ...item, status: newStatus } : item
		);
		onUpdateShortlist(updatedShortlist);
	};

	return (
		<div className="bg-white dark:bg-slate-800 rounded-lg shadow-md h-full flex flex-col">
			{/* Tab Headers */}
			<div className="flex border-b border-slate-200 dark:border-slate-600">
				<button
					onClick={() => setActiveTab('aftercare')}
					className={`flex-1 px-3 py-3 text-sm font-medium flex items-center justify-center space-x-2 transition-colors ${
						activeTab === 'aftercare'
							? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
							: 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
					}`}
				>
					<Heart className="w-4 h-4" />
					<span>Aftercare</span>
				</button>
				<button
					onClick={() => setActiveTab('documents')}
					className={`flex-1 px-3 py-3 text-sm font-medium flex items-center justify-center space-x-2 transition-colors ${
						activeTab === 'documents'
							? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
							: 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
					}`}
				>
					<FileClock className="w-4 h-4" />
					<span>Documents</span>
					<span className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs px-2 py-0.5 rounded-full">
						{documents.length}
					</span>
				</button>
				<button
					onClick={() => setActiveTab('notes')}
					className={`flex-1 px-3 py-3 text-sm font-medium flex items-center justify-center space-x-2 transition-colors ${
						activeTab === 'notes'
							? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
							: 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
					}`}
				>
					<MessageCircle className="w-4 h-4" />
					<span>Notes</span>
					<span className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs px-2 py-0.5 rounded-full">
						{notes.length}
					</span>
				</button>
			</div>

			{/* Content Area */}
			<div className="flex-1 p-4">
				{activeTab === 'aftercare' && (
					<div className="h-full flex flex-col space-y-4">
						{/* Action Buttons */}
						<div className="grid grid-cols-2 gap-2">
							<button
								onClick={onOpenProgramFinder}
								className="flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
							>
								<Search className="w-4 h-4" />
								<span>Find Programs</span>
							</button>
							<button
								onClick={() => onGenerateMeetingDoc(clientPlan)}
								className="flex items-center justify-center space-x-2 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
							>
								<Wand2 className="w-4 h-4" />
								<span>Meeting Doc</span>
							</button>
						</div>

						{/* Shortlist */}
						<div className="flex-1">
							<h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center">
								<ListTodo className="w-4 h-4 mr-2 text-green-500" />
								Shortlist ({(clientPlan.shortlist || []).length})
							</h4>
							<div className="space-y-2 max-h-64 overflow-y-auto">
								{(clientPlan.shortlist || []).length > 0 ? (
									(clientPlan.shortlist || []).map((item, index) => (
										<div key={index} className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg border border-slate-200 dark:border-slate-600">
											<div className="flex items-start justify-between mb-2">
												<div className="flex-1 min-w-0">
													<h5 className="text-sm font-medium text-slate-900 dark:text-white truncate">
														{item.programName}
													</h5>
													<p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
														{item.location}
													</p>
												</div>
												<button
													onClick={() => handleRemoveFromShortlist(index)}
													className="ml-2 p-1 text-red-400 hover:text-red-600 transition-colors"
												>
													<X className="w-4 h-4" />
												</button>
											</div>
											<div className="flex items-center space-x-2">
												<span className="text-xs text-slate-600 dark:text-slate-400">Status:</span>
												<select
													value={item.status || 'Vetting'}
													onChange={(e) => handleStatusChange(index, e.target.value)}
													className="text-xs px-2 py-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-slate-700 dark:text-slate-300"
												>
													<option value="Vetting">Vetting</option>
													<option value="Confirmed">Confirmed</option>
													<option value="Rejected">Rejected</option>
													<option value="Waitlisted">Waitlisted</option>
												</select>
											</div>
										</div>
									))
								) : (
									<div className="text-center py-6">
										<Heart className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
										<p className="text-sm text-slate-500 dark:text-slate-400">No programs shortlisted yet</p>
									</div>
								)}
							</div>
						</div>
					</div>
				)}

				{activeTab === 'documents' && (
					<div className="h-full">
						<div className="space-y-3 max-h-96 overflow-y-auto">
							{documents.length > 0 ? documents.map(doc => (
								<div key={doc.id} className="group border border-slate-200 dark:border-slate-600 rounded-lg p-3 bg-slate-50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all duration-200">
									<div className="flex items-start justify-between">
										<div className="flex-1 min-w-0">
											<div className="flex items-center space-x-2 mb-1">
												<FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
												<h4 className="text-sm font-medium text-slate-900 dark:text-white truncate">
													{doc.type}
												</h4>
											</div>
											<p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
												Created: {doc.date.toDate().toLocaleDateString()}
											</p>
											<div className="flex items-center space-x-2">
												<button className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
													<ExternalLink className="w-3 h-3 inline mr-1" />
													View
												</button>
												<button className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2 py-1 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
													<Printer className="w-3 h-3 inline mr-1" />
													Print
												</button>
											</div>
										</div>
									</div>
								</div>
							)) : (
								<div className="flex flex-col items-center justify-center h-32 text-center">
									<FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
									<p className="text-sm text-slate-500 dark:text-slate-400 mb-1">No documents generated yet</p>
									<p className="text-xs text-slate-400 dark:text-slate-500">Documents will appear here when created</p>
								</div>
							)}
						</div>
					</div>
				)}

				{activeTab === 'notes' && (
					<div className="h-full flex flex-col">
						{/* Add Note Section */}
						<div className="mb-4 p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg border border-slate-200 dark:border-slate-600">
							<textarea
								value={newNote}
								onChange={(e) => setNewNote(e.target.value)}
								placeholder="Add a note about this client..."
								className="w-full text-sm px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								rows="3"
							/>
							<div className="flex justify-end mt-2">
								<button 
									onClick={handleAddNote} 
									disabled={!newNote.trim()}
									className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
								>
									<Plus className="w-3 h-3 inline mr-1" />
									Add Note
								</button>
							</div>
						</div>

						{/* Notes List */}
						<div className="flex-1 space-y-3 max-h-64 overflow-y-auto">
							{notes.length > 0 ? notes.map(note => (
								<div key={note.id} className="p-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800/50">
									<p className="text-sm text-slate-700 dark:text-slate-300 mb-2 leading-relaxed">
										{note.note}
									</p>
									<div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
										<span className="font-medium">{note.user}</span>
										<span>{new Date(note.date).toLocaleDateString()}</span>
									</div>
								</div>
							)) : (
								<div className="flex flex-col items-center justify-center h-32 text-center">
									<MessageCircle className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
									<p className="text-sm text-slate-500 dark:text-slate-400 mb-1">No notes yet</p>
									<p className="text-xs text-slate-400 dark:text-slate-500">Add notes to track important information</p>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

const AftercareWorkspace = ({ clientPlan, onOpenProgramFinder, onGenerateMeetingDoc, onUpdateShortlist }) => {

	const getStatusPill = (status) => {
		switch (status) {
			case 'Vetting': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
			case 'Presented to Family': return 'bg-blue-100 text-blue-800 border-blue-300';
			case 'Application Submitted': return 'bg-indigo-100 text-indigo-800 border-indigo-300';
			case 'Confirmed': return 'bg-green-100 text-green-800 border-green-300';
			case 'Declined': return 'bg-red-100 text-red-800 border-red-300';
			case 'Waitlisted': return 'bg-purple-100 text-purple-800 border-purple-300';
			default: return 'bg-slate-100 text-slate-800 border-slate-300';
		}
	};

	const handleStatusChange = (programId, newStatus) => {
		const newShortlist = clientPlan.shortlist.map(p =>
			p.programId === programId ? { ...p, status: newStatus } : p
		);
		onUpdateShortlist(newShortlist);
	};

	const handleNotesChange = (programId, newNotes) => {
		const newShortlist = clientPlan.shortlist.map(p =>
			p.programId === programId ? { ...p, notes: newNotes } : p
		);
		onUpdateShortlist(newShortlist);
	};

	const handleRemove = (programId) => {
		const newShortlist = clientPlan.shortlist.filter(p => p.programId !== programId);
		onUpdateShortlist(newShortlist);
	};

	return (
		<div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md h-full">
			<div className="flex justify-between items-center mb-3">
				<h3 className="font-bold text-lg flex items-center"><ListTodo className="w-5 h-5 mr-2 text-blue-500" /> Aftercare</h3>
				<div className="flex items-center space-x-1">
					<button onClick={onGenerateMeetingDoc} className="flex items-center px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-100 dark:bg-blue-900/50 rounded hover:bg-blue-200 dark:hover:bg-blue-900">
						<Printer className="w-3 h-3 mr-1" /> Doc
					</button>
					<button onClick={onOpenProgramFinder} className="flex items-center px-2 py-1 text-xs font-semibold text-white bg-blue-600 rounded hover:bg-blue-700">
						<Search className="w-3 h-3 mr-1" /> Find
					</button>
				</div>
			</div>

			<div className="space-y-2 max-h-64 overflow-y-auto">
				{(clientPlan.shortlist || []).length > 0 ? (
					(clientPlan.shortlist || []).map((item, index) => (
						<div key={`${item.programId}-${index}`} className="p-3 rounded border bg-slate-50 dark:bg-slate-700/50 dark:border-slate-600">
							<div className="flex justify-between items-center mb-2">
								<h4 className="font-medium text-sm text-slate-800 dark:text-slate-200">{item.programName}</h4>
								<div className="flex items-center space-x-1">
									<select
										value={item.status}
										onChange={(e) => handleStatusChange(item.programId, e.target.value)}
										className={`text-xs p-1 border rounded dark:bg-slate-600 ${getStatusPill(item.status)}`}
									>
										{SHORTLIST_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
									</select>
									<button onClick={() => handleRemove(item.programId)} className="p-1 text-red-500 hover:text-red-700">
										<Trash2 className="w-3 h-3" />
									</button>
								</div>
							</div>
							<textarea
								value={item.notes || ''}
								onChange={(e) => handleNotesChange(item.programId, e.target.value)}
								placeholder="Vetting notes, call logs, family feedback..."
								className="w-full text-xs p-2 border rounded dark:bg-slate-700 dark:border-slate-600 min-h-[50px]"
							/>
						</div>
					))
				) : (
					<div className="text-center py-4 text-slate-500">
						<p className="text-sm">No programs yet.</p>
						<p className="text-xs">Use "Find" to add programs.</p>
					</div>
				)}
			</div>
		</div>
	);
};

const ProgramFinderModal = ({ onClose, onAddToShortlist, allPrograms, showNotification, activeClientPlan, isDemoMode, userData }) => {
	const [comparisonList, setComparisonList] = useState([]);
	const [isCompareView, setIsCompareView] = useState(false);

	const handleToggleCompare = (program) => {
		setComparisonList(prev =>
			prev.some(p => p.id === program.id)
				? prev.filter(p => p.id !== program.id)
				: (prev.length < 3 ? [...prev, program] : prev)
		);
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-60 z-[100] flex justify-center items-center p-4 animate-fade-in">
			<div className="bg-slate-50 dark:bg-slate-900 rounded-lg shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col">
				<div className="flex justify-between items-center p-4 border-b dark:border-slate-700 flex-shrink-0">
					<h2 className="text-xl font-bold text-slate-800 dark:text-white">
						{isCompareView ? `Comparing Programs for ${activeClientPlan.clientId}` : 'Find & Compare Programs'}
					</h2>
					<button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
						<X size={24} />
					</button>
				</div>

				<div className="flex-grow min-h-0">
					{isCompareView ? (
						<ComparisonView 
							programs={comparisonList} 
							onBack={() => setIsCompareView(false)} 
							onAddToShortlist={onAddToShortlist}
							activeClientPlan={activeClientPlan}
							allPrograms={allPrograms}
							onClose={onClose}
						/>
					) : (
						<ProgramDatabaseView
							isModalVersion={true}
							programsFromProp={allPrograms}
							onToggleCompare={handleToggleCompare}
							comparisonList={comparisonList}
							showNotification={showNotification}
							activeClientPlan={activeClientPlan}
							onAddToShortlist={onAddToShortlist}
							isDemoMode={isDemoMode}
							userData={userData}
						/>
					)}
				</div>

				{!isCompareView && (
					<div className="flex-shrink-0 p-4 border-t dark:border-slate-700 bg-white dark:bg-slate-800">
						<div className="flex justify-between items-center">
							<div className="flex items-center gap-2">
								<h4 className="font-semibold">Comparison Tray:</h4>
								{comparisonList.map(p => <span key={p.id} className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded-full">{p.name}</span>)}
								{comparisonList.length === 0 && <span className="text-sm text-slate-500">Select up to 3 programs to compare.</span>}
							</div>
							<button
								onClick={() => setIsCompareView(true)}
								disabled={comparisonList.length < 2}
								className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-md disabled:bg-slate-400 disabled:cursor-not-allowed"
							>
								Compare ({comparisonList.length})
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

const SubProgramCompareCard = ({ subProgram, feature, isSelected, onToggle, isAlreadyOnShortlist }) => {
	const renderFeature = () => {
		switch (feature) {
			case 'Level of Care':
				return <p className="text-sm">{subProgram.type || 'N/A'}</p>;
			case 'Age Range':
				return <p className="text-sm">{subProgram.ageRange ? `${subProgram.ageRange.min} - ${subProgram.ageRange.max}` : 'N/A'}</p>;
			case 'Program Length':
				return <p className="text-sm">{subProgram.programLengthMonths ? `${subProgram.programLengthMonths.min} - ${subProgram.programLengthMonths.max} mos.` : 'N/A'}</p>;
			case 'Specialties':
				return (
					<ul className="text-sm list-disc list-inside">
						{(subProgram.specialties || []).map(s => <li key={s}>{s}</li>)}
					</ul>
				);
			default:
				return null;
		}
	};

	return (
		<div className={`bg-white dark:bg-slate-800 rounded-lg p-3 border-2 transition-colors ${isSelected ? 'border-blue-500' : 'border-slate-200 dark:border-slate-700'}`}>
			<label className="flex items-start space-x-3 cursor-pointer">
				<input
					type="checkbox"
					checked={isSelected}
					onChange={() => onToggle(subProgram)}
					disabled={isAlreadyOnShortlist}
					className="mt-1 h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 disabled:opacity-50"
				/>
				<div className="flex-grow">
					<h4 className={`font-bold ${isAlreadyOnShortlist ? 'text-slate-400' : 'text-blue-600 dark:text-blue-400'}`}>{subProgram.name}</h4>
					{isAlreadyOnShortlist && <p className="text-xs font-semibold text-green-600">(Already on Shortlist)</p>}
					<div>{renderFeature()}</div>
				</div>
			</label>
		</div>
	)
}

const ComparisonView = ({ programs, onBack, onAddToShortlist, activeClientPlan, allPrograms, onClose }) => {
	const features = ['Level of Care', 'Age Range', 'Program Length', 'Specialties'];
	const [selectedSubProgramIds, setSelectedSubProgramIds] = useState([]);

	const handleToggleSubProgram = (subProgram) => {
		setSelectedSubProgramIds(prev =>
			prev.includes(subProgram.id)
				? prev.filter(id => id !== subProgram.id)
				: [...prev, subProgram.id]
		);
	};
	
	const handleAddSelected = () => {
		const allSubPrograms = programs.flatMap(p => p.subPrograms);
		const selected = allSubPrograms.filter(sp => selectedSubProgramIds.includes(sp.id));
		onAddToShortlist(selected);
		onClose();
	};

	return (
		<div className="p-6 h-full flex flex-col bg-slate-100 dark:bg-slate-900/50">
			<div className="flex-shrink-0 mb-4 flex justify-between items-center">
				<button onClick={onBack} className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800">
					<ArrowLeft className="w-4 h-4 mr-2" />
					Back to Directory
				</button>
				<button 
					onClick={handleAddSelected}
					disabled={selectedSubProgramIds.length === 0}
					className="flex items-center px-4 py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
				>
					<PlusCircle className="w-5 h-5 mr-2" />
					Add Selected to Shortlist ({selectedSubProgramIds.length})
				</button>
			</div>
			<div className="flex-grow overflow-auto">
				<table className="min-w-full border-separate" style={{ borderSpacing: '0 1rem' }}>
					<thead className="sticky top-0 bg-slate-100 dark:bg-slate-900/50 z-10">
						<tr>
							<th className="p-2 text-left font-semibold w-1/5"></th>
							{programs.map(p => (
								<th key={p.id} className="p-2 text-left font-semibold">
									<div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md">
										<h3 className="text-lg font-bold">{p.name}</h3>
										<p className="text-sm text-slate-500">{p.location}</p>
									</div>
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{features.map(feature => (
							<tr key={feature}>
								<td className="p-2 align-top">
									<h4 className="font-semibold text-slate-600 dark:text-slate-300">{feature}</h4>
								</td>
								{programs.map(facility => (
									<td key={facility.id} className="p-2 align-top">
										<div className="space-y-4">
											{(facility.subPrograms || []).map(subProgram => (
												<SubProgramCompareCard 
													key={subProgram.id}
													subProgram={subProgram}
													feature={feature}
													isSelected={selectedSubProgramIds.includes(subProgram.id)}
													onToggle={handleToggleSubProgram}
													isAlreadyOnShortlist={activeClientPlan?.shortlist?.some(p => p.programId === subProgram.id)}
												/>
											))}
										</div>
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};


const AddNewClientModal = ({ onClose, onPlanAdded, userData, showNotification, isDemoMode }) => {
	const [formData, setFormData] = useState({
		clientId: '',
		therapist: '',
		estDischarge: '',
		dischargeLevel: '',
		program: '',
		currentOverallStatus: 'Planning Initiated',
		atRisk: false,
        status: 'Active',
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.clientId || !formData.program) {
			setError('Client Identifier and Program are required.');
			return;
		}
		setLoading(true);
		setError('');

		if (isDemoMode) {
			const newPlan = {
				id: `demo-${Date.now()}`,
				createdAt: Timestamp.now(),
				lastUpdated: Timestamp.now(),
				shortlist: [],
				planningProgress: { extensionScheduled: false, emailSent: false, aftercareThreadLaunched: false, initialOptionsVetted: false, familyReviewSession: false, connectingEmailsSent: false, finalProgramConfirmed: false, intakeDateSecured: false, warmHandoffCompleted: false, kipuUpdated: false },
				referent: { name: '', type: '', role: '', contactNeeded: false, lastContactDate: '', nextContactDate: '' },
				...formData
			};
			demoClientPlans.unshift(newPlan);
			showNotification(`Client plan for ${formData.clientId} created (Demo Mode).`, "success");
			setLoading(false);
			onPlanAdded();
			onClose();
			return;
		}

		try {
			const plansRef = collection(db, `organizations/${userData.organizationId}/clients`);
			await addDoc(plansRef, { ...formData, createdAt: Timestamp.now(), placementDate: null, shortlist: [], weeklyNotes: [], tasks: [], scheduledMeetings: [] });
			showNotification(`Client plan for ${formData.clientId} created.`, "success");
			onPlanAdded();
			onClose();
		} catch (err) {
			console.error("Error adding new client plan:", err);
			setError("Failed to create plan. Please try again.");
			showNotification("Failed to create plan.", "error");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
			<div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-lg max-h-full overflow-y-auto">
				<h2 className="text-2xl font-bold mb-4">Add New Client Plan</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<InputField label="Client Identifier (e.g., Kipu ID)" name="clientId" value={formData.clientId} onChange={handleChange} required />
					<div>
						<label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Program</label>
						<select name="program" value={formData.program} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
							<option value="">Select an Internal Program</option>
							<option value="The Cove">The Cove</option>
							<option value="The Harbor">The Harbor</option>
							<option value="The Willows">The Willows</option>
						</select>
					</div>
					<InputField label="Primary Therapist" name="therapist" value={formData.therapist} onChange={handleChange} />
					<InputField label="Estimated Discharge Date" name="estDischarge" type="date" value={formData.estDischarge} onChange={handleChange} />
					<InputField label="Discharge Level of Care" name="dischargeLevel" value={formData.dischargeLevel} onChange={handleChange} placeholder="e.g., PHP, IOP" />
					<div>
						<label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Initial Status</label>
						<select name="currentOverallStatus" value={formData.currentOverallStatus} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
							<option>Planning Initiated</option>
							<option>Options Vetted</option>
							<option>Presented to Family</option>
						</select>
					</div>
					{error && <p className="text-sm text-red-600">{error}</p>}
					<div className="flex justify-end space-x-3 pt-4">
						<button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500">Cancel</button>
						<button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400">
							{loading ? 'Creating...' : 'Create Plan'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

const AftercareSheetModal = ({ clientPlan, documentType, onClose, allPrograms }) => {
	const sheetRef = useRef();

	const handlePrint = () => {
		window.print();
	};

	const detailedShortlist = (clientPlan.shortlist || []).map(shortlistItem => {
		let fullProgram = null;
		for (const facility of allPrograms) {
			const sub = facility.subPrograms.find(sp => sp.id === shortlistItem.programId);
			if (sub) {
				fullProgram = { ...sub, facilityName: facility.name, location: facility.location };
				break;
			}
		}
		return {
			...shortlistItem,
			...fullProgram,
		};
	});

	return (
		<div className="fixed inset-0 bg-black bg-opacity-60 z-[100] flex justify-center items-center p-4 print:p-0 print:bg-white">
			<style>
				{`
					@media print {
						body * {
							visibility: hidden;
						}
						#printable-area, #printable-area * {
							visibility: visible;
						}
						#printable-area {
							position: absolute;
							left: 0;
							top: 0;
							width: 100%;
						}
						.no-print {
							display: none;
						}
					}
				`}
			</style>
			<div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col">
				<div className="flex justify-between items-center p-4 border-b dark:border-slate-700 no-print">
					<h2 className="text-xl font-bold text-slate-800 dark:text-white">Generated Aftercare {documentType}</h2>
					<div className="flex items-center space-x-2">
						<button onClick={handlePrint} className="flex items-center px-3 py-1.5 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
							<Printer className="w-4 h-4 mr-2" />
							Print/Save PDF
						</button>
						<button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
							<X size={24} />
						</button>
					</div>
				</div>
				<div id="printable-area" ref={sheetRef} className="p-8 overflow-y-auto bg-white text-black">
					<header className="flex justify-between items-end border-b-2 border-slate-600 pb-4">
						<div>
							<h1 className="text-4xl font-bold text-slate-800">Aftercare {documentType}</h1>
							<p className="text-lg text-slate-600 mt-1">Prepared for Client: <span className="font-semibold">{clientPlan.clientId}</span></p>
						</div>
						<div className="text-right">
							<svg className="h-10 w-auto text-blue-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 7L12 12L22 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 17L17 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 17L7 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
							<p className="text-sm font-bold text-blue-700">ClearHiveHQ</p>
						</div>
					</header>

					<main className="mt-8 space-y-10">
						{detailedShortlist.map(program => (
							<section key={program.programId} className="break-inside-avoid">
								<h3 className="text-2xl font-bold text-blue-700 border-b border-blue-200 pb-2 mb-4">{program.facilityName} - {program.name}</h3>
								<div className="grid grid-cols-3 gap-6">
									<div className="col-span-1">
										<div className="mt-4 bg-slate-50 p-3 rounded-md border border-slate-200">
											<h4 className="font-bold text-sm mb-2">Key Details</h4>
											<p className="text-xs"><strong>Location:</strong> {program.location}</p>
											<p className="text-xs"><strong>Program Type:</strong> {program.type}</p>
											<p className="text-xs"><strong>Ages:</strong> {program.ageRange?.min}-{program.ageRange?.max}</p>
											<p className="text-xs"><strong>Length:</strong> {program.programLengthMonths?.min}-{program.programLengthMonths?.max} months</p>
										</div>
									</div>
									<div className="col-span-2 space-y-4">
										<div>
											<h4 className="font-bold text-sm">Program Overview</h4>
											<p className="text-sm text-slate-700">{program.writeup}</p>
										</div>
										{program.notes && (
											<div className="bg-yellow-100 border-l-4 border-yellow-400 p-3 rounded">
												<h4 className="font-bold text-sm text-yellow-800">Notes for Family</h4>
												<p className="text-sm text-yellow-900">{program.notes}</p>
											</div>
										)}
									</div>
								</div>
							</section>
						))}
						{detailedShortlist.length === 0 && (
							<div className="text-center py-12">
								<p className="text-slate-500">
									No programs on the shortlist for this document.
								</p>
							</div>
						)}
					</main>
				</div>
			</div>
		</div>
	);
};

const ProgramDatabaseView = ({ userData, isDemoMode, showNotification, activeClientPlan, onAddToShortlist, isModalVersion = false, programsFromProp, onToggleCompare, comparisonList }) => {
	const [allPrograms, setAllPrograms] = useState(programsFromProp || []);
	const [loading, setLoading] = useState(!programsFromProp);
	const [selectedProgram, setSelectedProgram] = useState(null);
	const [viewMode, setViewMode] = useState('list');
	const [flyTo, setFlyTo] = useState(null);
	const [visibleCount, setVisibleCount] = useState(15);
	const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
	const [lastUpdated] = useState(Date.now() - 120000); // 2 minutes ago
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [isTransitioning, setIsTransitioning] = useState(false);

	// Smooth view mode transition
	const handleViewModeChange = (newMode) => {
		if (newMode === viewMode) return;
		
		setIsTransitioning(true);
		
		// Short delay for fade out
		setTimeout(() => {
			setViewMode(newMode);
			// Reset scroll position for list view
			if (newMode === 'list') {
				window.scrollTo({ top: 0, behavior: 'smooth' });
			}
		}, 150);
		
		// Complete transition
		setTimeout(() => {
			setIsTransitioning(false);
		}, 300);
	};

	const [filters, setFilters] = useState({
		searchTerm: '',
		state: 'All Locations',
		ageRange: { min: '', max: '' },
		programLength: 'Any Length',
		specialties: [],
	});

	// Radius search state
	const [radiusSearch, setRadiusSearch] = useState({
		center: null,
		radius: 50, // miles
		enabled: false
	});

	// Calculate distance between two coordinates in miles
	const calculateDistance = (lat1, lon1, lat2, lon2) => {
		const R = 3959; // Earth's radius in miles
		const dLat = (lat2 - lat1) * Math.PI / 180;
		const dLon = (lon2 - lon1) * Math.PI / 180;
		const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
			Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
			Math.sin(dLon/2) * Math.sin(dLon/2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
		return R * c;
	};

	const isLeafletLoaded = useLeaflet();

	const CLINICAL_SPECIALTIES = ["ASD", "Academic Issues", "Anxiety", "Assessment", "Behavioral Challenges", "Co-occurring Disorders", "DBT", "Depression", "Diagnostic Evaluation", "Exposure Therapy", "Extended Care", "Family Systems", "Family Therapy", "Gender-Specific (Male)", "Group Therapy", "IOP", "Learning Disorders", "Low Self-Worth", "Mental Health", "Mood Disorders", "OCD", "PHP", "Psychiatric Care", "Recovery-Supportive", "School Refusal", "Sober High School", "Sober Living", "Substance Use", "Support Groups", "Telehealth", "Transitional Living", "Trauma", "Treatment Planning", "Virtual IOP", "Wilderness Therapy"];

	const programStates = useMemo(() => [...new Set(providerDataSeed.map(p => p.location.split(', ')[1]).filter(Boolean))].sort(), []);

	const fetchPrograms = useCallback(async () => {
		if (isDemoMode) {
			setAllPrograms(providerDataSeed);
			setLoading(false);
			return;
		}
		if (!userData?.organizationId) return;
		setLoading(true);
		try {
			const programsRef = collection(db, `organizations/${userData.organizationId}/programs`);
			const querySnapshot = await getDocs(programsRef);
			if (querySnapshot.empty) {
				showNotification("Initializing program directory...", "info");
				const batch = writeBatch(db);
				providerDataSeed.forEach(program => {
					const programRef = doc(db, `organizations/${userData.organizationId}/programs`, program.id);
					batch.set(programRef, program);
				});
				await batch.commit();
				setAllPrograms(providerDataSeed);
				showNotification("Directory initialized successfully.", "success");
			} else {
				const programsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
				setAllPrograms(programsData);
			}
		} catch (err) {
			console.error("Error fetching programs:", err);
			showNotification("Error fetching program directory.", "error");
		} finally {
			setLoading(false);
		}
	}, [userData, isDemoMode, showNotification]);

	useEffect(() => {
		if (!isModalVersion) {
			fetchPrograms();
		}
	}, [fetchPrograms, isModalVersion]);

	const filteredPrograms = useMemo(() => {
		return allPrograms.filter(program => {
			const { searchTerm, state, ageRange, programLength, specialties } = filters;

			const searchTermMatch = !searchTerm || program.name.toLowerCase().includes(searchTerm.toLowerCase()) || program.location.toLowerCase().includes(searchTerm.toLowerCase());
			const stateMatch = state === 'All Locations' || program.location.split(', ')[1] === state;

			// Radius filtering
			const radiusMatch = !radiusSearch.enabled || !radiusSearch.center || !program.position || 
				calculateDistance(
					radiusSearch.center[0], radiusSearch.center[1], 
					program.position.lat, program.position.lng
				) <= radiusSearch.radius;

			const subProgramMatch = (program.subPrograms || []).some(sub => {
				const minAge = parseInt(ageRange.min, 10);
				const maxAge = parseInt(ageRange.max, 10);
				const ageMatch = (!minAge || sub.ageRange.max >= minAge) && (!maxAge || sub.ageRange.min <= maxAge);

				const lengthMatch = programLength === 'Any Length' || (() => {
					const [min, max] = programLength.split('-').map(Number);
					return !(sub.programLengthMonths.min > max || (sub.programLengthMonths.max < min && sub.programLengthMonths.max !== 99));
				})();

				const specialtyMatch = specialties.length === 0 || specialties.every(s => sub.specialties.includes(s));

				return ageMatch && lengthMatch && specialtyMatch;
			});

			return searchTermMatch && stateMatch && radiusMatch && subProgramMatch;
		}).sort((a, b) => a.name.localeCompare(b.name));
	}, [allPrograms, filters, radiusSearch]);

	const programsToShow = filteredPrograms.slice(0, visibleCount);

	const handleSpecialtyClick = (spec) => {
		setFilters(prev => {
			const newSpecialties = prev.specialties.includes(spec)
				? prev.specialties.filter(s => s !== spec)
				: [...prev.specialties, spec];
			return { ...prev, specialties: newSpecialties };
		});
	};

	const handleAddToShortlistClick = (subProgram) => {
		if (isModalVersion) {
			onAddToShortlist([subProgram])
		} else {
			// This is the main database view
			if (!activeClientPlan) {
				showNotification("Please select a client from the dashboard first to add programs to their shortlist.", "error");
				return;
			}
			onAddToShortlist([subProgram]);
		}
	}


	if (loading) return (
		<div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900">
			<div className="bg-white dark:bg-slate-800 shadow-sm border-b dark:border-slate-700 flex-shrink-0">
				<div className="px-6 py-4">
					<div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-48 mb-4 animate-pulse"></div>
					<div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-full animate-pulse"></div>
				</div>
			</div>
			<div className="flex-1 p-6">
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
					{[...Array(6)].map((_, i) => (
						<div key={i} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border dark:border-slate-700 overflow-hidden">
							<div className="h-32 bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
							<div className="p-4 space-y-3">
								<div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 animate-pulse"></div>
								<div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2 animate-pulse"></div>
								<div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4 animate-pulse"></div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);

	return (
		<div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900">
			{/* Modern Header */}
			<div className="bg-white dark:bg-slate-800 shadow-sm border-b dark:border-slate-700 flex-shrink-0">
				<div className="px-6 py-4">
					<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
						<div className="flex items-center justify-between">
							<h1 className="text-2xl font-bold text-slate-900 dark:text-white">Program Directory</h1>
						</div>
						<div className="flex items-center gap-3">
							<div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
								<Clock className="w-3 h-3" />
								<span>Updated 2m ago</span>
								{isTransitioning && (
									<div className="ml-2 flex items-center gap-1 text-blue-600 dark:text-blue-400">
										<div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse"></div>
										<span>Switching...</span>
									</div>
								)}
							</div>
							<div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
								<button
									onClick={() => handleViewModeChange('list')}
									disabled={isTransitioning}
									className={`px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium transform active:scale-95 ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''} ${viewMode === 'list' ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
								>
									List
								</button>
								<button
									onClick={() => handleViewModeChange('map')}
									disabled={isTransitioning}
									className={`px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium transform active:scale-95 ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''} ${viewMode === 'map' ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
								>
									Map
								</button>
							</div>
						</div>
					</div>

					{/* Search and Filters */}
					<div className="mt-4 flex flex-col lg:flex-row gap-3">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
							<input
								type="text"
								placeholder="Search name or location..."
								value={filters.searchTerm}
								onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
								className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
							/>
						</div>
						<button
							onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
							className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${showAdvancedFilters ? 'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-900/50 dark:border-blue-600 dark:text-blue-300' : 'border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
						>
							Advanced Filters
							<ChevronDown className={`w-4 h-4 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
						</button>
					</div>

					{/* Advanced Filters */}
					{showAdvancedFilters && (
						<div className="mt-3 bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
							<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
								<div>
									<label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">Age Range</label>
									<div className="flex gap-2">
										<input
											type="number"
											placeholder="Min"
											value={filters.ageRange.min}
											onChange={(e) => setFilters(prev => ({ ...prev, ageRange: { ...prev.ageRange, min: e.target.value } }))}
											className="flex-1 px-2 py-1.5 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-sm"
										/>
										<input
											type="number"
											placeholder="Max"
											value={filters.ageRange.max}
											onChange={(e) => setFilters(prev => ({ ...prev, ageRange: { ...prev.ageRange, max: e.target.value } }))}
											className="flex-1 px-2 py-1.5 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-sm"
										/>
									</div>
								</div>
								<div>
									<label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">Program Length</label>
									<select
										value={filters.programLength}
										onChange={(e) => setFilters(prev => ({ ...prev, programLength: e.target.value }))}
										className="w-full px-2 py-1.5 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-sm"
									>
										<option value="Any Length">Any Length</option>
										<option value="1-3">1-3 months</option>
										<option value="4-6">4-6 months</option>
										<option value="7-12">7-12 months</option>
										<option value="13-24">1-2 years</option>
									</select>
								</div>
								<div>
									<label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">Clear Filters</label>
									<button
										onClick={() => setFilters({ searchTerm: '', state: 'All Locations', ageRange: { min: '', max: '' }, programLength: 'Any Length', specialties: [] })}
										className="w-full px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-200 dark:hover:bg-slate-600 text-sm"
									>
										Reset All
									</button>
								</div>
							</div>
							
							{/* Compact Specialties Filter */}
							<div>
								<label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">Clinical Specialties</label>
								<div className="grid grid-cols-3 lg:grid-cols-6 gap-1 max-h-24 overflow-y-auto">
									{CLINICAL_SPECIALTIES.slice(0, 18).map(specialty => (
										<button
											key={specialty}
											onClick={() => handleSpecialtyClick(specialty)}
											className={`px-2 py-1 text-xs rounded border transition-colors ${
												filters.specialties.includes(specialty)
													? 'bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-200'
													: 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-600'
											}`}
										>
											{specialty}
										</button>
									))}
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Program Content */}
			<div className={`flex-1 ${viewMode === 'map' ? 'overflow-hidden min-h-0' : 'overflow-auto'} transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
				{viewMode === 'list' ? (
					/* Card-based Layout like in screenshots */
					<div className="p-6 overflow-auto">
						<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
							{programsToShow.map((program, index) => (
								<div 
									key={program.id} 
									className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border dark:border-slate-700 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group ${!isTransitioning ? 'animate-fadeInUp' : ''}`}
									style={{ 
										animationDelay: isTransitioning ? '0ms' : `${index * 50}ms`,
										animationFillMode: 'both'
									}}
									onClick={() => setSelectedProgram(program)}
								>
									{/* Program Image Placeholder */}
									<div className="h-40 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center relative overflow-hidden">
										<div className="text-slate-400 dark:text-slate-500 text-xs relative z-10">
											{program.images && program.images.length > 0 ? (
												<img src={program.images[0]} alt={program.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
											) : (
												<div className="flex flex-col items-center gap-2">
													<Building className="w-8 h-8" />
													<span>No Image Available</span>
												</div>
											)}
										</div>
									</div>
									{/* Program Info */}
									<div className="p-6">
										<h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
											{program.name}
										</h3>
										<p className="text-slate-600 dark:text-slate-400 text-sm mb-3 flex items-center gap-2">
											<MapPin className="w-4 h-4 flex-shrink-0 text-blue-600" />
											{program.location}
										</p>
										<div className="flex items-center justify-between mb-3">
											<div className="text-blue-600 dark:text-blue-400 text-sm font-medium">
												{program.subPrograms?.length || 0} Program{program.subPrograms?.length !== 1 ? 's' : ''} Offered
											</div>
											<div className="text-sm text-slate-500">
												{program.subPrograms?.length || 0}/10
											</div>
										</div>
										{/* Specialties Preview */}
										<div className="flex flex-wrap gap-1">
											{[...new Set(program.subPrograms?.flatMap(sp => sp.specialties) || [])].slice(0, 2).map(specialty => (
												<span key={specialty} className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs">
													{specialty}
												</span>
											))}
											{[...new Set(program.subPrograms?.flatMap(sp => sp.specialties) || [])].length > 2 && (
												<span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full text-xs">
													+{[...new Set(program.subPrograms?.flatMap(sp => sp.specialties) || [])].length - 2} more
												</span>
											)}
										</div>
									</div>
								</div>
							))}
						</div>

						{/* Load More - only show in list view */}
						{visibleCount < filteredPrograms.length && (
							<div className="col-span-full flex justify-center pt-8">
								<button
									onClick={() => setVisibleCount(prev => prev + 15)}
									className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
								>
									<BarChart3 className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
									Load More Programs
									<span className="px-2 py-1 bg-white/20 rounded-full text-sm">
										{filteredPrograms.length - visibleCount} remaining
									</span>
								</button>
							</div>
						)}

						{filteredPrograms.length === 0 && (
							<div className="col-span-full">
								<div className="flex flex-col items-center justify-center py-16 px-4">
									<div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center mb-6 shadow-lg">
										<Database className="w-10 h-10 text-slate-400 dark:text-slate-500" />
									</div>
									<h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">No programs found</h3>
									<p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-md mb-6 leading-relaxed">
										We couldn't find any programs matching your current search criteria. Try adjusting your filters or search terms to discover relevant treatment programs.
									</p>
									<button
										onClick={() => setFilters({ searchTerm: '', state: 'All Locations', ageRange: { min: '', max: '' }, programLength: 'Any Length', specialties: [] })}
										className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
									>
										Clear All Filters
									</button>
								</div>
							</div>
						)}
					</div>
				) : viewMode === 'map' ? (
					/* Interactive Map View */
					<div className={`h-full w-full relative ${!isTransitioning ? 'animate-fadeIn' : ''}`}>
						{/* Map Controls */}
						<div className={`absolute top-4 right-4 z-[1000] bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 w-80 max-h-[80vh] overflow-y-auto ${!isTransitioning ? 'animate-slideInFromRight' : ''}`}>
							<h3 className="font-semibold text-slate-900 dark:text-white mb-3">Radius Search</h3>
							<div className="space-y-3">
								<div className="flex items-center gap-2">
									<input
										type="checkbox"
										id="enableRadius"
										checked={radiusSearch.enabled}
										onChange={(e) => setRadiusSearch(prev => ({ ...prev, enabled: e.target.checked }))}
										className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
									/>
									<label htmlFor="enableRadius" className="text-sm text-slate-700 dark:text-slate-300">
										Enable radius search
									</label>
								</div>
								{radiusSearch.enabled && (
									<>
										<div>
											<label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
												Search Radius: {radiusSearch.radius} miles
											</label>
											<div className="relative">
												<input
													type="range"
													min="10"
													max="200"
													step="5"
													value={radiusSearch.radius}
													onChange={(e) => setRadiusSearch(prev => ({ ...prev, radius: parseInt(e.target.value) }))}
													className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
													style={{
														background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((radiusSearch.radius - 10) / 190) * 100}%, #e2e8f0 ${((radiusSearch.radius - 10) / 190) * 100}%, #e2e8f0 100%)`
													}}
												/>
												<div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
													<span>10 mi</span>
													<span>200 mi</span>
												</div>
											</div>
										</div>
										<div className="text-xs text-slate-600 dark:text-slate-400 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
											{radiusSearch.center ? (
												<>📍 Click map to change search center</>
											) : (
												<>📍 Click map to set search center</>
											)}
										</div>
									</>
								)}
								<div className="text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-700">
									Showing {filteredPrograms.length} programs
								</div>
							</div>
						</div>

						{/* Map Container - Fixed height */}
						<div className="w-full h-full">
							<MapContainer
								center={[39.8283, -98.5795]} // Center of US
								zoom={4}
								className="h-full w-full"
								zoomControl={true}
								scrollWheelZoom={true}
							>
								<TileLayer
									url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
									attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
								/>
								
								{/* Radius Search Component */}
								<RadiusSearch 
									center={radiusSearch.center}
									radius={radiusSearch.radius}
									onRadiusChange={(radius) => setRadiusSearch(prev => ({ ...prev, radius }))}
									onCenterChange={(center) => setRadiusSearch(prev => ({ ...prev, center }))}
								/>

								{/* Program Markers */}
								{filteredPrograms.map(program => (
									program.position && (
										<Marker
											key={program.id}
											position={[program.position.lat, program.position.lng]}
											icon={programIcon}
										>
											<Popup className="custom-popup">
												<div className="p-2 min-w-[250px]">
													<h3 className="font-semibold text-slate-900 mb-1">{program.name}</h3>
													<p className="text-sm text-slate-600 mb-2 flex items-center gap-1">
														<MapPin className="w-3 h-3" />
														{program.location}
													</p>
													<div className="text-xs text-slate-500 mb-2">
														{program.subPrograms?.length || 0} program{program.subPrograms?.length !== 1 ? 's' : ''} available
													</div>
													<div className="flex flex-wrap gap-1 mb-2">
														{[...new Set(program.subPrograms?.flatMap(sp => sp.specialties) || [])].slice(0, 3).map(specialty => (
															<span key={specialty} className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
																{specialty}
															</span>
														))}
													</div>
													<button
														onClick={() => setSelectedProgram(program)}
														className="w-full px-2 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
													>
														View Details
													</button>
												</div>
											</Popup>
										</Marker>
									)
								))}
							</MapContainer>
						</div>
					</div>
				) : null}
			</div>

			{/* Enhanced Program Detail Modal */}
			{selectedProgram && (
				<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
					<div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
						{/* Modal Header */}
						<div className="bg-slate-50 dark:bg-slate-700 px-6 py-4 border-b dark:border-slate-600">
							<div className="flex justify-between items-start">
								<div>
									<h2 className="text-xl font-bold text-slate-900 dark:text-white">{selectedProgram.name}</h2>
									<p className="text-slate-600 dark:text-slate-400 flex items-center gap-1 text-sm">
										<MapPin className="w-4 h-4" />
										{selectedProgram.location}
									</p>
								</div>
								<button
									onClick={() => setSelectedProgram(null)}
									className="p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full transition-colors"
								>
									<X className="w-5 h-5" />
								</button>
							</div>
						</div>

						{/* Modal Content */}
						<div className="overflow-y-auto max-h-[calc(90vh-120px)]">
							<div className="p-6 space-y-4">
								{selectedProgram.subPrograms?.map(subProgram => (
									<div key={subProgram.id} className="border dark:border-slate-600 rounded-lg p-4 bg-slate-50 dark:bg-slate-700/30">
										<div className="flex items-center gap-2 mb-3">
											<h3 className="text-lg font-semibold text-slate-900 dark:text-white">
												{subProgram.name}
											</h3>
											<span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded text-sm">
												{subProgram.type}
											</span>
										</div>
										<p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">{subProgram.writeup}</p>
										
										<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
											<div className="space-y-2">
												<h4 className="font-medium text-slate-900 dark:text-white text-sm">Program Details</h4>
												<div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
													<p><span className="font-medium">Age Range:</span> {subProgram.ageRange.min}-{subProgram.ageRange.max} years</p>
													<p><span className="font-medium">Duration:</span> {subProgram.programLengthMonths.min}-{subProgram.programLengthMonths.max} months</p>
												</div>
											</div>
											<div className="space-y-2">
												<h4 className="font-medium text-slate-900 dark:text-white text-sm">Contact Information</h4>
												<div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
													{subProgram.contacts?.map((contact, idx) => (
														<div key={idx}>
															<p className="font-medium">{contact.name}</p>
															{contact.phone && <p>📞 {contact.phone}</p>}
															{contact.email && <p>✉️ {contact.email}</p>}
														</div>
													))}
												</div>
											</div>
										</div>

										<div className="mb-4">
											<h4 className="font-medium text-slate-900 dark:text-white mb-2 text-sm">Clinical Specialties</h4>
											<div className="flex flex-wrap gap-1">
												{subProgram.specialties.map(specialty => (
													<span key={specialty} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded text-sm">
														{specialty}
													</span>
												))}
											</div>
										</div>

										{activeClientPlan && (
											<button
												onClick={() => {
													handleAddToShortlistClick(subProgram);
													setSelectedProgram(null);
												}}
												className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium"
											>
												<PlusCircle className="w-4 h-4" />
												Add to Shortlist
											</button>
										)}
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			)}

		</div>
	);
};


// --- UPDATED: AdminView Component with Program Editing ---
const AdminView = ({ userData, showNotification, isDemoMode, onUpdateLogo, currentLogo, onUpdateTheme, currentTheme }) => {
	const [users, setUsers] = useState([]);
	const [programs, setPrograms] = useState([]);
	const [loading, setLoading] = useState(true);
	const [isManageModalOpen, setIsManageModalOpen] = useState(false);

	const fetchAdminData = useCallback(async () => {
		setLoading(true);
		if (isDemoMode) {
			setUsers(USER_ROLES.map((role, i) => ({ id: `dev-user-${i}`, email: `${role.replace(' ','').toLowerCase()}@clearhive.dev`, role: role })));
			setPrograms(providerDataSeed);
			setLoading(false);
			return;
		}

		if (!userData?.organizationId) return;
		try {
			const usersRef = collection(db, "users");
			const userQuery = query(usersRef, where("organizationId", "==", userData.organizationId));
			const userSnapshot = await getDocs(userQuery);
			const usersData = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
			setUsers(usersData);

			const programsRef = collection(db, `organizations/${userData.organizationId}/programs`);
			const programSnapshot = await getDocs(programsRef);
			const programsData = programSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
			setPrograms(programsData);

		} catch (error) {
			console.error("Error fetching admin data:", error);
			showNotification("Failed to fetch admin data.", "error");
		} finally {
			setLoading(false);
		}
	}, [userData, showNotification, isDemoMode]);

	useEffect(() => {
		fetchAdminData();
	}, [fetchAdminData]);

	const handleRoleChange = async (userId, newRole) => {
		setUsers(currentUsers => currentUsers.map(user => user.id === userId ? { ...user, role: newRole } : user));
		if (isDemoMode) {
			showNotification("Role changed (Demo Mode).", "success");
			return;
		}
		try {
			const userRef = doc(db, "users", userId);
			await updateDoc(userRef, { role: newRole });
			showNotification("User role updated successfully.", "success");
		} catch (error) {
			console.error("Error updating user role:", error);
			showNotification("Failed to update role.", "error");
			fetchAdminData(); // Revert
		}
	};

	if (loading) {
		return <div className="flex justify-center items-center h-64"><Loader className="w-8 h-8 animate-spin" /></div>;
	}

	return (
		<div className="space-y-8">
			<h1 className="text-3xl font-bold">Admin Panel</h1>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				<div className="bg-white dark:bg-slate-800 shadow-md rounded-lg p-6">
					<h2 className="text-xl font-semibold mb-4 flex items-center"><Wand2 className="w-5 h-5 mr-2 text-blue-500"/> AI & Content Management</h2>
					<button onClick={() => setIsManageModalOpen(true)} className="flex items-center px-4 py-2 font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700">
						<Building className="w-5 h-5 mr-2" />
						Manage Programs & Logo
					</button>
				</div>
				<div className="bg-white dark:bg-slate-800 shadow-md rounded-lg p-6">
					<h2 className="text-xl font-semibold mb-4 flex items-center"><Palette className="w-5 h-5 mr-2 text-blue-500"/> Branding & Customization</h2>
					<ManageLogo currentLogo={currentLogo} onUpdateLogo={onUpdateLogo} showNotification={showNotification} />
					<div className="mt-4">
						<label htmlFor="themeColor" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Theme Color</label>
						<input type="color" id="themeColor" value={currentTheme} onChange={(e) => onUpdateTheme(e.target.value)} className="mt-1 w-full h-10 p-1 border border-slate-300 dark:border-slate-600 rounded-md cursor-pointer" />
					</div>
				</div>
			</div>


			{isManageModalOpen && <ManageProgramsModal programs={programs} setPrograms={setPrograms} onClose={() => setIsManageModalOpen(false)} userData={userData} isDemoMode={isDemoMode} showNotification={showNotification} onUpdateLogo={onUpdateLogo} currentLogo={currentLogo} />}

			<div className="bg-white dark:bg-slate-800 shadow-md rounded-lg overflow-hidden">
				<div className="p-6">
					<h2 className="text-xl font-semibold">Users in {userData.organizationId.replace('org_', '').replace(/_/g, ' ')}</h2>
				</div>
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
						<thead className="bg-slate-50 dark:bg-slate-700">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">User Email</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Role</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">User ID</th>
							</tr>
						</thead>
						<tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
							{users.map(user => (
								<tr key={user.id}>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">{user.email}</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
										<select
											value={user.role}
											onChange={(e) => handleRoleChange(user.id, e.target.value)}
											className="w-full p-1 border rounded-md dark:bg-slate-700 dark:border-slate-600"
											disabled={user.id === userData.uid}
										>
											{USER_ROLES.map(role => (
												<option key={role} value={role}>{role}</option>
											))}
										</select>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 font-mono">{user.uid}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

const ManageProgramsModal = ({ programs, setPrograms, onClose, userData, isDemoMode, showNotification, onUpdateLogo, currentLogo }) => {
	const [activeTab, setActiveTab] = useState('edit');
	const [selectedProgramToEdit, setSelectedProgramToEdit] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');

	const handleProgramUpdate = async (updatedProgram) => {
		setPrograms(prev => prev.map(p => p.id === updatedProgram.id ? updatedProgram : p));
		setSelectedProgramToEdit(updatedProgram);
		if (isDemoMode) {
			showNotification("Program updated (Demo Mode).", "success");
			return;
		}
		const programRef = doc(db, `organizations/${userData.organizationId}/programs`, updatedProgram.id);
		try {
			await setDoc(programRef, updatedProgram, { merge: true });
			showNotification("Program updated successfully!", "success");
		} catch (error) {
			console.error("Error updating program:", error);
			showNotification("Failed to update program.", "error");
		}
	};

	const TabButton = ({ tabKey, children }) => (
		<button
			onClick={() => {
				setActiveTab(tabKey);
				setSelectedProgramToEdit(null);
			}}
			className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === tabKey ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
		>
			{children}
		</button>
	);

	const filteredPrograms = programs.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 animate-fade-in">
			<div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] flex flex-col animate-scale-in">
				<div className="flex justify-between items-center mb-4 flex-shrink-0">
					<h2 className="text-2xl font-bold">Manage Content</h2>
					<button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"><X size={24} /></button>
				</div>

				<div className="border-b dark:border-slate-700 mb-4 flex-shrink-0">
					<nav className="flex space-x-2">
						<TabButton tabKey="edit">Edit Existing Program</TabButton>
						<TabButton tabKey="add">Add New Program</TabButton>
					</nav>
				</div>

				<div className="overflow-y-auto flex-grow">
					{activeTab === 'edit' && (
						<>
							{selectedProgramToEdit ? (
								<ProgramEditor
									program={selectedProgramToEdit}
									onUpdate={handleProgramUpdate}
									onCancel={() => setSelectedProgramToEdit(null)}
                                    showNotification={showNotification}
								/>
							) : (
								<div className="space-y-4">
									<InputField
										label="Search Programs"
										name="search"
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										placeholder="Type to find a program..."
									/>
									<ul className="space-y-2">
										{filteredPrograms.map(p => (
											<li key={p.id} className="flex justify-between items-center p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700">
												<span>{p.name}</span>
												<button onClick={() => setSelectedProgramToEdit(p)} className="flex items-center px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-100 dark:bg-blue-900/50 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900">
													<Edit className="w-4 h-4 mr-2" />
													Edit
												</button>
											</li>
										))}
									</ul>
								</div>
							)}
						</>
					)}
					{activeTab === 'add' && <AddNewProgramView showNotification={showNotification} />}
				</div>
			</div>
		</div>
	);
};

const AddNewProgramView = ({ showNotification }) => {
	const [url, setUrl] = useState('');
	const [isFetching, setIsFetching] = useState(false);
	const [programData, setProgramData] = useState(null);

	const handleFetchProgramInfo = async () => {
		if (!url) return;
		setIsFetching(true);
		setProgramData(null);
        showNotification("AI is scraping the website. This may take a moment...", "info");

		const prompt = `You are a data extraction assistant. Scrape the website at the URL "${url}" and return a JSON object with the following schema. Find the most relevant information on the page for each field. For 'specialties', list clinical issues or conditions treated. For 'images', find a URL for the company's logo if possible.

		Schema:
		{
			"name": "string",
			"writeup": "string",
			"images": ["string"],
			"location": "string (City, ST)",
			"contacts": [{ "name": "string", "title": "string", "phone": "string", "email": "string" }],
			"ageRange": { "min": "number", "max": "number" },
			"programLengthMonths": { "min": "number", "max": "number" },
			"specialties": ["string"]
		}`;

		try {
			let chatHistory = [];
			chatHistory.push({ role: "user", parts: [{ text: prompt }] });
			const payload = { contents: chatHistory };
			const apiKey = "" // If you want to use models other than gemini-2.0-flash or imagen-3.0-generate-002, provide an API key here. Otherwise, leave this as-is.
			const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

			const response = await fetch(apiUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});

			if (!response.ok) {
				throw new Error(`API request failed with status ${response.status}`);
			}

			const result = await response.json();

			if (result.candidates && result.candidates.length > 0 &&
				result.candidates[0].content && result.candidates[0].content.parts &&
				result.candidates[0].content.parts.length > 0) {

				let text = result.candidates[0].content.parts[0].text;
				text = text.replace(/```json/g, '').replace(/```/g, '').trim();
				const parsedJson = JSON.parse(text);
				setProgramData(parsedJson);
                showNotification("Program data fetched successfully!", "success");
			} else {
				throw new Error("Invalid response structure from API");
			}
		} catch (error) {
			console.error("Error fetching or parsing program info:", error);
            showNotification("Failed to fetch data. Check URL or try again.", "error");
		} finally {
			setIsFetching(false);
		}
	};

	return (
		<div className="p-4 space-y-4">
			<h3 className="text-xl font-semibold">Add New Program via URL</h3>
			<p className="text-sm text-slate-500">Enter a program's website URL to automatically fetch its information using AI.</p>
			<div className="flex items-center gap-2">
				<InputField label="Program Website URL" name="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://exampleprogram.com" />
				<button onClick={handleFetchProgramInfo} disabled={isFetching} className="mt-6 flex items-center px-4 py-2 font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 disabled:bg-blue-400">
					{isFetching ? <Loader className="w-5 h-5 animate-spin mr-2" /> : <Wand2 className="w-5 h-5 mr-2" />}
					{isFetching ? 'Fetching...' : 'Fetch Info'}
				</button>
			</div>
			{programData && (
				<div className="mt-4">
					<ProgramEditor program={programData} onUpdate={() => {}} onCancel={() => setProgramData(null)} showNotification={showNotification} />
				</div>
			)}
		</div>
	);
};


const ManageLogo = ({ currentLogo, onUpdateLogo, showNotification }) => {
	const [newLogoUrl, setNewLogoUrl] = useState(currentLogo);

	const handleUpdate = () => {
		onUpdateLogo(newLogoUrl);
		showNotification("Logo updated successfully!", "success");
	};

	return (
		<div className="space-y-4">
			<h4 className="text-lg font-semibold">Application Logo</h4>
			<InputField label="New Logo Image URL:" name="logoUrl" value={newLogoUrl} onChange={(e) => setNewLogoUrl(e.target.value)} />
			<div>
				<p className="text-sm font-medium text-slate-700 dark:text-slate-300">Current Logo Preview:</p>
				<div className="mt-2 p-4 border rounded-md dark:border-slate-600 inline-block">
					<img src={currentLogo} alt="Current Logo" className="h-10 w-auto" />
				</div>
			</div>
			<div className="flex justify-end">
				<button onClick={handleUpdate} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
					Update Logo
				</button>
			</div>
		</div>
	);
};


// --- ProgramEditor Component ---
const ProgramEditor = ({ program, onUpdate, onCancel, showNotification }) => {
	const [editData, setEditData] = useState(program);
    const [isGenerating, setIsGenerating] = useState(false);

	useEffect(() => {
		setEditData(program);
	}, [program]);

	const handleInputChange = (e) => {
		const { name, value, type, checked } = e.target;
		setEditData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
	};

	const handleImageChange = (index, value) => {
		const newImages = [...(editData.images || [])];
		newImages[index] = value;
		setEditData(prev => ({ ...prev, images: newImages }));
	};

	const addImageField = () => {
		setEditData(prev => ({ ...prev, images: [...(prev.images || []), ''] }));
	};

	const removeImageField = (index) => {
		const newImages = [...editData.images];
		newImages.splice(index, 1);
		setEditData(prev => ({ ...prev, images: newImages }));
	};

    const handleGenerateWriteup = async () => {
        setIsGenerating(true);
        showNotification("AI is generating a new program write-up...", "info");
        const prompt = `Based on the following program details, write a compelling, professional, and concise program overview (write-up) of about 2-3 sentences. 
        Program Name: ${editData.name}
        Location: ${editData.location}
        Specialties: ${editData.specialties.join(', ')}
        Age Range: ${editData.ageRange.min}-${editData.ageRange.max}
        Level of Care: ${editData.type || 'Not specified'}
        
        Focus on the key benefits and target audience.`;

        try {
			let chatHistory = [];
			chatHistory.push({ role: "user", parts: [{ text: prompt }] });
			const payload = { contents: chatHistory };
			const apiKey = "" // If you want to use models other than gemini-2.0-flash or imagen-3.0-generate-002, provide an API key here. Otherwise, leave this as-is.
			const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

			const response = await fetch(apiUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});
            const result = await response.json();
            if (result.candidates && result.candidates[0]?.content?.parts[0]?.text) {
                const newWriteup = result.candidates[0].content.parts[0].text;
                setEditData(prev => ({...prev, writeup: newWriteup}));
                showNotification("AI-generated write-up has been added.", "success");
            } else {
                throw new Error("Invalid AI response.");
            }
        } catch (error) {
            console.error("Error generating write-up:", error);
            showNotification("Failed to generate write-up.", "error");
        } finally {
            setIsGenerating(false);
        }
    };

	const handleSave = () => {
		onUpdate(editData);
	};

	return (
		<div className="space-y-4 border-t pt-4 mt-4 dark:border-slate-700">
			<div>
				<label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Program Name</label>
				<input type="text" name="name" value={editData.name} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm" />
			</div>
			<div>
				<div className="flex justify-between items-center">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Program Overview</label>
                    <button onClick={handleGenerateWriteup} disabled={isGenerating} className="flex items-center text-xs font-semibold text-blue-600 hover:text-blue-800 disabled:opacity-50">
                        {isGenerating ? <Loader className="w-4 h-4 mr-1 animate-spin" /> : <Wand2 className="w-4 h-4 mr-1" />}
                        {isGenerating ? 'Generating...' : 'Generate with AI'}
                    </button>
                </div>
				<textarea name="writeup" value={editData.writeup} onChange={handleInputChange} rows="5" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm" />
			</div>
			<div className="space-y-2 rounded-lg border border-red-300 dark:border-red-700 p-4 bg-red-50 dark:bg-red-900/20">
				<label className="flex items-center space-x-3 cursor-pointer">
					<input type="checkbox" name="isFlagged" checked={!!editData.isFlagged} onChange={handleInputChange} className="h-5 w-5 rounded text-red-600 focus:ring-red-500" />
					<span className="font-semibold text-red-800 dark:text-red-200">Flag Program</span>
				</label>
				{editData.isFlagged && (
					<div className="pt-2">
						<label className="block text-sm font-medium text-red-700 dark:text-red-300">Reason for Flag</label>
						<textarea name="flaggerReason" value={editData.flaggerReason || ''} onChange={handleInputChange} rows="3" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-red-300 dark:border-red-600 rounded-md shadow-sm" placeholder="e.g., Abruptly closed, safety concerns reported..."></textarea>
					</div>
				)}
			</div>
			<div>
				<h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Images (URLs)</h4>
				<div className="space-y-2">
					{(editData.images || []).map((imgUrl, idx) => (
						<div key={idx} className="flex items-center space-x-2">
							<input type="text" value={imgUrl} onChange={(e) => handleImageChange(idx, e.target.value)} className="flex-grow px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm" placeholder={`Image URL ${idx + 1}`} />
							<button onClick={() => removeImageField(idx)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full"><ImageOff className="w-5 h-5" /></button>
						</div>
					))}
				</div>
				<button onClick={addImageField} className="mt-2 flex items-center px-3 py-1.5 text-sm font-semibold text-blue-600 bg-blue-100 dark:bg-blue-900/50 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900">
					<ImagePlus className="w-4 h-4 mr-2" /> Add Image URL
				</button>
			</div>
			<div className="flex justify-end space-x-3 pt-4">
				<button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500">Cancel</button>
				<button type="button" onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
					<Save className="inline w-4 h-4 mr-2" /> Save Changes
				</button>
			</div>
		</div>
	);
};


// --- SettingsView Component (Original Definition) ---
const SettingsView = ({userData, showNotification}) => {
	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
	const [activeTab, setActiveTab] = useState('general');
	
	// Demo user state for testing role-based access
	const [currentDemoUser, setCurrentDemoUser] = useState(demoUsers.platformAdmin);
	const [currentOrganization, setCurrentOrganization] = useState(demoOrganizations['clearhive-platform']);

	// Handle demo user changes
	const handleDemoUserChange = (newUser) => {
		setCurrentDemoUser(newUser);
		// Update organization based on user
		const orgId = newUser.organizationId;
		setCurrentOrganization(demoOrganizations[orgId] || demoOrganizations['customer-123']);
	};

	const handleSeedDatabase = async () => {
		setIsConfirmModalOpen(false);
		if (!userData?.organizationId) {
			showNotification("Organization ID not found. Cannot seed database.", "error");
			return;
		}

		showNotification("Seeding database... This may take a moment.", "info");
		const batch = writeBatch(db);

		providerDataSeed.forEach(program => {
			const programRef = doc(db, `organizations/${userData.organizationId}/programs`, program.id);
			batch.set(programRef, program);
		});

		try {
			await batch.commit();
			showNotification("Database seeded successfully!", "success");
		} catch (e) {
			console.error("Error seeding database: ", e);
			showNotification("Error seeding database. Check console.", "error");
		}
	};

	const tabs = [
		{ id: 'general', label: 'General', icon: Settings },
		{ id: 'admin', label: 'Admin Features', icon: ShieldCheck }
	];

	return (
		<div>
			<h1 className="text-3xl font-bold">Settings</h1>
			<p className="mt-2 text-slate-600 dark:text-slate-400">Configure your organization and application settings.</p>
			
			{/* Tabs */}
			<div className="flex border-b border-slate-200 dark:border-slate-700 mt-6 mb-6">
				{tabs.map(tab => {
					const Icon = tab.icon;
					return (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`flex items-center gap-2 px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
								activeTab === tab.id
									? 'border-blue-600 text-blue-600'
									: 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
							}`}
						>
							<Icon className="w-4 h-4" />
							{tab.label}
						</button>
					);
				})}
			</div>

			{/* Tab Content */}
			{activeTab === 'general' && (
				<div className="mt-8 p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md">
					<h2 className="text-xl font-semibold">Database Management</h2>
					<p className="mt-2 text-slate-600 dark:text-slate-400">
						Use this button to populate or update your program directory from the application's master list. This includes the necessary geolocation data for the map view.
					</p>
					<button
						onClick={() => setIsConfirmModalOpen(true)}
						className="mt-4 px-4 py-2 font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
					>
						Force Re-Seed Program Database
					</button>
				</div>
			)}

			{activeTab === 'admin' && (
				<div>
					<RoleSwitcher 
						currentUser={currentDemoUser}
						onUserChange={handleDemoUserChange}
						availableUsers={demoUsers}
					/>
					<AdminSettings 
						userData={currentDemoUser}
						organization={currentOrganization}
						onConfigChange={(config) => {
							showNotification("Feature configuration updated!", "success");
							console.log('New config:', config);
						}} 
					/>
				</div>
			)}

			<ConfirmationModal
				isOpen={isConfirmModalOpen}
				onClose={() => setIsConfirmModalOpen(false)}
				onConfirm={handleSeedDatabase}
				title="Re-Seed Database?"
			>
				<p>Are you sure you want to proceed? This will overwrite all existing programs in your directory with the latest data from the application code. This action cannot be undone.</p>
			</ConfirmationModal>
		</div>
	);
};

// --- App Component (Root) ---
export default function App() {
	const [user, setUser] = useState(null);
	const [userData, setUserData] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (DEV_MODE) {
			setUser({ uid: 'dev-user-01' });
			setUserData(mockUserData);
			setLoading(false);
			return;
		}

		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user) {
				const userRef = doc(db, "users", user.uid);
				const docSnap = await getDoc(userRef);
				if (docSnap.exists()) {
					setUserData(docSnap.data());
				} else {
					console.log("No such user document!");
				}
				setUser(user);
			} else {
				setUser(null);
				setUserData(null);
			}
			setLoading(false);
		});
		return () => unsubscribe();
	}, []);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
			</div>
		);
	}

	return user ? <MainApp user={user} userData={userData} /> : <Auth onLogin={setUser} />;
}
