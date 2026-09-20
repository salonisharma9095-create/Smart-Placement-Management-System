// ===== Profile ke basis par readiness score calculate karta hai (0-100) =====
export const calculateReadinessScore = (profile) => {
  if (!profile) return 0;

  let score = 0;
  const breakdown = [];

  // Skills (25 points)
  if (profile.skills && profile.skills.length >= 3) {
    score += 25;
    breakdown.push({ label: "Skills added", points: 25, done: true });
  } else {
    breakdown.push({ label: "Add at least 3 skills", points: 25, done: false });
  }

  // CGPA (20 points)
  if (profile.cgpa && profile.cgpa > 0) {
    score += 20;
    breakdown.push({ label: "CGPA set", points: 20, done: true });
  } else {
    breakdown.push({ label: "Set your CGPA", points: 20, done: false });
  }

  // Branch (15 points)
  if (profile.branch && profile.branch.trim() !== "") {
    score += 15;
    breakdown.push({ label: "Branch set", points: 15, done: true });
  } else {
    breakdown.push({ label: "Set your branch", points: 15, done: false });
  }

  // Resume (20 points) — abhi feature nahi bana, isliye hamesha incomplete
    // Resume (20 points)
  if (profile.resumeUrl && profile.resumeUrl.trim() !== "") {
    score += 20;
    breakdown.push({ label: "Resume uploaded", points: 20, done: true });
  } else {
    breakdown.push({ label: "Upload your resume", points: 20, done: false });
  }
  // Phone (10 points)
  if (profile.phone && profile.phone.trim() !== "") {
    score += 10;
    breakdown.push({ label: "Phone number added", points: 10, done: true });
  } else {
    breakdown.push({ label: "Add phone number", points: 10, done: false });
  }

  // Graduation Year (10 points)
  if (profile.graduationYear) {
    score += 10;
    breakdown.push({ label: "Graduation year set", points: 10, done: true });
  } else {
    breakdown.push({ label: "Set graduation year", points: 10, done: false });
  }

  return { score, breakdown };
};