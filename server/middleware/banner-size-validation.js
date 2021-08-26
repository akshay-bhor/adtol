const sizeOf = require('image-size');
const Banner_Sizes = require('../models/banner_sizes');

module.exports = async (req, _, next) => {
    try {
        // Get banner sizes
        const banner_sizes_list = [];
        const banner_sizes_obj = [];
        const banner_sizes = await Banner_Sizes.findAll();

        banner_sizes.forEach(data => {
            banner_sizes_list.push(data.dataValues.size);
            banner_sizes_obj.push({
                id: data.dataValues.id,
                size: data.dataValues.size
            });
        });
        
        req.files.forEach(image => {
            const {width, height} = sizeOf(image.buffer);
            const dimension = `${width}x${height}`;

            if(!banner_sizes_list.includes(dimension)) {
                throw new Error(`Image '${image.originalname}' has unsupported dimensions, please resize or choose different image!`);
            }
        });

        // Attach banners sizes list to req for next middleware use
        req.banner_sizes_obj = banner_sizes_obj;

        next();
    } catch (err) {
        next(err);
    }
}