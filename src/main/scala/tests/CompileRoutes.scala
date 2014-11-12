package tests

import java.io.File

import explorer.Parsers

object CompileRoutes extends App {
  val RoutesFile = new File("src/main/resources/routes")
  val rules = Parsers.parseRoutesFile(RoutesFile)
  rules foreach println
}
