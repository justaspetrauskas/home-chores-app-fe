import React from 'react'
import Card from '../ui/Card'
import Input from '../ui/Input'
import Button from '../ui/Button'

type RoomCardProps = {
  roomName: string
  hasChanges: boolean
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  onNameChange: (value: string) => void
  onSave: () => void
  onDelete: () => void
}

const RoomCard: React.FC<RoomCardProps> = ({ roomName, hasChanges, icon: Icon, onNameChange, onSave, onDelete }) => {
  return (
    <Card className="aspect-square bg-stone-50/80 p-3 transition-[border-color,box-shadow,background-color] hover:border-amber-300 hover:bg-amber-50/50 hover:shadow-sm dark:bg-stone-800/80 dark:hover:border-amber-700 dark:hover:bg-amber-900/15">
      <div className="flex h-full flex-col justify-between gap-2">
        <div className="flex flex-col items-start gap-2">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
            <Icon className="size-7" />
          </div>

          <div className="min-w-0 w-full">
            <Input value={roomName} onChange={(event) => onNameChange(event.target.value)} className="h-8 text-xs" />
          </div>
        </div>

        <div className="flex gap-1">
          {hasChanges ? (
            <Button type="button" size="sm" variant="secondary" onClick={onSave}>
              Save
            </Button>
          ) : null}
          <Button type="button" size="sm" variant="danger" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default RoomCard
