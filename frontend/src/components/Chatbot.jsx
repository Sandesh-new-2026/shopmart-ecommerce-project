import { useEffect, useState } from "react";
import "./Chatbot.css";
import api from "../services/api";

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ from: "bot", text: "Hi! I can help with products, delivery, returns, and orders." }]);
  const [text, setText] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/products")
      .then((response) => setProducts(response.data.products || []))
      .catch(() => setProducts([]));
  }, []);

  const send = (event) => {
    event.preventDefault();
    const question = text.trim();
    if (!question) return;
    const product = products.find((item) =>
      `${item.name} ${item.category} ${item.description || ""}`.toLowerCase().includes(question.toLowerCase()),
    );
    const answer = product
      ? `${product.name}: ₹${Number(product.price).toLocaleString("en-IN")}. ${product.description || `Available in ${product.category}.`}`
      : /return|refund/i.test(question)
      ? "You can request a return within 7 days from My Orders."
      : /delivery|address/i.test(question)
        ? "We deliver to saved addresses. Add or update one from your Profile."
        : /order/i.test(question)
          ? "Your order history is available under My Orders."
          : "I can help with products, delivery, returns, orders, and product details. Try a product name.";
    setMessages((current) => [...current, { from: "user", text: question }, { from: "bot", text: answer }]);
    setText("");
  };

  return <div className="chatbot"><button className="chatbot-launcher" onClick={() => setOpen(!open)} aria-label="Open support chat">💬</button>{open && <section className="chatbot-panel"><header>Shopmart help <button onClick={() => setOpen(false)}>×</button></header><div className="chatbot-messages">{messages.map((message, index) => <p key={index} className={message.from}>{message.text}</p>)}</div><form onSubmit={send}><input value={text} onChange={(event) => setText(event.target.value)} placeholder="Ask for help..." /><button type="submit">Send</button></form></section>}</div>;
}

export default Chatbot;
