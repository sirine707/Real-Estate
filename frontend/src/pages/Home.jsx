import React, { useState } from 'react'
import Hero from '../components/Hero'
import Companies from '../components/Companies'
import Features from '../components/Features'
import Properties from '../components/propertiesshow'
import Steps from '../components/Steps'
import Testimonials from '../components/testimonial'
import Blog from '../components/Blog'
import ChatbotIcon from '../components/ChatbotIcon'
import ChatDialog from '../components/ChatDialog'

const Home = () => {
  const [isChatOpen, setIsChatOpen] = useState(false)

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen)
  }

  const openChat = () => {
    setIsChatOpen(true);
  }

  return (
    <div>
      <Hero onEmiratEstateGPTClick={openChat} /> {/* Passed openChat to Hero */}
      <Companies />
      <Features />
      <Properties />
      <Steps />
      <Testimonials />
      <Blog />

      <ChatbotIcon onClick={toggleChat} />
      <ChatDialog isOpen={isChatOpen} onClose={toggleChat} />
    </div>
  )
}

export default Home
