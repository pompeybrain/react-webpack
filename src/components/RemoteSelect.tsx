// import { SelectOption } from '@/models/Base';
// import { IValueEnum } from '@/utils/antdAdaptor';

import { Select } from 'antd';
import React, { useEffect, useState } from 'react';

interface SelectOption {
  label: React.ReactNode;
  value: React.ReactText;
  [key: string]: any;
}

interface IValueEnum {
  [key: string]:
    | string
    | {
        text: string;
        status: 'Success' | 'Error' | 'Processing' | 'Warning' | 'Default';
      };
}

interface RemoteSelectProps {
  value?: any[] | string;
  onChange?: (value: any[]) => void;
  mode?: 'multiple' | undefined;
  request?: () => Promise<SelectOption[]>;
  dict?: IValueEnum;
  transform?: (props: any) => any;
}

export default function RemoteSelect(props: RemoteSelectProps) {
  const [value, setValue] = useState<any[] | string>(new Array());
  const [options, setOptions] = useState<any[]>(new Array());

  function updateValue(options: SelectOption[]) {
    if (props.value) {
      let newVal = props.value;
      if (props.mode === 'multiple' && Array.isArray(props.value)) {
        newVal = props.value.filter(id => options.findIndex(option => option.value === id) !== -1);
      }
      setValue(newVal);
    }
  }

  useEffect(() => {
    if (props.request) {
      //TODO: only request when field created;
      props.request().then(remoteOptions => {
        setOptions(remoteOptions);
        updateValue(remoteOptions);
      });
    } else if (props.dict) {
      let options: SelectOption[] = Object.keys(props.dict).map(key => {
        let label = props.dict && props.dict[key];
        if (typeof label !== 'string') {
          label = label?.text;
        }
        return {
          label: label,
          value: key,
        };
      });
      setOptions(options);
      updateValue(options);
    }
  }, [props]);

  function onSelectChanged(selected: any[]) {
    if (props.onChange) props.onChange(selected);
  }

  return <Select<any> mode={props.mode} value={value} onChange={onSelectChanged} options={options}></Select>;
}
