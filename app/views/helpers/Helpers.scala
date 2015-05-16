package views.helpers

import model.{Endpoint, HttpMethod}

object Helpers {

  def className(endpoint: Endpoint): String = {
    endpoint.method match {
      case HttpMethod.Get => "success"
      case HttpMethod.Post | HttpMethod.Put | HttpMethod.Delete => "danger"
      case HttpMethod.Options => "info"
      case _ => ""
    }
  }

  def id(endpoint: Endpoint): String = {
    val seperator = "."
    // method refers to the HTTP method
    // methodName refers to the method name on the controller
    Seq(endpoint.method, endpoint.packageName, endpoint.controller, endpoint.methodName).mkString(seperator)
  }
}
