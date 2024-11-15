// import { useEffect, useRef, useState } from "react";
// import { FaArrowLeft } from "react-icons/fa";

// import Message from "./Message";
// import NewMessageBox from "./NewMessageBox";
// import { MessageProps, MessagesProps } from "@/types/MessageProps";

// export default function Messages({ selectedMessages, messagedUsername, handleConversations, token }: MessagesProps) {
//     const [freshMessages, setFreshMessages] = useState([] as MessageProps[]);

//     const messagesWrapperRef = useRef<HTMLDivElement>(null);

//     useEffect(() => {
//         setFreshMessages(selectedMessages);
//     }, [selectedMessages]);

//     useEffect(() => {
//         const messagesWrapper = messagesWrapperRef.current;
//         messagesWrapper?.scrollTo({
//             top: messagesWrapper.scrollHeight,
//             behavior: "smooth",
//         });
//     }, [freshMessages]);

//     return (
//         <main className="messages-container">
//             <div className="back-to">
//                 <button className="icon-hoverable btn btn-white" onClick={() => handleConversations(false)}>
//                     <FaArrowLeft />
//                 </button>
//                 <div className="top">
//                     <span className="top-title">{messagedUsername}</span>
//                 </div>
//             </div>
//             <div className="messages-wrapper" ref={messagesWrapperRef}>
//                 {freshMessages.length > 0 &&
//                     freshMessages.map((message: MessageProps) => (
//                         <Message key={message.id} message={message} messagedUsername={messagedUsername} />
//                     ))}
//             </div>
//             <NewMessageBox
//                 messagedUsername={messagedUsername}
//                 token={token}
//                 setFreshMessages={setFreshMessages}
//                 freshMessages={freshMessages}
//             />
//         </main>
//     );
// }






import { useEffect, useRef, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

import Message from "./Message";
import NewMessageBox from "./NewMessageBox";
import { MessageProps, MessagesProps } from "@/types/MessageProps";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Messages({ selectedMessages, messagedUsername, handleConversations, token }: MessagesProps) {
    const [freshMessages, setFreshMessages] = useState<MessageProps[]>([]);

    const messagesWrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setFreshMessages(selectedMessages);
    }, [selectedMessages]);

    useEffect(() => {
        const messagesWrapper = messagesWrapperRef.current;
        messagesWrapper?.scrollTo({
            top: messagesWrapper.scrollHeight,
            behavior: "smooth",
        });
    }, [freshMessages]);

    useEffect(() => {
        const channel = supabase
            .channel("realtime:messages")
            .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, (payload: any) => {
                const newMessage: MessageProps = payload.new;

                if (newMessage.sender.username === messagedUsername || newMessage.recipient.username === messagedUsername) {
                    setFreshMessages((prevMessages) => [...prevMessages, newMessage]);
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [messagedUsername]);

    return (
        <main className="messages-container">
            <div className="back-to">
                <button className="icon-hoverable btn btn-white" onClick={() => handleConversations(false)}>
                    <FaArrowLeft />
                </button>
                <div className="top">
                    <span className="top-title">{messagedUsername}</span>
                </div>
            </div>
            <div className="messages-wrapper" ref={messagesWrapperRef}>
                {freshMessages.length > 0 &&
                    freshMessages.map((message: MessageProps) => (
                        <Message key={message.id} message={message} messagedUsername={messagedUsername} />
                    ))}
            </div>
            <NewMessageBox
                messagedUsername={messagedUsername}
                token={token}
                setFreshMessages={setFreshMessages}
                freshMessages={freshMessages}
            />
        </main>
    );
}






