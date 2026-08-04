package com.arrow2851.nudge.core.model

import java.util.UUID
import javax.inject.Inject

interface IdGenerator {
    fun newId(): String
}

class UuidIdGenerator @Inject constructor() : IdGenerator {
    override fun newId(): String = UUID.randomUUID().toString()
}

interface TimeProvider {
    fun nowEpochMillis(): Long
}

class SystemTimeProvider @Inject constructor() : TimeProvider {
    override fun nowEpochMillis(): Long = System.currentTimeMillis()
}

object SortOrders {
    const val Gap: Long = 1_024L

    fun initial(index: Int): Long = index.toLong() * Gap

    fun after(current: Long): Long = current + Gap

    fun between(before: Long, after: Long): Long? {
        if (after - before <= 1L) return null
        return before + ((after - before) / 2L)
    }
}
