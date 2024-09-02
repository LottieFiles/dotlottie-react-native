package com.dotlottiereactnative

fun getEventTypeConstants(vararg list: String): Map<String, Any> {
  return list.associateWith { mapOf("phasedRegistrationNames" to mapOf("bubbled" to it)) }
}
