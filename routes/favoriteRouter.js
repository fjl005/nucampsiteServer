const express = require('express');
const Favorite = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors');

const favoriteRouter = express.Router();

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorite.find({ user: req.user._id })
            .populate('users')
            .populate('campsites')
            .then(campsites => {
                if (campsites.length < 1) {
                    console.log('no campsites');
                    console.log('campsites: ', campsites);
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'application/json');
                    res.end('You have no favorites');
                } else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(campsites);
                }
            })
            .catch(err => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .then(favorite => {
                if (favorite) {
                    req.body.forEach((campsite) => {
                        if (!favorite.campsites.includes(campsite._id)) {
                            favorite.campsites.push(campsite._id);
                            favorite.save()
                                .then(favorite => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(favorite);
                                })
                        } else {
                            console.log('Already in favorites');
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.end('Campsite already exists');
                        }
                    })
                } else {
                    console.log('favorite not found');
                    Favorite.create({ user: req.user._id })
                        .then(favorite => {
                            console.log('Favorite Created ', favorite);
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        })
                        .catch((err) => next(err))
                }
                console.log('Favorite Created: ', favorite);
                // res.statusCode = 200;
                // res.setHeader('Content-Type', 'application/json');
                // res.json(favorite);
            })
            .catch(err => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end(`PUT not supported for /favorites`);
    })
    // .put(cors.corsWithOptions, authenticate.verifyUser, ())
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOneAndDelete({ user: req.user._id })
            .then(response => {
                if (response) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(response);
                } else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end('You do not have any favorites to delete');
                }
            })
            .catch((err) => next(err));
    })

favoriteRouter.route('/:campsiteId')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end(`GET not supported for /favorites/campsiteId`);
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        const { campsiteId } = req.params;

        Favorite.findOne({ user: req.user._id })
            .then(favorite => {
                if (favorite) {
                    // Check if the campsite is already in the favorites.campsites array
                    if (!favorite.campsites.includes(campsiteId)) {
                        favorite.campsites.push(campsiteId);
                        favorite.save()
                            .then(updatedFavorite => {
                                console.log('Favorite Updated ', updatedFavorite);
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(updatedFavorite);
                            })
                            .catch(err => next(err));
                    } else {
                        res.statusCode = 200;
                        res.end('That favorite does not exist');
                    }
                } else {
                    // Create a new favorites document for the user
                    Favorite.create({ user: req.user._id, campsites: [campsiteId] })
                        .then(newFavorite => {
                            console.log('Favorite Created ', newFavorite);
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(newFavorite);
                        })
                        .catch(err => next(err));
                }
            })
            .catch(err => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end(`PUT not supported for /favorites/campsiteId`);
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        const { campsiteId } = req.params;

        Favorite.findOne({ user: req.user._id })
            .then(favorite => {
                if (favorite) {
                    // Check if the campsite is in the favorites.campsites array
                    const index = favorite.campsites.indexOf(campsiteId);
                    if (index !== -1) {
                        // Remove the campsite from the favorites.campsites array
                        favorite.campsites.splice(index, 1);
                        favorite.save()
                            .then(updatedFavorite => {
                                console.log('Favorite Updated ', updatedFavorite);
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(updatedFavorite);
                            })
                            .catch(err => next(err));
                    } else {
                        // Campsite not found in favorites
                        res.status(200).json({ message: 'Campsite not found in favorites.' });
                    }
                } else {
                    // No favorites document exists
                    res.setHeader('Content-Type', 'text/plain');
                    res.status(200).send('No favorites to delete.');
                }
            })
            .catch(err => next(err));
    });

module.exports = favoriteRouter;