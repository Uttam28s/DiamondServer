const Rough = require("../../models/Rough");
const Office = require("../../Models/Office");
const OfficePacket = require("../../Models/OfficePacket");
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");
// const Unused = require("../../Models/Unused");

const create = async (req, res) => {
  const body = req.body;
  // console.log("create -> body", body);
  const id = uuidv4();
  const office = await Office.findOne({ _id: body.office_id });
  // console.log("create -> office", office);

  const officeOnePacket = await OfficePacket.findOne({
    _id: body.packet_id,
  });
  // const officePacketAll = await OfficePacket.find();
  // console.log(
  //   "create -> officePacketAll",
  //   officePacketAll,
  //   "------->",
  //   officePacketAll.length + 2
  // );

  // console.log("create -> office", office);

  if (body.packet_status === "sawing") {
    if (body.return === true) {
      try {
        const sawingDataUpdate = await OfficePacket.updateOne(
          { _id: body.packet_id },
          {
            $set: {
              sawing_return_carat: body.returnCarat || 0,
              sawing_return_pcs: body.returnPcs || 0,
              sawing_diffrence:
                body.difference ||
                officeOnePacket.sawing_issueCarat - body.returnCarat,
              sawing_return_date:
                body.returnDate || moment().format("YYYY-MM-DD"),
              return: true,
              packet_status: "Sawing Return",
            },
          }
        );
        if (sawingDataUpdate !== null) {
          try {
            await Office.updateOne(
              { _id: body.office_id },
              {
                $set: {
                  copyCarat: office.copyCarat + body.returnCarat,
                },
              }
            );
            res.json({ message: "Data Updates Successfully" });
          } catch (error) {
            res.json({ message: error });
          }
        } else {
          res.json({ message: "Database Error" });
        }
      } catch (error) {
        res.json({ message: error });
      }
    } else {
      const data = {
        id,
        office_id: body.office_id,
        type: "sawing",
        sawing_manager_name: body.manager_name || "noName",
        sawing_issueCarat: body.issueCarat || 0.0,
        sawing_issuePcs: body.issuePcs || 0.0,
        return: body.return || false,
        sawing_return_carat: 0,
        sawing_return_pcs: 0,
        sawing_diffrence: 0,
        sawing_return_date: "",
        sawing_assign_date: body.assign_date || moment().format("YYYY-MM-DD"),
        pcs: body.officePacketpcs || 0,
        srno: office.packetNo + 1,
        carat: body.carat || 0,
        packet_status: "Sawing Issue",
      };
      // console.log("create -> data", data);

      const officePacket = new OfficePacket({
        ...data,
      });
      // console.log("create -> officePacket", officePacket);
      try {
        const postSaved = await officePacket.save();
        // console.log("createRough -> body", body, "postsaved", postSaved);
        if (postSaved != null) {
          try {
            await Office.updateOne(
              { _id: body.office_id },
              {
                $set: {
                  copyCarat: office.copyCarat - body.issueCarat,
                  packetNo: office.packetNo + 1,
                },
              }
            );
          } catch (error) {
            res.json({ message: error });
          }
          res.json({ message: "Data inserted Successfully", data: body });
        } else {
          res.json({ message: "Database Error" });
        }
      } catch (error) {
        res.json({ message: error });
      }
    }
  } else {
    if (body.return === true) {
      try {
        const chapkaDataUpdate = await OfficePacket.updateOne(
          { _id: body.packet_id },
          {
            $set: {
              chapka_return_carat: body.returnCarat || 0,
              chapka_return_pcs: body.returnPcs || 0,
              chapka_diffrence:
                body.difference ||
                officeOnePacket.chapka_issueCarat - body.returnCarat,
              chapka_return_date:
                body.returnDate || moment().format("YYYY-MM-DD"),
              return: true,
              packet_status: "Chapka Return",
            },
          }
        );
        // console.log("create -> chapkaDataUpdate", chapkaDataUpdate);
        if (chapkaDataUpdate !== null) {
          try {
            await Office.updateOne(
              { _id: body.office_id },
              {
                $set: {
                  copyCarat: office.copyCarat + body.returnCarat,
                },
              }
            );
            res.json({ message: "Data Updates Successfully" });
          } catch (error) {
            res.json({ message: error });
          }
        } else {
          res.json({ message: "Database Error" });
        }
      } catch (error) {
        res.json({ message: error });
      }
    } else {
      const data = {
        id,
        office_id: body.office_id,
        type: "chapka",
        chapka_manager_name: body.manager_name || "noName",
        chapka_issueCarat: body.issueCarat || 0.0,
        chapka_issuePcs: body.issuePcs || 0.0,
        return: body.return || false,
        chapka_return_carat: 0,
        chapka_return_pcs: 0,
        chapka_diffrence: 0,
        chapka_return_date: "",
        chapka_assign_date: body.assign_date || moment().format("YYYY-MM-DD"),
        pcs: body.officePacketpcs || 0,
        srno: office.packetNo + 1,
        carat: body.carat || 0,
        packet_status: "Chapka Issue",
      };
      // console.log("create -> data", data);

      const officePacket = new OfficePacket({
        ...data,
      });
      // console.log("create -> officePacket", officePacket);
      try {
        const postSaved = await officePacket.save();
        // console.log("createRough -> body", body, "postsaved", postSaved);
        if (postSaved != null) {
          try {
            await Office.updateOne(
              { _id: body.office_id },
              {
                $set: {
                  copyCarat: office.copyCarat - body.issueCarat,
                  packetNo: office.packetNo + 1,
                },
              }
            );
          } catch (error) {
            res.json({ message: error });
          }
          res.json({ message: "Data inserted Successfully", data: body });
        } else {
          res.json({ message: "Database Error" });
        }
      } catch (error) {
        res.json({ message: error });
      }
    }
  }
};

const officePacketView = async (req, res) => {
  const body = req.query["id"];
  const type = req.query["type"];
  const packetDetails = req.query["packetId"];
  console.log("officeView -> body", body);
  if (packetDetails) {
    const packetdetail = await OfficePacket.findOne({ _id: packetDetails });
    try {
      // console.log("createRough -> body", body, "postsaved", postSaved);
      if (packetdetail != null) {
        res.json({
          packetdetail,
          message: "Data retrive Successfully",
        });
      } else {
        res.json({ message: "Database Error" });
      }
    } catch (error) {
      res.json({ message: error });
    }
  } else {
    if (type === "sawing") {
      const data = await OfficePacket.find({ type: "sawing", office_id: body })
        .skip(parseInt(req.query["skip"]))
        .limit(parseInt(req.query["limit"]))
        .sort({ createdAt: -1 });
      const totalData = await OfficePacket.find({
        type: "sawing",
        office_id: body,
      });
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
    } else {
      const data = await OfficePacket.find({ type: "chapka", office_id: body })
        .skip(parseInt(req.query["skip"]))
        .limit(parseInt(req.query["limit"]))
        .sort({ createdAt: -1 });
      const totalData = await OfficePacket.find({
        type: "chapka",
        office_id: body,
      });
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
  }
};
module.exports = {
  create,
  officePacketView,
  // updateOfficePacket,
};
