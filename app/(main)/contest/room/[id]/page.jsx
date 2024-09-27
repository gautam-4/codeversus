"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/firebaseConfig';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchProblemList } from '@/utils/githubProblemFetcher';

const ContestRoomPage = ({ params }) => {
  const router = useRouter();
  const [participants, setParticipants] = useState([]);
  const [isCreator, setIsCreator] = useState(false);
  const [roomStatus, setRoomStatus] = useState('waiting');
  const [problemList, setProblemList] = useState([]);

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

  useEffect(() => {
    if (!auth.currentUser) {
      toast.error("Please log in to view this room");
      router.push('/');
      return;
    }

    const roomRef = doc(db, "rooms", params.id);
    
    const unsubscribe = onSnapshot(roomRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const roomData = docSnapshot.data();
        setIsCreator(roomData.createdBy === auth.currentUser.uid);
        setRoomStatus(roomData.status || 'waiting');

        // Set participants directly from the room data
        setParticipants(roomData.users || []);
      } else {
        toast.error("Room not found");
        router.push('/contest');
      }
    });

    return () => unsubscribe();
  }, [params.id, router]);

  const handleStartContest = async () => {
    if (!isCreator) {
      toast.error("Only the room creator can start the contest");
      return;
    }

    try {
      const roomRef = doc(db, "rooms", params.id);
      await updateDoc(roomRef, {
        status: "in-progress",
        startedAt: new Date(),
      });
      //toast.success("Contest started!");

      const randomProblem = problemList[Math.floor(Math.random() * problemList.length)];

      router.push(`/contest/room/${params.id}/${randomProblem.id}`);
    } catch (error) {
      console.error("Error starting contest:", error);
      toast.error("Failed to start contest. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-8">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      
      <h1 className="text-4xl font-bold mb-8 text-[#DEA03C]">Contest Room: {params.id}</h1>
      
      <div className="bg-[#1a1a1a] p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4 text-white">Participants:</h2>
        
        <ul className="space-y-2 mb-8">
          {participants.length > 0 ? (
            participants.map((participant) => (
              <li key={participant.uid} className="text-white">
                {participant.displayName || "Unknown User"}
              </li>
            ))
          ) : (
            <li className="text-white">No participants yet.</li>
          )}
        </ul>
        
        {isCreator && roomStatus === 'waiting' && (
          <button
            onClick={handleStartContest}
            className="w-full bg-[#DEA03C] text-black px-4 py-2 rounded-lg hover:bg-[#c78f35] transition duration-300"
          >
            Start Contest
          </button>
        )}

        {!isCreator && roomStatus === 'waiting' && (
          <p className="text-white text-center">Waiting for the room creator to start the contest...</p>
        )}
        
        {roomStatus === 'in-progress' && (
          <p className="text-white text-center">Contest is in progress!</p>
        )}
      </div>
    </div>
  );
};

export default ContestRoomPage;