const Rough = require("../../../Models/Rough");
const Factory = require("../../../Models/Factory");
const FactoryPacket = require("../../../Models/FactoryPacket");
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");
const { resolveContent } = require("nodemailer/lib/shared");
// const {BorderStyle} = require("@material-ui/icons");
// const Unused = require("../../Models/Unused");

const create = async (req, res) => {
    const body = req.body;
    const id = uuidv4();
    const process_carat_id = uuidv4()
    const factory = await Factory.findOne({ _id: body.factory_id })
    console.log('factory1111', factory, body)
    var array = []


    if (body.status == "update") {
        array = (await FactoryPacket.findOne({ _id: body.factory_id })).all_process
    }
    array.push(
        {
            process_name: body.process_name,
            process_carat_id: process_carat_id,
            sub_rough_id: body.factory_id,
            assign_carat: body.assign_carat,
            returnCarat: 0,
            returnStatus: false,
            yeild: body.yeild,
            size: body.size,
            purity: body.purity,
            piece: body.piece,
            assign_date: body.assign_date,
            assign_name: body.assign_name,
        })
    if (body.status == "update") {
        try {
            await FactoryPacket.updateOne({ _id: body.factory_id }, {
                $set: {
                    all_process: array,
                    occupy_by: body.process_name
                }
            })
            await Factory.updateOne({ _id: body.factory_id },{
                $set:{
                    occupy_by: body.process_name
                }
            })
            res.json({ msg: "updated" })
        } catch { res.json({ msg: "failed" }) }
    } else {

        let data = {
            id: id,
            occupy_by: body.process_name,
            last_carat: body.assign_carat,
            assign_carat: body.assign_carat,
            main_carat: body.main_carat,
            factory_id: body.factory_id,
            factory_carat: body.factory_carat,
            return: false,
            assign_date: body.assign_date,
            all_process: array,
        }
        try {
            await Factory.updateOne({ _id: body.factory_id }, {
                $set: {
                    copyCarat: (factory.copyCarat || factory.factory_total_carat) - body.assign_carat,
                }
            })
            const index = (await FactoryPacket.find({factory_id: body.factory_id})).length+1
            const factoryPacket = await FactoryPacket({
                ...data,
                srno:index
            })
            factoryPacket.save()
        }
        catch {
            console.log('err')
        }
        res.json({ data: data })
    }
};

const factoryPacketView = async (req, res) => {
  const factoryId = req.query["factory_id"];
  const returnFlag = req.query["returnCheck"];
  let flag = true;
  let range = req.query["range"] 
  if(range){
    const bulkPacket  = await FactoryPacket.find({factory_id:factoryId}).skip(Number(range.split("-")[0])).limit(Number(range.split("-")[1]))
    res.json({data:bulkPacket})
    return    
}
  try {
    const factory = await FactoryPacket.find({ factory_id: factoryId });
    const mainFactory = await Factory.find({_id:factoryId})
    if (returnFlag) {
      factory.map((d) => {
        console.log("🚀 ~ file: FactoryPacket.js ~ line 89 ~ factoryPacketView ~ factory",mainFactory)
        if (d.occupy_by !== "false") {
          flag = false;
        }
      });
      if (flag) {
        res.json({
          returnFlag: true,
          data:mainFactory,
          msg: "packet is not occupied by another prosecc",
        });
        return
      }
     else {
      res.json({
        returnFlag: false,
        msg: "packet is occupied by another process",
      });
      return
    }}
    res.json({ data: factory || [], message: "Data retirve sucess" });
    return
  } catch {
    res.json({ message: "Database error" });
  }
};




const factorySubPacketReturn = async (req, res) => {
    const body = req.body
    // const factory = await Factory.findOne({_id: body.factoryId})
    try {
        const factorypacket = await FactoryPacket.updateOne(
            { "all_process.process_carat_id": body.process_carat_id },
            {
                $set: {
                    "all_process.$.returndata": body.returnData,
                    "all_process.$.returnStatus": true,
                    "all_process.$.returnCarat": body.returnData.return_carat,
                    occupy_by: false,
                    last_carat: body.returnData.return_carat

                }
            }
        );
        await Factory.updateOne({ _id: body.factoryId }, { $inc: { copyCarat: body.returnData.return_carat} })
        res.json({ msg: "sucess" })
    } catch {
        res.json({ msg: "error" })
    }
    // await FactoryPacket.updateOne({_id: body.factoryId}, {
    //     $set: {
    //         occupy: false,
    //         lastCarat: body.returnData.return_carat
    //     }
    // })
    console.log('req.body', req.body)
    // const indx = factory[0].all_process.indexOf((data) => data.process_carat_id == body.process_carat_id)
    // const processArray = factory[0].all_process.filter((data) => data.id == body.process_carat_id)
    // let returnSubPacket = {
    //     ...processArray[0],
    //     return_status: true,
    //     returnData: body.returnData
    // }
}
module.exports = {
    create,
    factoryPacketView,
    factorySubPacketReturn,
};
