const _User = require("../models/user.model");
const _Note = require("../models/note.model");
const md5 = require("md5");

module.exports = {
  create: async ({
    title,
    body,
    permalink,
    tags,
    password,
    create_at,
    _id,
  }) => {
    const user = await _User.findOne({ _id: _id });

    const note = await _Note.create({
      username: user.username,
      title: title,
      body: body,
      permalink: permalink,
      tags: tags.split(",").map((e) => e.trim()),
      password: password.length > 0 ? md5(password) : "",
      create_at: create_at,
    });

    return {
      code: 200,
      message: "Note created successfully",
      elements: {
        note: {
          title: note.title,
          username: note.username,
          body: note.body,
          permalink: note.permalink,
          tags: note.tags,
          view: note.view,
          create_at: note.created_at,
          createAt: note.createdAt,
          updatedAt: note.updatedAt,
        },
      },
    };
  },
  delete: async ({ permalink, password, roles, _id }) => {
    const user = await _User.findOne({
      _id: _id,
    });
    if (roles.includes("admin") || roles.includes("root")) {
      const note = await _Note.findOneAndDelete({
        permalink: permalink,
      });
      if (!!note)
        return {
          code: 200,
          message: "Deleted note successfully",
        };
      else
        return {
          code: 401,
          message: "Cannot find note",
        };
    }

    if (!!user) {
      const note = await _Note.findOneAndDelete({
        username: user.username,
        permalink: permalink,
        password: password.length > 0 ? md5(password) : "",
      });
      if (!!note)
        return {
          code: 200,
          message: "Deleted note successfully",
        };
      else
        return {
          code: 401,
          message: "Cannot delete, try again",
          elements: {
            username: user.username,
          },
        };
    } else
      return {
        code: 401,
        message: "Not have permission to delete this note",
      };
  },
  edit: async ({ permalink, title, body, tags, newPassword, _id }) => {
    const user = await _User.findOne({
      _id: _id,
    });

    const note = await _Note.findOneAndUpdate(
      {
        permalink: permalink,
        username: user.username,
      },
      {
        title: title,
        body: body,
        tags: tags,
        password: newPassword.length > 0 ? md5(newPassword) : "",
      }
    );

    if (note) {
      return {
        code: 200,
        message: "Note updated successfully",
        elements: {
          note: note,
        },
      };
    } else {
      return {
        code: 401,
        message: "Wrong password",
      };
    }
  },
  get: async ({ permalink, password }) => {
    const note = await _Note.findOne({
      permalink: permalink,
      password: password.length > 0 ? md5(password) : "",
    });
    if (!!note) {
      note.$inc("view", 1);
      await note.save();
      return {
        code: 200,
        elements: {
          note: {
            username: note.username,
            title: note.title,
            body: note.body,
            permalink: note.permalink,
            tags: note.tags,
            created_at: note.created_at,
            view: note.view,
          },
        },
      };
    } else {
      try {
        const note = await _Note.findOne({
          permalink: permalink,
        });
        return {
          code: 401,
          message: "Password is incorrect",
          elements: {
            note: {
              username: note.username,
              title: note.title,
              created_at: note.created_at,
              view: note.view,
            },
          },
        };
      } catch (e) {
        return {
          code: 404,
          message: "Note does not exist",
        };
      }
    }
  },
  getAll: async ({ _id, page, limit }) => {
    let _page = parseInt(page);
    let _limit = parseInt(limit);

    if (_page < 1) _page = 1;

    const user = await _User.findOne({ _id: _id });

    const totalNotes = await _Note.count({
      username: user.username,
    });

    const notes = await _Note
      .find({ username: user.username })
      // .skip((_page - 1) * _limit)
      // .limit(_limit)
      .then((data) => {
        return data
          .sort((x, y) => y.created_at - x.created_at)
          .splice(_page - 1, _limit);
      });
    return {
      code: 200,
      elements: {
        totalNotes,
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
};
