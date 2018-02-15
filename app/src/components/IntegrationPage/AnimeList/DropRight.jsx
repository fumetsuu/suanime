import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'

export default class DropRight extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selected: props.value,
            isOpen: false
        }
        this.mounted = true
        this.handleDocumentClick = this.handleDocumentClick.bind(this)
        this.fireChangeEvent = this.fireChangeEvent.bind(this)
    }
    
    componentDidMount() {
        document.addEventListener('click', this.handleDocumentClick, false)
    }

    componentWillUnmount() {
        this.mounted = false
        document.removeEventListener('click', this.handleDocumentClick, false)
    }

    handleMouseDown(event) {
        if (event.type === 'mousedown' && event.button !== 0) return
        event.stopPropagation()
        event.preventDefault()
        this.setState({
            isOpen: !this.state.isOpen
        })
    }

    setValue (value, label) {
        let newState = { isOpen: true, selected: { value, label } }
        this.fireChangeEvent(newState)
        this.setState(newState)
      }
    
      fireChangeEvent (newState) {
          this.props.onChange(newState.selected)
      }

      renderOption (option) {
        console.log(option, this.state.selected)
        var selected = option.value == this.state.selected.value

        let className = "DropRight-option"

        if(selected) {
            className = "DropRight-option DropRight-selected"
        }

        let value = option.value
        let label = option.label
    
        return (
          <div
            key={value}
            className={className}
            onClick={this.setValue.bind(this, value, label)}>
            {label}
          </div>
        )
      }
    
      buildMenu () {
        let { options } = this.props
        let ops = options.map((option) => {
            return this.renderOption(option)
        })
        return ops
      }

      handleDocumentClick (event) {
        if (this.mounted) {
          if (!ReactDOM.findDOMNode(this).contains(event.target)) {
            if (this.state.isOpen) {
              this.setState({ isOpen: false })
            }
          }
        }
      }
    
      render () {
        const { className, placeholder } = this.props

        let titletext = (<div className={`DropRight-placeholder`}>{this.state.selected.label}</div>)
        let menu = this.state.isOpen ? <div className={`DropRight-menu`}>{this.buildMenu()}</div> : null
    
        let droprightClass = classNames({
          [className]: true,
          [`DropRight-root`]: true,
          'is-open': this.state.isOpen
        })
    
        return (
          <div className={droprightClass}>
            <div className={`DropRight-control`} onMouseDown={this.handleMouseDown.bind(this)}>
              {titletext}
            </div>
            {menu}
          </div>
        )
      }
}
