const db = require('../models/index');
const { validationResult } = require('express-validator');

class MainController {
  async getAllAlbums(req, res) {
    try {
      const albums = await db.Album.findAll();
      res.status(200).json(albums);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Failed to retrieve albums' });
    }
  }

  async getAlbumById(req, res) {
    try {
      const albumId = req.params.id;
      const album = await db.Album.findByPk(albumId);
      if (!album) {
        return res.status(404).send({ message: `Album not found with id ${albumId}` });
      }
      res.status(200).json(album);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Failed to retrieve album' });
    }
  }

  async createAlbum(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { title, artist } = req.body;
      const newAlbum = await db.Album.create({ title, artist });
      res.status(201).json(newAlbum);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Failed to create album' });
    }
  }

  async updateAlbum(req, res) {
    try {
      const albumId = req.params.id;
      const { title, artist } = req.body;
      const updatedAlbum = await db.Album.update({ title, artist }, { where: { id: albumId } });
      if (!updatedAlbum[0]) {
        return res.status(404).send({ message: `Album not found with id ${albumId}` });
      }
      res.status(200).json({ message: 'Album updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Failed to update album' });
    }
  }

  async deleteAlbum(req, res) {
    try {
      const albumId = req.params.id;
      await db.Album.destroy({ where: { id: albumId } });
      res.status(200).json({ message: `Album deleted successfully with id ${albumId}` });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Failed to delete album' });
    }
  }

  async getAllTracks(req, res) {
    try {
      const tracks = await db.Track.findAll();
      res.status(200).json(tracks);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Failed to retrieve tracks' });
    }
  }

  async getTrackById(req, res) {
    try {
      const trackId = req.params.id;
      const track = await db.Track.findByPk(trackId);
      if (!track) {
        return res.status(404).send({ message: `Track not found with id ${trackId}` });
      }
      res.status(200).json(track);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Failed to retrieve track' });
    }
  }

  async createTrack(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { title, albumId } = req.body;
      const newTrack = await db.Track.create({ title, albumId });
      res.status(201).json(newTrack);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Failed to create track' });
    }
  }

  async updateTrack(req, res) {
    try {
      const trackId = req.params.id;
      const { title } = req.body;
      const updatedTrack = await db.Track.update({ title }, { where: { id: trackId } });
      if (!updatedTrack[0]) {
        return res.status(404).send({ message: `Track not found with id ${trackId}` });
      }
      res.status(200).json({ message: 'Track updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Failed to update track' });
    }
  }

  async deleteTrack(req, res) {
    try {
      const trackId = req.params.id;
      await db.Track.destroy({ where: { id: trackId } });
      res.status(200).json({ message: `Track deleted successfully with id ${trackId}` });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Failed to delete track' });
    }
  }
}

module.exports = MainController;