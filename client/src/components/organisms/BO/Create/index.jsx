import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from "@/contexts/AuthContext";
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import React from 'react';


const inputs = [
    {
        name: "email",
        type: "email",
        label: "Adresse mail",
        extra: {
            required: true,
            pattern: "[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$"
        }
    },
    {
        name: "state",
        type: "checkbox",
        label: "Actif",
        extra: {
            required: true,
        }
    },
    {
        name: "gender",
        type: "select",
        label: "Genre",
        extra: {
            required: true,
            options: [
                {
                    value: "1",
                    label: "Homme"
                },
                {
                    value: "2",
                    label: "Femme"
                }
            ],
            multiple: false
        }
    },
    {
        name: "city",
        type: "auto-suggest",
        label: "Ville",
        extra: {
            required: true,
            options: [
                {
                    label: "Paris",
                    codePostal: "75000"
                },
                {
                    label: "Lyon",
                    codePostal: "69000"
                },
            ],
            seenLabel: "label", // optional,
            methods: {},
            onSelect: (item) => {
                console.log(item);
            }
        }
    }
]


export default function BOCreate({ handleSubmit }) {



    // create a ref for each input
    const refs = inputs.reduce((acc, input) => {
        acc[input.name] = React.createRef();
        return acc;
    }, {})

    console.log(refs)

    return (
        <form onSubmit={handleSubmit(refs)}>

        </form>
    )



    return <div>test</div>

    const [genders, setGenders] = useState([]);
    const [email, setEmail] = useState('');
    const [state, setState] = useState(null);
    const [ password, setPassword ] = useState('');
    const [creationDate, setCreationDate] = useState(null);
    const [ postcode, setPostcode ] = useState([]);
    const [ phone, setPhone ] = useState('');

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
        fetch(new URL(import.meta.env.VITE_API_URL + "/users").href, {
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

    function getGenders() {
        fetch(new URL(import.meta.env.VITE_API_URL + "/genders").href, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(res => res.json())
            .then(data => {
                if (data.code === 401) {
                    throw new Error(data.message)
                }
                setGenders(data['hydra:member']);
            })
            .catch(error => {
                console.error(error);
            });
    }

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
        getGenders();
        apiGet();
    }, []);

    return (
        <form onSubmit={() => handleSubmit()}>
            <div>
                <label>Adresse mail</label>
                <input type="email" value={email}/>
            </div>
            <div>
                <label>Mot de passe</label>
                <input type="password" value={password} />
            </div>
            <div>
                <label>Etat</label>
                <input type="checkbox" value={state}/>
            </div>
            <div>
                <label>Date de création</label>
                <input type="date" value={creationDate}/>
            </div>
            <div>
                <label>Ville/Code postal</label>
                <ReactSearchAutocomplete items={postcode} formatResult={formatResult} autoFocus />
            </div>
            <div>
                <label>Genre</label>
                <select>
                    {genders.map((item) => {
                        return (
                            <option value={item.id}>{item.label}</option>
                            )
                        })
                    }
                </select>
            </div>
            <div>
                <label>Numéro de téléphone</label>
                <input type="tel" value={phone}/>
            </div>
            <div>
                <label>Roles</label>
                <input />
            </div>
            <button type="submit">Ajouter</button>
        </form>
    )
}
