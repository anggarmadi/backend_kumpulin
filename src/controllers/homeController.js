var express = require("express");
var Form = require("../models/forms");
var Submissions = require("../models/submissions");

const homePage = async function (req, res, next) {
  res.set("Access-Control-Allow-Credentials", "true");
  res.set("Access-Control-Allow-Origin", "http://localhost:4000");
  const user_id = +req.cookies.user;
  const submissions = await Submissions.findAll({
    attributes: ["form_id", "uploaded_file", "description", "updated_at"],
    where: {
      user_id: user_id,
    },
  });
  const forms = await Form.findAll({
    attributes: ["form_id", "title", "description", "created_at", "updated_at"],
    where: {
      user_id: user_id,
    },
  });

  res.json({ submissions, forms });
};
module.exports = { homePage };
