#!/usr/bin/env ts-node

import { UserHandler, User } from '../src/user'
import { Metric, MetricsHandler } from '../src/metrics'
var moment = require('moment');

const met = [
  new Metric(`${moment.utc('2013-11-04T14:00').format("X")}`, 12),
  new Metric(`${moment.utc('2013-11-04T14:15').format("X")}`, 14),
  new Metric(`${moment.utc('2013-11-04T14:30').format("X")}`, 16)
]

const db = new MetricsHandler('./db/metrics')

db.save("0", met, (err: Error | null) => {
  if (err) throw err
  console.log('Data populated')
})
db.db.close()
while(db.db.isOpen()){}


const users = [
  new User('ArtVar','arthur@hotmail.fr','test',),
  new User('GregVar','gregoire@hotmail.fr','test2',)
]

const db2 = new UserHandler('./db/users')

users.forEach((u: User) => {
  db2.save(u, function(err: Error | null) {
    if (err) throw err
    console.log('Data populated')
  })
})

db2.db.close()
