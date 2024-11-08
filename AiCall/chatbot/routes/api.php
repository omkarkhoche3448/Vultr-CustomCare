<?php

use App\Http\Controllers\ChatController;

Route::post('/generate-token', [ChatController::class, 'generateSessionToken']);
Route::post('/send-message', [ChatController::class, 'sendMessage']);
Route::get('/session-messages/{session_token}', [ChatController::class, 'getSessionMessages']);