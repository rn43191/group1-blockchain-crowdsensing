const CrowdSensing = artifacts.require("./CrowdSensing.sol");

module.exports = function (deployer) {
  deployer.deploy(CrowdSensing, { value: "2000000000000000000" });
};
