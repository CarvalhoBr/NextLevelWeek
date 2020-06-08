import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { Map, TileLayer, Marker } from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet'

import api from '../../services/api'
import axios from 'axios'

import './styles.css'
import logo from '../../assets/logo.svg'


const CreateSpot = () => {

    interface itemTypes{
        id: number,
        title: string,
        image_url: string
    }

    interface ufsTypes{
        id: number,
        sigla: string,
        nome: string,
        regiao: {
            id: number,
            sigla: string,
            nome: string
        }
    }

    interface cityType{
        id: number,
        nome: string,
        microrregiao: {
            id: number,
            nome: string,
            mesorregiao: {
                id: number,
                nome: string,
                UF: ufsTypes
            }
        }
    }


    const [items, setItems] = useState<itemTypes[]>([])
    const [ufs, setUfs] = useState<string[]>([])
    const [cities, setCities] = useState<cityType[]>([])
    const [initialPosition, setInicialPosition] = useState<[number, number]>([0,0])
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    })
    const [position, setPosition] = useState<[number, number]>([0,0])
    const [UF, setUF] = useState('')
    const [city, setCity] = useState('')
    const [selectedItems, setSelectedItems] = useState<number[]>([])
    

    const history = useHistory()

    //Requisitando itens
    useEffect(() => {
        api.get('items')
            .then(response => {setItems(response.data)})
    }, [])


    //Requisitando estados
    useEffect(() => {
        axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
            .then(response => {
                const ufs = response.data.map((uf: ufsTypes) => uf.sigla)
                setUfs(ufs)
            })
    }, [])

    //Requisitando as cidades
    useEffect(() => {
        if (UF){
            axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${UF}/municipios`)
            .then(response => {
                const data = response.data.map((city: cityType) => {
                    return {
                        id: city.id,
                        nome: city.nome
                    }
                })

                setCities(data)
            })
        }
    }, [UF]) 

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const {latitude, longitude} = position.coords

            setInicialPosition([latitude, longitude])
            setPosition([latitude, longitude])
        })
    })

    function handleSelectedUf(event: ChangeEvent<HTMLSelectElement>){
        setUF(event.target.value)
    }

    function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>){
        setCity(event.target.value)
    }

    function handleMapClick(event: LeafletMouseEvent){
        setPosition([
            event.latlng.lat,
            event.latlng.lng
        ])
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        
        const {name, value} = event.target
        
        setFormData({ ...formData, [name]: value })
    }

    function handleSelectItem(id: number){

        const alreadySelected = selectedItems.findIndex(item => item === id )

        if (alreadySelected >= 0){
            const filteredItems = selectedItems.filter(item => item !== id)

            setSelectedItems(filteredItems)
        }else {
            setSelectedItems([...selectedItems, id])
        }


        
    }

    async function handleSubmit(event: FormEvent){
        event.preventDefault()

        const { name, email, whatsapp } = formData
        const [ latitude, longitude ] = position
        const items = selectedItems

        const data = {
            nome: name,
            email,
            whatsapp,
            UF,
            city,
            latitude,
            longitude,
            items
        }

        await api.post('spots', data)
        
        history.push('/')
    }

    return (
        <div id="page-create-point">
            
            <header>
                <img src={logo} alt="Ecoleta"/>
                <Link to="/">
                    <FiArrowLeft/>
                    Voltar para home
                </Link>
            </header>

            <form onSubmit={handleSubmit}>
                <h1>
                    Cadastro do <br/> ponto de coleta
                </h1>

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>

                        <input 
                            type="text"
                            name="name"
                            id="name"
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="field-group">
                        
                        <div className="field">
                            
                            <label htmlFor="email">Email</label>

                            <input 
                                type="email"
                                name="email"
                                id="email"
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>

                            <input 
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                                onChange={handleInputChange}
                            />
                        </div>

                    </div>
                </fieldset>

                <fieldset>
                    
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={position}/>
                    </Map>

                    <div className="field-group">
                        
                        <div className="field">
                            <label htmlFor="uf">Estado(UF)</label>
                            <select value={UF} name="uf" id="uf" onChange={handleSelectedUf}>
                                <option value="0">Selecione uma UF</option>
                                {
                                    ufs.map(uf => (
                                        <option value={uf} key={uf}>{uf}</option>
                                    ))
                                }
                            </select>

                        </div>

                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select name="city" id="city" value={city} onChange={handleSelectedCity}>
                                <option value="0">Selecione uma cidade</option>
                                {cities.map(city => (
                                    <option key={city.id} value={city.nome}>{city.nome}</option>
                                ))}
                            </select>

                        </div>
                    </div>

                    
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Itens de coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>

                    <ul className="items-grid">
                        
                        {items.map(item => (
                            <li 
                                className={selectedItems.includes(item.id) ? "selected" : ''} 
                                key={item.id} onClick={() => handleSelectItem(item.id)}>
                                    
                                    <img src={item.image_url} alt={item.title}/>
                                    <span>{item.title}</span>

                            </li>    
                        ))}
                        
                        
                    </ul>
                </fieldset>

                <button type="submit">Cadastrar ponto de coleta</button>

            </form>
        </div>
    )
}

export default CreateSpot