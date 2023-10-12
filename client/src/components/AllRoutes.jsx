
import { Route, Routes } from 'react-router-dom'
import Navbar from './Navbar'
import Recipes from './Recipes'

const AllRoutes = () => {
    return (

        <div>
            <Navbar />
            <Routes>
                <Route path='/' element={<Recipes />} />
            </Routes>
        </div>
    )
}
export default AllRoutes
