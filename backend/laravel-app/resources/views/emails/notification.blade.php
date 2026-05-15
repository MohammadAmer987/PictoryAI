<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
            background-color: #f8fafc;
            color: #1e293b;
            line-height: 1.6;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }

        .email-wrapper {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            overflow: hidden;
        }

        /* Header */
        .header {
            background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
            padding: 30px 20px;
            text-align: center;
            color: white;
        }

        .logo {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
            letter-spacing: -0.5px;
        }

        .logo-subtitle {
            font-size: 12px;
            opacity: 0.9;
            font-weight: 500;
        }

        /* Content */
        .content {
            padding: 40px 30px;
        }

        .greeting {
            font-size: 16px;
            margin-bottom: 20px;
            color: #1e293b;
        }

        .greeting strong {
            color: #0f172a;
        }

        .title {
            font-size: 24px;
            font-weight: 700;
            color: #1e40af;
            margin-bottom: 20px;
            line-height: 1.3;
        }

        .message {
            font-size: 15px;
            line-height: 1.8;
            color: #475569;
            margin-bottom: 30px;
            white-space: pre-wrap;
        }

        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
            color: white;
            padding: 14px 32px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 600;
            font-size: 15px;
            transition: transform 0.2s, box-shadow 0.2s;
            box-shadow: 0 2px 8px rgba(30, 64, 175, 0.3);
        }

        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(30, 64, 175, 0.4);
        }

        .no-button {
            margin-bottom: 40px;
        }

        /* Footer */
        .footer {
            background-color: #f8fafc;
            padding: 30px;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            font-size: 13px;
            color: #64748b;
        }

        .footer-link {
            color: #1e40af;
            text-decoration: none;
        }

        .footer-link:hover {
            text-decoration: underline;
        }

        .divider {
            height: 1px;
            background-color: #e2e8f0;
            margin: 20px 0;
        }

        /* Responsive */
        @media (max-width: 600px) {
            .container {
                padding: 10px;
            }

            .content {
                padding: 20px 15px;
            }

            .title {
                font-size: 20px;
            }

            .message {
                font-size: 14px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="email-wrapper">
            <!-- Header -->
            <div class="header">
                <div class="logo">📸 Pictory AI</div>
                <div class="logo-subtitle">Transform Your Images & Content</div>
            </div>

            <!-- Content -->
            <div class="content">
                <div class="greeting">
                    Hello <strong>{{ $userName }}</strong>,
                </div>

                <div class="title">
                    {{ $title }}
                </div>

                <div class="message">
{{ $message }}
                </div>

                @if ($link)
                    <a href="{{ $link }}" class="cta-button">Learn More →</a>
                @else
                    <div class="no-button"></div>
                @endif
            </div>

            <!-- Footer -->
            <div class="footer">
                <div style="margin-bottom: 15px;">
                    <strong>Pictory AI Team</strong>
                </div>
                <div class="divider" style="margin: 15px 0;"></div>
                <div>
                    Questions? <a href="https://pictoryai.com/support" class="footer-link">Contact Support</a>
                </div>
                <div style="margin-top: 10px; font-size: 12px; color: #94a3b8;">
                    © {{ date('Y') }} Pictory AI. All rights reserved.
                </div>
            </div>
        </div>
    </div>
</body>
</html>
