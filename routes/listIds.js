const express = require('express');
const router = express.Router();
const domainJson = require('../public/files/domains.json');

const fs = require('fs');
const app = require('../app');

// Route api/list/getListIds

router.get('/getListIds', (req, res) => {
    let arr = []
    domainJson.domains.map(data => {
        if (data.type === 'domain') {
            console.log("data :", data.list);

            if (data.list) {
                data.list.map(data1L1 => arr.push(data1L1.listId));
            }
            if (data.children) {
                data.children.map(child1 => {
                    if (child1.list) {
                        child1.list.map(child1L1 => arr.push(child1L1.listId));
                    }
                    if (child1.children) {
                        child1.children.map(child2 => {
                            if (child2.list) {
                                child2.list.map(child2L2 => arr.push(child2L2.listId));
                            }
                            if (child2.children) {
                                child2.children.map(child3 => {
                                    if (child3.list) {
                                        child3.list.map(child3L3 => arr.push(child3L3.listId));
                                    }
                                    if (child3.children) {
                                        child3.children.map(child4 => {
                                            if (child4.list) {
                                                child4.list.map(child4L4 => arr.push(child4L4.listId));
                                            }
                                            if (child4.children) {
                                                child4.children.map(child5 => {
                                                    if (child5.list) {
                                                        child5.list.map(child5L5 => arr.push(child5L5.listId));
                                                    }
                                                    if (child5.children){
                                                        child5.children.map(child6 =>{
                                                            if(child6.list){
                                                                child6.list.map(child6L6 => arr.push(child6L6.listId));
                                                            }
                                                            if(child6.children){
                                                                child6.children.map(child7 =>{
                                                                    if(child7.list){
                                                                        child7.list.map(child7L7 => arr.push(child7L7.listId));
                                                                    }
                                                                })
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }

        }

    });
    console.log("arr :", arr);
    res.json({
        success: true,
        statusCode: 200,
        message: "List Ids found",
        data: arr
    });
})

module.exports = router