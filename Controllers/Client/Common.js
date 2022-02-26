const Rough = require("../../models/Rough");
const OfficePacket = require("../../Models/OfficePacket");
const Office = require("../../Models/Office");

const getList = async (req, res) => {
  // const body = req.body;
  const roughId = req.query["roughId"];
  if (roughId && roughId === 0) {
    res.json({ message: " no office data available" });
  } else {
    const data = await Rough.find(
      { completed: false },
      { carat: 1, _id: 1 }
    ).sort({ createdAt: -1 });
    // const packetSrNo = await OfficePacket.find({}, { srno: 1, _id: 1 });
    // console.log("getList -> caratList", data);
    let officeId = [];

    if (req.query["roughId"]) {
      officeId = await Office.find(
        { rough_id: roughId },
        { office_total_carat: 1, _id: 1, copyCarat: 1 }
      );
    }
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
  // const body = req.body;
  const roughId = req.query["officeId"];
  const srno = req.query["srno"];

  if (roughId === 0) {
    res.json({ message: " no office data available" });
  } else if (srno) {
    const packetSrNo = await OfficePacket.find(
      { office_id: roughId, return: false },
      { srno: 1, _id: 1 }
    );
    // console.log("getList -> caratList", data);
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
    const packetSrNo = await Office.find({ _id: roughId }, { packetNo: 1 });
    // console.log("getList -> caratList", data);
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

module.exports = {
  getList,
  getOfficeSrno,
};
