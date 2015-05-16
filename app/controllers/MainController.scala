package controllers

import model._
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

    val static = StaticPathFragment("test")
    val dynamic = DynamicPathFragment("id", ".*")

    val get = BasicEndpoint(packageName, "methodA", HttpMethod.Get, Seq(static, dynamic))
    val post = BasicEndpoint(packageName, "methodB", HttpMethod.Post)
    val put = BasicEndpoint(packageName, "methodC", HttpMethod.Put)
    val delete = BasicEndpoint(packageName, "methodD", HttpMethod.Delete)
    val options = BasicEndpoint(packageName, "methodE", HttpMethod.Options)

    val endpoints = Seq(get, post, put, delete, options)
    BasicApplication(baseUrl, endpoints)
  }
}
