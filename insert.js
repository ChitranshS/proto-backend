// insert.js
const mongoose = require('mongoose');
const connectDB = require('./db'); // Adjust the path as necessary
const { Robot, Manipulator, ControlModule, Floor, Basic, Controller, Additional, Application, Robotware } = require('./main'); // Adjust the path as necessary

// Ensure the DB is connected
connectDB();

const insertData = async (data) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const { robotData, manipulators, controlModules, floors, basics, controllers, additionals, applications, robotwares } = data;

        const robot = await new Robot(robotData).save({ session });

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
        console.log('Data inserted successfully');
    } catch (err) {
        await session.abortTransaction();
        console.error('Failed to insert data:', err);
    } finally {
        session.endSession();
    }
};

module.exports = { insertData };
