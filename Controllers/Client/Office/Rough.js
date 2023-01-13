const Rough = require("../../../Models/Rough");
const Sorting = require("../../../Models/Sorting");
const Unused = require("../../../Models/Unused");
const { v4: uuidv4 } = require("uuid");
const Factory = require("../../../Models/Factory");
const FactoryPacket = require("../../../Models/FactoryPacket");

const create = async (req, res) => {
  const body = req.body;

  const completed = req.body.completed || 0;
  const id = uuidv4();
  const roughData = await Rough.find()
  const post = new Rough({
    ...body,
    id,
    completed,
    rough_total: req.body.carat * req.body.rate,
    Id: Number(roughData?.[roughData.length - 1]?.Id || 0 ) + 1
  });

  try {
    const postSaved = await post.save();
    const unused = new Unused({
      rough_id :post._id,
      carat: body.carat,
      copyCarat : body.carat,
      before_office_carat:body.carat,
     })
     unused.save()
    if (postSaved != null) {
      res.json({ message: "Rough Created Successfully" });
    } else {
      res.json({ message: "Database Error" });
    }
  } catch (error) {
    res.json({ message: error });
  }
};

const viewList = async (req, res) => {
  const body = req.query["id"];
  if (body) {
    const data = await Rough.find({ _id: body });
    try {
      if (data != null) {
        res.json({ data, message: "Data retrive Successfully" });
      } else {
        res.json({ message: "Database Error" });
      }
    } catch (error) {
      res.json({ message: error });
    }
  } else {

    const data = await Rough.find()
      .skip(parseInt(req.query["skip"]))
      .limit(parseInt(req.query["limit"]))
      .sort({ createdAt: -1 });

    const totalData = await Rough.find();
    try {
      if (data != null) {
        res.json({
          count: totalData.length,
          data,
          message: "Data retrive Successfully",
        });
      } else {
        res.json({ message: "Database Error" });
      }
    } catch (error) {
      res.json({ message: error });
    }
  }
};

const sortingCreate = async (req, res) => {
  const body = req.body;
  // const rough_id = req.query["id"];

  const unUsed = await Unused.findOne({ rough_id: body.rough_id });
  const rough = await Rough.findOne({ _id: body.rough_id });
  const sortingDetails = await Sorting.findOne({ rough_id: body.rough_id });

  // const sorting = await Sorting.findOne({})
  // date = new Date(body.date);

  const total_sorting_carat =
    body.chocki.chocki_carat +
    body.out.out_carat +
    body.markis.markis_carat +
    body.gol.gol_carat +
    body.crystal.crystal_carat;
  const chockiTotal = body.chocki.chocki_carat * body.chocki.chocki_price;
  const markisTotal = body.markis.markis_carat * body.markis.markis_price;
  const crystalTotal = body.crystal.crystal_carat * body.crystal.crystal_price;
  const golTotal = body.gol.gol_carat * body.gol.gol_price;
  const outTotal = body.out.out_carat * body.out.out_price;
  const total_sorting_amount =
    chockiTotal + markisTotal + crystalTotal + golTotal + outTotal;

  if (unUsed !== null) {
    try {
      await Unused.updateOne(
        { rough_id: body.rough_id },
        {
          $set: {
            copyCarat: unUsed.copyCarat - total_sorting_carat,
            after_sorting_carat:
              unUsed.after_sorting_carat ||
              unUsed.copyCarat - total_sorting_carat,
          },
        }
      );
    } catch (error) {
      res.json({ message: error });
    }
  } else { try {
   Unused.updateOne({ rough_id: body.rough_id,},{$set:{
      copyCarat: rough.carat - total_sorting_carat,
      after_sorting_carat: rough.carat - total_sorting_carat,
    }});
   
    
    } catch (error) {
      res.json({ message: error });
    }
  }

  if (sortingDetails !== null) {
    sortingDetails.sortingData.push(body);
    const updateSortingDetails = await Sorting.updateOne(
      { rough_id: body.rough_id },
      {
        $set: {
          sortingData: sortingDetails.sortingData,
          total_sorting_carat:
            sortingDetails.total_sorting_carat + total_sorting_carat,
          total_sorting_amount:
            sortingDetails.total_sorting_amount + total_sorting_amount,
        },
      }
    );
    try {
      if (updateSortingDetails != null) {
        res.json({
          message: "Sorting Updated Successfully",
          data: updateSortingDetails,
        });
      } else {
        res.json({ message: "Database Error" });
      }
    } catch (error) {
      res.json({ message: error });
    }

    // sortingDetails.sortingData.push(data)
  } else {
    const post = new Sorting({
      rough_id: body.rough_id,
      sortingData: [body],
      total_sorting_carat,
      total_sorting_amount,
    });
    try {
      const sortingSaved = await post.save();
      if (sortingSaved != null) {
        res.json({ message: "Data inserted Successfully", data: post });
      } else {
        res.json({ message: "Database Error" });
      }
    } catch (error) {
      res.json({ message: error });
    }
  }
};

const sortingList = async (req, res) => {
  const body = req.query["id"];
  const data = await Sorting.find({ id: body });
  try {
    if (data != null) {
      res.json({ data, message: "Data retrive Successfully" });
    } else {
      res.json({ message: "Database Error" });
    }
  } catch (error) {
    res.json({ message: error });
  }
};


const getPolishedRough = async (req, res) => {
  const { roughId } = req.query
  const factoryIds = await Factory.find({ rough_id : roughId })
  let data = []
  factoryIds.map((ele) => {
    if(ele?.polished + ele?.loseCarat === ele?.factory_total_carat){
      data.push({
        factory_total_carat : ele?.factory_total_carat,
        copyCarat : ele?.copyCarat,
        _id : ele?._id
      })
    }
  })

  res.json({ data,  message: "Data retrive Successfully" });

}

module.exports = {
  create,
  viewList,
  sortingCreate,
  sortingList,
  getPolishedRough
};
