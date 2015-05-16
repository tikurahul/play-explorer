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

    val p1 = BasicParameter("param1", "value1", required = false, default = Some("optional1"))
    val p2 = BasicParameter("param2", "value2", required = true)
    val p3 = BasicParameter("param3", "", required = false, default = Some("optional3"))

    val get = BasicEndpoint(packageName, "MainController", "methodA", HttpMethod.Get, Seq(static, dynamic), Seq(p1, p2, p3))
    val post = BasicEndpoint(packageName, "MainController", "methodB", HttpMethod.Post)
    val put = BasicEndpoint(packageName, "MainController", "methodC", HttpMethod.Put)
    val delete = BasicEndpoint(packageName, "MainController", "methodD", HttpMethod.Delete)
    val options = BasicEndpoint(packageName, "MainController", "methodE", HttpMethod.Options)

    val endpoints = Seq(get, post, put, delete, options)
    BasicApplication(baseUrl, endpoints)
  }
}
