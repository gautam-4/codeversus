"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Swords, X, Copy } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchProblemList } from '@/utils/githubProblemFetcher';
import { auth, db } from '@/firebaseConfig'; // Import Firebase auth and Firestore
import { collection, doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';

const ContestPage = () => {
  const router = useRouter();
  const [isSearching, setIsSearching] = useState(false);
  const [problemList, setProblemList] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');

  useEffect(() => {
    const loadProblemList = async () => {
      try {
        const problems = await fetchProblemList();
        setProblemList(problems);
      } catch (error) {
        console.error("Error fetching problem list:", error);
        toast.error("Failed to load problems. Please try again later.");
      }
    };

    loadProblemList();
  }, []);

  const handleCreateRoom = () => {
    setShowPopup(true);
  };

  const handle1v1Battle = () => {
    if (!auth.currentUser) {
      toast.warning("Please log in to participate");
      return;
    }

    if (problemList.length === 0) {
      toast.error("No problems available. Please try again later.");
      return;
    }

    const randomProblem = problemList[Math.floor(Math.random() * problemList.length)];

    router.push(`/contest/1v1-battle/${randomProblem.id}`);
  };

  const handleJoinRoom = async () => {
    if (roomCode.trim() === '') {
      toast.error("Please enter a room code");
      return;
    }

    try {
      const roomRef = doc(db, 'rooms', roomCode);
      const roomSnapshot = await getDoc(roomRef);

      if (!roomSnapshot.exists()) {
        toast.error("Room code not found");
        return;
      }

      if (!auth.currentUser) {
        toast.warning("Please log in to join the room");
        return;
      }

      const userId = auth.currentUser.uid;

      await updateDoc(roomRef, {
        users: arrayUnion({
          uid: auth.currentUser.uid,
          displayName: auth.currentUser.displayName || "Unknown User"
        }),
      });

      //toast.success("Joined the room successfully");

      router.push(`/contest/room/${roomCode}`);
    } catch (error) {
      console.error('Error joining room:', error);
      toast.error("Failed to join the room. Please try again.");
    }
  };

  const handleCreateNewRoom = async () => {
    const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setGeneratedCode(newCode);

    try {
      if (!auth.currentUser) {
        toast.warning("Please log in to create a room");
        return;
      }

      await setDoc(doc(db, 'rooms', newCode), {
        roomCode: newCode,
        users: [{
          uid: auth.currentUser.uid,
          displayName: auth.currentUser.displayName || "Unknown User"
        }],
        createdBy: auth.currentUser.uid,
        createdAt: new Date(),
      });

      //toast.success(`Room created with code: ${newCode}`);
      router.push(`/contest/room/${newCode}`);
    } catch (error) {
      console.error('Error creating room:', error);
      toast.error('Failed to create room. Please try again.');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode).then(() => {
      toast.success("Copied to clipboard!");
    }, (err) => {
      console.error('Could not copy text: ', err);
      toast.error("Failed to copy room code");
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <h1 className="text-4xl font-bold my-12 text-[#DEA03C]">Contest Mode</h1>
      <div className="flex flex-col sm:flex-row gap-8">
        <button
          onClick={handleCreateRoom}
          className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white font-bold py-6 px-8 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex flex-col items-center"
        >
          <Users size={48} className="mb-4 text-[#DEA03C]" />
          <span className="text-xl">Join Room</span>
        </button>
        <button
          onClick={handle1v1Battle}
          className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white font-bold py-6 px-8 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex flex-col items-center"
        >
          <Swords size={48} className="mb-4 text-[#DEA03C]" />
          <span className="text-xl">1v1 Battle</span>
        </button>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-[#1a1a1a] p-8 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#DEA03C]">Create or Join Room</h2>
              <button onClick={() => setShowPopup(false)} className="text-gray-500 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <div className="flex mb-4">
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                placeholder="Enter room code"
                className="flex-grow px-3 py-2 bg-[#2a2a2a] text-white rounded-l-lg focus:outline-none"
              />
              <button
                onClick={handleJoinRoom}
                className="bg-[#DEA03C] text-black px-4 py-2 rounded-r-lg hover:bg-[#c78f35] transition duration-300"
              >
                Join
              </button>
            </div>
            <button
              onClick={handleCreateNewRoom}
              className="w-full bg-[#DEA03C] text-black px-4 py-2 rounded-lg hover:bg-[#c78f35] transition duration-300 mb-4"
            >
              Create New Room
            </button>
            {generatedCode && (
              <div className="flex items-center justify-between bg-[#2a2a2a] p-2 rounded-lg">
                <span className="text-white">{generatedCode}</span>
                <button onClick={copyToClipboard} className="text-[#DEA03C] hover:text-white transition duration-300">
                  <Copy size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContestPage;
