import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
    {
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        title: {
            type: String,
            required: [true, 'Please add a property title']
        },
        description: {
            type: String,
            required: [true, 'Please add a description']
        },
        price: {
            type: Number,
            required: [true, 'Please add a price']
        },
        configuration: {
            type: String, // e.g., '2 BHK', '3 BHK', etc.
            required: true
        },
        location: {
            city: { type: String, required: true },
            locality: { type: String, required: true },
            state: { type: String, required: true },
            // Optional mocks for lat/lng
            coordinates: {
                lat: { type: Number },
                lng: { type: Number }
            }
        },
        budgetRange: {
            min: { type: Number },
            max: { type: Number }
        },
        possessionDate: {
            type: Date,
            required: true
        },
        amenities: {
            type: [String],
            default: []
        },
        videos: {
            sampleFlat: { type: String }, // URL mockup
            buildingLocality: { type: String } // URL mockup
        },
        isPremium: {
            type: Boolean,
            default: false
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending' // Admin approval required
        }
    },
    {
        timestamps: true
    }
);

// Indexes for searching
propertySchema.index(
    { title: 'text', description: 'text', 'location.city': 'text', 'location.locality': 'text' },
    { weights: { title: 10, 'location.locality': 8, 'location.city': 5, description: 2 } }
);
propertySchema.index({ 'location.city': 1, 'location.locality': 1, status: 1 });
propertySchema.index({ price: 1, isPremium: -1 });

const Property = mongoose.model('Property', propertySchema);

export default Property;
