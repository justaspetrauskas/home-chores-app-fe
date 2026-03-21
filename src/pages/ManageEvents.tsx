import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

const ManageEvents: React.FC = () => {
  const navigate = useNavigate()
  const { householdId } = useParams<{ householdId: string }>()

  return (
    <Card className="mb-6">
      <Button variant="secondary" onClick={() => navigate(`/households/${householdId}`)}>
        Return
      </Button>
    </Card>
  )
}

export default ManageEvents
