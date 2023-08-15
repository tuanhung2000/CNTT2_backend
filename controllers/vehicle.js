require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const user = require("../models/user");
const account = require("../models/account");
const vehicle = require("../models/vehicle");
const vehicleList = require("../models/vehicleList");
const makes = require("../models/makes");
const models = require("../models/models");
const { getAccess } = require("../config/getAccess");
const vehicleSpec = require("../models/vehicleSpec");

const getAllVehicle = async (req, res) => {
  try {
    const Vehicle = await vehicle.find({});
    return res.status(200).send({ Vehicle });
  } catch (error) {
    return res.status(500).send({
      msg: "Internal Server Error",
    });
  }
};

const getVehicle = async (req, res) => {
  try {
    const Vehicle = await vehicle.findOne({ _id: req.params.vehicleID });
    const VehicleSpec = await vehicleSpec.findOne({
      vehicleID: req.params.vehicleID,
    });

    if (!Vehicle) {
      return res.status(401).send({
        msg: "Not found vehicle",
      });
    }

    return res.status(200).send({ Vehicle, VehicleSpec });
  } catch (error) {
    return res.status(500).send({
      msg: "Internal Server Error",
    });
  }
};

//create or regist new vehicle
const createVehicle = async (req, res) => {
  try {
    const {
      image,
      licensePlate,
      price,
      extraFee,
      type,
      make,
      model,
      feature,
      description,

      powers,
      fuelType,
      insurance,
      consumption,
      maxSpeed,
    } = req.body;
    const username = getAccess(req.headers["authorization"]);
    if (!username) {
      return res.status(403).send({
        msg: "Authentication!!!",
      });
    }
    console.log(req.body)
    console.log('1')
    const User = await user.findOne({ username: username });

    if (!User || User.role == "client") {
      return res.status(401).send({
        msg: "Not allowed",
      });
    }
    console.log('2')

    const existedVehicle = await vehicle.findOne({
      licensePlate: licensePlate,
    });
    if (existedVehicle) {
      return res.status(401).send({
        msg: "Vehicle already exist!!!",
      });
    }
    console.log('3')

    const onlyVehicle = await vehicle.findOne({
      driverID: User._id,
      type: "Have a Driver",
    });
    console.log('4')

    if (type == "Have a Driver" && onlyVehicle) {
      return res.status(401).send({
        msg: "Driver already have own vehicle",
      });
    }
    console.log('5')

    const Make = await makes.findOne({
      make: make,
    });
    console.log('6')



    const highestMakeID = await makes.find({}).sort({ ID: -1 }).limit(1);

    if (!Make) {
      await makes.create({
        ID: +highestMakeID + 1,
        make: make,
      });
      await models.create({
        model: model,
        makeID: +highestMakeID + 1,
      });
    }
    console.log('8')
    const Model = await models.findOne({
      makeID: Make.ID,
    });

    console.log('7', Model)
    if (Make && !Model) { 
      await model.create({
        model: model,
      });
    }
    console.log('9')

    const Vehicle = await vehicle.create({
      driverID: User._id,
      image: image,
      licensePlate: licensePlate,
      price: price,
      extraFee: extraFee,
      rate: "0.0",
      type: type,
      model: model,
      feature: feature,
      description: description,
    });
    console.log('10')

    const VehicleSpec = await vehicleSpec.create({
      driverID: User._id,
      vehicleID: Vehicle._id,
      powers: powers,
      fuelType: fuelType,
      insurance: insurance,
      consumption: consumption,
      maxSpeed: maxSpeed,
    });
    console.log('11')

    return res
      .status(200)
      .send({ msg: "Vehicle registration successful", Vehicle, VehicleSpec });
  } catch (error) {
    return res.status(500).send({
      msg: "Internal Server Error",
    });
  }
};

const editVehicle = async (req, res) => {
  try {
    const { image, price, extraFee, feature, description } = req.body;

    const username = getAccess(req.headers["authorization"]);

    if (!username) {
      return res.status(403).send({
        msg: "Authentication!!!",
      });
    }

    const User = await user.findOne({
      username: username,
    });

    if (!User || User.role == "client") {
      return res.status(401).send({
        msg: "Not allowed",
      });
    }
    const checkedVehicle = await vehicle.findById({
      _id: req.params.vehicleID,
    });

    if (!checkedVehicle) {
      return res.status(401).send({
        msg: "Not found vehicle",
      });
    }

    const editedVehicle = await vehicle.findByIdAndUpdate(
      {
        _id: req.params.vehicleID,
      },
      {
        image: image,
        price: price,
        extraFee: extraFee,
        feature: feature,
        description: description,
      }
    );

    return res
      .status(200)
      .send({ msg: "Vehicle update successful", editedVehicle });
  } catch (error) {
    return res.status(500).send({
      msg: "Internal Server Error",
    });
  }
};

const deleteVehicle = async (req, res) => {
  try {
    const username = getAccess(req.headers["authorization"]);

    if (!username) {
      return res.status(403).send({
        msg: "Authentication!!!",
      });
    }
    const User = await user.findOne({
      username: username,
    });

    if (!User || User.role == "client") {
      return res.status(401).send({
        msg: "Not allowed",
      });
    }

    const onwedVehicle = await vehicle.findOne({
      _id: req.params.vehicleID,
    });

    if (!onwedVehicle) {
      return res.status(401).send({
        msg: "Not found vehicle",
      });
    }

    await vehicle.findByIdAndDelete({
      _id: req.params.vehicleID,
    });

    return res
      .status(200)
      .send({ msg: "Delete vehicle successful", onwedVehicle });
  } catch (error) {
    return res.status(500).send({
      msg: "Internal Server Error",
    });
  }
};

const createVehicleList = async (req, res) => {
  try {
    console.log(req.body);
    const { year, make, model, category } = req.body;

    const Vehicle_List = await vehicleList.create({
      year: "eaa",
      make: "aaa",
      model: "aaa",
      category: "aaad",
    });

    return res
      .status(200)
      .send({ msg: "Vehicle registration successful", Vehicle_List });
  } catch (error) {
    return res.status(500).send({
      msg: "Internal Server Error",
    });
  }
};

const queryVehicle = async (req, res) => {
  try {
    const { make } = req.body;
    const MakesDB = await makes.find({});

    if (!make) {
      return res.status(200).send({
        makes: MakesDB,
      });
    }
    if (make) {
      const CurrentMake = await makes.find({ make: make });
      const ModelsDB = await models.find({ makeID: parseInt(CurrentMake.ID) });
      return res.status(200).send({
        makes: MakesDB,
        models: ModelsDB,
      });
    }
    return res.status(200).send({
      makes: MakesDB,
    });
  } catch (e) {
    return res.status(500).send({
      msg: "Internal Server Error",
    });
  }
};

module.exports = {
  getAllVehicle,
  getVehicle,
  createVehicle,
  editVehicle,
  deleteVehicle,
  createVehicleList,
  queryVehicle,
};
