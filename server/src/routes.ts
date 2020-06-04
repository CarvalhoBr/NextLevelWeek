import express from 'express'
import pool from './database/database'

const routes = express.Router()

routes.get('/items', async (req, res) => { 
    
    const data = await pool.query('SELECT * FROM items')
    console.log(data.rows)
    const serializedItems = data.rows.map((item: { id: String, title: String; imagem: String}) => {
        return{
            id: Number(item.id),
            title: item.title,
            image_url: `http://localhost:3333/uploads/${item.imagem}` 
        }
    })

    return res.json(serializedItems)
})

routes.post('/spots', async(req, res) => {
    const { 
        imagem,
        nome,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        UF,
        items
    } = req.body
    const data = [imagem, nome, email, whatsapp, latitude, longitude, city, UF]
        
        //INSERINDO NOVO SPOT.
        try {
            var minhaVariavel
            const result = await pool.query(
            'INSERT INTO spots (imagem, nome, email, whatsapp, latitude, longitude, city, UF) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id', 
            data, async(err: any, ret: any) => {
                if (err){
                    throw err
                }else{
                    //console.log(ret.rows[0].id)
                    minhaVariavel = ret.rows[0].id
                }
            })
        } catch (error) {
            console.error(error)
        }
        
        res.json({"id": minhaVariavel})
       
})

export default routes