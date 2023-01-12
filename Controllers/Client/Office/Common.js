const Rough = require("../../../Models/Rough");
const OfficePacket = require("../../../Models/OfficePacket");
const Office = require("../../../Models/Office");
const Unused = require("../../../Models/Unused");
const FactoryPacket = require("../../../Models/FactoryPacket");
const OfficeSorting = require("../../../Models/OfficeSorting");
const Factory = require("../../../Models/Factory");
const Sorting = require("../../../Models/Sorting");
const Common = require("../../../Models/Common");

const getList = async (req, res) => {
  // const body = req.body;
  const roughId = req.query["roughId"];
  if (roughId && roughId === 0) {
    res.json({ message: " no office data available" });
  } else {
    const data = await Rough.find(
      { completed: false },
      { carat: 1, _id: 1, Id: 1 }
    ).sort({ createdAt: -1 });
    // const packetSrNo = await OfficePacket.find({}, { srno: 1, _id: 1 });
    // console.log("getList -> caratList", data);
    let officeId = [];

    if (req.query["roughId"]) {
      officeId = await Office.find(
        { rough_id: roughId, returnStatus: false },
        { office_total_carat: 1, _id: 1, copyCarat: 1, Id: 1 }
      );
    }
    // for the Factory
    // if (req.query["roughId"]) {
    //   officeId = await Factory.find(
    //     {rough_id: roughId, returnStatus: false},
    //     {factory_total_carat: 1, _id: 1, copyCarat: 1}
    //   );
    // }

    const commonGet = {
      caratList: data,
      officeDetails: officeId,
    };
    try {
      // console.log("createRough -> body", body, "postsaved", postSaved);
      if (commonGet != null) {
        res.json({ commonGet, message: "Data inserted Successfully" });
      } else {
        res.json({ message: "Database Error" });
      }
    } catch (error) {
      res.json({ message: error });
    }
  }
};

const getOfficeSrno = async (req, res) => {
  //await FactoryPacket.find().then((d)=>{

  //   d.map(async(c,i)=>{
  //     console.log("🚀 ~ file: Common.js ~ line 52 ~ awaitFactoryPacket.find ~ d", d)
  //    await FactoryPacket.updateOne({id:c.id},{
  //       $set:{
  //         srno:i+1
  //       }
  //     })

  //   })
  // })

  await OfficeSorting.find().then(async (data) => {
    // console.log('data', data)
    await data.map(async (val) => {
      await OfficeSorting.updateOne(
        { _id: val._id },
        {
          $set: {
            rough_id: val.office_id,
            office_id: val.rough_id,
          },
        }
      );
    });
  });

  // const body = req.body;
  const roughId = req.query["officeId"];
  const srno = req.query["srno"];
  // console.log('roughId', roughId, srno)
  if (roughId === 0) {
    res.json({ message: " no office data available" });
  } else if (srno) {
    const packetSrNo = await OfficePacket.find({
      office_id: roughId,
      return: false,
    });
    //; console.log("getList -> caratList", packetSrNo);
    try {
      // console.log("createRough -> body", body, "postsaved", postSaved);
      if (packetSrNo != null) {
        res.json({ packetSrNo, message: "Data inserted Successfully" });
      } else {
        res.json({ message: "Database Error" });
      }
    } catch (error) {
      res.json({ message: error });
    }
  } else {
    const packetSrNo = await Office.findById(
      { _id: roughId },
      { packetNo: 1, copyCarat: 1, office_assigne_name: 1 }
    );
    packetSrNo["packetNo"] = packetSrNo["packetNo"] + 1;
    // console.log("getList -> caratList", packetSrNo);
    try {
      // console.log("createRough -> body", body, "postsaved", postSaved);
      if (packetSrNo != null) {
        res.json({ packetSrNo, message: "Data inserted Successfully" });
      } else {
        res.json({ message: "Database Error" });
      }
    } catch (error) {
      res.json({ message: error });
    }
  }
};

const unusedList = async (req, res) => {
  const roughId = req.query["roughId"];
  console.log("🚀 ~ file: Common.js ~ line 84 ~ unusedList ~ roughId", roughId);
  if (roughId && roughId === 0) {
    res.json({ message: " no office data available" });
  } else {
    const data = await Unused.findOne({ rough_id: roughId });
    console.log("roughIdaaaa", roughId, data);
    try {
      if (data != null) {
        res.json({ data, message: "Data Retrived Successfully" });
      } else {
        res.json({ message: `Database as Error` });
      }
    } catch (error) {
      res.json({ message: error });
    }
  }
};

const clearDatabase = async (Req, res) => {
  await Rough.deleteMany();
  await Sorting.deleteMany();
  await Office.deleteMany();
  await OfficePacket.deleteMany();
  await OfficeSorting.deleteMany();
  await Factory.deleteMany();
  await FactoryPacket.deleteMany();
  await Unused.deleteMany();
  res.json({ message: "Data Retrived Successfully" });
};

const addEmployeeType = async (req, res) => {
  try {
    const { name } = req.body;
    let CommonObj = await Common.findOne();
    CommonObj?.type.map((ele) => {
      if(ele.name === name){
        res.status(400).json({ message: "Type Already Occupied" });
      }
    })
    let type = CommonObj.type || [];
    type.push({ name: name });
    await Common.findOneAndUpdate(
      { _id: CommonObj._id },
      {
        $set: {
          type: type,
        },
      },
      { new: true }
    );
    res.json({ message: "Updated Successfully" });
  } catch (e) {
    console.log("🚀 ~ file: Common.js:171 ~ addEmployeeType ~ e", e);
  }
};

const getEmployeeType = async (req,res) => {
  try{
    let data = await Common.findOne()
    console.log("🚀 ~ file: Common.js:188 ~ getEmployeeType ~ data", data)
    let type = data.type
    res.json({ type ,message: "Updated Successfully" });

  }catch(e){
    console.log("🚀 ~ file: Common.js:171 ~ addEmployeeType ~ e", e);
  }
}


const addPurityType = async (req, res) => {
  try {
    const { purity } = req.body;
    let CommonObj = await Common.findOne();
    CommonObj?.purityType.map((ele) => {
      if(ele.purity === purity){
        res.status(400).json({ message: "Type Already Occupied" });
      }
    })
    let type = CommonObj.purityType || [];
    type.push({ purity: purity });
    await Common.findOneAndUpdate(
      { _id: CommonObj._id },
      {
        $set: {
          purityType: type,
        },
      },
      { new: true }
    );
    res.json({ message: "Updated Successfully" });
  } catch (e) {
    res.status(400).json({ message: "Type Already Occupied" });
  }
};

const getPurityType = async (req,res) => {
  try{
    let CommonData = await Common.findOne()
    let data = CommonData.purityType
    res.json({ data ,message: "Updated Successfully" });

  }catch(e){
    res.status(400).json({ message: "Something Went Wrong" });
  }
}

module.exports = {
  getList,
  getOfficeSrno,
  unusedList,
  clearDatabase,
  addEmployeeType,
  getEmployeeType,
  addPurityType,
  getPurityType
};
