import { useState } from 'react'

import UpdateElectron from '@/components/update'
import logoVite from './assets/logo-vite.svg'
import logoElectron from './assets/logo-electron.svg'
import MainPage from './pages/main'

function App() {
  return (
    <div className='App'>
        <MainPage />

      {/* <UpdateElectron /> */}
    </div>
  )
}

export default App