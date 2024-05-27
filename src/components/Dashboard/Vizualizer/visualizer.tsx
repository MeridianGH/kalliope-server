import React from 'react'
import './visualizer.scss'

type VisualizerProps = {
  style: 'white' | 'gradient',
  paused?: boolean
} | {
  style: 'color',
  color: string,
  paused?: boolean
}

export function Visualizer(props: VisualizerProps) {
  const playState = props.paused ? 'paused' : 'running'
  const background = props.style === 'white' ?
    'white' :
    props.style === 'gradient' ?
      'linear-gradient(to top, var(--accent), var(--accent-alt))' :
      props.style === 'color' ? props.color : 'white'
  return (
    <div className={`visualizer ${props.style}`}>
      <div style={{ animationDelay: '-0.85s', animationPlayState: playState, background: background }} className={'visualizer-bar'}/>
      <div style={{ animationDelay: '-1s', animationPlayState: playState, background: background }} className={'visualizer-bar'}/>
      <div style={{ animationDelay: '-0.6s', animationPlayState: playState, background: background }} className={'visualizer-bar'}/>
      <div style={{ animationDelay: '-0.75s', animationPlayState: playState, background: background }} className={'visualizer-bar'}/>
    </div>
  )
}
