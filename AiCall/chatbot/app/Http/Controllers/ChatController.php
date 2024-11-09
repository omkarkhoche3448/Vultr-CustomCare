<?php
namespace App\Http\Controllers;

use App\Models\ChatMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Http;

class ChatController extends Controller
{
    public function generateSessionToken()
    {
        $token = Str::random(32);
        return response()->json(['token' => $token]);
    }

    // In ChatController.php
    public function sendMessage(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
            'session_token' => 'required|string'
        ]);
    
        $messages = [
            [
                "role" => "system",
                "content" => "You are a sales coach providing very brief, actionable suggestions (5-6 words max)."
            ],
            [
                "role" => "user",
                "content" => $request->message
            ]
        ];
    
        try {
            $response = Http::withOptions([
                'verify' => storage_path('cacert.pem'),
            ])->withHeaders([
                'Content-Type' => 'application/json',
                'Authorization' => "7F567HVTIMKFPVM27ZFPQ73ZIDLLNTMB6KRQ"
            ])->post('https://api.vultrinference.com/v1/chat/completions', [
                'model' => 'llama2-13b-chat-Q5_K_M',
                'messages' => $messages,
                'max_tokens' => 256,
                'temperature' => 0.7,
                'top_k' => 40,
                'top_p' => 0.9
            ]);
    
            // Debug the raw response
            \Log::info('Vultr API Response:', [
                'status' => $response->status(),
                'body' => $response->body(),
                'json' => $response->json()
            ]);
    
            // Check if the response was successful
            if (!$response->successful()) {
                return response()->json([
                    'success' => false,
                    'error' => 'API request failed: ' . $response->body()
                ], $response->status());
            }
    
            $responseData = $response->json();
    
            // Validate response structure
            if (!isset($responseData['choices']) || empty($responseData['choices'])) {
                return response()->json([
                    'success' => false,
                    'error' => 'Invalid API response format',
                    'response_data' => $responseData
                ], 500);
            }
    
            $llmResponse = $responseData['choices'][0]['message']['content'];
            
            $chatMessage = ChatMessage::create([
                'session_token' => $request->session_token,
                'message' => $request->message,
                'response' => $llmResponse
            ]);
    
            return response()->json([
                'success' => true,
                'message' => $chatMessage
            ]);
        } catch (\Exception $e) {
            \Log::error('Chat API Error:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
    
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getSessionMessages($session_token)
    {
        $messages = ChatMessage::where('session_token', $session_token)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json(['messages' => $messages]);
    }
}