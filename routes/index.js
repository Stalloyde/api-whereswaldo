const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Characters = require('../models/characters');
const Score = require('../models/score');
const expressAsyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

let startTime = 0;
let elapsedTime = 0;
let id;
let gameScore = 0;

function setTimer(status) {
  if (status) id = setInterval(updateTime, 10);
  if (!status) {
    gameScore = elapsedTime;
  }
}

function resetTimer() {
  clearInterval(id);
}

function updateTime() {
  elapsedTime = new Date().getTime() - startTime;
}

function getFormattedTime(gameScore = elapsedTime) {
  const minCalc = Math.floor((gameScore / 1000 / 60) << 0);
  const secCalc = Math.floor((gameScore / 1000) % 60);
  const msCalc = ((gameScore / 1000) % 60).toFixed(2).slice(-2);

  const minutes = minCalc.toString().padStart(2, '0');
  const seconds = secCalc.toString().padStart(2, '0');
  const milliseconds = msCalc.toString().padStart(2, '0');

  if (minutes > 0) {
    return `${minutes}:${seconds}:${milliseconds}`;
  }
  return `${seconds}:${milliseconds}`;
}

router.get('/', async (req, res) => {
  const data = await Score.find({}).sort({ score: 1 }).limit(10);
  const topScores = data.map((data) => {
    return { score: getFormattedTime(data.score), username: data.username };
  });
  return res.json(topScores);
});

router.get('/gamestart', (req, res) => {
  resetTimer();
  startTime = new Date().getTime();
  setTimer(true);
  return res.json('Game Starts');
});

router.get('/gameover', (req, res) => {
  setTimer(false);
  return res.json(getFormattedTime());
});

router.post('/gameover', [
  body('username').notEmpty().withMessage('input is empty').trim().escape(),

  expressAsyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.json(errors);

    const newScore = new Score({
      score: gameScore,
      username: req.body.username,
    });

    await newScore.save();

    return res.json('Score saved');
  }),
]);

router.post('/gamestart', [
  body('targetCharacterName')
    .notEmpty()
    .withMessage('input is empty')
    .trim()
    .escape(),

  body('xCoordinate').notEmpty().withMessage('input is empty').trim().escape(),
  body('yCoordinate').notEmpty().withMessage('input is empty').trim().escape(),

  expressAsyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.json(errors);

    const targetCharacter = await Characters.findOne({
      name: req.body.targetCharacterName,
    });

    function checkTarget() {
      const xRangePositive = targetCharacter.xCoordinate + 2;
      const xRangeNegative = targetCharacter.xCoordinate - 2;
      const yRangePositive = targetCharacter.yCoordinate + 4;
      const yRangeNegative = targetCharacter.yCoordinate - 4;

      if (
        req.body.xCoordinate >= xRangeNegative &&
        req.body.xCoordinate <= xRangePositive &&
        req.body.yCoordinate >= yRangeNegative &&
        req.body.yCoordinate <= yRangePositive
      ) {
        return res.json(targetCharacter);
      } else {
        return res.json('Wrong target');
      }
    }

    checkTarget();
  }),
]);

module.exports = router;
