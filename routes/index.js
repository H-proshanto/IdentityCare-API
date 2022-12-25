var express = require('express');
var multer = require('multer');
var router = express.Router();
var User = require('../models/user');
var Image = require('../models/image');

var Storage = multer.diskStorage({
	destination: 'uploads',
	filename: (req,file,cb) => {
	  cb(null,Date.now+file.originalname);
	}
});
var upload = multer({
	storage: Storage
  }).single('image');

router.post('/register', function(req, res, next) {
	console.log(req.body);
	var personInfo = req.body;

	if(!personInfo.email || !personInfo.username || !personInfo.password || !personInfo.passwordConf){
		res.send();
	} else {
		if (personInfo.password == personInfo.passwordConf) {

			User.findOne({email:personInfo.email},function(err,data){
				if(!data){
					var c;
					User.findOne({},function(err,data){

						if (data) {
							console.log("if");
							c = data.unique_id + 1;
						}else{
							c=1;
						}

						var newPerson = new User({
							unique_id:c,
							email:personInfo.email,
							username: personInfo.username,
							password: personInfo.password,
							passwordConf: personInfo.passwordConf
						});

						newPerson.save(function(err, Person){
							if(err)
								console.log(err);
							else
								console.log('Success');
						});

					}).sort({_id: -1}).limit(1);
					res.send({"Success":"You are regestered,You can login now."});
				}else{
					res.send({"Success":"Email is already used."});
				}

			});
		}else{
			res.send({"Success":"password is not matched"});
		}
	}
});


router.post('/login', function (req, res, next) {
	User.findOne({email:req.body.email},function(err,data){
		if(data){
			
			if(data.password==req.body.password){
				//console.log("Done Login");
				req.session.userId = data.unique_id;
				//console.log(req.session.userId);
				res.send({"Success":"Success!", "data": {
					username: data.username,
					email: data.email,
					uniqueId: data.unique_id,
					profileImage: data.profileImage,
				}});
				
			}else{
				res.send({"Success":"Wrong password!"});
			}
		}else{
			res.send({"Success":"This Email Is not regestered!"});
		}
	});
});

router.post('/uploadUserImage', function (req, res, next) {
	upload(req,res,(err) => {
		if(err) {
			console.log(err);
		}
		else {
			User.findOne({unique_id: req.body.authorization},(err,data) => {
				if(err) {
					console.log(err);
				} else {
					data.profileImage = req.file.filename;
					data.save()
					.then(() => res.send('Successfully Uploaded'))
					.catch((err) => console.log(err));
				}
			})
			// const newImage = new Image({
			// 	name: req.body.name,
			// 	image: {
			// 		data:req.file.filename,
			// 		contentType: 'image/jpeg'
			// 	}
			// })
			// newImage.save()
			// .then(() => res.send('Successfully Uploaded'))
			// .catch((err) => console.log(err));
		}
	})
});

module.exports = router;