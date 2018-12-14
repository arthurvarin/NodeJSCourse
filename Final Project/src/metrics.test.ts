import { expect } from 'chai'
import { Metric, MetricsHandler } from './metrics'
import { LevelDB } from "./leveldb"

const dbPath: string = 'db_test'
var dbMet: MetricsHandler

describe('#get', function () {
  it('should get empty array on non existing group', function () {
    dbMet.get("0", function (err: Error | null, result?: Metric[]) {
      expect(err).to.be.null
      expect(result).to.not.be.undefined
      expect(result).to.be.empty
    })
  })
})

describe('#save', function() {
  const metrics = [new Metric(`${new Date('2013-11-04 14:00 UTC').getTime()}`,12)]

  it('should save data', function(done) {
    dbMet.save("1", metrics, (err: Error | null) => {
      expect(err).to.be.undefined

      dbMet.get("1", (err: Error | null, result?: Metric[]) => {
        expect(result).to.eql(metrics)
        done()
      })
    })
  })

  it('should update data if data already exists', function(done) {
    dbMet.save("1", metrics, (err: Error | null) => {
      expect(err).to.be.undefined

      const secondMetrics = [new Metric(`${new Date('2013-11-04 14:00 UTC').getTime()}`,22)]
      dbMet.save("1", secondMetrics, (err: Error | null) => {
        expect(err).to.be.undefined

        dbMet.get("1", (err: Error | null, result?: Metric[]) => {
          expect(result).to.eql(secondMetrics)
          done()
        })
      })
    })
  })

  })

describe('#delete', function() {
  before(function (done) {
    const metrics = [new Metric(`${new Date('2014-03-16 04:00 UTC').getTime()}`,22)]
    dbMet.save("delete", metrics, (err: Error | null) => {
      done()
    })
  })


  it('should delete data', function(done) {
    dbMet.remove("delete", (err: Error | null) => {
      expect(err).to.be.null
      dbMet.get("delete", (err: Error | null, result?: Metric[]) => {
        expect(result).to.not.be.undefined
        expect(result).to.be.an('array')
        expect(result).to.be.empty
        done()
      })
    })
  })

  it('should not fail if data does not exist', function (done) {
  dbMet.remove("inexistant", (err: Error | null) => {
      expect(err).to.be.null
      done()
    })
  })
  })

describe('Metrics', function () {
  before(function () {
    LevelDB.clear(dbPath)
    dbMet = new MetricsHandler(dbPath)
  })

  after(function () {
    dbMet.db.close()
  })
})
