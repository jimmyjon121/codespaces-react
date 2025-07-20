// --- CLINICAL STAFF DATA ---
export const clinicalStaffData = {
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
export const assignClientToClinician = (clientId, programId) => {
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
