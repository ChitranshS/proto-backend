const mongoose = require('mongoose');

const robotSchema =  new mongoose.Schema({
    Id: String,
    name: String,
    variant: { type: String, required: false }
  });
  
  const manipulatorSchema = new mongoose.Schema({
   Id: { type: String, required: true },
    name: { type: String, required: true },
    optionInfo: { type: String, required: false },

    // Reference to the Robot collection
    robot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Robot',
        required: true
    },
    
    // Arbitrary fields
    additionalFields: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, { strict: false });
  
  const controlModuleSchema = new mongoose.Schema({
    Id: { type: String, required: true },
    name: { type: String, required: true },
    optionInfo: { type: String, required: false },

    // Reference to the Robot collection
    robot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Robot',
        required: true
    },
    
    // Arbitrary fields
    additionalFields: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, { strict: false });
  
  const robotwareSchema = new mongoose.Schema({
    Id: { type: String, required: true },
    name: { type: String, required: true },
    optionInfo: { type: String, required: false },

    // Reference to the Robot collection
    robot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Robot',
        required: true
    },
    
    // Arbitrary fields
    additionalFields: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, { strict: false });
  
  const applicationSchema = new mongoose.Schema({
    Id: { type: String, required: true },
    name: { type: String, required: true },
    optionInfo: { type: String, required: false },

    // Reference to the Robot collection
    robot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Robot',
        required: true
    },
    
    // Arbitrary fields
    additionalFields: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, { strict: false });
  
  const additionalSchema = new mongoose.Schema({
    Id: { type: String, required: true },
    name: { type: String, required: true },
    optionInfo: { type: String, required: false },

    // Reference to the Robot collection
    robot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Robot',
        required: true
    },
    
    // Arbitrary fields
    additionalFields: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, { strict: false });

  const controllerSchema = new mongoose.Schema({
    Id: { type: String, required: true },
    name: { type: String, required: true },
    optionInfo: { type: String, required: false },

    // Reference to the Robot collection
    robot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Robot',
        required: true
    },
    
    // Arbitrary fields
    additionalFields: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, { strict: false });

  const basicSchema = new mongoose.Schema({
    Id: { type: String, required: true },
    name: { type: String, required: true },
    optionInfo: { type: String, required: false },

    // Reference to the Robot collection
    robot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Robot',
        required: true
    },
    
    // Arbitrary fields
    additionalFields: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, { strict: false });

  const floorSchema = new mongoose.Schema({
    Id: { type: String, required: true },
    name: { type: String, required: true },
    optionInfo: { type: String, required: false },

    // Reference to the Robot collection
    robot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Robot',
        required: true
    },
    
    // Arbitrary fields
    additionalFields: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, { strict: false });


const Robot = mongoose.model('Robot', robotSchema);
const Manipulator = mongoose.model('Manipulator', manipulatorSchema);
const ControlModule = mongoose.model('ControlModule', controlModuleSchema);
const Floor = mongoose.model('Floor', floorSchema);
const Basic = mongoose.model('Basic', basicSchema);
const Controller = mongoose.model('Controller', controllerSchema);
const Additional = mongoose.model('Additional', additionalSchema);
const Application = mongoose.model('Application', applicationSchema);
const Robotware = mongoose.model('Robotware', robotwareSchema);


module.exports = {
    Robot,
    Manipulator,
    ControlModule,
    Floor,
    Basic,
    Controller,
    Additional,
    Application,
    Robotware
}

