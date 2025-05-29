const express=require("express");
const path=require("path");
const router=express.Router();
const app=express();

router.use(express.static(path.join(__dirname, "public")));
router.get("/privacypolicy", (req, res) => {
    res.render("privacypolicy.ejs", { title: "PrivacyPolicy" });
  });
module.exports=router;