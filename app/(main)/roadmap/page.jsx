'use client'

import React from 'react';
import { Clock, Book, Youtube } from 'lucide-react';
import NextChallenges from '@/components/NextChallenge';

// Simulated user data
const userData = {
  totalSolved: 120,
  topicProgress: [
    { name: 'Arrays', solved: 30, total: 50 },
    { name: 'Two Pointers', solved: 15, total: 20 },
    { name: 'Stack', solved: 10, total: 15 },
    { name: 'Trees', solved: 20, total: 40 },
    { name: 'Graphs', solved: 5, total: 30 },
  ],
  nextTopic: 'Binary Search',
};

const suggestedProblems = [
  { name: "Find Minimum in Rotated Sorted Array", difficulty: "Medium", topic: "Binary Search" },
  { name: "Search in Rotated Sorted Array", difficulty: "Hard", topic: "Binary Search" },
  { name: "Implement Binary Search", difficulty: "Easy", topic: "Binary Search" },
];

const BarChart = ({ data }) => (
  <div className="flex flex-col space-y-2">
    {data.map((item, index) => (
      <div key={index} className="flex items-center">
        <div className="w-24 text-sm">{item.name}</div>
        <div className="flex-1 bg-gray-700 h-6 rounded-full overflow-hidden">
          <div
            className="bg-[#DEA03C] h-full rounded-full"
            style={{ width: `${(item.solved / item.total) * 100}%` }}
          ></div>
        </div>
        <div className="w-24 text-sm text-right">{item.solved}/{item.total}</div>
      </div>
    ))}
  </div>
);

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-8">
      {/* <h1 className="text-3xl font-bold mb-8 text-[#DEA03C]">Your DSA Roadmap</h1> */}

      {/* Progress Overview */}
      <div className="bg-[#1a1a1a] rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Progress Overview</h2>
        <p className="text-xl mb-4">Total Problems Solved: <span className="text-[#DEA03C] font-bold">{userData.totalSolved}</span></p>
        <BarChart data={userData.topicProgress} />
      </div>

      {/* Next Challenges */}
      {/* <div className="bg-[#1a1a1a] rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Next Challenges</h2>
        <p className="mb-4">Based on your progress, we recommend focusing on: <span className="text-[#DEA03C] font-bold">{userData.nextTopic}</span></p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suggestedProblems.map((problem, index) => (
            <div key={index} className="bg-[#272727] p-4 rounded-lg">
              <h3 className="font-semibold mb-2">{problem.name}</h3>
              <p>Difficulty: <span className="text-red-500">{problem.difficulty}</span></p>
              <p>Topic: {problem.topic}</p>
            </div>
          ))}
        </div>
      </div> */}

      <NextChallenges userData={userData} suggestedProblems={suggestedProblems} />

      {/* Start a New Topic */}
      <div className="bg-[#1a1a1a] rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Start a New Topic</h2>
        <p className="mb-4">Ready to explore {userData.nextTopic}? Here are some resources to get you started:</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#272727] p-4 rounded-lg flex items-center">
            <Book className="mr-2 text-[#DEA03C]" />
            <span>Introduction to Heaps</span>
          </div>
          <div className="bg-[#272727] p-4 rounded-lg flex items-center">
            <Youtube className="mr-2 text-[#DEA03C]" />
            <span>Heap Implementation Tutorial</span>
          </div>
          <div className="bg-[#272727] p-4 rounded-lg flex items-center">
            <Book className="mr-2 text-[#DEA03C]" />
            <span>Priority Queue Problems</span>
          </div>
        </div>
      </div>

      {/* Create Study Plan */}
      <div className="bg-[#1a1a1a] rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Create Your Study Plan</h2>
        <p className="mb-4">Set your learning goals and we'll create a personalized study plan for you.</p>
        <div className="flex flex-col md:flex-row items-end space-y-4 md:space-y-0 md:space-x-4">
          <div className="w-full md:w-1/3">
            <label className="block mb-2">Questions per day</label>
            <input type="number" className="w-full bg-[#272727] rounded px-3 py-2" placeholder="No. of problems" />
          </div>
          <div className="w-full md:w-1/3">
            <label className="block mb-2">Target completion date</label>
            <input type="date" className="w-full bg-[#272727] rounded px-3 py-2" />
          </div>
          <button className="w-full md:w-auto bg-[#DEA03C] text-[#0f0f0f] px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition duration-300">
            Commit
          </button>
        </div>
      </div>
    </div>
  );
}