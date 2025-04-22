import apiClient from '@/config/axiosInstance'
import { JobApplication } from '../types'

export const loadJobs = async (): Promise<any> => {
  try {
    const savedJobs = await apiClient.get('/jobs')
    if (savedJobs.data.success) {
      return savedJobs.data.data
    }
    return []
  } catch (error) {
    console.error('Error loading jobs from localStorage:', error)
    return Promise.resolve([])
  }
}

// Save jobs to localStorage
export const saveJobs = (jobs: JobApplication[]): void => {
  try {
    localStorage.setItem('jobApplications', JSON.stringify(jobs))
  } catch (error) {
    console.error('Error saving jobs to localStorage:', error)
  }
}

// Generate random ID for new job applications
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11)
}

// Get statistics from job applications
export const getStatistics = (jobs: JobApplication[]) => {
  const totalJobs = jobs.length
  const statusCounts = jobs?.reduce(
    (acc, job) => {
      acc[job.status] = (acc[job.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Applications per month
  const monthlyApplications = jobs?.reduce(
    (acc, job) => {
      const month = job?.applicationDate?.substring(0, 7) // YYYY-MM
      acc[month] = (acc[month] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Sort months chronologically
  const sortedMonths = Object.keys(monthlyApplications).sort()

  return {
    totalJobs,
    statusCounts,
    monthlyApplications: sortedMonths.map((month) => ({
      month,
      count: monthlyApplications[month],
    })),
  }
}
