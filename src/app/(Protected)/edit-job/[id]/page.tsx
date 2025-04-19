'use client'
import JobForm from '@/components/jobs/JobForm'
import Button from '@/components/ui/Button'
import { useJobs } from '@/context/JobContext'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'

const EditJob: React.FC = () => {
  const { getJob, updateJob } = useJobs()
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const job = id ? getJob(id) : undefined

  const handleUpdateJob = (jobData: any) => {
    if (id) {
      updateJob({ ...jobData, id })
      router.push(`/job-details/${id}`)
    }
  }

  if (!job) {
    return (
      <div className='max-w-3xl mx-auto text-center'>
        <h1 className='text-2xl font-bold text-gray-900 mb-4'>Job Not Found</h1>
        <p className='text-gray-600 mb-6'>
          The job application you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => router.push('/')}>Return to Dashboard</Button>
      </div>
    )
  }

  return (
    <div className='max-w-3xl mx-auto'>
      <h1 className='text-2xl font-bold text-gray-900 mb-6'>Edit Job Application</h1>
      <div className='bg-white shadow-sm rounded-lg border border-gray-200 p-6'>
        <JobForm initialValues={job} onSubmit={handleUpdateJob} />
      </div>
    </div>
  )
}

export default EditJob
