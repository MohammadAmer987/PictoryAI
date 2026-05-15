import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/ChatBotWidget.css";

const CHATBOT_STORAGE_KEY = "pictory-chatbot-messages";

const QUICK_QUESTIONS = [
  "How do I get started?",
  "Which tool should I use?",
  "How does Caption Generator work?",
  "How does Enhance Image work?",
  "How does Theme Image Generation work?",
  "How does Custom Image Generation work?",
  "How do I upload an image?",
  "What does Pro include?",
  "Where is pricing?",
  "How do I create an account?",
  "How does History work?",
  "How does Profile and subscription work?",
];

const PAGE_ASSISTANTS = {
  "/": {
    title: "Home guide",
    subtitle: "I can help you discover tools, pricing, and the main flow.",
  },
  "/tools": {
    title: "Tools guide",
    subtitle: "Choose the right tool for captions, enhancement, or image generation.",
  },
  "/tools/caption-generator": {
    title: "Caption guide",
    subtitle: "I can walk you through writing or generating captions faster.",
  },
  "/tools/enhance-image": {
    title: "Enhance guide",
    subtitle: "Upload a product image, tune the settings, and generate a stronger result.",
  },
  "/tools/generate-image": {
    title: "Custom image guide",
    subtitle: "Create a branded image with text, colors, and format options.",
  },
  "/tools/theme-image-generation": {
    title: "Theme image guide",
    subtitle: "Pick a theme and generate a ready-made visual faster.",
  },
  "/pricing": {
    title: "Pricing guide",
    subtitle: "Compare plans and see which features are included.",
  },
  "/login": {
    title: "Login guide",
    subtitle: "Sign in to use tools, save work, and access subscriptions.",
  },
  "/signup": {
    title: "Signup guide",
    subtitle: "Create your account to start using the app.",
  },
  "/history": {
    title: "History guide",
    subtitle: "Review your generated content and return to tools when needed.",
  },
};

const ROUTE_KEYWORDS = [
  { keywords: ["price", "pricing", "plan", "subscription", "pro"], path: "/pricing", reply: "I’m opening the pricing page. There you can compare the available plans, check which features are included in Pro, and decide which option fits your work before subscribing." },
  { keywords: ["tool", "tools"], path: "/tools", reply: "I’m opening the tools page. From there you can choose the right workflow: caption generation for text, image enhancement for improving a real product photo, theme image generation for ready-made styles, or custom image generation for more branding control." },
  { keywords: ["caption", "captions"], path: "/tools/caption-generator", reply: "I’m opening the caption generator. On that page you can describe your product or marketing idea, then generate captions that are better for posts, promotions, and product presentation." },
  { keywords: ["enhance", "improve", "retouch"], path: "/tools/enhance-image", reply: "I’m opening the enhance image page. There you upload a clear product photo, choose the settings, and generate a cleaner and more professional marketing result." },
  { keywords: ["theme", "style", "styled"], path: "/tools/theme-image-generation", reply: "I’m opening theme image generation. On that page you choose a theme or style, then generate a ready-made visual that matches the mood of your product or brand." },
  { keywords: ["custom", "brand", "colors", "format"], path: "/tools/generate-image", reply: "I’m opening custom image generation. There you can add your business name, promotional text, choose colors, and select the format such as post, story, or banner." },
  { keywords: ["login", "sign in"], path: "/login", reply: "I’m opening the login page. After signing in, the user can access the tools, saved work, and any subscription features connected to the account." },
  { keywords: ["signup", "sign up", "register", "account"], path: "/signup", reply: "I’m opening the signup page. From there the user can create a new account, then log in and start using the app tools and saved features." },
  { keywords: ["history", "previous", "saved"], path: "/history", reply: "I’m opening the history page. There the user can review previous generated results, return to older work, and continue from past content more easily." },
  { keywords: ["home", "start"], path: "/", reply: "I’m taking you back to the home page. From there the user can understand the platform quickly, review the main sections, and move to pricing or tools." },
];

function ChatBotWidget() {
  const location = useLocation();
  const navigate = useNavigate();
  const messagesRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const pageAssistant = useMemo(
    () => PAGE_ASSISTANTS[location.pathname] || {
      title: "Pictory Assistant",
      subtitle: "Ask about this page and I will guide you.",
    },
    [location.pathname]
  );

  const [messages, setMessages] = useState(() => {
    if (typeof window === "undefined") return [];

    try {
      const stored = window.sessionStorage.getItem(CHATBOT_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      return [];
    }
  });

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, open]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.sessionStorage.setItem(CHATBOT_STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) return;

    setMessages([
      {
        id: Date.now(),
        role: "bot",
        text: getContextReply(),
      },
    ]);
  }, [location.pathname, messages.length]);

  const addMessage = (message) => {
    setMessages((prev) => [...prev, { id: Date.now() + Math.random(), ...message }]);
  };

  const handleNavigate = (path) => {
    if (!path || path === location.pathname) return;
    setTimeout(() => navigate(path), 180);
  };

  const getContextReply = () => {
    switch (location.pathname) {
      case "/":
        return "Start from the Tools menu if you want to generate captions, enhance a product image, or create themed visuals.";
      case "/tools":
        return "From here, choose Caption Generator for text, Enhance Image for product improvements, Theme Image Generation for ready-made styles, or Custom Image Generation for more control.";
      case "/tools/caption-generator":
        return "On this page, describe your product clearly, then generate captions and review the suggestions. If you need more options, Pro unlocks more features from pricing.";
      case "/tools/enhance-image":
        return "On this page, upload a clean product image first, then adjust settings and generate results. Simple backgrounds usually give better output.";
      case "/tools/generate-image":
        return "On this page, add your business name, text, colors, and image format. A short promotional line usually works best.";
      case "/tools/theme-image-generation":
        return "Choose a theme that matches your product style, then generate and compare the results until one fits your brand.";
      case "/pricing":
        return "This page compares available plans. If you want premium options or more advanced generation, review the Pro details here.";
      case "/login":
        return "Log in with your account details to unlock your saved work and subscriptions.";
      case "/signup":
        return "Create your account here, then you can start using the AI tools right away.";
      case "/history":
        return "This page stores your previous results so you can review and reuse them.";
      default:
        return "Ask me where you want to go, and I can guide you through the app.";
    }
  };

  const getHelpfulAnswer = (normalized) => {
    if (
      normalized.includes("how does caption generator work") ||
      normalized.includes("explain caption generator") ||
      normalized.includes("caption generator work")
    ) {
      handleNavigate("/tools/caption-generator");
      return "I’m opening the caption generator. This feature works in three steps: first the user enters product or campaign details, then the app generates caption ideas from that input, and finally the user reviews the options and keeps the version that best matches the goal, such as promotion, engagement, or product awareness.";
    }

    if (
      normalized.includes("how does enhance image work") ||
      normalized.includes("explain enhance image") ||
      normalized.includes("enhance image work")
    ) {
      handleNavigate("/tools/enhance-image");
      return "I’m opening the enhance image page. This feature starts by uploading a real product image, then the user adjusts creative options like style, background, text, lighting, or layout, and after generation the app returns a more polished marketing visual based on those selections.";
    }

    if (
      normalized.includes("how does theme image generation work") ||
      normalized.includes("explain theme image") ||
      normalized.includes("theme image generation work")
    ) {
      handleNavigate("/tools/theme-image-generation");
      return "I’m opening theme image generation. This feature works by letting the user choose a theme or visual mood first, then the app generates a ready-made image that follows that selected style, which is useful when the user wants faster content creation without configuring every design detail manually.";
    }

    if (
      normalized.includes("how does custom image generation work") ||
      normalized.includes("explain custom image") ||
      normalized.includes("custom image generation work")
    ) {
      handleNavigate("/tools/generate-image");
      return "I’m opening custom image generation. This feature lets the user build a branded visual by entering a business name, adding promotional text, choosing design colors, selecting the image format like post, story, or banner, and optionally using Pro extras such as logo upload and creative direction before generating the final image.";
    }

    if (
      normalized.includes("how does history work") ||
      normalized.includes("explain history") ||
      normalized.includes("history work")
    ) {
      handleNavigate("/history");
      return "I’m opening the history page. This feature stores previous generated images and captions so the user can review older results, reuse ideas, and continue work later without starting from zero each time.";
    }

    if (
      normalized.includes("how does profile") ||
      normalized.includes("profile and subscription") ||
      normalized.includes("subscription work")
    ) {
      handleNavigate("/pricing");
      return "I’m opening the pricing page first because subscriptions are tied to feature access. In the app, the user can create an account, log in, manage profile details like name, email, and password, check the current subscription, review plan history, and upgrade when advanced features are needed.";
    }

    if (normalized.includes("get started") || normalized.includes("start")) {
      handleNavigate("/tools");
      return "I’m opening the tools page to help you start correctly. Choose Caption Generator if you need text for a post, Enhance Image if you already have a product photo, Theme Image Generation for fast styled visuals, or Custom Image Generation if you want more control over text, colors, and layout.";
    }

    if (normalized.includes("which tool") || normalized.includes("what tool") || normalized.includes("choose tool")) {
      return "Use Caption Generator for marketing captions, Enhance Image to improve a real product photo, Theme Image Generation for fast themed visuals, and Custom Image Generation when you want branding control like business name, colors, and format.";
    }

    if (normalized.includes("upload")) {
      handleNavigate("/tools/enhance-image");
      return "I’m opening the enhance image page because that is the main place for uploading a product photo. For best results, use a clear image with good lighting and a simple background, then review the preview and generate the final result.";
    }

    if (normalized.includes("pro") || normalized.includes("pricing") || normalized.includes("plan") || normalized.includes("subscription")) {
      handleNavigate("/pricing");
      return "I’m opening the pricing page. There the user can compare plans, see what Pro includes, and understand whether the advanced features are worth it before subscribing.";
    }

    if (normalized.includes("account") || normalized.includes("sign up") || normalized.includes("signup") || normalized.includes("register")) {
      handleNavigate("/signup");
      return "I’m opening the signup page. The user can create an account there, then log in to access the tools, save work, and use subscription features when needed.";
    }

    if (normalized.includes("caption")) {
      handleNavigate("/tools/caption-generator");
      return "I’m opening the caption generator. To get better captions, describe the product clearly, mention the style you want, and keep the goal simple such as sales, promotion, or awareness. Short and specific inputs usually give stronger results.";
    }

    if (normalized.includes("enhance") || normalized.includes("improve image")) {
      handleNavigate("/tools/enhance-image");
      return "I’m opening the enhance image page. For stronger results, use a sharp image, avoid heavy shadows, and keep the product clearly visible because clean source images usually give the best final output.";
    }

    if (normalized.includes("theme")) {
      handleNavigate("/tools/theme-image-generation");
      return "I’m opening theme image generation. This tool is useful when you want a fast ready-made style, so choose the theme that matches your product category and brand mood, then compare the result with your marketing style.";
    }

    if (normalized.includes("custom image") || normalized.includes("colors") || normalized.includes("format")) {
      handleNavigate("/tools/generate-image");
      return "I’m opening custom image generation. On that page, keep the business name short, use one clear promotional line, and choose the format based on where you will publish it, such as post, story, or banner.";
    }

    return null;
  };

  const createBotResponse = (question) => {
    const normalized = question.trim().toLowerCase();

    if (!normalized) {
      return "Type a short question and I will guide you.";
    }

    const helpfulAnswer = getHelpfulAnswer(normalized);
    if (helpfulAnswer) {
      return helpfulAnswer;
    }

    const matchedRoute = ROUTE_KEYWORDS.find(({ keywords }) =>
      keywords.some((keyword) => normalized.includes(keyword))
    );

    if (matchedRoute) {
      handleNavigate(matchedRoute.path);
      return matchedRoute.reply;
    }

    if (
      normalized.includes("how") ||
      normalized.includes("where") ||
      normalized.includes("what") ||
      normalized.includes("help")
    ) {
      return getContextReply();
    }

    return `${getContextReply()} If you want, ask me about tools, pricing, login, or the current page.`;
  };

  const handleSend = (text) => {
    const question = text.trim();
    if (!question) return;

    addMessage({ role: "user", text: question });
    setInput("");

    const answer = createBotResponse(question);
    setTimeout(() => addMessage({ role: "bot", text: answer }), 180);
  };

  return (
    <div className={`chatbot-widget ${open ? "is-open" : ""}`}>
      <div className={`chatbot-panel ${open ? "open" : "closed"}`}>
        <div className="chatbot-header">
          <div>
            <div className="chatbot-eyebrow">AI Assistant</div>
            <div className="chatbot-title">{pageAssistant.title}</div>
            <div className="chatbot-subtitle">{pageAssistant.subtitle}</div>
          </div>
          <button className="chatbot-close" onClick={() => setOpen(false)} aria-label="Close chat">
            x
          </button>
        </div>

        <div className="chatbot-body">
          <div className="chatbot-status">
            <span className="chatbot-status-dot" />
            Ready to guide you on this page
          </div>

          <div className="chatbot-messages" ref={messagesRef}>
            {messages.map((msg) => (
              <div key={msg.id} className={`chatbot-message ${msg.role}`}>
                <div className="chatbot-message-text">{msg.text}</div>
              </div>
            ))}
          </div>

          <div className="chatbot-quick-actions">
            {QUICK_QUESTIONS.map((q) => (
              <button key={q} type="button" onClick={() => handleSend(q)}>
                {q}
              </button>
            ))}
          </div>
        </div>

        <form
          className="chatbot-footer"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about this page..."
            aria-label="Chat question"
          />
          <button type="submit">Send</button>
        </form>
      </div>

      <button
        className="chatbot-toggle"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Close assistant" : "Open assistant"}
      >
        <div className="chatbot-toggle-icon">
          <i className="bi bi-chat-dots-fill" />
        </div>
      </button>
    </div>
  );
}

export default ChatBotWidget;
