import { Form, Modal, Button, Input, Select } from "antd";
import _map from "lodash/map";
import _find from "lodash/find";
import _filter from "lodash/filter";
import _size from "lodash/size";
import _toNumber from "lodash/toNumber";
import "antd/es/form/style/css";
import "antd/es/modal/style/css";
import "antd/es/button/style/css";
import "antd/es/input/style/css";
import "antd/es/select/style/css";

const { Option } = Select;

const DataModal = ({
  isModalVisible,
  closeModal,
  requests,
  addData,
  addresses,
}) => {
  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };
  const tailLayout = {
    wrapperCol: {
      offset: 8,
      span: 16,
    },
  };

  const [form] = Form.useForm();

  const onReset = () => {
    form.resetFields();
  };

  const onSubmitForm = (args) => {
    console.log("👉 | onSubmitForm | args", args);
    const { id, data } = args;

    const _request = _find(requests, { id: id });

    addData(
      addresses[_size(_request.datas)],
      _request.reward / _request.workersNum,
      _request,
      data
    );
    console.log(
      "👉 | onSubmitForm | bounty reward to",
      addresses[_size(_request.datas)],
      _request.reward / _request.workersNum
    );
    closeModal();
    onReset();
  };

  return (
    <Modal
      centered
      title="Submit data"
      visible={isModalVisible}
      onCancel={closeModal}
      footer={null}
      destroyOnClose={true}
    >
      <Form {...layout} form={form} name="submit-data" onFinish={onSubmitForm}>
        <Form.Item name="id" label="Request" rules={[{ required: true }]}>
          <Select
            placeholder="Select an request ID"
            defaultValue={null}
            allowClear
          >
            {_map(
              _filter(
                requests,
                (_request) =>
                  _request.datas.length !== _toNumber(_request.workersNum)
              ),
              (_request) => (
                <Option value={_request.id}>
                  ID: {_request.id} Title: {_request.title}
                </Option>
              )
            )}
          </Select>
        </Form.Item>

        <Form.Item
          name="data"
          label="Request Data"
          rules={[{ required: true }]}
        >
          <Input.TextArea defaultValue={null} allowClear />
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

export default DataModal;
