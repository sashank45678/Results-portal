const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const DATABASE_URL="mongodb+srv://dtarunsai08:4tpqOW74BQZ8ARzl@cluster0.putncw7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const session = require("express-session");
var MongoDBStore = require('connect-mongodb-session')(session);
const bcrypt=require('bcryptjs')
const multer=require('multer')
const databaseconnection=async function(){
    try{
        mongoose.connect(DATABASE_URL)
    }
    catch(err){
        console.log("connection failed due to:")+err
    }
}
databaseconnection()
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const Student=require("./models/studentmodel")
const Teacher=require("./models/teachermodel")
const adminteacher=require("./models/adminteachermodel")
const adminstudent=require("./models/adminstudentmodel")
const evaluationschema=require("./models/reevaluations")
const newModel=require("./models/displaymodel")
const port = 10000;
const store=new MongoDBStore({
    uri:DATABASE_URL,
    collection:"sessions"
})
app.use(session({
    secret:"this is a secret",
    resave:false,
    saveUninitialized:false,
    store:store
}))

app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/login", async (req, res) => {
  const { emailid, passwordkey, candid } = req.body;
  let userexists = "";

  if (candid == "admin") {
      req.session.isAuthorized=true
      res.redirect('/dashboard');
  } else if (candid == "student") {
      userexists = await Student.findOne({ email: emailid });
  } else if (candid == "teacher") {
      userexists = await Teacher.findOne({ email: emailid });
  }

  if (!userexists && candid!="admin") {
      res.redirect('/register');
  } else if(candid!="admin") {
      const match = bcrypt.compareSync(passwordkey, userexists.password);
      if (!match) {
          res.redirect('/login');
      } else {
          console.log(candid)
          candid=="student"?req.session.isStudent=true:req.session.isTeacher=true
          candid=="student"?res.redirect('/loggedinstudent/'+userexists.admissionnumber):res.redirect('/loggedinteacher?subject='+userexists.subject)
      }
  }
});
app.get("/register", (req, res) => {
  res.render("register");
});
app.post("/register", async function (req, res) {
  try {
    let username = req.body.name;
    let emailid = req.body.emailid;
    let password = req.body.passwordkey;
    let person=req.body.person
    let subject=req.body.subject
    var salt = bcrypt.genSaltSync(10);
    var hashedpassword = bcrypt.hashSync(password, salt);
    if(person=="teacher"){
      const data = {
        name: username,
        email: emailid,
        password: hashedpassword,
        subject:req.body.subject,
      };
      const match=await adminteacher.find({name:username,subject:req.body.subject})
      if(match){
        const result=await Teacher.insertMany([data])
        req.session.isTeacher=true
        res.redirect('/loggedinteacher?subject='+req.body.subject)
      }
      else{
        res.redirect('/login')
      }
    }
    else if(person=="student"){
      const data = {
        name: username,
        email: emailid,
        password: hashedpassword,
        admissionnumber:req.body.rollno
      };
      const match=await adminstudent.find({name:username,rollno:req.body.rollno})
      if(match){
        const result=await Student.insertMany([data])
        req.session.isStudent=true
        res.redirect('/loggedinstudent/'+data.admissionnumber)
      }
      else{
        res.redirect('/login')
      }
      
    }

  } catch (err) {
    console.log(err);
  }
});
app.get("/", (req, res) => {
  res.render("welcome");
});
const middleware1=(req,res,next)=>{
    if(req.session.isAuthorized){
        next()
    }
    else{
        res.redirect("/register")
    }
}
app.get("/dashboard",middleware1,(req,res)=>{
  res.render('dashboard')
})
app.post("/dashboard/:id",async(req,res)=>{
  const{id}=req.params
  if(id=="student"){
    const data={
      name:req.body.name,
      rollno:req.body.rollno
    }
    await adminstudent.insertMany([data])
    await newModel.insertMany([{name:req.body.name,rollno:req.body.rollno,section:req.body.section}])
    res.json("succesful")
  }
  else{
    const data={
      name:req.body.name,
      subject:req.body.subject
    }
    await adminteacher.insertMany([data])
    res.json("succesful")
  }
})
const teachermiddleware=async(req,res,next)=>{
if(req.session.isTeacher){
  next()
}
}
app.get("/loggedinteacher",teachermiddleware,async(req,res)=>{
  const queryparams=req.query.subject
  const results=await newModel.find({})
  res.render('loggedinteacher',{data:results,subject:queryparams})
})
app.post('/loggedinteacher/:subject',async(req,res)=>{
  if(req.body.rollnumber){
    const queryparams=req.params.subject
    const results=await newModel.find({rollno:req.body.rollnumber})
    res.render('loggedinteacher',{data:results,subject:queryparams})
  }
  else if(req.body.section){
    const queryparams=req.params.subject
    const results=await newModel.find({section:req.body.section})
    res.render('loggedinteacher',{data:results,subject:queryparams})
  }
})
app.put('/loggedinteacher',async(req,res)=>{
  const result = await newModel.findOneAndUpdate(
    { rollno: req.body.rollno },
    { $set: { [`marks.${req.body.subject}`]: req.body.updatedMarks } },
    { new: true }
  );
  res.json("succesful")
})
const studentmiddleware=async(req,res,next)=>{
  if(req.session.isStudent){
    next()
  }
  }
app.get("/loggedinstudent/:rollno",studentmiddleware,async(req,res)=>{
  const rollno=req.params.rollno
  const results=await newModel.find({rollno:rollno})
  res.render('loggedinstudent',{data:results})
})
app.get('/logout',(req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      res.status(500).send('Error logging out');
    } else {
      res.redirect('/'); 
    }
  });
})
app.put('/challenges',async(req,res)=>{
  const{rollno,teacher}=req.body
  const result=await evaluationschema.find({admissionNumber:rollno,teacher:teacher})
  console.log(result);
  if(result.length>0){
    res.json("succesful")
  }
  else{
  const result=await evaluationschema.insertMany([{admissionNumber:rollno,teacher:teacher,status:"pending"}])
  res.json("succesful")
  }
})
app.get('/viewchallenges/:id',async(req,res)=>{
  const subject=req.params.id
  const result=await evaluationschema.find({teacher:req.params.id})
  res.render('viewchallenges',{data:result,subject:subject})
})
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, './uploads'); 
  },
  filename: function (req, file, cb) {
      const uniqueSuffix = Date.now();
      cb(null, file.fieldname + '-' + uniqueSuffix +'.pdf');
  }
});

const upload = multer({ storage: storage });

app.use('/uploads', express.static('uploads'));

app.post('/viewchallenges/:id', upload.single('pdf'), async function (req, res) {
  const rollno=req.params.id
  const Explanation= req.body[rollno];
  const subject=req.body.response
  const result = await evaluationschema.findOneAndUpdate(
      { admissionNumber: req.params.id,teacher:subject },
      { status: 'done', filePath: req.file.path,explanation:Explanation}
  );
  res.redirect('/logout')
});
app.get('/responses/:rollno',async(req,res)=>{
  const result=await evaluationschema.find({admissionNumber:req.params.rollno,status:"done"})
  console.log(result);
  res.render('viewresponses',{data:result})
})
app.listen(port, () => {
  console.log("server running...");
});
