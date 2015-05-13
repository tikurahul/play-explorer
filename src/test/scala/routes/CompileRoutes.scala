package routes

import java.io.File

import play.router.Parsers

object CompileRoutes extends App {
  val RoutesFile = new File("src/main/resources/routes")
  val rules = Parsers.parseRoutesFile(RoutesFile)
  rules.foreach(println)
}
