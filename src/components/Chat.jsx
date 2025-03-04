import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MessageCircle, X } from "lucide-react";
import axios from "axios";
import ContactUsForm from "./ContactUsForm";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatData, setChatData] = useState([]);
  const [contactForm, setContactForm] = useState(false);
  const [formInChat, setFormInChat] = useState(false);
  const [chats, setChats] = useState([{ message: "How can we help you today?", fromBot: true }]);
  const [canGoBack, setCanGoBack] = useState(false);

  async function fetchData(indexQ, action = "") {
    try {
      const response = await axios.post(
        "https://node.webwideit.solutions/chatroute/chat",
        { action, questionIndex: indexQ ?? "" },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      console.log(response);
      setChatData(response.data?.questions || []);
      if (response.data?.answer) {
        setChats(prevChats => [
          ...prevChats,
          { message: response.data?.breadcrumb?.[response.data?.breadcrumb.length - 1] || "", fromBot: false },
          { message: response.data?.answer, fromBot: true },
        ]);
      }
      setCanGoBack(response.data?.canGoBack || false);
      setFormInChat(response.data?.isLeaf || false);
    } catch (error) {
      console.error("Error fetching chatbot data:", error);
    }
  }

  useEffect(() => {
    fetchData("", "");
  }, []);

  const handleInput = (index, item) => {
    setChats(prevChats => [...prevChats, { message: item, fromBot: false }]);
    fetchData(index, "select");
  };

  const handleBack = () => {
    setChats(prevChats => [...prevChats, { message: "<-- Back", fromBot: false }]);
    fetchData(null, "back");
  };

  return (
    <>
      {createPortal(
        <>
          {/* Floating Chat Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="fixed   bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700"
          >
            <MessageCircle size={24} color="white" />
          </button>

          {isOpen && (
            <div className="fixed bottom-16 right-5 w-80 bg-white drop-shadow-2xl rounded-lg overflow-hidden z-50">
              {/* Chat Header */}
              <div className="bg-blue-600 text-white p-4 flex justify-between">
                <h2 className="text-lg font-bold">Support Chat</h2>
                <button onClick={() => setIsOpen(false)} className="text-white">
                  <X />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="p-4 flex flex-col h-[40vh] text-gray-700 overflow-auto gap-1">
                {contactForm ? (
                  <ContactUsForm />
                ) : (
                  <>
                    {chats.map((item, index) => (
                      <p
                        key={index}
                        className={`${item.fromBot ? "text-left" : "text-right bg-gray-100 p-2 rounded-xl ml-auto"} max-w-[70%] break-words`}
                      >
                        {item.message}
                      </p>
                    ))}

                    {formInChat && <ContactUsForm chats={chats} />}
                  </>
                )}
              </div>

              {/* Chat Options */}
              <div className="p-4 border-t bg-gray-300">
                {chatData.length > 0 && !contactForm && chatData.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleInput(index, item)}
                    className="bg-gray-100 cursor-pointer hover:scale-105 transition-all ease-in-out duration-100 my-2 p-2 rounded-xl"
                  >
                    {item}
                  </div>
                ))}

                <div className="flex justify-between mx-3">
                  <button
                    className="bg-green-500 cursor-pointer hover:scale-105 transition-all ease-in-out duration-100 my-2 p-2 rounded-xl text-white font-bold"
                    onClick={() => setContactForm(!contactForm)}
                  >
                    {contactForm ? "Chat" : "Contact Us"}
                  </button>

                  {canGoBack && (
                    <button
                      className="bg-red-500 cursor-pointer hover:scale-105 transition-all ease-in-out duration-100 my-2 p-2 rounded-xl text-white font-bold"
                      onClick={handleBack}
                    >
                      Back
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </>,
        document.body
      )}
    </>
  );
}
