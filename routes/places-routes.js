const express = require('express');

const router = express.Router();

const DUMMY_PLACES = [
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

router.get('/:placeId', (req, res, next) => {
    const placeId = req.params.placeId;
    const foundPlace = DUMMY_PLACES.find((place) => place.id === placeId);

    !foundPlace
        ? res.status(404).json({ message: 'Could not find a place' })
        : res.json(foundPlace);
});

router.get('/user/:userId', (req, res, next) => {
    const userId = req.params.userId;
    const userPlaces = DUMMY_PLACES.filter(
        (place) => place.creatorId === userId
    );
    res.json(userPlaces);
});

module.exports = router;
