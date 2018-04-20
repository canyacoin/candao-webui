var CanYaDao = artifacts.require("./CanYaDao.sol");

module.exports = async function(deployer) {
  await deployer.deploy(CanYaDao);
};