package play.router

import java.io.File

import org.apache.commons.io.FileUtils
import play.router.RoutesCompiler.{RouteFileParser, RoutesCompilationError, Rule}

/** Having to use the package play.router because RouteFileParser is package protected. :( */
object Parsers {
  /** Parses the routes file. */

  /** A lot of this code has been lifted from RoutesCompiler.scala#296 */
  def parseRoutesFile(routesFile: File): List[Rule] = {
    val parser = new RouteFileParser
    val file = routesFile.getAbsoluteFile
    val content = FileUtils.readFileToString(file)
    val parseResult: parser.ParseResult[List[Rule]] = parser.parse(content)
    parseResult match {
      case parser.Success(rules: List[Rule], _) => rules
      case parser.NoSuccess(message, in) =>
        throw RoutesCompilationError(file, message, Some(in.pos.line), Some(in.pos.column))
    }
  }
}
