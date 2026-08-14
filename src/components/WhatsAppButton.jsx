import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  return (
    <a 
      href="https://api.whatsapp.com/send?phone=919898522905&text=Hello%20Trishu%20Impex,%20I%20am%20interested%20in%20your%20wholesale%20agro%20products." 
      target="_blank" 
      rel="noopener noreferrer" 
      className="whatsapp-btn"
      aria-label="Chat on Business WhatsApp"
      title="Chat on Business WhatsApp"
    >
      <MessageCircle size={32} />
    </a>
  );
}
