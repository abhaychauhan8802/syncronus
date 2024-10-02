import bcrypt from "bcrypt";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, userId) => {
  const token = jwt.sign({ email, userId }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });

  return token;
};

export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const userData = await User.findOne({ email });

    if (userData) {
      return res.status(400).json({ error: "User already exists" });
    }

    const user = await User.create({ email, password });

    return res
      .status(201)
      .cookie("jwt", createToken(email, user._id), {
        maxAge,
        httpOnly: true,
      })
      .json({
        user: {
          id: user._id,
          email: user.email,
          profileSetup: user.profileSetup,
        },
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const userData = await User.findOne({ email });

    if (!userData) {
      return res.status(404).json({ error: "User not exists" });
    }

    const auth = await bcrypt.compare(password, userData.password);

    if (!auth) {
      return res.status(400).send("Password is incorrect.");
    }

    res.cookie("jwt", createToken(email, userData._id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });

    return res.status(200).json({
      user: {
        id: userData.id,
        email: userData.email,
        profileSetup: userData.profileSetup,
        firstName: userData.firstName,
        lastName: userData.lastName,
        image: userData.image,
        color: userData.color,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

export const getUserInfo = async (req, res) => {
  try {
    const { userId } = req;

    const userData = await User.findById(userId);

    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      user: {
        id: userData.id,
        email: userData.email,
        profileSetup: userData.profileSetup,
        firstName: userData.firstName,
        lastName: userData.lastName,
        image: userData.image,
        color: userData.color,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { userId } = req;

    const { firstName, lastName, color } = req.body;

    if (!firstName || !lastName || !color) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const userData = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, color },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      user: {
        id: userData.id,
        email: userData.email,
        profileSetup: userData.profileSetup,
        firstName: userData.firstName,
        lastName: userData.lastName,
        image: userData.image,
        color: userData.color,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};
