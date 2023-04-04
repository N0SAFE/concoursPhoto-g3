import Input from "@/components/atoms/Input/index.jsx";
import BOCreate from "@/components/organisms/BO/Form";
import useApiFetch from "@/hooks/useApiFetch.js";
import { useState, useEffect } from "react";

export default function CompetitionCreate() {
    const apiFetch = useApiFetch();

    const [regionsPossibility, setRegionsPossibility] = useState([]);
    const [departmentsPossibility, setDepartmentsPossibility] = useState([]);
    const [citiesPossibility, setCitiesPossibility] = useState([]);

    const [participantCategoryPossibility, setParticipantCategoryPossibility] = useState([]);
    const [organizationNamePossibility, setOrganizationNamePossibility] = useState([]);
    const [themePossibility, setThemePossibility] = useState([]);

    const getRegionsPossibility = ({ name } = {}) => {
        const filter = [regionCriteria ? `code=${regionCriteria.value}` : "", name ? `nom=${name}` : ""].filter((c) => c !== "");
        fetch(`https://geo.api.gouv.fr/regions?${filter.join("&")}`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                data.length = 30;
                const [regionsPossibility] = data.reduce(
                    ([regionsResponse], c) => {
                        regionsResponse.push({ label: c.nom, value: c.code });
                        return [regionsResponse];
                    },
                    [[], []]
                );
                setRegionsPossibility(regionsPossibility);
            });
    };

    const getDepartmentsPossibility = ({ codeRegion, name } = {}) => {
        const filter = [
            regionCriteria ? `codeRegion=${regionCriteria.value}` : "" || codeRegion ? `codeRegion=${codeRegion}` : "",
            departmentCriteria ? `code=${departmentCriteria.value}` : "",
            name ? `nom=${name}` : "",
        ].filter((c) => c !== "");
        fetch(`https://geo.api.gouv.fr/departements?${filter.join("&")}`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                data.length = 30;
                const [departmentPossibility] = data.reduce(
                    ([departmentResponse], c) => {
                        departmentResponse.push({ label: c.nom, value: c.code, codeRegion: c.codeRegion });
                        return [departmentResponse];
                    },
                    [[]]
                );
                setDepartmentsPossibility(departmentPossibility);
            });
    };

    const getCitiesPossibility = ({ codeRegion, codeDepartment, name } = {}) => {
        const filter = [
            regionCriteria ? `codeRegion=${regionCriteria.value}` : "" || codeRegion ? `codeRegion=${codeRegion}` : "",
            departmentCriteria ? `codeDepartement=${departmentCriteria.value}` : "" || codeDepartment ? `codeDepartement=${codeDepartment}` : "",
            cityCriteria ? `code=${cityCriteria.value}` : "",
            name ? `nom=${name}` : "",
        ].filter((c) => c !== "");
        fetch(`https://geo.api.gouv.fr/communes?${filter.join("&")}`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                data.length = 30;
                const [citiesPossibility] = data.reduce(
                    ([citiesResponse], c) => {
                        citiesResponse.push({
                            label: c.nom,
                            value: c.code,
                            codeDepartement: c.codeDepartement,
                            codeRegion: c.codeRegion,
                        });
                        return [citiesResponse];
                    },
                    [[]]
                );
                setCitiesPossibility(citiesPossibility);
            });
    };

    const getParticipantCategories = () => {
        apiFetch("/participant_categories", {
            method: "GET",
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then((r) => r.json())
            .then((data) => {
                console.debug(data);
                setParticipantCategoryPossibility(
                    data["hydra:member"].map(function (item) {
                        return { label: item.label, value: item["@id"] };
                    })
                );
            });
    };

    const getOrganizationsName = () => {
        apiFetch("/organizations", {
            method: "GET",
        })
            .then((r) => r.json())
            .then((data) => {
                console.debug(data);
                setOrganizationNamePossibility(
                    data["hydra:member"].map(function (item) {
                        return { label: item.organizer_name, value: item["@id"] };
                    })
                );
            });
    };

    const getThemes = () => {
        apiFetch("/themes", {
            method: "GET",
        })
            .then((r) => r.json())
            .then((data) => {
                console.debug(data);
                setThemePossibility(
                    data["hydra:member"].map(function (item) {
                        return { label: item.label, value: item["@id"] };
                    })
                );
            });
    };

    const [errors, setErrors] = useState({});

    const [participantCategories, setParticipantCategories] = useState([]);
    const [organizationName, setOrganizationName] = useState();
    const [themes, setThemes] = useState([]);

    const [state, setState] = useState(false);
    const [competitionName, setCompetitionName] = useState("");
    const [competitionVisual, setCompetitionVisual] = useState("");
    const [description, setDescription] = useState("");
    const [rules, setRules] = useState("");
    const [endowments, setEndowments] = useState("");
    const [creationDate, setCreationDate] = useState("");
    const [publicationDate, setPublicationDate] = useState("");
    const [publicationStartDate, setPublicationStartDate] = useState("");
    const [submissionStartDate, setSubmissionStartDate] = useState("");
    const [submissionEndDate, setSubmissionEndDate] = useState("");
    const [votingStartDate, setVotingStartDate] = useState("");
    const [votingEndDate, setVotingEndDate] = useState("");
    const [resultsDate, setResultsDate] = useState("");
    const [weightingOfJuryVotes, setWeightingOfJuryVotes] = useState("");
    const [numberOfMaxVotes, setNumberOfMaxVotes] = useState("");
    const [numberOfPrices, setNumberOfPrices] = useState("");
    const [minAgeCriteria, setMinAgeCriteria] = useState("");
    const [maxAgeCriteria, setMaxAgeCriteria] = useState("");
    const [countryCriteria, setCountryCriteria] = useState("");
    const [cityCriteria, setCityCriteria] = useState("");
    const [departmentCriteria, setDepartmentCriteria] = useState("");
    const [regionCriteria, setRegionCriteria] = useState("");

    useEffect(() => {
        getRegionsPossibility();
    }, [departmentCriteria, cityCriteria]);

    useEffect(() => {
        getDepartmentsPossibility();
    }, [cityCriteria]);

    useEffect(() => {
        getCitiesPossibility();
    }, []);

    useEffect(() => {
        getParticipantCategories();
        getOrganizationsName();
        getThemes();
    }, []);

    return (
        <div>
            <BOCreate
                title="Création d'un concours"
                handleSubmit={function () {
                    console.debug("handleSubmit");
                    console.debug("fetch");
                    const data = {
                        state,
                        competitionName,
                        competitionVisual,
                        participantCategory: participantCategories.map((p) => p.value),
                        organization: organizationName.value,
                        description,
                        rules,
                        endowments,
                        creationDate: new Date(creationDate).toISOString(),
                        publicationDate: new Date(publicationDate).toISOString(),
                        publicationStartDate: new Date(publicationStartDate).toISOString(),
                        submissionStartDate: new Date(submissionStartDate).toISOString(),
                        submissionEndDate: new Date(submissionEndDate).toISOString(),
                        votingStartDate: new Date(votingStartDate).toISOString(),
                        votingEndDate: new Date(votingEndDate).toISOString(),
                        resultsDate: new Date(resultsDate).toISOString(),
                        weightingOfJuryVotes: parseFloat(weightingOfJuryVotes),
                        numberOfMaxVotes: parseInt(numberOfMaxVotes),
                        numberOfPrices: parseInt(numberOfPrices),
                        minAgeCriteria: parseInt(minAgeCriteria),
                        maxAgeCriteria: parseInt(maxAgeCriteria),
                        countryCriteria: ["FRANCE"],
                        cityCriteria: [cityCriteria.value],
                        departmentCriteria: [departmentCriteria.value],
                        regionCriteria: [regionCriteria.value],
                        theme: themes.map((t) => t.value),
                    };
                    console.debug("data", data);
                    apiFetch("/competitions", {
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
                }}
            >
                <div>
                    <label htmlFor="state">Etat</label>
                    <Input type="checkbox" name="state" label="Actif" defaultValue={state} setState={setState} />
                    <div>{errors.state}</div>
                </div>
                <div>
                    <label htmlFor="competitionName">Intitulé du concours</label>
                    <Input type="text" name="competitionName" label="Intitulé du concours" defaultValue={competitionName} setState={setCompetitionName} />
                    <div>{errors.competitionName}</div>
                </div>
                <div>
                    <label htmlFor="competitionVisual">Visuel du concours</label>
                    <Input type="file" name="competitionVisual" label="Visuel du concours" defaultValue={competitionVisual} setState={setCompetitionVisual} />
                    <div>{errors.competitionVisual}</div>
                </div>
                <div>
                    <label htmlFor="description">Visuel du concours</label>
                    <Input type="text" name="description" label="Description" defaultValue={description} setState={setDescription} />
                    <div>{errors.description}</div>
                </div>
                <div>
                    <label htmlFor="rules">Règlement</label>
                    <Input type="text" name="rules" label="Règlement" defaultValue={rules} setState={setRules} />
                    <div>{errors.rules}</div>
                </div>
                <div>
                    <label htmlFor="endowments">Dotation</label>
                    <Input type="text" name="endowments" label="Dotation" defaultValue={endowments} setState={setEndowments} />
                    <div>{errors.endowments}</div>
                </div>
                <div>
                    <label htmlFor="creationDate">Date de création</label>
                    <Input type="date" name="creationDate" label="Date de création" defaultValue={creationDate} setState={setCreationDate} />
                    <div>{errors.creationDate}</div>
                </div>
                <div>
                    <label htmlFor="publicationDate">Date de publication</label>
                    <Input type="date" name="publicationDate" label="Date de publication" defaultValue={publicationDate} setState={setPublicationDate} />
                    <div>{errors.publicationDate}</div>
                </div>
                <div>
                    <label htmlFor="publicationStartDate">Date de début de publication</label>
                    <Input type="date" name="publicationStartDate" label="Date de début de publication" defaultValue={publicationStartDate} setState={setPublicationStartDate} />
                    <div>{errors.publicationStartDate}</div>
                </div>
                <div>
                    <label htmlFor="submissionStartDate">Date de début de soumission</label>
                    <Input type="date" name="submissionStartDate" label="Date de début de soumission" defaultValue={submissionStartDate} setState={setSubmissionStartDate} />
                    <div>{errors.submissionStartDate}</div>
                </div>
                <div>
                    <label htmlFor="submissionEndDate">Date de fin de soumission</label>
                    <Input type="date" name="submissionEndDate" label="Date de fin de soumission" defaultValue={submissionEndDate} setState={setSubmissionEndDate} />
                    <div>{errors.submissionEndDate}</div>
                </div>
                <div>
                    <label htmlFor="votingStartDate">Date de début de vote</label>
                    <Input type="date" name="votingStartDate" label="Date de début de vote" defaultValue={votingStartDate} setState={setVotingStartDate} />
                    <div>{errors.votingStartDate}</div>
                </div>
                <div>
                    <label htmlFor="votingEndDate">Date de fin de vote</label>
                    <Input type="date" name="votingEndDate" label="Date de fin de vote" defaultValue={votingEndDate} setState={setVotingEndDate} />
                    <div>{errors.votingEndDate}</div>
                </div>
                <div>
                    <label htmlFor="resultsDate">Date des résultats</label>
                    <Input type="date" name="resultsDate" label="Date de fin de vote" defaultValue={resultsDate} setState={setResultsDate} />
                    <div>{errors.resultsDate}</div>
                </div>
                <div>
                    <label htmlFor="weightingOfJuryVotes">Pondération des votes du jury</label>
                    <Input
                        type="number"
                        extra={{ step: 0.01 }}
                        name="weightingOfJuryVotes"
                        label="Pondération des votes du jury"
                        defaultValue={weightingOfJuryVotes}
                        setState={setWeightingOfJuryVotes}
                    />
                    <div>{errors.weightingOfJuryVotes}</div>
                </div>
                <div>
                    <label htmlFor="numberOfMaxVotes">Nombre maximum de votes</label>
                    <Input type="number" name="numberOfMaxVotes" label="Nombre maximum de votes" defaultValue={numberOfMaxVotes} setState={setNumberOfMaxVotes} />
                    <div>{errors.numberOfMaxVotes}</div>
                </div>
                <div>
                    <label htmlFor="numberOfPrices">Nombres de prix</label>
                    <Input type="number" name="numberOfPrices" label="Nombres de prix" defaultValue={numberOfPrices} setState={setNumberOfPrices} />
                    <div>{errors.numberOfPrices}</div>
                </div>
                <div>
                    <label htmlFor="minAgeCriteria">Âge minimum</label>
                    <Input type="number" name="minAgeCriteria" label="Âge minimum" defaultValue={minAgeCriteria} setState={setMinAgeCriteria} />
                    <div>{errors.minAgeCriteria}</div>
                </div>
                <div>
                    <label htmlFor="maxAgeCriteria">Âge maximum</label>
                    <Input type="number" name="maxAgeCriteria" label="Âge maximum" defaultValue={maxAgeCriteria} setState={setMaxAgeCriteria} />
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
                                clearable: true,
                                required: true,
                                options: regionsPossibility,
                                multiple: false,
                                onInputChange: (text, { action, prevInputValue }) => {
                                    if (action === "input-change") {
                                        getRegionsPossibility({ name: text });
                                    } else {
                                        if (prevInputValue !== "") {
                                            getRegionsPossibility();
                                        }
                                    }
                                },
                            }}
                            setState={(item) => {
                                setRegionCriteria(item);
                                getDepartmentsPossibility({ codeRegion: item.value });
                                getCitiesPossibility({ codeRegion: item.value });
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
                                clearable: true,
                                required: true,
                                options: departmentsPossibility,
                                multiple: false,
                                onInputChange: (text, { action, prevInputValue }) => {
                                    if (action === "input-change") {
                                        getDepartmentsPossibility({ name: text });
                                    }
                                    if (action === "menu-close") {
                                        if (prevInputValue !== "") {
                                            getDepartmentsPossibility();
                                        }
                                    }
                                },
                            }}
                            setState={(item) => {
                                setDepartmentCriteria(item);
                                setRegionCriteria({ value: item.codeRegion });
                                getCitiesPossibility({ codeDepartement: item.value });
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
                                clearable: true,
                                required: true,
                                options: citiesPossibility,
                                multiple: false,
                                onInputChange: (text, { action, prevInputValue }) => {
                                    if (action === "input-change") {
                                        getCitiesPossibility({ name: text });
                                    } else {
                                        if (prevInputValue !== "") {
                                            getCitiesPossibility();
                                        }
                                    }
                                },
                            }}
                            setState={(item) => {
                                setCityCriteria(item);
                                setDepartmentCriteria({ value: item.codeDepartement });
                                setRegionCriteria({ value: item.codeRegion });
                            }}
                            defaultValue={cityCriteria}
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
                                defaultValue={participantCategories}
                                extra={{ isMulti: true, required: true, options: participantCategoryPossibility, closeMenuOnSelect: false }}
                                setState={setParticipantCategories}
                            />
                            <div>{errors.participantCategories}</div>
                        </div>
                        <div>
                            <label htmlFor="organizationName">Nom de l'organisation</label>
                            <Input
                                type="select"
                                name="organizationName"
                                label="Nom de l'organisation"
                                defaultValue={organizationName}
                                extra={{ required: true, options: organizationNamePossibility }}
                                setState={setOrganizationName}
                            />
                            <div>{errors.organizationName}</div>
                        </div>
                        <div>
                            <label htmlFor="themes">Thème(s)</label>
                            <Input
                                type="select"
                                name="themes"
                                label="Thèmes"
                                defaultValue={themes}
                                extra={{ required: true, isMulti: true, options: themePossibility, closeMenuOnSelect: false }}
                                setState={setThemes}
                            />
                            <div>{errors.themes}</div>
                        </div>
                    </div>
                </div>
            </BOCreate>
        </div>
    );
}
