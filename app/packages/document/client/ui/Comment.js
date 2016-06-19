import React, {Component} from 'react'
import Image from '../../../../../node_modules/react-bootstrap/lib/Image'
import ButtonToolbar from '../../../../../node_modules/react-bootstrap/lib/ButtonToolbar'
import Button from '../../../../../node_modules/react-bootstrap/lib/Button'
import { moment } from 'meteor/momentjs:moment'

class Comment extends Component {
  constructor (props) {
    super(props)
    this.state = {
      replyActive: false
    }
  }
  handleReplyClick () {
    this.setState({
      replyActive: true
    })
  }
  submitReply () {
    window.alert('submit reply')
  }
  closeReply () {
    this.setState({
      replyActive: false
    })
  }
  render () {
    return <div className='comment-wrapper'>
      <div className='comment'>
        <div className='avatar-img-wrapper'>
          <Image src='https://randomuser.me/api/portraits/men/20.jpg' />
        </div>
        <div className='comment-content-wrapper'>
          <h4>Test User</h4>
          <div className='datetime'>
            {moment.max(moment(new Date()).fromNow())}
          </div>
          <div className='content-text'>
            Poutine cray quinoa street art meh. Readymade fashion axe artisan, franzen bushwick lo-fi dreamcatcher aesthetic 3 wolf moon celiac tilde venmo. Cred 8-bit cold-pressed, twee kombucha listicle normcore small batch aesthetic artisan. Heirloom semiotics blog cornhole normcore. Thundercats banjo chartreuse pork belly, poutine williamsburg pabst etsy salvia venmo cornhole cray flexitarian. Brunch aesthetic offal cornhole gluten-free gentrify butcher, selfies chicharrones actually fashion axe art party bespoke chillwave. Chartreuse cronut gastropub mixtape, bicycle rights authentic bespoke messenger bag intelligentsia.
          </div>
          {this.state.replyActive ? null : <ButtonToolbar className='options-bar'>
            <Button bsSize='small' onClick={() => this.handleReplyClick()}>Reply</Button>
          </ButtonToolbar>}
        </div>
        <hr />
      </div>
      {this.state.replyActive ? <div className='reply-wrapper'>
        <input className='form-control' placeholder='reply' />
        <ButtonToolbar className='options-bar'>
          <Button bsSize='small' onClick={() => this.closeReply()}>Close</Button>
          <Button bsStyle='success' bsSize='small' onClick={() => this.submitReply()}>Submit Reply</Button>
        </ButtonToolbar>
        <hr />
      </div> : null}
    </div>
  }
}

export default Comment
