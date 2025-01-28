"use client";
import React from "react";

function PostJob({
  onSubmit,
  onChange,
  handleAIImprovement,
  formData,
  loading,
  isSubmitting,
  submitSuccess,
  charCount,
  handleRemoteChange,
  darkMode = false,
}) {
  const baseClasses = darkMode
    ? "bg-gray-900 text-gray-100"
    : "bg-white text-gray-900";

  const inputClasses = darkMode
    ? "bg-gray-800 border-gray-700 text-gray-100 focus:border-blue-500"
    : "bg-gray-50 border-gray-200 focus:border-blue-500";

  return (
    <div
      className={`rounded-lg shadow-xl p-8 border ${
        darkMode ? "border-gray-800" : "border-gray-100"
      } ${baseClasses}`}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-semibold font-poppins">
          Post a New Position
        </h1>
      </div>

      {submitSuccess && (
        <div
          className={`mb-6 p-4 ${
            darkMode ? "bg-blue-900/20" : "bg-blue-50"
          } text-blue-600 rounded-md font-poppins border border-blue-200`}
        >
          <div className="flex items-center">
            <i className="fas fa-check-circle mr-2"></i>
            Your job posting has been successfully published
          </div>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block font-poppins mb-2 text-sm">Job Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={onChange}
              className={`w-full px-4 py-2.5 rounded-md border transition-colors duration-200 ${inputClasses}`}
              required
            />
          </div>

          <div>
            <label className="block font-poppins mb-2 text-sm">
              Company Name
            </label>
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={onChange}
              className={`w-full px-4 py-2.5 rounded-md border transition-colors duration-200 ${inputClasses}`}
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block font-poppins mb-2 text-sm">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={onChange}
              className={`w-full px-4 py-2.5 rounded-md border transition-colors duration-200 ${inputClasses}`}
              required
            />
          </div>

          <div>
            <label className="block font-poppins mb-2 text-sm">
              Employment Type
            </label>
            <input
              type="text"
              name="job_types"
              value={formData.job_types}
              onChange={onChange}
              placeholder="Full-time, Part-time, Contract"
              className={`w-full px-4 py-2.5 rounded-md border transition-colors duration-200 ${inputClasses}`}
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-poppins mb-2 text-sm">Description</label>
          <div className="relative">
            <textarea
              name="description"
              value={formData.description}
              onChange={onChange}
              rows="4"
              className={`w-full px-4 py-2.5 rounded-md border transition-colors duration-200 ${inputClasses}`}
              required
            ></textarea>
            <button
              type="button"
              onClick={() => handleAIImprovement("description")}
              disabled={loading}
              className="absolute right-2 top-2 bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
            >
              <i className="fas fa-wand-magic-sparkles mr-1"></i>
              {loading ? "Enhancing..." : "Enhance"}
            </button>
          </div>
        </div>

        <div>
          <label className="block font-poppins mb-2 text-sm">
            Requirements
          </label>
          <div className="relative">
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={onChange}
              rows="4"
              className={`w-full px-4 py-2.5 rounded-md border transition-colors duration-200 ${inputClasses}`}
              required
            ></textarea>
            <div className="absolute right-2 top-2 flex space-x-2">
              <span className="text-sm text-gray-500">
                {charCount.requirements}
              </span>
              <button
                type="button"
                onClick={() => handleAIImprovement("requirements")}
                disabled={loading}
                className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
              >
                <i className="fas fa-wand-magic-sparkles mr-1"></i>
                {loading ? "Enhancing..." : "Enhance"}
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="block font-poppins mb-2 text-sm">
            Benefits & Perks
          </label>
          <div className="relative">
            <textarea
              name="benefits"
              value={formData.benefits}
              onChange={onChange}
              rows="4"
              className={`w-full px-4 py-2.5 rounded-md border transition-colors duration-200 ${inputClasses}`}
              required
            ></textarea>
            <div className="absolute right-2 top-2 flex space-x-2">
              <span className="text-sm text-gray-500">
                {charCount.benefits}
              </span>
              <button
                type="button"
                onClick={() => handleAIImprovement("benefits")}
                disabled={loading}
                className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
              >
                <i className="fas fa-wand-magic-sparkles mr-1"></i>
                {loading ? "Enhancing..." : "Enhance"}
              </button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block font-poppins mb-2 text-sm">Keywords</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={onChange}
              placeholder="e.g. Software Engineering, Cloud Computing"
              className={`w-full px-4 py-2.5 rounded-md border transition-colors duration-200 ${inputClasses}`}
            />
          </div>

          <div>
            <label className="block font-poppins mb-2 text-sm">
              Application URL
            </label>
            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={onChange}
              className={`w-full px-4 py-2.5 rounded-md border transition-colors duration-200 ${inputClasses}`}
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block font-poppins mb-2 text-sm">
              Minimum Salary
            </label>
            <input
              type="number"
              name="salary_min"
              value={formData.salary_min}
              onChange={onChange}
              placeholder="50000"
              className={`w-full px-4 py-2.5 rounded-md border transition-colors duration-200 ${inputClasses}`}
            />
          </div>
          <div>
            <label className="block font-poppins mb-2 text-sm">
              Maximum Salary
            </label>
            <input
              type="number"
              name="salary_max"
              value={formData.salary_max}
              onChange={onChange}
              placeholder="100000"
              className={`w-full px-4 py-2.5 rounded-md border transition-colors duration-200 ${inputClasses}`}
            />
          </div>
        </div>

        <div className="flex items-center py-2">
          <input
            type="checkbox"
            id="remote"
            checked={formData.remote === 1}
            onChange={handleRemoteChange}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="remote" className="font-poppins ml-2 text-sm">
            This is a remote position
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-md font-poppins hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
        >
          {isSubmitting ? "Publishing..." : "Publish Position"}
        </button>
      </form>
    </div>
  );
}

function PostJobStory() {
  const [formData, setFormData] = React.useState({
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

  const [loading, setLoading] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitSuccess, setSubmitSuccess] = React.useState(false);
  const [charCount, setCharCount] = React.useState({
    requirements: 0,
    benefits: 0,
  });
  const [darkMode, setDarkMode] = React.useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRemoteChange = () => {
    setFormData((prev) => ({ ...prev, remote: prev.remote === 1 ? 0 : 1 }));
  };

  const handleAIImprovement = (field) => {
    setLoading(true);
    setTimeout(() => {
      setFormData((prev) => ({
        ...prev,
        [field]: prev[field] + " (Enhanced)",
      }));
      setLoading(false);
    }, 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setSubmitSuccess(true);
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div
      className={
        darkMode
          ? "bg-gray-950 min-h-screen p-4"
          : "bg-gray-100 min-h-screen p-4"
      }
    >
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed top-4 right-4 bg-gray-200 dark:bg-gray-700 p-2 rounded-full"
      >
        <i className={`fas ${darkMode ? "fa-sun" : "fa-moon"}`}></i>
      </button>
      <PostJob
        onSubmit={handleSubmit}
        onChange={handleChange}
        handleAIImprovement={handleAIImprovement}
        formData={formData}
        loading={loading}
        isSubmitting={isSubmitting}
        submitSuccess={submitSuccess}
        charCount={charCount}
        handleRemoteChange={handleRemoteChange}
        darkMode={darkMode}
      />
    </div>
  );
}

export default PostJob;