export default class BaseModel {
  constructor(attributes) {
    attributes.each((key, value) => {
      this[key] = value
    })
  }
}
