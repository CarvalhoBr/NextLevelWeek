import pool from './database'

function createDefaultItens(){
    const values = [{
        imagem: 'lampadas.svg',
        title: 'Lâmpadas'
    },
    {
        imagem: 'baterias.svg',
        title: 'Pilhas e Baterias'
    },
    {
        imagem: 'papeis-papelao.svg',
        title: 'Papeis e papelão'
    },
    {
        imagem: 'eletronicos.svg',
        title: 'Resíduos Eletrônicos'
    },
    {
        imagem: 'organicos.svg',
        title: 'Resíduos Orgânicos'
    },
    {
        imagem: 'oleo.svg',
        title: 'Óleo de Cozinha'
    }
]
    pool.query('DELETE FROM items')
    
    for (var c = 0; c < values.length; c++){
        pool.query('INSERT INTO items (imagem, title) VALUES($1, $2)', [values[c].imagem, values[c].title])
    }

}

createDefaultItens();