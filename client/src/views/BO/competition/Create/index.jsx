import Input from "@/components/atoms/Input/index.jsx";
import BOCreate from "@/components/organisms/BO/Form";
import useApiFetch from "@/hooks/useApiFetch.js";
import { useState, useEffect } from "react";
import useLocation from "@/hooks/useLocation";
import { toast } from "react-toastify";

export default function CompetitionCreate() {
    const apiFetch = useApiFetch();
    const { getCityByName, getDepartmentByName, getRegionByName } = useLocation();

    const [locationPossibility, setLocationPossibility] = useState({
        regions: { isLoading: true, data: [] },
        departments: { isLoading: true, data: [] },
        cities: { isLoading: true, data: [] },
    });

    const updateLocationPossibility = (key, { data, isLoading } = {}) => {
        if (isLoading !== undefined) {
            locationPossibility[key].isLoading = isLoading;
        }
        if (data !== undefined) {
            console.log(data);
            locationPossibility[key].data = data.map((item) => ({ label: item.nom, value: item.code }));
        }
        setLocationPossibility({ ...locationPossibility });
    };

    const [entityPossibility, setEntityPossibility] = useState({ participantCategories: [], organizers: [], themes: [] });
    const [entity, setEntity] = useState({
        state: null,
        name: null,
        visual: null,
        description: null,
        rules: null,
        endowments: null,
        participantCategories: null,
        organizer: null,
        themes: null,
        creationDate: null,
        publicationDate: null,
        submissionStartDate: null,
        submissionEndDate: null,
        votingStartDate: null,
        votingEndDate: null,
        resultsDate: null,
        weightingOfJuryVotes: null,
        numberOfMaxVotes: null,
        numberOfPrices: null,
        minAgeCriteria: null,
        maxAgeCriteria: null,
        cityCriteria: [],
        departmentCriteria: [],
        regionCriteria: [],
    });

    const updateEntity = (key, value) => {
        console.log(key, value);
        setEntity({ ...entity, [key]: value });
    };

    const [errors, setErrors] = useState({});

    const getParticipantCategories = () => {
        return apiFetch("/participant_categories", {
            method: "GET",
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then((r) => r.json())
            .then((data) => {
                console.debug(data);
                return data["hydra:member"].map(function (item) {
                    return { label: item.label, value: item["@id"] };
                });
            });
    };

    const getOrganizationsName = () => {
        return apiFetch("/organizations", {
            method: "GET",
        })
            .then((r) => r.json())
            .then((data) => {
                console.debug(data);
                return data["hydra:member"].map(function (item) {
                    return { label: item.organizer_name, value: item["@id"] };
                });
            });
    };

    const getThemes = () => {
        return apiFetch("/themes", {
            method: "GET",
        })
            .then((r) => r.json())
            .then((data) => {
                console.debug(data);
                return data["hydra:member"].map(function (item) {
                    return { label: item.label, value: item["@id"] };
                });
            });
    };

    useEffect(() => {
        Promise.all([getRegionByName(), getDepartmentByName(), getCityByName()]).then(([regions, departments, cities]) => {
            return setLocationPossibility({
                regions: { isLoading: false, data: regions.map((d) => ({ label: d.nom, value: d.code })) },
                departments: { isLoading: false, data: departments.map((d) => ({ label: d.nom, value: d.code })) },
                cities: { isLoading: false, data: cities.map((d) => ({ label: d.nom, value: d.code })) },
            });
        });
        const promise = Promise.all([getParticipantCategories(), getOrganizationsName(), getThemes()]).then(([participantCategories, organizers, themes]) => {
            setEntityPossibility({ participantCategories, organizers, themes });
        });
        promise.catch(console.error);
        toast.promise(promise, {
            pending: "Chargement des données",
            success: "Données chargées",
            error: "Erreur lors du chargement des données",
        });
    }, []);

    return (
        <div>
            <BOCreate
                title="Création d'un concours"
                handleSubmit={function () {
                    console.debug("handleSubmit");
                    console.debug("fetch");
                    const data = {
                        state: entity.state,
                        competitionName: entity.name,
                        competitionVisual: entity.visual,
                        participantCategory: entity.participantCategories.map((p) => p.value),
                        organization: entity.organizer.value,
                        theme: entity.themes.map((t) => t.value),
                        description: entity.description,
                        rules: entity.rules,
                        creationDate: new Date(entity.creationDate).toISOString(),
                        publicationDate: new Date(entity.publicationDate).toISOString(),
                        submissionStartDate: new Date(entity.submissionStartDate).toISOString(),
                        submissionEndDate: new Date(entity.submissionEndDate).toISOString(),
                        votingStartDate: new Date(entity.votingStartDate).toISOString(),
                        votingEndDate: new Date(entity.votingEndDate).toISOString(),
                        resultsDate: new Date(entity.resultsDate).toISOString(),
                        weightingOfJuryVotes: parseFloat(entity.weightingOfJuryVotes),
                        numberOfMaxVotes: parseInt(entity.numberOfMaxVotes),
                        numberOfPrices: parseInt(entity.numberOfPrices),
                        minAgeCriteria: parseInt(entity.minAgeCriteria),
                        maxAgeCriteria: parseInt(entity.maxAgeCriteria),
                        cityCriteria: [entity.cityCriteria.value],
                        departmentCriteria: [entity.departmentCriteria.value],
                        regionCriteria: [entity.regionCriteria.value],
                        countryCriteria: ["FRANCE"],
                        endowments: entity.endowments,
                    };
                    console.debug("entity", entity);
                    console.debug("data", data);
                    const promise = apiFetch("/competitions", {
                        method: "POST",
                        body: JSON.stringify(data),
                        headers: {
                            "Content-Type": "application/json",
                        },
                    })
                        .then((r) => r.json())
                        .then((data) => {
                            console.debug(data);
                            if (data["@type"] === "hydra:Error") {
                                throw new Error(data.description);
                            }
                        });
                    toast.promise(promise, {
                        pending: "Création du concours",
                        success: "Concours créé",
                        error: "Erreur lors de la création du concours",
                    });
                }}
            >
                <div>
                    <label htmlFor="state">Etat</label>
                    <Input type="checkbox" name="state" label="Actif" onChange={(d) => updateEntity("state", d)} defaultValue={entity.state} />
                    <div>{errors.state}</div>
                </div>
                <div>
                    <label htmlFor="name">Intitulé du concours</label>
                    <Input type="text" name="name" label="Intitulé du concours" onChange={(d) => updateEntity("name", d)} defaultValue={entity.name} />
                    <div>{errors.name}</div>
                </div>
                <div>
                    <label htmlFor="visual">Visuel du concours</label>
                    <Input type="file" name="visual" label="Visuel du concours" onChange={(d) => updateEntity("visual", d)} defaultValue={entity.visual} />
                    <div>{errors.visual}</div>
                </div>
                <div>
                    <label htmlFor="description">Visuel du concours</label>
                    <Input type="text" name="description" label="Description" onChange={(d) => updateEntity("description", d)} defaultValue={entity.description} />
                    <div>{errors.description}</div>
                </div>
                <div>
                    <label htmlFor="rules">Règlement</label>
                    <Input type="text" name="rules" label="Règlement" onChange={(d) => updateEntity("rules", d)} defaultValue={entity.rules} />
                    <div>{errors.rules}</div>
                </div>
                <div>
                    <label htmlFor="endowments">Dotation</label>
                    <Input type="text" name="endowments" label="Dotation" onChange={(d) => updateEntity("endowments", d)} defaultValue={entity.endowments} />
                    <div>{errors.endowments}</div>
                </div>
                <div>
                    <label htmlFor="creationDate">Date de création</label>
                    <Input type="date" name="creationDate" label="Date de création" onChange={(d) => updateEntity("creationDate", d)} defaultValue={entity.creationDate} />
                    <div>{errors.creationDate}</div>
                </div>
                <div>
                    <label htmlFor="publicationDate">Date de publication</label>
                    <Input type="date" name="publicationDate" label="Date de publication" onChange={(d) => updateEntity("publicationDate", d)} defaultValue={entity.publicationDate} />
                    <div>{errors.publicationDate}</div>
                </div>
                <div>
                    <label htmlFor="submissionStartDate">Date de début de soumission</label>
                    <Input
                        type="date"
                        name="submissionStartDate"
                        label="Date de début de soumission"
                        onChange={(d) => updateEntity("submissionStartDate", d)}
                        defaultValue={entity.submissionStartDate}
                    />
                    <div>{errors.submissionStartDate}</div>
                </div>
                <div>
                    <label htmlFor="submissionEndDate">Date de fin de soumission</label>
                    <Input type="date" name="submissionEndDate" label="Date de fin de soumission" onChange={(d) => updateEntity("submissionEndDate", d)} defaultValue={entity.submissionEndDate} />
                    <div>{errors.submissionEndDate}</div>
                </div>
                <div>
                    <label htmlFor="votingStartDate">Date de début de vote</label>
                    <Input type="date" name="votingStartDate" label="Date de début de vote" onChange={(d) => updateEntity("votingStartDate", d)} defaultValue={entity.votingStartDate} />
                    <div>{errors.votingStartDate}</div>
                </div>
                <div>
                    <label htmlFor="votingEndDate">Date de fin de vote</label>
                    <Input type="date" name="votingEndDate" label="Date de fin de vote" onChange={(d) => updateEntity("votingEndDate", d)} defaultValue={entity.votingEndDate} />
                    <div>{errors.votingEndDate}</div>
                </div>
                <div>
                    <label htmlFor="resultsDate">Date des résultats</label>
                    <Input type="date" name="resultsDate" label="Date de fin de vote" onChange={(d) => updateEntity("resultsDate", d)} defaultValue={entity.resultsDate} />
                    <div>{errors.resultsDate}</div>
                </div>
                <div>
                    <label htmlFor="weightingOfJuryVotes">Pondération des votes du jury</label>
                    <Input
                        type="number"
                        extra={{ step: 0.01 }}
                        name="weightingOfJuryVotes"
                        label="Pondération des votes du jury"
                        defaultValue={entity.weightingOfJuryVotes}
                        onChange={(d) => updateEntity("weightingOfJuryVotes", d)}
                    />
                    <div>{errors.weightingOfJuryVotes}</div>
                </div>
                <div>
                    <label htmlFor="numberOfMaxVotes">Nombre maximum de votes</label>
                    <Input type="number" name="numberOfMaxVotes" label="Nombre maximum de votes" onChange={(d) => updateEntity("numberOfMaxVotes", d)} defaultValue={entity.numberOfMaxVotes} />
                    <div>{errors.numberOfMaxVotes}</div>
                </div>
                <div>
                    <label htmlFor="numberOfPrices">Nombres de prix</label>
                    <Input type="number" name="numberOfPrices" label="Nombres de prix" onChange={(d) => updateEntity("numberOfPrices", d)} defaultValue={entity.numberOfPrices} />
                    <div>{errors.numberOfPrices}</div>
                </div>
                <div>
                    <label htmlFor="minAgeCriteria">Âge minimum</label>
                    <Input type="number" name="minAgeCriteria" label="Âge minimum" onChange={(d) => updateEntity("minAgeCriteria", d)} defaultValue={entity.minAgeCriteria} />
                    <div>{errors.minAgeCriteria}</div>
                </div>
                <div>
                    <label htmlFor="maxAgeCriteria">Âge maximum</label>
                    <Input type="number" name="maxAgeCriteria" label="Âge maximum" onChange={(d) => updateEntity("maxAgeCriteria", d)} defaultValue={entity.maxAgeCriteria} />
                    <div>{errors.maxAgeCriteria}</div>
                </div>
                <div style={{ display: "flex", gap: "30px" }}>
                    <div>
                        <label htmlFor="region">Région</label>
                        <Input
                            type="select"
                            name="region"
                            label="Région"
                            extra={{
                                isLoading: locationPossibility.regions.loading,
                                clearable: true,
                                required: true,
                                options: locationPossibility.regions.data,
                                isMulti: true,
                                menuPlacement: "top",
                                onInputChange: (name, { action }) => {
                                    if (action === "input-change") {
                                        getRegionByName(name).then(function (p) {
                                            updateLocationPossibility("regions", { data: p });
                                        });
                                    }
                                    if (action === "menu-close") {
                                        updateLocationPossibility("regions", { loading: true });
                                        getRegionByName().then(function (p) {
                                            updateLocationPossibility("regions", { data: p, loading: false });
                                        });
                                    }
                                },
                            }}
                            onChange={(d) => {
                                updateEntity("regionCriteria", d);
                            }}
                        />
                        <div>{errors.regionCriteria}</div>
                    </div>
                    <div>
                        <label htmlFor="department">Département</label>
                        <Input
                            type="select"
                            name="department"
                            label="Département"
                            extra={{
                                isLoading: locationPossibility.departments.loading,
                                clearable: true,
                                required: true,
                                options: locationPossibility.departments.data,
                                isMulti: true,
                                menuPlacement: "top",
                                onInputChange: (name, { action }) => {
                                    if (action === "input-change") {
                                        getDepartmentByName(name).then(function (p) {
                                            updateLocationPossibility("departments", { data: p });
                                        });
                                    }
                                    if (action === "menu-close") {
                                        updateLocationPossibility("departments", { loading: true });
                                        getDepartmentByName().then(function (p) {
                                            updateLocationPossibility("departments", { data: p, loading: false });
                                        });
                                    }
                                },
                            }}
                            onChange={(d) => {
                                updateEntity("departmentCriteria", d);
                            }}
                        />
                        <div>{errors.departmentCriteria}</div>
                    </div>
                    <div>
                        <label htmlFor="city">Ville</label>
                        <Input
                            type="select"
                            name="city"
                            label="Ville"
                            extra={{
                                isLoading: locationPossibility.cities.loading,
                                clearable: true,
                                required: true,
                                options: locationPossibility.cities.data,
                                isMulti: true,
                                menuPlacement: "top",
                                onInputChange: (name, { action }) => {
                                    if (action === "input-change") {
                                        getCityByName(name).then(function (p) {
                                            updateLocationPossibility("cities", { data: p });
                                        });
                                    }
                                    if (action === "menu-close") {
                                        updateLocationPossibility("cities", { loading: true });
                                        getCityByName().then(function (p) {
                                            updateLocationPossibility("cities", { data: p, loading: false });
                                        });
                                    }
                                },
                            }}
                            onChange={(d) => {
                                updateEntity("cityCriteria", d);
                            }}
                        />
                        <div>{errors.cityCriteria}</div>
                    </div>
                    <div style={{ display: "flex", gap: "30px" }}>
                        <div>
                            <label htmlFor="participantCategory">Catégorie de participant</label>
                            <Input
                                type="select"
                                name="participantCategory"
                                label="Catégorie de participant"
                                defaultValue={entity.participantCategories}
                                extra={{ isMulti: true, required: true, options: entityPossibility.participantCategories, closeMenuOnSelect: false, menuPlacement: "top" }}
                                onChange={(d) => updateEntity("participantCategories", d)}
                            />
                            <div>{errors.participantCategories}</div>
                        </div>
                        <div>
                            <label htmlFor="organizer">Nom de l'organisation</label>
                            <Input
                                type="select"
                                name="organizer"
                                label="Nom de l'organisation"
                                defaultValue={entity.organizer}
                                extra={{ required: true, options: entityPossibility.organizers, menuPlacement: "top" }}
                                onChange={(d) => updateEntity("organizer", d)}
                            />
                            <div>{errors.organizer}</div>
                        </div>
                        <div>
                            <label htmlFor="themes">Thème(s)</label>
                            <Input
                                type="select"
                                name="themes"
                                label="Thèmes"
                                defaultValue={entity.themes}
                                extra={{ required: true, isMulti: true, options: entityPossibility.themes, closeMenuOnSelect: false, menuPlacement: "top" }}
                                onChange={(d) => updateEntity("themes", d)}
                            />
                            <div>{errors.themes}</div>
                        </div>
                    </div>
                </div>
            </BOCreate>
        </div>
    );
}
