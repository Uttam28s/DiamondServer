 //for pakat nobmer
 

await OfficePacket.find().then((data)=>{
    let group =  _.groupBy(data,"office_id")
    console.log("🚀 ~ file: Factory.js ~ line 134 ~ awaitFactory.find ~ group", group)
     Object.keys(group).map(async(val)=>{
       group[val].map(async(d,i)=>{
           await OfficePacket.updateOne({id:d.id},{
               $set:{ srno:i }})})})})