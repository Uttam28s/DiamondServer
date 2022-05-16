const Rough = require("../../../Models/Rough");
const Sorting = require("../../../Models/Sorting")
const Unused = require("../../../Models/Unused")
const Factory = require("../../../Models/Factory");
const FactoryPacket = require("../../../Models/FactoryPacket");
const OfficeSorting = require("../../../Models/OfficeSorting")
const OfficePacket = require("../../../Models/OfficePacket")
const Office = require("../../../Models/Office");




const editMainRough = async (req, res) => {
    const body = req.body
    const rough = await Rough.findOne({ _id: body.id })

    try {
        await Rough.updateOne({ _id: body.id }, {
            $set: {
                sellername: body.sellername || rough.sellername,
                brokername: body.brokername || rough.brokername,
                rate: body.rate || rough.rate,
                rough_total: body.rough_total || rough.rough_total,
                days: body.days || rough.days,
                lastdate: body.lastdate || rough.lastdate
            },
            $inc: {
                carat: body.carat || rough.carat,
            }
        })
        await Unused.updateOne({ rough_id: body.id }, {
            $inc: {
                carat: Number(body.carat),
                copyCarat: Number(body.carat)
            }
        })
        res.json({ msg: "updated Rough" })
    } catch {
        res.json({ msg: "Database Error" })
    }

}

const editOfficeAndFactoryRough = async (req, res) => {
    const body = req.body
    const officeRough = await Office.findOne({_id: body.id})
    const factoryRough = await Factory.findOne({_id: body.id})
    const unused = await Unused.findOne({_id: body.roughId})

    try {
        body.office && await Office.updateOne({id: body.id}, {
            $set: {
                copyCarat: officeRough.copyCarat + (body.difference || 0),
                carat: officeRough.carat + (body.difference || 0),
                office_assigne_name: body.office_assigne_name || officeRough.office_assigne_name,
                assign_date: body.assign_date || officeRough.assign_date,
                //  return_date: body.return_date || officeRough.return_date,
            }
        })

        body.factory && await Factory.updateOne({id: body.id}, {
            $set: {
                copyCarat: factoryRough.copyCarat + (body.difference || 0),
                factory_total_carat: factoryRough.factory_total_carat + (body.difference || 0),
                factory_assigne_name: body.factory_assigne_name || factoryRough.factory_assigne_name,
                assign_date: body.assign_date || factoryRough.assign_date,
                //  return_date: body.return_date || factoryRough.return_date,
            }
        })

        await Unused.updateOne({_id: body.roughId}, {
            $set: {copyCarat: unused.copyCarat + (body.difference || 0)}
        })
    } catch {
        res.json({msg: "database error"})
    }
}


const editOfficeSubPacket = async (req, res) => {

    const body = req.body
    const officePacket = await OfficePacket.findOne({_id: body.id})
    const Office = await Office.findOne({_id: officePacket.office_id})

    try {
        let commanObj =
            body.sawing ? {
                sawing_issueCarat: officePacket.sawing_issueCarat + (body.difference || 0),
                sawing_issuePcs: officePacket.sawing_issuePcs + (body.pcs_difference || 0),
                sawing_manager_name: body.manager_name || officePacket.sawing_manager_name,
                sawing_assign_date: body.assign_date || officePacket.sawing_assign_date,
            } :
                {
                    chapka_issueCarat: officePacket.chapka_issueCarat + (body.difference || 0),
                    chapka_issuePcs: officePacket.chapka_issuePcs + (body.pcs_difference || 0),
                    chapka_manager_name: body.manager_name || officePacket.chapka_manager_name,
                    chapka_assign_date: body.assign_date || officePacket.chapka_assign_date,
                }
        if (body.return) {

            commanObj =
                body.sawing ? {
                    ...commanObj,
                    sawing_return_date: body.sawing_return_date || officePacket.sawing_return_date,
                    sawing_return_carat: officePacket.sawing_return_carat + (body.return_difference || 0),
                    sawing_return_pcs: officePacket.sawing_return_pcs + (body.return_pcs_difference || 0),
                    sawing_diffrence:
                        officePacket.sawing_issuePcs -
                        (officePacket.sawing_return_pcs + (body.return_pcs_difference || 0)),
                } :
                    {
                        ...commanObj,

                        chapka_return_date: body.chapka_return_date || officePacket.chapka_return_date,
                        chapka_return_carat: officePacket.chapka_return_carat + (body.return.difference || 0),
                        chapka_return_pcs: officePacket.chapka_return_pcs + (body.return_pcs_difference || 0),
                        chapka_diffrence:
                            officePacket.chapka_issuePcs -
                            (officePacket.chapka_return_pcs + (body.return_pcs_difference || 0)),
                    }

        }
        await OfficePacket.updateOne({_id: body.id}, {
            $set: {
                ...commanObj
            }
        })
        await Office.updateOne({_id: body._id}, {
            $set: {



            }
        })
    } catch {}
}


const editReturnOfficeRough = async (req, res) => {
    const body = req.body;
    const office = Office.findOne({_id: body.office_id});
    const difference = office.mackable - body.makable
    try {
        await OfficeSorting.updateOne({_id: body.id},
            {$set: {
                    mackable: body.makable,
                    sumOfSortingCarat: body.sumOfSortingCarat,
                    sortingData: body.sortingData
                   }})
        await Office.findOneAndUpdate({_id: body.office_id}, {
            $   : {
                mackable: difference || 0
            }
        })

        await Unused.findOneAndUpdate({_id: office.roughId}, {
            $inc: {
                mackable: difference || 0,
            }
        })
    }
    catch {}

}


// const editfactorySubPacket = async (req, res) => {
//     const body = req.body
//     const factoryPacket = await FactoryPacket.findOne({_id: body.id})

//     try {




//         factoryPacket.all_process.map((data, i) => {
//             let assignCarat = (data.assign_carat + (body.difference || 0))
//             var factorySubData = factoryPacket.all_process[i]
//             factorySubData.assign_carat = assignCarat;
//             factorySubData.yeild = (assignCarat / (body.piece || data.piece)) / assignCarat;
//             factorySubData.size = assignCarat / (body.piece || data.piece);
//             factorySubData.piece = body.piece || data.piece;
//             factorySubData.purity = body.purity || data.purity


//             if (data.returnStatus) {
//                 let returnCarat = data.returnCarat + (body.difference || 0);
//                 let returnData = factoryPacket.all_process[i].returndata
//                 returnData.return_date = body.return_date || data.return_date;
//                 returnData.return_carat = returnCarat;
//                 returnData.return_yeild = (returnCarat / (body.return_peice || data.return_peice)) / (returnCarat);
//                 returnData.return_size = (returnCarat) / (body.return_peice || data.return_peice);;
//                 returnData.return_peice = body.return_peice || data.return_peices;

//                 factorySubData.returnCarat = returnCarat;
//                 factorySubData.return_date = body.return_date || data.return_date;
//                 factorySubData.returndata = returnData

//             }
//             factoryPacket.all_process[i] = factorySubData
//         })

//         await FactoryPacket.updateOne({_id: body.id},
//             {
//                 $set: {
//                     assign_date: body.assign_date || factoryPacket.assign_date,
//                     assign_carat: factoryPacket + (body.difference || 0),
//                     all_process: factoryPacket.all_process
//                 }
//             }
//         )
//         res.json({msg: "updated"})
//     } catch {
//         res.json({msg: "error"})
//     }

// }




module.exports = {
    editReturnOfficeRough,
    editOfficeSubPacket,
    editOfficeAndFactoryRough,
    editMainRough,
};
