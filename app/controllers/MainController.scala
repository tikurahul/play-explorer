package controllers

import java.io.File

import model._
import play.api.mvc._

import scala.util.{Failure, Success, Try}

object MainController extends Controller {

  val baseUrl = "http://localhost:9000"
  val packageName = "com.rahulrav"

  def explorer = Action {
    val application = compileRoutesFile()
    application match {
      case Success(app) => Ok(views.html.main.render(app))
      case Failure(exception) =>
        // allow play to handle exception for now
        throw exception
    }
  }

  def compileRoutesFile(): Try[Application] = {
    val RoutesFile = new File("app/resources/routes")
    Transformer <<< RoutesFile
  }
}
