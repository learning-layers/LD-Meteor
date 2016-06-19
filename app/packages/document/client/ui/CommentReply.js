import React, {Component} from 'react'
import ButtonToolbar from '../../../../../node_modules/react-bootstrap/lib/ButtonToolbar'
import Button from '../../../../../node_modules/react-bootstrap/lib/Button'

class CommentReply extends Component {
  constructor (props) {
    super(props)
    this.closeReply.bind(this)
    this.componentDidMount.bind(this)
    this.componentWillUnmount.bind(this)
  }
  componentDidMount () {
    this.replyOpenedSubscription = global.emitter.addListener('reply-opened', () => { this.closeReply() })
  }
  componentWillUnmount () {
    if (this.replyOpenedSubscription) {
      this.replyOpenedSubscription.remove()
    }
  }
  submitReply () {
    window.alert('submit reply')
  }
  closeReply () {
    this.props.closeReply()
  }
  render () {
    return <div>
      <div className='reply-wrapper'>
        <input className='form-control' placeholder='reply' />
        <ButtonToolbar className='options-bar'>
          <Button bsStyle='success' bsSize='small' onClick={() => this.submitReply()}>Submit Reply</Button>
          <Button bsSize='small' onClick={() => this.closeReply()}>Close</Button>
        </ButtonToolbar>
        <div className='clearfix'></div>
      </div>
      <hr className='no-margin-top' />
    </div>
  }
}

export default CommentReply
