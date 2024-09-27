import { Users, Crosshair, Trophy } from 'lucide-react';
import CornerSVG from './cornersvg';
import Link from 'next/link';

const FeatureBox = ({ icon: Icon, text }) => (
  <div className="flex flex-col items-center justify-between p-5 border rounded-lg border-white w-full h-40">
    <div className="w-20 h-20 rounded-full border border-gray-600 flex items-center justify-center mb-2">
      <Icon className="text-[#DEA03C]" size={24} />
    </div>
    <p className="text-center text-gray-300">{text}</p>
  </div>
);

const About = () => {
  return (
    <div className="w-full px-4 md:px-12 relative">
      <div className='flex flex-col justify-center items-center mt-5 absolute left-3 sm:left-11 top-12'>
        <div className='w-5 h-5 rounded-full bg-[#DEA03C]' />
        <div className='w-1 sm:h-80 h-40 black-white-gradient' />
      </div>
      <div className="flex flex-col md:flex-row items-start justify-between mb-12">
        <div className="max-w-2xl text-left mb-6 md:mb-0">
          <h1 className="text-2xl md:text-5xl font-bold mb-6 text-white">
            Code. Compete. Conquer.
          </h1>
          <p className="text-sm md:text-xl text-gray-300 leading-relaxed ml-12">
            We are the next generation of competitive programming platforms,
            bridging the gap between learning and mastery.
          </p>
        </div>
        <div className="flex items-center justify-center border rounded-lg border-white p-8 mr-10">
          <div className="flex items-center justify-center mr-4">
            <span className="text-[#DEA03C] font-bold text-xl">1</span>
          </div>
          <p className="text-white text-lg">Users</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-10">
        <Link href='/roadmap'>
          <FeatureBox icon={Users} text="Personalized Roadmap" />
        </Link>
        <Link href='/contest'>
          <FeatureBox icon={Crosshair} text="1v1 Battles" />
        </Link>
        <Link href='/contest'>
          <FeatureBox icon={Trophy} text="Contest Rooms" />
        </Link>
      </div>
      <CornerSVG />
    </div>
  );
};

export default About;