'use client'
import React, { useState } from 'react'
import { Briefcase, Mail, Lock } from 'lucide-react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Cookies from 'js-cookie'
import apiClient from '@/config/axiosInstance'

const Login: React.FC = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    const response = await apiClient.post('/users/signin', {
      email,
      password,
    })
    if (response.data.success !== true) {
      setError('Invalid email or password')
      setIsLoading(false)
      return
    }
    const { token } = response.data.data
    if (token) {
      localStorage.setItem('token', token)
      apiClient.defaults.headers['x-access-token'] = token
      Cookies.set('token', token)
    }
    try {
      router.push('/')
    } catch (err) {
      setError('Invalid email or password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='flex justify-center'>
          <Briefcase className='h-12 w-12 text-blue-600' />
        </div>
        <h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-gray-900'>
          Sign in to JobTrack
        </h2>
        <p className='mt-2 text-center text-sm text-gray-600'>
          Or{' '}
          <Link href='/signup' className='font-medium text-blue-600 hover:text-blue-500'>
            create a new account
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
              id='email'
              name='email'
              type='email'
              label='Email address'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={20} className='text-gray-400' />}
              required
            />

            <Input
              id='password'
              name='password'
              type='password'
              label='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock size={20} className='text-gray-400' />}
              required
            />

            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <input
                  id='remember-me'
                  name='remember-me'
                  type='checkbox'
                  className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                />
                <label htmlFor='remember-me' className='ml-2 block text-sm text-gray-900'>
                  Remember me
                </label>
              </div>

              <div className='text-sm'>
                <a href='#' className='font-medium text-blue-600 hover:text-blue-500'>
                  Forgot your password?
                </a>
              </div>
            </div>

            <Button type='submit' fullWidth disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
