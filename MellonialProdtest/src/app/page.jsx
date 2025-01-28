"use client";
import React from "react";

function MainComponent() {
  const [formData, setFormData] = useState({
    title: "",
    company_name: "",
    location: "",
    job_types: "",
    description: "",
    requirements: "",
    benefits: "",
    tags: "",
    url: "",
    remote: 0,
    salary_min: "",
    salary_max: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [view, setView] = useState("search");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalJobs = 30;

  const handlePublicJobSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus("success");
      setFormData({
        title: "",
        company_name: "",
        location: "",
        job_types: "",
        description: "",
        requirements: "",
        benefits: "",
        tags: "",
        url: "",
        remote: 0,
        salary_min: "",
        salary_max: "",
      });
    } catch (error) {
      setStatus("error");
    }
  };

  const TagsComponent = ({ tags }) => {
    if (!tags) return null;
    const tagList = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    return (
      <div className="flex flex-wrap gap-2 mt-4">
        {tagList.map((tag, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-emerald-400/10 text-emerald-400 rounded-lg text-sm"
          >
            {tag}
          </span>
        ))}
      </div>
    );
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderContent = () => {
    if (view === "post") {
      return (
        <PostJob
          onSubmit={handlePublicJobSubmit}
          onChange={(e) => {
            const { name, value } = e.target;
            setFormData((prev) => ({ ...prev, [name]: value }));
          }}
          handleAIImprovement={(field) => {
            setLoading(true);
            setTimeout(() => {
              setFormData((prev) => ({
                ...prev,
                [field]: `${prev[field]} (AI Enhanced)`,
              }));
              setLoading(false);
            }, 1000);
          }}
          formData={formData}
          loading={loading}
          isSubmitting={status === "submitting"}
          submitSuccess={status === "success"}
          charCount={{
            requirements: formData.requirements.length,
            benefits: formData.benefits.length,
          }}
          handleRemoteChange={() => {
            setFormData((prev) => ({
              ...prev,
              remote: prev.remote === 1 ? 0 : 1,
            }));
          }}
        />
      );
    }

    if (view === "companies") {
      return (
        <Companies
          title="Enterprise Job Board"
          subtitle="Discover opportunities at industry-leading companies"
        />
      );
    }

    return (
      <>
        <JObSearch
          searchPlaceholder="Search by title, company, or keywords..."
          locationPlaceholder="City, state, or remote"
          TagsComponent={TagsComponent}
        />
        <div className="flex justify-center mt-8">
          <Pagination1
            currentPage={currentPage}
            totalPages={Math.ceil(totalJobs / itemsPerPage)}
            onPageChange={(page) => {
              setCurrentPage(page);
              scrollToTop();
            }}
          />
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C]">
      <header className="bg-[#151B2D] border-b border-[#2A3347] py-4">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex justify-between items-center">
            <img
              src="https://ucarecdn.com/63aaf0ca-43a1-4401-89d8-9c1145ab911a/-/format/auto/"
              alt="Job Search Platform Logo"
              className="h-12"
            />
            <div className="flex gap-4">
              <button
                onClick={() => setView("search")}
                className={`px-4 py-2 rounded-lg transition-all ${
                  view === "search"
                    ? "bg-blue-500 text-white"
                    : "text-gray-300 hover:bg-[#2A3347]"
                }`}
              >
                <i className="fas fa-search mr-2"></i>
                Search Jobs
              </button>
              <button
                onClick={() => setView("post")}
                className={`px-4 py-2 rounded-lg transition-all ${
                  view === "post"
                    ? "bg-blue-500 text-white"
                    : "text-gray-300 hover:bg-[#2A3347]"
                }`}
              >
                <i className="fas fa-plus-circle mr-2"></i>
                Post a Job
              </button>
              <button
                onClick={() => setView("companies")}
                className={`px-4 py-2 rounded-lg transition-all ${
                  view === "companies"
                    ? "bg-blue-500 text-white"
                    : "text-gray-300 hover:bg-[#2A3347]"
                }`}
              >
                <i className="fas fa-building mr-2"></i>
                Companies
              </button>
            </div>
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">{renderContent()}</main>
    </div>
  );
}

export default MainComponent;