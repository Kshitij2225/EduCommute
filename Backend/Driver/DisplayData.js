const express = require('express')
const router  = express.Router()

router.post("/Data",(req,res)=>{

    try { 
        res.send([global.data])
        // console.log(global.data)
    } catch (error) {
        console.error(error.message)
        res.send("server error")
    }
})

module.exports = router