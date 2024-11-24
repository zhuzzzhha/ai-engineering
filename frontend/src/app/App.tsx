import { CircularProgress } from '@mui/material'
import { MainLayout } from './layout'
import { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { routes } from './routes'
function App() {
  return (
    <MainLayout>
      <Suspense fallback={<CircularProgress sx={{ margin: 'auto' }} />}>
        <Routes>
          {
            routes.map((route) => {
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    route.component
                  }
                />
              )
            })
          }
        </Routes>
      </Suspense>
    </MainLayout>
  )
}

export default App
