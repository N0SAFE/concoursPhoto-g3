import style from './style.module.scss';
import useApiFetch from '@/hooks/useApiFetch.js';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// requestType possibility :
// last-pictures-posted
// last-pictures-obtained-votes
// pictures-obtained-price

export default function PicturesAside({ requestType }) {
    const apiFetch = useApiFetch();
    const [lastPictures, setLastPictures] = useState([]);
    const { id: competitionId } = useParams();

    const getLastPictures = () => {
        return apiFetch(`/competitions/${competitionId}/${requestType}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(res => res.json())
            .then(data => {
                console.debug(data);
                if (data.code === 401) {
                    throw new Error(data.message);
                }
                setLastPictures(data['hydra:member']);
                return data;
            })
            .catch(error => {
                console.error(error);
            });
    };

    useEffect(() => {
        const controller = new AbortController();

        // get last pictures posted in this competition
        getLastPictures();

        return () => setTimeout(() => controller.abort());
    }, []);

    return (
        <div className={style.asideContainer}>
            <div>
                <h2>
                    Dernières photos{' '}
                    {requestType === 'last-pictures-posted'
                        ? 'soumises'
                        : requestType === 'last-pictures-obtained-votes'
                        ? 'ayant obtenu un vote'
                        : 'ayant obtenu un prix'}
                </h2>
                <div>
                    {lastPictures.map(picture => {
                        return (
                            <img
                                src={
                                    import.meta.env.VITE_API_URL +
                                    '/' +
                                    picture.path
                                }
                                alt={picture.competition_name}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
