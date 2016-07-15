export default (props = {}) => ({
  root: {
    pointerEvents: 'none',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden'
  },
  sidebar: {
    pointerEvents: 'auto',
    backgroundColor: 'white',
    zIndex: 2,
    position: 'fixed',
    top: 0,
    bottom: 0,
    transition: 'transform .3s ease-out',
    WebkitTransition: '-webkit-transform .3s ease-out',
    willChange: 'transform',
    overflowY: 'auto'// ,
    // width: 305
  },
  content: {
    pointerEvents: 'none',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'auto',
    transition: 'left .3s ease-out, right .3s ease-out'
  },
  overlay: {
    pointerEvents: 'none',
    zIndex: 1,
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
    visibility: 'hidden',
    transition: 'opacity .3s ease-out',
    backgroundColor: 'transparent' // 'rgba(0,0,0,.3)'
  },
  dragHandle: {
    backgroundColor: 'transparent',
    pointerEvents: 'auto',
    zIndex: 1,
    position: 'fixed',
    top: 0,
    bottom: 0
  }
})
