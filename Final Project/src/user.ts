import { LevelDb } from './leveldb'
const WriteStream = require('level-ws');
const bcrypt = require('bcrypt');

export class User {
  public username: string
  public email: string
  private password: string = ""

  constructor(username: string, email: string, password: string, passwordHashed: boolean = false) {
    this.username = username
    this.email = email

    if (!passwordHashed) {
      this.setPassword(password)
    } else this.password = password
  }

  static fromDb(username: string, value: any): User {
    const [password, email] = value.split(":")
    return new User(username, email, password)
  }

  public setPassword(toSet: string): void {
    this.password = toSet
  }

  public getPassword(): string {
    return this.password
  }

  public validatePassword(toValidate: String): boolean {
    console.log(""+toValidate + " "+ this.password )

    return toValidate === this.password;

  }


}

export class UserHandler {
  public db: any

  constructor(path: string) {
    this.db = LevelDb.open(path)
  }

  public confirmPassword(tocompare1: String,tocompare2: String): boolean {
    return tocompare1 === tocompare2;
  }

  public get(username: string, callback: (err: Error | null, result?: User) => void) {
    this.db.get(`user:${username}`, function (err: Error, data: any) {
      if (err) callback(err)
      else if (data === undefined) callback(null, data)


      callback(null, User.fromDb(username, data))


    })
  }

  public save(user: User, callback: (err: Error | null) => void) {
    console.log("creation")
    let username = "" + user.username;
    let email = "" + user.email;
    let password = "" + user.getPassword();
    console.log("creation" + " " + username+ " " + email + " " + password)
    this.db.put(`user:${username}`, `${password}:${email}`, (err: Error | null) => {
      callback(err)
    })

  }

   public delete(username: string, callback: (err: Error | null) => void) {
    this.db.del(`user:${username}`, (err: Error | null) => {
      callback(err)
    })
  }


}
