import React, { useEffect, useState } from "react";
import Banner from "../Components/Banner";
import Card from "../Components/Card";
import Jobs from "./Jobs";
import Sidebar from "../sidebar/Sidebar";
import CreateJob from "./CreateJob";
import CardUsers from "../Components/CardUsers";
import Applicants from "./Applicants";

function Home() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [jobs, setJobs] = useState([]); //  as json array object
  const [jobSeekers, setJobSeekers] =  useState([]); // as json array object
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageForApplicant, setCurrentPageForApplicant] = useState(1);
  const itemsPerPage = 6;

  const selectedMode = localStorage.getItem("selectedMode");

  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:3000/all-jobs")
      .then((res) => res.json())
      .then((data) => {
        setJobs(data);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:3000/all-jobSeeker")
      .then((res) => res.json())
      .then((data) => {
        console.log("data: ",data);
        setJobSeekers(data);
        setIsLoading(false);
      });
  }, []);


  // console.log(jobs);

  // For Banner Components
  const [query, setQuery] = useState("");

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  //Filter the jobs by title
  const filteredItems = jobs.filter(
    (job) => job.jobTitle.toLowerCase().indexOf(query.toLowerCase()) !== -1
  );
  // console.log(filteredItems)

  //--------------------Radio filtering-----------------------
  const handleChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  //--------------------Button based filtering-----------------------
  const handleClick = (event) => {
    setSelectedCategory(event.target.value);
    
  };

  //calculate the index range of pages
  const calculatePageRange = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return { startIndex, endIndex };
  };

  //function for the next phase
  const nextPage = () => {
    // console.log(Math.ceil(filteredItems.length / itemsPerPage));
    if (currentPage < Math.ceil(filteredItems.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  //function for the previous phase
  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  //main function
  const filteredData = (jobs, selected, query) => {
    let filteredJobs = jobs;

    console.log(typeof selected);

    // input items wise filtering ( based on jobTitle)
    if (query) {
      filteredJobs = filteredItems;
    }

    // category wise filtering
    if (selected) {
      filteredJobs = filteredJobs.filter(
        ({
          jobLocation,
          maxPrice,
          salaryType,
          experienceLevel,
          employmentType,
          postingDate,
        }) =>
          // console.log(postingDate, postingDate.toString() > selected, (postingDate.toString() > selected) ||
          // jobLocation.toLowerCase() === selected.toLowerCase() ||
          // parseInt(maxPrice) <= parseInt(selected) ||
          // salaryType.toLowerCase() === selected.toLowerCase() ||
          // experienceLevel.toLowerCase() === selected.toLowerCase() ||
          // employmentType.toLowerCase() === selected.toLowerCase(), parseInt(maxPrice) <= parseInt(selected))

          //return
          // (postingDate.toString() > selected) &&
          jobLocation.toLowerCase() === selected.toLowerCase() ||
          parseInt(maxPrice) <= parseInt(selected) ||
          salaryType.toLowerCase() === selected.toLowerCase() ||
          experienceLevel.toLowerCase() === selected.toLowerCase() ||
          employmentType.toLowerCase() === selected.toLowerCase()
      );

      // console.log(filteredJobs);
      // console.log( postingDate >= selected ,typeof selected)
    }

    // slice the data based on current page
    const { startIndex, endIndex } = calculatePageRange();

    filteredJobs = filteredJobs.slice(startIndex, endIndex);

    return filteredJobs.map((data, i) => <Card key={i} data={data} />);
  };

  // result
  const result = filteredData(jobs, selectedCategory, query);

  //Applicant Details
  const applicantList = (jobSeekers) =>{
    let jobseekerList =  jobSeekers;

    const { startIndex, endIndex } = calculatePageRange();

    jobseekerList = jobseekerList.slice(startIndex, endIndex);

    return jobseekerList.map((data, i) => <CardUsers key={i} data={data} />);
  }


  const jobseeker = applicantList(jobSeekers);
  // console.log(jobse  eker)

  return (
    <div>
      {/* passed as props  */}
      <Banner query={query} handleInputChange={handleInputChange} />

      {/* main content */}
      <div className="bg-[#FAFAFA] md:grid grid-cols-4 gap-8 lg:px-24 px-4 py-12">
        {/* left side */}
        <div className="bg-white p-4 rounded">
          <Sidebar handleChange={handleChange} handleClick={handleClick} />
        </div>

        {/* -----------------------------------------------job card-------------------------------------------------------- */}

        {selectedMode === "mode1" ? (
          <div className="col-span-3 bg-white p-4 rounded-sm">
            {isLoading ? (
              <p className="font-medium">Loading...</p>
            ) : result.length > 0 ? (
              <Jobs result={result} />
            ) : (
              <>
                <h3 className="text-lg font-bold mb-2">{result.length} Jobs</h3>
                <p>No data found!</p>
              </>
            )}

            {/* pagination here */}
            {result.length > 0 ? (
              <div className="flex justify-center mt-4 space-x-8">
                <button
                  onClick={previousPage}
                  className="hover:underline"
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="mx-2">
                  Page {currentPage} of{" "}
                  {Math.ceil(filteredItems.length / itemsPerPage)}{" "}
                </span>
                <button
                  onClick={nextPage}
                  className="hover:underline"
                  disabled={
                    currentPage ===
                    Math.ceil(filteredItems.length / itemsPerPage)
                  }
                >
                  Next
                </button>
              </div>
            ) : (
              ""
              )}
          </div>
        ) : (
          /* -----------------------------------------------job-seeker card-------------------------------------------------------- */
          <div className="col-span-3 bg-white p-4 rounded-sm">
            {isLoading ? (
              <p className="font-medium">Loading...</p>
            ) : jobseeker.length > 0 ? (
              <Applicants result={jobseeker} />
            ) : (
              <>
                <h3 className="text-lg font-bold mb-2">
                  {jobseeker.length} Applicant List
                </h3>
                <p>No data found!</p>
              </>
            )}

            {/* pagination here */}
            {result.length > 0 ? (
              <div className="flex justify-center mt-4 space-x-8">
                <button
                  onClick={previousPage}
                  className="hover:underline"
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="mx-2">
                  Page {currentPage} of{" "}
                  {Math.ceil(filteredItems.length / itemsPerPage)}{" "}
                </span>
                <button
                  onClick={nextPage}
                  className="hover:underline"
                  disabled={
                    currentPage ===
                    Math.ceil(filteredItems.length / itemsPerPage)
                  }
                >
                  Next
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
        )}

      </div>

      {/* <CreateJob/> */}
    </div>
  );
}

export default Home;
