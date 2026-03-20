import React from 'react'
import { CalendarDaysIcon, PlusIcon } from '@heroicons/react/24/outline'
import type { ComponentType, SVGProps } from 'react'
import Button from '../ui/Button'
import Card from '../ui/Card'

type EmptyStateCardProps = {
  title: string
  description: string
  actionLabel: string
  onAction: () => void
  Icon?: ComponentType<SVGProps<SVGSVGElement>>
}

const EmptyStateCard: React.FC<EmptyStateCardProps> = ({ title, description, actionLabel, onAction, Icon = CalendarDaysIcon }) => (
  <Card className="w-full p-0">
    <div className="rounded-xl bg-stone-50 p-8 md:p-12">
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-xl bg-amber-500 shadow-md">
          <Icon className="size-7 text-stone-900" />
        </div>
        <h2 className="mt-6 text-2xl font-bold text-stone-900">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-stone-500">{description}</p>
        <div className="mt-8 flex justify-center">
          <Button variant="primary" onClick={onAction} className="flex items-center gap-1.5">
            <PlusIcon className="size-4" />
            {actionLabel}
          </Button>
        </div>
      </div>
    </div>
  </Card>
)

export default EmptyStateCard