import { Link } from 'react-router-dom';
import style from './style.module.scss';
import Icon from '@/components/atoms/Icon';

export default function NotFound({message = "Sorry, the page you were trying to view does not exist."}) {
    return (
        <div className={style.notFoundContainer}>
            <Icon icon={'warning'} size={100} />
            <h1>404 Page Not Found</h1>
            <p>{message}</p>
            <Link to="/">Go to home</Link>
        </div>
    );
}
