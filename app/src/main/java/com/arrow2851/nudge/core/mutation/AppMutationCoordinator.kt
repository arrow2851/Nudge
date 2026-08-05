package com.arrow2851.nudge.core.mutation

import java.util.UUID
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock

@JvmInline
value class UndoToken(val value: String)

@JvmInline
value class MutationTicket internal constructor(internal val generation: Long)

sealed interface AppFeedbackEvent {
    data object DismissCurrent : AppFeedbackEvent
    data class Message(val text: String) : AppFeedbackEvent
    data class UndoAvailable(
        val text: String,
        val token: UndoToken,
    ) : AppFeedbackEvent
}

@Singleton
class AppMutationCoordinator @Inject constructor() {
    private data class PendingUndo(
        val token: UndoToken,
        val generation: Long,
        val action: suspend () -> Unit,
    )

    private val mutex = Mutex()
    private var generation = 0L
    private var pendingUndo: PendingUndo? = null
    private val mutableEvents = MutableSharedFlow<AppFeedbackEvent>(extraBufferCapacity = 16)
    val events: SharedFlow<AppFeedbackEvent> = mutableEvents.asSharedFlow()

    suspend fun beginMutation(): MutationTicket {
        val ticket = mutex.withLock {
            generation += 1L
            pendingUndo = null
            MutationTicket(generation)
        }
        mutableEvents.emit(AppFeedbackEvent.DismissCurrent)
        return ticket
    }

    suspend fun registerUndo(
        ticket: MutationTicket,
        message: String,
        action: suspend () -> Unit,
    ): UndoToken? {
        val token = mutex.withLock {
            if (ticket.generation != generation) return@withLock null
            val created = UndoToken(UUID.randomUUID().toString())
            pendingUndo = PendingUndo(
                token = created,
                generation = ticket.generation,
                action = action,
            )
            created
        } ?: return null
        mutableEvents.emit(AppFeedbackEvent.UndoAvailable(message, token))
        return token
    }

    suspend fun showMessage(ticket: MutationTicket, message: String): Boolean {
        val current = mutex.withLock { ticket.generation == generation }
        if (current) mutableEvents.emit(AppFeedbackEvent.Message(message))
        return current
    }

    suspend fun performUndo(token: UndoToken): Boolean {
        val action = mutex.withLock {
            val pending = pendingUndo
            if (pending == null || pending.token != token || pending.generation != generation) {
                null
            } else {
                generation += 1L
                pendingUndo = null
                pending.action
            }
        } ?: return false

        mutableEvents.emit(AppFeedbackEvent.DismissCurrent)
        return runCatching { action() }
            .onSuccess { mutableEvents.emit(AppFeedbackEvent.Message("Undone")) }
            .onFailure {
                mutableEvents.emit(
                    AppFeedbackEvent.Message(it.message ?: "Undo could not be completed"),
                )
            }
            .isSuccess
    }

    suspend fun invalidateUndo() {
        beginMutation()
    }
}
