// HIPAA-Compliant Recommendation Engine
// Uses rule-based matching with anonymized metadata only

export class HIPAARecommendationEngine {
  constructor() {
    // No external AI services - all processing local/on-premises
    this.matchingRules = {
      geographic: {
        sameState: 30,
        within100Miles: 20,
        within200Miles: 10,
        sameRegion: 5
      },
      clinical: {
        primarySpecialtyMatch: 25,
        secondarySpecialtyMatch: 15,
        generalMatch: 5
      },
      outcomes: {
        successRateMultiplier: 0.3,
        avgLengthOfStayBonus: 10
      },
      availability: {
        immediate: 25,
        within2Weeks: 15,
        within1Month: 10
      }
    };
  }

  // ✅ SAFE: Only uses anonymized metadata
  generateRecommendations(anonymizedProfile, programs) {
    const scored = programs.map(program => ({
      program,
      score: this.calculateScore(program, anonymizedProfile),
      reasons: this.generateReasons(program, anonymizedProfile)
    }));

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(item => ({
        ...item,
        confidenceLevel: this.getConfidenceLevel(item.score)
      }));
  }

  calculateScore(program, profile) {
    let score = 0;

    // Geographic scoring (no actual addresses)
    score += this.scoreGeographic(program, profile);
    
    // Clinical fit (treatment categories only)
    score += this.scoreClinical(program, profile);
    
    // Historical outcomes (anonymized)
    score += this.scoreOutcomes(program, profile);
    
    // Availability
    score += this.scoreAvailability(program, profile);

    return Math.min(score, 100);
  }

  scoreGeographic(program, profile) {
    const rules = this.matchingRules.geographic;
    
    if (program.state === profile.preferredState) {
      return rules.sameState;
    }
    
    if (program.region === profile.region) {
      return rules.sameRegion;
    }
    
    // Distance calculation without exact addresses
    const distance = this.calculateRegionalDistance(program.region, profile.region);
    if (distance < 100) return rules.within100Miles;
    if (distance < 200) return rules.within200Miles;
    
    return 0;
  }

  scoreClinical(program, profile) {
    const rules = this.matchingRules.clinical;
    let score = 0;
    
    // Primary need match
    if (program.primarySpecialties.some(s => 
      profile.primaryNeeds.includes(s)
    )) {
      score += rules.primarySpecialtyMatch;
    }
    
    // Secondary needs
    const secondaryMatches = program.secondarySpecialties.filter(s => 
      profile.secondaryNeeds?.includes(s)
    ).length;
    score += secondaryMatches * rules.secondarySpecialtyMatch;
    
    return score;
  }

  scoreOutcomes(program, profile) {
    const rules = this.matchingRules.outcomes;
    let score = 0;
    
    // Success rate for similar cases (anonymized)
    if (program.outcomes?.successRate) {
      score += program.outcomes.successRate * rules.successRateMultiplier;
    }
    
    // Average length of stay optimization
    if (program.outcomes?.avgLengthOfStay) {
      const targetRange = profile.targetLengthOfStay;
      if (this.isWithinRange(program.outcomes.avgLengthOfStay, targetRange)) {
        score += rules.avgLengthOfStayBonus;
      }
    }
    
    return score;
  }

  scoreAvailability(program, profile) {
    const rules = this.matchingRules.availability;
    const urgency = profile.urgencyLevel;
    
    if (program.hasImmediateAvailability && urgency === 'immediate') {
      return rules.immediate;
    }
    
    if (program.availabilityWindow <= 14 && urgency === 'urgent') {
      return rules.within2Weeks;
    }
    
    if (program.availabilityWindow <= 30) {
      return rules.within1Month;
    }
    
    return 0;
  }

  generateReasons(program, profile) {
    const reasons = [];
    
    if (program.state === profile.preferredState) {
      reasons.push(`Located in preferred state (${program.state})`);
    }
    
    const specialtyMatches = program.primarySpecialties.filter(s => 
      profile.primaryNeeds.includes(s)
    );
    if (specialtyMatches.length > 0) {
      reasons.push(`Specializes in ${specialtyMatches.join(', ')}`);
    }
    
    if (program.outcomes?.successRate > 85) {
      reasons.push(`High success rate (${program.outcomes.successRate}%)`);
    }
    
    if (program.hasImmediateAvailability) {
      reasons.push('Immediate availability');
    }
    
    return reasons;
  }

  getConfidenceLevel(score) {
    if (score >= 80) return 'High';
    if (score >= 60) return 'Medium';
    if (score >= 40) return 'Low';
    return 'Poor';
  }

  // Utility methods that don't use PHI
  calculateRegionalDistance(region1, region2) {
    const regionDistances = {
      'Northeast-Southeast': 300,
      'Northeast-Midwest': 200,
      'Northeast-West': 800,
      // ... more regional mappings
    };
    
    const key = `${region1}-${region2}`;
    return regionDistances[key] || regionDistances[`${region2}-${region1}`] || 500;
  }

  isWithinRange(value, range) {
    return value >= range.min && value <= range.max;
  }
}

// Helper function to anonymize client data before processing
export const anonymizeClientProfile = (clientData) => {
  return {
    ageRange: getAgeRange(clientData.age),
    region: getRegion(clientData.location),
    preferredState: clientData.preferences?.state,
    primaryNeeds: clientData.treatmentNeeds?.primary || [],
    secondaryNeeds: clientData.treatmentNeeds?.secondary || [],
    urgencyLevel: clientData.urgency || 'standard',
    targetLengthOfStay: {
      min: clientData.preferences?.minStay || 30,
      max: clientData.preferences?.maxStay || 90
    },
    insuranceCategory: getInsuranceCategory(clientData.insurance)
  };
};

// Safe helper functions
const getAgeRange = (age) => {
  if (age < 18) return 'Under 18';
  if (age < 25) return '18-24';
  if (age < 35) return '25-34';
  if (age < 45) return '35-44';
  if (age < 55) return '45-54';
  return '55+';
};

const getRegion = (location) => {
  // Convert specific location to general region
  const stateRegions = {
    'GA': 'Southeast', 'FL': 'Southeast', 'NC': 'Southeast',
    'NY': 'Northeast', 'MA': 'Northeast', 'CT': 'Northeast',
    'CA': 'West', 'OR': 'West', 'WA': 'West',
    'IL': 'Midwest', 'OH': 'Midwest', 'MI': 'Midwest'
  };
  
  return stateRegions[location?.state] || 'Unknown';
};

const getInsuranceCategory = (insurance) => {
  if (!insurance) return 'Unknown';
  if (insurance.includes('Medicaid')) return 'Public';
  if (insurance.includes('Medicare')) return 'Public';
  return 'Commercial';
};
