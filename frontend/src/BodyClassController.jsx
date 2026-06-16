import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function BodyClassController() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/entries') {
      document.body.classList.add('entries-page');
    } else {
      document.body.classList.remove('entries-page');
    }

    return () => {
      document.body.classList.remove('entries-page');
    };
  }, [location.pathname]);

  return null;
}

export default BodyClassController;
