package play.router

import java.io.File

import org.apache.commons.io.FileUtils
import play.router.RoutesCompiler.{RouteFileParser, RoutesCompilationError, Rule, Route}

/** Having to use the package play.router because RouteFileParser is package protected. :(
  * For information on the styntax tree produced by the Play compiler, the best reference I found is at
  * https://github.com/playframework/playframework/blob/master/framework/src/routes-compiler/src/test/scala/play/routes/compiler/RoutesFileParserSpec.scala
  * */
object Parsers {
  /** Parses the routes file. */

  /** A lot of this code has been lifted from RoutesCompiler.scala#296 */
  def parseRoutesFile(routesFile: File): List[Route] = {
    val parser = new RouteFileParser
    val file = routesFile.getAbsoluteFile
    val content = FileUtils.readFileToString(file)
    val parseResult: parser.ParseResult[List[Rule]] = parser.parse(content)
    parseResult match {
      case parser.Success(rules: List[Route], _) =>
        rules.flatMap {
          case route: Route => Some(route)
          case _ => None
        }
      case parser.NoSuccess(message, in) =>
        throw RoutesCompilationError(file, message, Some(in.pos.line), Some(in.pos.column))
    }
  }
}

