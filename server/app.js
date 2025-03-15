require("dotenv").config({ path: "../.env" }); // Ensure correct .env path

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Import Models
const { User, Trucker, Load, Offer, Tracking } = require("./models/models");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));


// 🚀 **Home Route**
app.get("/", (req, res) => {
  res.send("Backend Working Successfully 🚀");
});

// 📌 **User Registration**
app.post("/api/register", async (req, res) => {
  try {
    const { 
      name, email, password, role, phone, 
      accidents, theftComplaints, 
      truckManufactureDate, licenseIssueYear, 
      otherCriteria 
    } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create User (Shipper or Trucker)
    const user = new User({ name, email, password, role, phone });
    await user.save();

    // If registering a Trucker, validate details
    if (role === "trucker") {
      if (!accidents || !theftComplaints || !truckManufactureDate || !licenseIssueYear) {
        return res.status(400).json({ message: "All trucker details are required" });
      }

      // ✅ Convert `"yes"` / `"no"` to `true` / `false`
      const hasNoAccidents = accidents.toLowerCase() === "yes";
      const hasNoTheftComplaints = theftComplaints.toLowerCase() === "yes";

      // ✅ Extract only the Year from `licenseIssueYear`
      const licenseYear = new Date(licenseIssueYear).getFullYear();
      if (isNaN(licenseYear)) {
        return res.status(400).json({ message: "Invalid license issue year format." });
      }

      // ✅ Convert `licenseYear` to a full date (e.g., `2016-01-01`)
      const licenseIssueDate = new Date(`${licenseYear}-01-01`);

      // ✅ Convert `truckManufactureDate` properly
      const truckDate = new Date(truckManufactureDate);
      if (isNaN(truckDate)) {
        return res.status(400).json({ message: "Invalid truck manufacture date." });
      }

      // ✅ Create Trucker Profile
      const trucker = new Trucker({
        userId: user._id,
        accidents: hasNoAccidents,
        theftComplaints: hasNoTheftComplaints,
        truckManufactureDate: truckDate,
        licenseIssueDate,
        otherCriteria,
      });

      await trucker.save();
    }

    res.status(201).json({ message: "User registered successfully!", user });

  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// 🔐 **User Login**
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid email " });
  }  
  if (password!=user.password) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  res.status(200).json({
    success: true,
    message: "Login successful",
    user
  });
});

// 📦 **Add a Load (Shippers)**
app.post("/api/addload", async (req, res) => {
  try {
    const {
      shipperId,
      origin,
      destination,
      payment,
      loadLength,
      loadWeight,
      equipment,
      pickupFrom,
      pickupTo,
      distance,
      commodity,
      additionalInfo,
      contact,
      status, // Added status field
    } = req.body;

    // Validate required fields
    if (
      !shipperId ||
      !origin ||
      !destination ||
      !payment ||
      !loadLength ||
      !loadWeight ||
      !equipment ||
      !pickupFrom ||!pickupTo||
      !contact
    ) {
      return res.status(400).json({ message: "All required fields must be filled!" });
    }

    // Set default status if not provided
    const loadStatus = status || "pending"; 

    // Create a new load
    const load = new Load({
      shipperId,
      origin,
      destination,
      payment,
      loadLength,
      loadWeight,
      equipment,
      pickupFrom, // Store start date
      pickupTo, // Store end date
      distance,
      commodity,
      additionalInfo,
      contact, // Store contact info
      status: loadStatus, // Added status
    });

    // Save to DB
    await load.save();

    res.status(201).json({ message: "Load added successfully!", load });
  } catch (error) {
    console.error("Error adding load:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

app.put("/api/loads/:id", async (req, res) => {
    try {
      const updatedLoad = await Load.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updatedLoad);
    } catch (err) {
      res.status(500).json({ error: "Failed to update load" });
    }
  });
  



  app.get("/api/myloads/:shipperId", async (req, res) => {
  try {
    const { shipperId } = req.params;
    const loads = await Load.find({ shipperId });
    res.json(loads);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch loads." });
  }
});

app.put("/api/myloads/:shipperId/editload/:loadId", async (req, res) => {
  try {
    const { shipperId, loadId } = req.params;
    const updateData = req.body;

    // ✅ Validate IDs
    if (!shipperId || !loadId) {
      return res.status(400).json({ message: "Shipper ID and Load ID are required." });
    }

    // ✅ Find and update the load
    const updatedLoad = await Load.findOneAndUpdate(
      { _id: loadId, shipperId }, // Ensure shipper can only edit their own loads
      { $set: updateData }, // Apply the update
      { new: true, runValidators: true } // Return the updated document & validate schema
    );

    // ✅ Check if load was found
    if (!updatedLoad) {
      return res.status(404).json({ message: "Load not found or unauthorized." });
    }

    res.json(updatedLoad);
  } catch (error) {
    console.error("Error updating load:", error);
    res.status(500).json({ message: "Failed to update load. Please try again later." });
  }
});

app.delete("/api/myloads/:shipperId/deleteload/:loadId", async (req, res) => {
  try {
    const { shipperId, loadId } = req.params;

    // ✅ Validate IDs
    if (!shipperId || !loadId) {
      return res.status(400).json({ message: "Shipper ID and Load ID are required." });
    }

    // ✅ Find and delete the load
    const deletedLoad = await Load.findOneAndDelete({ _id: loadId, shipperId });

    // ✅ If no load was deleted, return 404
    if (!deletedLoad) {
      return res.status(404).json({ message: "Load not found or unauthorized." });
    }

    res.json({ message: "Load deleted successfully.", deletedLoad });
  } catch (error) {
    console.error("Error deleting load:", error);
    res.status(500).json({ message: "Failed to delete load. Please try again later." });
  }
});


app.get("/api/pendingloads", async (req, res) => {
  try {
    const { origin, destination, pickupFrom, pickupTo, equipment } = req.query;

    let query = { status: "pending" }; // ✅ Only get pending loads

    if (origin) query.origin = new RegExp(origin, "i");
    if (destination) query.destination = new RegExp(destination, "i");

    if (pickupFrom && pickupTo) {
      query.pickupFrom = { $gte: new Date(pickupFrom) };
      query.pickupTo = { $lte: new Date(pickupTo) };
    }

    if (equipment) query.equipment = equipment;

    const loads = await Load.find(query);
    res.json(loads);
  } catch (error) {
    console.error("Error fetching pending loads:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// 🚚 **Trucker Bidding on Load**
app.post("/api/makeoffer/:truckerId/:loadId", async (req, res) => {
  try {
    const { truckerId, loadId } = req.params;
    const { offerPrice } = req.body;
    const currentYear = new Date().getFullYear();

    // ✅ Validate input fields
    if (!offerPrice || offerPrice <= 0) {
      return res.status(400).json({ message: "Offer price must be a positive value." });
    }

    // ✅ Check if the load exists
    const load = await Load.findById(loadId);
    if (!load) {
      return res.status(404).json({ message: "Load not found." });
    }

    // ✅ Check if the trucker exists
    const trucker = await User.findById(truckerId);
    if (!trucker || trucker.role !== "trucker") {
      return res.status(403).json({ message: "Only truckers can place offers." });
    }

    // ✅ Check if the trucker meets eligibility criteria
    const truckerDetails = await Trucker.findOne({ userId: truckerId });
    if (!truckerDetails) {
      return res.status(403).json({ message: "Trucker eligibility details not found." });
    }

    if (truckerDetails.accidents) {
      return res.status(403).json({ message: "Trucker must have no accident history." });
    }

    if (truckerDetails.theftComplaints) {
      return res.status(403).json({ message: "Trucker must have no theft complaints." });
    }

    const truckAge = currentYear - new Date(truckerDetails.truckManufactureDate).getFullYear();
    if (truckAge > 5) {
      return res.status(403).json({ message: "Truck age must not be more than 5 years." });
    }

    const licenseAge = currentYear - new Date(truckerDetails.licenseIssueDate).getFullYear();
    if (licenseAge < 5) {
      return res.status(403).json({ message: "Driver must have held a license for more than 5 years." });
    }

    // ✅ Check if the offer price is within the allowed range
    if (offerPrice > load.payment) {
      return res.status(400).json({ message: "Offer must be less than or equal to the payment amount." });
    }

    // ✅ Prevent duplicate offers from the same trucker on the same load
    const existingOffer = await Offer.findOne({ truckerId, loadId });
    if (existingOffer) {
      return res.status(400).json({ message: "You have already placed an offer for this load." });
    }

    // ✅ Create and save the new offer
    const newOffer = new Offer({ loadId, truckerId, offerPrice, status: "pending" });
    await newOffer.save();

    res.status(201).json({ message: "Offer placed successfully!" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to place offer." });
  }
});

app.get("/api/offers/:loadId", async (req, res) => {
    try {
      const { loadId } = req.params;
  
      // Ensure loadId is valid
      if (!loadId) {
        return res.status(400).json({ message: "Load ID is required." });
      }
  
      // Fetch bids for the given load ID, populate trucker details, and sort by offer price (ascending)
      const bids = await Offer.find({ loadId })
        .populate("truckerId", "name email phone") // Fetch trucker details (name, email, phone)
        .sort({ offerPrice: 1 });
  
      // If no bids are found, return a meaningful response
      if (!bids.length) {
        return res.status(404).json({ message: "No bids found for this load." });
      }
  
      res.json(bids);
    } catch (error) {
      console.error("Error fetching bids:", error);
      res.status(500).json({ message: "Error fetching bids. Please try again later." });
    }
  });
  
// ✅ Select a Trucker for a Load
app.put("/api/offer/select", async (req, res) => {
  try {
    const { loadId, truckerId } = req.body;

    // Ensure required fields exist
    if (!loadId || !truckerId) {
      return res.status(400).json({ message: "Load ID and Trucker ID are required." });
    }

    // Find the load
    const load = await Load.findById(loadId);
    if (!load) return res.status(404).json({ message: "Load not found" });

    // Find the trucker's bid
    const bid = await Offer.findOne({ loadId, truckerId });
    if (!bid) return res.status(404).json({ message: "No bid found from this trucker" });

    // Update the load with trucker confirmation
    load.status = "booked"; // Change status to "booked"
    load.truckerId = truckerId; // Assign trucker to the load
    await load.save();

    res.status(200).json({ message: "Trucker selected successfully!", load });
  } catch (error) {
    console.error("Error selecting trucker:", error);
    res.status(500).json({ message: "Error selecting trucker" });
  }
});



  // 📍 **Real-time Load Tracking (Socket.io)**
let loadLocation = { latitude: 28.7041, longitude: 77.1025 };

io.on("connection", (socket) => {
  console.log("Trucker Connected ✅");

  setInterval(() => {
    loadLocation.latitude += 0.001;
    loadLocation.longitude += 0.001;

    socket.emit("loadLocation", loadLocation);
  }, 5000);

  socket.on("disconnect", () => {
    console.log("Trucker Disconnected ❌");
  });
});

// 🚀 **Start Server**
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
