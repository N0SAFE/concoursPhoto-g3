import useApiFetch from '@/hooks/useApiFetch';
import { useEffect, useState } from 'react';
import style from './style.module.scss';
import { toast } from 'react-toastify';

export default function FOStats({stats}) {
    return (
        <div className={style.containerStats}>
            <span>{stats.competitionCount} concours publiés</span>
            <span>|</span>
            <span>{stats.organizersCompetitionCount} organisateurs</span>
            <span>|</span>
            <span>{stats.photographersCompetitionCount} photographes</span>
            <span>|</span>
            <span>{stats.picturesCount} photos</span>
            <span>|</span>
            <span>{stats.membersCompetitionCount} membres</span>
        </div>
    );
}
