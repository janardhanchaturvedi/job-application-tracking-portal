import React, { useState } from 'react'
import { JobApplication, Filter, JobStatus } from '../../types'
import JobCard from '../jobs/JobCard'
import { Search, Calendar, X, SlidersHorizontal, ArrowUp, ArrowDown } from 'lucide-react'
import Button from '../ui/Button'

interface JobListProps {
  jobs: JobApplication[]
  onDelete: (id: string) => void
}

const JobList: React.FC<JobListProps> = ({ jobs, onDelete }) => {
  const [filter, setFilter] = useState<Filter>({
    status: 'All',
    searchTerm: '',
    sortBy: 'applicationDate',
    sortDirection: 'desc',
    dateRange: null,
  })

  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const handleStatusFilter = (status: JobStatus | 'All') => {
    setFilter((prev) => ({ ...prev, status }))
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter((prev) => ({ ...prev, searchTerm: e.target.value }))
  }

  const handleDateRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFilter((prev) => ({
      ...prev,
      dateRange: {
        ...(prev.dateRange || { start: '', end: '' }),
        [name]: value,
      },
    }))
  }

  const handleClearFilters = () => {
    setFilter({
      status: 'All',
      searchTerm: '',
      sortBy: 'applicationDate',
      sortDirection: 'desc',
      dateRange: null,
    })
  }

  const handleSort = (sortBy: Filter['sortBy']) => {
    setFilter((prev) => ({
      ...prev,
      sortBy,
      sortDirection: prev.sortBy === sortBy && prev.sortDirection === 'desc' ? 'asc' : 'desc',
    }))
  }

  const filteredJobs = jobs.filter((job) => {
    if (filter.status !== 'All' && job.status !== filter.status) {
      return false
    }

    if (filter.searchTerm) {
      const searchTerm = filter.searchTerm.toLowerCase()
      const matchesTitle = job.jobTitle.toLowerCase().includes(searchTerm)
      const matchesCompany = job.company.toLowerCase().includes(searchTerm)
      const matchesNotes = job.notes.toLowerCase().includes(searchTerm)

      if (!matchesTitle && !matchesCompany && !matchesNotes) {
        return false
      }
    }

    if (filter.dateRange && filter.dateRange.start && filter.dateRange.end) {
      const jobDate = new Date(job.applicationDate)
      const startDate = new Date(filter.dateRange.start)
      const endDate = new Date(filter.dateRange.end)
      endDate.setHours(23, 59, 59, 999)

      if (jobDate < startDate || jobDate > endDate) {
        return false
      }
    }

    return true
  })

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    let comparison = 0

    switch (filter.sortBy) {
      case 'applicationDate':
        comparison = new Date(a.applicationDate).getTime() - new Date(b.applicationDate).getTime()
        break
      case 'company':
        comparison = a.company.localeCompare(b.company)
        break
      case 'jobTitle':
        comparison = a.jobTitle.localeCompare(b.jobTitle)
        break
      case 'status':
        comparison = a.status.localeCompare(b.status)
        break
      default:
        comparison = 0
    }

    return filter.sortDirection === 'asc' ? comparison : -comparison
  })

  const statusOptions: (JobStatus | 'All')[] = [
    'All',
    'Applied',
    'Interview Scheduled',
    'Rejected',
    'Offered',
  ]

  return (
    <div className='space-y-6'>
      <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4'>
          <div className='relative flex-grow max-w-md'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <Search size={18} className='text-gray-400' />
            </div>
            <input
              type='text'
              placeholder='Search jobs...'
              className='pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              value={filter.searchTerm}
              onChange={handleSearch}
            />
          </div>

          <div className='flex items-center space-x-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className='flex items-center'
            >
              <SlidersHorizontal size={16} className='mr-1' />
              Filters
            </Button>

            {(filter.status !== 'All' || filter.searchTerm || filter.dateRange) && (
              <Button
                variant='outline'
                size='sm'
                onClick={handleClearFilters}
                className='flex items-center text-gray-600'
              >
                <X size={16} className='mr-1' />
                Clear
              </Button>
            )}
          </div>
        </div>

        {isFilterOpen && (
          <div className='mt-4 mb-2 p-4 border border-gray-200 rounded-md bg-gray-50'>
            <h3 className='text-sm font-medium text-gray-900 mb-3'>Filter Options</h3>
            <div className='flex flex-wrap gap-3 mb-4'>
              {statusOptions.map((status) => (
                <button
                  key={status}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    filter.status === status
                      ? 'bg-blue-100 border-blue-300 text-blue-800'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => handleStatusFilter(status)}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Date Range</label>
                <div className='flex items-center space-x-2'>
                  <div className='flex-1'>
                    <label className='text-xs text-gray-500'>From</label>
                    <input
                      type='date'
                      name='start'
                      className='w-full border border-gray-300 rounded-md p-1.5 text-sm'
                      value={filter.dateRange?.start || ''}
                      onChange={handleDateRangeChange}
                    />
                  </div>
                  <div className='flex-1'>
                    <label className='text-xs text-gray-500'>To</label>
                    <input
                      type='date'
                      name='end'
                      className='w-full border border-gray-300 rounded-md p-1.5 text-sm'
                      value={filter.dateRange?.end || ''}
                      onChange={handleDateRangeChange}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Sort By</label>
                <div className='flex flex-wrap gap-2'>
                  {[
                    { id: 'applicationDate', label: 'Date' },
                    { id: 'company', label: 'Company' },
                    { id: 'jobTitle', label: 'Title' },
                    { id: 'status', label: 'Status' },
                  ].map((option) => (
                    <button
                      key={option.id}
                      className={`px-3 py-1 text-sm rounded-md border flex items-center ${
                        filter.sortBy === option.id
                          ? 'bg-blue-100 border-blue-300 text-blue-800'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => handleSort(option.id as Filter['sortBy'])}
                    >
                      {option.label}
                      {filter.sortBy === option.id &&
                        (filter.sortDirection === 'asc' ? (
                          <ArrowUp size={14} className='ml-1' />
                        ) : (
                          <ArrowDown size={14} className='ml-1' />
                        ))}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {sortedJobs.length === 0 ? (
        <div className='p-8 text-center bg-white rounded-lg shadow-sm border border-gray-200'>
          <Calendar className='h-12 w-12 text-gray-400 mx-auto mb-4' />
          <h3 className='text-lg font-medium text-gray-900 mb-1'>No applications found</h3>
          <p className='text-gray-500'>
            {jobs.length === 0
              ? "You haven't added any job applications yet."
              : 'No applications match your filter criteria.'}
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {sortedJobs.map((job) => (
            <div key={job._id}>
              <JobCard job={job} onDelete={onDelete} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default JobList
