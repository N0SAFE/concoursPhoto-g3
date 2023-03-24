import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from "@/contexts/AuthContext";
import { ReactSearchAutocomplete } from 'react-search-autocomplete'

export default function BOCreate() {

    const [genders, setGenders] = useState([]);
    const [email, setEmail] = useState('');
    const [state, setState] = useState(null);
    const [ password, setPassword ] = useState('');
    const [creationDate, setCreationDate] = useState(null);
    const [ postcode, setPostcode ] = useState([]);
    const [ phone, setPhone ] = useState('');

    const { token } = useAuthContext();

    const formatResult = (item) => {
        return (
            <>
                <span style={{ display: 'block', textAlign: 'left' }}>CodePostal: {item.codePostal}</span>
                <span style={{ display: 'block', textAlign: 'left' }}>name: {item.name}</span>
            </>
        )
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (title) {
            fetch(new URL(import.meta.env.VITE_API_URL + "/api/users").href, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    state,
                    password,
                    creationDate,
                    postcode,
                    phone
                })
            })
        }
    }

    // function getGenders() {
    //     fetch(new URL(import.meta.env.VITE_API_URL + "/api/users").href, {
    //         method: "GET",
    //         headers: {
    //             "Content-Type": "application/json",
    //             Authorization: `Bearer ${token}`,
    //         },
    //     })
    //         .then(res => res.json())
    //         .then(data => {
    //             if (data.code === 401) {
    //                 throw new Error(data.message)
    //             }
    //             setGenders(data.gender);
    //         })
    //         .catch(error => {
    //             console.error(error);
    //         });
    // }

    function apiGet() {
        fetch('https://geo.api.gouv.fr/communes', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(res => res.json()).then(data => {
            console.log(data);
            setPostcode(data.map((item) => {
                return {
                    codePostal: item.codesPostaux,
                    name: item.nom
                }
            }))
        })
    }

    useEffect(() => {
    // getGenders();
        apiGet();
    }, [token]);

    return (
        <form onSubmit={() => handleSubmit()}>
            <label>Adresse mail</label>
            <input type="email" value={email}/>

            <label>Mot de passe</label>
            <input type="password" value={password} />

            <label>Etat</label>
            <input type="checkbox" value={state}/>

            <label>Date de création</label>
            <input type="date" value={creationDate}/>

            <label>Ville/Code postal</label>
            <ReactSearchAutocomplete items={postcode} formatResult={formatResult} autoFocus />

            <label>Numéro de téléphone</label>
            <input type="tel" value={phone}/>

            <label>Roles</label>
            <input />

            <button type="submit">Ajouter</button>
        </form>
    )
}
