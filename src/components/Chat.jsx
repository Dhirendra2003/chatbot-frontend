import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { MessageCircle, X, RefreshCcw } from "lucide-react";
import axios from "axios";
import ContactUsForm from "./ContactUsForm";

export default function Chatbot() {
  const latestMessage = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [chatData, setChatData] = useState([]);
  const [contactForm, setContactForm] = useState(false);
  const [formInChat, setFormInChat] = useState(false);
  const [chats, setChats] = useState([{ message: "How can we help you today?", fromBot: true }]);
  const [canGoBack, setCanGoBack] = useState(false);

  const scrollToSection = () => {
    console.log("scroll to called")
    latestMessage.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  async function fetchData(indexQ, action = "") {
    try {
      const response = await axios.post(
        "https://node.webwideit.solutions/chatroute/chat",
        // "http://localhost:3000/api/v1/chatbot/chat",
        { action, questionIndex: indexQ ?? "" },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      console.log(response);
      setChatData(response.data?.questions || []);
      if (response.data?.answer) {
        setChats(prevChats => [
          ...prevChats,
          // { message: response.data?.breadcrumb?.[response.data?.breadcrumb.length - 1] || "", fromBot: false },
          { message: response.data?.answer, fromBot: true },
        ]);
      }
      // scrollToSection()
      setCanGoBack(response.data?.canGoBack || false);
      setFormInChat(response.data?.isLeaf || false);
    } catch (error) {
      console.error("Error fetching chatbot data:", error);
    }
  }

  async function restartChat() {
    try {
      const response = await axios.post(
        "https://node.webwideit.solutions/chatroute/chat",
        // "http://localhost:3000/api/v1/chatbot/chat",
        { action: "reset", questionIndex: "" },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      console.log(response);
      setChatData(response.data?.questions || []);
      // if (response.data?.answer) {
      setChats([{ message: "How can we help you today?", fromBot: true }])
      // }
      setCanGoBack(response.data?.canGoBack || false);
      setFormInChat(response.data?.isLeaf || false);
    } catch (error) {
      console.error("Error fetching chatbot data:", error);
    }
  }

  useEffect(() => {
    fetchData("", "");
  }, []);

  useEffect(() => {
    latestMessage.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [chats]);

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
            className=" bg-blue-500 fixed z-50 bottom-5 right-5 bg- text-white p-3 rounded-full hover:bg-blue-700 transition"
          >
            <MessageCircle size={24} color="white" />
          </button>

          {isOpen && (
            <div className="fixed bottom-16 right-5 w-80 bg-white drop-shadow-2xl rounded-lg overflow-hidden z-50">
              {/* Chat Header */}
              <div className="bg-[#20364b] text-white p-4 flex justify-between">
                <h2 className="text-lg font-bold">Support Chat</h2>
                <div className="flex gap-6">
                  <button onClick={() => restartChat()} className="text-white">
                    <RefreshCcw />
                  </button>
                  <button onClick={() => setIsOpen(false)} className="text-white">
                    <X />
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="p-4 flex flex-col h-[40vh]  overflow-auto gap-1">
                {contactForm ? (
                  <ContactUsForm />
                ) : (
                  <>
                    {chats.map((item, index) => (
                      <p
                        key={index}
                        className={`${item.fromBot ? "text-left bg-gray-100" : "text-right bg-[#0ec599]  ml-auto"} p-2 rounded-xl max-w-[70%] break-words`}
                        ref={index === chats.length - 1 ? latestMessage : null}
                      >
                        {item.message}
                        {index}{(chats.length - 1)}
                      </p>
                    ))}

                    {formInChat && <ContactUsForm chats={chats} />}
                  </>
                )}
              </div>

              {/* Chat Options */}
              <div className="p-4 border-t bg-gray-100">
                {chatData.length > 0 && !contactForm && chatData.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleInput(index, item)}
                    className="bg-[#20364b]  text-white cursor-pointer hover:scale-105 transition-all ease-in-out duration-100 my-2 p-2 rounded-xl"
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

                  {/* {canGoBack && (
                    <button
                      className="bg-red-500 cursor-pointer hover:scale-105 transition-all ease-in-out duration-100 my-2 p-2 rounded-xl text-white font-bold"
                      onClick={handleBack}
                    >
                      Back
                    </button>
                  )} */}
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
