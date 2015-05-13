package utils

/** The explorer exception. */
class EException(val message: String = null, val throwable: Throwable = null) extends RuntimeException(message, throwable)
