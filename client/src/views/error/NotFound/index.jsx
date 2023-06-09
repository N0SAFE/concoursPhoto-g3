import style from './style.module.scss';
import Icon from '@/components/atoms/Icon';

export default function NotFound() {
    return (
        <div className={style.notFoundContainer}>
            <Icon icon={'warning'} size={100} />
            <h1>404 Page Not Found</h1>
            <p>Sorry, the page you were trying to view does not exist.</p>
        </div>
    );
}
