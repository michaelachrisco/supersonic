import chai from 'chai'
import sinon from 'sinon'
import sinonchai from 'sinon-chai'

let { assert, expect } = chai

chai.should()
chai.use(sinonchai)

export {
  chai,
  sinon,
  sinonchai,
  assert,
  expect
}
