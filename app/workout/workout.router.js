const express = require('express');
const Joi = require('joi');
const workoutRouter = express.Router();
const path = require('path');

const {
    HTTP_STATUS_CODES
} = require('../config');
const {
    jwtPassportMiddleware
} = require('../auth/auth.strategy');
const {
    Workout,
    WorkoutJoiSchema
} = require('./workout.model');

//CREATE NEW WORKOUT
workoutRouter.post('/', (request, response) => {
    const newWorkout = {
        user: request.body.user,
        sets: {
            exercise: request.body.exercise,
            reps: request.body.reps,
            weight: request.body.weight,
            set: request.body.set
        },
        date: request.body.date
    };

    const validation = Joi.validate(newWorkout, WorkoutJoiSchema);
    if (validation.error) {
        return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
            error: validation.error
        });
    }
    Workout.create(newWorkout)
        .then(createdWorkout => {
            return response.status(HTTP_STATUS_CODES.CREATED).json(createdWorkout.serialize());
        })
        .catch(error => {
            console.log(error)
            return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).send(error);
        })
})

workoutRouter.get('/', (request, response) => {

    Workout.find()
        .then(workouts => {

            return response.status(HTTP_STATUS_CODES.OK).json(
                workouts.map(workout => workout)
            );
        })
        .catch(error => {
            return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
})

workoutRouter.get('/:user/:date', (req, res) => {

    Workout.find(req.params)
        .then(workout => {
            return res.status(HTTP_STATUS_CODES.OK).json(workout);
        })
        .catch(error => {
            return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});
workoutRouter.get('/:workoutid', (req, res) => {

    Workout.findById(req.params.workoutid)
        .then(workout => {
            return res.status(HTTP_STATUS_CODES.OK).json(workout);
        })
        .catch(error => {
            return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});

// Remove set from workout by id
workoutRouter.delete('/:workoutid', (req, res) => {
    Workout.findByIdAndDelete(req.params.workoutid)
        .then(() => {
            return res.status(HTTP_STATUS_CODES.NO_CONTENT).end();
        })
        .catch(error => {
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});

module.exports = {
    workoutRouter
};