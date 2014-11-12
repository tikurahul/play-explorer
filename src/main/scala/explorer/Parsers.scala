package explorer

import java.io.File

import play.routes.compiler.{RoutesFileParser, Rule}

/** The exception type. */
class ExplorerException(val message: String = null, val throwable: Throwable = null) extends RuntimeException(message, throwable)

object Parsers {
  /** Parses the routes file. */
  def parseRoutesFile(routesFile: File): List[Rule] = {
    RoutesFileParser.parse(routesFile) match {
      case Left(compilationErrors) => throw new ExplorerException(s"Compilation errors = ${compilationErrors}")
      case Right(rules)            => rules
    }
  }
}
