// ===== Student ke skills aur company ke required skills compare karke match % nikalta hai =====
export const calculateSkillMatch = (studentSkills = [], requiredSkills = []) => {
  if (!requiredSkills || requiredSkills.length === 0) {
    return { matchCount: 0, totalRequired: 0, percentage: null }; // company ne skills mentioned hi nahi ki
  }

  // ===== Case-insensitive comparison ke liye dोनों ko lowercase kar lete hain =====
  const studentSkillsLower = studentSkills.map((s) => s.toLowerCase().trim());
  const requiredSkillsLower = requiredSkills.map((s) => s.toLowerCase().trim());

  const matchedSkills = requiredSkillsLower.filter((skill) => studentSkillsLower.includes(skill));

  const percentage = Math.round((matchedSkills.length / requiredSkillsLower.length) * 100);

  return {
    matchCount: matchedSkills.length,
    totalRequired: requiredSkillsLower.length,
    percentage,
  };
};