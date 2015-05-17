package routes

import java.io.File

import model.Transforer
import play.api.libs.json.Json
import play.router.Parsers

import model.JsonHelpers.applicationWriter

object CompileRoutes extends App {
   val RoutesFile = new File("app/resources/routes")

   // print rules
   val rules = Parsers.parseRoutesFile(RoutesFile)
   rules.foreach(println)

   // print application
   val application = Transforer <<< RoutesFile
   application.map(println)

   // print some json
   application.map {
     app => println(Json.prettyPrint(Json.toJson(app)))
   }
 }
