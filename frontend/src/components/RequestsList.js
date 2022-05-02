import { useState } from "react";
import cx from "classnames";
import { Modal, List, Avatar, Button, Popover } from "antd";
import _toNumber from "lodash/toNumber";
import { BsFillPersonFill } from "react-icons/bs";
import { FaEthereum } from "react-icons/fa";
import { GrInProgress } from "react-icons/gr";
import { HiDocumentReport } from "react-icons/hi";

import "antd/es/modal/style/css";
import "antd/es/list/style/css";
import "antd/es/avatar/style/css";
import "antd/es/button/style/css";
import "antd/es/popover/style/css";
import VehicleDetailIcon from "./VehicleDetailsIcon";

const RequestsList = ({ requests }) => {
  const [requestId, setRequestId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const progress = (count, total) => {
    if (count === 0) return "Not yet started";
    if (count === total) return "Completed";
    return "In Progress";
  };

  const color = (count, total) => {
    if (count === 0) return "red";
    if (count === total) return "green";
    return "yellow";
  };

  const onClick = (id) => {
    setRequestId(id);
    setIsModalVisible(true);
  };

  return (
    <div className="vehicle-list">
      <List
        itemLayout="horizontal"
        dataSource={requests}
        style={{ backgroundColor: "rgba(255,255,255,0.5)" }}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button
                type="link"
                shape="circle"
                icon={<HiDocumentReport />}
                onClick={() => onClick(item.id)}
                disabled={item.datas.length !== _toNumber(item.workersNum)}
                className={cx({
                  report: item.datas.length === _toNumber(item.workersNum),
                })}
              >
                Report
              </Button>,
            ]}
            style={{
              paddingLeft: "16px",
              paddingRight: "24px",
            }}
          >
            <List.Item.Meta
              avatar={
                <Popover
                  content={progress(
                    item.datas.length,
                    _toNumber(item.workersNum)
                  )}
                  placement="top"
                  trigger="hover"
                >
                  <Avatar
                    size="small"
                    shape="square"
                    style={{
                      backgroundColor: color(
                        item.datas.length,
                        _toNumber(item.workersNum)
                      ),
                      verticalAlign: "middle",
                      border: "1px solid black",
                    }}
                  />
                </Popover>
              }
              title={item.title}
              description={item.description}
            />
            <VehicleDetailIcon
              icon={<FaEthereum />}
              text={item.reward.slice(0, -18)}
              popoverText={`Request Total Reward: ${item.reward.slice(
                0,
                -18
              )} ETH`}
            />
            <VehicleDetailIcon
              icon={<BsFillPersonFill />}
              text={item.workersNum}
              popoverText={`Total Workers Alloted: ${item.workersNum}`}
            />
            <VehicleDetailIcon
              icon={<GrInProgress />}
              text={`${item.datas.length}/${item.workersNum}`}
              popoverText={"Total Data Submitted"}
            />
          </List.Item>
        )}
      />
      <Modal
        title={requests[_toNumber(requestId) - 1]?.title ?? ""}
        visible={isModalVisible}
        footer={null}
        centered
        onCancel={() => setIsModalVisible(false)}
      >
        <div
          style={{
            minWidth: "400px",
          }}
        >
          <List
            size="large"
            bordered
            dataSource={requests[_toNumber(requestId) - 1]?.datas}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </div>
      </Modal>
    </div>
  );
};

export default RequestsList;
