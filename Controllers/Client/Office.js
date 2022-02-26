const Rough = require("../../models/Rough");
const Office = require("../../Models/Office");
const Unused = require("../../Models/Unused");
const OfficeSort = require("../../Models/OfficeSorting");
const { v4: uuidv4 } = require("uuid");

const create = async (req, res) => {
  const body = req.body;
  console.log("create -> body", body);
  const id = uuidv4();
  const unUsed = await Unused.findOne({ rough_id: body.rough_id });
  const rough = await Rough.findOne({ _id: body.rough_id });
  const officePacket = new Office({
    ...body,
    id,
    returnStatus: false,
    copyCarat: body.office_total_carat,
    carat: rough.carat,
    packetNo: 0,
  });
  console.log("create -> rough", rough);
  // if (body.office_total_carat > Unused.copyCarat) {
  //   res
  //     .status(400)
  //     .json({ message: "Packet Carat is More then Remaining Carat" });
  // } else {
  if (unUsed !== null) {
    try {
      await Unused.updateOne(
        { rough_id: body.rough_id },
        {
          $set: {
            copyCarat: (unUsed.copyCarat - body.office_total_carat).toFixed(2),
            before_office_carat: (
              unUsed.copyCarat || 0 - body.office_total_carat
            ).toFixed(2),
          },
        }
      );
    } catch (error) {
      res.json({ message: error });
    }
  } else {
    const unsusedData = new Unused({
      rough_id: body.rough_id,
      carat: rough.carat,
      copyCarat: (rough.carat - body.office_total_carat).toFixed(2),
      before_office_carat: (rough.carat - body.office_total_carat).toFixed(2),
    });
    try {
      unsusedData.save();
    } catch (error) {
      res.json({ message: error });
    }
  }
  try {
    const postSaved = await officePacket.save();
    // console.log("createRough -> body", body, "postsaved", postSaved);
    await Rough.updateOne(
      { _id: body.rough_id },
      { $set: { officecarat: body.office_total_carat } }
    );
    if (postSaved != null) {
      res.json({ message: "Data inserted Successfully", data: body });
    } else {
      res.json({ message: "Database Error" });
    }
  } catch (error) {
    res.json({ message: error });
  }
};

const returnPacket = async (req, res) => {
  const body = req.body;
  console.log("returnPacket -> body", body);
  const unused = await Unused.findOne({ rough_id: body.roughId });
  const returnSorting = new OfficeSort({ ...body });
  try {
    const returnSortingPackets = await returnSorting.save();
    // console.log("createRough -> body", body, "postsaved", postSaved);
    if (returnSortingPackets != null) {
      await Office.updateOne(
        { _id: body.officeId },
        { $set: { returnStatus: true, return_date: body.return_date } }
      );
      await Unused.updateOne(
        { rough_id: body.roughId },
        {
          $set: {
            after_office_carat: body.total_sorting_carat,
            before_office_carat: body.mackable,
            copyCarat: unused.copyCarat + body.total_sorting_carat,
          },
        }
      );
      res.json({ message: "Data inserted Successfully", data: body });
    } else {
      res.json({ message: "Database Error" });
    }
  } catch (error) {
    res.json({ message: error });
  }
};

const officeView = async (req, res) => {
  const body = req.query["id"];
  // const officePacket = OfficePackets.find({off})
  // console.log("viewLissat -> body", body);
  if (body) {
    const data = await Office.find({ _id: body });
    // console.log("viewList -> data", data);
    try {
      // console.log("createRough -> body", body, "postsaved", postSaved);
      if (data != null) {
        res.json({ data, message: "Data retrive Successfully" });
      } else {
        res.json({ message: "Database Error" });
      }
    } catch (error) {
      res.json({ message: error });
    }
  } else {
    const data = await Office.find()
      .skip(parseInt(req.query["skip"]))
      .limit(parseInt(req.query["limit"]))
      .sort({ createdAt: -1 });
    const totalData = await Office.find();
    try {
      // console.log("createRough -> body", body, "postsaved", postSaved);
      if (data != null) {
        res.json({
          count: totalData.length,
          data,
          message: "Data retrive Successfully",
        });
      } else {
        res.json({ message: "Database Error" });
      }
    } catch (error) {
      res.json({ message: error });
    }
  }
};
module.exports = {
  create,
  officeView,
  returnPacket,
};
