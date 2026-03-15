import React from 'react'
import { CalendarDaysIcon, PlusIcon } from '@heroicons/react/24/outline'
import Button from '../ui/Button'
import Card from '../ui/Card'

type EmptyStateCardProps = {
  title: string
  description: string
  actionLabel: string
  onAction: () => void
}

const EmptyStateCard: React.FC<EmptyStateCardProps> = ({ title, description, actionLabel, onAction }) => (
  <Card className="w-full rounded-3xl border border-cyan-100 bg-white/95 p-0 shadow-xl shadow-cyan-100/40">
    <div className="rounded-3xl bg-gradient-to-br from-cyan-50 via-white to-teal-50 p-8 md:p-12">
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-500 shadow-lg">
          <CalendarDaysIcon className="size-8 text-white" />
        </div>
        <h2 className="mt-6 text-2xl font-semibold text-gray-900">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-gray-500">{description}</p>
        <div className="mt-8 flex justify-center">
          <Button className="flex items-center bg-gradient-to-r from-cyan-500 to-teal-500 px-4 py-2 hover:from-cyan-600 hover:to-teal-600" onClick={onAction}>
            <PlusIcon className="mr-2 size-4" />
            {actionLabel}
          </Button>
        </div>
      </div>
    </div>
  </Card>
)

export default EmptyStateCard