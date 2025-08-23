import React, { useState } from "react";
import "../Styles/Help.css";

export function Help() {
  const faqs = [
    {
      question: "How do I draw on the canvas?",
      answer:
        "Select the Pencil, Line, or Square tool from the toolbar. Click and drag on the canvas to draw.",
    },
    {
      question: "How do I save my work?",
      answer:
        "Click the Save button at the top of the canvas to save your work in JSON format. Use Export to save it as a PNG image.",
    },
    {
      question: "Can I change my account information?",
      answer:
        "Yes! Go to the Account page. The Security tab allows you to change your username, password, email, phone number, and full name.",
    },
    {
      question: "How do I undo or redo actions?",
      answer:
        "Use the Undo and Redo buttons at the bottom-left of the canvas, or use keyboard shortcuts: Ctrl+Z for Undo, Ctrl+Shift+Z for Redo.",
    },
    {
      question: "How do I switch layers?",
      answer:
        "Use the Layers panel on the right side of the canvas to select, add, or remove layers.(Work in progress.)",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="help-page">
      <h1>Help & FAQs</h1>
      <div className="faq-container">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`faq-item ${openIndex === index ? "open" : ""}`}
            onClick={() => toggleFaq(index)}
          >
            <div className="faq-question">{faq.question}</div>
            {openIndex === index && (
              <div className="faq-answer">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
