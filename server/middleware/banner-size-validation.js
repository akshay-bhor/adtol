const sizeOf = require('image-size');
const Banner_Sizes = require('../models/banner_sizes');

module.exports = async (req, _, next) => {
    try {
        // Get banner sizes
        const banner_sizes_list = [];
        const banner_sizes = await Banner_Sizes.findAll({ attributes: ['size'] });

        banner_sizes.forEach(data => {
            banner_sizes_list.push(data.dataValues.size);
        });
        
        req.files.forEach(image => {
            const {width, height} = sizeOf(image.buffer);
            const dimension = `${width}x${height}`;

            if(!banner_sizes_list.includes(dimension)) {
                throw new Error(`Image '${image.originalname}' has unsupported dimensions, please resize or choose different image!`);
            }
        });

        next();
    } catch (err) {
        next(err);
    }
}