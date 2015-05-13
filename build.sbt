name := "play-explorer"

version := "1.0.0-SNAPSHOT"

scalaVersion := "2.10.3"

resolvers ++= Seq(
  "Typesafe repository" at "http://repo.typesafe.com/typesafe/releases/"
)

libraryDependencies ++= Seq(
  "com.typesafe.play" %% "play" % "2.3.9",
  "com.typesafe.play" %% "routes-compiler" % "2.3.9",
  "commons-io" % "commons-io" % "2.4"
)
