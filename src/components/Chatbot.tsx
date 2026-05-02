import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "./ui/card";
import { MessageSquare, Send, X, Bot, Sparkles, User } from "lucide-react";
import { chatbotResponse } from "../services/gemini";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: "Hello! I am ReLeather AI. How can I help you with your leather products or sustainability today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      const response = await chatbotResponse(history, userMessage);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl z-50 p-0 overflow-hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="bg-primary hover:bg-primary/90 w-full h-full flex items-center justify-center transition-transform hover:scale-110">
          {isOpen ? <X className="h-6 w-6 text-white" /> : <MessageSquare className="h-6 w-6 text-white" />}
        </div>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-[90vw] sm:w-[400px] z-50 overflow-hidden"
          >
            <Card className="border-none shadow-2xl flex flex-col h-[500px] bg-white/95 backdrop-blur-lg">
              <CardHeader className="bg-primary text-white p-4">
                <CardTitle className="text-lg flex items-center gap-2 italic">
                  <Bot className="h-5 w-5" /> ReLeather AI
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 p-0 overflow-hidden">
                <ScrollArea className="h-full p-4">
                  <div className="space-y-4">
                    {messages.map((m, i) => (
                      <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-secondary' : 'bg-primary'}`}>
                            {m.role === 'user' ? <User className="h-4 w-4 text-white" /> : <Sparkles className="h-4 w-4 text-white" />}
                          </div>
                          <div className={`p-3 rounded-2xl text-sm ${
                            m.role === 'user' 
                              ? 'bg-secondary/10 text-foreground rounded-tr-none' 
                              : 'bg-muted text-foreground rounded-tl-none border shadow-sm'
                          }`}>
                            <div className="markdown-body">
                              <ReactMarkdown>{m.text}</ReactMarkdown>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {loading && (
                      <div className="flex justify-start">
                        <div className="bg-muted p-3 rounded-2xl rounded-tl-none animate-pulse text-xs text-muted-foreground italic flex items-center gap-2">
                           Understanding your product...
                        </div>
                      </div>
                    )}
                    <div ref={scrollRef} />
                  </div>
                </ScrollArea>
              </CardContent>

              <CardFooter className="p-3 border-t bg-white">
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
                  className="flex w-full gap-2"
                >
                  <Input 
                    placeholder="Ask about leather care..." 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 border-none bg-muted focus-visible:ring-1"
                  />
                  <Button type="submit" size="icon" disabled={loading}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
