import React from 'react';

export default function usePerformace(name?: string) {
  let tagName = name || 'performaceTag';
  console.log('start render: ' + tagName);
  performance.mark(tagName + '-Start');
  React.useEffect(() => {
    performance.mark(tagName + '-End');
    let measure: any = window.performance.measure(tagName + '-timing', tagName + '-Start', tagName + '-End');
    console.log(tagName + ' timing: ' + measure.duration);
  });
}
