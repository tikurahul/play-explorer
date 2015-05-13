package model

/** input[type] types. */

trait InputType

object Text extends InputType

object Number extends InputType

case class Range(min: Number, max: Number) extends InputType

object File extends InputType


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

trait HttpMethod

object GET extends HttpMethod

object POST extends HttpMethod

object PUT extends HttpMethod

object DELETE extends HttpMethod

/** Path fragments */

trait PathFragment

case class StaticPathFragment(value: String) extends PathFragment

case class DynamicPathFragment(identifier: String) extends PathFragment

trait Endpoint {
  def method: HttpMethod

  def fragments: Seq[PathFragment]

  def parameters: Seq[Parameter]
}

/** Represents a Play Web Application. */
trait Application {
  def baseUrl: String
  def endpoints: Seq[Endpoint]
}
