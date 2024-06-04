const mongoose = require('mongoose');
const { DateTime } = require("luxon");

const Schema = mongoose.Schema

const AuthorSchema = new Schema({
    first_name: {type: String, required: true, maxLength: 100},
    family_name: {type: String , required: true, maxLength: 100},
    date_of_birth: {type: Date},
    date_of_death: {type: Date},
});


AuthorSchema.virtual('name').get(function () {
    let fullname = "";

    if(this.first_name && this.family_name) {
        fullname = `${this.family_name}, ${this.first_name}`;
    }

    return fullname;
})

AuthorSchema.virtual("url").get(function () {
    return `/catalog/author/${this._id}`
})

AuthorSchema.virtual('date_of_birth_formated').get(function () {
    if(!this.date_of_birth) {
        return 'N/A';
    }
    return DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED)
})

AuthorSchema.virtual('date_of_death_formated').get(function () {
    if(!this.date_of_death) {
        return 'N/A';
    }
    return DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED)
})

AuthorSchema.virtual('lifespan').get(function () {
    const lifetime_string = `${this.date_of_birth_formated} - ${this.date_of_death_formated}`;
    return lifetime_string
})
module.exports = mongoose.model('Author', AuthorSchema)