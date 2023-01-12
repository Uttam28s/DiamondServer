const Rough = require("../../../Models/Rough");
const Factory = require("../../../Models/Factory");
const FactoryPacket = require("../../../Models/FactoryPacket");
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");
// const {BorderStyle} = require("@material-ui/icons");
// const Unused = require("../../Models/Unused");

const create = async (req, res) => {
    const body = req.body;
    const id = uuidv4();
    const process_carat_id = uuidv4()
    const factory = await Factory.findOne({ _id: body.factory_id })
    var array = []
    try{
    if (body.status == "update") {
        array = (await FactoryPacket.findOne({ _id: body.factory_id })).all_process
    }

    array.push(
        {
            process_name: body.process_name,
            process_carat_id: process_carat_id,
            sub_rough_id: body.factory_id,
            assign_carat: body.assign_carat,
            returnStatus: false,
            yeild: (Number(body.yeild)).toFixed(2),
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
                    occupy_by: body.process_name,
                    // purity : body.purity 
                }
            })
            await Factory.updateOne({ _id: body.factory_id },{
                $set:{
                    occupy_by: body.process_name
                }
            })
            res.json({ message: "Factory Packet Assigned SuccessFully" })
        } catch { res.json({ message: "failed" }) }
    } else {
        let factoryData = await FactoryPacket.find({ factory_id : body.factory_id })
        
        let data = {
            id: id,
            occupy_by: body.process_name,
            last_carat: body.assign_carat,
            assign_carat: body.assign_carat,
            // main_carat: body.main_carat,
            factory_id: body.factory_id,
            // factory_carat: body.factory_carat,
            return: false,
            assign_pcs : Number(body?.piece),
            yeild: (Number(body.yeild)).toFixed(2),
            return_carat : 0,
            assign_date: body.assign_date,
            Id : (factoryData?.[factoryData.length - 1]?.Id || 0 ) + 1,
            all_process: array,
            return_pcs: 0,
            quality : body?.purity,
            y_weight : body?.weight
        }
        try {
            await Factory.updateOne({ _id: body.factory_id }, {
                $set: {
                    copyCarat: (factory.copyCarat || factory.factory_total_carat) - body.assign_carat,
                },
                $inc : { factory_total_pcs : Number(body?.piece) }
            })
            const factoryPacket = await FactoryPacket({
                ...data
            })
            factoryPacket.save()
        }
        catch {
            console.log('err')
        }
        res.json({ data: data, message : "Factory packet Created" })
    }
}catch(e){
    res.json({ message: e })
  
}
};

const factoryPacketView = async (req, res) => {
  const factoryId = req.query["factory_id"];
  const returnFlag = req.query["returnCheck"];
  let flag = true;
  try {
    const factory = await FactoryPacket.find({ factory_id: factoryId });
    if (returnFlag === "true") {
      factory.map((d) => {
        if (d.occupy_by !== "false") {
          flag = false;
        }
      });
      if (flag) {
        res.json({
          returnFlag: true,
          data:factory,
          message: "packet is not occupied by another process",
        });
        return
      }
     else {
      res.json({
        returnFlag: false,
        data: factory,
        message: "Rough Returned",
      });
      return
    }}
    res.json({ data: factory || [], message: "Data retrive success" });
    return
  } catch(e){
    res.json({ message: "Database error" });
  }
};




const factorySubPacketReturn = async (req, res) => {
    const body = req.body
    // const factory = await Factory.findOne({_id: body.factoryId})
    try {
        const polishedData = await FactoryPacket.findOne({ _id : body?.factoryId ,"all_process.process_name": "Polish" });
        let polishRough = 0
        let return_date = null
        let return_pcs = 0
        let returnStatus = false
        let loseCarat = 0
        if(polishedData?.occupy_by === "Polish"){
            polishRough = body?.returnData?.return_carat
            returnStatus = true
            loseCarat =  polishedData?.assign_carat - body?.returnData?.return_carat
            return_date = body?.returnData?.return_date
            return_pcs = body?.returnData?.return_peice
        }
        await FactoryPacket.updateOne(
            { "all_process.process_carat_id": body.process_carat_id },
            {
                $set: {
                    "all_process.$.returndata": body.returnData,
                    "all_process.$.returnStatus": true,
                    "all_process.$.returnCarat": (body.returnData.return_carat).toFixed(4),
                    "all_process.$.returnPcs" : body.returnData.return_peice,
                    "all_process.$.returnYield": (body.returnData.return_yeild).toFixed(4),
                    occupy_by: false,
                    return : returnStatus,
                    last_carat: body.returnData.return_carat,
                    return_date : return_date,
                    return_pcs : return_pcs,
                }
            }
        );
        if(polishedData.factory_id){
            await Factory.updateOne({ _id: polishedData?.factory_id }, 
                { $inc: { copyCarat: body.returnData.return_carat , polished : polishRough , returnCarat :  body?.returnData?.return_carat , loseCarat : loseCarat , polished_pcs : return_pcs},
            })
        }else{
            await Factory.updateOne({ _id: body.factoryId }, { $inc: { copyCarat: body.returnData.return_carat} })
        }
        res.json({ message: "Factory Packet Returned Successfully" })
    } catch(e){
        console.log("🚀 ~ file: FactoryPacket.js:176 ~ factorySubPacketReturn ~ e", e)
        res.json({ message: "error" })
    }
    // await FactoryPacket.updateOne({_id: body.factoryId}, {
    //     $set: {
    //         occupy: false,
    //         lastCarat: body.returnData.return_carat
    //     }
    // })
    // const indx = factory[0].all_process.indexOf((data) => data.process_carat_id == body.process_carat_id)
    // const processArray = factory[0].all_process.filter((data) => data.id == body.process_carat_id)
    // let returnSubPacket = {
    //     ...processArray[0],
    //     return_status: true,
    //     returnData: body.returnData
    // }
}

const getPacketNo = async (req, res) => {
    try{
        const { id } = req.query
        const packetData = await FactoryPacket.find({ factory_id : id},{ Id : 1})
        res.json({ packetNo : packetData[0]?.Id + 1 , message: "Fetched Successfully" });

    }catch(e){
        console.log("🚀 ~ file: FactoryPacket.js:176 ~ getPacketNo ~ e", e)
        
    }
}


const getDifference = async (req, res) => {
    try{
        const { type ,factory_id } = req.query
        const packetData = await FactoryPacket.find({ factory_id : factory_id })
        let arr =[]
        packetData.map((ele) => {
            ele?.all_process.map((process,index) => {
                arr.push({
                    process_name : process?.process_name,
                    index : index
                })
            })
        })

        
        let index = 0
        let data= []
        index = arr.findIndex((ele) =>{ return ele?.process_name === type})
        if(index === 0){
            packetData.map((ele,id) => {
                let tempData = {
                    id: id + 1,
                    Id : ele?.Id,
                    assign_pcs : ele?.assign_pcs,
                    assign_carat : ele?.assign_carat,
                    assign_quality : ele?.quality,
                    carat_diff : ((ele?.assign_carat - ele?.all_process[index]?.returnCarat) || 0).toFixed(2),
                    pcs_diff : (ele?.assign_pcs - ele?.all_process[index]?.returnPcs) || 0,
                    yield_diff : (ele?.yeild - ele?.all_process[index]?.returnYield || 0).toFixed(2)
                } 
                data.push(tempData)
            })
        }else{
            packetData.map((ele,id) => {
                let tempData = {
                    id: id + 1,
                    Id : ele?.Id,
                    assign_pcs :ele?.all_process[index]?.piece || 0,
                    assign_carat : ele?.all_process[index]?.assign_carat || 0,
                    assign_quality : ele?.quality,
                    carat_diff : ((ele?.all_process[index]?.assign_carat - ele?.all_process[index]?.returnCarat) || 0).toFixed(2),
                    pcs_diff : ((ele?.all_process[index]?.piece - ele?.all_process[index]?.returnPcs) || 0),
                    yield_diff : ((ele?.all_process[index]?.yeild - ele?.all_process[index]?.returnYield) || 0).toFixed(2)
                }
            data.push(tempData)

            })
        }
    
        
        res.json({data, message: "Fetched Successfully" });
        
    }catch(e){
        console.log("🚀 ~ file: FactoryPacket.js:211 ~ getDifference ~ e", e)
    }
}



const getPolishReportData = async (req, res) => {
    try{
        const { factoryId } = req.query
        const factoryData = await Factory.find({ returnStatus : true, _id : factoryId })
        let data = []
        factoryData.map((ele,index) => {
            
            let arr = {
                index : index + 1,
                Id : ele?.Id,
                AssignPerson : ele?.factory_assigne_name,
                K_pcs : ele?.factory_total_pcs,
                K_cts : ele?.factory_total_carat.toFixed(2),
                R_pcs : ele?.polished_pcs,
                R_cts : ele?.returnCarat.toFixed(2),
                R_percentage : ((ele?.returnCarat * 100) / ele?.factory_total_carat).toFixed(2),

                // Wgt_percentage : ((100 * ele?.returnCarat) / ele?.factory_total_carat).toFixed(2)subpacket/view
            }
            data.push(arr)
        })
        console.log("🚀 ~ file: FactoryPacket.js:262 ~ factoryData.map ~ data", data)
        res.json({ data , message: "Fetched Successfully" });

    }catch(e){

    } 
}
module.exports = {
    create,
    factoryPacketView,
    factorySubPacketReturn,
    getPacketNo,
    getDifference,
    getPolishReportData
};
