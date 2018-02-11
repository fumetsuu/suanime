import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'

export default class GenreSearch extends Component {
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
        let newState = { isOpen: true }
        if(value==="default") {
            newState = {
                selected: this.props.value
            }
        } else {
            if(!Array.isArray(this.state.selected)) {
                newState.selected = [{value, label}]
            } else {
                if(this.state.selected.find(el => value == el.value)) {
                    newState = {
                        selected: this.state.selected.filter(el => value != el.value)
                      }
                } else {
                    newState = {
                        selected: [...this.state.selected, {
                          value,
                          label
                        }]
                      }
                }
            }
        }
        if(!newState.selected.length) {
            newState.selected = this.props.value
        }
        this.fireChangeEvent(newState)
        this.setState(newState)
      }
    
      fireChangeEvent (newState) {
          this.props.onChange(newState.selected)
      }

      renderOption (option) {

        var selected = false
        
        if(Array.isArray(this.state.selected)) {
            selected = this.state.selected.find(el => {
                return el.value == option.value
            })
        } else {
            if(option.value === "default") {
                selected = true
            }
        }
        


        let className = "Dropdown-option-genre"

        if(selected) {
            className = "Dropdown-option-genre genre-selected"
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

        let titletext = (<div className={`Dropdown-placeholder`}>{(this.state.selected.value && this.state.selected.value == "default") ? placeholder : 'FILTERED'}</div>)
        let menu = this.state.isOpen ? <div className={`Dropdown-menu genre-menu`}>{this.buildMenu()}</div> : null
    
        let dropdownClass = classNames({
          [className]: true,
          [`Dropdown-root`]: true,
          'is-open': this.state.isOpen
        })
    
        return (
          <div className={dropdownClass}>
            <div className={`Dropdown-control`} onMouseDown={this.handleMouseDown.bind(this)}>
              {titletext}
            </div>
            {menu}
          </div>
        )
      }
}
