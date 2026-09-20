import { useState } from "react";
import { applyToCompany } from "../services/api";
import "../styles/companies.css";
import { calculateSkillMatch } from "../utils/skillMatch";

const colors = ["card-color-0", "card-color-1", "card-color-2", "card-color-3", "card-color-4", "card-color-5"];

const CompanyCard = ({ company, index, studentProfile, appliedCompanyIds, onApplySuccess }) => {
  const colorClass = colors[index % colors.length];
  const [applying, setApplying] = useState(false);

  const isEligible = () => {
    if (!studentProfile) return false;

    const cgpaOk = studentProfile.cgpa >= (company.eligibility?.minCGPA || 0);

    const branchOk =
      !company.eligibility?.allowedBranches?.length ||
      company.eligibility.allowedBranches
        .map((b) => b.toLowerCase())
        .includes((studentProfile.branch || "").toLowerCase());

    return cgpaOk && branchOk;
  };

  const eligible = isEligible();
    const skillMatch = calculateSkillMatch(studentProfile?.skills, company.requiredSkills);

  const matchBadgeClass =
    skillMatch.percentage === null
      ? null
      : skillMatch.percentage >= 70
      ? "match-high"
      : skillMatch.percentage >= 40
      ? "match-medium"
      : "match-low";
  const alreadyApplied = appliedCompanyIds.includes(company._id);

  const deadline = new Date(company.applicationDeadline);
  const isDeadlinePassed = deadline < new Date();

  const handleApply = async () => {
    setApplying(true);
    try {
      await applyToCompany(company._id);
      alert(`Successfully applied to ${company.name}!`);
      onApplySuccess(); // parent ko batao list refresh karne ke liye
    } catch (error) {
      alert(error.response?.data?.message || "Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  // ===== Button ka text aur disabled state decide karo =====
  const getButtonState = () => {
    if (isDeadlinePassed) return { text: "Closed", disabled: true };
    if (alreadyApplied) return { text: "Already Applied", disabled: true };
    if (!eligible) return { text: "Not Eligible", disabled: true };
    if (applying) return { text: "Applying...", disabled: true };
    return { text: "Apply Now", disabled: false };
  };

  const buttonState = getButtonState();

  return (
    <div className={`company-card ${colorClass}`}>
      <span className={`card-badge ${eligible ? "badge-eligible" : "badge-not-eligible"}`}>
        {eligible ? "Eligible" : "Not Eligible"}
      </span>

      <h3>{company.name}</h3>
      <p className="role">{company.jobRole}</p>

      <div className="company-tags">
        <span className="company-tag">{company.jobType}</span>
        {company.location && <span className="company-tag">{company.location}</span>}
        {company.eligibility?.minCGPA > 0 && (
          <span className="company-tag">Min CGPA: {company.eligibility.minCGPA}</span>
        )}
      </div>
            {skillMatch.percentage !== null && (
        <span className={`skill-match-badge ${matchBadgeClass}`}>
          🎯 {skillMatch.matchCount}/{skillMatch.totalRequired} skills match ({skillMatch.percentage}%)
        </span>
      )}

      <div className="company-card-footer">
        <div className="company-package">
          ₹{company.package} LPA
          <br />
          <span>Annual Package</span>
        </div>
        <button className="apply-btn" disabled={buttonState.disabled} onClick={handleApply}>
          {buttonState.text}
        </button>
      </div>

      <p className="deadline-text">
        Deadline: {deadline.toLocaleDateString()} {isDeadlinePassed && "(Closed)"}
      </p>
    </div>
  );
};

export default CompanyCard;