export type Gender = "male" | "female";
export type PhysicalObjective =
  | "health"
  | "strength"
  | "longevity"
  | "aesthetics";

export interface BiometricProfile {
  height: number; // cm
  gender: Gender;
  birth_date: string; // YYYY-MM-DD
  physical_objective: PhysicalObjective;
}

export interface IdealStats {
  weight: {
    min: number;
    max: number;
    ideal: number;
  };
  bodyFat: {
    min: number;
    max: number;
  };
  bmi: {
    min: number;
    max: number;
  };
  muscleMass: {
    min: number;
    max: number;
  };
}

/**
 * Calculates Ideal Body Weight (IBW) using the Devine Formula (1974).
 * @param heightCm Height in centimeters
 * @param gender Gender
 */
export const calculateIdealWeight = (
  heightCm: number,
  gender: Gender
): number => {
  const heightInches = heightCm / 2.54;
  const inchesOver60 = heightInches - 60;

  // Base weight
  const base = gender === "male" ? 50 : 45.5;

  if (inchesOver60 <= 0) return base; // Fallback for short stature (unlikely for adults but safe)

  // 2.3kg per inch over 5 feet
  const addedWeight = 2.3 * inchesOver60;

  return parseFloat((base + addedWeight).toFixed(1));
};

/**
 * Returns ideal Body Fat range based on gender and objective.
 */
export const getIdealBodyFatRange = (
  gender: Gender,
  objective: PhysicalObjective
): { min: number; max: number } => {
  if (gender === "male") {
    switch (objective) {
      case "health":
        return { min: 15, max: 20 };
      case "strength":
        return { min: 15, max: 20 };
      case "longevity":
        return { min: 12, max: 16 };
      case "aesthetics":
        return { min: 8, max: 12 };
      default:
        return { min: 15, max: 20 };
    }
  } else {
    // Female
    switch (objective) {
      case "health":
        return { min: 22, max: 28 };
      case "strength":
        return { min: 22, max: 26 };
      case "longevity":
        return { min: 20, max: 24 };
      case "aesthetics":
        return { min: 16, max: 20 };
      default:
        return { min: 22, max: 28 };
    }
  }
};

/**
 * Returns ideal BMI range based on objective.
 */
export const getIdealBMIRange = (
  objective: PhysicalObjective
): { min: number; max: number } => {
  switch (objective) {
    case "health":
      return { min: 21.7, max: 23.0 };
    case "strength":
      return { min: 25.0, max: 27.5 };
    case "longevity":
      return { min: 21.0, max: 23.0 };
    case "aesthetics":
      return { min: 20.0, max: 22.0 };
    default:
      return { min: 21.7, max: 23.0 };
  }
};

/**
 * Main calculator function for all recommendations.
 */
export const calculateRecommendations = (
  profile: BiometricProfile
): IdealStats => {
  const ibw = calculateIdealWeight(profile.height, profile.gender);
  const bfRange = getIdealBodyFatRange(
    profile.gender,
    profile.physical_objective
  );
  const bmiRange = getIdealBMIRange(profile.physical_objective);

  // Adjust Ideal Weight based on objective
  let adjustedWeight = ibw;
  let weightRange = { min: ibw * 0.95, max: ibw * 1.05 };

  switch (profile.physical_objective) {
    case "health":
      // IBW is ideal
      weightRange = { min: ibw * 0.95, max: ibw * 1.05 };
      break;
    case "strength":
      // 10-15% heavier for muscle mass
      adjustedWeight = ibw * 1.125;
      weightRange = { min: ibw * 1.1, max: ibw * 1.15 };
      break;
    case "longevity":
      // Standard IBW or slightly higher/lower depending on view, keeping standard here but stricter BF
      weightRange = { min: ibw, max: ibw * 1.05 };
      break;
    case "aesthetics":
      // Standard or slightly leaner (often same weight but lower BF = higher muscle)
      weightRange = { min: ibw * 0.97, max: ibw * 1.03 };
      break;
  }

  return {
    weight: {
      ideal: parseFloat(adjustedWeight.toFixed(1)),
      min: parseFloat(weightRange.min.toFixed(1)),
      max: parseFloat(weightRange.max.toFixed(1)),
    },
    bodyFat: bfRange,
    bmi: bmiRange,
    muscleMass: {
      min: parseFloat(
        (weightRange.min * (1 - bfRange.max / 100 - 0.04)).toFixed(1)
      ), // Est. 4% bone mass
      max: parseFloat(
        (weightRange.max * (1 - bfRange.min / 100 - 0.04)).toFixed(1)
      ),
    },
  };
};

export const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birthDateObj = new Date(birthDate);
  let age = today.getFullYear() - birthDateObj.getFullYear();
  const m = today.getMonth() - birthDateObj.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
    age--;
  }
  return age;
};
