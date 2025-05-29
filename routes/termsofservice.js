const express=require("express");
const path=require("path");
const router=express.Router();
const app=express();

router.use(express.static(path.join(__dirname, "public")));
router.get("/termsofservice", (req, res) => {
    res.render("termsofservice.ejs", { title: "AboutUs" });
  });
module.exports=router;
