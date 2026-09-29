import { createContext, useContext, useEffect, useState } from 'react'
import { API } from '../utils/auth'

const GenresContext = createContext({
    genresMundiais: [],
    genresCaboverde: [],
    allNames: [],
    cvNames: [],
    mundialNames: [],
})

export function GenresProvider({ children }) {
    const [genresMundiais,  setGenresMundiais]  = useState([])
    const [genresCaboverde, setGenresCaboverde] = useState([])

    useEffect(() => {
        fetch(`${API}/api/genres`)
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                if (!data) return
                if (Array.isArray(data.mundiais) && data.mundiais.length > 0)
                    setGenresMundiais(data.mundiais.map(g => ({ id: String(g.id), label: g.name, hue: g.hue })))
                if (Array.isArray(data.caboverde) && data.caboverde.length > 0)
                    setGenresCaboverde(data.caboverde.map(g => ({ id: String(g.id), label: g.name, hue: g.hue, tracks: g.trackCount })))
            })
            .catch(() => {})
    }, [])

    const cvNames      = genresCaboverde.map(g => g.label)
    const mundialNames = genresMundiais.map(g => g.label)
    const allNames     = [...cvNames, ...mundialNames]

    return (
        <GenresContext.Provider value={{ genresMundiais, genresCaboverde, allNames, cvNames, mundialNames }}>
            {children}
        </GenresContext.Provider>
    )
}

export function useGenres() {
    return useContext(GenresContext)
}
