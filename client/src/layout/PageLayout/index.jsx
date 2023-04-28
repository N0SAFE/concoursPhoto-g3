import { Outlet } from 'react-router-dom';
import Header from '@/layout/PageLayout/Header';
import Footer from '@/layout/PageLayout/Footer';

export default function PageLayout({ environment }) {
    return (
        <>
            <div>
                <Header environment={environment} />
                <div style={{ marginLeft: '40px', marginRight: '40px' }}>
                    <Outlet />
                </div>
            </div>
            <Footer />
        </>
    );
}
