const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const placeSchema = new Schema({
    image: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
    },
    creatorId: { type: String, required: true },
});
