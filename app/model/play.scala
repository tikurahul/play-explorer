package model

import java.io.File

import play.api.Play
import play.router.{DynamicPart, Parsers, StaticPart}

import scala.util.Try

/** Transforms the play Routes AST -> a representation of a model that we can use internally. */
object Transforer {

  val DefaultEndpoint = "http://localhost:9000"

  def <<<(routesFile: File): Try[Application] = {
    Try {
      val baseUrl = Play.maybeApplication.fold(DefaultEndpoint) {
        app => app.configuration.getString("default.endpoint").getOrElse(DefaultEndpoint)
      }

      val routes = Parsers.parseRoutesFile(routesFile)
      val endpoints: List[Endpoint] = for {
        route <- routes
      } yield {
        // http verb
        val verb = HttpMethod.withName(route.verb.toString())
        val pathPattern = route.path
        // path fragments
        val pathFragments: Seq[PathFragment] = pathPattern.parts.flatMap {
          case static: StaticPart => Some(StaticPathFragment(static.value))
          case dynamic: DynamicPart => Some(DynamicPathFragment(dynamic.name, dynamic.constraint))
          case _ => None
        }
        // package name
        val packageName = route.call.packageName
        // controller name
        val controllerName = route.call.controller
        // method name
        val methodName = route.call.method
        // parameters
        val parameters = if (route.call.parameters.isDefined) {
          val routeParameters = route.call.parameters.get
          for {
            parameter <- routeParameters
          } yield {
            val name = parameter.name
            val default = parameter.default
            val fixed = parameter.fixed
            BasicParameter(name, fixed.getOrElse(""), required = false, default = default)
          }
        } else {
          Seq.empty[Parameter]
        }
        BasicEndpoint(packageName, controllerName, methodName, method = verb, fragments = pathFragments, parameters = parameters)
      }
      BasicApplication(baseUrl, endpoints)
    }
  }

  def transform(routesFile: File): Try[Application] = Transforer.<<<(routesFile)

}
