import { Outlet } from 'react-router-dom';
import Header from '@/layout/PageLayout/Header';
import Footer from '@/layout/PageLayout/Footer';
import style from './style.module.scss';

export default function PageLayout({ environment }) {
    return (
        <>
            <div className={style.pageContainer}>
                <Header environment={environment} />
                <div>
                    <Outlet />
                </div>
            </div>
            <Footer />
        </>
    );
}

