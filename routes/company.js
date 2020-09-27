var express = require('express');
var router = express.Router();
const passport = require("passport");
const User = require('../models/user');
const Company = require('../models/company');

router.post('/createCompany', passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log("req.user :", req.user);
    if (req.user.role === "admin") {
        let newCompany = new Company({
            companyName: req.body.newCompany,
            NoOfEmployes: req.body.NoOfEmployes,
            location: req.body.location,
            category: req.body.category,
            established_In: req.body.established_In
        })
        newCompany.save().then(async (result) => {
            res.json({
                success: true,
                statusCode: 200,
                message: "Company created successfully",
                data: result
            });
        }).catch(err => {
            res.json({
                success: false,
                statusCode: 500,
                message: "Error while creating company",
                data: err
            });
        })
    }
    else {
        res.json({
            success: false,
            statusCode: 500,
            message: "You are not authorized user",
            data: null
        });
    }

})

router.get('/getAllCompanies', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (req.user.role === "admin") {
        Company.find().then(data => {
            res.json({
                success: true,
                statusCode: 200,
                message: "Companies found",
                data: data
            });
        }).catch(err => {
            res.json({
                success: false,
                statusCode: 500,
                message: "No data foud",
                data: err
            });
        })


    }
    else {
        res.json({
            success: false,
            statusCode: 500,
            message: "You are not authorized user",
            data: null
        });
    }

})

router.put('/editCompanyData', passport.authenticate('jwt', { session: false }), (req, res) => {
    const companyId = req.body.companyId;
    const companyName = req.body.newCompany;
    const NoOfEmployes = req.body.NoOfEmployes;
    const location = req.body.location;
    const category = req.body.category;
    const established_In = req.body.established_In;

    if (req.user.role === "admin") {
        Company.findByIdAndUpdate(
            companyId,
            {
                $set: {
                    companyName: companyName,
                    NoOfEmployes: NoOfEmployes,
                    location: location,
                    category: category,
                    established_In: established_In
                }
            },
            { new: true }
        ).then(updated => {
            res.json({
                success: true,
                statusCode: 200,
                message: "Company information updated successfully",
                data: updated
            });
        }).catch(err => {
            res.json({
                success: false,
                statusCode: 500,
                message: "Error while updating",
                data: err
            });
        })
    }
    else {
        res.json({
            success: false,
            statusCode: 500,
            message: "You are not authorized user",
            data: null
        });
    }
})
module.exports = router