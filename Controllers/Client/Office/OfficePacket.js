const Rough = require("../../../Models/Rough");
const Office = require("../../../Models/Office");
const OfficePacket = require("../../../Models/OfficePacket");
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");
// const Unused = require("../../Models/Unused");

const create = async (req, res) => {
  const body = req.body;
  const id = uuidv4();
  const office = await Office.findOne({ _id: body.office_id });

  const officeOnePacket = await OfficePacket.findOne({
    _id: body.packet_id,
  });

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
                $inc : { loseCarat : body.difference || officeOnePacket.sawing_issueCarat - body.returnCarat }
              }
            );
            res.json({ message: "Office SubPacket Returned Successfully" });
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
        sawing_assigne_name: body.assigne_name || "noName",
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

      const officePacket = new OfficePacket({
        ...data,
      });
      try {
        const postSaved = await officePacket.save();
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
          res.json({ message: "Office Sub Packet Created Successfully", data: body });
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
              //   `${(100 - (((officeOnePacket.chapka_issueCarat - body.returnCarat) / officeOnePacket.chapka_issueCarat) * 100))}%`,
              chapka_return_date:
                body.returnDate || moment().format("YYYY-MM-DD"),
              return: true,
              packet_status: "Chapka Return",
            },
          }
        );
        if (chapkaDataUpdate !== null) {
          try {
            await Office.updateOne(
              { _id: body.office_id },
              {
                $set: {
                  copyCarat: office.copyCarat + body.returnCarat,
                },
                $inc : { loseCarat : body.difference || officeOnePacket.chapka_issueCarat - body.returnCarat }
              }
            );
            res.json({ message: "Office SubPacket Returned Successfully" });
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
        chapka_assigne_name: body.assigne_name || "noName",
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

      const officePacket = new OfficePacket({
        ...data,
      });
      try {
        const postSaved = await officePacket.save();
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
          res.json({ message: "Office Sub Packet Created Successfully", data: body });
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
  const officeID = req.query["officeID"]
  const checkStatus = req.query["checkStatus"]
  if (officeID && checkStatus) {
    const packetdetail = await OfficePacket.find({ office_id: officeID });
    const OfficeRough = await Office.find({ _id: officeID })
    let flag = { msg: "All Packet Is Returned ", returned: true }
    packetdetail.map((data) => {
      if (data.packet_status.includes("Issue")) {
        flag = { msg: "All Packet Is Not Returned Yet", returned: false }
      }
    })

    res.json({
      ...flag,
      copyCarat: OfficeRough[0].copyCarat,
      message: "Data asasas retrive Successfully",
    });
    //res.send()
    return
  }
  if (packetDetails) {
    const packetdetail = await OfficePacket.findOne({ _id: packetDetails });
    try {
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
