import { MemoryRouter as Router, Routes, Route } from 'react-router-dom'

import ProjectPage from '@ui/pages/project'
import ProjectOverview from '@ui/pages/projectoverview'

export default function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<ProjectOverview />} />
                <Route path='/project/:hash' element={<ProjectPage />} />
            </Routes>
        </Router>
    )
}
