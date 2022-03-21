const Rough = require("../../../Models/Rough");
const Factory = require("../../../Models/Factory");
const Office = require("../../../Models/Office");

const Unused = require("../../../Models/Unused");
const OfficeSort = require("../../../Models/OfficeSorting");
const {v4: uuidv4} = require("uuid");

const create = async (req, res) => {
    const body = req.body;
    const id = uuidv4();
    const unused = await Unused.findOne({rough_id: body.rough_id});
    const rough = await Rough.findOne({_id: body.rough_id});
    console.log("create -> body", body);

    //  res.json({ msg: "passed", body, })


    const factoryPacket = new Factory({
        ...body,
        id,
        returnStatus: false,
        carat: rough.caret,
        packetNo: 0,
        copyCarat: body.factory_total_carat,
        occupy: true,
        lastCarat: body.factory_total_carat
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
        console.log("createRough -> body", "postsaved", rough);
        await Rough.updateOne(
            {_id: body.rough_id},
            {$set: {factoryCarat: (rough.factoryCarat || 0) + body.factory_total_carat}}
        );
        if (postSaved != null) {
            res.json({message: "Data inserted Successfully", data: body});
        } else {
            res.json({message: "Database Error"});
        }
    } catch (error) {
        res.json({message: error});

    };
}

const returnPacket = async (req, res) => {
    const body = req.body;
    const unused = await Unused.findOne({rough_id: body.office_id});
    const rough = await Rough.findOne({_id: body.rough_id});

    const OfficeData = await Office.findOne({rough_id: body.office_id, _id: body.rough_id})
    const returnSorting = new OfficeSort({...body});
    try {
        const returnSortingPackets = await returnSorting.save();
        console.log("createRough -> body", "postsaved", returnSortingPackets);
        if (returnSortingPackets != null && unused) {
            console.log('first', body.mackable, body, body.createDate)
            await Office.updateOne(
                {_id: body.rough_id, rough_id: body.office_id},
                {
                    $set: {
                        returnStatus: true,
                        return_date: body.createDate,
                        mackable: body.mackable,
                        office_return_sorting_carat: body.sumOfSortingCarat
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

            await Unused.updateOne(
                {rough_id: body.office_id},
                {
                    $set: {
                        mackable: (unused.mackable || 0) + body.mackable,
                        office_return_sorting_carat: (unused.office_return_sorting_carat || 0) + body.sumOfSortingCarat
                    },
                }
            );
            res.json({message: "Data inserted Successfully", unused, OfficeData});
        } else {
            res.json({message: "Database Error"});
        }
    } catch (error) {
        res.json({message: error});
    }
};

const factoryView = async (req, res) => {
    const roughId = req.query["roughId"];
    const factoryId = req.query["factoryId"];
    const totalCarat = req.query["totalcarat"]

    // const officePacket = OfficePackets.find({off})
    console.log("viewList -> data", roughId, factoryId);

    if (factoryId || roughId) {

        const data = await Factory.find(roughId ? {rough_id: roughId} : {_id: factoryId});
        try {
            // console.log("createRough -> body", body, "postsaved", postSaved);
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
module.exports = {
    create,
    factoryView,
    returnPacket,
};
