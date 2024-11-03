const router = require('express').Router();
const mongoose = require('mongoose');
const Level = require("../models/LevelStructure")
const User = require("../models/User")

router.post("/create-level", async(req, res) => {
    try {
        const object = req.body.object;
        const levelNo = req.body.level;

        const newLevelObj = new Level({
            level: levelNo,
            directory: object
        });

        await newLevelObj.save();
        return res.status(200).send("New level created.");
    } catch (error) {
        console.log(error)
        return res.status(500).send(error);
    }
});

router.get("/get-level-details/:userId", async(req, res) => {
    try {
        const userId = req.params.userId;
        const userLevelDetails = await User.findById(userId);
        if (!userLevelDetails) {
            return res.status(404).send("This user does not exist");
        }

        const flags = userLevelDetails.flags;
        const levels = userLevelDetails.levelFinished;

        let atLevel;
        for (let i = 0; i < levels.length; i++) {
            if (!levels[i]) {
                atLevel = i + 1;
                break;
            }
        }

        return res.status(200).send({levelNo: atLevel, flag: flags[atLevel - 1]});
    } catch (error) {
        return res.status(500).send(error);
    }
})

router.get("/get-level/:levelNo", async (req, res) => {
    try {
        const levelNo = parseInt(req.params.levelNo);
        const filePath = path.join(__dirname, 'levels.json');
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const levelData = data.find(level => level.level === levelNo);
        

        if (!levelData) {
            return res.status(404).send({ message: "Level not found" });
        }

        return res.status(200).send(levelData.directory);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: "An error occurred" });
    }
})

router.post("/update-level/", async(req, res) => {
    try {
        const userId = req.body.userId;
        const levelIndex = req.body.level;
        /// update the boolean array
        await User.updateOne(
            { _id: userId },
            { $set: { [`levelFinished.${levelIndex - 1}`]: true } }
        )

        return res.status(200).send("You have passed this level!");
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
})

module.exports = router;