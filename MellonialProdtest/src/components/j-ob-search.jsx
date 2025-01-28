"use client";
import React from "react";

function JObSearch({
  searchPlaceholder = "Search jobs...",
  locationPlaceholder = "Location...",
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    remote: false,
    fullTime: false,
    contract: false,
  });
  const [salaryRange, setSalaryRange] = useState([0, 200000]);
  const [jobs, setJobs] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [clickedJobs, setClickedJobs] = useState({});
  const [showAIButtons, setShowAIButtons] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);
  const jobsPerPage = 5;

  const tips = [
    {
      icon: "mouse-pointer",
      text: "Triple click any job card to reveal AI features",
    },
    {
      icon: "filter",
      text: "Use filters to narrow down your perfect job match",
    },
    { icon: "tags", text: "Click on tags to find similar positions" },
    { icon: "keyboard", text: "Press Enter to quickly search" },
    { icon: "star", text: "New jobs are added daily - check back often!" },
  ];

  const debounce = (func, wait) => {
    let timeout;
    const debouncedFunction = function (...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
    debouncedFunction.cancel = function () {
      clearTimeout(timeout);
    };
    return debouncedFunction;
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch("/api/db/mellonialjobs-63", {
        method: "POST",
        body: JSON.stringify({
          query: "SELECT * FROM `jobs` LIMIT 100",
        }),
      });
      const data = await response.json();
      setJobs(data);
      setFilteredData(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setIsLoading(false);
    }
  };

  const debouncedFilter = useCallback(
    debounce(() => {
      let filtered = jobs.filter((job) => {
        const matchesSearch = !searchQuery
          ? true
          : job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.company_name
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            job.tags?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesLocation = !locationQuery
          ? true
          : job.location?.toLowerCase().includes(locationQuery.toLowerCase());

        const matchesRemote = !selectedFilters.remote ? true : job.remote === 1;

        const matchesFullTime = !selectedFilters.fullTime
          ? true
          : job.job_types?.toLowerCase().includes("full-time");

        const matchesContract = !selectedFilters.contract
          ? true
          : job.job_types?.toLowerCase().includes("contract");

        return (
          matchesSearch &&
          matchesLocation &&
          matchesRemote &&
          matchesFullTime &&
          matchesContract
        );
      });

      setFilteredData(filtered);
      setCurrentPage(1);
    }, 300),
    [searchQuery, locationQuery, selectedFilters, jobs]
  );

  useEffect(() => {
    debouncedFilter();
    return () => debouncedFilter.cancel();
  }, [searchQuery, locationQuery, selectedFilters, debouncedFilter]);

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 5000);

    return () => clearInterval(tipInterval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  const handleJobClick = (jobId) => {
    setClickedJobs((prev) => {
      const clicks = (prev[jobId] || 0) + 1;
      if (clicks === 3) {
        setShowAIButtons((prev) => ({ ...prev, [jobId]: true }));
        return { ...prev, [jobId]: 0 };
      }
      return { ...prev, [jobId]: clicks };
    });
  };

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredData.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredData.length / jobsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-[#0D1829]/50 backdrop-blur-sm border border-gray-800 rounded-lg">
        <div className="text-emerald-400">
          <i className="fas fa-spinner fa-spin mr-2"></i>
          Loading jobs...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div
        className="bg-[#0D1829]/80 backdrop-blur-sm border border-emerald-400/20 rounded-lg p-4 mb-6 flex items-center justify-between cursor-pointer hover:border-emerald-400/40 transition-all"
        onClick={() => setShowTip(!showTip)}
      >
        <div className="flex items-center space-x-3">
          <i className={`fas fa-${tips[currentTip].icon} text-emerald-400`}></i>
          <p className="text-gray-300">
            <span className="text-emerald-400 font-semibold">Pro Tip:</span>{" "}
            {tips[currentTip].text}
          </p>
        </div>
        <i
          className={`fas fa-chevron-${
            showTip ? "up" : "down"
          } text-emerald-400`}
        ></i>
      </div>

      {showTip && (
        <div className="bg-[#0D1829]/60 backdrop-blur-sm border border-gray-800 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tips.map((tip, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 rounded-lg bg-[#0D1829]/40"
              >
                <i className={`fas fa-${tip.icon} text-emerald-400 mt-1`}></i>
                <p className="text-gray-300">{tip.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-[#0D1829]/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6 mb-8 shadow-lg">
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-5 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="fas fa-search text-emerald-400"></i>
              </div>
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#0D1829] border-2 border-gray-800 text-gray-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all placeholder-gray-500"
              />
            </div>
            <div className="lg:col-span-5 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="fas fa-map-marker-alt text-emerald-400"></i>
              </div>
              <input
                type="text"
                placeholder={locationPlaceholder}
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#0D1829] border-2 border-gray-800 text-gray-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all placeholder-gray-500"
              />
            </div>
            <div className="lg:col-span-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="flex-1 px-6 py-4 bg-emerald-400/10 text-emerald-400 rounded-xl hover:bg-emerald-400/20 transition-all"
              >
                <i className="fas fa-sliders-h mr-2"></i>
                Filters
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-4 bg-emerald-400 text-[#0D1829] font-semibold rounded-xl hover:bg-emerald-500 active:bg-emerald-600 transition-all"
              >
                <i className="fas fa-search mr-2"></i>
                Search
              </button>
            </div>
          </div>

          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              showFilters ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="pt-6 border-t border-gray-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-emerald-400">
                    Job Type
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {[
                      { key: "remote", label: "Remote", icon: "laptop-house" },
                      { key: "fullTime", label: "Full-time", icon: "clock" },
                      {
                        key: "contract",
                        label: "Contract",
                        icon: "file-contract",
                      },
                    ].map(({ key, label, icon }) => (
                      <label
                        key={key}
                        className={`flex items-center px-4 py-2 rounded-lg cursor-pointer transition-all ${
                          selectedFilters[key]
                            ? "bg-emerald-400 text-[#0D1829]"
                            : "bg-[#0D1829] text-gray-400 hover:bg-emerald-400/10 hover:text-emerald-400"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedFilters[key]}
                          onChange={(e) =>
                            setSelectedFilters({
                              ...selectedFilters,
                              [key]: e.target.checked,
                            })
                          }
                          className="hidden"
                        />
                        <i className={`fas fa-${icon} mr-2`}></i>
                        {label}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-emerald-400">
                    Salary Range
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <i className="fas fa-dollar-sign text-emerald-400"></i>
                      </div>
                      <input
                        type="number"
                        value={salaryRange[0]}
                        onChange={(e) =>
                          setSalaryRange([
                            parseInt(e.target.value),
                            salaryRange[1],
                          ])
                        }
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#0D1829] border-2 border-gray-800 text-gray-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
                        placeholder="Min"
                      />
                    </div>
                    <span className="text-gray-400">to</span>
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <i className="fas fa-dollar-sign text-emerald-400"></i>
                      </div>
                      <input
                        type="number"
                        value={salaryRange[1]}
                        onChange={(e) =>
                          setSalaryRange([
                            salaryRange[0],
                            parseInt(e.target.value),
                          ])
                        }
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#0D1829] border-2 border-gray-800 text-gray-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
                        placeholder="Max"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {filteredData.length === 0 ? (
        <div className="text-center py-12 text-gray-400 bg-[#0D1829]/50 backdrop-blur-sm border border-gray-800 rounded-lg">
          <i className="fas fa-search mb-4 text-4xl"></i>
          <p className="text-xl">No jobs found matching your criteria</p>
          <p className="mt-2">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 mb-8">
            {currentJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => handleJobClick(job.id)}
                className={`bg-[#0D1829]/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6 hover:border-emerald-400 transition-all group shadow-lg hover:shadow-emerald-400/10 cursor-pointer ${
                  showAIButtons[job.id] ? "glow-effect" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-emerald-400">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-gray-400">
                      <span className="flex items-center">
                        <i className="fas fa-building mr-2"></i>
                        {job.company_name}
                      </span>
                      <span className="flex items-center">
                        <i className="fas fa-map-marker-alt mr-2"></i>
                        {job.location}
                      </span>
                      <span className="flex items-center">
                        <i className="fas fa-calendar-alt mr-2"></i>
                        {new Date(job.created_at * 1000).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-emerald-400/10 text-emerald-400 rounded-lg hover:bg-emerald-400 hover:text-[#0D1829] transition-all focus:ring-2 focus:ring-emerald-400/50"
                  >
                    Apply Now
                  </a>
                </div>
                <div className="mt-4">
                  <p className="text-gray-300">{job.simplified_description}</p>
                </div>
                <NewComponent tags={job.tags} />

                {showAIButtons[job.id] && (
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500 hover:text-white transition-all">
                      <i className="fas fa-graduation-cap mr-2"></i>
                      Find Training
                    </button>
                    <button className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-all">
                      <i className="fas fa-brain mr-2"></i>
                      Skill Analysis
                    </button>
                    <button className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500 hover:text-white transition-all">
                      <i className="fas fa-chart-line mr-2"></i>
                      Career Path
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-center items-center space-x-2 mb-8">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-emerald-400/10 text-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-400 hover:text-[#0D1829] transition-all"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <div className="flex items-center space-x-2">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`w-10 h-10 rounded-lg ${
                    currentPage === index + 1
                      ? "bg-emerald-400 text-[#0D1829]"
                      : "bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400 hover:text-[#0D1829]"
                  } transition-all`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-emerald-400/10 text-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-400 hover:text-[#0D1829] transition-all"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </>
      )}

      <style jsx global>{`
        .glow-effect {
          animation: glow 1s ease-in-out;
          border-color: #34d399 !important;
          box-shadow: 0 0 15px rgba(52, 211, 153, 0.5);
        }

        @keyframes glow {
          0% {
            box-shadow: 0 0 5px rgba(52, 211, 153, 0.2);
          }
          50% {
            box-shadow: 0 0 20px rgba(52, 211, 153, 0.6);
          }
          100% {
            box-shadow: 0 0 15px rgba(52, 211, 153, 0.5);
          }
        }
      `}</style>
    </div>
  );
}

function JobSearchStory() {
  return (
    <div className="p-8 min-h-screen bg-gradient-to-b from-[#040D21] to-[#0B1221]">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-emerald-400 text-center mb-8">
          Find Your Dream Tech Job
        </h1>
        <JobSearch
          searchPlaceholder="Search by title, company, or keywords..."
          locationPlaceholder="City, state, or remote"
        />
      </div>
    </div>
  );
}

export default JobSearch;