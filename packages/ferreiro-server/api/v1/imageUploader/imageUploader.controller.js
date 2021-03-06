export const getImageUploader = (_, res) => {
    res.send('Upload your files')
}

export const postImageUploader = (req, res) => {
    if (req.files.length > 0 ) {
        const location = req.files[0].location

        return res.json({
            permalink: location
        })
    } else {
        return res.json({
            error: 'Can\'t upload!'
        })
    }
}