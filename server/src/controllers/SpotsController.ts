import pool from '../database/database'
import { Request, Response } from 'express'

class SpotsController {
    
    async create(req: Request, res: Response) {
    
        const {
          nome,
          email,
          whatsapp,
          latitude,
          longitude,
          city,
          UF,
          items,
        } = req.body;

        const imagem = 'https://images.unsplash.com/photo-1481761289552-381112059e05?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60'
        const point = {
            imagem,
            nome,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            UF,
            items,
        }
    
        const response = await pool.query(
            "INSERT INTO spots (imagem, nome, email, whatsapp, latitude, longitude, city, UF) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id",
            [imagem, nome, email, whatsapp, latitude, longitude, city, UF]
        )
        const spotId = Number(response.rows[0].id)
    
        const point_items = items.map((itemId: Number) => {
            return {
                spotId,
                itemId
            }
        })
    
        for(var c=0; c < point_items.length; c++){
            await pool.query(
                "INSERT INTO spots_items (spot_id, item_id) VALUES($1, $2)",
                [point_items[c].spotId, point_items[c].itemId]
            )
        }
     
        res.json({
            id: spotId,
            ... point,
        })
    
    }

    async show(req: Request, res: Response){
        const { id } = req.params

        const spotData = await pool.query(
            "SELECT * FROM spots WHERE id = $1",
            [id]
        )

        if (!spotData.rows[0]){
            return res.status(400).json({ "message": "O ponto de coleta não foi encontrado" })
        }
        const spot = spotData.rows[0]


        const itemsData = await pool.query(
            "SELECT title FROM items INNER JOIN spots_items ON ( spots_items.item_id = items.id ) WHERE (spots_items.spot_id = $1)",
            [Number(spot.id)]
        )
        const items = itemsData.rows

    
        return res.json({
            spot,
            items
        })
    }

    async index(req: Request, res: Response){
        const { city, uf, items } = req.query
        const stringCity = String(city)
        const stringUf = String(uf)

        const parsedItems = String(items).split(',').map(item => Number(item.trim()))
        console.log(parsedItems)

        const spotsData = await pool.query(
            `SELECT DISTINCT spots.* FROM spots INNER JOIN spots_items ON (spots.id = spots_items.spot_id) WHERE spots_items.item_id IN (${items}) AND (spots.city = $1) AND (spots.UF = $2)`,
            [stringCity, stringUf]
        )
        const spots = spotsData.rows

        
        return res.json({res: spots})
    }

}

export default SpotsController