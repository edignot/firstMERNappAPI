let DUMMY_PLACES = [
    {
        id: 'i1',
        image:
            'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80',
        title: 't1',
        description: 'd1',
        address: 'a1',
        creatorId: '1',
        coordinates: {
            lat: 39.73915,
            lng: -104.9847,
        },
    },
    {
        id: 'i2',
        image:
            'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80',
        title: 't2',
        description: 'd2',
        address: 'a2',
        creatorId: '1',
        coordinates: {
            lat: 39.73915,
            lng: -104.9847,
        },
    },
];

const HttpError = require('../models/http-error');
const { v4: uuid } = require('uuid');
const { validationResult } = require('express-validator');
const Place = require('../models/place');

const getPlaceById = (req, res, next) => {
    const placeId = req.params.placeId;
    const foundPlace = DUMMY_PLACES.find((place) => place.id === placeId);
    if (!foundPlace) {
        next(new HttpError('could not find a place', 404));
    } else {
        res.json({ foundPlace });
    }
};

const getPlacesByUserId = (req, res, next) => {
    const userId = req.params.userId;
    const userPlaces = DUMMY_PLACES.filter(
        (place) => place.creatorId === userId
    );
    if (!userPlaces.length) {
        next(new HttpError('could not find any places', 404));
    } else {
        res.json({ userPlaces });
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

        try {
            await newPlace.save();
        } catch (err) {
            const error = new HttpError(`Couldn't create place`, 500);
            return next(error);
        }

        res.status(201).json(newPlace);
    }
};

const updatePlace = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        next(new HttpError('invalid inputs', 422));
    } else {
        const { title, description } = req.body;
        const placeId = req.params.placeId;
        const updatedPlace = {
            ...DUMMY_PLACES.find((place) => place.id === placeId),
        };
        const placeIndex = DUMMY_PLACES.findIndex(
            (place) => place.id === placeId
        );
        updatedPlace.title = title;
        updatedPlace.description = description;
        DUMMY_PLACES[placeIndex] = updatedPlace;
        res.status(200).json(DUMMY_PLACES[placeIndex]);
    }
};

const deletePlace = (req, res, next) => {
    const placeId = req.params.placeId;
    if (DUMMY_PLACES.find((place) => place.id === placeId)) {
        next(new HttpError('Could not find a place by ID', 404));
    } else {
        DUMMY_PLACES = DUMMY_PLACES.filter((place) => place.id !== placeId);
        res.status(200).json({ message: 'Place deleted' });
    }
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
