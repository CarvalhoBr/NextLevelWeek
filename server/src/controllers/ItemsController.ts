import { Request, Response} from 'express'
import pool from '../database/database'

class ItemsController {
    
    async index(req: Request, res: Response){
        const data = await pool.query('SELECT * FROM items')
        const serializedItems = data.rows.map((item: { id: String, title: String; imagem: String}) => {
            return{
                id: Number(item.id),
                title: item.title,
                image_url: `http://localhost:3333/uploads/${item.imagem}` 
            }
        })

    return res.json(serializedItems)
    }
}

export default ItemsController