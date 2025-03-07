const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');
// const validator = require('validator')

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'tour must have a name'],
        unique: true,
        trim: true,
        maxlength: [40, 'tour name must have equal or less 40 characters'],
        minlength: [10, 'tour name must have equal or more 10 characters'],
        // validate: [validator.isAlpha, 'tour name must only contain characters']

    },
    slug: String,
    duration: {
        type: Number,
        required: [true, 'tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'tour must have a group size']
    },
    difficulty: {
        type: String,
        required: [true, 'tour must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is ethier: easy, medium, difficult'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
        set: val => Math.round(val * 10) / 10

    },
    ratingsQuantity: {
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
        required: [true, "tour must have a price"]
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (val) {
                // this only points to current doc on NEW document creation
                return val < this.price
            },
            message: 'Discount price ({VALUE}) should be below regular price'
        }
    },
    summary: {
        type: String,
        trim: true,
        required: [true, 'tour must have a summary']
    },
    decription: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'tour must have a cover image']
    },
    images: [String],
    createdAT: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    },
    startLocation: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: {
                type: [Number],
                address: String,
                description: String,
                day: Number
            }
        }
    ],
    guides: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ]
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ 'startLocation.coordinates': '2dsphere' });


tourSchema.virtual('durationWeeks').get(function () {
    if (this.duration < 7) {
        return `${this.duration} days`
    }
    return this.duration / 7

});

tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'
})

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

// tourSchema.pre('save', async function (next) {
//     const guidesPromises = this.guides.map(async id => await User.findById(id));
//     this.guides = await Promise.all(guidesPromises);

//     next();
// });

// tourSchema.pre('save', function (next) {
//     console.log('Document will be saved...');
//     next();
// });

// tourSchema.post('save', function (doc, next) {
//     console.log(doc);
//     next();
// })

//QUERY MIDDLEWARE

// tourSchema.pre('find', function (next) {
tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } });
    next();
});

// tourSchema.post(/^find/, function (docs, next) {
//     console.log(`Query took ${Date.now()} milliseconds`);
//     console.log(docs);
//     next();
// });

tourSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'guides',
        select: '-__v -passwordChangedAt'
    })
    next();
})

// AGGREGATION MIDDLEWARE

// tourSchema.pre('aggregate', function (next) {
//     this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//     // console.log(this.pipeline());
//     next();
// })

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;