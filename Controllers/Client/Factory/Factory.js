const Rough = require("../../../Models/Rough");
const Factory = require("../../../Models/Factory");
const Office = require("../../../Models/Office");

const Unused = require("../../../Models/Unused");
const OfficeSort = require("../../../Models/OfficeSorting");
const {v4: uuidv4} = require("uuid");
const FactoryPacket = require("../../../Models/FactoryPacket");
const { Promise } = require("mongoose");
//const {map} = require("jquery");

const create = async (req, res) => {
    const body = req.body;
    const id = uuidv4();
    const unused = await Unused.findOne({rough_id: body.rough_id});
    const rough = await Rough.findOne({_id: body.rough_id});
    const factoryData = await Factory.find({rough_id: body.rough_id});
    const factoryPacket = new Factory({
        ...body,
        id,
        returnStatus: false,
        carat: rough.caret,
        packetNo: 0,
        copyCarat: body.factory_total_carat,
        main_carat: rough.carat,
        polished: 0,
        Id : (factoryData?.length  || 0) + 1 
      //  occupy: true,
       // lastCarat: body.factory_total_carat
    })

    if (unused !== null) {
        try {
            await Unused.updateOne(
                {rough_id: body.rough_id},
                {
                    $set: {
                        mackable: unused.mackable - body.factory_total_carat
                    },
                }
            );
        } catch (error) {
            res.json({message: error});
        }
    } else {

    }
    try {
        const postSaved = await factoryPacket.save();
        await Rough.updateOne(
            {_id: body.rough_id},
            {$set: {factoryCarat: (rough.factoryCarat || 0) + body.factory_total_carat}}
        );
        if (postSaved != null) {
            res.json({message: "Rough Assigned To Factory Successfully", data: body});
        } else {
            res.json({message: "Database Error"});
        }
    } catch (error) {
        res.json({message: error});

    };
}

const factoryView = async (req, res) => {
    const roughId = req.query["roughId"];
    const factoryId = req.query["factoryId"];
    const totalCarat = req.query["totalcarat"]
    const returnflag =  req.query["return"]
    let flag = true
    let dataArray = []

    if (factoryId || roughId) {

        const data = await Factory.find(roughId ? {rough_id: roughId} : {_id: factoryId});
        try {
            // if(returnflag){
            //   let dataArray = await  checkReturnFactorySubPacket(data)
            // }
            if (data != null) {
                res.json({data, message: "Data retrive Successfully"});
            } else {
                res.json({message: "Database Error"});
            }
        } catch (error) {
            res.json({message: error});
        }
    } else {
        const data = await Factory.find()
            .skip(parseInt(req.query["skip"]))
            .limit(parseInt(req.query["limit"]))
            .sort({createdAt: -1});
        const totalData = await Factory.find();
        let carat = 0
        totalData.map((val) => {
            carat = carat + val.factory_total_carat
        })
        try {
            if (data != null) {
                res.json({
                    count: totalData.length,
                    data,
                    totalCarat: carat,
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

const returnFactoryPacket = async (req, res) => {
    const factoryId = req.query["factoryId"];
    const data = await Factory.find({_id: factoryId});
    console.log('data', data)

}


const checkReturnFactorySubPacket = async(data)=>{
    let a = []
   let dataArray =  data.map(async(val)=>{
       let  id = val._id
       let subpacket = await FactoryPacket.find({factory_id:id})
       return subpacket.map((val1)=>{
           if(val1.occupy_by!==false){
              return val1.factory_id
           }
       })

    })
    console.log('dataArray',await Promise.all(dataArray),)
    return data
}

// FactoryReturnPacket
const returnPacket = async (req, res) => {
    const body = req.body;
    const unused = await Unused.findOne({rough_id: body.factoryId});
    const rough = await Rough.findOne({_id: body.rough_id});

    const OfficeData = await Factory.findOne({rough_id: body.rough_id, _id: body.factoryId})
    try {
        await Factory.updateOne(
            {_id: body.factoryId, rough_id: body.rough_id},
            {
                $set: {
                    returnStatus: true,
                    return_date: body.createDate,
                }
            }
        );

        // await Rough.updateOne({ _id: body.rough_id },
        //   {
        //     $set: {
        //       officeReturnCaret: rough.officeReturnCaret + body.mackable
        //     }
        //   }
        // )            
        res.json({message: "Packet Returned Successfully", unused, OfficeData});
    } catch (error) {
        res.json({message: error});
    }
};




module.exports = {
    create,
    factoryView,
    returnPacket,
    returnFactoryPacket
};
