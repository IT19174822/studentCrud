const express = require("express");
const router = express.Router();
const Student= require("../models/students");
const multer=require("multer");
const fs=require("fs");
//image upload

var storage=multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,"./uploads");
    },
    filename: function(req,file,cb){
        cb(null, file.fieldname + "_" + Date.now()+ "_" + file.originalname);
    },

});

var upload=multer({
    storage:storage,    
}).single('image');

//Insert an user into database route
router.post("/add",upload,(req,res)=>{
    const student=new Student({
        name:req.body.name,
        address: req.body.address,
        contact:req.body.contact,
        image:req.file.filename,
        
    });
    student.save((err)=>{
        if(err){
            res.json({message:err.message,type:'danger'});
        }else{
            req.session.message={
                type:'success',
                message:'student added sucessfully'
            };
            res.redirect("/")
        }
    })
})






//Get All users
router.get("/",(req,res)=>{
Student.find().exec((err, students) =>{
if(err){
    res.json({message: err.message});
}else{
    res.render('index',{
        title:"Home Page",
        students: students,

    });
}
})

});
router.get('/add',(req,res)=> {
    res.render("add_students",{title: ""});
});

//Edit an user route
router.get('/edit/:id',(req,res)=>{
    let id=req.params.id;
    Student.findById(id,(err,student)=>{
        if(err){
            res.redirect('/');
        }else{
            if(student == null){
                res.redirect('/')
            }else{
                res.render('edit_students',{
                    title: 'Edit student',
                    student:student
                })
            }
        }
    })
});

router.post("/update/:id",upload,(req,res)=>{
    let id= req.params.id;
    let new_image="";
    if(req.file){
        new_image=req.file.filename;
        try{
            fs.unlinkSync("./uploads/" +req.body.old_image);
        }catch(err){
                console.log(err);
        }
   
    } else{
           new_image=req.body.old_image; 
    }
    Student.findByIdAndUpdate(id,{
        name:req.body.name,
        address:req.body.address,
        contact: req.body.contact,
        image:new_image,
    },(err,result)=>{
        if(err){
            res.json({message: err.message, type:'danger'});
        }else{
            req.session.message={
                type: 'success',
                message:'student updated Successfully'
            };
            res.redirect("/");
        }
    }
    )
});


//Delete user route
router.get('/delete/:id',(req,res)=>{
    let id = req.params.id;
    Student.findByIdAndRemove(id,(err,result)=>{
        if(result.image !=''){
            try{
                fs.unlinkSync('./uploads/'+result.image);
            }catch(err){
                  console.log(err);  
            }
        }
        if(err){
            res.json({message: err.message});

        }else{
            req.session.message={
                type:'info',
                message:'student deleted successfully'
            };
            res.redirect('/');
        }
    })
})

module.exports = router;