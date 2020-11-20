import '@/assets/styles/component-style/label-field.less';
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Form, message, Modal } from 'antd';
import { Store } from 'antd/es/form/interface';

/**
 * FormModal的操作
 */
export interface FormModalAction {
  /**
   * 显示表单
   */
  show: (values?: any) => void;
  /**
   * 隐藏表单
   */
  hide: () => void;
}

export interface FormModalProps {
  children: any;
  title: string;
  labelWidth?: number;
  onSubmit: (values: Store) => void;
}

const FormModal = forwardRef<FormModalAction, FormModalProps>(function (
  { title, onSubmit, children, labelWidth }: FormModalProps,
  formModalRef
) {
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [formRef] = Form.useForm();
  const formDataRef = useRef<Store>({});

  useImperativeHandle(formModalRef, () => ({
    show(values?: any) {
      if (values) {
        formDataRef.current = values;
        formRef.resetFields();
        formRef.setFieldsValue(values);
      } else {
        formDataRef.current = {};
        formRef.resetFields();
      }
      setFormModalVisible(true);
    },
    hide() {
      setFormModalVisible(false);
    },
  }));

  async function onModalOk() {
    try {
      const values = await formRef.validateFields();
      Object.keys(values).forEach(key => {
        formDataRef.current[key] = values[key];
      });
      try {
        await onSubmit(formDataRef.current);
        setFormModalVisible(false);
      } catch (error) {
        console.log(error);
        message.error(error.message || '操作失败');
      }
    } catch (error) {}
  }

  return (
    <Modal
      title={title}
      visible={formModalVisible}
      onOk={onModalOk}
      onCancel={() => {
        setFormModalVisible(false);
      }}
    >
      <Form form={formRef} name="formRef" layout="horizontal" labelCol={{ span: labelWidth || 4 }}>
        {children}
      </Form>
    </Modal>
  );
});

export default FormModal;
