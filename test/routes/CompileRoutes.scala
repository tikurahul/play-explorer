package routes

import java.io.File

import model.Transforer
import play.router.Parsers

object CompileRoutes extends App {
   val RoutesFile = new File("app/resources/routes")

   // print rules
   val rules = Parsers.parseRoutesFile(RoutesFile)
   rules.foreach(println)

   // print application
   val application = Transforer <<< RoutesFile
   application.map(println)
 }
