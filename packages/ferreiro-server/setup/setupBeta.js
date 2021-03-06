/**
 * Validate if the application is in beta
 * and the user has the access token to
 * view the beta version.
 *
 * If not authorized session, then display coming soon
 */
const env = require('../env')

module.exports = (app) => {
    // This is only valid for Heroku.
    // Change this if you're using other
    // hosting provider.
    if (env.BETA_ACTIVATED === 'true') {
        app.use(setupBetaFirewall)
    }
}

function setupBetaFirewall (req, res, next) {
    const betaSecretToken = process.env.BETA_TOKEN

    let key = null
    if (req.query && req.query.beta) {
        key = req.query.token
    } else if (req.cookies) {
        key = req.cookies['betaToken']
    }

    if (!key) {
        return res.render('comingSoon')
    }

    if (key === betaSecretToken) {
    // Set the beta cookie
        res.cookie('betaToken', process.env.BETA_TOKEN, {
            maxAge: 3 * (24 * 3600000),
            httpOnly: true
        })
        return next()
    }

    return res.render('comingSoon', {
        message: 'Invalid beta token or session has expired...'
    })
}