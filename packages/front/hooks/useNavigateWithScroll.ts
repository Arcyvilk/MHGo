import { useNavigate, useLocation } from 'react-router-dom';

export const useNavigateWithScroll = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // This scrolls the page to top when navigated to from home page.
  // We have no reason to restore scroll in this situation.
  const navigateWithoutScroll = (path: string | -1) => {
    if (location.key === 'default') {
      navigate('/');
    }
    if (path === -1) {
      location.state = { preventRestore: true };
      navigate(-1);
    } else {
      navigate(path, {
        preventScrollReset: false,
        state: { preventRestore: true },
      });
    }
  };

  // This scrolls the page to top when navigated to from home page.
  // We have no reason to restore scroll in this situation.
  const navigateWithScroll = (path: string | -1) => {
    if (location.key === 'default') {
      navigate('/');
    }
    if (path === -1) {
      location.state = { preventRestore: false };
      navigate(-1);
    } else {
      navigate(path, {
        preventScrollReset: true,
        state: { preventRestore: false },
      });
    }
  };

  return { navigateWithScroll, navigateWithoutScroll };
};
