import { useModal } from '@/contexts/ModalContext/index.jsx';
import Chip from '../Chip/index.jsx';

export function defaultOnClick(e, { showModal, setModalContent, props }) {
    setModalContent({
        content: (
            <img
                style={{
                    width: '100%',
                    objectFit: 'contain',
                    justifyContent: 'space-between',
                }}
                {...props}
            />
        ),
        bottom: (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Chip backgroundColor={'white'}>
                    {props?.photographer?.lastname +
                        ' ' +
                        props?.photographer?.firstname}
                </Chip>
                <div>right</div>
            </div>
        ),
    });
    showModal();
}

export default function (props) {
    console.log(props?.photographer?.lastname);
    const { showModal, setModalContent } = useModal();
    return (
        <img
            style={{ cursor: 'pointer' }}
            {...props}
            onClick={function (e) {
                props.onClick
                    ? props.onClick(e, { showModal, setModalContent, props })
                    : defaultOnClick(e, { showModal, setModalContent, props });
            }}
        />
    );
}
