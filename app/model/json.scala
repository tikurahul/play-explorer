package model

import play.api.libs.json._

object JsonHelpers {

  implicit val parameterWriter = new Writes[Parameter] {
    override def writes(p: Parameter): JsValue = {
      Json.obj(
        "name" -> p.name,
        "value" -> p.value,
        "required" -> p.required,
        "default" -> p.default,
        "inputType" -> p.inputType.`type`
      )
    }
  }

  implicit val parametersWriter = new Writes[Iterable[Parameter]] {
    override def writes(parameters: Iterable[Parameter]): JsValue = {
      val jsParameters = for {
        p <- parameters.toSeq
      } yield {
          Json.toJson(p)(parameterWriter)
        }
      JsArray(jsParameters)
    }
  }

  implicit val fragmentWriter = new Writes[PathFragment] {
    override def writes(fragment: PathFragment): JsValue = {
      case StaticPathFragment(value) =>
        Json.obj(
          "type" -> "static",
          "value" -> value
        )
      case DynamicPathFragment(identifier, regex) =>
        Json.obj(
          "type" -> "dynamic",
          "identifier" -> identifier,
          "regex" -> regex
        )
    }
  }

  implicit val fragmentsWriter = new Writes[Iterable[PathFragment]] {
    override def writes(fragments: Iterable[PathFragment]): JsValue = {
      val jsFragments = for {
        fragment <- fragments.toSeq
      } yield {
        Json.toJson(fragment)(fragmentsWriter)
      }
      JsArray(jsFragments)
    }
  }

  implicit val endpointWriter = new Writes[Endpoint] {
    override def writes(endpoint: Endpoint): JsValue = {
      Json.obj(
        "packageName" -> endpoint.packageName,
        "controller" -> endpoint.controller,
        "method" -> endpoint.method.toString,
        "fragments" -> Json.toJson(endpoint.fragments)(fragmentsWriter),
        "parameters" -> Json.toJson(endpoint.parameters)(parametersWriter)
      )
    }
  }

  implicit val endpointsWriter = new Writes[Iterable[Endpoint]] {
    override def writes(endpoints: Iterable[Endpoint]): JsValue = {
      val jsEndpoints = for {
        endpoint <- endpoints.toSeq
      } yield {
        Json.toJson(endpoint)(endpointsWriter)
      }
      JsArray(jsEndpoints)
    }
  }

  implicit val applicationWriter = new Writes[Application] {
    override def writes(app: Application): JsValue = {
      Json.obj(
        "baseUrl" -> app.baseUrl,
        "endpoints" -> Json.toJson(app.endpoints)(endpointsWriter)
      )
    }
  }

}