package views.helpers

import model.{HttpMethod, Endpoint}

object Helpers {

  def className(endpoint: Endpoint): String = {
    endpoint.method match {
      case HttpMethod.Get => "success"
      case HttpMethod.Post | HttpMethod.Put | HttpMethod.Delete  => "danger"
      case HttpMethod.Options => "info"
      case _ => ""
    }
  }

}
