const Rough = require("../../../Models/Rough");
const Sorting = require("../../../Models/Sorting")
const Unused = require("../../../Models/Unused")
const Factory = require("../../../Models/Factory");
const FactoryPacket = require("../../../Models/FactoryPacket");
const OfficeSorting = require("../../../Models/OfficeSorting")
const OfficePacket = require("../../../Models/OfficePacket")
const Office = require("../../../Models/Office");
const {update} = require("lodash");
const {query} = require("express");

const mainRough = async (req, res) => {
    const { roughId } = req.body
    const rough = await Rough.findOne({_id: roughId})
    const sorting = await Sorting.find({rough_id: roughId})
    if (rough) {
        try {
            await Rough.deleteMany({_id: roughId})
            await Sorting.deleteMany({rough_id: roughId})
            await Office.deleteMany({rough_id: roughId})
            await OfficePacket.deleteMany({rough_id: roughId})
            await OfficeSorting.deleteMany({rough_id: roughId})
            await Factory.deleteMany({rough_id: roughId})
            await FactoryPacket.deleteMany({rough_id: roughId})
            await Unused.deleteMany({rough_id: roughId})
            res.json({message: "deleted main rough"})
            return
        } catch {
            res.json({message: "database errorrr"})
            return
        }
    }
    else {
        res.json({message: "database Error"})
    }
}

const officeRough = async (req, res) => {

    const { officeId } = req.body
    const office = await Office.findOne({_id: officeId})
    try {
        if (office) {
            try {
                !office.returnStatus &&
                    await Unused.findOneAndUpdate(
                        {rough_id: office.rough_id},
                        {$inc: {copyCarat: office.office_total_carat}}
                    )
                await Rough.findOneAndUpdate(
                    {_id: office.rough_id},
                    {office_allocated_carat: office.carat - office.office_total_carat }
                )
                await Office.deleteOne({_id: officeId});
                await OfficePacket.deleteMany({office_id: officeId});
                await OfficeSorting.deleteMany({office_id: officeId});
                res.json({message: `office rough  deleted"}`})
                return
            } catch {
                res.json({message: "database error"})
                return
            }
        }
    }
    catch {
        res.json({message: "database eeroror"})
    }
}

const factoryRough = async (req, res) => {
    const {factoryId} = req.body
    const factory = await Factory.findOne({_id: factoryId})

    try {
        if (factory) {
            !factory.returnStatus && await Unused.findOneAndUpdate(
                {rough_id: factory.rough_id},
                {$inc: {mackable: factory.factory_total_carat}}
            )
            await Factory.deleteOne({_id: factoryId});
            await FactoryPacket.deleteMany({factory_id: factoryId});
            res.json({message: "FActory rough deleted"})
            return
        }
    } catch {
        res.json({
            message: "factoryRough  delete unsucessfull"
        })
    }
}

const officeSubPacket = async (req, res) => {

    const { officePacketId } = req.body
    const officeSubPacket = await OfficePacket.findOne({_id: officePacketId})
    try {
        !officeSubPacket.return && await Office.findOneAndUpdate(
            {_id: officeSubPacket.office_id},
            {$inc: {copyCarat: (officeSubPacket.sawing_issueCarat || officeSubPacket.chapka_issueCarat)}}
        )

        await OfficePacket.deleteOne({_id: officePacketId})
        res.json({message: "subPacket deleted"})
    } catch {
        res.json({message: "database error"})

    }
}

const factorySubPacket = async (req, res) => {

    const subPacketId = req.body.id
    const factorySubPacket = await FactoryPacket.find({_id: subPacketId})
    try {

        factorySubPacket.return && await Factory.findOneAndUpdate(
            {_id: factorySubPacket.factory_id},
            {$inc: {copyCarat: factorySubPacket.assign_carat}}
        )
        await FactoryPacket.deleteOne({_id: subPacketId})
    } catch {
        res.json({
            message: "database Error"
        })
    }

}

const factorySubProcessPacket = async (req, res) => {
    //const subPacketId = req.query["subpacketid"]
    // const subProcessId = req.query["subProcessid"]

    // const subPacket = await FactoryPacket.findOne({_id: subPacketId})
    // const subProcess = subPacket.all_process.filter((data) => data.process_carat_id !== subProcessId)

}

module.exports = {
    mainRough,
    officeRough,
    factoryRough,
    officeSubPacket,
    factorySubPacket,
    factorySubProcessPacket
};
