const Rough = require("../../Models/Rough.js");
const Sorting = require("../../Models/Sorting.js");
const Unused = require("../../Models/Unused.js");
const { v4: uuidv4 } = require("uuid");

const create = async (req, res) => {
  const body = req.body;

  const completed = req.body.completed || 0;
  const id = uuidv4();
  // const days = Number(body.days);
  // var lastdate = new Date(body.date);
  // lastdate.setDate(lastdate.getDate() + days);
  const post = new Rough({
    ...body,
    id,
    completed,
    rough_total: req.body.carat * req.body.rate,
  });
  try {
    const postSaved = await post.save();
    // console.log("createRough -> body", body, "postsaved", postSaved);
    if (postSaved != null) {
      res.json({ message: "Rough Added Successfully" });
    } else {
      res.json({ message: "Database Error" });
    }
  } catch (error) {
    res.json({ message: error });
  }
};

const viewList = async (req, res) => {
  const body = req.query["id"];
  // console.log("viewLissat -> body", body);
  if (body) {
    const data = await Rough.find({ _id: body });
    // console.log("viewList -> data", data);
    try {
      // console.log("createRough -> body", body, "postsaved", postSaved);
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
      // console.log("createRough -> body", body, "postsaved", postSaved);
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
  const unUsed = await Unused.findOne({ rough_id: body.rough_id });
  const rough = await Rough.findOne({ _id: body.rough_id });
  const sortingDetails = await Sorting.findOne({ rough_id: body.rough_id });

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
    console.log("sortingCreate -> unUsed", unUsed);
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
  } else {
    try {
      Unused.updateOne({rough_id:body.rough_id},{$set:{
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
  // console.log("viewLissat -> body", body);
  const data = await Sorting.find({ id: body });
  console.log("viewList -> data", data);
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

module.exports = {
  create,
  viewList,
  sortingCreate,
  sortingList,
};
