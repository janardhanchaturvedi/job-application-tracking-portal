'use client'
import JobList from '@/components/dashboard/JobList'
import StatsCard from '@/components/dashboard/StatsCard'
import Button from '@/components/ui/Button'
import { useJobs } from '@/context/JobContext'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Dashboard: React.FC = () => {
  const { jobs, deleteJob } = useJobs()

  const handleDeleteJob = (id: string) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      deleteJob(id)
    }
  }

  return (
    <>
      <div className='mb-6 flex items-center justify-between'>
        <h1 className='text-2xl font-bold text-gray-900'>Job Applications</h1>
        <Link href='/add-job'>
          <Button className='flex items-center'>
            <PlusCircle size={18} className='mr-2' />
            Add Application
          </Button>
        </Link>
      </div>

      <div className='mb-8'>
        <StatsCard />
      </div>

      <JobList jobs={jobs} onDelete={handleDeleteJob} />
    </>
  )
}

export default Dashboard
