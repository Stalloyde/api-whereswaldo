const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Characters = require('../models/characters');
const expressAsyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

let startTime = 0;
let elapsedTime = 0;
let id;

function setTimer(status) {
  if (status) id = setInterval(updateTime, 10);
  if (!status) clearInterval(id);
}

function updateTime() {
  elapsedTime = new Date().getTime() - startTime;
}

router.get('/', (req, res) => {
  startTime = new Date().getTime();
  setTimer(true);
  return res.json('Game Starts');
});

router.get('/gameover', (req, res) => {
  setTimer(false);
  const minCalc = Math.floor((elapsedTime / 1000 / 60) << 0);
  const secCalc = Math.floor((elapsedTime / 1000) % 60);
  const msCalc = ((elapsedTime / 1000) % 60).toFixed(2).slice(-2);

  const minutes = minCalc.toString().padStart(2, '0');
  const seconds = secCalc.toString().padStart(2, '0');
  const milliseconds = msCalc.toString().padStart(2, '0');
  const formattedTime = `${minutes}:${seconds}:${milliseconds}`;
  return res.json(formattedTime);
});

router.post('/', [
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
