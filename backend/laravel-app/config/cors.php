<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:3001',      // ← أضف هذا
        'http://127.0.0.1:3001',      // ← وهذا
        'http://localhost:3002',      // ← أضف هذا
        'http://127.0.0.1:3002',      // ← وهذا
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];
