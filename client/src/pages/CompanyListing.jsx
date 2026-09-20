import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import CompanyCard from "../components/CompanyCard";
import { getCompanies, getMyProfile, getMyApplications } from "../services/api";
import "../styles/companies.css";
import { calculateSkillMatch } from "../utils/skillMatch";

const CompanyListing = () => {
  const [companies, setCompanies] = useState([]);
  const [studentProfile, setStudentProfile] = useState(null);
  const [appliedCompanyIds, setAppliedCompanyIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("All");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [companiesRes, profileRes, applicationsRes] = await Promise.all([
        getCompanies(),
        getMyProfile(),
        getMyApplications(),
      ]);

      setCompanies(companiesRes.data.data);
      setStudentProfile(profileRes.data.data);

      // ===== Sirf company IDs nikaalo jinme already apply kar chuke hain =====
      const appliedIds = applicationsRes.data.data.map((app) => app.company._id);
      setAppliedCompanyIds(appliedIds);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(search.toLowerCase()) ||
      company.jobRole.toLowerCase().includes(search.toLowerCase());

    const matchesBranch =
      branchFilter === "All" ||
      !company.eligibility?.allowedBranches?.length ||
      company.eligibility.allowedBranches.includes(branchFilter);

    return matchesSearch && matchesBranch;
  });
  


    // ===== Skill match % ke hisaab se sort karo, best match sabse upar =====
  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    const matchA = calculateSkillMatch(studentProfile?.skills, a.requiredSkills).percentage ?? -1;
    const matchB = calculateSkillMatch(studentProfile?.skills, b.requiredSkills).percentage ?? -1;
    return matchB - matchA; // descending order — highest match pehle
  });
  const allBranches = [
    ...new Set(companies.flatMap((c) => c.eligibility?.allowedBranches || [])),
  ];

  if (loading) {
    return (
      <>
        <Navbar />
        <p className="loading-text">Loading companies...</p>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="companies-page">
        <div className="companies-header">
          <h1>Browse Companies</h1>
        </div>

        <div className="companies-controls">
          <input
            type="text"
            className="search-box"
            placeholder="Search by company name or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="filter-select"
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
          >
            <option value="All">All Branches</option>
            {allBranches.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>
        </div>

                {sortedCompanies.length === 0 ? (
          <div className="no-results">No companies found matching your criteria.</div>
        ) : (
          <div className="companies-grid">
            {sortedCompanies.map((company, index) => (
              <CompanyCard
                key={company._id}
                company={company}
                index={index}
                studentProfile={studentProfile}
                appliedCompanyIds={appliedCompanyIds}
                onApplySuccess={fetchData}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CompanyListing;