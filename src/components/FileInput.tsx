import { Upload } from 'antd';
import React, { useEffect, useState } from 'react';

interface FileInputProps {
  mode?: 'multiple' | 'single';
  value?: any[] | any;
  onChange?: (value: any[] | any) => void;
  children?: any;
}

export default function FileInput(props: FileInputProps) {
  let [fileList, setFileList] = useState<any[]>([]);

  useEffect(() => {
    // console.log(props.value);
    const newFileList = props.value ? (props.mode === 'multiple' ? props.value : [props.value]) : [];
    setFileList(newFileList);
  }, [props.value]);

  return (
    <div className="file-input">
      <Upload
        listType="text"
        name="excel"
        accept=".xls, .xlsx"
        multiple={props.mode === 'multiple'}
        data={{ tradeId: 0 }}
        fileList={fileList}
        onRemove={file => {
          console.log(file);
          const index = fileList.indexOf(file);
          const newFileList = fileList.slice();
          newFileList.splice(index, 1);
          let newValue = props.mode === 'multiple' ? newFileList : newFileList[0];
          if (props.onChange) props.onChange(newValue);
        }}
        beforeUpload={file => {
          let newValue = props.mode === 'multiple' ? [...fileList, file] : file;
          if (props.onChange) props.onChange(newValue);
          return false;
        }}
      >
        {props.children}
      </Upload>
    </div>
  );
}
