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
  <Card className="mb-6 border border-cyan-100 bg-white/90 shadow-sm">
    <CardHeader className="mb-0 pb-2">
      <CardTitle className="text-xl text-gray-900">{title}</CardTitle>
      <CardDescription className="text-sm text-gray-500">{description}</CardDescription>
    </CardHeader>
  </Card>
)

export default DashboardOverview