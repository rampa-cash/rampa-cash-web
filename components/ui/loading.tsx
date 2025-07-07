import React from 'react'
import { cn } from '@/lib/utils'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'spinner' | 'dots' | 'pulse'
  className?: string
  text?: string
}

const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  variant = 'spinner',
  className,
  text
}): JSX.Element => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  const Spinner = (): JSX.Element => (
    <div className={cn(
      'animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600',
      sizeClasses[size]
    )} />
  )

  const Dots = (): JSX.Element => (
    <div className="flex space-x-1">
      <div className={cn(
        'bg-indigo-600 rounded-full animate-bounce',
        size === 'sm' ? 'w-1 h-1' : size === 'md' ? 'w-2 h-2' : 'w-3 h-3'
      )} style={{ animationDelay: '0ms' }} />
      <div className={cn(
        'bg-indigo-600 rounded-full animate-bounce',
        size === 'sm' ? 'w-1 h-1' : size === 'md' ? 'w-2 h-2' : 'w-3 h-3'
      )} style={{ animationDelay: '150ms' }} />
      <div className={cn(
        'bg-indigo-600 rounded-full animate-bounce',
        size === 'sm' ? 'w-1 h-1' : size === 'md' ? 'w-2 h-2' : 'w-3 h-3'
      )} style={{ animationDelay: '300ms' }} />
    </div>
  )

  const Pulse = (): JSX.Element => (
    <div className={cn(
      'bg-indigo-600 rounded-full animate-pulse',
      sizeClasses[size]
    )} />
  )

  const renderLoader = (): JSX.Element => {
    switch (variant) {
      case 'dots':
        return <Dots />
      case 'pulse':
        return <Pulse />
      default:
        return <Spinner />
    }
  }

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="flex flex-col items-center space-y-2">
        {renderLoader()}
        {text && (
          <p className="text-sm text-gray-600 animate-pulse">{text}</p>
        )}
      </div>
    </div>
  )
}

export default Loading 