'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'
import { JobApplication, JobStatus } from '../types'
import { loadJobs, saveJobs, generateId } from '../utils/storage'
import apiClient from '@/config/axiosInstance'
import toast from 'react-hot-toast'

interface JobContextType {
  jobs: JobApplication[]
  addJob: (job: Omit<JobApplication, 'id' | 'lastUpdated'>) => void
  updateJob: (job: JobApplication) => void
  deleteJob: (id: string) => void
  getJob: (id: string) => Promise<JobApplication | undefined>
}

const JobContext = createContext<JobContextType | undefined>(undefined)

export const JobProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<JobApplication[]>([])

  useEffect(() => {
    loadJobs().then((loadedJobs) => setJobs(loadedJobs.applications))
  }, [])

  useEffect(() => {
    saveJobs(jobs)
  }, [jobs])

  const addJob = async (jobData: Omit<JobApplication, 'id' | 'lastUpdated'>) => {
    const newJob: JobApplication = {
      ...jobData,
      lastUpdated: new Date().toISOString(),
    }
    const response = await apiClient.post('/jobs', newJob)
    if (response.data.success) {
      toast.success('Job application added successfully!')
      loadJobs().then((loadedJobs) => setJobs(loadedJobs.applications))
    } else {
      console.error('Failed to add job:', response.data.message)
    }
  }

  const updateJob = async (updatedJob: JobApplication) => {
    const { _id, ...jobDataWithoutId } = updatedJob
    jobDataWithoutId.lastUpdated = new Date().toISOString()

    try {
      const response = await apiClient.put(`/jobs/${_id}`, jobDataWithoutId)
      if (response.data.success) {
        const loadedJobs = await loadJobs()
        setJobs(loadedJobs.applications)
        toast.success('Job application updated successfully!')
      } else {
        toast.error('Failed to update job application')
        console.error('Failed to update job:', response.data.message)
      }
    } catch (error) {
      console.error('Error updating job:', error)
      toast.error('An error occurred while updating the job application')
    }
  }

  const deleteJob = async (id: string) => {
    const updatedJobs = await apiClient.delete(`/jobs/${id}`)
    if (updatedJobs.data.success) {
      loadJobs().then((loadedJobs) => setJobs(loadedJobs.applications))
      toast.success('Job application deleted successfully!')
    } else {
      toast.error('Failed to delete job application')
      console.error('Failed to delete job:', updatedJobs.data.message)
    }
  }

  const getJob = async (id: string) => {
    try {
      const response = await apiClient.get(`/jobs/${id}`)
      if (response.data.success) {
        const job = response.data.data
        return {
          ...job,
          applicationDate: job.applicationDate || null,
          lastUpdated: job.lastUpdated || null,
        }
      }
      return undefined
    } catch (error) {
      console.error('Error fetching job:', error)
      return undefined
    }
  }
  return (
    <JobContext.Provider value={{ jobs, addJob, updateJob, deleteJob, getJob }}>
      {children}
    </JobContext.Provider>
  )
}

export const useJobs = (): JobContextType => {
  const context = useContext(JobContext)
  if (context === undefined) {
    throw new Error('useJobs must be used within a JobProvider')
  }
  return context
}
