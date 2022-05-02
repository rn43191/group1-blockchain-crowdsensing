import { Popover } from "antd";
import "antd/es/popover/style/css";

const VehicleDetailIcon = ({ icon, text, popoverText }) => {
  return (
    <Popover
      content={
        <div className="d-flex" style={{ fontSize: "12px" }}>
          {popoverText}
        </div>
      }
      placement="top"
      trigger="hover"
    >
      <div className="d-flex align-items-center flex-row gap-1 ms-4">
        {icon}
        <div>{text}</div>
      </div>
    </Popover>
  );
};

export default VehicleDetailIcon;
