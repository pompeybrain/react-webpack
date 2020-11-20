import { subscribeEvent, unSubscribeEvent } from '@/utils/util';
import { useEffect, useRef, useState } from 'react';

export interface ResizableContainerOutputProps {
  height?: number;
  width?: number;
}

export default function useResizableContainer(initialHeight?: number, reducer?: number) {
  let [height, setHeight] = useState(initialHeight || 500);
  const containerAnchor = useRef<HTMLDivElement>(null);

  function computeHeight() {
    if (containerAnchor.current && containerAnchor.current.clientHeight) {
      // console.log(containerAnchor.current.clientHeight);
      let newHeight = containerAnchor.current.clientHeight - (reducer || 0);
      // console.log(newHeight);
      setHeight(newHeight);
    }
  }

  useEffect(() => {
    // 立即执行一次
    // console.log(containerAnchor.current);
    computeHeight();
    let observer: ResizeObserver;
    if (containerAnchor.current) {
      // console.log('start observer container mutation');
      observer = new ResizeObserver(entries => {
        // console.log(entries);
        computeHeight();
      });
      observer.observe(containerAnchor.current as Node);
    }
    subscribeEvent('resize', computeHeight);
    return () => {
      if (observer) observer.disconnect();
      unSubscribeEvent('resize', computeHeight);
    };
  }, []);

  return { containerAnchor, height };
}
