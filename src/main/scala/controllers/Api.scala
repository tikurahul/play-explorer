package controllers

import play.api.mvc.{Action, Controller}

import scala.concurrent.Future

/** The Controller. */
object Api extends Controller {

  val OkResult = Ok("ok")

  def clientById(id: String) = Action.async {
    Future.successful(OkResult)
  }

  def clientInfo = Action.async {
    Future.successful(OkResult)
  }

}
