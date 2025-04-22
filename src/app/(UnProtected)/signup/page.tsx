'use client'
import React, { use, useState } from 'react'
import { Briefcase, Mail, Lock, User } from 'lucide-react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import apiClient from '@/config/axiosInstance'

const Signup: React.FC = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('') // Clear any previous errors

    if (!validateForm()) {
      return
    }

    setIsLoading(true) // Show loading state during API call

    try {
      const response = await apiClient.post('/users/signup', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      })

      if (!response.data.success) {
        setError(response.data.message ?? 'Failed to create account')
        return
      }

      // Navigate to the login page on successful signup
      router.push('/login')
    } catch (err: any) {
      // Handle Axios error
      const errorMessage = err.response?.data?.message ?? err.message ?? 'Failed to create account'
      setError(errorMessage)
      console.error('Signup error:', err)
    } finally {
      setIsLoading(false) // Always reset loading state
    }
  }

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='flex justify-center'>
          <Briefcase className='h-12 w-12 text-blue-600' />
        </div>
        <h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-gray-900'>
          Create your account
        </h2>
        <p className='mt-2 text-center text-sm text-gray-600'>
          Already have an account?{' '}
          <Link href='/login' className='font-medium text-blue-600 hover:text-blue-500'>
            Sign in
          </Link>
        </p>
      </div>

      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='bg-white py-8 px-4 shadow-sm rounded-lg sm:px-10 border border-gray-200'>
          <form className='space-y-6' onSubmit={handleSubmit}>
            {error && (
              <div className='bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm'>
                {error}
              </div>
            )}
            <Input
              id='username'
              name='username'
              type='text'
              label='Username'
              value={formData.username}
              onChange={handleChange}
              icon={<User size={20} className='text-gray-400' />}
              required
            />
            <Input
              id='email'
              name='email'
              type='email'
              label='Email address'
              value={formData.email}
              onChange={handleChange}
              icon={<Mail size={20} className='text-gray-400' />}
              required
            />

            <Input
              id='password'
              name='password'
              type='password'
              label='Password'
              value={formData.password}
              onChange={handleChange}
              icon={<Lock size={20} className='text-gray-400' />}
              required
            />

            <Input
              id='confirmPassword'
              name='confirmPassword'
              type='password'
              label='Confirm password'
              value={formData.confirmPassword}
              onChange={handleChange}
              icon={<Lock size={20} className='text-gray-400' />}
              required
            />

            <Button type='submit' fullWidth disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <div className='mt-6'>
            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-300' />
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-2 bg-white text-gray-500'>
                  By signing up, you agree to our terms and conditions
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
