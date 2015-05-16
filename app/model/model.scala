package model

/** input[type] types. */

trait InputType {
  def `type`: String
}

object Text extends InputType {
  override def `type`: String = "text"
}

object Number extends InputType {
  override def `type`: String = "number"
}

case class Range(min: Number, max: Number) extends InputType {
  override def `type`: String = "range"
}

object File extends InputType {
  override def `type`: String = "file"
}

/** Request parameters. */

trait Parameter {
  def name: String

  def value: String

  def required: Boolean

  def default: Option[String]

  def inputType: InputType
}

case class BasicParameter(
  override val name: String,
  override val value: String,
  override val required: Boolean = false,
  override val default: Option[String] = None,
  override val inputType: InputType = Text) extends Parameter

/** HTTP methods. */

object HttpMethod extends Enumeration {
  val Get = Value("GET")
  val Post = Value("POST")
  val Put = Value("PUT")
  val Delete = Value("DELETE")
  val Options = Value("OPTIONS")
}

/** Path fragments */

trait PathFragment

case class StaticPathFragment(value: String) extends PathFragment

case class DynamicPathFragment(identifier: String, regex: String) extends PathFragment

trait Endpoint {
  def packageName: String

  def controller: String

  def methodName: String

  def method: HttpMethod.Value

  def fragments: Seq[PathFragment]

  def parameters: Seq[Parameter]

  def name = s"$packageName.$controller.$methodName"
}

case class BasicEndpoint(
  override val packageName: String,
  override val controller: String,
  override val methodName: String,
  override val method: HttpMethod.Value = HttpMethod.Get,
  override val fragments: Seq[PathFragment] = Seq.empty[PathFragment],
  override val parameters: Seq[Parameter] = Seq.empty[Parameter]) extends Endpoint

/** Represents a Play Web Application. */
trait Application {
  def baseUrl: String

  def endpoints: Seq[Endpoint]
}

case class BasicApplication(override val baseUrl: String, override val endpoints: Seq[Endpoint]) extends Application