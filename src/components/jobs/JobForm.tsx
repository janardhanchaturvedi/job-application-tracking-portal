import React, { useState, useEffect } from 'react'
import { JobStatus, JobApplication } from '../../types'
import Input from '../ui/Input'
import Select from '../ui/Select'
import TextArea from '../ui/TextArea'
import Button from '../ui/Button'

const statusOptions = [
  { value: 'Applied', label: 'Applied' },
  { value: 'Interview Scheduled', label: 'Interview Scheduled' },
  { value: 'Rejected', label: 'Rejected' },
  { value: 'Offer Received', label: 'Offer Received' },
]

interface JobFormProps {
  initialValues?: JobApplication
  onSubmit: (jobData: Omit<JobApplication, 'id' | 'lastUpdated'>) => void
  isLoading?: boolean
}

const JobForm: React.FC<JobFormProps> = ({ initialValues, onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState<Omit<JobApplication, 'id' | 'lastUpdated'>>({
    jobTitle: '',
    company: '',
    applicationDate: new Date().toISOString().split('T')[0],
    status: 'Applied' as JobStatus,
    jobLink: '',
    notes: '',
    interviews: [],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialValues) {
      setFormData(initialValues)
    }
  }, [initialValues])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      status: value as JobStatus,
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = 'Job title is required'
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required'
    }

    if (!formData.applicationDate) {
      newErrors.applicationDate = 'Application date is required'
    }

    if (formData.jobLink && !isValidUrl(formData.jobLink)) {
      newErrors.jobLink = 'Please enter a valid URL'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch (error) {
      return false
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Input
          id='jobTitle'
          name='jobTitle'
          label='Job Title'
          placeholder='Software Engineer'
          value={formData.jobTitle}
          onChange={handleChange}
          error={errors.jobTitle}
          required
        />

        <Input
          id='company'
          name='company'
          label='Company'
          placeholder='Acme Inc.'
          value={formData.company}
          onChange={handleChange}
          error={errors.company}
          required
        />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Input
          id='applicationDate'
          name='applicationDate'
          label='Application Date'
          type='date'
          value={formData.applicationDate}
          onChange={handleChange}
          error={errors.applicationDate}
          required
        />

        <Select
          id='status'
          name='status'
          label='Application Status'
          options={statusOptions}
          value={formData.status}
          onChange={handleStatusChange}
          error={errors.status}
          required
        />
      </div>

      <Input
        id='jobLink'
        name='jobLink'
        label='Job Posting URL'
        placeholder='https://example.com/job-details-posting'
        value={formData.jobLink}
        onChange={handleChange}
        error={errors.jobLink}
      />

      <TextArea
        id='notes'
        name='notes'
        label='Notes'
        placeholder='Add any relevant details about the application...'
        value={formData.notes}
        onChange={handleChange}
        error={errors.notes}
        rows={4}
      />

      <div className='flex justify-end space-x-3'>
        <Button type='button' variant='outline' onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button type='submit' disabled={isLoading}>
          {isLoading ? 'Saving...' : initialValues ? 'Update Application' : 'Add Application'}
        </Button>
      </div>
    </form>
  )
}

export default JobForm
