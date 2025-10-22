package com.dotlottiereactnative

fun getBubblingEventTypeConstants(vararg events: String): Map<String, Any> =
        events.associateWith { mapOf("phasedRegistrationNames" to mapOf("bubbled" to it)) }

fun getDirectEventTypeConstants(vararg events: String): Map<String, Any> =
        events.associateWith { mapOf("registrationName" to it) }
