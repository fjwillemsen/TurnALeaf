import { MemoryRouter as Router, Routes, Route } from 'react-router-dom'

import ProjectOverview from './pages/projectoverview'
import ProjectPage from './pages/project'
import ProjectCreate from './components/project/create'

export default function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<ProjectOverview />} />
                <Route path="/project" element={<ProjectPage />} />
            </Routes>
        </Router>
    )
}
