import '@/assets/styles/component-style/label-field.less';
import { useEffect } from 'react';
import ReactDOM from 'react-dom';

export interface PortalProps {
  parentNodeClass: string;
  containerClass: string;
  children: any;
}

export default function Portal({ containerClass, parentNodeClass, children }: PortalProps) {
  // console.log('rerender Portal');
  const container = document.createElement('div');
  container.className = containerClass;

  useEffect(() => {
    const parentNode = document.getElementsByClassName(parentNodeClass)[0];
    if (parentNode) parentNode.appendChild(container);
    return () => {
      if (parentNode) parentNode.removeChild(container);
    };
  });

  return ReactDOM.createPortal(children, container);
}
