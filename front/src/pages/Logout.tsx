import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../provider/AuthProvider';

function Logout() {
    const navigate = useNavigate();
    const { logoutAndClearToken } = useAuth();

    useEffect(() => {
        const logoutUser = async () => {
            try {
                
                logoutAndClearToken();
                navigate('/login');
            } catch (error) {
                console.error('Logout failed:', error);
                navigate('/login');
            }
        };

        logoutUser();
    }, [navigate, logoutAndClearToken]);

    return null; 
}

export default Logout;
