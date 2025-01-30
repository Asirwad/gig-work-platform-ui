import React from 'react'

export const SubmittedBadge = () => {
  return (
    <div class="ml-auto mt-5">
          <div
            class="flex items-center gap-1 rounded-full bg-indigo-500/10 px-3 py-1"
          >
            <svg
              stroke="currentColor"
              viewBox="0 0 24 24"
              fill="none"
              class="h-4 w-4 text-indigo-500"
            >
              <path
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                stroke-width="2"
                stroke-linejoin="round"
                stroke-linecap="round"
              ></path>
            </svg>
            <span class="text-sm font-medium text-indigo-500">Submitted</span>
          </div>
        </div>
  )
}
