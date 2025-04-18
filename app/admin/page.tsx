'use client'

import AdminContainer from '@/containers/admin'
import AdminLogin from '@/components/admin/login'
import React, { useEffect, useState } from 'react'

function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuthenticated');
    setIsAuthenticated(adminAuth === 'true');
  }, []);

  return isAuthenticated ? <AdminContainer /> : <AdminLogin />;
}

export default AdminPage
