import React from 'react'
import { useLocation } from 'react-router-dom'
import '../../styles/common/ProgressIndicator.css'

const ProgressIndicator = () => {
  const location = useLocation()
  
  // Define the three main stages with their routes
  const stages = [
    {
      id: 'thinking',
      title: 'How AI Thinks',
      icon: '🧩',
      routes: ['/puzzle/first', '/puzzle/second']
    },
    {
      id: 'scenario1',
      title: 'Scenario 1',
      icon: '📖',
      routes: ['/first_scenario/talk', '/first_scenario/memory', '/first_scenario/result']
    },
    {
      id: 'scenario2',
      title: 'Scenario 2',
      icon: '🏫',
      routes: ['/second_scenario/talk', '/second_scenario/puzzle', '/second_scenario/memory', '/second_scenario/result']
    }
  ]

  // Don't show on final message
  if (location.pathname === '/final_screen') {
    return null
  }

  // Determine which stage is active
  const getStageStatus = (stage) => {
    if (stage.routes.includes(location.pathname)) {
      return 'active'
    }
    
    // Check if this stage is completed (current route is after this stage)
    const currentStageIndex = stages.findIndex(s => s.routes.includes(location.pathname))
    const stageIndex = stages.findIndex(s => s.id === stage.id)
    
    if (currentStageIndex > stageIndex) {
      return 'completed'
    }
    
    return 'upcoming'
  }

  return (
    <div className="progress-indicator">
      {stages.map((stage, index) => (
        <React.Fragment key={stage.id}>
          <div className={`progress-stage ${getStageStatus(stage)}`}>
            <div className="progress-icon">{stage.icon}</div>
            <div className="progress-title">{stage.title}</div>
          </div>
          {index < stages.length - 1 && (
            <div className={`progress-connector ${getStageStatus(stages[index + 1]) === 'active' || getStageStatus(stages[index + 1]) === 'completed' ? 'active' : ''}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

export default ProgressIndicator
