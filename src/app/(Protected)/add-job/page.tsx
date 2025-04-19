'use client'
import JobForm from '@/components/jobs/JobForm'
import { useJobs } from '@/context/JobContext'
import { useRouter } from 'next/navigation'
import React from 'react'

const AddJob: React.FC = () => {
  const { addJob } = useJobs()
  const router = useRouter()

  const handleAddJob = (jobData: any) => {
    addJob(jobData)
    router.push ('/')
  }

  return (
    <div className='max-w-3xl mx-auto'>
      <h1 className='text-2xl font-bold text-gray-900 mb-6'>Add New Job Application</h1>
      <div className='bg-white shadow-sm rounded-lg border border-gray-200 p-6'>
        <JobForm onSubmit={handleAddJob} />
      </div>
    </div>
  )
}

export default AddJob
