const express = require('express');
const cors = require("cors");
const port = process.env.PORT || 80;
const app = express();
const bodyParser = require('body-parser');
require("./database/conn")
const nodemailer = require('nodemailer');

let modal = require("./database/modals")
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(cors())
app.options('*', cors())
const emailmodal = require("./database/emailmodal")

let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'automatedhome123@gmail.com',
        pass: 'Deepak@123'
    }
});

app.get("/", async (req,res)=>{
    let result ;
    try{
        result = await modal.find({});
        if(result == null)
            {
                res.status(404).json({
                    message:"An error occurred!"
                })
             }
        res.status(200).send(result);
    }
    catch(err){
        res.status(404).json({
            message:"An error occurred!"
        })
    }
    

});

app.post("/bysensor", async(req,res)=>{
    let name = req.body.name ;
    let date = req.body.date ;
    let result ;
    try{
        // result = await modal.find($and:[{"name" : `${name}` ,"date" : `${date}`}]);
        result = await modal.find({$and: [{name: {$eq: `${name}`}},{date: {$eq: `${date}`}}]});
        console.log(result)
        if(result == null)
            {
                res.status(404).json({
                    message:"An error occurred!"
                })
             }
        res.status(200).send(result);
    }
    catch(err){
        res.status(404).json({
            message:"An error occurred!"
        })
    }
    

});



app.post("/" , async (req,res) =>{
   
    var c = new modal(req.body);
     console.log(c);
     try{

    
        if(req.body.status == false){
            let result = await emailmodal.find({});
            console.log(result[0].email);


            let mailDetails = {
                from: 'automatedhome123@gmail.com',
                to: result[0].email,
                subject: 'Regarding to Your Home',
                text: `Hello Sir,
In Your Home, the Following Sensor is stopped Working, please check it as soon as possible.

                                                                                        Sensor Name = '${req.body.name}',
                                                                                        Stopped Value = '${req.body.value}'
                                                                                        Stopped Time =  '${req.body.time}'
                                                                                        Stopped Date = '${req.body.date}'

Thanks.
                
                `
            };
              console.log();
            mailTransporter.sendMail(mailDetails, function(err, data) {
                if(err) {
                    console.log(err);
                } else {
                    console.log('Email sent successfully');
                }
            });

        }



    let results = await c.save();
      
    if(results != null){
        let first_doc = await modal.findOne();

        if(first_doc.date != req.body.date ){
            await modal.deleteMany({"date" : `${first_doc.date}`});

        }
       
        res.status(200).json({
            message:"Data Saved Sucessfully."
        })
    }
      }
      catch(err){
          console.log(err);
        res.status(400).json({
            message:"Error Occured."
        })

    }
})

app.put("/" ,async(req,res)=>{
   
    var c = new emailmodal(req.body);
     
     try{
    await emailmodal.deleteMany({ });
    let results = await c.save();
      
        if(results != null){


                res.status(200).json({
                    message:"Onwards, You will receive email on this id.",
                    status : "200"
                })
            }
        else{
            res.status(404).json({
                message:"Error Occured.",
                status : "404"
            }) 
        }
    }
    catch(err){
        console.log(err);
    }

})

app.listen(port, ()=>{
    console.log(`The Server is running at ${port}`);
})