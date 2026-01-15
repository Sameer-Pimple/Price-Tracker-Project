import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav aria-label="Main Navigation">
            <ul style={{ display: 'flex', gap: '2rem', listStyle: 'none', padding: 0, margin: 0, justifyContent: 'center' }}>
                <li><Link to="/" style={{ textDecoration: 'none', fontWeight: '500', color: '#374151' }}>Landing</Link></li>
                <li><Link to="/deals" style={{ textDecoration: 'none', fontWeight: '500', color: '#374151' }}>Deals</Link></li>
                <li><Link to="/trends" style={{ textDecoration: 'none', fontWeight: '500', color: '#374151' }}>Trends</Link></li>
                <li><Link to="/alerts" style={{ textDecoration: 'none', fontWeight: '500', color: '#374151' }}>Alerts</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;
