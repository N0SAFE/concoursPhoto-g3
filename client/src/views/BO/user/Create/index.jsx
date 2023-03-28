import Input from "@/components/atoms/Input/index.jsx";
import BOCreate from "@/components/organisms/BO/Create";
import useApiFetch from "@/hooks/useApiFetch.js";
import { useState, useEffect } from "react";

export default function UserCreate() {
    const formFields = [
        {
            name: "email",
            type: "email",
            label: "Adresse mail",
            extra: {
                required: true,
            },
        },
        {
            name: "state",
            type: "checkbox",
            label: "Actif",
            defaultValue: true,
            extra: {
                required: true,
            },
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
                        label: "Homme",
                    },
                    {
                        value: "2",
                        label: "Femme",
                    },
                ],
                multiple: false,
            },
        },
        {
            name: "firstName",
            type: "text",
            label: "Prénom",
            extra: {
                required: true,
            },
        },
        {
            name: "lastName",
            type: "text",
            label: "Nom",
            extra: {
                required: true,
            },
        },
        {
            name: "address",
            type: "text",
            label: "Adresse",
            defaultValue: "1 rue de la paix",
            extra: {
                required: true,
            },
        },
        {
            name: "role",
            type: "select",
            label: "Rôle",
            defaultValue: [
                {
                    value: "1",
                    label: "Administrateur",
                },
                {
                    value: "2",
                    label: "Utilisateur",
                },
            ],
            extra: {
                required: true,
                options: [
                    {
                        value: "1",
                        label: "Administrateur",
                    },
                    {
                        value: "2",
                        label: "Utilisateur",
                    },
                ],
                required: true,
                isMulti: true,
                closeMenuOnSelect: false,
            },
        },
        {
            name: "city",
            type: "select",
            label: "Ville",
            extra: {
                required: true,
                options: [
                    {
                        label: "Paris",
                        codePostal: "75000",
                        value: "Paris",
                    },
                    {
                        label: "Lyon",
                        codePostal: "69000",
                        value: "Lyon",
                    },
                ],
                multiple: false,
            },
        },
        {
            name: "postalCode",
            type: "select",
            label: "Code postal",
            extra: {
                required: true,
                options: [
                    {
                        value: "1",
                        label: "75000",
                    },
                    {
                        value: "2",
                        label: "69000",
                    },
                ],
                multiple: false,
            },
        },
        {
            name: "password",
            type: "password",
            label: "Mot de passe",
            extra: {
                required: true,
            },
        },
        {
            name: "passwordConfirm",
            type: "password",
            label: "Confirmation du mot de passe",
            extra: {
                required: true,
            },
        },
        {
            name: "phoneNumber",
            type: "tel",
            label: "Numéro de téléphone",
            extra: {
                required: true,
            },
        },
    ];
    
    const apiFetch = useApiFetch()
    
    const [gendersPossibility, setGendersPossibility] = useState([]);
    const [citiesPossibility, setCitiesPossibility] = useState([]);
    const [postalCodesPossibility, setPostalCodesPossibility] = useState([]);
    const [rolesPossibility, setRolesPossibility] = useState([]);
    
    const getGendersPossibility = () => {
        apiFetch("/genders", {
            method: "GET",
        }).then((response) => {}).then((data) => {
            setGendersPossibility(data);
        });
    };
    
    const getRolesPossibility = () => {
        apiFetch("/roles", {
            method: "GET",
        }).then((response) => {}).then((data) => {
            setRolesPossibility(data);
        });
    };
    
    const getCitiesPossibility = () => {
        console.log("postalCode", postalCode)
        console.log("city", city)
        
        const filter = [
            postalCode ? `codePostal=${postalCode}` : "",
            city ? `nom=${city}` : "",
        ]
        
        console.log(`https://geo.api.gouv.fr/communes?${filter.join("&")}&fields=nom,codesPostaux&format=json&geometry=centre`)
        
        fetch(`https://geo.api.gouv.fr/communes?${filter.join("&")}&fields=nom,codesPostaux&format=json&geometry=centre`).then((response) => {
            return response.json();
        }).then((data) => {
            data.length = 30
            const [cityPossibility, postalCodesPossibility] = data.reduce(([cityResponse, postalCodeResponse], c) => {
                cityResponse.push({label: c.nom, value: c.code});
                postalCodeResponse.push(...c.codesPostaux);
                return [cityResponse, postalCodeResponse];
            }, [[], []]);
            setCitiesPossibility(cityPossibility);
            setPostalCodesPossibility(postalCodesPossibility.map(c => ({label: c, value: c})));
            console.log("data", postalCode)
        });
    }
    
    console.log(citiesPossibility)
    
    const [state, setState] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState();
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState();
    const [phoneNumber, setPhoneNumber] = useState("");
    const [role, setRole] = useState([]);
    const [errors, setErrors] = useState({});
    const [gender, setGender] = useState();
    
    useEffect(() => {
        getGendersPossibility();
        getRolesPossibility();
    }, []);
    
    useEffect(() => {
        getCitiesPossibility();
    }, [postalCode, city]);

    return (
        <div>
            <h1>Ajout d'un utilisateur</h1>
            <BOCreate
                handleSubmit={function () {
                    console.log("handleSubmit");
                    fetch(function(){
                        
                    })
                }}
            >
                <div>
                    <label htmlFor="firstName">Prenom</label>
                    <Input type="text" name="firstName" label="Prénom" extra={{ required: true }} setState={setFirstName} defaultValue={firstName} />
                    <div>{errors.firstName}</div>
                </div>
                <div>
                    <label htmlFor="lastName">Nom</label>
                    <Input type="text" name="lastName" label="Nom" extra={{ required: true }} setState={setLastName} defaultValue={lastName} />
                    <div>{errors.lastName}</div>
                </div>
                <div>
                    <label htmlFor="email">email</label>
                    <Input type="email" name="email" label="Adresse mail" extra={{ required: true }} setState={setEmail} defaultValue={email} />
                    <div>{errors.email}</div>
                </div>
                <div>
                    <label htmlFor="state">state</label>
                    <Input type="checkbox" name="state" label="Actif" defaultValue={state} setState={setState} />
                    <div>{errors.state}</div>
                </div>
                <div>
                    <label htmlFor="address">address</label>
                    <Input type="text" name="address" label="Adresse" defaultValue={address} extra={{ required: true }} setState={setAddress} />
                    <div>{errors.address}</div>
                </div>
                <div style={{display: "flex", gap: "30px"}}>
                    <div>
                        <label htmlFor="city">city</label>
                        <Input type="select" name="city" label="Ville" extra={{ clearable: true, required: true, options: citiesPossibility, multiple: false, onInputChange: (item, {action}) => {if(action === "input-change"){setCity(item)}}}} setState={(item) => setCity(item.label)}/>
                        <div>{errors.city}</div>
                    </div>
                    <div>
                        <label htmlFor="postalCode">postalCode</label>
                        <Input type="select" name="postalCode" label="Code postal" extra={{ clearable: true, required: true, options: postalCodesPossibility, multiple: false, onInputChange: (item, {action}) => {if(action === "input-change") {setPostalCode(item)}} }} setState={(item) => setPostalCode(item.label)} defaultValue={postalCode} />
                        <div>{errors.postalCode}</div>
                    </div>
                </div>
                <div>
                    <label htmlFor="phoneNumber">phoneNumber</label>
                    <Input type="tel" name="phoneNumber" label="Numéro de téléphone" extra={{ required: true }} setState={setPhoneNumber} defaultValue={phoneNumber} />
                    <div>{errors.phoneNumber}</div>
                </div>
                <div>
                    <label htmlFor="role">role</label>
                    <Input type="select" name="role" label="Rôle" defaultValue={role} extra={{ required: true, options: [{ value: "1", label: "Administrateur" }, { value: "2", label: "Utilisateur" }], required: true, isMulti: true, closeMenuOnSelect: false }} setState={setRole} />
                    <div>{errors.role}</div>
                </div>
                <div>
                    <label htmlFor="password">password</label>
                    <Input type="password" name="password" label="Mot de passe" extra={{ required: true }} setState={setPassword} defaultValue={password} />
                    <Input type="password" name="passwordConfirm" label="Confirmation du mot de passe" extra={{ required: true }} setState={setPasswordConfirm} defaultValue={passwordConfirm} />
                    <div>{errors.password}</div>
                </div>
            </BOCreate>
        </div>
    );
}
