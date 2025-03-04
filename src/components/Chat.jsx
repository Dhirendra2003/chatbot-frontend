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
  const [loading,setLoading]=useState(false)

  const scrollToSection = () => {
    console.log("scroll to called")
    latestMessage.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  async function fetchData(indexQ, action = "") {
    try {
      setLoading(true)
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
    finally{
      setLoading(false)
    }
  }

  async function restartChat() {
    try {
      setLoading(true)
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
    finally{
      setLoading(false)
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
                      </p>
                    ))}

                    {formInChat && <ContactUsForm chats={chats} />}
                  </>
                )}
              </div>

              {/* Chat Options */}
              <div className="p-4 border-t bg-gray-100 transition-all ease-in-out duration-200">
                {chatData.length > 0 && loading==false && !contactForm && chatData.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleInput(index, item)}
                    className="bg-[#20364b] text-white cursor-pointer hover:bg-[#20364bab] transition-all ease-in-out duration-100 my-2 p-2 rounded-xl"
                  >
                    {item}
                  </div>
                  
                ))}
                {loading && <div>
                  <div className="text-center">
    <div role="status " className="flex gap-3 m-2 justify-center items-center">
        <svg aria-hidden="true" className="inline w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
        <span className="">Loading...</span>
    </div>
</div>
                  </div>}

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
