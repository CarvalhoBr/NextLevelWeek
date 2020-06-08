import React from 'react'
import { Route, BrowserRouter } from 'react-router-dom'

import Home from './pages/Home'
import CreateSpot from './pages/CreateSpot'

const Routes = () => {
    return (
        <BrowserRouter>
            <Route component={Home} path="/" exact/>
            <Route component={CreateSpot} path="/create-spot"/>
        </BrowserRouter>
    )

}

export default Routes