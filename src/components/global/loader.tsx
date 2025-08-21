// src/components/global/loader.tsx
import { useEffect, useState } from 'react'
import { Progress } from '@/components/ui/shadcn/progress'

const Loader = () => {
  const [progress, setProgress] = useState(15)
  const [isFetching] = useState(true)

  useEffect(() => {
    if (!isFetching && progress >= 100) return

    const timer = setInterval(() => {
      setProgress((prevProgress: number) => {
        if (prevProgress >= 95) return prevProgress
        return Math.min(prevProgress + Math.floor(Math.random() * 5) + 1, 95)
      })
    }, 10)

    return () => clearInterval(timer)
  }, [isFetching, progress])

  useEffect(() => {
    if (!isFetching) {
      setProgress(100)
    }
  }, [isFetching])

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4'>
      <div className='rounded-xl shadow-lg p-6 max-w-md w-full border'>
        <div className='flex justify-center mb-6'>
          <div className='relative'>
            <svg
              className='w-24 h-24 text-blue-500'
              viewBox='0 0 511.998 511.998'
              xmlns='http://www.w3.org/2000/svg'
            >
              <g>
                <path
                  d='M292.749,16.905c-23.012,11.931-50.491,11.928-73.501,0C119.821-34.64,0.538,37.98,0.538,150.02 c0,70.51,58.455,361.978,149.849,361.978c32.059,0,61.235-32.705,89.198-99.983c6.045-14.544,26.783-14.548,32.828,0 c27.963,67.278,57.138,99.983,89.198,99.983c90.498,0,149.849-289.225,149.849-361.978 C511.458,38.017,392.217-34.662,292.749,16.905z M361.609,485.317c-18.961,0-42.491-30.449-64.556-83.543 c-15.163-36.478-66.94-36.496-82.109,0.002c-22.064,53.091-45.595,83.541-64.556,83.541 c-58.446,0-123.166-252.499-123.166-335.295c0-92.19,98.156-151.721,179.746-109.427c30.702,15.916,67.36,15.916,98.062,0 c81.506-42.253,179.744,17.15,179.744,109.427C484.775,232.462,420.098,485.317,361.609,485.317z'
                  fill='currentColor'
                />
                <path
                  d='M435.855,136.679c-7.368,0-13.342,5.972-13.342,13.342c0,22.275-9.158,85.64-29.516,156.764 c-2.028,7.082,2.071,14.47,9.154,16.496c7.053,2.028,14.464-2.049,16.497-9.154c21.069-73.606,30.546-140.273,30.546-164.105 C449.197,142.652,443.223,136.679,435.855,136.679z'
                  fill='currentColor'
                />
                <path
                  d='M150.388,62.434c-48.295,0-87.588,39.291-87.588,87.586c0,7.37,5.974,13.342,13.342,13.342s13.342-5.972,13.342-13.342 c0-33.582,27.32-60.902,60.904-60.902c7.368,0,13.342-5.972,13.342-13.342S157.756,62.434,150.388,62.434z'
                  fill='currentColor'
                />
              </g>
            </svg>
            <line
              x1='100'
              y1='250'
              x2='400'
              y2='250'
              stroke='#3B82F6'
              strokeWidth='6'
              strokeDasharray='15,8'
            >
              <animate
                attributeName='y1'
                values='150;350;150'
                dur='2s'
                repeatCount='indefinite'
              />
              <animate
                attributeName='y2'
                values='150;350;150'
                dur='2s'
                repeatCount='indefinite'
              />
            </line>
            <circle
              cx='256'
              cy='250'
              r='180'
              fill='none'
              stroke='#3B82F6'
              strokeWidth='3'
            >
              <animate
                attributeName='r'
                values='180;200;180'
                dur='1.5s'
                repeatCount='indefinite'
              />
              <animate
                attributeName='opacity'
                values='0.6;0.2;0.6'
                dur='1.5s'
                repeatCount='indefinite'
              />
            </circle>
          </div>
        </div>
        <h2 className='text-xl font-bold text-center text-foreground mb-2'>
          Mendeteksi Kelainan Gigi
        </h2>
        <div className='flex justify-center mb-4'>
          <div className='space-y-2 w-full max-w-xs'>
            <div className='flex items-center justify-between text-sm text-foreground/70'>
              <span>Loading</span>
              <span className='font-medium'>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className='w-full' />
          </div>
        </div>
        <div className='flex justify-center space-x-2'>
          <div
            className='w-3 h-3 rounded-full bg-blue-500 animate-bounce'
            style={{ animationDelay: '0ms' }}
          ></div>
          <div
            className='w-3 h-3 rounded-full bg-blue-500 animate-bounce'
            style={{ animationDelay: '150ms' }}
          ></div>
          <div
            className='w-3 h-3 rounded-full bg-blue-500 animate-bounce'
            style={{ animationDelay: '300ms' }}
          ></div>
        </div>
      </div>
    </div>
  )
}

export { Loader }