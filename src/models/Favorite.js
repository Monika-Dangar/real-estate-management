import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema(
    {
        buyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        property: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Property',
            required: true
        }
    },
    {
        timestamps: true
    }
);

// Prevent duplicate favorites for a buyer
favoriteSchema.index({ buyer: 1, property: 1 }, { unique: true });

const Favorite = mongoose.model('Favorite', favoriteSchema);

export default Favorite;
