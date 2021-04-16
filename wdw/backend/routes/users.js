const router = require('express').Router();

let User = require('../models/user.model');
let Course = require('../models/course.model')

// get request for .../users/ info
router.route('/').get((req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

// adds user to database 
router.route('/add-user').post((req, res) => {
  const body = req.body;

  const newUser = new User(body);

  newUser.save()
    .then(() => res.json('User added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/get-user').get((req, res) => {
  // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  // res.setHeader('Access-Control-Allow-Credentials',true);
  
  const user = req.user
  console.log("getuser", user)

  if (user != undefined) {
    res.status(200).json(user).send()
  } else {
    res.status(400).send()
  }

  // userEmail = req.body.email
  // console.log("looking for user" + userEmail)

  // User.findOne({email: userEmail}, (err, foundUser) => {
  //   if (err) {
  //     console.log(err)
  //     //res.status(500).send()
  //   } else {
  //     res.json(foundUser).send()
  //   }
  // })
});

router.route('/isProfessor').get((req, res) => {
  const user = req.user
  if (user.isProfessor != undefined && user.isProfessor) {
    res.status(200).json(true).send()
  } else {
    res.status(200).json(false).send()
  }
})

router.route('/add-course').post((req, res) => {
  const user = req.user;
  const course = req.body;
  
  User.updateOne({email: user.email}, {$addToSet: {classList: course}}, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send()
    } else {
      res.json('Course added!').send()
      // console.log(result)
    }
  });

})

router.route('/add-course-old').post((req, res) => {
  const email = req.body.email;
  const course = req.body.course;
  
  User.updateOne({email: email}, {$addToSet: {classList: course}}, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send()
    } else {
      res.json('Course added!').send()
      // console.log(result)
    }
  });

})

router.route('/remove-course').post((req, res) => {
  const email = req.body.email 
  const courseName = req.body.name
  console.log(req.body)
  User.updateOne({email: email}, {$pull: {classList: {name: courseName}}}, (err, result) => {
    if (err) {
      console.log(err)
      res.status(500).send()
    } else {
      res.json('Course removed!').send()
    }
  })
})

router.route('/courses').get((req, res) => {
  const user = req.user;
  if (user != undefined) {
    return res.status(200).json(user.classList);
  } 

  return res.status(404).send();
});

router.route('/events').get(async (req, res) => {
  const courseList = req.user.classList
  let eventList = []
  console.log('[users.js 117]: courseList: ' + JSON.stringify(courseList))

  //for(course in courseList)
  for(let i = 0; i < courseList.length; ++i)
  {
    if(courseList[i] != null)
    {
      await Course.findOne({deptCode: courseList[i].deptCode, courseNumber: courseList[i].courseNumber}, (err, course) => {
        console.log('[users.js 121] course :' + JSON.stringify(course))
        console.log('[users.js 122] deptCode :' + course.deptCode)
        console.log('[users.js 123] courseNumber :' + course.courseNumber)
        console.log('[users.js 125] event :' + course.eventList)

        for(let i = 0; i < course.eventList.length; ++i)
        {
          eventList.push(course.eventList[i])
        }
      })
    }
  }

  console.log('[users.js 134] returned event list :' + eventList)
  res.json(eventList)
});

// req: {email: (users email)}
// res: true or false or 500 error code 
router.route('/user-exist').post((req, res) => {
  const userEmail = req.body.email
  User.findOne({email: userEmail}, (err, user) => {
    if (err) {
      res.status(400).send()
    }

    if (user) {
      res.status(200).json(true).send()
    } else {
      res.status(200).json(false).send()
    }
  })
})

module.exports = router;