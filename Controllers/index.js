module.exports = {
  //   AuthController: require("./AuthController"),
  RoughCreate: require("./Client/Office/Rough"),
  officeCreate: require("./Client/Office/Office"),
  officeCreatePacket: require("./Client/Office/OfficePacket"),
  commonController: require("./Client/Office/Common"),
  factoryCreate: require("./Client/Factory/Factory"),
  factoryCreatePacket: require("./Client/Factory/FactoryPacket"),
  deleteModel: require('./Client/Modification/delete'),
  editModel: require('./Client/Modification/Edit'),
  employeeModel: require('./Client/Employee/Employee')

};
