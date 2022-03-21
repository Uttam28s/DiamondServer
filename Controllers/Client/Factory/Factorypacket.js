const Rough = require("../../../Models/Rough");
const Factory = require("../../../Models/Factory");
const FactoryPacket = require("../../../Models/FactoryPacket");
const moment = require("moment");
const {v4: uuidv4} = require("uuid");
// const {BorderStyle} = require("@material-ui/icons");
// const Unused = require("../../Models/Unused");

const create = async (req, res) => {
    const body = req.body;

    // console.log("create -> body", body);
    const id = uuidv4();
    let process_carat_id = uuidv4()

    const factory = await Factory.findOne({_id: body.factory_id})
    console.log('factory1111', factory)
    // try {
    //     await Factory.updateOne({_id: body.factory_id}, {
    //         $set: {
    //             copyCarat: (factory.copyCarat || factory.factory_total_carat) - body.assign_carat,
    //             //  all_process: array,
    //             /// occupy: true,

    //         }
    //     })
    // }
    // catch {
    //     console.log('err')
    // }
    //     if(body.status =="update"){
    //   let array = FactoryPacket.findOne({})

    //     }
    let array = []

    if (body.status == "update") {
        array = await FactoryPacket({_id: body.factoryId}).all_process
    }
    array.push(
        {
            process_name: body.process_name,
            process_carat_id: process_carat_id,
            sub_rough_id: factory._id,
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
    console.log("create -> office", data)
    res.json({data: data})

    // const factoryPacket = await FactoryPacket({
    //     ...data
    // })
    // factoryPacket.save()
};

const factoryPacketView = async (req, res) => {
    //const body = req.query["id"];
    // const type = req.query["type"];
    //const packetDetails = req.query["packetId"];
    //  const officeID = req.query["officeID"]
    //  const checkStatus = req.query["checkStatus"];

    console.log('factoryId', req.query)

    const factoryId = req.query["factory_id"]
    try {
        const factoryPacket = await FactoryPacket.find({factory_id: factoryId})
        const factory = await Factory.find({_id: factoryId})

        res.json({data: factoryPacket || [], message: "Data retirve sucess"})

    }
    catch {
        res.json({message: "Database error"})
    }

};




const factorySubPacketReturn = async (req, res) => {
    const body = req.body
    // const factory = await Factory.findOne({_id: body.factoryId})
    const factorypacket = await FactoryPacket.updateOne(
        {"all_process.process_carat_id": body.process_carat_id},
        {
            $set: {
                "all_process.$.returndata": body.returnData,
                "all_process.$.returnStatus": true,
                "all_process.$.returnCarat": body.returnData.return_carat,
                occupy_by: false,
                last_carat: body.returnData.return_carat

            }
        }
    )

    // await FactoryPacket.updateOne({_id: body.factoryId}, {
    //     $set: {
    //         occupy: false,
    //         lastCarat: body.returnData.return_carat
    //     }
    // })

    console.log('req.body', req.body, factorypacket)
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
