import { useEffect, PropsWithChildren } from 'react';
import ReactDOM from 'react-dom';

export const Portal = ({ children }: PropsWithChildren) => {
  const rootContainer = document.getElementById('app_root') ?? document.body;
  const container = document.createElement('div');
  container.style.display = 'contents';

  useEffect(() => {
    rootContainer.appendChild(container);
    return () => {
      rootContainer.removeChild(container);
    };
  }, []);

  const portal = ReactDOM.createPortal(children, container);

  return portal;
};
