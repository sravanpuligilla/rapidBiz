const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Cab = require("../models/cab");
const auth = require("../../auth.js");

router.post('/getCabs', auth, (req, res) => {

    var lalitude = Number(req.body.lalitude);
    var longitude = Number(req.body.longitude);

    var coordinates = [longitude, lalitude];

    Cab.find({
        location: {
            $near: {
                $maxDistance: 2000,
                $geometry: {
                    type: "Point",
                    coordinates: coordinates
                }
            }
        }
        })
        .exec()
        .then(cab => {
            if (cab.length < 1) {
                return res.status(401).json({
                    message: "Results not found"
                });
            }
            res.status(200).json({
                message: "Cabs Info fetched"
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    });

router.post("/", (req, res) => {

    Cab.find({ email: req.body.email })
        .exec()
        .then(cab => {
            if (cab.length >= 1) {
                return res.status(409).json({
                    message: "Mail exists"
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const cab = new Cab({
                        cabId: req.body.cabId,
                        displayName: req.body.displayName,
                        email: req.body.email,
                        password: hash,
                        location: req.body.location,
                        phone: req.body.phone
                    });
                    cab
                        .save()
                        .then(result => {
                            console.log(result);
                            res.status(201).json({
                                message: "User created"
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });
                    }
                });
            }
        });
    });

router.post("/login", (req, res, next) => {
    Cab.find({ email: req.body.email })
        .exec()
        .then(cab => {
            if (cab.length < 1) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            bcrypt.compare(req.body.password, cab[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: "Auth failed"
                    });
                }
                if (result) {
                    const token = jwt.sign(
                        {
                            email: cab[0].email,
                            cabId: cab[0].customerId
                        },
                        "secretKey",
                        {
                            expiresIn: "7d"
                        }
                    );
                    return res.status(200).json({
                        message: "Auth successful",
                        token: token
                    });
                }
                res.status(401).json({
                    message: "Auth failed"
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;