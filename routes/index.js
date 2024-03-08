const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Characters = require('../models/characters');
const expressAsyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

router.post('/', [
  body('targetCharacterName')
    .notEmpty()
    .withMessage('input is empty')
    .trim()
    .escape(),

  body('xCoordinate').notEmpty().withMessage('input is empty').trim().escape(),
  body('xCoordinate').notEmpty().withMessage('input is empty').trim().escape(),

  expressAsyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.json(errors);

    const targetCharacter = await Characters.findOne({
      name: req.body.targetCharacterName,
    });

    function checkTarget() {
      const xRangePositive = targetCharacter.xCoordinate + 0.8;
      const xRangeNegative = targetCharacter.xCoordinate - 0.8;
      const yRangePositive = targetCharacter.yCoordinate + 2;
      const yRangeNegative = targetCharacter.yCoordinate - 2;

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
