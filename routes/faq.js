const express=require("express");
const path=require("path");
const router=express.Router();
const app=express();

router.use(express.static(path.join(__dirname, "public")));
router.get("/faq", (req, res) => {
    res.render("faq.ejs", { title: "Frequently Asked Questions" });
  });
module.exports=router;
