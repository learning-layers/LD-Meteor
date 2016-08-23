import React, {Component} from 'react'

class HistoryArea extends Component {
  render () {
    return <div id='history'>
      <ul className='timeline'>
        <li key={'tl-item-1'} className='tl-item'>
          <div className='content'>
            <div className='lbl'>Test</div>
            <span className='date'>12 May 2013</span>
            <span className='circle'></span>
          </div>
          <div className='placeholder'></div>
        </li>
        <li key={'tl-item-2'} className='tl-item'>
          <div className='content'>
            <div className='lbl'>Test2</div>
            <span className='date'>12 May 2013</span>
            <span className='circle'></span>
          </div>
          <div className='placeholder'></div>
        </li>
      </ul>
    </div>
  }
}

export default HistoryArea
