"use client";
import React from "react";

function Companies({ title, subtitle }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedJobType, setSelectedJobType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("/api/db/mellonialjobs-63", {
          method: "POST",
          body: JSON.stringify({
            query:
              "SELECT DISTINCT company_name, COUNT(*) as job_count, job_types, location, benefits FROM `jobs` GROUP BY company_name, job_types, location, benefits",
            values: [],
          }),
        });
        const data = await response.json();
        setJobs(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const getRandomIcon = () => {
    const icons = [
      "building",
      "rocket",
      "chart-line",
      "laptop-code",
      "brain",
      "network-wired",
    ];
    return icons[Math.floor(Math.random() * icons.length)];
  };

  const locations = [
    "all",
    ...new Set(jobs.map((job) => job.location).filter(Boolean)),
  ];

  const jobTypes = [
    "all",
    ...new Set(
      jobs
        .flatMap((job) => (job.job_types ? job.job_types.split(",") : []))
        .map((type) => type.trim())
        .filter(Boolean)
    ),
  ];

  const filteredJobs = jobs.filter((company) => {
    const matchesSearch = company.company_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesLocation =
      selectedLocation === "all" || company.location === selectedLocation;
    const matchesJobType =
      selectedJobType === "all" ||
      (company.job_types &&
        company.job_types
          .toLowerCase()
          .includes(selectedJobType.toLowerCase()));
    return matchesSearch && matchesLocation && matchesJobType;
  });

  const pageCount = Math.ceil(filteredJobs.length / itemsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-[#0A0F1C] relative">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white font-inter">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-light max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="mb-12 space-y-4 md:space-y-0 md:flex md:items-center md:space-x-6">
          <div className="relative flex-1">
            <i className="fas fa-search absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-[#151B2D] border border-[#2A3347] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 text-lg transition-all duration-200"
            />
          </div>
          <div className="relative md:w-72">
            <i className="fas fa-map-marker-alt absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-[#151B2D] border border-[#2A3347] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white appearance-none cursor-pointer text-lg transition-all duration-200"
            >
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location === "all" ? "All Locations" : location}
                </option>
              ))}
            </select>
            <i className="fas fa-chevron-down absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
          </div>
          <div className="relative md:w-72">
            <i className="fas fa-briefcase absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <select
              value={selectedJobType}
              onChange={(e) => setSelectedJobType(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-[#151B2D] border border-[#2A3347] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white appearance-none cursor-pointer text-lg transition-all duration-200"
            >
              {jobTypes.map((type) => (
                <option key={type} value={type}>
                  {type === "all" ? "All Job Types" : type}
                </option>
              ))}
            </select>
            <i className="fas fa-chevron-down absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <p className="text-gray-300 mb-8 text-lg">
              Found {filteredJobs.length}{" "}
              {filteredJobs.length === 1 ? "company" : "companies"}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedJobs.map((company, index) => {
                const icon = getRandomIcon();
                const jobTypes = company.job_types
                  ? company.job_types.split(",")
                  : [];
                const benefits = company.benefits
                  ? company.benefits.split(",")
                  : [];

                return (
                  <div
                    key={index}
                    className="bg-[#151B2D] rounded-2xl p-8 border border-[#2A3347] hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
                  >
                    <div className="flex items-start mb-6">
                      <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mr-4">
                        <i
                          className={`fas fa-${icon} text-2xl text-blue-400`}
                        ></i>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-1">
                          {company.company_name}
                        </h3>
                        <p className="text-blue-400 font-medium">
                          {company.job_count}{" "}
                          {company.job_count === 1 ? "position" : "positions"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center mb-6 text-gray-300">
                      <i className="fas fa-map-marker-alt mr-2 text-gray-400"></i>
                      <span>{company.location || "Multiple Locations"}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {jobTypes.slice(0, 1).map((type, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg text-sm font-medium"
                        >
                          {type.trim()}
                        </span>
                      ))}
                      {benefits.slice(0, 2).map((benefit, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-2 bg-purple-500/10 text-purple-400 rounded-lg text-sm font-medium"
                        >
                          {benefit.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {pageCount > 1 && (
              <div className="flex justify-center mt-12 gap-2">
                {Array.from({ length: pageCount }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => {
                        setCurrentPage(page);
                        scrollToTop();
                      }}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        currentPage === page
                          ? "bg-blue-500 text-white"
                          : "bg-[#151B2D] text-gray-300 hover:bg-[#2A3347]"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>
            )}
          </>
        )}
      </div>

      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300"
      >
        <i className="fas fa-arrow-up"></i>
      </button>
    </main>
  );
}

function CompaniesStory() {
  return (
    <div>
      <Companies
        title="Enterprise Job Board"
        subtitle="Discover opportunities at industry-leading companies"
      />
    </div>
  );
}

export default Companies;