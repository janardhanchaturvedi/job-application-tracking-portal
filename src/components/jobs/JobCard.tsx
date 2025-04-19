import React from 'react'
import { Calendar, Building2, Link as LinkIcon, MoreVertical } from 'lucide-react'
import { JobApplication } from '../../types'
import Badge from '../ui/Badge'
import Link from 'next/link'

interface JobCardProps {
  job: JobApplication
  onDelete: (id: string) => void
}

const JobCard: React.FC<JobCardProps> = ({ job, onDelete }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date)
  }

  return (
    <div className='bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300'>
      <div className='p-5'>
        <div className='flex justify-between items-start mb-2'>
          <h3 className='font-semibold text-lg text-gray-900 mb-1 line-clamp-1'>{job.jobTitle}</h3>
          <div className='flex items-center'>
            <Badge status={job.status} />
            <div className='relative ml-2 group'>
              <button className='p-1 rounded-full hover:bg-gray-100'>
                <MoreVertical size={16} className='text-gray-500' />
              </button>
              <div className='absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 invisible group-hover:visible z-10'>
                <Link
                  href={`/edit-job/${job.id}`}
                  className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                >
                  Edit
                </Link>
                <button
                  onClick={() => onDelete(job.id)}
                  className='block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100'
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className='flex items-center text-gray-500 mb-2'>
          <Building2 size={16} className='mr-2' />
          <span className='text-sm'>{job.company}</span>
        </div>

        <div className='flex items-center text-gray-500 mb-3'>
          <Calendar size={16} className='mr-2' />
          <span className='text-sm'>Applied on {formatDate(job.applicationDate)}</span>
        </div>

        {job.notes && <p className='text-sm text-gray-600 mb-3 line-clamp-2'>{job.notes}</p>}

        <div className='flex justify-between items-center pt-2 border-t border-gray-100'>
          {job.jobLink ? (
            <a
              href={job.jobLink}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center text-sm text-blue-600 hover:text-blue-800'
            >
              <LinkIcon size={14} className='mr-1' />
              View Job Posting
            </a>
          ) : (
            <span className='text-sm text-gray-400'>No job link</span>
          )}
          <Link
            href={`/job-details/${job.id}`}
            className='text-sm text-blue-600 hover:text-blue-800'
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default JobCard
