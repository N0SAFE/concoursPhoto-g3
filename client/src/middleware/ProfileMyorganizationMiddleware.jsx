import GuardedRoute from '@/layout/GuardedRoute.jsx';
import NotFound from '@/views/error/NotFound/index.jsx';
import { Navigate, useParams } from 'react-router-dom';

export default function ProfileMyorganizationMiddleware({}) {
    return (
        <GuardedRoute
            verify={({ me }) => {
                const { id: _idOrganisation } = useParams();
                const idOrganisation = parseInt(_idOrganisation);
                if (isNaN(idOrganisation)) {
                    return false;
                }
                return {
                    state: !!me.Manage.find(o => o.id === idOrganisation),
                    context: {
                        idOrganisation,
                    },
                };
            }}
            fallback={({ me }) => {
                if (me.Manage.length > 0) {
                    return (
                        <Navigate
                            to={'/profile/myorganization/' + me.Manage[0].id}
                        />
                    );
                } else {
                    return <NotFound />;
                }
            }}
        />
    );
}
