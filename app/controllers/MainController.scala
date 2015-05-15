package controllers

import model.{BasicApplication, HttpMethod, BasicEndpoint, Application}
import play.api.mvc._

object MainController extends Controller {

  val baseUrl = "http://localhost:9000"
  val packageName = "com.rahulrav"

  def explorer = Action {
    val application = testApplication()
    Ok(views.html.main.render(application))
  }

  /** Test setup for the explorer. */
  def testApplication(): Application = {
    val get = BasicEndpoint(packageName, "Method A")
    val post = BasicEndpoint(packageName, "Method B", HttpMethod.Post)
    val put = BasicEndpoint(packageName, "Method C", HttpMethod.Put)
    val delete = BasicEndpoint(packageName, "Method D", HttpMethod.Delete)
    val options = BasicEndpoint(packageName, "Method E", HttpMethod.Options)

    val endpoints = Seq(get, post, put, delete, options)
    BasicApplication(baseUrl, endpoints)
  }
}
