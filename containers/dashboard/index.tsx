'use client'

import React, { useState } from 'react'
import DashboardTop from '@/components/dashboardTop'
import Dashboard from '@/components/dashboard'
import DashboardBottom from '@/components/dashboardBottom'
import FinancialRoom from '@/components/finencialRoom'

function DashboardContainer() {
  const [activeView, setActiveView] = useState('dashboard')

  return (
    <>
      <DashboardTop onViewChange={setActiveView} activeView={activeView} />
      {activeView === 'dashboard' ? (
        <>
          <Dashboard />
          <DashboardBottom />
        </>
      ) : (
        <FinancialRoom />
      )}
    </>
  )
}

export default DashboardContainer
