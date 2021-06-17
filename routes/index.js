const express = require('express');
const router = express.Router();
const Solution = require('./../models/Solution')
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })
const secret = process.env.SECRET

router.get('/', (req, res) => {
    res.render("landingPage")
});

router.post('/', async (req, res) => {
    const { searchQuery } = req.body

    await Solution.find({ title: { $regex: `${searchQuery}`, $options: 'i' } }, (err, docs) => {
        if (err) {
            console.log(err)
            res.redirect('/')
        } else {
            res.render('problemList', { docs, searchQuery, secret })
        }
    })
})

router.get('/problem/:id', (req, res) => {
    const id = req.params.id
    Solution.findById(id, (err, docs) => {
        if (err) {
            console.log(err);
            res.redirect('/')
        }
        else {
            let url = docs.codeUrl
            url += ".js"
            res.render('problems', { docs, url, secret})
        }
    });
});

router.get(`/input${secret}`, (req, res) => {
    res.render("input",{secret})
});

router.post(`/input${secret}`, async (req, res) => {
    const { title, codeUrl, platform, author, date } = req.body

    const solution = new Solution({
        title,
        codeUrl,
        platform,
        author,
        date
    })

    await solution.save((err) => {
        if (err) {
            console.log(err)
            res.redirect('/')
        } else {
            res.redirect('/allProblems')
        }
    })
})

router.get(`/problem/edit${secret}/:id`, (req, res) => {
    const id = req.params.id
    Solution.findById(id, (err, docs) => {
        if (err) {
            console.log(err);
            res.redirect('/')
        }
        else {
            console.log(docs)
            let url = docs.codeUrl
            res.render('edit', { docs, url, secret })
        }
    });
});

router.post(`/edit${secret}/:id`, (req, res) => {
    const id = req.params.id
    const { title, codeUrl, platform, author, date } = req.body
    Solution.findOneAndUpdate({ "_id": id }, { "$set": { "title": title, "codeUrl": codeUrl, "platform": platform, "author": author, "date": date } }, { new: true }, (err, docs) => {
        if (err) {
            console.log(err)
            res.redirect('/')
        } else {
            res.redirect(`/problem/${id}`)
        }
    })
})

router.post(`/delete${secret}/:id`,(req,res)=>{
    const {id} = req.params

    Solution.findByIdAndDelete(id, (err, docs) => {
        if (err) {
          console.log(err)
          res.redirect('/')
        } else {
          console.log(docs)
          res.redirect('/allProblems')
        }
      })

})
router.get('/allProblems', async (req, res) => {
    const allSolution = await Solution.find({});
    res.render('allProblems', { allSolution, secret })
});


module.exports = router;