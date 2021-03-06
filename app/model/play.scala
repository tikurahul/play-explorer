package model

import java.io.File

import play.api.Play
import play.router.{DynamicPart, Parsers, StaticPart}

import scala.util.Try

/** Transforms the play Routes AST -> a representation of a model that we can use internally. */
object Transformer {

  val DefaultEndpoint = "http://localhost:9000"

  def <<<(routesFile: File): Try[Application] = {
    Try {
      val baseUrl = Play.maybeApplication.fold(DefaultEndpoint) {
        app => app.configuration.getString("default.explorer.endpoint").getOrElse(DefaultEndpoint)
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
          case static: StaticPart =>
            // remove the terminating "/" character
            val value = if (static.value.endsWith("/")) static.value.substring(0, static.value.lastIndexOf('/')) else static.value
            Some(StaticPathFragment(value))
          case dynamic: DynamicPart =>
            Some(DynamicPathFragment(dynamic.name, dynamic.constraint))
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
            // param ?= "json" gives a value of "\"json\""
            // so we have to remove the quotes surrounding the value
            // the same happens for both fixed and default values
            val default = parameter.default.map(removeQuotes)
            val fixed = parameter.fixed.map(removeQuotes)
            BasicParameter(name, fixed.getOrElse(""), required = false, default = default)
          }
        } else {
          Seq.empty[Parameter]
        }

        val dynamicFragmentNames = pathFragments.flatMap {
          case dynamic: DynamicPathFragment => Some(dynamic.identifier)
          case _ => None
        }.toSet
        // remove parameters for matching fragments
        val filteredParameters = parameters.filterNot {
          parameter => dynamicFragmentNames.contains(parameter.name)
        }

        BasicEndpoint(packageName, controllerName, methodName, method = verb, fragments = pathFragments, parameters = filteredParameters)
      }
      BasicApplication(baseUrl, endpoints)
    }
  }

  def transform(routesFile: File): Try[Application] = Transformer.<<<(routesFile)

  /** This is to work around the quotes surrounding strings in parameter values inside the routes file. */
  private[Transformer] def removeQuotes(in: String): String = {
    if (in.startsWith("\"")) in.substring(1, in.lastIndexOf("\"")) else in
  }
}
