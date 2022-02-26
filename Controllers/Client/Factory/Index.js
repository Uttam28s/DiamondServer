const Rough = require("../../../models/Rough");
// const Office = require("../../../Models/Office");
const Unused = require("../../../Models/Unused");
const Factory = require("../../../Models/Factory/Index");
// const OfficeSort = require("../../Models/OfficeSorting");
const { v4: uuidv4 } = require("uuid");

const create = async (req, res) => {
  const body = req.body;
  console.log("create -> body", body);
  const id = uuidv4();
  const unUsed = await Unused.findOne({ rough_id: body.rough_id });
  console.log("create -> unUsed", unUsed);
  const rough = await Rough.findOne({ _id: body.rough_id });
  const roughPacket = new Factory({
    ...body,
    id,
    returnStatus: false,
    copyCarat: body.factory_total_carat,
    carat: rough.carat,
    packetNo: 0,
  });
  console.log("create -> rough", roughPacket);
  // if (body.office_total_carat > Unused.copyCarat) {
  //   res
  //     .status(400)
  //     .json({ message: "Packet Carat is More then Remaining Carat" });
  // } else {

  if (unUsed.mackable <= body.factory_total_carat) {
    if (unUsed !== null) {
      try {
        await Unused.updateOne(
          { rough_id: body.rough_id },
          {
            $set: {
              copyCarat: (unUsed.copyCarat - body.factory_total_carat).toFixed(
                2
              ),
              before_factory_carat: (
                unUsed.copyCarat || 0 - body.factory_total_carat
              ).toFixed(2),
            },
          }
        );
      } catch (error) {
        res.json({ message: error });
      }
    } else {
      // const unsusedData = new Unused({
      //   rough_id: body.rough_id,
      //   carat: rough.carat,
      //   copyCarat: (rough.carat - body.factory_total_carat).toFixed(2),
      //   before_office_carat: (rough.carat - body.factory_total_carat).toFixed(2),
      // });
      // try {
      //   unsusedData.save();
      // } catch (error) {
      //   res.json({ message: error });
      // }
    }
    try {
      const postSaved = await roughPacket.save();
      // console.log("createRough -> body", body, "postsaved", postSaved);
      await Rough.updateOne(
        { _id: body.rough_id },
        { $set: { factorycarat: body.factory_total_carat } }
      );
      if (postSaved != null) {
        res.json({ message: "Data inserted Successfully", data: body });
      } else {
        res.json({ message: "Database Error" });
      }
    } catch (error) {
      res.json({ message: error });
    }
  } else {
    res.json({ message: "mackable is not sufficient" });
  }
};

// const returnPacket = async (req, res) => {
//   const body = req.body;
//   console.log("returnPacket -> body", body);
//   const unused = await Unused.findOne({ rough_id: body.roughId });
//   // const returnOfficePacket = await OfficeSort.findOne({office_id : body.office_id});
//   const returnSorting = new OfficeSort({ ...body });
//   // if(returnOfficePacket !== null){
//   //   await OfficeSort.updateOne(
//   //     { office_id: body.office_id },
//   //     {
//   //       $set: {
//   //         mackable: body.total_sorting_carat,
//   //         total_sorting_carat: body.mackable,
//   //         sortingData:
//   //         // copyCarat: unused.copyCarat + body.total_sorting_carat,
//   //       },
//   //     }
//   //   );
//   // } else {
//   try {
//     const returnSortingPackets = await returnSorting.save();
//     // console.log("createRough -> body", body, "postsaved", postSaved);
//     if (returnSortingPackets != null) {
//       await Office.updateOne(
//         { _id: body.office_id },
//         { $set: { returnStatus: true, return_date: body.return_date } }
//       );
//       if (unused === null) {
//         await Unused.updateOne(
//           { rough_id: body.rough_id },
//           {
//             $set: {
//               after_office_carat: body.total_sorting_carat,
//               before_office_carat: body.mackable,
//               mackable: body.mackable,
//               // copyCarat: unused.copyCarat + body.total_sorting_carat,
//             },
//           }
//         );
//       } else {
//         await Unused.updateOne(
//           { rough_id: body.rough_id },
//           {
//             $set: {
//               after_office_carat:
//                 unused.after_office_carat + body.total_sorting_carat,
//               before_office_carat: unused.before_office_carat + body.mackable,
//               mackable: unused.mackable + body.mackable,
//               // copyCarat: unused.copyCarat + body.total_sorting_carat,
//             },
//           }
//         );
//       }
//       res.json({ message: "Data inserted Successfully", data: body });
//     } else {
//       res.json({ message: "Database Error" });
//     }
//   } catch (error) {
//     res.json({ message: error });
//   }
// };

// const officeView = async (req, res) => {
//   const body = req.query["id"];
//   // const officePacket = OfficePackets.find({off})
//   // console.log("viewLissat -> body", body);
//   if (body) {
//     const data = await Office.find({ _id: body });
//     // console.log("viewList -> data", data);
//     try {
//       // console.log("createRough -> body", body, "postsaved", postSaved);
//       if (data != null) {
//         res.json({ data, message: "Data retrive Successfully" });
//       } else {
//         res.json({ message: "Database Error" });
//       }
//     } catch (error) {
//       res.json({ message: error });
//     }
//   } else {
//     const data = await Office.find()
//       .skip(parseInt(req.query["skip"]))
//       .limit(parseInt(req.query["limit"]))
//       .sort({ createdAt: -1 });
//     const totalData = await Office.find();
//     try {
//       // console.log("createRough -> body", body, "postsaved", postSaved);
//       if (data != null) {
//         res.json({
//           count: totalData.length,
//           data,
//           message: "Data retrive Successfully",
//         });
//       } else {
//         res.json({ message: "Database Error" });
//       }
//     } catch (error) {
//       res.json({ message: error });
//     }
//   }
// };
module.exports = {
  create,
  // officeView,
  // returnPacket,
};
