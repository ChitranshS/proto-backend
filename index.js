const express = require('express');
const connectDB = require('./db'); // Adjust the path as necessary
const { Robot, Manipulator, ControlModule, Floor, Basic, Controller, Additional, Application, Robotware } = require('./main'); // Adjust the path as necessary
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config();

// Connect to MongoDB
connectDB();

app.use(express.json());
const cors = require('cors');
app.use(cors());

app.get('/robots/names', async (req, res) => {
    try {
        const robots = await Robot.find({}, 'name'); // Fetch only the 'name' field
        res.status(200).json(robots);
    } catch (err) {
        console.error('Failed to fetch robot names:', err);
        res.status(500).json({ message: 'Failed to fetch robot names', error: err.message });
    }
});

// Route to insert a new robot and its associated data
// Route to insert a new robot and its associated data
app.post('/robots/insert', async (req, res) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const {
            robotData,
            manipulators,
            controlModules,
            floors,
            basics,
            controllers,
            additionals,
            applications,
            robotwares
        } = req.body;

        // Insert Robot
        const robot = await new Robot(robotData).save({ session });

        // Insert related data only if they exist in the request body
        if (manipulators) {
            const manipulatorDocs = manipulators.map(data => ({ ...data, robot: robot._id }));
            await Manipulator.insertMany(manipulatorDocs, { session });
        }
        if (controlModules) {
            const controlModuleDocs = controlModules.map(data => ({ ...data, robot: robot._id }));
            await ControlModule.insertMany(controlModuleDocs, { session });
        }
        if (floors) {
            const floorDocs = floors.map(data => ({ ...data, robot: robot._id }));
            await Floor.insertMany(floorDocs, { session });
        }
        if (basics) {
            const basicDocs = basics.map(data => ({ ...data, robot: robot._id }));
            await Basic.insertMany(basicDocs, { session });
        }
        if (controllers) {
            const controllerDocs = controllers.map(data => ({ ...data, robot: robot._id }));
            await Controller.insertMany(controllerDocs, { session });
        }
        if (additionals) {
            const additionalDocs = additionals.map(data => ({ ...data, robot: robot._id }));
            await Additional.insertMany(additionalDocs, { session });
        }
        if (applications) {
            const applicationDocs = applications.map(data => ({ ...data, robot: robot._id }));
            await Application.insertMany(applicationDocs, { session });
        }
        if (robotwares) {
            const robotwareDocs = robotwares.map(data => ({ ...data, robot: robot._id }));
            await Robotware.insertMany(robotwareDocs, { session });
        }

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

app.get('/', (req, res) => {
    res.json({ message: "Running" });
});


app.put('/robots/update/:name', async (req, res) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const {
            robotData,
            manipulators,
            controlModules,
            floors,
            basics,
            controllers,
            additionals,
            applications,
            robotwares
        } = req.body;

        const robotName = req.params.name;

        // Find and update the robot by name
        const robot = await Robot.findOneAndUpdate({ name: robotName }, robotData, { new: true, session });

        if (!robot) {
            throw new Error('Robot not found');
        }

        const robotId = robot._id;

        // Update related data only if provided
        const updateDocs = async (Model, data) => {
            if (data) {
                await Model.deleteMany({ robot: robotId }, { session });
                const docs = data.map(item => ({ ...item, robot: robotId }));
                await Model.insertMany(docs, { session });
            }
        };

        await updateDocs(Manipulator, manipulators);
        await updateDocs(ControlModule, controlModules);
        await updateDocs(Floor, floors);
        await updateDocs(Basic, basics);
        await updateDocs(Controller, controllers);
        await updateDocs(Additional, additionals);
        await updateDocs(Application, applications);
        await updateDocs(Robotware, robotwares);

        await session.commitTransaction();
        res.status(200).json({ message: 'Robot and associated data updated successfully' });
    } catch (err) {
        await session.abortTransaction();
        console.error('Failed to update data:', err);
        res.status(500).json({ message: 'Failed to update data', error: err.message });
    } finally {
        session.endSession();
    }
});
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });