
import './title.css';

export default function Title({ children, name }) {
    return (
        <div className="title-row">
            {children}
            <span>{name}</span>
        </div>
    )
}