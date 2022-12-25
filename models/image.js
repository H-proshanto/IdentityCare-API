var mongoose = require('mongoose');
var Schema = mongoose.Schema;

ImageSchema = new Schema( {
	name: {
        type: String,
        required: true,
    },
    image: {
        data: Buffer,
        contentType: String,
    }
}),
ImageModel = mongoose.model('ImageSchema', ImageSchema);

module.exports = ImageModel;