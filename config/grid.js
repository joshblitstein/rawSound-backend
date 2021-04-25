const path = require('path')
const bodyParser = require('body-parser')
const multer = require('multer')
const GridFsStorage = require('multer-gridfs-storage')
const Grid = require('gridfs-stream')
const method = require('method-override')
const mongoose = require('mongoose') 
const crypto = require('crypto')
const config = require('config')
const db = config.get('MongoURI')
const express = require('express')
const { write } = require('fs')
const router = express.Router();





let gfs;

let conn = mongoose.createConnection(db, {useNewUrlParser: true, useUnifiedTopology: true });
conn.once('open',  () => { 
  gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads')
})

//storage engine 

const storage = new GridFsStorage({
    url: db,
    file: (req, file) => {
       return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = file.originalname //+ path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
          };
          resolve(fileInfo);
        });
      });
    }  
  });
  const upload = multer({ storage });


  router.post('/upload', upload.array('file'),  (req, res) => {
        for(i = 0; i < req.files.length;i++){
            req.files[i].filename = i;
        }


  
        console.log(req.files[83].filename)
        res.json({file: req.file})
  })
 
  router.get('/all', (req, res)=>{
    gfs.files.find().toArray((err, files)=>{
        if(!files){
        return    res.json({
                err: 'uproad'
            })
        }
        return res.json(files)
    })
  })



  router.get('/single/:filename', (req, res)=>{
    gfs.files.findOne({ filename: req.params.filename} , (err, file) => {
        if(!file){
            return    res.json({
                    err: 'uproad'
                })
            }
            return res.json(file)
        })
    
  })


  router.get('/static/:filename', (req, res)=>{
    gfs.files.findOne({ filename: req.params.filename} , (err, file) => {
        if(!file){
            return    res.json({
                    err: 'uproad'
                })
            }
           

            if(file.contentType == 'audio/mpeg'){
                const readstream = gfs.createReadStream(file.filename);
               // const writestream = gfs.createWriteStream({ filename: req.params.filename })
                readstream.pipe(res)
            }else{
                res.json({
                    err: 'nahnah' 
                })
            }
        })
    
  })
  module.exports = router;
 
//for lop

