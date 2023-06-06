import Button from '@/components/atoms/Button/index.jsx';
import Table from '@/components/molecules/Table/index.jsx';
import { useModal } from '@/contexts/ModalContext/index.jsx';
import { useEffect } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';

export default function MyorganizationAdmin() {
    const [searchParams, setSearchParams] = useSearchParams({});
    const { showModal, setModalContent } = useModal();
    const { idOrganisation, selectedOrganisation } = useOutletContext();

    if (isNaN(idOrganisation)) {
        return <div>the idOrganisation is not a number</div>;
    }

    useEffect(() => {
        if (
            searchParams.get('edit') === 'true' &&
            !isNaN(parseInt(searchParams.get('id')))
        ) {
            console.log('edit admin');
            setModalContent(<div>edit admin</div>);
            showModal(function () {
                console.log('hide modal');
                delete searchParams.edit;
                delete searchParams.id;
                setSearchParams({ ...searchParams });
            });
        }
        if (searchParams.get('create') === 'true') {
            console.log('create admin');
            setModalContent(<div>add admin</div>);
            showModal(function () {
                console.log('hide modal');
                delete searchParams.create;
                setSearchParams({ ...searchParams });
            });
        }
    }, [searchParams]);


    return (
        <>
            <Table
                list={selectedOrganisation?.admins}
                fields={['Nom', 'Prenom', 'Fonction/poste']}
                onLineClick={function (admin) {
                    setSearchParams({
                        ...searchParams,
                        edit: true,
                        id: admin.id,
                    });
                }}
            >
                {admin => {
                    return [
                        {
                            content: admin.lastname,
                        },
                        {
                            content: admin.firstname,
                        },
                        {
                            content: admin.job,
                        },
                    ];
                }}
            </Table>
            <div
                style={{ width: '100%', display: 'flex', flexDirection: 'row' }}
            >
                <Button
                    onClick={() => {
                        setSearchParams({
                            ...searchParams,
                            create: true,
                        });
                    }}
                    style={{
                        marginTop: '1rem',
                        padding: '1rem 1.5rem',
                        borderRadius: '2rem',
                    }}
                >
                    Ajouter un administrateur
                </Button>
            </div>
        </>
    );
}
