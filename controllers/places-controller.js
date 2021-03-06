const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');
const Place = require('../models/place');
const User = require('../models/user');
const mongoose = require('mongoose');

const getPlaceById = async (req, res, next) => {
    const placeId = req.params.placeId;

    let foundPlace;

    try {
        foundPlace = await Place.findById(placeId);
    } catch (err) {
        next(new HttpError('Something went wrong', 500));
    }

    if (!foundPlace) {
        return next(new HttpError('could not find a place', 404));
    } else {
        res.json({ foundPlace: foundPlace.toObject({ getters: true }) });
    }
};

const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.userId;

    let userPlaces;

    try {
        userPlaces = await Place.find({ creatorId: userId });
    } catch (err) {
        return next(new HttpError('Something went wrong', 500));
    }

    if (!userPlaces.length) {
        next(new HttpError('could not find any places', 404));
    } else {
        res.json({
            userPlaces: userPlaces.map((place) =>
                place.toObject({ getters: true })
            ),
        });
    }
};

const createPlace = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        next(new HttpError('invalid inputs', 422));
    } else {
        const {
            title,
            description,
            coordinates,
            address,
            creatorId,
            image,
        } = req.body;
        const newPlace = new Place({
            title,
            description,
            coordinates,
            address,
            creatorId,
            image,
        });

        let user;
        try {
            user = await User.findById(creatorId);
            console.log(user);
        } catch (err) {
            return next(new HttpError(`Something went wrong`, 500));
        }

        if (!user) {
            return next(new HttpError(`Couldn't find user by id`, 404));
        }

        try {
            const currentSession = await mongoose.startSession();
            currentSession.startTransaction();
            await newPlace.save({ session: currentSession });
            user.places.push(newPlace);
            await user.save({ session: currentSession });
            await currentSession.commitTransaction();
        } catch (err) {
            return next(new HttpError(`Couldn't create place`, 500));
        }

        res.status(201).json(newPlace);
    }
};

const updatePlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        next(new HttpError('invalid inputs', 422));
    } else {
        const { title, description } = req.body;
        const placeId = req.params.placeId;

        let updatedPlace;

        try {
            updatedPlace = await Place.findById(placeId);
        } catch (err) {
            return next(new HttpError('Something went wrong', 500));
        }
        updatedPlace.description = description;
        updatedPlace.title = title;

        try {
            await updatedPlace.save();
        } catch (err) {
            return next(new HttpError('Something went wrong', 500));
        }

        res.status(200).json({
            updatePlace: updatedPlace.toObject({ getters: true }),
        });
    }
};

const deletePlace = async (req, res, next) => {
    const placeId = req.params.placeId;

    let place;
    try {
        place = await Place.findById(placeId).populate('creatorId');
    } catch (err) {
        return next(new HttpError('Something went wrong', 500));
    }

    if (!place) {
        return next(new HttpError('Could not find a place', 404));
    }

    try {
        const currentSession = await mongoose.startSession();
        currentSession.startTransaction();
        await place.remove({ session: currentSession });
        await place.creatorId.places.pull(place);
        await place.creatorId.save({ session: currentSession });
        await currentSession.commitTransaction();
    } catch (err) {
        return next(new HttpError('Something went wrong', 500));
    }

    res.status(200).json({ message: 'Place deleted' });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
