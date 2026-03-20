import React from 'react'
import Card from '../ui/Card'
import CardDescription from '../ui/CardDescription'
import CardHeader from '../ui/CardHeader'
import CardTitle from '../ui/CardTitle'

type DashboardOverviewProps = {
  title: string
  description: string
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ title, description }) => (
  <Card className="mb-6">
    <CardHeader className="mb-0 pb-2">
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
  </Card>
)

export default DashboardOverview