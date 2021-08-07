const fs = require("fs");
const crypto = require("crypto");
const util = require("util");
const scrypt = util.promisify(crypto.scrypt);
const Repository = require("./repository");

class UsersRepository extends Repository {
  // creates a new user with the given attributes
  async create(attrs) {
    attrs.id = this.randomId();

    const salt = crypto.randomBytes(8).toString("hex");
    const buf = await scrypt(attrs.password, salt, 64);

    const records = await this.getAll();
    const record = {
      ...attrs,
      password: `${buf.toString("hex")}.${salt}`,
    };
    records.push(record);

    await this.writeAll(records);

    return record;
  }

  // compare passwords on sign in
  async comparePasswords(saved, supplied) {
    //Saved -> hashedPassword . salt
    //Supplied -> password given to us at sign in
    const [hashed, salt] = saved.split(".");
    const hashedSuppliedBuf = await scrypt(supplied, salt, 64);
    return hashed === hashedSuppliedBuf.toString("hex");
  }
}

// 2 ways of exporting

// // #1 -- This was we export a whole class and make a new instance of it in another file
// module.exports = UsersRepository

// #2 -- This way we only make 1 instance of the class and use the same instance in different files
module.exports = new UsersRepository("users.json");
