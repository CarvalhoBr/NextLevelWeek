import express from 'express'

import SpotsController from './controllers/SpotsController'
import ItemsController from './controllers/ItemsController'

const routes = express.Router()

const spotsController = new SpotsController
const itemsController = new ItemsController

routes.get('/items', itemsController.index)

routes.post("/spots", spotsController.create)
routes.get("/spots/:id", spotsController.show)
routes.get("/spots/", spotsController.index)


export default routes