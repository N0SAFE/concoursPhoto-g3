import useApiFetch from '@/hooks/useApiFetch.js';
import useLocation from '@/hooks/useLocation.js';
import GuardedRoute from '@/layout/GuardedRoute.jsx';
import NotFound from '@/views/error/NotFound/index.jsx';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function CompetitionMiddleware() {
    const [isLoading, setIsLoading] = useState(true);
    const apiFetch = useApiFetch();
    const { getCityByCode, getDepartmentByCode, getRegionByCode } =
        useLocation();
    const [entity, setEntity] = useState({});
    const { id: competitionId } = useParams();
    const [error, setError] = useState({});

    const getCompetitions = controller => {
        return apiFetch('/competitions/view/' + competitionId, {
            query: {
                groups: [
                    'file:read',
                    'competition:competitionVisual:read',
                    'competition:competitionPictures:read',
                    'competition:organization:read',
                    'organization:logo:read',
                    'organization:admins:read',
                    'user:read',
                    'picture:file:read',
                    'competition:memberOfTheJuries:read',
                    'memberOfTheJury:user:read',
                    'competition:theme:read',
                    'theme:read',
                    'competition:sponsors:read',
                    'sponsor:read',
                    'sponsor:logo:read',
                    'picture:user:read',
                ],
            },
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            signal: controller?.signal,
        })
            .then(res => res.json())
            .then(async data => {
                console.debug(data);
                if (data.code === 401) {
                    throw new Error(data.message);
                }
                return await Promise.all([
                    Promise.all(data.cityCriteria.map(getCityByCode)),
                    Promise.all(
                        data.departmentCriteria.map(getDepartmentByCode)
                    ),
                    Promise.all(data.regionCriteria.map(getRegionByCode)),
                ]).then(([cities, departments, regions]) => {
                    const _competition = {
                        ...data,
                        cityCriteria: cities,
                        departmentCriteria: departments,
                        regionCriteria: regions,
                    };
                    setEntity(_competition);
                    return _competition;
                });
            }).catch(async r => {
                console.log(r);
                if(r instanceof DOMException && r.name === 'AbortError'){
                    return r
                }
                return await r.json().then(function(e){
                    console.log(e)
                    if(e['hydra:description'] === 'Not Found'){
                        setError({
                            code: 404,
                            message: 'Concours introuvable'
                        });
                    }
                })
            })
    };

    useEffect(() => {
        const controller = new AbortController();
        const promise = getCompetitions(controller);
        promise.then(function (r) {
            if(r instanceof DOMException && r.name === 'AbortError'){
                return
            }
            setIsLoading(false);
        });
        if (import.meta.env.MODE === 'development') {
            toast.promise(promise, {
                pending: 'Chargement du concours',
                success: 'Concours chargé',
                error: 'Erreur lors du chargement du concours',
            });
        }

        return () => setTimeout(() => controller.abort());
    }, []);

    return (
        <GuardedRoute
            verify={function () {
                if (error.code === 404) {
                    return false;
                } else {
                    return {
                        state: true,
                        context: {
                            competition: entity,
                            isLoading: isLoading,
                        },
                    };
                }
            }}
            fallback={function () {
                return <NotFound message={error.message} />
            }}
        />
    );
}
