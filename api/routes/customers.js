const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Customer = require("../models/customer");

router.post("/", (req, res, next) => {
        Customer.find({ email: req.body.email })
        .exec()
        .then(customer => {
            if (customer.length >= 1) {
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
                            const customer = new Customer({
                                customerId: req.body.customerId,
                                name: req.body.name,
                                email: req.body.email,
                                password: hash,
                                location: req.body.location,
                                mobile: req.body.mobile
                            });
                            customer
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
    Customer.find({ email: req.body.email })
        .exec()
        .then(customer => {
            if (customer.length < 1) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            bcrypt.compare(req.body.password, customer[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: "Auth failed"
                    });
                }
                if (result) {
                    const token = jwt.sign(
                        {
                            email: customer[0].email,
                            customerId: customer[0].customerId
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
