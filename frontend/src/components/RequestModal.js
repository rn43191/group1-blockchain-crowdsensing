import { Form, Button, Input, Modal } from "antd";
import "antd/es/form/style/css";
import "antd/es/modal/style/css";
import "antd/es/button/style/css";
import "antd/es/input/style/css";

const RequestModal = ({ isModalVisible, closeModal, addRequest }) => {
  const layout = {
    labelCol: {
      span: 12,
    },
    wrapperCol: {
      span: 12,
    },
  };
  const tailLayout = {
    wrapperCol: {
      offset: 12,
      span: 16,
    },
  };

  const [form] = Form.useForm();

  const onReset = () => {
    form.resetFields();
  };

  const onSubmitForm = (args) => {
    console.log("👉 | onSubmitForm | args", args);
    const { title, description, reward, workersNum } = args;
    addRequest({ title, description, reward, workersNum });
    closeModal();
    onReset();
  };

  return (
    <Modal
      centered
      title="Add Request"
      visible={isModalVisible}
      onCancel={closeModal}
      footer={null}
      destroyOnClose={true}
    >
      <Form {...layout} form={form} name="add-request" onFinish={onSubmitForm}>
        <Form.Item
          name="title"
          label="Title"
          tooltip="Add a Request Title to feasibility."
          rules={[{ required: true, message: "Please input a title!" }]}
        >
          <Input defaultValue={null} allowClear />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true }]}
        >
          <Input.TextArea defaultValue={null} allowClear />
        </Form.Item>
        <Form.Item
          label="Total Reward (ETH)"
          name="reward"
          rules={[
            {
              required: true,
              message: "Please enter a number",
              validator: (_, value) =>
                !isNaN(value)
                  ? Promise.resolve()
                  : Promise.reject(new Error("Please enter a number")),
            },
          ]}
        >
          <Input defaultValue={null} allowClear />
        </Form.Item>
        <Form.Item
          label="Total Workers"
          name="workersNum"
          rules={[
            {
              required: true,
              message: "Please enter a number",
              validator: (_, value) =>
                !isNaN(value)
                  ? Promise.resolve()
                  : Promise.reject(new Error("Please enter a number")),
            },
          ]}
        >
          <Input defaultValue={null} allowClear />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button htmlType="button" onClick={onReset}>
            Reset
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RequestModal;
