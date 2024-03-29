const Rough = require("../../../Models/Rough");
const Office = require("../../../Models/Office");
const Unused = require("../../../Models/Unused");
const OfficeSort = require("../../../Models/OfficeSorting");
const {v4: uuidv4} = require("uuid");

const create = async (req, res) => {
  const body = req.body;
  const id = uuidv4();
  const unUsed = await Unused.findOne({rough_id: body.rough_id});
  const rough = await Rough.findOne({_id: body.rough_id});
  const officeData = await Office.find({rough_id: body.rough_id});
  const officePacket = new Office({
    ...body,
    id,
    returnStatus: false,
    copyCarat: body.office_total_carat,
    carat: rough.carat,
    packetNo: 0,
    Id :  officeData.length + 1
  });
  // if (body.office_total_carat > Unused.copyCarat) {
  //   res
  //     .status(400)
  //     .json({ message: "Packet Carat is More then Remaining Carat" });
  // } else {
  if (unUsed !== null) {
    try {
      await Unused.updateOne(
        {rough_id: body.rough_id},
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
      res.json({message: error});
    }
  } else {
    try {
      Unused({ rough_id: body.rough_id }, {
        $set: {
          copyCarat: (rough.carat - body.office_total_carat).toFixed(2),
          before_office_carat: (rough.carat - body.office_total_carat).toFixed(2),
        }
      });


    } catch (error) {
      res.json({ message: error });
    }
  }
  try {
    const postSaved = await officePacket.save();
    await Rough.updateOne(
      {_id: body.rough_id},
      {$set: {office_allocated_carat: (rough.office_allocated_carat || 0) + body.office_total_carat}}
    );
    if (postSaved != null) {
      res.json({message: "Rough Assigned Successfully", data: body});
    } else {
      res.json({message: "Database Error"});
    }
  } catch (error) {
    res.json({message: error});
  }
};

const returnPacket = async (req, res) => {
  const body = req.body;
  const unused = await Unused.findOne({rough_id: body.rough_id});
  const rough = await Rough.findOne({_id: body.rough_id})
  const OfficeData = await Office.findOne({rough_id: body.rough_id, _id: body.office_id})
  const returnSorting = new OfficeSort({...body});
  try {
    const returnSortingPackets = await returnSorting.save();
    if (returnSortingPackets != null && unused) {
      await Office.updateOne(
        {_id: body.office_id, rough_id: body.rough_id},
        {
          $set: {
            returnStatus: true,
            return_date: body.createDate,
            mackable: body.mackable,
            office_return_sorting_carat: body.sumOfSortingCarat,
          }
        }
      );

      // await Rough.updateOne({ _id: body.rough_id },
      //   {
      //     $set: {
      //       office_returned_carat: rough.office_returned_carat + body.mackable
      //     }
      //   }
      // )

      await Unused.updateOne(
        {rough_id: body.rough_id},
        {
          $set: {
            mackable: (unused.mackable || 0) + body.mackable,
            office_return_sorting_carat: (unused.office_return_sorting_carat || 0) + body.sumOfSortingCarat,
            after_office_carat : (unused.after_office_carat || 0) + OfficeData?.copyCarat
          },
        }
      );

      res.json({message: "Rough Returned Successfully", unused, OfficeData});
    } else {
      res.json({message: "Database Error"});
    }
  } catch (error) {
    res.json({message: error});
  }
};

const officeView = async (req, res) => {
  const roughId = req.query["roughId"];
  const officeID = req.query["officeID"];
  // const officePacket = OfficePackets.find({off})

  if (officeID || roughId) {

    const data = await Office.find(roughId ? {rough_id: roughId} : {_id: officeID});
      
    try {
      if (data != null) {
        res.json({data, message: "Data retrive Successfully"});
      } else {
        res.json({message: "Database Error"});
      }
    } catch (error) {
      res.json({message: error});
    }
  } else {
    const data = await Office.find()
      .skip(parseInt(req.query["skip"]))
      .limit(parseInt(req.query["limit"]))
      .sort({createdAt: -1});
    const totalData = await Office.find();
    try {
      if (data != null) {
        res.json({
          count: totalData.length,
          data,
          message: "Data retrive Successfully",
        });
      } else {
        res.json({message: "Database Error"});
      }
    } catch (error) {
      res.json({message: error});
    }
  }
};
module.exports = {
  create,
  officeView,
  returnPacket,
};
