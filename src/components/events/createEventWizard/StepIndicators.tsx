import React from 'react'

type Props = {
  currentStep: number
}

function getStepLabelClass(currentStep: number, step: number) {
  if (currentStep === step) {
    return 'border-amber-500 bg-amber-100 text-amber-900 dark:border-amber-400 dark:bg-amber-900/40 dark:text-amber-200'
  }

  if (currentStep > step) {
    return 'border-emerald-400 bg-emerald-100 text-emerald-900 dark:border-emerald-500 dark:bg-emerald-900/30 dark:text-emerald-200'
  }

  return 'border-stone-300 bg-white text-stone-500 dark:border-stone-600 dark:bg-stone-700 dark:text-stone-300'
}

const StepIndicators: React.FC<Props> = ({ currentStep }) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {[1, 2, 3, 4].map((step) => (
        <span key={step} className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStepLabelClass(currentStep, step)}`}>
          Step {step}
        </span>
      ))}
    </div>
  )
}

export default StepIndicators
