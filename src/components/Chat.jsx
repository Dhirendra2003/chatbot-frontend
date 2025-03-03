import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MessageCircle, X } from "lucide-react";
import axios from "axios";
import ContactUsForm from "./ContactUsForm";


export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatData, setChatData] = useState();
  const [contactForm, setContactForm] = useState(false);
  const [formInChat, setFormInChat] = useState(false);
  const [chats, setChats] = useState([
    { message: "How can we help you today?", fromBot: true },
  ]);
  const [canGoback, setCanGoBack] = useState(false);

  async function fetchData(indexQ, action = "") {
    try {
      const response = await axios.post(
        "https://node.webwideit.solutions/chatroute/chat",
        { action: action, questionIndex: indexQ != null || "" ? indexQ : "" },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log(response);
      setChatData(response.data?.questions);
      if (response.data?.answer) {
        setChats([...chats, { message: response.data?.breadcrumb[(response.data?.breadcrumb.length - 1)], fromBot: false }, { message: response.data?.answer, fromBot: true }]);
      }
      console.log(response.data?.breadcrumb[(response.data?.breadcrumb.length - 1)], "from fetch")
      setCanGoBack(response.data?.canGoBack);
      setFormInChat(response.data?.isLeaf);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchData("", "");
  }, []);

  const handleInput = (index, item) => {
    console.log(index);
    setChats([...chats, { message: `${item}`, fromBot: false }]);
    console.log(item)
    fetchData(index, "select");
  };

  const handleBack = () => {
    // console.log(index)
    setChats([...chats, { message: "<-- Back", fromBot: false }]);
    fetchData(null, "back");
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 bg-blue-600 text-white p-3 rounded-full  hover:bg-blue-700 transition"
      >
        <MessageCircle size={24} color="white" />
      </button>

      {/* Chat Modal using React Portal */}
      {isOpen &&
        createPortal(
          <div className="fixed bottom-16 right-5 w-80 bg-white drop-shadow-2xl rounded-lg overflow-hidden z-50">
            <div className="bg-blue-600 text-white p-4 flex justify-between">
              <h2 className="text-lg font-bold">Support Chat</h2>
              <button onClick={() => setIsOpen(false)} className="text-white">
                <X />
              </button>
            </div>
            <div className="p-4 flex flex-col h-[40vh] text-gray-700 overflow-auto gap-1">
              {contactForm ?
                <ContactUsForm />
                :
                (<>{chats.map((item, index) => {
                  return (
                    <p
                      className={`${item.fromBot
                        ? "text-left "
                        : "text-right bg-gray-100 p-2 rounded-xl ml-auto "
                        }max-w-[70%] text-wrap break-words`}
                      key={index}
                    >
                      {item.message}
                    </p>
                  );
                })}
                  {
                    //render contact form based on isLeaf
                    formInChat &&
                    <ContactUsForm chats={chats} />
                  }
                </>)
              }
            </div>
            <div className="p-4 border-t bg-gray-300">
              {(chatData.length > 0 && contactForm == false) &&
                chatData.map((item, index) => {
                  return (
                    <div
                      onClick={() => {
                        handleInput(index, item);
                      }}
                      className="bg-gray-100 cursor-pointer hover:scale-105 transition-all ease-in-out duration-100 my-2 p-2 rounded-xl"
                      key={index}
                    >
                      {item}
                    </div>
                  );
                })
              }


              <div className="flex justify-between mx-3">
                <button
                  className="bg-green-500 cursor-pointer hover:scale-105 transition-all ease-in-out duration-100 my-2 p-2 rounded-xl text-white font-bold"
                  onClick={() => {
                    setContactForm(!contactForm)
                  }}
                >
                  {contactForm ? "Chat" : "Contact Us"}
                </button>
                {canGoback && (
                  <button
                    className="bg-red-500 cursor-pointer hover:scale-105 transition-all ease-in-out duration-100 my-2 p-2 rounded-xl text-white font-bold"
                    onClick={() => {
                      handleBack();
                    }}
                  >
                    Back
                  </button>
                )}
              </div>
            </div>
          </div>,
          document.body // Render outside the main component tree
        )}
    </>
  );
}
