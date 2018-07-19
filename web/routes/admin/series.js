const express = require('express')
const router = express.Router()

const utils = require('./utils')
const seriesRepository = require('../../repository/series')
const isAuthenticated = utils.isAuthenticated

router.get('/', isAuthenticated, getAllSeries)
router.get('/create', isAuthenticated, createSeriesPage)
router.post('/create', isAuthenticated, createSeries)
router.get('/delete/:permalink', isAuthenticated, deleteSeriesConfirmationPage)
router.get('/delete/:permalink/confirm', isAuthenticated, deleteSeries)
router.get('/update/:permalink', isAuthenticated, editPostPage)
router.post('/update/:permalink', isAuthenticated, editPostSubmit)

/**
 * Return all the available series
 */
function getAllSeries (req, res, next) {
  seriesRepository.getAll()
    .then(series => {
      res.render('admin/series/home', {
        series
      })
    })
    .catch(error => res.render('error', { error }))
}

function createSeriesPage (req, res, next) {
  res.render('admin/series/create')
}

/**
 * Creates a new series of articles
 */
function createSeries (req, res, next) {
  const data = req.body
  const seriesData = parseRequestSeriesData(req)

  seriesRepository.create(seriesData)
    .then(series => res.json({
      post: series,
      success: 'Series created!'
    }))
    .catch(error => res.json({
      error: 'Failed to create new post.<br />' + error
    }))
}

function deleteSeriesConfirmationPage (req, res, next) {
  const postPermalink = req.params.permalink
  res.send('Are you sure you want to delete the post?<br /><a href="/admin/series">Cancel</a> | <a href="/admin/series/delete/' + postPermalink + '/confirm">Yes. I know this action can not be undo</a>')
}

/**
 * Deletes a new Series
 */
function deleteSeries (req, res, next) {
  const postPermalink = req.params.permalink

  seriesRepository.findAndDeleteByPermalink(postPermalink)
    .then(post => res.redirect('/admin/series'))
    .catch((err) => {
      return res.render('admin/series/home', {
        error: 'Failed to update post.'
      })
    })
}

function editPostPage (req, res, next) {
  const postPermalink = req.params.permalink

  seriesRepository.findByPermalink({
    permalink: postPermalink
  }).then(series => {
    return res.render('admin/series/create', {
      edit: true,
      series: series,
      admin: true
    })
  }).catch((err) => {
    return res.render('admin/series/home', {
      error: 'Failed to create new post.'
    })
  })
}

function editPostSubmit (req, res, next) {
  const postPermalink = req.params.permalink
  const seriesData = parseRequestSeriesData(req)

  seriesRepository.findAndUpdateByPermalink(postPermalink, seriesData).then(post => {
    return res.json({
      post: post
    })
  }).catch((err) => {
    console.log(err)
    return res.json({
      error: 'Failed to update post.'
    })
  })
}

function parseRequestSeriesData (req) {
  const data = req.body

  const pic = data.series_pic
  const title = data.series_title
  const favicon = data.series_favicon
  const permalink = data.series_permalink
  const description = data.series_description
  const published = data.series_isPublished && data.series_isPublished === 'on'
  const secretKey = data.series_secretKey

  return {
    pic,
    title,
    favicon,
    permalink,
    description,
    published,
    secretKey
  }
}

module.exports = router
