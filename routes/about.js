const express=require("express");
const path=require("path");
const router=express.Router();
const app=express();

router.use(express.static(path.join(__dirname, "public")));
router.get("/about", (req, res) => {
    res.render("indexabout.ejs", { title: "AboutUs" });
  });
module.exports=router;
