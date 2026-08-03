package com.arrow2851.nudge.core.database

import androidx.room.TypeConverter
import com.arrow2851.nudge.core.model.CompletionGrade
import com.arrow2851.nudge.core.model.CompletionSource
import com.arrow2851.nudge.core.model.RecurrenceType
import com.arrow2851.nudge.core.model.RecurrenceUnit
import com.arrow2851.nudge.core.model.ScheduleBasis
import com.arrow2851.nudge.core.model.TaskStatus

class DatabaseConverters {
    @TypeConverter
    fun taskStatusToString(value: TaskStatus): String = value.name

    @TypeConverter
    fun stringToTaskStatus(value: String): TaskStatus = TaskStatus.valueOf(value)

    @TypeConverter
    fun recurrenceTypeToString(value: RecurrenceType): String = value.name

    @TypeConverter
    fun stringToRecurrenceType(value: String): RecurrenceType = RecurrenceType.valueOf(value)

    @TypeConverter
    fun recurrenceUnitToString(value: RecurrenceUnit?): String? = value?.name

    @TypeConverter
    fun stringToRecurrenceUnit(value: String?): RecurrenceUnit? = value?.let(RecurrenceUnit::valueOf)

    @TypeConverter
    fun scheduleBasisToString(value: ScheduleBasis): String = value.name

    @TypeConverter
    fun stringToScheduleBasis(value: String): ScheduleBasis = ScheduleBasis.valueOf(value)

    @TypeConverter
    fun completionGradeToString(value: CompletionGrade): String = value.name

    @TypeConverter
    fun stringToCompletionGrade(value: String): CompletionGrade = CompletionGrade.valueOf(value)

    @TypeConverter
    fun completionSourceToString(value: CompletionSource): String = value.name

    @TypeConverter
    fun stringToCompletionSource(value: String): CompletionSource = CompletionSource.valueOf(value)

    @TypeConverter
    fun daysOfWeekToString(value: Set<Int>): String = value.sorted().joinToString(",")

    @TypeConverter
    fun stringToDaysOfWeek(value: String): Set<Int> = value
        .takeIf(String::isNotBlank)
        ?.split(',')
        ?.map(String::toInt)
        ?.toSet()
        ?: emptySet()
}
