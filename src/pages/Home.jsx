import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../redux/features/authSlice';
import { fetchUsers, fetchMessages, sendMessage, fetchFriends, setSelectedUserId, } from "../redux/features/useChatSlice";
import io from "socket.io-client";
import { addIncomingMessage } from "../redux/features/useChatSlice"
import { getFriendRequests,accptFriendrReq,declineFriendrReq } from "../redux/features/friendRequestSlice"
import MessageBox from '../components/MessageBox';
import { sendFriendrReq } from '../redux/features/userSlice';


const socket = io("http://localhost:8000");

function Home() {
  const addFriendRef = useRef(null);
  const requestRef = useRef(null);
  const { user, loading } = useSelector(state => state.auth);
  const { friends = [] } = useSelector(state => state.chat);
  const requests = useSelector((state) => {
    return state.friend.friend
  });


  const { users, messages, selectedUserId } = useSelector(state => state.chat); // 🧠 get chat state
  const dispatch = useDispatch();
  const [isServer, setIsServer] = useState(false)
  const [inputText, setInputText] = useState("");
  const navigate = useNavigate();
  const [topName, setTopName] = useState("Tap on any user to Chat")
  const [isChat, setIsChat] = useState(false)
  const [showAddFriendPopup, setShowAddFriendPopup] = useState(false);
  const [showRequestsPopup, setShowRequestsPopup] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (addFriendRef.current && !addFriendRef.current.contains(event.target)) ||
        (requestRef.current && !requestRef.current.contains(event.target))
      ) {
        setShowAddFriendPopup(false);
        setShowRequestsPopup(false);
      }
    };

    if (showAddFriendPopup || showRequestsPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAddFriendPopup, showRequestsPopup]);


  useEffect(() => {
    dispatch(getUser());
    dispatch(fetchUsers());
    dispatch(getFriendRequests());
  }, [dispatch]);




  useEffect(() => {
    if (users && users.length > 0) {
      const tempCourses = users.slice()
      searchText ?
        setSearchResults(
          tempCourses.filter(
            item => item.fullname.toLowerCase().includes(searchText.toLowerCase())
          )
        )
        : setSearchResults(tempCourses)
    }
  }, [users, searchText])

  useEffect(() => {
    if (!loading && user === null) {
      console.log("🔁 Redirecting to /login...");
      navigate('/login');
    }
  }, [user, loading, navigate]);

  //  Fetch users and setup socket listeners

  useEffect(() => {
    if (user) {
      dispatch(fetchFriends());

      // 💬 Handle real-time messages
      socket.on("receive-message", (message) => {
        if (message.senderId !== user._id) {
          dispatch(addIncomingMessage(message));
        }
      });

      return () => {
        socket.off("receive-message");
      };
    }
  }, [user, dispatch]);

  const groupMessagesByDate = (messages) => {
    return messages.reduce((acc, message) => {
      const dateKey = formatDate(message.createdAt);
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(message);
      return acc;
    }, {});
  };

  const handleUserClick = (id, fullname) => {
    setIsChat(true)
    setTopName(fullname)
    dispatch(setSelectedUserId(id));
    dispatch(fetchMessages(id));
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });

  // format time like: 14:08

  const formatTime = (dateStr) =>
    new Date(dateStr).toLocaleTimeString('en-GB', {
      hour: '2-digit', minute: '2-digit'
    });

  const handleSend = async () => {
    if (inputText.trim() !== "" && selectedUserId) {
      try {
        await dispatch(sendMessage({ id: selectedUserId, text: inputText }));

        // ✅ After sending, re-fetch all messages
        dispatch(fetchMessages(selectedUserId));

        // ✅ Optionally emit via socket for real-time sync
        socket.emit("send-message", { to: selectedUserId, text: inputText });

        // Clear input
        setInputText("");
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  };

  const sendFriendRequest = async (id) => {
    try {
      const data = {
        toUserId: id
      }
      const res = await dispatch(sendFriendrReq(data));
      setShowAddFriendPopup(false)
      console.log(res.payload);

    } catch (err) {
      setShowAddFriendPopup(false)
      if (err.response && err.response.status >= 400 && err.response.status <= 500) {
        setError(err.response.data.message);
      }
    }
  }

  const accptFriendRequest = async (id) => {
    try {
      const data = {
        fromUserId: id
      }
      const res = await dispatch(accptFriendrReq(data));
      setShowAddFriendPopup(false)
      console.log(res.payload);
    } catch (err) {
      setShowAddFriendPopup(false)
      if (err.response && err.response.status >= 400 && err.response.status <= 500) {
        setError(err.response.data.message);
      }
    }
  }
  const declineFriendRequest = async (id) => {
    try {
      const data = {
        fromUserId: id
      }
      const res = await dispatch(declineFriendrReq(data));
      setShowAddFriendPopup(false)
      console.log(res.payload);
    } catch (err) {
      setShowAddFriendPopup(false)
      if (err.response && err.response.status >= 400 && err.response.status <= 500) {
        setError(err.response.data.message);
      }
    }
  }

  if (loading) return <div className='text-white'>Loading...</div>;
  if (!user) return null;
  return (
    <div className="h-full w-full bg-gray-900">
      {/* NAVBAR */}
      <div className='w-[100%] h-[5vh] bg-gray-950 px-3 py-1 flex items-center justify-between border-1 border-white/10'>
        <div className='text-purple-300 font-bold text-2xl' >GGComms</div>
        <div className='text-purple-200'>EvilAdi's Server </div>
        <div>
          <div className='text-purple-400 cursor-pointer' onClick={() => setShowRequestsPopup(true)}>
            Friend Requests
          </div>
          {showRequestsPopup && (
            <div ref={requestRef} className="absolute bg-gray-800 text-white p-4 rounded-lg top-7 right-10 z-50 shadow-lg">
              <div className="">
                {requests.map((req) => (
                  <div key={req._id} className="flex justify-between items-center border-l p-1 my-0.5">
                    <span>{req.fullname}</span>
                    <div className="flex gap-2">
                      <button className="text-green-400 hover:text-green-600 pl-4 cursor-pointer" onClick={()=>accptFriendRequest(req._id)}>Accept</button>
                      <button className="text-red-400 hover:text-red-600 cursor-pointer " onClick={()=>declineFriendRequest(req._id)}>Decline</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className='flex flex-cols max-w-full h-full'>
        <div className="h-full w-15 ">
          {/* SIDEBAR */}
          <div className='h-[95vh] bg-gray-950 border-1 border-white/10'>
            <div className='flex flex-col items-center'>
              <img src="./friend2.svg" alt="" className={`mt-2 w-12 p-2 cursor-pointer border-1 border-white/20 rounded-2xl hover:w-13  `} onClick={() => setIsServer(false)} />
              <img src="./GGcoms.svg" alt="" className='mt-2 w-12 p-1 cursor-pointer border-1 border-white/20 rounded-2xl hover:w-13' onClick={() => setIsServer(true)} />
              <img src="./GGcoms.svg" alt="" className='mt-2 w-12 p-1 cursor-pointer border-1 border-white/20 rounded-2xl hover:w-13' onClick={() => setIsServer(true)} />
              <img src="./GGcoms.svg" alt="" className='mt-2 w-12 p-1 cursor-pointer border-1 border-white/20 rounded-2xl hover:w-13' onClick={() => setIsServer(true)} />
              <img src="./add.svg" alt="" className='mt-2 w-12 p-1 cursor-pointer border-1 border-white/20 rounded-2xl hover:w-13' onClick={() => setIsServer(true)} />
            </div>


          </div>
        </div>
        <div className="w-full">
          <div className='bg-gray-900 text-blue-400 w-[100%] h-[95vh] '>
            <div className='flex flex-cols h-full justify-between '>
              <div className='  sm:w-70  pt-1 pl-1 pb-2 '>
                <div className='border bg-gray-950/60 border-white/10 h-full rounded-tl-xl rounded-bl-xl'>
                  <div className='bg-gray-950 text-purple-200 px-3 py-1 flex flex-cols justify-between rounded-tl-xl h-[5%]'>
                    <div className='py-0.5  overflow-hidden '>{user.fullname}</div>
                    <div>
                      <img className='py-0.5' src="./down_arrow.svg" alt="" />
                    </div>
                  </div>
                  {
                    isServer ? (
                      <div className='p-2 '>
                        <div className='pt-1'>
                          <div className='flex flex-row text-gray-100'>
                            Text Channels <span className='relative left-15'><img className='w-5 my-0.5' src="./add2.svg" alt="" /></span>
                          </div>
                          <div className='  text-gray-200 '>
                            <h2 className='hover:bg-gray-600 cursor-pointer pl-2 p-0.5 hover:rounded-2xl flex flex-row'><span>
                              <img className='w-3 mt-1.5 mr-1' src="./hash.svg" alt="" /></span>general</h2>
                            <h2 className='hover:bg-gray-600 cursor-pointer pl-2 p-0.5 hover:rounded-2xl flex flex-row' ><span>
                              <img className='w-3 mt-1.5 mr-1' src="./hash.svg" alt="" /></span>just-chatting</h2>
                          </div>
                        </div>
                        <div className='py-2'>
                          <div className='flex flex-row text-gray-100 '>Voice Channels <span className='relative left-13 cursor-pointer'><img className='w-5 my-0.5' src="./add2.svg" alt="" /></span></div>
                          <div className='  text-gray-200 '>
                            <h2 className='hover:bg-gray-600 cursor-pointer pl-2 p-0.5 hover:rounded-2xl flex flex-row'><span>
                              <img className='w-4 mt-1.5 mr-1' src="./speaker.svg" alt="" /></span>general</h2>
                            <h2 className='hover:bg-gray-600 cursor-pointer pl-2 p-0.5 hover:rounded-2xl flex flex-row' ><span>
                              <img className='w-4 mt-1.5 mr-1' src="./speaker.svg" alt="" /></span>just-chatting</h2>
                          </div>
                        </div>
                      </div>
                    )
                      : (
                        <div className='p-2 '>
                          <div className='pt-1'>
                            <div className='flex flex-row text-gray-100 mb-2'>
                              <span className=''><img className='w-6 my-0.5 mx-2' src="./friend.svg" alt="" /></span>Friends
                            </div>
                            <div className='  text-gray-200 '>
                              {friends && friends.map((u) => (
                                <h2 key={u._id}
                                  onClick={() => handleUserClick(u._id, u.fullname)}
                                  className='hover:bg-gray-600 cursor-pointer pl-4 p-1 hover:rounded-2xl flex flex-row'>
                                  {u.fullname}
                                </h2>
                              ))}
                            </div>
                            <div className='flex flex-row text-gray-100 bg-gray-200/20 rounded-3xl my-2 mb-2 p-1 cursor-pointer hover:bg-black' onClick={() => setShowAddFriendPopup(true)}>
                              <span className=''><img className='w-6 mx-2' src="./add2.svg" alt="" /></span>Add Friends
                            </div>
                            {showAddFriendPopup && (
                              <div ref={addFriendRef} className="absolute bg-gray-800 text-white p-4 rounded-lg top-20 left-10 z-50 shadow-lg">
                                <input
                                  type="text"
                                  placeholder="Search by name..."
                                  className="px-2 py-1 mb-2 w-full rounded bg-gray-700 focus:outline-none"
                                  value={searchText}
                                  onChange={(e) => setSearchText(e.target.value)}
                                />

                                <div className="mt-2">
                                  {searchResults.map((res) => (
                                    <div key={res._id} className="flex justify-between items-center border-b py-1">
                                      <span>{res.fullname}</span>
                                      <button onClick={() => sendFriendRequest(res._id)} className="text-green-400 hover:text-red-600 cursor-pointer">+ Add</button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                          </div>
                        </div>
                      )
                  }

                </div>
              </div>
              <div className='sm:w-full  pt-1 pr-2 pb-2' >
                <div className='border border-white/10 h-full rounded-tr-xl rounded-br-xl'>
                  <div className='bg-gray-950 text-purple-200 px-3 py-1 flex flex-row justify-between rounded-tr-xl h-[5%]'>
                    <div className='' >
                      {topName}
                    </div>
                    <div>
                      {!isServer ? (
                        <div></div>
                      ) : (<img className='w-8 cursor-pointer p-1 hover:bg-gray-600 hover:rounded' src="./member.svg" alt="" />)}
                    </div>
                  </div>
                  <div className='flex flex-cols justify-between h-[95%] '>
                    <div className='border-r w-full border-white/20 ' >
                      {isServer ? (
                        <div></div>
                      ) : (
                        <div className='h-[95%]'>
                          {isChat ? (
                            <div className=' h-[100%] '>
                              <div className='text-white px-4 py-2 h-[94%] overflow-y-scroll ' style={{
                                overflowY: "scroll",
                                scrollbarWidth: "thin",
                                scrollbarColor: "#3333ea #1a2337",
                              }}>
                                {messages && Object.entries(groupMessagesByDate(messages)).map(([date, msgs]) => (
                                  <div key={date}>

                                    <div className="text-center text-gray-400 text-xs my-2">{date}</div>

                                    {msgs.map((msg, idx) => {
                                      const isMe = msg.senderId === user._id;
                                      return (<MessageBox msg={msg} idx={idx} isMe={isMe} />);
                                    })}
                                  </div>
                                ))}
                              </div>
                              <div className='relative top-[1%]' >
                                <div className='flex flex-row bg-gray-700 text-white rounded-lg mx-[2%]'>
                                  <span className='pl-1'>
                                    <img className='w-10 my-2 cursor-pointer hover:bg-gray-600 hover:rounded' src="./attach.svg" alt="" />
                                  </span>
                                  <input className=' w-[75%] flex-grow  px-3 py-1  focus:outline-none ' type="text" placeholder='Type a message...' value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()} />
                                  <button className=' cursor-pointer hover:bg-gray-800 rounded-lg px-3' onClick={handleSend}>
                                    <img src="./send_icon.svg" alt="Send" className='w-10 h-10' />
                                  </button>
                                </div>

                              </div>
                            </div>
                          ) : (
                            <div className='text-center my-10'>Select the user you want to chat With</div>
                          )}
                        </div>
                      )}
                    </div>
                    {isServer && <div className='sm:w-70 p-2 bg-gray-950/60 rounded-br-xl'>
                      <div className='flex flex-row text-gray-500'>
                        <h1 >Online Members-</h1>
                      </div>
                      <div className='flex flex-row text-gray-500 '>
                        <h1>Offline members-</h1>
                      </div>
                    </div>}

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

  )
}

export default Home