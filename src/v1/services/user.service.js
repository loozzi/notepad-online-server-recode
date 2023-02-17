const _User = require("../models/user.model");
const _Note = require("../models/note.model");
const md5 = require("md5");
const generateToken = require("../utils/generateToken");

const checkUserExists = async ({ email, username }) => {
  const user = await _User.findOne({ $or: [{ email }, { username }] });

  return user;
};

module.exports = {
  login: async ({ username, password }) => {
    const user = await _User.findOne({
      $or: [
        { email: username, password: md5(password) },
        { username: username, password: md5(password) },
      ],
    });

    if (!!user) {
      const { accessToken, refreshToken } = await generateToken(user);

      return {
        code: 200,
        message: "Login successful",
        elements: {
          accessToken: accessToken,
          refreshToken: refreshToken,
          user: {
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            total: user.total,
            roles: user.roles,
          },
        },
      };
    } else {
      return {
        code: 401,
        message: "Invalid username or password",
      };
    }
  },
  register: async ({ email, username, password }) => {
    email = email.trim();
    username = username.trim();
    const userCheck = await checkUserExists({ email, username });
    if (!!userCheck)
      return {
        code: 400,
        message: "User already exists",
      };

    const user = await _User.create({
      email: email,
      username: username,
      password: md5(password),
    });

    return {
      code: 200,
      message: "User created",
      elements: {
        user: {
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          total: user.total,
          roles: user.roles,
        },
      },
    };
  },
  changePassword: async ({ _id, oldPassword, newPassword }) => {
    const data = await _User.findOneAndUpdate(
      {
        _id: _id,
        password: md5(oldPassword),
      },
      {
        password: md5(newPassword),
      }
    );
    if (!!data) {
      return {
        code: 200,
        message: "Password changed",
      };
    } else {
      return {
        code: 400,
        message: "Password is wrong",
      };
    }
  },
  changeAvatar: async ({ _id, newAvatar }) => {
    const data = await _User.findOneAndUpdate(
      {
        _id: _id,
      },
      {
        avatar: newAvatar,
      }
    );

    if (!!data) {
      return {
        code: 200,
        message: "Avatar changed",
      };
    } else {
      return {
        code: 500,
        message: "Internal Server Error",
      };
    }
  },
  changeEmail: async ({ _id, newEmail }) => {
    const data = await _User.findOneAndUpdate(
      {
        _id: _id,
      },
      {
        email: newEmail,
      }
    );

    if (!!data) {
      return {
        code: 200,
        message: "Email changed",
      };
    } else {
      return {
        code: 501,
        message: "Internal Server Error",
      };
    }
  },
  delete: async ({ _id }) => {
    try {
      await _User.findOneAndDelete({
        _id: _id,
      });
      return {
        code: 200,
        message: "User deleted",
      };
    } catch (err) {
      return {
        code: 400,
        message: "Cannot delete user",
      };
    }
  },
  getAll: async ({ page, limit }) => {
    let _page = parseInt(page);
    const _limit = parseInt(limit);

    if (_page < 1) _page = 1;

    const totalUsers = await _User.count({});

    const accounts = await _User
      .find({})
      .skip((_page - 1) * _limit)
      .limit(_limit);

    return {
      code: 200,
      elements: {
        totalUsers,
        users: accounts.map((user) => ({
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          total: user.total,
          roles: user.roles,
        })),
      },
    };
  },
  getOne: async ({ username }) => {
    const user = await _User.findOne({ username });
    const notes = await _Note.find({
      username,
    });
    return {
      code: 200,
      elements: {
        user: {
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          total: user.total,
          roles: user.roles,
        },
        notes: notes.map((note) => ({
          username: note.username,
          title: note.title,
          body: note.password.length === 0 ? note.body : "Locked",
          permalink: note.permalink,
          tags: note.password.length === 0 ? note.tags.join(", ") : "Locked",
          created_at: note.created_at,
          view: note.view,
        })),
      },
    };
  },
  me: async ({ _id }) => {
    const user = await _User.findById(_id);
    return {
      code: 200,
      elements: {
        user: {
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          total: user.total,
          roles: user.roles,
        },
      },
    };
  },
};
