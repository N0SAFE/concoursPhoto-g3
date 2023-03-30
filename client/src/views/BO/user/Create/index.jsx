import Input from "@/components/atoms/Input/index.jsx";
import BOCreate from "@/components/organisms/BO/Create";
import useApiFetch from "@/hooks/useApiFetch.js";
import { useState, useEffect } from "react";

export default function UserCreate() {
    const apiFetch = useApiFetch();

    const [gendersPossibility, setGendersPossibility] = useState([]);
    const [citiesPossibility, setCitiesPossibility] = useState([]);
    const [postalCodesPossibility, setPostalCodesPossibility] = useState([]);
    const [rolesPossibility, setRolesPossibility] = useState([]);

    const getGendersPossibility = () => {
        apiFetch("/genders", {
            method: "GET",
        })
               .then((r) => r.json())
            .then((data) => {
                console.log(data);
                setGendersPossibility(
                    data["hydra:member"].map(function (item) {
                        return { label: item.label, value: item.id };
                    })
                );
            });
    };

    const getRolesPossibility = () => {
        apiFetch("/roles", {
            method: "GET",
        })
            .then((r) => r.json())
            .then((data) => {
                console.log(data);
                setRolesPossibility(
                    data["hydra:member"].map(function (item) {
                        return { label: item.label, value: item.id };
                    })
                );
            });
    };
    
    const getCitiesPossibility = ({_cityname, _postcode} = {}) => {
        console.log("postalCode", postcode)
        console.log("city", city)
        
        const filter = [
            postcode && postcode.value ? `codePostal=${postcode.value}` : "" || _postcode ? `codePostal=${_postcode}` : "",
            city && city.value ? `code=${city.value}` : "" || _cityname ? `nom=${_cityname}` : "",
        ].filter((f) => f !== "");
        
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
            console.log("data", data)
        });
    }
    
    const [state, setState] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState();
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState({value: ""});
    const [postcode, setPostcode] = useState({value: ""});
    const [phoneNumber, setPhoneNumber] = useState("");
    const [role, setRole] = useState([]);
    const [errors, setErrors] = useState({});
    const [gender, setGender] = useState();
    const [dateOfBirth, setDateOfBirth] = useState();
    
    useEffect(() => {
        getGendersPossibility();
        getRolesPossibility();
    }, []);

    useEffect(() => {
        getCitiesPossibility();
    }, [postcode, city]);

    return (
        <div>
            <h1>Ajout d'un utilisateur</h1>
            <BOCreate
                handleSubmit={function () {
                    console.log("handleSubmit");
                    console.log("fetch")
                        const data = {
                            state,
                            email,
                            password,
                            passwordConfirm,
                            firstname,
                            lastname,
                            address,
                            city: city.value,   
                            postcode: parseInt(postcode.value),
                            phoneNumber,
                            role,
                            gender: "/api/genders/" + gender.value,
                            creationDate: new Date().toISOString(),
                            dateOfBirth: new Date().toISOString(),
                            country: "France",
                            isVerified: true,
                        }
                        console.log("data", data)
                        apiFetch("/users", {
                            method: "POST",
                            body: JSON.stringify(data),
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }).then(r => r.json()).then((data) => {
                            console.log(data)
                        }); 
                }}
            >
                <div>
                    <label htmlFor="firstname">Prenom</label>
                    <Input type="text" name="firstname" label="Prénom" extra={{ required: true }} setState={setFirstname} defaultValue={firstname} />
                    <div>{errors.firstname}</div>
                </div>
                <div>
                    <label htmlFor="lastname">Nom</label>
                    <Input type="text" name="lastname" label="Nom" extra={{ required: true }} setState={setLastname} defaultValue={lastname} />
                    <div>{errors.lastname}</div>
                </div>
                <div>
                    <label htmlFor="dateOfBirth">dateOfBirth</label>
                    <Input type="date" name="dateOfBirth" label="Date de Naissance" extra={{ required: true }} setState={setDateOfBirth} defaultValue={dateOfBirth} />
                    <div>{errors.dateOfBirth}</div>
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
                <div style={{ display: "flex", gap: "30px" }}>
                    <div>
                        <label htmlFor="city">city</label>
                        <Input type="select" name="city" label="Ville" extra={{ isClearable: true, required: true, options: citiesPossibility, multiple: false, onInputChange: (text, {action}) => {if(action === "input-change"){getCitiesPossibility({_cityname: text})}}}} setState={(item) => setCity(item)}/>
                        <div>{errors.city}</div>
                    </div>
                    <div>
                        <label htmlFor="postalCode">postalCode</label>
                        <Input type="select" name="postalCode" label="Code postal" extra={{ isClearable: true, required: true, options: postalCodesPossibility, multiple: false, onInputChange: (postcode, {action}) => {if(postcode.length === 5){if(action === "input-change") {getCitiesPossibility({_postcode: postcode})}}} }} setState={(item) => setPostcode(item)} defaultValue={postcode} />
                        <div>{errors.postalCode}</div>
                    </div>
                </div>
                <div>
                    <label htmlFor="phoneNumber">phoneNumber</label>
                    <Input type="tel" name="phoneNumber" label="Numéro de téléphone" extra={{ required: true }} setState={setPhoneNumber} defaultValue={phoneNumber} />
                    <div>{errors.phoneNumber}</div>
                </div>
                <div style={{ display: "flex", gap: "30px" }}>
                    <div>
                        <label htmlFor="role">role</label>
                        <Input
                            type="select"
                            name="role"
                            label="Rôle"
                            defaultValue={role}
                            extra={{ required: true, options: rolesPossibility, required: true, isMulti: true, closeMenuOnSelect: false }}
                            setState={setRole}
                        />
                        <div>{errors.role}</div>
                    </div>
                    <div>
                        <label htmlFor="gender">genre</label>
                        <Input type="select" name="gender" label="Genre" defaultValue={gender} extra={{ required: true, options: gendersPossibility, required: true }} setState={setGender} />
                        <div>{errors.gender}</div>
                    </div>
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
