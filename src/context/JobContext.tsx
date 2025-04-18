import React, { createContext, useContext, useState, useEffect } from 'react';
import { JobApplication, JobStatus } from '../types';
import { loadJobs, saveJobs, generateId } from '../utils/storage';

interface JobContextType {
  jobs: JobApplication[];
  addJob: (job: Omit<JobApplication, 'id' | 'lastUpdated'>) => void;
  updateJob: (job: JobApplication) => void;
  deleteJob: (id: string) => void;
  getJob: (id: string) => JobApplication | undefined;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<JobApplication[]>([]);

  // Load jobs from localStorage on initial render
  useEffect(() => {
    setJobs(loadJobs());
  }, []);

  // Save jobs to localStorage whenever they change
  useEffect(() => {
    saveJobs(jobs);
  }, [jobs]);

  const addJob = (jobData: Omit<JobApplication, 'id' | 'lastUpdated'>) => {
    const newJob: JobApplication = {
      ...jobData,
      id: generateId(),
      lastUpdated: new Date().toISOString(),
    };
    setJobs((prevJobs) => [...prevJobs, newJob]);
  };

  const updateJob = (updatedJob: JobApplication) => {
    updatedJob.lastUpdated = new Date().toISOString();
    setJobs((prevJobs) =>
      prevJobs.map((job) => (job.id === updatedJob.id ? updatedJob : job))
    );
  };

  const deleteJob = (id: string) => {
    setJobs((prevJobs) => prevJobs.filter((job) => job.id !== id));
  };

  const getJob = (id: string) => {
    return jobs.find((job) => job.id === id);
  };

  return (
    <JobContext.Provider value={{ jobs, addJob, updateJob, deleteJob, getJob }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = (): JobContextType => {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};