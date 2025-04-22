'use client'
import React, { useEffect, useState } from 'react'
import { Calendar, Building2, Link as LinkIcon, Edit2, Trash2 } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useJobs } from '@/context/JobContext'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Link from 'next/link'
import { JobApplication } from '@/types'

const JobDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { getJob, deleteJob } = useJobs()
  const router = useRouter()
  const [job, setJob] = useState<JobApplication | undefined>(undefined)

  useEffect(() => {
    if (id) {
      getJob(id)
        .then(setJob)
        .catch((error) => {
          console.error('Error fetching job:', error)
        })
    }
  }, [id, getJob])

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      id && deleteJob(id)
      router.push('/')
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Invalid Date'
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
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
      <div className='mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <div className='flex items-center mb-2'>
            <h1 className='text-2xl font-bold text-gray-900 mr-3'>{job.jobTitle}</h1>
            <Badge status={job.status} />
          </div>
          <div className='flex items-center text-gray-600'>
            <Building2 size={18} className='mr-2' />
            <span>{job.company}</span>
          </div>
        </div>

        <div className='flex space-x-3'>
          <Link href={`/edit-job/${job._id}`}>
            <Button variant='outline' className='flex items-center'>
              <Edit2 size={16} className='mr-2' />
              Edit
            </Button>
          </Link>
          <Button variant='danger' className='flex items-center' onClick={handleDelete}>
            <Trash2 size={16} className='mr-2' />
            Delete
          </Button>
        </div>
      </div>

      <div className='bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden'>
        <div className='border-b border-gray-200 bg-gray-50 px-6 py-4'>
          <h2 className='text-lg font-medium text-gray-900'>Application Details</h2>
        </div>

        <div className='p-6'>
          <dl className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4'>
            <div>
              <dt className='text-sm font-medium text-gray-500'>Company</dt>
              <dd className='mt-1 text-gray-900'>{job.company}</dd>
            </div>

            <div>
              <dt className='text-sm font-medium text-gray-500'>Application Date</dt>
              <dd className='mt-1 text-gray-900 flex items-center'>
                <Calendar size={16} className='mr-2 text-gray-500' />
                {formatDate(job.applicationDate)}
              </dd>
            </div>

            <div>
              <dt className='text-sm font-medium text-gray-500'>Status</dt>
              <dd className='mt-1'>
                <Badge status={job.status} />
              </dd>
            </div>

            <div>
              <dt className='text-sm font-medium text-gray-500'>Last Updated</dt>
              <dd className='mt-1 text-gray-900'>{formatDate(job.lastUpdated)}</dd>
            </div>

            {job.jobLink && (
              <div className='col-span-2'>
                <dt className='text-sm font-medium text-gray-500'>Job Link</dt>
                <dd className='mt-1'>
                  <a
                    href={job.jobLink}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-blue-600 hover:text-blue-800 flex items-center'
                  >
                    <LinkIcon size={16} className='mr-2' />
                    {job.jobLink}
                  </a>
                </dd>
              </div>
            )}

            {job.notes && (
              <div className='col-span-2 mt-2'>
                <dt className='text-sm font-medium text-gray-500'>Notes</dt>
                <dd className='mt-1 text-gray-900 bg-gray-50 p-4 rounded border border-gray-200 whitespace-pre-line'>
                  {job.notes}
                </dd>
              </div>
            )}
          </dl>
        </div>

        <div className='bg-gray-50 px-6 py-4 border-t border-gray-200'>
          <Link href='/' className='text-blue-600 hover:text-blue-800'>
            &larr; Back to all applications
          </Link>
        </div>
      </div>
    </div>
  )
}

export default JobDetails
