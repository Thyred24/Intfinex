import React from 'react'
import DashboardTop from '@/components/dashboardTop'
import Dashboard from '@/components/dashboard'
import DashboardBottom from '@/components/dashboardBottom'

function DashboardContainer() {
  return (
    <>
      <DashboardTop />
      <Dashboard />
      <DashboardBottom />
    </>
  )
}
export default DashboardContainer
