const mongoose = require("mongoose");

// 📌 **User Schema (Shippers & Truckers)**
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["trucker", "shipper", "admin"], required: true },
    phone: String,
    createdAt: { type: Date, default: Date.now }
});

// 📌 **Trucker Schema (Eligibility Criteria)**
const TruckerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    accidents: { type: Boolean, required: true },
    theftComplaints: { type: Boolean, required: true },
    truckManufactureDate: { type: Date, required: true },
    licenseIssueDate: { type: Date, required: true },
    otherCriteria: String,
    createdAt: { type: Date, default: Date.now }
});

// 📌 **Load Schema (Posted by Shippers)**
const LoadSchema = new mongoose.Schema({
    shipperId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    payment: { type: Number, required: true },
    loadLength: { type: Number, required: true },
    loadWeight: { type: Number, required: true },
    equipment: { type: String, enum: ["Flatbed", "Reefer", "Dry Van", "Step Deck"], required: true },
    pickupFrom: { type: Date, required: true }, // Start date
    pickupTo: { type: Date, required: true }, // End date
    distance: { type: Number },
    commodity: { type: String },
    additionalInfo: { type: String },
    contact: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
    },
    status: { 
      type: String, 
      enum: ["pending", "booked", "completed"], 
      default: "pending" 
    }, // Load status
    createdAt: { type: Date, default: Date.now }
  });

// 📌 **Offer Schema (Truckers Bidding on Loads)**
const OfferSchema = new mongoose.Schema({
    loadId: { type: mongoose.Schema.Types.ObjectId, ref: "Load", required: true },
    truckerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    offerPrice: { type: Number, required: true },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
    createdAt: { type: Date, default: Date.now }
});

// 📌 **Tracking Schema (Real-time tracking & alerts)**
const TrackingSchema = new mongoose.Schema({
    loadId: { type: mongoose.Schema.Types.ObjectId, ref: "Load", required: true },
    truckerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    currentLocation: String,
    status: { type: String, enum: ["in-transit", "delayed", "delivered"], default: "in-transit" },
    alertMessage: String, // Notifications
    updatedAt: { type: Date, default: Date.now }
});

// 📌 **Ledger Schema (Payments Management)**
const LedgerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    transactionType: { type: String, enum: ["credit", "debit"], required: true },
    description: String,
    createdAt: { type: Date, default: Date.now }
});

// 📌 **Trucker Benefits Schema (Discounts & Insurance)**
const BenefitsSchema = new mongoose.Schema({
    truckerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    insuranceDiscount: Number, // Percentage
    tireDiscount: Number,
    sparePartsDiscount: Number,
    serviceDiscount: Number,
    lodgingDiscount: Number,
    foodDiscount: Number,
    fuelDiscount: Number,
    claimSystemDetails: String,
    updatedAt: { type: Date, default: Date.now }
});

// 📌 **Admin Dashboard Schema (SuperAdmin Control)**
const AdminSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    onboardedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // List of onboarded users
    managedLoads: [{ type: mongoose.Schema.Types.ObjectId, ref: "Load" }], // List of loads managed
    createdAt: { type: Date, default: Date.now }
});

// ✅ **Creating Models**
const User = mongoose.model("User", UserSchema);
const Trucker = mongoose.model("Trucker", TruckerSchema);
const Load = mongoose.model("Load", LoadSchema);
const Offer = mongoose.model("Offer", OfferSchema);
const Tracking = mongoose.model("Tracking", TrackingSchema);
const Ledger = mongoose.model("Ledger", LedgerSchema);
const Benefits = mongoose.model("Benefits", BenefitsSchema);
const Admin = mongoose.model("Admin", AdminSchema);

// ✅ **Exporting Models**
module.exports = { User, Trucker, Load, Offer, Tracking, Ledger, Benefits, Admin };
