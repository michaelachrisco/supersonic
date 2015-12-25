export default class BaseController {
  constructor(context, location) {
    this.context = context
    this.location = location
  }

  call = () => {
    console.log(this.context, this.location)
  }
}
