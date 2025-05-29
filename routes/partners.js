const express=require("express");
const path=require("path");
const router=express.Router();
const app=express();

router.use(express.static(path.join(__dirname, "public")));
router.get("/partners", (req, res) => {
    res.render("partners.ejs", { title: "Partners" });
  });
module.exports=router;
