import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Label from '../ui/Label'
import ToastMessage from '../ui/ToastMessage'
import { useCreateHouseholdMutation } from '../../hooks/useCreateHouseholdMutation'
import CreateRooms from './CreateRooms'

type CreatedHousehold = { id: string; name: string }

const CreateHousehold: React.FC = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [created, setCreated] = useState<CreatedHousehold | null>(null)
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const mutation = useCreateHouseholdMutation()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (name.trim().length < 3) return
    try {
      const result = await mutation.mutateAsync({ name: name.trim() })
      if (result.id) {
        setCreated({ id: result.id, name: result.name ?? name.trim() })
        setShowSuccessToast(true)
      } else {
        navigate('/households')
      }
    } catch {
      // error displayed from mutation.error
    }
  }

  return (
    <Card className="p-8 md:p-10">
      <ToastMessage
        open={showSuccessToast}
        title={`${created?.name ?? 'Household'} was created successfully`}
        onClose={() => setShowSuccessToast(false)}
        variant="success"
        durationMs={3500}
      />

      <div className="space-y-1 mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">Household Setup</p>
        <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">Create a household</h1>
        <p className="text-sm leading-6 text-stone-500 dark:text-stone-400">
          Give your household a name. You can invite members and create rooms after it is created.
        </p>
      </div>

      {!created ? (
        <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
          <div className="space-y-2">
            <Label htmlFor="household-name">Household name</Label>
            <Input
              id="household-name"
              type="text"
              placeholder="e.g. The Johnson Home"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-11"
            />
          </div>

          {mutation.isError && (
            <p className="text-sm text-rose-600 dark:text-rose-400">
              {mutation.error instanceof Error ? mutation.error.message : 'Something went wrong'}
            </p>
          )}

          <div className="flex gap-3">
            <Button
              type="submit"
              variant="primary"
              disabled={mutation.isPending || name.trim().length < 3}
            >
              {mutation.isPending ? 'Creating...' : 'Create household'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/households')}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-2">
          <CreateRooms householdId={created.id} householdName={created.name} />

          <div className="pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/households')}
            >
              Done
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}

export default CreateHousehold