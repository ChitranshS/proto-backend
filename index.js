// app.js
const express = require('express');
const connectDB = require('./db'); // Adjust the path as necessary
const { Robot, Manipulator, ControlModule, Floor, Basic, Controller, Additional, Application, Robotware } = require('./main'); // Adjust the path as necessary
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

app.use(express.json());
const cors = require('cors');
app.use(cors());


// Route to insert a new robot and its associated data
app.post('/robots/insert', async (req, res) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const {
            robotData,
            manipulators = [],
            controlModules = [],
            floors = [],
            basics = [],
            controllers = [],
            additionals = [],
            applications = [],
            robotwares = []
        } = req.body;

        // Insert Robot
        const robot = await new Robot(robotData).save({ session });

        // Insert related data
        const manipulatorDocs = manipulators.map(data => ({ ...data, robot: robot._id }));
        const controlModuleDocs = controlModules.map(data => ({ ...data, robot: robot._id }));
        const floorDocs = floors.map(data => ({ ...data, robot: robot._id }));
        const basicDocs = basics.map(data => ({ ...data, robot: robot._id }));
        const controllerDocs = controllers.map(data => ({ ...data, robot: robot._id }));
        const additionalDocs = additionals.map(data => ({ ...data, robot: robot._id }));
        const applicationDocs = applications.map(data => ({ ...data, robot: robot._id }));
        const robotwareDocs = robotwares.map(data => ({ ...data, robot: robot._id }));

        await Manipulator.insertMany(manipulatorDocs, { session });
        await ControlModule.insertMany(controlModuleDocs, { session });
        await Floor.insertMany(floorDocs, { session });
        await Basic.insertMany(basicDocs, { session });
        await Controller.insertMany(controllerDocs, { session });
        await Additional.insertMany(additionalDocs, { session });
        await Application.insertMany(applicationDocs, { session });
        await Robotware.insertMany(robotwareDocs, { session });

        await session.commitTransaction();
        res.status(201).json({ message: 'Robot and associated data inserted successfully' });
    } catch (err) {
        await session.abortTransaction();
        console.error('Failed to insert data:', err);
        res.status(500).json({ message: 'Failed to insert data', error: err.message, stack: err.stack });
    } finally {
        session.endSession();
    }
});

app.get('/robots/name/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const robot = await Robot.findOne({ name }).lean().exec();

        if (!robot) {
            return res.status(404).json({ message: 'Robot not found' });
        }

        const robotId = robot._id;
        const manipulators = await Manipulator.find({ robot: robotId }).lean().exec();
        const controlModules = await ControlModule.find({ robot: robotId }).lean().exec();
        const floors = await Floor.find({ robot: robotId }).lean().exec();
        const basics = await Basic.find({ robot: robotId }).lean().exec();
        const controllers = await Controller.find({ robot: robotId }).lean().exec();
        const additionals = await Additional.find({ robot: robotId }).lean().exec();
        const applications = await Application.find({ robot: robotId }).lean().exec();
        const robotwares = await Robotware.find({ robot: robotId }).lean().exec();

        res.json({
            robotData: robot,
            manipulators,
            controlModules,
            floors,
            basics,
            controllers,
            additionals,
            applications,
            robotwares
        });
    } catch (err) {
        console.error('Failed to fetch data:', err);
        res.status(500).json({ message: 'Failed to fetch data', error: err.message });
    }
});



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
